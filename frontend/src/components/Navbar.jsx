import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../store/authSlice";
import axios from "axios";

export default function Navbar() {
  const user = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const isAdmin = user?.role === "admin";
      const endpoint = isAdmin
        ? `${import.meta.env.VITE_API_URL}/admin/logout`
        : `${import.meta.env.VITE_API_URL}/student/logout`;

      await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("❌ Something went wrong during logout.");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isAdmin = user?.role === "admin";
  const isLoggedIn = !!user; // Check if user is logged in

  return (
    <nav className="bg-white shadow-md relative z-10">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                PlacementPortal
              </span>
            </Link>
          </div>

          {/* Desktop navigation - Only show if logged in */}
          {isLoggedIn && (
            <div className="hidden md:flex md:items-center md:space-x-6">
              {/* Student links */}
              {!isAdmin && (
                <div className="flex gap-6">
                  <NavLink to="/home">Home</NavLink>
                  <NavLink to="/applied">Applications</NavLink>
                  <NavLink to="/profile">Profile</NavLink>
                </div>
              )}

              {/* Admin links */}
              {isAdmin && (
                <div className="flex gap-6">
                  <NavLink to="/admin/dashboard">Dashboard</NavLink>
                  <NavLink to="/admin/students">Students</NavLink>
                  <NavLink to="/admin/companies">Companies</NavLink>
                  <NavLink to="/admin/applications">Applications</NavLink>
                  <NavLink to="/admin/analytics">Analytics</NavLink>
                  <NavLink to="/admin/settings">Settings</NavLink>
                </div>
              )}

              <div className="flex items-center gap-3 ml-6 border-l border-gray-100 pl-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.fullName}
                  </span>
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                    {user?.role === "admin" ? "Admin" : "Student"}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-red-100"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Login button when not logged in */}
          {/* {!isLoggedIn && (
            <div className="hidden md:flex md:items-center">
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          )} */}

          {/* Mobile menu button - Only show if logged in */}
          {isLoggedIn && (
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Mobile login button when not logged in */}
          {!isLoggedIn && (
            <div className="md:hidden flex items-center">
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu - Only show if logged in and menu is open */}
      {isLoggedIn && isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
            {/* Student Links */}
            {!isAdmin && (
              <>
                <MobileNavLink to="/home" onClick={toggleMenu}>
                  Home
                </MobileNavLink>
                <MobileNavLink to="/applied" onClick={toggleMenu}>
                  Applications
                </MobileNavLink>
                <MobileNavLink to="/profile" onClick={toggleMenu}>
                  Profile
                </MobileNavLink>
              </>
            )}

            {/* Admin Links */}
            {isAdmin && (
              <>
                <MobileNavLink to="/admin/dashboard" onClick={toggleMenu}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/admin/students" onClick={toggleMenu}>
                  Students
                </MobileNavLink>
                <MobileNavLink to="/admin/companies" onClick={toggleMenu}>
                  Companies
                </MobileNavLink>
                <MobileNavLink to="/admin/applications" onClick={toggleMenu}>
                  Applications
                </MobileNavLink>
                <MobileNavLink to="/admin/analytics" onClick={toggleMenu}>
                  Analytics
                </MobileNavLink>
                <MobileNavLink to="/admin/settings" onClick={toggleMenu}>
                  Settings
                </MobileNavLink>
              </>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-100">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.fullName}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                    {user?.role === "admin" ? "Admin" : "Student"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

const NavLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors relative group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
  </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
    onClick={onClick}
  >
    {children}
  </Link>
);