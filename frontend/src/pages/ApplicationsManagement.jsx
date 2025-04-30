"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import * as XLSX from "xlsx"
import ApplicationsTable from "../components/ApplicationsTable"
import ApplicationFilters from "../components/ApplicationFilters"
import ApplicationDetailsModal from "../components/ApplicationDetailsModal"
import ExportColumnsModal from "../components/ExportColumnsModal"

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    company: "All",
    status: "All",
    dateRange: "All",
  })

  // Define all possible columns for export
  const allExportColumns = [
    "Student Name",
    "Student ID",
    "College Email",
    "Personal Email",
    "Company",
    "Role",
    "Applied Date",
    "Status",
    "Resume URL",
    "CGPA",
    "Branch",
    "Skills",
    "Phone",
    "Address",
    "LinkedIn",
    "GitHub",
    "Portfolio",
  ]

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications()
  }, [])

  // Watch for company filter changes to trigger Excel export
  useEffect(() => {
    if (filters.company !== "All") {
      // Instead of directly exporting, open the column selection modal
      setIsExportModalOpen(true)
    }
  }, [filters.company])

  // Fetch applications from API
  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      // Get token from localStorage
      const token = localStorage.getItem("accessToken")

      // Make API request with authorization header
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/application/applicants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response.data)

      const data = response.data.data || []
      setApplications(data)
      setFilteredApplications(data)
    } catch (err) {
      console.error("Error fetching applications:", err)
      setError("Failed to load applications. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Function to fetch student details
  const fetchStudentDetails = async (studentId) => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/student/view-profile`, {
        _id:studentId
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data.data
    } catch (error) {
      console.error(`Error fetching details for student ${studentId}:`, error)
      return null
    }
  }

  // Function to export applications to Excel with selected columns
  const exportToExcel = async (applicationsToExport, selectedColumns) => {
    if (applicationsToExport.length === 0 || selectedColumns.length === 0) return

    setExportLoading(true)
    try {
      // Create an array to hold the enriched application data
      const enrichedData = []

      // Fetch student details for each application
      for (const app of applicationsToExport) {
        const studentId = app.studentId?._id || app.studentId

        // Fetch student details
        const studentDetails = await fetchStudentDetails(studentId)
        
        // Create a complete data object with all possible fields
        const completeData = {
          "Student Name": app.studentId?.fullName || studentDetails?.fullName || "N/A",
          "Student ID": studentId || "N/A",
          "College Email": studentDetails?.collegeEmail || "N/A",
          "Personal Email": studentDetails?.personalEmail || "N/A",
          "Company": app.companyId?.name || "N/A",
          "Role": app.companyDetails?.jobRole || app.role || "N/A",
          "Applied Date": app.appliedDate
            ? new Date(app.appliedDate).toLocaleDateString()
            : new Date(app.createdAt || Date.now()).toLocaleDateString(),
          "Status": app.status || "N/A",
          "Resume URL": app?.resume || "N/A",
          "CGPA": studentDetails?.cgpa || "N/A",
          "Branch": studentDetails?.branch || "N/A",
          "Skills": studentDetails?.skills?.join(", ") || "N/A",
          "Phone": studentDetails?.contactNumber || "N/A",
          "Address": studentDetails?.permanentAddress?.addressLine + 
                    (studentDetails?.permanentAddress?.city ? ", " + studentDetails.permanentAddress.city : "") + 
                    (studentDetails?.permanentAddress?.pincode ? ", " + studentDetails.permanentAddress.pincode : "") || "N/A",
          "LinkedIn": studentDetails?.socialLinks?.linkedin || "N/A",
          "GitHub": studentDetails?.socialLinks?.github || "N/A",
          "Portfolio": studentDetails?.portfolio || "N/A",
        }
        
        // Create a filtered object with only the selected columns
        const filteredData = {}
        selectedColumns.forEach(column => {
          filteredData[column] = completeData[column]
        })

        enrichedData.push(filteredData)
      }

      // Create a worksheet from the enriched data
      const worksheet = XLSX.utils.json_to_sheet(enrichedData)

      // Create a workbook and add the worksheet
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Applications")

      // Generate Excel file name based on company filter
      const companyName = filters.company === "All" ? "All_Companies" : filters.company
      const fileName = `${companyName}_Applications_${new Date().toISOString().split("T")[0]}.xlsx`

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, fileName)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Failed to export applications to Excel. Please try again.")
    } finally {
      setExportLoading(false)
    }
  }

  // Function to handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  // Apply filters
  const applyFilters = (filterOptions) => {
    let result = [...applications]

    // Apply company filter
    if (filterOptions.company !== "All") {
      result = result.filter(
        (app) =>
          app.companyDetails?.name === filterOptions.company ||
          app.companyName === filterOptions.company ||
          app.companyId?.name === filterOptions.company,
      )
    }

    // Apply status filter
    if (filterOptions.status !== "All") {
      result = result.filter((app) => app.status === filterOptions.status)
    }

    // Apply date range filter
    if (filterOptions.dateRange !== "All") {
      const today = new Date()
      const oneDay = 24 * 60 * 60 * 1000

      if (filterOptions.dateRange === "Last 7 Days") {
        const lastWeek = new Date(today.getTime() - 7 * oneDay)
        result = result.filter((app) => {
          const appDate = new Date(app.appliedDate || app.createdAt)
          return appDate >= lastWeek
        })
      } else if (filterOptions.dateRange === "Last 30 Days") {
        const lastMonth = new Date(today.getTime() - 30 * oneDay)
        result = result.filter((app) => {
          const appDate = new Date(app.appliedDate || app.createdAt)
          return appDate >= lastMonth
        })
      } else if (filterOptions.dateRange === "Last 90 Days") {
        const lastQuarter = new Date(today.getTime() - 90 * oneDay)
        result = result.filter((app) => {
          const appDate = new Date(app.appliedDate || app.createdAt)
          return appDate >= lastQuarter
        })
      }
    }

    setFilteredApplications(result)
  }

  // Function to view application details
  const viewApplicationDetails = (application) => {
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  // Function to update application status
  const updateApplicationStatus = async (applicationId, studentId, newStatus) => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("accessToken")

      const companyId = applicationId

      // Make API request to update status
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/application/application/${companyId}/${studentId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log(response.data)

      // Update local state
      const updatedApplications = applications.map((app) => {
        if (app._id === applicationId) {
          return { ...app, status: newStatus }
        }
        return app
      })

      setApplications(updatedApplications)
      setFilteredApplications(
        filteredApplications.map((app) => {
          if (app._id === applicationId) {
            return { ...app, status: newStatus }
          }
          return app
        }),
      )

      // Update selected application if it's the one being modified
      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus })
      }
    } catch (err) {
      console.error("Error updating application status:", err)
      alert("Failed to update application status. Please try again.")
    }
  }

  // Get unique company names for filter dropdown
  const getUniqueCompanies = () => {
    const companyNames = applications
      .map((app) => app.companyId?.name || app.companyDetails?.name || app.companyName)
      .filter(Boolean)

    return [...new Set(companyNames)]
  }

  // Manual export button handler - opens the column selection modal
  const handleManualExport = () => {
    setIsExportModalOpen(true)
  }

  // Handle export with selected columns
  const handleExportWithColumns = (selectedColumns) => {
    exportToExcel(filteredApplications, selectedColumns)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Applications Management</h1>
            <p className="text-gray-500">Track and manage student applications to companies</p>
          </div>
          <button
            onClick={handleManualExport}
            disabled={exportLoading || filteredApplications.length === 0}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
          >
            {exportLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
        </div>

        <ApplicationFilters onFilterChange={handleFilterChange} filters={filters} companies={getUniqueCompanies()} />

        {exportLoading && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md flex items-center">
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
            Preparing Excel export... This may take a moment.
          </div>
        )}

        <div className="mt-6 bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : (
            <ApplicationsTable
              applications={filteredApplications}
              onViewDetails={viewApplicationDetails}
              onUpdateStatus={updateApplicationStatus}
            />
          )}
        </div>

        {isModalOpen && (
          <ApplicationDetailsModal
            application={selectedApplication}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUpdateStatus={updateApplicationStatus}
          />
        )}

        {/* Column Selection Modal */}
        <ExportColumnsModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExportWithColumns}
          allColumns={allExportColumns}
        />
      </div>
    </div>
  )
}

export default ApplicationsManagement