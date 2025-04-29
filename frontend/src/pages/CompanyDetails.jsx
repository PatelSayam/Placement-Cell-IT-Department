import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ApplicationForm = () => {
  const location = useLocation();
  const company = location.state?.company;
  const [files, setFiles] = useState({ resume: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.userData);
  const studentId = user?._id;
  const apiUrl = import.meta.env.VITE_API_URL;
  const companyId = company?._id;
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
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          }
        }
      );

      if (response.status === 200) {
        alert("Application submitted successfully!");
        navigate("/applied");
      }
    } catch (err) {
      console.error("Application failed:", err);

      const errorMessage = err.response?.data?.message || "Failed to submit application";
      if (errorMessage === "already applied to this company") {
        alert("You have already applied to this company!");
      } else {
        alert(`Application failed: ${errorMessage}`);
      }

      navigate("/applied");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleEditJob = ()=>{
    alert("handle edit Job")
  }


  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md space-y-8">
      {/* Company Info */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">{company?.name}</h2>
        <p className="text-sm text-gray-600">Role: <span className="font-medium text-gray-800">{company?.jobRole}</span></p>
        <p className="text-gray-700">{company?.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-600">Skills Required</h4>
            <ul className="list-disc list-inside text-sm text-gray-800">
              {company?.skillsRequired?.map(skill => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-600">Eligibility</h4>
            <p className="text-sm text-gray-800">
              Min CGPA: {company?.eligibleCriteria?.minCGPA}<br />
              Backlogs Allowed: {company?.eligibleCriteria?.allowedBacklogs}<br />
              Branches: {company?.eligibleCriteria?.allowedBranches.join(", ")}<br />
              Passout Year: {company?.eligibleCriteria?.passoutYear}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-600">Other Details</h4>
            <p className="text-sm text-gray-800">
              Deadline: {new Date(company?.deadline).toLocaleDateString()}<br />
              Batch: {company?.batch}<br />
              Status: <span className={`font-semibold ${company?.status === 'active' || company?.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{company?.status}</span>
            </p>
          </div>
        </div>
      </div>

      {user?.role === "admin" ? (
        <div className="flex justify-end">
          <button
            onClick={handleEditJob} // define this function to navigate to the edit page
            className="px-6 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Edit Job
          </button>
        </div>
      ) : (
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
              className={`px-6 py-2 rounded-lg font-medium text-white ${isSubmitting
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default ApplicationForm;
