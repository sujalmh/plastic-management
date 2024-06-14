from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from app.models import User, Buyer, Retailer, Manufacturer, Recycler, UserRoleRequest, Plastic, PlasticRetailer, PlasticBuyer
import secrets
from datetime import datetime, timedelta, timezone
from dateutil import parser

app.config['JWT_SECRET_KEY'] = 'your_secret_key'
jwt = JWTManager(app)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('firstname')
    last_name = data.get('lastname')
    contact_no = data.get('contact')
    gender = data.get('gender')
    address = data.get('address')
    dob_str = data.get('dob')


    if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
        return jsonify({'message': 'Username or email already exists'}), 400
    
    try:
        dob = parser.parse(dob_str).date()
    except (ValueError, TypeError):
        return jsonify({'message': 'Invalid date of birth format'}), 400

    hashed_password = generate_password_hash(password, method='scrypt')
    
    new_user = User(
        username=username,
        email=email,
        password=hashed_password,
        first_name=first_name,
        last_name=last_name,
        contact_no=contact_no,
        gender=gender,
        address=address,
        dob=dob
    )
    

    db.session.add(new_user)
    db.session.commit()
    user = User.query.filter_by(username=username).first()

    new_buyer = Buyer(user_id = user.id, user=user)
    db.session.add(new_buyer)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    print(generate_password_hash(password, method='scrypt'), user.username)
    
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid username or password'}), 401

    token = create_access_token(identity=user.username)
    return jsonify({'message': 'Logged in successfully', 'access_token': token}), 200

@app.route('/api/user')
@jwt_required()
def get_user_data():
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()
    print(user)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'points': user.points,
        'firstname': user.first_name,
        'lastname': user.last_name,
        'contact': user.contact_no,
        'gender': user.gender,
        'address': user.address,
        'dob': user.dob.strftime('%d-%m-%Y'),
        'date_joined': user.date_joined.strftime('%d-%m-%Y'),
        'role': user.role
    }
    print(user.id)
    return jsonify(user_data), 200

@app.route('/api/submit_business_info', methods=['POST'])
@jwt_required()
def request_role():
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json()

    print(data)
    try:
        new_request = UserRoleRequest(user_id=user.id, role=data.get('role'), business_name=data.get('business_name'), business_contact=data.get('contact_number'), business_address=data.get('address'))
        db.session.add(new_request)
        db.session.commit()
    except:
        return jsonify({'message: Data could not be submitted try again'}), 401
    
    return jsonify({'message': 'Role request submitted successfully'}), 201

from flask import jsonify

@app.route('/api/check_authentication', methods=['GET'])
@jwt_required()
def check_authentication():
    current_user_username = get_jwt_identity()
    return jsonify({'is_authenticated': True, 'username': current_user_username}), 200

@app.route('/api/check_admin', methods=['GET'])
@jwt_required()
def check_admin():
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()
    if user and user.role == 'admin':
        return jsonify({'is_admin': True}), 200
    else:
        return jsonify({'is_admin': False}), 403

@app.route('/api/get_business_submissions', methods=['GET'])
@jwt_required()
def get_business_submissions():
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if (user.role != 'admin'):
        return jsonify({'message': 'Unauthorized'}), 403

    submissions = UserRoleRequest.query.all()
    submission_data = [{'id': submission.id,
                        'user_name': User.query.get(submission.user_id).first_name + ' ' + User.query.get(submission.user_id).last_name,
                        'user_id': submission.user_id,
                        'business_name': submission.business_name,
                        'business_contact': submission.business_contact,
                        'business_address': submission.business_address,
                        'role': submission.role} for submission in submissions]

    return jsonify(submission_data), 200

