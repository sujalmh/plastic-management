import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { FaLeaf, FaCoins, FaGift } from "react-icons/fa";
const availablePoints = 250;
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { FaTrophy, FaShoppingCart, FaQuestionCircle } from "react-icons/fa";

const data = {
    labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ],
    datasets: [
        {
            label: "Points gained",
            data: [100, 30, 65, 55, 30, 60, 75, 120],
            backgroundColor: ["#009e00"],
        },
    ],
};

const articles = [
    {
        title: "The Importance of Plastic Recycling",
        content:
            "Plastic recycling helps to reduce the environmental impact and conserves resources.",
        bgColor: "bg-blue-300",
        size: "large",
    },
    {
        title: "How to Sort Plastic Waste Effectively",
        content:
            "Sorting plastic waste correctly can make the recycling process more efficient.",
        bgColor: "bg-green-300",
        size: "small",
    },
    {
        title: "Innovations in Plastic Management",
        content:
            "New technologies are emerging to manage and recycle plastic more effectively.",
        bgColor: "bg-yellow-300",
        size: "medium",
    },
    {
        title: "Plastic Waste in the Oceans",
        content:
            "Plastic waste in the oceans is a significant environmental issue that needs to be addressed.",
        bgColor: "bg-red-300",
        size: "medium",
    },
    {
        title: "Community Initiatives for Plastic Reduction",
        content:
            "Local communities are taking initiatives to reduce plastic usage and promote recycling.",
        bgColor: "bg-purple-300",
        size: "small",
    },
];

const items = [
    {
        src: "https://5.imimg.com/data5/ON/VU/MY-3526621/plastic-bag.jpg",
        category: "Kitchen",
        name: "Everyday Plastic cover",
        points: 10,
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzLhGRZQTEjQ-NJ7klT1HgXFrsg49GopcGNQ&s",
        category: "Food",
        name: "Plastic Straws",
        points: 5,
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcZ7geJ5doQGf79nX7DL9Ih0aKs5zgoOJ8Vg&s",
        category: "Bathroom",
        name: "Plastic buckets",
        points: 35,
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuyz0KbYtxFZwdAICYemLp2-SL3ajYeJeuBw&s",
        category: "Bathroom",
        name: "Plastic mug",
        points: 20,
    },
    {
        src: "https://tiimg.tistatic.com/fp/1/007/916/pack-of-100-peace-for-party-events-white-colour-disposable-plastic-spoons--715.jpg",
        category: "Kitchen",
        name: "Plastic spoons",
        points: 15,
    },
    {
        src: "https://dummyimage.com/420x260",
        category: "Plastic",
        name: "Small Size Plastic",
        points: 25,
    },
    {
        src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJRgVqgbvCeyG1kjhrJ4eMMp6tD5IReusUkQ&s",
        category: "Plastic",
        name: "Plastic Water Bottles",
        points: 20,
    },
    {
        src: "https://dummyimage.com/420x260",
        category: "Plastic",
        name: "Small Size Plastic",
        points: 25,
    },
];

const getSizeClass = (size) => {
    switch (size) {
        case "large":
            return "col-span-2 row-span-2";
        case "medium":
            return "col-span-1 row-span-2";
        case "small":
        default:
            return "col-span-1 row-span-1";
    }
};

const BuyerDashboard = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const [plastics, setPlastics] = useState([]);

    useEffect(() => {
        const fetchPlastics = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/get_user_plastics"
                ); // Replace with your API endpoint
                console.log("Plastics:", response.data);
                setPlastics(response.data); // Update state with fetched data
            } catch (error) {
                console.error("Error fetching plastics:", error);
            }
        };

        fetchPlastics();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % articles.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="w-full bg-gray-100 px-10 py-7">
                <div className="px-3">
                    <header className="rounded-md">
                        <div className="p-4">
                            <header className="rounded-md mb-4 flex items-center">
                                <span className="text-3xl text-gray-800">
                                    Good Morning
                                </span>
                                <h1 className="text-4xl font-bold ml-2 text-gray-800">
                                    Manik,
                                </h1>
                            </header>

                            <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white shadow-md rounded-md p-6 flex items-center">
                                    <FaCoins className="text-green-500 text-3xl mr-4" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                            Available Points
                                        </h2>
                                        <p className="text-3xl font-bold text-green-500">
                                            120
                                        </p>
                                        <button className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 flex items-center justify-center">
                                            Redeem Points{" "}
                                            <FaLeaf className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-white shadow-md rounded-md p-6 flex items-center">
                                    <FaGift className="text-green-500 text-3xl mr-4" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                            Points Earned Today
                                        </h2>
                                        <p className="text-3xl font-bold text-green-500">
                                            120
                                        </p>
                                        <button className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 flex items-center justify-center">
                                            Bonuses
                                        </button>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </header>
                    <div className="grid items-center justify-center">
                        <div className="h-96 w-[50rem] mt-14">
                            <Bar className="text-center" data={data} />
                        </div>
                    </div>
                    <section className="text-gray-600 body-font">
                        <h1 className="text-3xl mt-24 text-center text-black ml-7">
                            Plastics scoreboard
                        </h1>
                        <div className="container px-5 py-10 pb-20 mx-auto">
                            <div className="flex flex-wrap justify-center items-center -m-4">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="w-[23%] m-2 bg-white p-4 border rounded-md overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105"
                                    >
                                        <a className="block relative h-48 rounded overflow-hidden">
                                            <img
                                                alt="ecommerce"
                                                className="object-cover object-center w-full h-full block"
                                                src={item.src}
                                            />
                                        </a>
                                        <div className="mt-4">
                                            <h3 className="text-gray-500 text-sm tracking-widest title-font mb-1">
                                                {item.category}
                                            </h3>
                                            <h2 className="text-gray-900 title-font text-xl font-medium">
                                                {item.name}
                                            </h2>
                                            <p className="mt-5 cursor-default text-md text-white font-bold text-center bg-green-600 rounded-lg">
                                                + {item.points}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;
