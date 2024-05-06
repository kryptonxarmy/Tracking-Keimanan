"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const Dropdown = ({ options, onChange, disabled }) => {
  return (
    <select disabled={disabled} className="p-2 w-[80%] border rounded" onChange={onChange}>
      <option value="">Pilih</option>
      {options.map((option) => (
        <option key={option.id} value={option.id} className="">
          {option.name}
        </option>
      ))}
    </select>
  );
};

const App = () => {
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [imsakiyah, setImsakiyah] = useState([]);
  const [prayers, setPrayers] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://waktu-sholat.vercel.app/province");
        setProvinces(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (event) => {
    const selectedProvinceId = event.target.value;
    setSelectedProvince(selectedProvinceId);

    try {
      setLoading(true);
      const response = await axios.get(`https://waktu-sholat.vercel.app/province/${selectedProvinceId}/city`);
      setCities(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setLoading(false);
    }
  };

  const handleCityChange = async (event) => {
    const selectedCityId = event.target.value;
    setSelectedCity(selectedCityId);

    const selectedCity = cities.find((city) => city.id === selectedCityId);
    if (selectedCity) {
      const { latitude, longitude } = selectedCity.coordinate;
      const setLocalStorage = () => {
        localStorage.setItem("latitude", latitude);
        localStorage.setItem("longitude", longitude);
      };
      setLocalStorage();
    }
  };


  useEffect(() => {
    const currentDate = new Date();
    const currentDateString = `${currentDate.getDate()}`;
    console.log("sekarang ", currentDateString);
    const imsakiyahToday = imsakiyah[currentDateString];
    setPrayers(imsakiyahToday);
  }, [imsakiyah]);

  return (
    <div className="mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Pilih Provinsi:</h2>
      <Dropdown options={provinces} onChange={handleProvinceChange} />

      <h2 className="text-xl font-bold mt-4 mb-2">Pilih Kota:</h2>
      {
        selectedProvince == null ? <Dropdown options={cities} disabled={true} onChange={handleCityChange} /> : <Dropdown options={cities} disabled={false} onChange={handleCityChange} />
      } 
        
    </div>
  );
};

export default App;
