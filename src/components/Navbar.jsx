import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice"; // example action

export default function Navbar() {
  const user = useSelector((state) => state.auth.user); // Assuming `user` has a `role`
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mockUser = {
    name: "Test User",
    role: "student", // Change to "admin" to test admin view
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-semibold text-blue-600">Placement cell</div>

      <div className="space-x-4">
        {mockUser?.role === "student" && (
          <>
            <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
            <Link to="/applied" className="text-gray-700 hover:text-blue-500">Applied Companies</Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-500">Profile</Link>
          </>
        )}

        {mockUser?.role === "admin" && (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
            <Link to="/students" className="text-gray-700 hover:text-blue-500">Students</Link>
            <Link to="/companies" className="text-gray-700 hover:text-blue-500">Companies</Link>
            <Link to="/stats" className="text-gray-700 hover:text-blue-500">Stats</Link>
          </>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
