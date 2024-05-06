"use client"

import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/register', {
               name, email, password
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-4 bg-white shadow-lg rounded">
            <h2 className="text-2xl font-semibold mb-4">Register</h2>
            <h1>Name</h1>
            <input
                type="text"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full p-2 mb-4 border rounded"
            />
            <h1>Email</h1>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-2 mb-4 border rounded"
            />
            <h1>Password</h1>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full p-2 mb-4 border rounded"
            />
            <button onClick={handleRegister} className="w-full bg-blue-500 text-white py-2 rounded">
                Register
            </button>
        </div>
    );
};

export default Register;
