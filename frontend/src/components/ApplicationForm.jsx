import { useState } from "react"

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
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.agree) {
      alert("Please confirm all details are correct ✅")
      return
    }

    try {
      // 🟡 MOCK API - Replace with actual Express backend later
      const response = await fetch(`/api/applications/${companyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      if (response.ok) {
        alert("✅ Application submitted successfully!")
        console.log(result)
      } else {
        alert("❌ Failed to submit application.")
        console.error(result)
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("❌ Something went wrong.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Application Form</h2>
        <p className="text-gray-500 text-sm">Complete all required fields to submit your application</p>
      </div>

      <div className="space-y-6">
        <SectionTitle icon="user">Personal Information</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            type="email"
            name="collegeEmail"
            placeholder="College Email"
            onChange={handleChange}
            required
            icon="mail"
          />
          <FormInput
            type="email"
            name="personalEmail"
            placeholder="Personal Email"
            onChange={handleChange}
            required
            icon="mail"
          />
          <FormInput
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            onChange={handleChange}
            required
            icon="identification"
          />
          <FormInput
            type="text"
            name="fullName"
            placeholder="Full Name (as per 12th)"
            onChange={handleChange}
            required
            icon="user"
          />
          <FormInput type="text" name="gender" placeholder="Gender" onChange={handleChange} required icon="user" />
          <FormInput
            type="date"
            name="dob"
            placeholder="Date of Birth"
            onChange={handleChange}
            required
            icon="calendar"
          />
        </div>

        <SectionTitle icon="academic-cap">Educational Background</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            type="text"
            name="sscResult"
            placeholder="SSC Result"
            onChange={handleChange}
            required
            icon="document"
          />
          <FormInput
            type="text"
            name="hscResult"
            placeholder="HSC Result"
            onChange={handleChange}
            required
            icon="document"
          />
          <FormInput
            type="text"
            name="diplomaResult"
            placeholder="Diploma Result (if any)"
            onChange={handleChange}
            icon="document"
          />
        </div>

        <SectionTitle icon="phone">Contact Information</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            type="text"
            name="studentContact"
            placeholder="Student Contact"
            onChange={handleChange}
            required
            icon="phone"
          />
          <FormInput
            type="text"
            name="parentContact"
            placeholder="Parent Contact"
            onChange={handleChange}
            required
            icon="phone"
          />
          <FormInput
            type="email"
            name="parentEmail"
            placeholder="Parent Email"
            onChange={handleChange}
            required
            icon="mail"
          />
          <FormInput
            type="text"
            name="permanentAddress"
            placeholder="Permanent Address"
            onChange={handleChange}
            required
            icon="location"
          />
          <FormInput type="text" name="city" placeholder="City" onChange={handleChange} required icon="location" />
          <FormInput
            type="text"
            name="pincode"
            placeholder="Pincode"
            onChange={handleChange}
            required
            icon="location"
          />
        </div>

        <SectionTitle icon="clipboard-list">Academic Status</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            type="number"
            name="backlogActive"
            placeholder="Active Backlogs"
            onChange={handleChange}
            required
            icon="document-check"
          />
          <FormInput
            type="number"
            name="backlogTotal"
            placeholder="Total Backlogs"
            onChange={handleChange}
            required
            icon="document-check"
          />
          <FormInput
            type="number"
            name="breakYears"
            placeholder="Break Years"
            onChange={handleChange}
            required
            icon="clock"
          />
          <FormInput
            type="text"
            name="breakReason"
            placeholder="Reason for Break"
            onChange={handleChange}
            icon="clipboard"
          />
          <FormInput type="text" name="category" placeholder="Category" onChange={handleChange} required icon="tag" />
          <FormInput
            type="text"
            name="quota"
            placeholder="Admission Quota"
            onChange={handleChange}
            required
            icon="tag"
          />
        </div>

        <SectionTitle icon="light-bulb">Skills & Projects</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            type="text"
            name="skills"
            placeholder="Skills & Specializations"
            onChange={handleChange}
            required
            icon="light-bulb"
          />
          <FormInput
            type="text"
            name="jobRoles"
            placeholder="Preferred Job Roles"
            onChange={handleChange}
            required
            icon="briefcase"
          />
          <FormInput
            type="text"
            name="project"
            placeholder="Project Title & Details"
            onChange={handleChange}
            required
            icon="code"
          />
          <FormInput
            type="text"
            name="certifications"
            placeholder="Certifications"
            onChange={handleChange}
            icon="badge-check"
          />
        </div>

        <SectionTitle icon="globe">Online Profiles</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput type="url" name="github" placeholder="GitHub" onChange={handleChange} icon="code" />
          <FormInput type="url" name="linkedin" placeholder="LinkedIn" onChange={handleChange} icon="globe" />
          <FormInput type="url" name="leetcode" placeholder="LeetCode" onChange={handleChange} icon="code" />
          <FormInput type="url" name="hackerrank" placeholder="HackerRank" onChange={handleChange} icon="code" />
          <FormInput type="url" name="codechef" placeholder="CodeChef" onChange={handleChange} icon="code" />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-600">I confirm all details provided are correct and complete.</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg transition-colors font-medium"
      >
        Submit Application
      </button>
    </form>
  )
}

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
      <h3 className="text-sm font-medium text-indigo-600 uppercase tracking-wider">{children}</h3>
    </div>
  )
}

const FormInput = ({ type, name, placeholder, onChange, required = false, icon }) => {
  const icons = {
    user: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    mail: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    identification: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
        />
      </svg>
    ),
    phone: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    location: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    document: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
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
    ),
    "document-check": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
    calendar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    clock: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    clipboard: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    tag: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
    "light-bulb": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    briefcase: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    code: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    "badge-check": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    globe: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
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
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icons[icon]}</div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
      />
    </div>
  )
}

export default ApplicationForm

