import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const navigate = useNavigate();

  const sendOtp = () => {
    if (!email.includes("@")) {
      alert("Enter a valid email!");
      return;
    }

    // Simulate OTP generation and email send
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setServerOtp(generatedOtp);
    setOtpSent(true);

    alert(`✅ OTP sent to ${email}: ${generatedOtp} (simulated)`); // Replace with actual API call
  };

  const verifyOtp = () => {
    if (enteredOtp === serverOtp) {
      navigate("/general-info");
    } else {
      alert("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Sign Up</h2>

        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-lg outline-none ring-2 ring-black mb-4"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {otpSent && (
          <>
            <label className="block text-sm font-medium text-gray-600 mb-1">Enter OTP</label>
            <input
              type="text"
              className="w-full px-4 py-2 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
              placeholder="6-digit code"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
            />
          </>
        )}

        {!otpSent ? (
          <button
            onClick={sendOtp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Send OTP
          </button>
        ) : (
          <button
            onClick={verifyOtp}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
          >
            Verify & Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default Signup;
