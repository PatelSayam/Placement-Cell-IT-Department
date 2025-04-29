import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [studentData, setStudentData] = useState({
    collegeEmail: "",
    personalEmail: "",
    rollNo: "",
    collegeId: "",
    fullName: "",
    gender: "",
    dob: "",
    profilePhotoUrl: "",

    ssc: {
      result: "",
      passingYear: "",
      board: "",
      marksheetUrl: ""
    },
    hsc: {
      result: "",
      passingYear: "",
      board: "",
      marksheetUrl: ""
    },
    diploma: {
      result: "",
      boardOrUniversity: "",
      passingYear: "",
      degreePdfUrl: ""
    },

    contactNumber: "",
    parentContactNumber: "",
    parentEmail: "",
    permanentAddress: {
      addressLine: "",
      city: "",
      pincode: ""
    },

    backlogs: {
      active: "",
      total: ""
    },
    breakYears: {
      count: "",
      reason: ""
    },

    category: "",
    admissionQuota: "",

    skills: [],
    preferredRoles: [],
    projects: [],
    certifications: [],
    socialLinks: {
      github: "",
      hackerrank: "",
      leetcode: "",
      codechef: "",
      linkedin: ""
    },

    resumeUrl: "",
    detailsVerified: false
  });

  const user = useSelector((state) => state.auth.userData);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
          // Get the logged in student's ID from your auth state
          console.log("user", user)
          const studentId = user?._id;
          const email = user?.personalEmail;
          console.log("studentid", studentId)
          console.log("email", email)
  
          const response = await axios.post(
              `${import.meta.env.VITE_API_URL}/student/view-profile`,
              { _id: studentId, email:email }, // Using ID instead of hardcoded email
              {
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                  }
              }
          );
          
          if (response.data && response.data.data) {
              setStudentData(response.data.data);
          } else {
              console.error("Unexpected response format:", response);
          }
      } catch (err) {
          console.error("Failed to fetch student data:", err);
          // Optionally show error to user
          alert(err.response?.data?.message || "Failed to load profile data");
      }
  };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setStudentData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setStudentData({ ...studentData, [name]: value });
    }
  };

  const handleArrayChange = (fieldName, value) => {
    setStudentData(prev => ({
      ...prev,
      [fieldName]: value.split(',').map(item => item.trim())
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
       `${import.meta.env.VITE_API_URL}/student/update-account-details`,
        studentData
      );
      if (response.status === 200) {
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  {studentData.profilePhotoUrl ? (
                    <img 
                      src={studentData.profilePhotoUrl} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{studentData.fullName || "Student Profile"}</h2>
                  <p className="text-gray-500">{studentData.collegeEmail}</p>
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
              {/* Personal Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  disabled
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
                  label="College ID" 
                  name="collegeId" 
                  value={studentData.collegeId} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="identification"
                />
                <ProfileField 
                  label="Gender" 
                  name="gender" 
                  value={studentData.gender} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="user"
                />
                <ProfileField 
                  label="Date of Birth" 
                  name="dob" 
                  value={studentData.dob ? new Date(studentData.dob).toISOString().split('T')[0] : ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="calendar"
                  type="date"
                />
              </div>

              {/* Contact Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProfileField 
                  label="Contact Number" 
                  name="contactNumber" 
                  value={studentData.contactNumber} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="phone"
                />
                <ProfileField 
                  label="Parent Contact" 
                  name="parentContactNumber" 
                  value={studentData.parentContactNumber} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="phone"
                />
                <ProfileField 
                  label="Parent Email" 
                  name="parentEmail" 
                  value={studentData.parentEmail} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="mail"
                />
                <ProfileField 
                  label="Address" 
                  name="permanentAddress.addressLine" 
                  value={studentData.permanentAddress?.addressLine || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="location"
                />
                <ProfileField 
                  label="City" 
                  name="permanentAddress.city" 
                  value={studentData.permanentAddress?.city || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="location"
                />
                <ProfileField 
                  label="Pincode" 
                  name="permanentAddress.pincode" 
                  value={studentData.permanentAddress?.pincode || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="location"
                />
              </div>

              {/* Educational Background Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProfileField 
                  label="SSC Result (%)" 
                  name="ssc.result" 
                  value={studentData.ssc?.result || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="star"
                />
                <ProfileField 
                  label="SSC Passing Year" 
                  name="ssc.passingYear" 
                  value={studentData.ssc?.passingYear || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="calendar"
                />
                <ProfileField 
                  label="SSC Board" 
                  name="ssc.board" 
                  value={studentData.ssc?.board || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="office"
                />
                <ProfileField 
                  label="HSC Result (%)" 
                  name="hsc.result" 
                  value={studentData.hsc?.result || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="star"
                />
                <ProfileField 
                  label="HSC Passing Year" 
                  name="hsc.passingYear" 
                  value={studentData.hsc?.passingYear || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="calendar"
                />
                <ProfileField 
                  label="HSC Board" 
                  name="hsc.board" 
                  value={studentData.hsc?.board || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="office"
                />
                {studentData.diploma?.result && (
                  <>
                    <ProfileField 
                      label="Diploma Result (%)" 
                      name="diploma.result" 
                      value={studentData.diploma?.result || ''} 
                      onChange={handleChange} 
                      isEditing={isEditing} 
                      icon="star"
                    />
                    <ProfileField 
                      label="Diploma Board/University" 
                      name="diploma.boardOrUniversity" 
                      value={studentData.diploma?.boardOrUniversity || ''} 
                      onChange={handleChange} 
                      isEditing={isEditing} 
                      icon="office"
                    />
                    <ProfileField 
                      label="Diploma Passing Year" 
                      name="diploma.passingYear" 
                      value={studentData.diploma?.passingYear || ''} 
                      onChange={handleChange} 
                      isEditing={isEditing} 
                      icon="calendar"
                    />
                  </>
                )}
              </div>

              {/* Academic Status Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProfileField 
                  label="Active Backlogs" 
                  name="backlogs.active" 
                  value={studentData.backlogs?.active || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="exclamation"
                />
                <ProfileField 
                  label="Total Backlogs" 
                  name="backlogs.total" 
                  value={studentData.backlogs?.total || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="exclamation"
                />
                <ProfileField 
                  label="Break Years" 
                  name="breakYears.count" 
                  value={studentData.breakYears?.count || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="pause"
                />
                <ProfileField 
                  label="Break Reason" 
                  name="breakYears.reason" 
                  value={studentData.breakYears?.reason || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="annotation"
                />
                <ProfileField 
                  label="Category" 
                  name="category" 
                  value={studentData.category || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="tag"
                />
                <ProfileField 
                  label="Admission Quota" 
                  name="admissionQuota" 
                  value={studentData.admissionQuota || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="ticket"
                />
              </div>

              {/* Skills & Online Profiles Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField 
                  label="Skills (comma separated)" 
                  name="skills" 
                  value={studentData.skills?.join(', ') || ''} 
                  onChange={(e) => handleArrayChange('skills', e.target.value)} 
                  isEditing={isEditing} 
                  icon="light-bulb"
                />
                <ProfileField 
                  label="Preferred Roles (comma separated)" 
                  name="preferredRoles" 
                  value={studentData.preferredRoles?.join(', ') || ''} 
                  onChange={(e) => handleArrayChange('preferredRoles', e.target.value)} 
                  isEditing={isEditing} 
                  icon="briefcase"
                />
                <ProfileField 
                  label="GitHub" 
                  name="socialLinks.github" 
                  value={studentData.socialLinks?.github || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="code"
                />
                <ProfileField 
                  label="LinkedIn" 
                  name="socialLinks.linkedin" 
                  value={studentData.socialLinks?.linkedin || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="globe"
                />
                <ProfileField 
                  label="HackerRank" 
                  name="socialLinks.hackerrank" 
                  value={studentData.socialLinks?.hackerrank || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="code"
                />
                <ProfileField 
                  label="LeetCode" 
                  name="socialLinks.leetcode" 
                  value={studentData.socialLinks?.leetcode || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="code"
                />
                <ProfileField 
                  label="CodeChef" 
                  name="socialLinks.codechef" 
                  value={studentData.socialLinks?.codechef || ''} 
                  onChange={handleChange} 
                  isEditing={isEditing} 
                  icon="code"
                />
              </div>

              {/* Projects Section */}
              {studentData.projects?.map((project, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <ProfileField 
                    label="Project Title" 
                    name={`projects[${index}].title`} 
                    value={project.title || ''} 
                    onChange={handleChange} 
                    isEditing={isEditing} 
                    icon="document-text"
                  />
                  <ProfileField 
                    label="Project Description" 
                    name={`projects[${index}].description`} 
                    value={project.description || ''} 
                    onChange={handleChange} 
                    isEditing={isEditing} 
                    icon="annotation"
                    textarea
                  />
                </div>
              ))}

              {/* Certifications Section */}
              <ProfileField 
                label="Certifications (comma separated)" 
                name="certifications" 
                value={studentData.certifications?.join(', ') || ''} 
                onChange={(e) => handleArrayChange('certifications', e.target.value)} 
                isEditing={isEditing} 
                icon="certificate"
              />

              {isEditing && (
                <div className="flex justify-end pt-4">
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

const ProfileField = ({ label, name, value, onChange, isEditing, icon, type = "text", disabled = false, textarea = false }) => {
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
    ),
    "calendar": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    "star": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    "office": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    "exclamation": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    "pause": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    "annotation": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
    "tag": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    "ticket": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    "document-text": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    "certificate": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    "briefcase": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
          {textarea ? (
            <textarea
              name={name}
              value={value}
              onChange={onChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              rows={3}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              disabled={disabled}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          )}
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