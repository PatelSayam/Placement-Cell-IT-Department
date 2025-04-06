import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    // For now, simulate a login — later replace with real API call
    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

    const dummyUser = {
      email,
      name: "John Doe",
      role: "student",
    };

    dispatch(login(dummyUser)); // Store user in redux
    navigate("/dashboard"); // Navigate to dashboard after login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>

        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-lg outline-none ring-2 ring-black mb-4"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Not registered yet?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
