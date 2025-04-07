import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "../store/authSlice" // example action

export default function Navbar() {
  const user = useSelector((state) => state.auth.user) // Assuming `user` has a `role`
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const mockUser = {
    name: "Sumit",
    role: "student", // Change to "admin" to test admin view
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <nav className="bg-white shadow-md relative z-10">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
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

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            {mockUser?.role === "student" && (
              <div className="flex gap-6">
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/applied">Applications</NavLink>
                <NavLink to="/profile">Profile</NavLink>
              </div>
            )}

            {mockUser?.role === "admin" && (
              <div className="flex gap-6">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/students">Students</NavLink>
                <NavLink to="/companies">Companies</NavLink>
                <NavLink to="/stats">Analytics</NavLink>
              </div>
            )}

            <div className="flex items-center gap-3 mt-4 sm:mt-0 ml-0 sm:ml-6 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0 w-full sm:w-auto justify-center sm:justify-start">
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
                <span className="text-sm font-medium text-gray-700">{mockUser?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-red-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

const NavLink = ({ to, children }) => (
  <Link to={to} className="text-gray-600 hover:text-indigo-600 font-medium text-sm transition-colors relative group">
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all duration-300"></span>
  </Link>
)

