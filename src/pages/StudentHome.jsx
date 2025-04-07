import React from "react";
import { useNavigate } from "react-router-dom";
import CompanyCard from "../components/CompanyCard";

const companies = [
  {
    id: 1,
    name: "Google",
    role: "SDE Intern",
    location: "Bangalore",
    ctc: "12 LPA",
    logo: "https://logo.clearbit.com/google.com",
  },
  {
    id: 2,
    name: "Microsoft",
    role: "Product Intern",
    location: "Hyderabad",
    ctc: "11 LPA",
    logo: "https://logo.clearbit.com/microsoft.com",
  },
];

const StudentHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-2xl"></div>
            <div className="w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl -ml-10"></div>
          </div>
          <div className="relative">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Available Opportunities
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore and apply to the latest placement opportunities from top companies
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard 
              key={company.id} 
              company={company} 
              onClick={() => navigate(`/company/${company.id}`)} 
            />
          ))}
        </div>
        
        <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gray-800">Looking for more opportunities?</h2>
              <p className="text-gray-600">Check back regularly as new companies are added daily</p>
            </div>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors"
              onClick={() => navigate('/all-companies')}
            >
              View All Companies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
