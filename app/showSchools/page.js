"use client";
import React, { useEffect, useState } from "react";

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch("/api/showSchools", { cache: "no-store" });
        const response = await data.json();
        setSchools(response);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  if (!schools.length)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 text-xl">
        Loading schools...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 lg:px-20">
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-500">
        School Lists
      </h1>
{console.log(schools)}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {schools.slice().reverse().map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                src={school.image || "/schoolImages/default.png"}
                alt={school.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {school.name}
              </h2>
              <p className="text-gray-600 text-sm mb-2">
                {school.address}, {school.city}, {school.state}
              </p>
              <p className="text-gray-500 text-sm">Email: {school.email_id}</p>
              <p className="text-gray-500 text-sm">Contact: {school.contact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
