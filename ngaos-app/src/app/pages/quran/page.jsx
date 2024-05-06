"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Quran() {
  const [surahList, setSurahList] = useState(null);
  const [filteredSurahList, setFilteredSurahList] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSurahList = async () => {
      try {
        const response = await axios.get("https://apimuslimify.vercel.app/api/v1/surah");
        setSurahList(response.data.data);
        setFilteredSurahList(response.data.data);
      } catch (error) {
        console.error("Error fetching surah list:", error);
      }
    };

    fetchSurahList();
  }, []);

  const handleSurahClicked = (id) => {
    router.push(`quran/${id}`);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm === "") {
      setFilteredSurahList(surahList);
    } else {
      const filteredSurahs = surahList.filter((surah) => surah.nama_latin && surah.nama_latin.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredSurahList(filteredSurahs);
    }
  };

  return (
    <div className="max-w-screen min-h-screen bg-green-700 text-white p-4">
      <Link href="/pages/dashboard" className="py-2 px-4 bg-green-600 hidden md:inline top-5 relative text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition duration-300">
        Kembali ke Dashboard
      </Link>
      <h1 className="font-bold text-center text-4xl">Quran</h1>
      <div className="w-full flex justify-center my-6">
        <input
          type="text"
          placeholder="Cari Surah..."
          className="p-3 text-lg text-white bg-green-900 border-2 border-transparent focus:outline-none focus:border-green-600 rounded-full shadow-lg max-w-full sm:w-auto"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="flex flex-col gap-3">
        {filteredSurahList != null ? (
          filteredSurahList.map((data) => (
            <div key={data.nomor_surah} onClick={() => handleSurahClicked(data.nomor_surah)} className="mb-6 rounded-lg overflow-hidden bg-green-600 text-white shadow-xl p-4 hover:bg-green-400 transition duration-300 ">
              <h1 className="font-bold text-4xl">{data.nomor}</h1>
              <div className="flex justify-between w-full items-center">
                <div>
                  <h1 className="font-bold text-xl">{data.nama_latin}</h1>
                  <p>
                    {data.arti} - {data.jumlah_ayat} ayat
                  </p>
                </div>
                <h1 className="text-2xl">{data.nama}</h1>
              </div>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Quran;
