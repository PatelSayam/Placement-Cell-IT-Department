import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ApplicationForm = ({ company }) => {  // Removed the 'key' prop
  const [files, setFiles] = useState({
    resume: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  console.log("company", company)
  // Get student ID from Redux store
  const user = useSelector((state) => state.auth.userData);
  const studentId = user?._id;
  const apiUrl = import.meta.env.VITE_API_URL;

  // Get companyId from the company prop
  const companyId = company?.id;

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!files.resume) {
      setError("Please upload your resume");
      setIsSubmitting(false);
      return;
    }

    if (!companyId) {
      setError("Company information is missing");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", files.resume);
      formData.append("studentId", studentId);
      formData.append("companyId", companyId);

      const response = await axios.post(
        `${apiUrl}/application/apply/${companyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      if (response.status === 200) {
        alert("Application submitted successfully!");
        navigate("/applications");
      }
    } catch (err) {
      console.error("Application failed:", err);
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        Apply to {company?.name || "this company"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF only)
          </label>
          <input
            type="file"
            name="resume"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload your most recent resume in PDF format
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg font-medium text-white ${
              isSubmitting
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;