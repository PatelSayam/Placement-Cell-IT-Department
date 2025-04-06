import React from "react";

const CompanyCard = ({ company, onClick }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:scale-105 transition"
      onClick={onClick}
    >
      <img src={company.logo} alt={company.name} className="w-20 h-20 object-contain mb-4 mx-auto" />
      <h3 className="text-xl font-semibold text-center">{company.name}</h3>
      <p className="text-gray-600 text-center">{company.role}</p>
      <p className="text-gray-500 text-center">{company.location}</p>
      <p className="text-green-600 text-center font-bold mt-2">{company.ctc}</p>
    </div>
  );
};

export default CompanyCard;
