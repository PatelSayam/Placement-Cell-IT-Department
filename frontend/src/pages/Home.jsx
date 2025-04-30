import { Link, NavLink } from "react-router-dom"
import logo from '../assets/logo.png'

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="w-full py-4 px-6 flex justify-between items-center relative z-10">
        {/* Empty space where additional nav items would go */}
        <div></div>

        {/* Login Button */}
        <NavLink to="/login">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Sign In
          </button>
        </NavLink>
      </nav>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-100 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full opacity-30 translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        {/* Logo Container */}
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-2xl w-full relative border border-indigo-100 flex flex-col items-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-tr-full opacity-50"></div>

          {/* Logo */}
          <div className="w-32 h-32 bg-gradient-to-br from-white-500 to-white-600 rounded-full mb-8 flex items-center justify-center">
            <img src={logo} alt="ddu" />
          </div>

          {/* Website Name */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Placement Cell, IT Department</h1>
          <p className="text-gray-500 text-center max-w-md mb-8">
            Empowering students and educators with innovative learning solutions
          </p>

          {/* CTA Button */}
          <NavLink to="/login" className="w-full max-w-xs">
            <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg transition-colors font-medium text-lg">
              Get Started
            </button>
          </NavLink>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm relative z-10">
        &copy; {new Date().getFullYear()} Learning Platform. All rights reserved.
      </footer>
    </div>
  )
}

export default Home