@app.route('/api/assign_role', methods=['POST'])
def assign_role():
    data = request.json
    role = data.get('role').lower()
    print(data)
    submission_id = data.get('submission_id')

    user_id = data.get('user_id')
    user = User.query.filter_by(id=user_id).first()
    submission = UserRoleRequest.query.get(submission_id)
    if not submission:
        return jsonify({'message': 'Submission not found'}), 404

    print(user)
    if role not in ['buyer', 'retailer', 'manufacturer', 'recycler']:
        return jsonify({'message': 'Invalid role'}), 400
    print(role)
    submission_model = None
    if role == 'buyer':
        submission_model = Buyer
    elif role == 'retailer':
        submission_model = Retailer
    elif role == 'manufacturer':
        submission_model = Manufacturer
    elif role == 'recycler':
        submission_model = Recycler
    print(submission, submission_model)

    user.role = role
    new_request = submission_model(     user_id = user_id,
                                        business_name = submission.business_name,
                                        business_contact = submission.business_contact,
                                        business_address = submission.business_address,
                                    )
    db.session.add(new_request)
    


    db.session.delete(submission)
    db.session.commit()

    return jsonify({'message': f'Role assigned successfully to {user.username}'}), 200

# @app.route('/api/plastic_items', methods=['POST'])
# def create_plastic_item():
#     data = request.get_json()
#     new_item = PlasticItem(name=data['name'], description=data['description'], collected_by=data['collected_by'])
#     db.session.add(new_item)
#     db.session.commit()
#     return jsonify({'message': 'Plastic item created'}), 201

@app.route('/api/buyers', methods=['GET'])
@jwt_required()
def get_buyers():
    # Query and serialize buyer data
    buyers = Buyer.query.all()
    buyer_data = [{'id': buyer.id, 'username': buyer.user.username, 'email': buyer.user.email} for buyer in buyers]
    return jsonify(buyer_data), 200

@app.route('/api/retailers', methods=['GET'])
@jwt_required()
def get_retailers():
    # Query and serialize retailer data
    retailers = Retailer.query.all()
    retailer_data = [{'id': retailer.id, 'business_name': retailer.business_name, 'business_contact': retailer.business_contact, 'business_address': retailer.business_address} for retailer in retailers]
    return jsonify(retailer_data), 200

@app.route('/api/manufacturers', methods=['GET'])
@jwt_required()
def get_manufacturers():
    # Query and serialize manufacturer data
    manufacturers = Manufacturer.query.all()
    manufacturer_data = [{'id': manufacturer.id, 'business_name': manufacturer.business_name, 'business_contact': manufacturer.business_contact, 'business_address': manufacturer.business_address} for manufacturer in manufacturers]
    return jsonify(manufacturer_data), 200

@app.route('/api/recyclers', methods=['GET'])
@jwt_required()
def get_recyclers():
    # Query and serialize recycler data
    recyclers = Recycler.query.all()
    recycler_data = [{'id': recycler.id, 'business_name': recycler.business_name, 'business_contact': recycler.business_contact, 'business_address': recycler.business_address} for recycler in recyclers]
    return jsonify(recycler_data), 200

