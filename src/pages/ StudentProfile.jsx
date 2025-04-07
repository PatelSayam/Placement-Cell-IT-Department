import React, { useEffect, useState } from "react";

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [studentData, setStudentData] = useState({
    fullName: "",
    collegeEmail: "",
    personalEmail: "",
    rollNo: "",
    contact: "",
    parentContact: "",
    address: "",
    city: "",
    pincode: "",
    skills: "",
    github: "",
    linkedin: "",
  });

  useEffect(() => {
    // Fetch mock data from future backend endpoint
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/student/profile");
        const data = await res.json();
        setStudentData(data);
      } catch (err) {
        console.error("Failed to fetch student data:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData),
      });
      if (res.ok) {
        alert("✅ Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert("❌ Failed to update profile.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Something went wrong while updating.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-50 rounded-tr-full opacity-50"></div>
          
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
                  <p className="text-gray-500">Manage your personal information</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isEditing 
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800" 
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                }`}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField 
                  label="Full Name" 
                  name="fullName" 
                  value={studentData.fullName} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="user"
                />
                <ProfileField 
                  label="College Email" 
                  name="collegeEmail" 
                  value={studentData.collegeEmail} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="mail"
                />
                <ProfileField 
                  label="Personal Email" 
                  name="personalEmail" 
                  value={studentData.personalEmail} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="mail"
                />
                <ProfileField 
                  label="Roll No" 
                  name="rollNo" 
                  value={studentData.rollNo} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="identification"
                />
                <ProfileField 
                  label="Contact" 
                  name="contact" 
                  value={studentData.contact} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="phone"
                />
                <ProfileField 
                  label="Parent Contact" 
                  name="parentContact" 
                  value={studentData.parentContact} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="phone"
                />
                <ProfileField 
                  label="Address" 
                  name="address" 
                  value={studentData.address} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="location"
                />
                <ProfileField 
                  label="City" 
                  name="city" 
                  value={studentData.city} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="location"
                />
                <ProfileField 
                  label="Pincode" 
                  name="pincode" 
                  value={studentData.pincode} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="location"
                />
                <ProfileField 
                  label="Skills" 
                  name="skills" 
                  value={studentData.skills} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="light-bulb"
                />
                <ProfileField 
                  label="GitHub" 
                  name="github" 
                  value={studentData.github} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="code"
                />
                <ProfileField 
                  label="LinkedIn" 
                  name="linkedin" 
                  value={studentData.linkedin} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="globe"
                />
              </div>
              
              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, name, value, onChange, isEditing, icon }) => {
  const icons = {
    "user": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    "mail": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    "identification": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      </svg>
    ),
    "phone": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    "location": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    "light-bulb": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    "code": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    "globe": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isEditing ? (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icons[icon]}
          </div>
          <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          />
        </div>
      ) : (
        <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg text-gray-800 border border-gray-100">
          <span className="mr-3">{icons[icon]}</span>
          <span>{value || <span className="text-gray-400">Not provided</span>}</span>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
