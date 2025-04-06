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
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Companies</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} onClick={() => navigate(`/company/${company.id}`)} />
        ))}
      </div>
    </div>
  );
};

export default StudentHome;
