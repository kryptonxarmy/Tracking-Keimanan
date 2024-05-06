"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsPraying, faHouse, faLayerGroup, faTrashCan, faClock } from "@fortawesome/free-solid-svg-icons";
import HijriDate from "../../component/HijriahDate";
import fajr from "/public/icons/fajr.svg";
import dhuhur from "/public/icons/dhuhur.svg";
import ashar from "/public/icons/ashar.svg";
import maghrib from "/public/icons/maghrib.svg";
import isya from "/public/icons/isya.svg";
import CollapseDropdown from "@/app/component/CollapseDropdown";
import masjid from "../../../../public/masjid-siluet.png";
import axios from "axios";
import SholatForm from "@/app/component/SholatForm";

function Page() {
  const [popUp, setPopUp] = useState(false);
  const [imsakiyah, setImsakiyah] = useState(null);
  const [imsakTime, setImsakTime] = useState([]);
  const [nowTime, setNowTime] = useState(new Date());
  const [isTimePassed, setIsTimePassed] = useState(false);

  const dataImsakiyah = [
    { name: "Subuh", icon: fajr },
    { name: "Dzuhur", icon: dhuhur },
    { name: "Ashar", icon: ashar },
    { name: "Maghrib", icon: maghrib },
    { name: "Isya", icon: isya },
  ];


  const getImsakiyah = async () => {
    try {
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const longitude = localStorage.getItem("longitude");
      const latitude = localStorage.getItem("latitude");
      const response = await axios.get(`https://waktu-sholat.vercel.app/prayer?latitude=${latitude}&longitude=${longitude}`);
      setImsakiyah(response.data.prayers[day - 1]);
      localStorage.setItem("city", response.data.name);
      localStorage.setItem("prov", response.data.province.name);
    } catch (error) {
      console.error("Error fetching imsakiyah:", error);
    }
  };

  const [inputValue, setInputValue] = useState("");
  const [namaSholat, setNamaSholat] = useState("");
  const [catatan, setCatatan] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleCatatanChange = (event) => {
    setCatatan(event.target.value);
  };

  const handleNamaSholatChange = (event) => {
    setNamaSholat(event.target.value);
  };

  const handleSubmit = () => {
    // Lakukan sesuatu dengan nilai inputan, nama sholat, dan catatan, misalnya kirim ke backend
    console.log("Nilai inputan:", inputValue);
    console.log("Nama Sholat:", namaSholat);
    console.log("Catatan:", catatan);

    // Reset nilai inputan, nama sholat, dan catatan setelah submit
    setInputValue("");
    setNamaSholat("");
    setCatatan("");
  };

  const sendDataToBackend = async (sholatName, isChecked, catatan) => {
    try {
      const response = await axios.post("http://localhost:5000/api/kegiatan-sholat", {
        sholatName,
        isChecked,
        catatan,
      });
      console.log("Response from backend:", response.data);
      // Tambahkan logika lainnya sesuai kebutuhan
    } catch (error) {
      console.error("Error sending data to backend:", error);
      // Tambahkan logika penanganan error
    }
  };

  const handlePopUpChange = () => {
    getImsakiyah();
    setPopUp(false);
  };

  useEffect(() => {
    getImsakiyah();
    const interval = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {popUp ? <PopUp /> : null}
      <div className="max-w-screen bg-green-700 text-white">
        <div className="flex h-[50dvh] flex-col justify-between px-6 pt-4 pb-6">
          <HijriDate popUp={popUp} setPopUp={setPopUp} />
          <div className="text-center relative z-20">
            <h1 className="font-bold text-6xl">{`${nowTime.getHours().toString().padStart(2, "0")}:${nowTime.getMinutes().toString().padStart(2, "0")}`}</h1>
          </div>
          <div className="flex gap-6 self-center z-10">
            {imsakiyah !== null ? (
              <>
                {dataImsakiyah.map((data, index) => {
                  const timeEntry = imsakiyah.time[data.name.toLowerCase()];
                  return (
                    <div key={index} className="flex flex-col gap-1">
                      <p className="text-center">{data.name}</p>
                      <Image className="mx-auto" src={data.icon} height={27} width={27} alt="icon" />
                      <p className="text-center">{timeEntry}</p>
                    </div>
                  );
                })}
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <Image src={masjid} height={150} width={500} alt="masjid" className="absolute translate-y-[-80%] z-0 opacity-30 md:w-[60vw] md:translate-x-[20%]" />
        <div className="bg-white flex flex-col text-black rounded-t-[39px] p-6 relative z-10">
          <h1 className="font-bold text-2xl mb-4">All Features</h1>
          <div className="flex justify-between text-center items-center font-bold mb-6">
            <div className="hover:cursor-pointer" onClick={() => (window.location.href = "/pages/quran")}>
              <FontAwesomeIcon icon={faHouse} className="size-10 mx-auto text-white bg-green-700 rounded-xl p-3" />
              <h1 className="font-bold">Quran</h1>
            </div>
            <div>
              <FontAwesomeIcon icon={faClock} className="size-10 mx-auto text-white bg-green-700 rounded-xl p-3" />
              <h1>Imsakiyah</h1>
            </div>
            <a href="/pages/doa">
              <FontAwesomeIcon icon={faHandsPraying} className="size-10 mx-auto text-white bg-green-700 rounded-xl p-3" />
              <h1>Doa Harian</h1>
            </a>
            <div>
              <FontAwesomeIcon icon={faLayerGroup} className="size-10 mx-auto text-white bg-green-700 rounded-xl p-3" />
              <h1>All</h1>
            </div>
          </div>
          <h1 className="font-bold text-2xl mb-3">Kegiatanku</h1>
          <div className="bg-green-700 rounded-xl p-4">
            <SholatForm imsakiyah={imsakiyah} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;