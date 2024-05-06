"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
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
import moment from "moment";
import HowManyMinutesLeft from "@/app/component/HowManyMinutesLeft";

function Page() {
  const [popUp, setPopUp] = useState(false);
  const [imsakiyah, setImsakiyah] = useState(null);
  const [nowTime, setNowTime] = useState(new Date());
  const [targetTime, setTargetTime] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const dataImsakiyah = [
    { name: "Subuh", icon: fajr },
    { name: "Dzuhur", icon: dhuhur },
    { name: "Ashar", icon: ashar },
    { name: "Maghrib", icon: maghrib },
    { name: "Isya", icon: isya },
  ];

  const dataKegiatan = [
    { nama: "Shalat Subuh", time: "04.41" },
    { nama: "Shalat Dzuhur", time: "12.00" },
    { nama: "Shalat Ashar", time: "15.00" },
    { nama: "Shalat Maghrib", time: "17.45" },
    { nama: "Shalat Isya", time: "19.30" },
  ];

  const PopUp = () => {
    return (
      <div className="h-screen w-screen bg-[#00000086] absolute z-40 flex justify-center items-center">
        <div className="px-4 py-6 bg-white rounded-xl mx-auto flex flex-col items-center pt-8">
          <CollapseDropdown />
          <button onClick={handlePopUpChange} className="bg-green-400 rounded-md px-3 py-2">
            kembali
          </button>
        </div>
      </div>
    );
  };

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

  useEffect(() => {
    if (imsakiyah && nextPrayer) {
      // Mendapatkan waktu sholat berikutnya dari data imsakiyah
      const nextPrayerTime = imsakiyah.time[nextPrayer];
      // Menggabungkan tanggal imsakiyah dengan waktu sholat berikutnya
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const targetTime = `${formattedDate}T${nextPrayerTime}`;
      // Set targetTime ke waktu sholat berikutnya
      setTargetTime(targetTime);
    }
  }, [imsakiyah, nextPrayer]);

  // console.log(response.)
  // const targetTime = '2024-05-06T12:00:00';

  // useEffect(() => {
  //   const calculateTimeLeft = () => {
  //     const diff = moment(targetTime).diff(moment(), "minutes");
  //     const formattedTimeLeft = moment.duration(diff, "minutes").humanize();
  //     setTimeLeft(formattedTimeLeft);
  //   };

  //   calculateTimeLeft();

  //   const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

  //   return () => clearInterval(interval);
  // }, [targetTime]);

  return (
    <>
      {popUp ? <PopUp /> : null}
      <div className="max-w-screen bg-green-700 text-white">
        <div className="flex h-[50dvh] flex-col justify-between px-6 pt-4 pb-6">
          <HijriDate popUp={popUp} setPopUp={setPopUp} />
          <div className="text-center relative z-20">
            <h1 className="font-bold text-6xl">{`${nowTime.getHours().toString().padStart(2, "0")}:${nowTime.getMinutes().toString().padStart(2, "0")}`}</h1>
            {/* <HowManyMinutesLeft targetTime={targetTime} /> */}
          </div>

          <div className="flex gap-6 self-center z-10">
  {imsakiyah != null ? (
    <>
      {dataImsakiyah.map((data, index) => {
        const timeEntry = Object.entries(imsakiyah.time).find(([key]) => key.toLowerCase() === data.name.toLowerCase());
        const time = timeEntry ? timeEntry[1] : null;
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split("T")[0];
        console.log(imsakiyah)

        return (
          <div key={index} className="flex flex-col gap-1">
            <p className="text-center">{data.name}</p>
            <Image className="mx-auto" src={data.icon} height={27} width={27} alt="icon" />
            {/* {console.log(time)} */}
            <p className="text-center">{time}</p>
            {/* {time && (
              <div>
                <HowManyMinutesLeft targetTime={`${formattedDate}T${time}:00`} />
              </div>
            )} */}
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
            {dataKegiatan.map((data, index) => {
              return (
                <>
                  <div key={index} className="flex my-2 text-white">
                    <input type="checkbox" className="size-6 m-auto rounded-sm border-2 border-white" style={{ backgroundColor: "rgba(0, 0, 0, 0.08)" }} />
                    <div className="w-full ml-3">
                      <h1>{data.nama}</h1>
                      <p>{data.time}</p>
                    </div>
                    <FontAwesomeIcon icon={faTrashCan} className="size-8 my-auto text-white" />
                  </div>
                  <div className="h-[2px] w-full bg-white"></div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
