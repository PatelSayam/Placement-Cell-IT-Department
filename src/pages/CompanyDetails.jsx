import React from "react";
import { useParams } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm";

const jobDetails = {
  1: {
    company: "Google",
    description: "Work on core infrastructure and scalable solutions. Open to 2025 graduates.",
    skills: "DSA, React, System Design",
    deadline: "2025-01-31",
  },
  2: {
    company: "Microsoft",
    description: "Join the product team to build next-gen productivity tools.",
    skills: "OOP, Web Dev, Cloud",
    deadline: "2025-02-10",
  },
};

const CompanyDetails = () => {
  const { id } = useParams();
  const details = jobDetails[id];

  if (!details) return <div className="p-8">Company not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{details.company}</h1>
        <p className="text-gray-700 mb-2"><strong>Role Description:</strong> {details.description}</p>
        <p className="text-gray-700 mb-2"><strong>Required Skills:</strong> {details.skills}</p>
        <p className="text-gray-700 mb-6"><strong>Deadline:</strong> {details.deadline}</p>

        <hr className="mb-6" />
        <ApplicationForm />
      </div>
    </div>
  );
};

export default CompanyDetails;
