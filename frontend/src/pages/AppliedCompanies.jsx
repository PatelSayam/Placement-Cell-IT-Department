import { useEffect, useState } from "react"
import axios from "axios"

const AppliedCompanies = () => {
  const [appliedCompanies, setAppliedCompanies] = useState([])

  useEffect(() => {
    const fetchAppliedCompanies = async () => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/application/companies/applied`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })
    
        const responseData = res.data
        console.log("RESPONSE DATA", responseData)
        
        if (responseData.success) {
          // Ensure each application has a unique identifier
          const companiesWithIds = responseData.data.map((app, index) => ({
            ...app,
            // Use existing applicationId or create a fallback using index
            applicationId: app.applicationId || `app-${index}-${Date.now()}`
          }))
          setAppliedCompanies(companiesWithIds)
        } else {
          console.error("Error fetching companies:", responseData.message)
        }
      } catch (err) {
        console.error("Failed to fetch applied companies:", err)
      }
    }
    fetchAppliedCompanies()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-2xl"></div>
            <div className="w-32 h-32 bg-purple-100 rounded-full opacity-50 blur-2xl -ml-10"></div>
          </div>
          <div className="relative">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Applied Companies</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Track the status of your applications and stay updated on your placement journey
            </p>
          </div>
        </div>

        {appliedCompanies.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-indigo-100">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-indigo-500"
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
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Applications Yet</h3>
            <p className="text-gray-500">Start exploring opportunities and apply to companies!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedCompanies.map((app) => (
              <div
                key={app.applicationId} // Ensure this is unique
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-indigo-100"
              >
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="p-6">
                  {app.companyLogo && (
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center p-2 border border-indigo-100">
                        <img
                          src={app.companyLogo || "/placeholder.svg"}
                          alt={`${app.companyName} logo`}
                          className="h-12 w-auto object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <h2 className="text-xl font-semibold text-gray-800 text-center mb-1">{app.companyName}</h2>

                  <p className="text-gray-500 text-center mb-4">{app.jobRole}</p>

                  <div className="flex justify-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                        app.status === "Accepted"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : app.status === "Rejected"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppliedCompanies