"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, addMonths, subMonths } from "date-fns";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hijriDate, setHijriDate] = useState("");
  const [city, setCity] = useState("");
  const [prov, setProv] = useState("");

  useEffect(() => {
    // Panggil fungsi untuk mendapatkan tanggal Hijriyah
    getHijriDate();
  }, [currentDate]); // Dipanggil ketika tanggal berubah

  const getHijriDate = async () => {
    try {
      const response = await axios.get(`https://api.aladhan.com/v1/gToH/${format(currentDate, "dd-MM-yyyy")}`);
      const day = response.data.data.hijri.day;
      const month = response.data.data.hijri.month.en;
      const year = response.data.data.hijri.year;
      const hijriNowDate = `${day} ${month} ${year}`;

      // Atur tanggal Hijriyah, kota, dan provinsi
      setHijriDate(hijriNowDate);
      setCity(localStorage.getItem("city"));
      setProv(localStorage.getItem("prov"));

      // Tampilkan tanggal, bulan, dan tahun sekarang
      console.log("Tanggal sekarang:", format(currentDate, "d MMMM yyyy"));
      console.log("Tanggal Hijriah sekarang:", hijriNowDate);
    } catch (error) {
      console.error("Error fetching Hijri date:", error);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1); // Jika bulan adalah Desember, kembali ke Januari tahun berikutnya
    setCurrentYear(currentMonth === 11 ? currentYear + 1 : currentYear); // Jika bulan adalah Desember, tambahkan satu tahun
  };

  const prevMonth = () => {
    setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1); // Jika bulan adalah Januari, kembali ke Desember tahun sebelumnya
    setCurrentYear(currentMonth === 0 ? currentYear - 1 : currentYear); // Jika bulan adalah Januari, kurangi satu tahun
  };

  const renderCalendar = () => {
    const monthYear = format(new Date(currentYear, currentMonth, 1), "MMMM yyyy");
    const currentDateObj = new Date(currentYear, currentMonth, 1);
  
    return (
      <div className="mx-auto max-w-4xl p-4">
        <div className="flex justify-between mb-4">
          <button onClick={prevMonth} className="px-2 py-1 bg-blue-500 text-white rounded">
            Prev
          </button>
          <h2 className="text-lg font-bold">{monthYear}</h2>
          <button onClick={nextMonth} className="px-2 py-1 bg-blue-500 text-white rounded">
            Next
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-bold">
              {day}
            </div>
          ))}
          {getDaysInMonth(currentDateObj).map((date, index) => (
            <div key={index} className={`py-2 border border-gray-200 ${isToday(date) ? "bg-blue-200" : ""}`}>
              {date}
            </div>
          ))}
        </div>
        <div className="text-right mt-4">Hijriah: {hijriDate}</div>
        <div className="text-right">Kota: {city}</div>
        <div className="text-right">Provinsi: {prov}</div>
      </div>
    );
  };
  

  const isToday = (date) => {
    const today = new Date();
    const formattedDate = new Date(date); // Ubah tanggal yang diberikan menjadi objek Date
    const currentDate = new Date(); // Tanggal saat ini sebagai objek Date
    
    // Atur jam, menit, detik, dan milidetik kedua objek Date ke nilai yang sama
    formattedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
  
    // Bandingkan hanya tanggal, bulan, dan tahun
    return (
      currentDate.getDate() === formattedDate.getDate() &&
      currentDate.getMonth() === formattedDate.getMonth() &&
      currentDate.getFullYear() === formattedDate.getFullYear()
    );
  };

  console.log(isToday())

  const getDaysInMonth = (date) => {
    const daysInMonth = [];
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      daysInMonth.push(format(d, "d"));
    }
    return daysInMonth;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg">{renderCalendar()}</div>
    </div>
  );
}

export default Calendar;
