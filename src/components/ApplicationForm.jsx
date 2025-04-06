import React, { useState } from "react";

const ApplicationForm = ({ companyId }) => {
  const [formData, setFormData] = useState({
    collegeEmail: "",
    personalEmail: "",
    rollNo: "",
    fullName: "",
    gender: "",
    dob: "",
    sscResult: "",
    hscResult: "",
    diplomaResult: "",
    studentContact: "",
    parentContact: "",
    parentEmail: "",
    permanentAddress: "",
    city: "",
    pincode: "",
    backlogActive: "",
    backlogTotal: "",
    breakYears: "",
    breakReason: "",
    category: "",
    quota: "",
    skills: "",
    jobRoles: "",
    project: "",
    certifications: "",
    github: "",
    linkedin: "",
    leetcode: "",
    hackerrank: "",
    codechef: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      alert("Please confirm all details are correct ✅");
      return;
    }

    try {
      // 🟡 MOCK API - Replace with actual Express backend later
      const response = await fetch(`/api/applications/${companyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Application submitted successfully!");
        console.log(result);
      } else {
        alert("❌ Failed to submit application.");
        console.error(result);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("❌ Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-8 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Application Form</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="email" name="collegeEmail" placeholder="College Email" className="input" onChange={handleChange} />
        <input type="email" name="personalEmail" placeholder="Personal Email" className="input" onChange={handleChange} />
        <input type="text" name="rollNo" placeholder="Roll Number" className="input" onChange={handleChange} />
        <input type="text" name="fullName" placeholder="Full Name (as per 12th)" className="input" onChange={handleChange} />
        <input type="text" name="gender" placeholder="Gender" className="input" onChange={handleChange} />
        <input type="date" name="dob" className="input" onChange={handleChange} />
        <input type="text" name="sscResult" placeholder="SSC Result" className="input" onChange={handleChange} />
        <input type="text" name="hscResult" placeholder="HSC Result" className="input" onChange={handleChange} />
        <input type="text" name="diplomaResult" placeholder="Diploma Result (if any)" className="input" onChange={handleChange} />
        <input type="text" name="studentContact" placeholder="Student Contact" className="input" onChange={handleChange} />
        <input type="text" name="parentContact" placeholder="Parent Contact" className="input" onChange={handleChange} />
        <input type="email" name="parentEmail" placeholder="Parent Email" className="input" onChange={handleChange} />
        <input type="text" name="permanentAddress" placeholder="Permanent Address" className="input" onChange={handleChange} />
        <input type="text" name="city" placeholder="City" className="input" onChange={handleChange} />
        <input type="text" name="pincode" placeholder="Pincode" className="input" onChange={handleChange} />
        <input type="number" name="backlogActive" placeholder="Active Backlogs" className="input" onChange={handleChange} />
        <input type="number" name="backlogTotal" placeholder="Total Backlogs" className="input" onChange={handleChange} />
        <input type="number" name="breakYears" placeholder="Break Years" className="input" onChange={handleChange} />
        <input type="text" name="breakReason" placeholder="Reason for Break" className="input" onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" className="input" onChange={handleChange} />
        <input type="text" name="quota" placeholder="Admission Quota" className="input" onChange={handleChange} />
        <input type="text" name="skills" placeholder="Skills & Specializations" className="input" onChange={handleChange} />
        <input type="text" name="jobRoles" placeholder="Preferred Job Roles" className="input" onChange={handleChange} />
        <input type="text" name="project" placeholder="Project Title & Details" className="input" onChange={handleChange} />
        <input type="text" name="certifications" placeholder="Certifications" className="input" onChange={handleChange} />
        <input type="url" name="github" placeholder="GitHub" className="input" onChange={handleChange} />
        <input type="url" name="linkedin" placeholder="LinkedIn" className="input" onChange={handleChange} />
        <input type="url" name="leetcode" placeholder="LeetCode" className="input" onChange={handleChange} />
        <input type="url" name="hackerrank" placeholder="HackerRank" className="input" onChange={handleChange} />
        <input type="url" name="codechef" placeholder="CodeChef" className="input" onChange={handleChange} />
      </div>

      <label className="flex items-center mt-4">
        <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} className="mr-2" />
        <span className="text-sm text-gray-600">I confirm all details provided are correct.</span>
      </label>

      <button
        type="submit"
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Submit Application
      </button>
    </form>
  );
};

export default ApplicationForm;
