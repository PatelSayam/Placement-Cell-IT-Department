import { useState } from "react"
import { useSelector } from "react-redux"
import axios from 'axios';

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
  })

  const [files, setFiles] = useState({
    passportPhoto: null,
    sscMarksheet: null,
    hscMarksheet: null,
    diplomaDegree: null,
    resume: null,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFiles((prev) => ({ ...prev, [name]: files[0] }))
  }

  const user = useSelector((state) => state.auth.userData);
  console.log("USER",user._id)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!form.confirmed) {
      alert("✅ Please confirm the data authenticity checkbox!");
      return;
    }
  
    try {
      const formData = new FormData();
  
      // Append all form fields
      formData.append('collegeEmail', form.collegeEmail);
      formData.append('personalEmail', form.personalEmail);
      formData.append('rollNo', form.rollNo);
      formData.append('fullName', form.fullName);
      formData.append('gender', form.gender);
      formData.append('contactNumber', form.contactNumber);
      formData.append('parentContactNumber', form.parentContactNumber);
      formData.append('sscResult', form.sscResult);
      formData.append('sscPassingYear', form.sscPassingYear);
      formData.append('hscResult', form.hscResult);
      formData.append('hscPassingYear', form.hscPassingYear);
      formData.append('addressLine', form.addressLine);
      formData.append('city', form.city);
      formData.append('pincode', form.pincode);
      formData.append('activeBacklogs', form.activeBacklogs);
      formData.append('totalBacklogs', form.totalBacklogs);
      formData.append('skills', form.skills); // comma-separated string
      formData.append('preferredRoles', form.preferredRoles); // comma-separated string
      formData.append('github', form.github);
      formData.append('linkedin', form.linkedin);
  
      // For projects (Array of objects), stringify before appending
      formData.append('projects', JSON.stringify(form.projects));
      formData.append('userId', user._id)
  
      // Make the API request
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/student/update-account-details`, formData);

      if (response.status === 200) {
        alert("🎉 Info submitted successfully!");
      } else {
        console.error(response.data);
        alert(`❌ Failed to submit: ${response.data.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error(error);
      alert(`❌ Failed to submit: ${error.response?.data?.message || 'Something went wrong.'}`);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-indigo-100 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-50 rounded-tr-full opacity-50"></div>

        <div className="relative p-8">
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Complete Your Profile</h1>
            <p className="text-gray-500 mt-2">Please provide your information accurately for placement opportunities</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <SectionTitle icon="user">Personal Information</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Full Name (as per 12th)"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
              <Input
                label="College Email"
                name="collegeEmail"
                type="email"
                value={form.collegeEmail}
                onChange={handleChange}
                required
              />
              <Input
                label="Personal Email"
                name="personalEmail"
                type="email"
                value={form.personalEmail}
                onChange={handleChange}
                required
              />
              <Input label="Roll No" name="rollNo" value={form.rollNo} onChange={handleChange} required />
              <Input label="College ID" name="collegeId" value={form.collegeId} onChange={handleChange} required />
              <Select
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                options={["Male", "Female", "Other"]}
                required
              />
              <Input label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} required />
              <FileInput label="Passport Size Photo" name="passportPhoto" onChange={handleFileChange} required />
            </div>

            <SectionTitle icon="academic-cap">Educational Background</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input label="SSC Result (%)" name="sscResult" value={form.sscResult} onChange={handleChange} required />
              <Input label="SSC Passing Year" name="sscYear" value={form.sscYear} onChange={handleChange} required />
              <Input label="SSC Board" name="sscBoard" value={form.sscBoard} onChange={handleChange} required />
              <FileInput label="SSC Marksheet (PDF)" name="sscMarksheet" onChange={handleFileChange} required />

              <Input label="HSC Result (%)" name="hscResult" value={form.hscResult} onChange={handleChange} required />
              <Input label="HSC Passing Year" name="hscYear" value={form.hscYear} onChange={handleChange} required />
              <Input label="HSC Board" name="hscBoard" value={form.hscBoard} onChange={handleChange} required />
              <FileInput label="HSC Marksheet (PDF)" name="hscMarksheet" onChange={handleFileChange} required />

              <Input
                label="Diploma Result (%)"
                name="diplomaResult"
                value={form.diplomaResult}
                onChange={handleChange}
              />
              <Input
                label="Diploma Board/University"
                name="diplomaBoard"
                value={form.diplomaBoard}
                onChange={handleChange}
              />
              <Input label="Diploma Passing Year" name="diplomaYear" value={form.diplomaYear} onChange={handleChange} />
              <FileInput label="Diploma Degree (PDF)" name="diplomaDegree" onChange={handleFileChange} />
            </div>

            <SectionTitle icon="phone">Contact Information</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Student Contact Number"
                name="studentContact"
                value={form.studentContact}
                onChange={handleChange}
                required
              />
              <Input
                label="Parent Contact Number"
                name="parentContact"
                value={form.parentContact}
                onChange={handleChange}
                required
              />
              <Input
                label="Parent Email"
                name="parentEmail"
                type="email"
                value={form.parentEmail}
                onChange={handleChange}
                required
              />
              <Input label="Permanent Address" name="address" value={form.address} onChange={handleChange} required />
              <Input label="City" name="city" value={form.city} onChange={handleChange} required />
              <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} required />
            </div>

            <SectionTitle icon="clipboard-list">Academic Status</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input
                label="Active Backlogs"
                name="activeBacklogs"
                value={form.activeBacklogs}
                onChange={handleChange}
                required
              />
              <Input
                label="Total Backlogs (Active + Cleared)"
                name="totalBacklogs"
                value={form.totalBacklogs}
                onChange={handleChange}
                required
              />
              <Input
                label="Academic Break Years"
                name="breakYears"
                value={form.breakYears}
                onChange={handleChange}
                required
              />
              <Input label="Reason for Break" name="breakReason" value={form.breakReason} onChange={handleChange} />
              <Input label="Category" name="category" value={form.category} onChange={handleChange} required />
              <Input
                label="Admission Quota"
                name="admissionQuota"
                value={form.admissionQuota}
                onChange={handleChange}
                required
              />
            </div>

            <SectionTitle icon="light-bulb">Skills & Projects</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Additional Skills & Specialization"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                required
              />
              <Input
                label="Preferred Job Roles"
                name="preferredRoles"
                value={form.preferredRoles}
                onChange={handleChange}
                required
              />
              <Input
                label="Project Title"
                name="projectTitle"
                value={form.projectTitle}
                onChange={handleChange}
                required
              />
              <Input
                label="Project Details"
                name="projectDetails"
                value={form.projectDetails}
                onChange={handleChange}
                required
              />
              <Input
                label="Certifications (comma-separated)"
                name="certifications"
                value={form.certifications}
                onChange={handleChange}
              />
              <FileInput label="Resume (PDF)" name="resume" onChange={handleFileChange} required />
            </div>

            <SectionTitle icon="globe">Online Profiles</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input label="GitHub" name="github" value={form.github} onChange={handleChange} />
              <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} />
              <Input label="LeetCode" name="leetcode" value={form.leetcode} onChange={handleChange} />
              <Input label="HackerRank" name="hackerrank" value={form.hackerrank} onChange={handleChange} />
              <Input label="CodeChef" name="codechef" value={form.codechef} onChange={handleChange} />
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirmed"
                  name="confirmed"
                  checked={form.confirmed}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label htmlFor="confirmed" className="text-sm text-gray-600">
                  I hereby confirm that all the above details are valid and correct to the best of my knowledge. I
                  understand that providing false information may result in disqualification from the placement process.
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Submit Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Reusable Components
const SectionTitle = ({ children, icon }) => {
  const icons = {
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    "academic-cap": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      </svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    "clipboard-list": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    "light-bulb": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    globe: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  }

  return (
    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">{icons[icon]}</div>
      <h2 className="text-lg font-semibold text-gray-800">{children}</h2>
    </div>
  )
}

const Input = ({ label, name, value, onChange, type = "text", required = false }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-200 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
    />
  </div>
)

const Select = ({ label, name, value, onChange, options, required = false }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-200 px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
)

const FileInput = ({ label, name, onChange, required = false }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="file"
      name={name}
      accept=".pdf,image/*"
      onChange={onChange}
      required={required}
      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
    />
  </div>
)

export default GeneralInfo

