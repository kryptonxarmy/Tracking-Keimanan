"use client";

import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";

function SurahPage() {
  const { id } = useParams(); // Get the query parameter from the URL

  const [surahData, setSurahData] = useState(null);

  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        const res = await axios.get(`https://apimuslimify.vercel.app/api/v1/surah/${id}`);
        setSurahData(res.data);
      } catch (error) {
        console.error("Error fetching surah data:", error.message);
      }
    };

    if (id) {
      fetchSurahData();
    }
  }, [id]);

  if (!surahData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white min-h-screen max-w-screen text-black">
      <div className="px-4 bg-green-500">
        <FontAwesomeIcon onClick={() => window.history.back()} className="text-3xl relative top-5 cursor-pointer text-white" icon={faArrowLeft} />
        <h1 className="text-3xl font-bold mb-6 text-center text-white">{surahData.data.nama_latin}</h1>
        <p className="text-center text-white">{surahData.data.arti}</p>
      </div>
      <div className="w-full h-[2px] bg-black mb-2"></div>
      <div className="flex flex-col gap-3 px-4">
        {surahData ? (
          surahData.data.data.map((data, i) => (
            <div key={i} className="w-full space-y-3">
              <p className="text-3xl text-right text-green-600">{data.text}</p>
              <div>
                <p className="text-gray-700">{data.terjemahan}</p>
              </div>
              <div className="w-full h-[2px] bg-black"></div>
            </div>
          ))
        ) : (
          <p>Loading..........</p>
        )}
      </div>
    </div>
  );
}

export default SurahPage;
