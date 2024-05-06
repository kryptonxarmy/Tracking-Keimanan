"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import CollapseDropdown from "./CollapseDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const HijriahDate = ({ setPopUp }) => {
  const [hijriDate, setHijriDate] = useState("");
  const [nowDate, setNowDate] = useState(null);
  const [city, setCity] = useState("");
  const [prov, setProv] = useState("");

  useEffect(() => {
    // Dapatkan tanggal sekarang
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear().toString();

    // Format tanggal menjadi "dd-mm-yyyy"
    const formattedDate = `${day}-${month}-${year}`;
    setNowDate(formattedDate);
  }, []);

  const getHijriDate = async () => {
    try {
      const response = await axios.get(`https://api.aladhan.com/v1/gToH/${nowDate}`);
      const day = response.data.data.hijri.day;
      const month = response.data.data.hijri.month.en;
      const year = response.data.data.hijri.year;
      const hijriNowDate = `${day} ${month} ${year}`;
      setHijriDate(hijriNowDate);
      setCity(localStorage.getItem("city"));
      setProv(localStorage.getItem("prov"));
    } catch (error) {}
  };

  if (nowDate != null) {
    getHijriDate();
  }

  return (
    <>
      <div className="-ml-4 md:ml-0 relative z-20">
        <h1 className="font-bold text-lg">{hijriDate ? `${hijriDate} H` : ""}</h1>
        <button onClick={() => setPopUp(true)} className="font-light inline bg-[#076b2575] px-2 py-1 rounded-xl text-sm">
          <FontAwesomeIcon icon={faLocationDot} className=" size-4" />
          {
            (city&&prov) ?  `${city}, ${prov}` : "Bandung, Jawabarat"
          }
           
        </button>
      </div>
    </>
  );
};

export default HijriahDate;
