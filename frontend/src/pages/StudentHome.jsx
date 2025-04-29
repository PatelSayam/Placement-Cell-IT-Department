import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyCard from "../components/CompanyCard";
import axios from "axios";

const StudentHome = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${apiUrl}/admin/companies`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });        
        setCompanies(response.data.data);
      } catch (err) {
        console.log(err)
        setError(err.response?.data?.message || 'Failed to fetch companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [apiUrl]);

  if (loading) return <div>Loading companies...</div>;
  if (error) return <div className="text-red-500">{error}</div>;


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
              key={company._id} 
              company={company} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentHome;
