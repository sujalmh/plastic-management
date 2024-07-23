import React, { useState, useEffect } from "react";
import axiosInstance from "../axios";

const data = [
    {
        id: 1,
        businessName: "Manufacturer Business 1",
        contact: 8923023087,
        address: "Badaga mijar MITE Mangalore",
        points: 15,
        name: "Water Bottles",
    },
    {
        id: 1,
        businessName: "Manufacturer Business 1",
        contact: 8923023087,
        address: "Badaga mijar MITE Mangalore",
        points: 15,
        name: "Water Bottles",
    },
    {
        id: 1,
        businessName: "Manufacturer Business 1",
        contact: 8923023087,
        address: "Badaga mijar MITE Mangalore",
        points: 15,
        name: "Water Bottles",
    },
    {
        id: 1,
        businessName: "Manufacturer Business 1",
        contact: 8923023087,
        address: "Badaga mijar MITE Mangalore",
        points: 15,
        name: "Water Bottles",
    },
    {
        id: 1,
        businessName: "Manufacturer Business 1",
        contact: 8923023087,
        address: "Badaga mijar MITE Mangalore",
        points: 15,
        name: "Water Bottles",
    },
    {
        id: 1,
        businessName: "Manufacturer Business 1",
        contact: 8923023087,
        address: "Badaga mijar MITE Mangalore",
        points: 15,
        name: "Water Bottles",
    },
    {
        id: 1,
        businessName: "Manufacturer Business 1",
        contact: 8923023087,
        address: "Badaga mijar MITE Mangalore",
        points: 15,
        name: "Water Bottles",
    },
    {
        id: 1,
        businessName: "Manufacturer Business 1",
        contact: 8923023087,
        address: "Badaga mijar MITE Mangalore",
        points: 15,
        name: "Water Bottles",
    },
    {
        id: 1,
        businessName: "Manufacturer Business 1",
        contact: 8923023087,
        address: "Badaga mijar MITE Mangalore",
        points: 15,
        name: "Water Bottles",
    },
    {
        id: 1,
        businessName: "Manufacturer Business 1",
        contact: 8923023087,
        address: "Badaga mijar MITE Mangalore",
        points: 15,
        name: "Water Bottles",
    },
];

const PlasticsPage = () => {
    const [plastics, setPlastics] = useState([]);
    const [manufacturerId, setManufacturerId] = useState(null);
    const [manufacturer, setManufacturer] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get("/api/user");
                setManufacturerId(response.data.id);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchManufacturerAndPlastics = async () => {
            if (manufacturerId) {
                try {
                    // Fetch manufacturer details
                    const manufacturerResponse = await axiosInstance.get(
                        `/api/get_manufacturer/${manufacturerId}`
                    );
                    setManufacturer(manufacturerResponse.data);

                    // Fetch plastics associated with the manufacturer
                    const plasticsResponse = await axiosInstance.get(
                        `/api/manufacturer_plastics/${manufacturerId}`
                    );
                    setPlastics(plasticsResponse.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchManufacturerAndPlastics();
    }, [manufacturerId]);

    return (
        <div className="container mx-auto p-4">
            {/* <h1 className="text-2xl font-bold mb-4">
                Plastics Created by Manufacturer
            </h1>
            {manufacturer ? (
                <div className="mb-4">
                    <h2 className="text-xl font-bold">Manufacturer Details</h2>
                    <p>ID: {manufacturer.id}</p>
                    <p>Business Name: {manufacturer.business_name}</p>
                    <p>Contact: {manufacturer.business_contact}</p>
                    <p>Address: {manufacturer.business_address}</p>
                </div>
            ) : (
                <p>Loading manufacturer details...</p>
            )}
            <div>
                {plastics.length > 0 ? (
                    plastics.map((plastic) => (
                        <div key={plastic.id} className="border p-4 mb-4">
                            <p>ID: {plastic.id}</p>
                            <p>
                                Manufactured Date:{" "}
                                {new Date(
                                    plastic.manufactured_date
                                ).toLocaleString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No plastics available or loading...</p>
                )}
            </div> */}
            <div className="container p-2 mx-auto sm:p-4 dark:text-gray-800">
                <h2 className="mb-6 text-4xl font-semibold leading-tight">
                    Plastics Created by Manufacturer
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-md">
                        <colgroup>
                            <col />
                            <col />
                            <col />
                            <col />
                            <col />
                            <col className="" />
                        </colgroup>
                        <thead className="dark:bg-gray-300">
                            <tr className="text-left">
                                <th className="p-3">ID #</th>
                                <th className="p-3">Business Name</th>
                                <th className="p-3">Contact</th>
                                <th className="p-3">Address</th>
                                <th className="p-3 text-right">
                                    Assigned Points
                                </th>
                                <th className="p-3 text-right pr-6">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
                                >
                                    <td className="p-3">
                                        <p>{item.id}</p>
                                    </td>
                                    <td className="p-3">
                                        <p>{item.name}</p>
                                    </td>
                                    <td className="p-3">
                                        <p>{item.contact}</p>
                                    </td>
                                    <td className="p-3">
                                        <p>{item.address}</p>
                                    </td>
                                    <td className="p-3 text-right">
                                        <p>{item.points}</p>
                                    </td>
                                    <td className="p-3 text-right">
                                        <span className="px-3 py-1 text-right font-semibold rounded-md bg-green-300">
                                            <span>{item.name}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PlasticsPage;
