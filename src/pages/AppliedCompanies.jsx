import React, { useEffect, useState } from "react";

const AppliedCompanies = () => {
  const [appliedCompanies, setAppliedCompanies] = useState([]);

  useEffect(() => {
    // Fetch mock data from backend endpoint
    const fetchAppliedCompanies = async () => {
      try {
        const res = await fetch("/api/student/applied-companies");
        const data = await res.json();
        setAppliedCompanies(data);
      } catch (err) {
        console.error("Failed to fetch applied companies:", err);
      }
    };
    fetchAppliedCompanies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Applied Companies
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {appliedCompanies.map((app) => (
          <div
            key={app.applicationId}
            className="bg-white rounded-2xl shadow-md p-5 text-center"
          >
            {app.companyLogo && (
              <img
                src={app.companyLogo}
                alt={`${app.companyName} logo`}
                className="h-16 mx-auto mb-3"
              />
            )}
            <h2 className="text-lg font-semibold text-gray-800">
              {app.companyName}
            </h2>
            <p className="text-sm text-gray-500 mb-3">{app.jobRole}</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                app.status === "Accepted"
                  ? "bg-green-100 text-green-700"
                  : app.status === "Rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedCompanies;
