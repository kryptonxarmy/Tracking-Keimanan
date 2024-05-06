import React, { useEffect, useState } from "react";
import axios from "axios";

function SholatForm({ imsakiyah }) {
  const dataKegiatan = [{ name: "Subuh" }, { name: "Dzuhur" }, { name: "Ashar" }, { name: "Maghrib" }, { name: "Isya" }];

  const [showPopup, setShowPopup] = useState(false);
  const [selectedSholat, setSelectedSholat] = useState("");
  const [catatan, setCatatan] = useState("");
  const [catatanData, setCatatanData] = useState([]);

  const handleTambahCatatan = (sholatName) => {
    setShowPopup(true);
    setSelectedSholat(sholatName);
  };

  const handleSimpanCatatan = async () => {
    try {
      // Kirim request ke API
      const response = await axios.post("http://localhost:5000/api/kegiatan-sholat", {
        username: localStorage.getItem("name"),
        sholatName: selectedSholat,
        isChecked: true,
        catatan: catatan,
      });

      // Jika request berhasil
      console.log("Response:", response.data);

      // Tutup popup
      setShowPopup(false);
      // Reset catatan
      setCatatan("");
    } catch (error) {
      // Jika request gagal
      console.error("Error:", error);
    }
  };

  const getData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/catatan-sholat");
      console.log(res.data);
      setCatatanData(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {imsakiyah !== null ? (
        dataKegiatan.map((data, index) => {
          const timeEntry = imsakiyah.time[data.name.toLowerCase()];
          const time = timeEntry ? timeEntry : "Belum tersedia";

          const currentHour = 1;
          const currentMinute = 16;

          const [sholatHour, sholatMinute] = time.split(":").map(Number);

          const isTimePassed = currentHour > sholatHour || (currentHour === sholatHour && currentMinute > sholatMinute);

          // Mendapatkan catatan dari respons API berdasarkan nama sholat
          const catatan = catatanData.find((item) => item.sholatName === data.name);

          return (
            <div key={index} className={`flex justify-between my-4 text-white shadow-xl p-3 rounded ${isTimePassed ? "bg-red-400" : "bg-green-700"}`}>
              <div className="flex items-center">
                <input type="checkbox" checked={catatan && catatan.isChecked} disabled={isTimePassed} />
                <div className="w-full ml-3">
                  <h1 className="text-lg font-semibold">{data.name}</h1>
                  <p className="text-sm">{time}</p>
                  <p className="text-sm">{catatan ? catatan.catatan : "Belum ada catatan"}</p> {/* Menampilkan catatan */}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  disabled={isTimePassed}
                  className="bg-white disabled:text-gray-400 disabled:cursor-not-allowed px-4 h-fit py-2 rounded shadow-xl text-black font-bold hover:cursor-pointer"
                  onClick={() => handleTambahCatatan(data.name)}
                >
                  Tambah Catatan
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-white">Loading...</p>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Tambah Catatan untuk {selectedSholat}</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Masukkan catatan untuk kegiatan sholat ini"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600" onClick={() => setShowPopup(false)}>
                Batal
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" onClick={handleSimpanCatatan}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SholatForm;
