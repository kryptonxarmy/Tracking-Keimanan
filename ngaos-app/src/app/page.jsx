"use client";

import React, { useState } from "react";
import Login from "./pages/auth/login/page";
import Register from "./pages/auth/register/page";

const App = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="bg-green-400 min-h-screen flex flex-col items-center justify-center font-arabic">
      <h1 className="text-center text-6xl font-bold text-white mb-8 kaushan-script-regular myFont.className">Ngaos App</h1>
      <div className="flex flex-col items-center">
        {showLogin ? <Login /> : <Register />}
        <button onClick={toggleForm} className="text-green-700 font-semibold my-4 focus:outline-none">
          {showLogin ? "Belum punya akun? Daftar disini" : "Sudah punya akun? Masuk disini"}
        </button>
      </div>
    </div>
  );
};

export default App;
