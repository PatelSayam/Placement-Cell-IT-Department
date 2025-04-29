import { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import CompanyCard from "../components/CompanyCard"
import AddCompanyModal from "../components/AddCompanyModal"

const CompaniesManagement = () => {
  const [companies, setCompanies] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)

  // Fetch all companies on component mount
  useEffect(() => {
    fetchCompanies()
  }, [])

  // Watch for status filter changes to trigger Excel export
  useEffect(() => {
    if (statusFilter !== "All") {
      // Only auto-export when a specific status is selected
      exportToExcel(getFilteredCompanies())
    }
  }, [statusFilter])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/v1/admin/companies")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.statusCode === 200 && data.data) {
        setCompanies(data.data)
      } else {
        throw new Error(data.message || "Failed to fetch companies")
      }
    } catch (err) {
      console.error("Error fetching companies:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Get filtered companies based on search term and status
  const getFilteredCompanies = () => {
    return companies.filter((company) => {
      const matchesSearch =
        (company.name && company.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === "All" || company.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }

  // Function to export companies to Excel
  const exportToExcel = async (companiesToExport) => {
    if (companiesToExport.length === 0) return

    setExportLoading(true)
    try {
      // Create an array to hold the company data
      const excelData = companiesToExport.map((company) => ({
        "Company Name": company.name || "N/A",
        Industry: company.industry || "N/A",
        Location: company.location || "N/A",
        Website: company.website || "N/A",
        Status: company.status || "N/A",
        Description: company.description || "N/A",
        "Contact Person": company.contactPerson || "N/A",
        "Contact Email": company.contactEmail || "N/A",
        "Contact Phone": company.contactPhone || "N/A",
        "Job Roles": Array.isArray(company.jobRoles) ? company.jobRoles.join(", ") : "N/A",
        "Package Offered": company.packageOffered || "N/A",
        "Eligibility Criteria": company.eligibilityCriteria || "N/A",
        "Application Deadline": company.applicationDeadline
          ? new Date(company.applicationDeadline).toLocaleDateString()
          : "N/A",
        "Interview Date": company.interviewDate ? new Date(company.interviewDate).toLocaleDateString() : "N/A",
        "Created At": company.createdAt ? new Date(company.createdAt).toLocaleDateString() : "N/A",
        "Updated At": company.updatedAt ? new Date(company.updatedAt).toLocaleDateString() : "N/A",
      }))

      // Create a worksheet from the data
      const worksheet = XLSX.utils.json_to_sheet(excelData)

      // Create a workbook and add the worksheet
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Companies")

      // Generate Excel file name based on status filter
      const fileName = `Companies_${statusFilter === "All" ? "All" : statusFilter}_${new Date().toISOString().split("T")[0]}.xlsx`

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, fileName)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Failed to export companies to Excel. Please try again.")
    } finally {
      setExportLoading(false)
    }
  }

  // Function to add a new company
  const handleAddCompany = async (newCompany) => {
    try {
      const response = await fetch("http://localhost:8000/v1/admin/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(newCompany),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.statusCode === 201 && data.data) {
        // Refresh the companies list after adding a new one
        fetchCompanies()
        setIsAddModalOpen(false)
      } else {
        throw new Error(data.message || "Failed to add company")
      }
    } catch (err) {
      console.error("Error adding company:", err)
      alert("Failed to add company: " + err.message)
    }
  }

  // Function to delist (delete) a company
  const handleDelistCompany = async (companyId) => {
    if (!confirm("Are you sure you want to delist this company?")) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/v1/admin/companies/${companyId}/delist`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.statusCode === 200) {
        // Refresh the companies list after delisting
        fetchCompanies()
      } else {
        throw new Error(data.message || "Failed to delist company")
      }
    } catch (err) {
      console.error("Error delisting company:", err)
      alert("Failed to delist company: " + err.message)
    }
  }

  // Manual export button handler
  const handleManualExport = () => {
    exportToExcel(getFilteredCompanies())
  }

  // Get filtered companies for rendering
  const filteredCompanies = getFilteredCompanies()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Company Management</h1>
            <p className="text-gray-500">Manage companies and job opportunities</p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              onClick={handleManualExport}
              disabled={exportLoading || companies.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
            >
              {exportLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    ></path>
                  </svg>
                  Export to Excel
                </>
              )}
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Company
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search companies..."
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {exportLoading && (
          <div className="mt-4 mb-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center">
            <svg
              className="animate-spin mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Preparing Excel export for companies... This may take a moment.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>Error: {error}</p>
            <button
              onClick={fetchCompanies}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company._id}
                company={company}
                onClick={() => {}}
                onDelete={() => handleDelistCompany(company._id)}
              />
            ))}

            {filteredCompanies.length === 0 && (
              <div className="col-span-full bg-white rounded-xl shadow-md p-8 text-center border border-indigo-100">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Companies Found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}

        {isAddModalOpen && (
          <AddCompanyModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddCompany={handleAddCompany}
          />
        )}
      </div>
    </div>
  )
}

export default CompaniesManagement
