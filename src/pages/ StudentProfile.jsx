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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Student Profile</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Full Name", name: "fullName" },
            { label: "College Email", name: "collegeEmail" },
            { label: "Personal Email", name: "personalEmail" },
            { label: "Roll No", name: "rollNo" },
            { label: "Contact", name: "contact" },
            { label: "Parent Contact", name: "parentContact" },
            { label: "Address", name: "address" },
            { label: "City", name: "city" },
            { label: "Pincode", name: "pincode" },
            { label: "Skills", name: "skills" },
            { label: "GitHub", name: "github" },
            { label: "LinkedIn", name: "linkedin" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={studentData[field.name]}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg ${
                  isEditing
                    ? "bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    : "bg-gray-100 cursor-not-allowed"
                }`}
              />
            </div>
          ))}
          {isEditing && (
            <div className="md:col-span-2 text-right">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