@app.route('/api/get_manufacturer/<int:user_id>', methods=['GET'])
@jwt_required()
def get_manufacturer(user_id):
    try:
        manufacturer = Manufacturer.query.filter_by(user_id=user_id).first()
        if not manufacturer:
            return jsonify({'error': 'Manufacturer not found'}), 404

        return jsonify({
            'id': manufacturer.id,
            'user_id': manufacturer.user_id,
            'business_name': manufacturer.business_name,
            'business_contact': manufacturer.business_contact,
            'business_address': manufacturer.business_address
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/create_plastic', methods=['POST'])
@jwt_required()
def create_plastic():
    data = request.get_json()
    manufacturer_id = data.get('manufacturerId')

    try:
        new_plastic = Plastic(manufacturer_id=manufacturer_id)
        db.session.add(new_plastic)
        db.session.commit()

        return jsonify({
            'id': new_plastic.id,
            'manufactured_date': new_plastic.manufactured_date.isoformat()
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/manufacturer_plastics/<int:manufacturer_id>', methods=['GET'])
@jwt_required()
def manufacturer_plastics(manufacturer_id):
    try:
        plastics = Plastic.query.filter_by(manufacturer_id=manufacturer_id).order_by(Plastic.manufactured_date.desc()).all()
        plastics_data = [{'id': plastic.id, 'manufactured_date': plastic.manufactured_date} for plastic in plastics]
        return jsonify(plastics_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_plastic_details', methods=['GET'])
@jwt_required()
def get_plastic_details():
    data = request.get_json()
    plastic_id = data.get('plasticId')
    try:
        plastic = Plastic.query.get(plastic_id)
        plastic_data = {'id': plastic.id, 'manufactured_date': plastic.manufactured_date.strftime('%d-%m-%Y'), 'manufacturer_name': Manufacturer.query.get(plastic.manufacturer_id), "retailers": [retailer.retailer_id for retailer in plastic.retailers], "buyers": [buyer.buyer_id for buyer in plastic.buyers]}
        return jsonify(plastic_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/add_plastic_to_inventory', methods=['POST'])
@jwt_required()

def add_plastic_to_inventory():
    data = request.get_json()
    print(data)
    plastic_id = data.get('plastic_id')
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()
    print(user)
    retailer = Retailer.query.filter_by(user_id=user.id).first()

    retailer_id = retailer.id

    if not plastic_id or not retailer_id:
        return jsonify({"message": "Plastic ID and Retailer ID are required"}), 400

    plastic = Plastic.query.get(plastic_id)
    if not plastic:
        return jsonify({"message": "Plastic not found"}), 404
    plastic.status = 'retailer'
    plastic_retailer = PlasticRetailer(plastic_id=plastic_id, retailer_id=retailer_id)
    db.session.add(plastic_retailer)
    db.session.commit()

    return jsonify({"message": "Plastic added to retailer inventory successfully"}), 200

@app.route('/api/get_retailer_id', methods=['GET'])
@jwt_required()
def get_retailer_id():
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()
    print(user)
    retailer = Retailer.query.filter_by(user_id=user.id).first()
    if not retailer:
        return jsonify({"message": "Retailer not found"}), 404
    return jsonify({"retailer_id": retailer.id}), 200

@app.route('/api/get_plastic_inventory', methods=['GET'])
@jwt_required()
def get_plastic_inventory():
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()
    retailer = Retailer.query.filter_by(user_id=user.id).first()
    retailer_id = retailer.id
    if not retailer_id:
        return jsonify({"message": "Retailer ID is required"}), 400

    try:
        inventory = PlasticRetailer.query.filter_by(retailer_id=retailer_id).all()
        print(inventory)
        response = [
            {
                'id': item.id,
                'plastic_id': item.plastic_id,
            }
            for item in inventory
        ]
        print(response)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/api/sell_plastic', methods=['POST'])
@jwt_required()
def sell_plastic():
    data = request.get_json()

    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()
    retailer = Retailer.query.filter_by(user_id=user.id).first()
    retailer_id = retailer.id

    plastic_id = data.get('plastic_id')
    user_id = data.get('user_id')  # Assuming user_id corresponds to the buyer_id

    if not plastic_id or not user_id:
        return jsonify({"message": "Plastic ID and User ID are required"}), 400

    try:
        # Check if plastic exists
        plastic = Plastic.query.get(plastic_id)
        if not plastic:
            return jsonify({"message": "Plastic not found"}), 404

        # Check if there is enough quantity in retailer's inventory
        plastic_retailer = PlasticRetailer.query.filter_by(plastic_id=plastic_id, retailer_id=retailer_id).first()
        if not plastic_retailer:
            return jsonify({"message": "Plastic not available in inventory"}), 404

        # Deduct the quantity from retailer's inventory
        db.session.commit()

        # Add to plastic buyer table
        plastic_buyer = PlasticBuyer(plastic_id=plastic_id, buyer_id=user_id)  # Assuming quantity is 1 per sale
        db.session.add(plastic_buyer)
        db.session.commit()

        return jsonify({"message": "Plastic sold successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
