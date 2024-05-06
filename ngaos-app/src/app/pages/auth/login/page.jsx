import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async () => {
        try {
            setIsLoading(true)
            const response = await axios.post('http://localhost:5000/login', {
                email, password
            });
            console.log(response.data);
            if(response.data.status == 200){
                window.location.href = "/pages/dashboard"
                setIsLoading(false)
            }
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false)
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 p-4 bg-white shadow-lg rounded">
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
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
            <button disabled={isLoading} onClick={handleLogin} className="w-full bg-blue-500 text-white py-2 rounded">
                Login
            </button>
        </div>
    );
};

export default Login;
