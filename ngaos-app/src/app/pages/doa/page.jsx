"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

function Page() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const getDoa = async () => {
    try {
      const res = await axios.get("https://api.dikiotang.com/doa");
      setData(res.data.data);
      setFilteredData(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getDoa();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const results = data.filter((item) => item.judul.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredData(results);
  };

  return (
    <>
      <div className="p-4">
        <div className="mb-4 pt-4 inline">
          <Link href="/pages/dashboard" className="py-2 px-2 hidden md:inline bg-green-800 text-white rounded-full">
            Kembali ke Dashboard
          </Link>

          <h1 className="text-4xl font-bold mb-4 text-center">Doa Doa Harian</h1>
        </div>
        <div className="w-full flex justify-center mb-6">
          <input type="text" placeholder="Cari doa..." className="p-2 mb-4 border-gray-400 w-[80%] rounded border" value={searchTerm} onChange={handleSearch} />
        </div>
        {filteredData.map((item, index) => (
          <div key={index} className="mb-6 rounded-lg overflow-hidden bg-green-600 text-white shadow-xl">
            <div className="p-6">
              <h1 className="text-xl font-semibold mb-2">
                {index + 1}. {item.judul}
              </h1>
              <p className="text-lg mb-4">{item.arab}</p>
              <p className="text-sm">{item.indo}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Page;
