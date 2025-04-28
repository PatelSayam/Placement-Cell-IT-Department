import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [serverOtpVerified, setServerOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const sendOtp = async () => {
    if (!email.includes("@")) {
      alert("Enter a valid email!");
      return;
    }
    try {
      await axios.post(`${baseUrl}/student/send-otp`, { email });
      setOtpSent(true);
      alert(`✅ OTP sent to ${email}`);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(`${baseUrl}/student/verify-otp`, { email, otp: enteredOtp });
      setServerOtpVerified(true);
      alert("✅ Email verified successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Invalid OTP. Try again.");
    }
  };

  const registerUser = async () => {
    if (!password) {
      alert("Please enter a password.");
      return;
    }
    try {
      await axios.post(`${baseUrl}/student/register-with-otp`, { email, password });
      alert("✅ Registered successfully!");
      navigate("/general-info");
    } catch (error) {
      console.error(error);
      alert("❌ Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full relative z-10 border border-indigo-100">
        <div className="relative">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              {/* Avatar SVG */}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">Sign up to access the placement portal</p>
          </div>

          <div className="space-y-6">
            {/* Email input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
              />
            </div>

            {/* OTP input */}
            {otpSent && !serverOtpVerified && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Verification Code</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter 6-digit code"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Enter the OTP sent to your email</p>
              </div>
            )}

            {/* Password input */}
            {serverOtpVerified && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {/* Buttons */}
            {!otpSent ? (
              <button
                onClick={sendOtp}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium"
              >
                Send Verification Code
              </button>
            ) : !serverOtpVerified ? (
              <button
                onClick={verifyOtp}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium"
              >
                Verify OTP
              </button>
            ) : (
              <button
                onClick={registerUser}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
