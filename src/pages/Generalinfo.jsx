import React, { useState } from "react";

const GeneralInfo = () => {
  const [form, setForm] = useState({
    collegeEmail: "",
    personalEmail: "",
    rollNo: "",
    collegeId: "",
    fullName: "",
    gender: "",
    dob: "",
    sscResult: "",
    sscYear: "",
    sscBoard: "",
    hscResult: "",
    hscYear: "",
    hscBoard: "",
    diplomaResult: "",
    diplomaBoard: "",
    diplomaYear: "",
    studentContact: "",
    parentContact: "",
    parentEmail: "",
    address: "",
    city: "",
    pincode: "",
    activeBacklogs: "",
    totalBacklogs: "",
    breakYears: "",
    breakReason: "",
    category: "",
    admissionQuota: "",
    skills: "",
    preferredRoles: "",
    projectTitle: "",
    projectDetails: "",
    certifications: "",
    github: "",
    hackerrank: "",
    leetcode: "",
    codechef: "",
    linkedin: "",
    confirmed: false,
  });

  const [files, setFiles] = useState({
    passportPhoto: null,
    sscMarksheet: null,
    hscMarksheet: null,
    diplomaDegree: null,
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.confirmed) {
      alert("✅ Please confirm the data authenticity checkbox!");
      return;
    }
    // 👉 Send form and files to backend here via API
    alert("🎉 Info submitted successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl my-10">
      <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">General Information Form</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="College Email" name="collegeEmail" value={form.collegeEmail} onChange={handleChange} />
        <Input label="Personal Email" name="personalEmail" value={form.personalEmail} onChange={handleChange} />
        <Input label="Roll No" name="rollNo" value={form.rollNo} onChange={handleChange} />
        <Input label="College ID" name="collegeId" value={form.collegeId} onChange={handleChange} />
        <Input label="Full Name (as per 12th)" name="fullName" value={form.fullName} onChange={handleChange} />
        <Select label="Gender" name="gender" value={form.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
        <Input label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
        <FileInput label="Passport Size Photo" name="passportPhoto" onChange={handleFileChange} />

        <Input label="SSC Result (%)" name="sscResult" value={form.sscResult} onChange={handleChange} />
        <Input label="SSC Passing Year" name="sscYear" value={form.sscYear} onChange={handleChange} />
        <Input label="SSC Board" name="sscBoard" value={form.sscBoard} onChange={handleChange} />
        <FileInput label="SSC Marksheet (PDF)" name="sscMarksheet" onChange={handleFileChange} />

        <Input label="HSC Result (%)" name="hscResult" value={form.hscResult} onChange={handleChange} />
        <Input label="HSC Passing Year" name="hscYear" value={form.hscYear} onChange={handleChange} />
        <Input label="HSC Board" name="hscBoard" value={form.hscBoard} onChange={handleChange} />
        <FileInput label="HSC Marksheet (PDF)" name="hscMarksheet" onChange={handleFileChange} />

        <Input label="Diploma Result (%)" name="diplomaResult" value={form.diplomaResult} onChange={handleChange} />
        <Input label="Diploma Board/University" name="diplomaBoard" value={form.diplomaBoard} onChange={handleChange} />
        <Input label="Diploma Passing Year" name="diplomaYear" value={form.diplomaYear} onChange={handleChange} />
        <FileInput label="Diploma Degree (PDF)" name="diplomaDegree" onChange={handleFileChange} />

        <Input label="Student Contact Number" name="studentContact" value={form.studentContact} onChange={handleChange} />
        <Input label="Parent Contact Number" name="parentContact" value={form.parentContact} onChange={handleChange} />
        <Input label="Parent Email" name="parentEmail" value={form.parentEmail} onChange={handleChange} />
        <Input label="Permanent Address" name="address" value={form.address} onChange={handleChange} />
        <Input label="City" name="city" value={form.city} onChange={handleChange} />
        <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
        <Input label="Active Backlogs" name="activeBacklogs" value={form.activeBacklogs} onChange={handleChange} />
        <Input label="Total Backlogs (Active + Cleared)" name="totalBacklogs" value={form.totalBacklogs} onChange={handleChange} />
        <Input label="Academic Break Years" name="breakYears" value={form.breakYears} onChange={handleChange} />
        <Input label="Reason for Break" name="breakReason" value={form.breakReason} onChange={handleChange} />
        <Input label="Category" name="category" value={form.category} onChange={handleChange} />
        <Input label="Admission Quota" name="admissionQuota" value={form.admissionQuota} onChange={handleChange} />
        <Input label="Additional Skills & Specialization" name="skills" value={form.skills} onChange={handleChange} />
        <Input label="Preferred Job Roles" name="preferredRoles" value={form.preferredRoles} onChange={handleChange} />
        <Input label="Project Title" name="projectTitle" value={form.projectTitle} onChange={handleChange} />
        <Input label="Project Details" name="projectDetails" value={form.projectDetails} onChange={handleChange} />
        <Input label="Certifications (comma-separated)" name="certifications" value={form.certifications} onChange={handleChange} />

        <Input label="GitHub" name="github" value={form.github} onChange={handleChange} />
        <Input label="HackerRank" name="hackerrank" value={form.hackerrank} onChange={handleChange} />
        <Input label="LeetCode" name="leetcode" value={form.leetcode} onChange={handleChange} />
        <Input label="CodeChef" name="codechef" value={form.codechef} onChange={handleChange} />
        <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} />
        <FileInput label="Resume (PDF)" name="resume" onChange={handleFileChange} />

        <div className="col-span-full flex items-start gap-2">
          <input type="checkbox" name="confirmed" checked={form.confirmed} onChange={handleChange} />
          <label className="text-sm text-gray-600">
            I hereby confirm that all the above details are valid and correct to the best of my knowledge.
          </label>
        </div>

        <div className="col-span-full">
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
            Submit Information
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable Components
const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <select name={name} value={value} onChange={onChange} className="w-full border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const FileInput = ({ label, name, onChange }) => (
  <div>
    <label className="block text-sm text-gray-700 mb-1">{label}</label>
    <input type="file" name={name} accept=".pdf,image/*" onChange={onChange} className="w-full text-sm" />
  </div>
);

export default GeneralInfo;
