import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";

const RecyclerDashboard = () => {
    const [createdPlastic, setCreatedPlastic] = useState(null);
    const [recycler, setRecycler] = useState(null);
    const [user, setUser] = useState(null);
    const [showMessage, setShowMessage] = useState(false);
    const [plastics, setPlastics] = useState([]);
    const [showPlastics, setShowPlastics] = useState(false);

    // New state variables
    const [plasticType, setPlasticType] = useState(1);
    const [plasticQuantity, setPlasticQuantity] = useState(1);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get("/api/user");
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (user) {
            const fetchRecycler = async () => {
                try {
                    const response = await axiosInstance.get(
                        `/api/get_recycler/${user.id}`
                    );
                    setRecycler(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error("Error fetching recycler:", error);
                }
            };

            fetchRecycler();
        }
    }, [user]);

    const recyclePlastic = async () => {
        if (!recycler) return;

        try {
            // Send a single request to create multiple plastics
            const response = await axiosInstance.post("/api/recycle_plastic", {
                manufacturerId: recycler.id,
                type: plasticType,
                quantity: plasticQuantity,
            });

            console.log(response.data.message); // Log the success message

            setCreatedPlastic({
                type: plasticType,
                quantity: plasticQuantity,
            });
            setShowMessage(true);

            // Hide message after 5 seconds
            setTimeout(() => {
                setShowMessage(false);
            }, 5000);
        } catch (error) {
            console.error("Error creating plastics:", error);
        }
    };

    const fetchPlastics = async () => {
        if (!recycler) return;

        try {
            const response = await axiosInstance.get(
                `/api/get_plastics/${recycler.id}`
            );
            setPlastics(response.data);
            setShowPlastics(true);
        } catch (error) {
            console.error("Error fetching plastics:", error);
        }
    };

    return (
        <div className="container mx-10 p-5 py-16 m-auto">
            {recycler && (
                <section className="shadow-lg rounded bg-white border py-8 mr-14">
                    <div className="grid max-w-6xl grid-cols-1 px-6 mx-auto lg:px-8 md:grid-cols-2 md:divide-x">
                        <div className="py-6 md:py-0 md:px-6">
                            <h1 className="text-4xl font-bold text-green-600">
                                {recycler.business_name}
                            </h1>
                            <p className="pt-2 pb-4">ID: {recycler.id}</p>
                            <div className="space-y-4">
                                <p className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5 mr-2 sm:mr-6"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                    <span>{recycler.business_address}</span>
                                </p>
                                <p className="flex items-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5 mr-2 sm:mr-6"
                                    >
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                    </svg>
                                    <span>{recycler.business_contact}</span>
                                </p>
                                <p>
                                    <a
                                        href="/recycler_plastics"
                                        className="bg-gray-600 block w-1/2 text-center hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
                                    >
                                        View all Plastics
                                    </a>
                                </p>
                            </div>
                        </div>
                        <form
                            noValidate=""
                            className="flex flex-col py-6 space-y-6 md:py-0 md:px-6"
                        >
                            <label className="block mb-2">
                                Plastic Type:
                                <select
                                    value={plasticType}
                                    onChange={(e) => setPlasticType(parseInt(e.target.value))}
                                    className="p-2 cursor-pointer block w-full mt-1 border border-green-300 rounded-md"
                                >
                                    <option value={1} className="p-2 cursor-pointer">
                                        Type 1
                                    </option>
                                    <option value={2}>Type 2</option>
                                </select>
                            </label>

                            <label className="block mb-2">
                                Quantity:
                                <input
                                    type="number"
                                    value={plasticQuantity}
                                    onChange={(e) => setPlasticQuantity(parseInt(e.target.value))}
                                    min="1"
                                    className="p-2 block w-full mt-1 border border-green-300 rounded-md"
                                />
                            </label>
                            <button
                                type="button"
                                onClick={recyclePlastic}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                            >
                                Recycle Plastics
                            </button>
                        </form>
                    </div>
                </section>
            )}
            {createdPlastic && showMessage && (
                <div className="mt-4 transition-opacity duration-500 ease-in-out opacity-100">
                    <h2 className="text-xl font-bold">Plastics Recycled</h2>
                    <p>Type: {createdPlastic.type}</p>
                    <p>Cost: {createdPlastic.cost}</p>
                    <p>Quantity: {createdPlastic.quantity}</p>
                </div>
            )}
            {showPlastics && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Plastics Recycled</h2>
                    <ul>
                        {plastics.map((plastic) => (
                            <li key={plastic.id} className="mb-2">
                                <p>ID: {plastic.id}</p>
                                <p>
                                    Manufactured Date:{" "}
                                    {new Date(
                                        plastic.manufactured_date
                                    ).toLocaleString()}
                                </p>
                                <p>Type: {plastic.type}</p>
                                <p>Cost: {plastic.cost}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RecyclerDashboard;
