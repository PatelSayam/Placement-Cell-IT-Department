"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ApplicationsTable from "../components/ApplicationsTable"
import ApplicationFilters from "../components/ApplicationFilters"
import ApplicationDetailsModal from "../components/ApplicationDetailsModal"

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState([])
  const [filteredApplications, setFilteredApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    company: "All",
    status: "All",
    dateRange: "All",
  })

  // Get the company ID from URL or context (assuming admin is viewing a specific company)
  // In a real app, you might get this from a route parameter or context


  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications()
  }, [])

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
      console.log(response.data);
      

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
        (app) => app.companyDetails?.name === filterOptions.company || app.companyName === filterOptions.company,
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
        { status: newStatus },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(response.data);


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
    const companyNames = applications.map((app) => app.companyDetails?.name || app.companyName).filter(Boolean)

    return [...new Set(companyNames)]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Applications Management</h1>
          <p className="text-gray-500">Track and manage student applications to companies</p>
        </div>

        <ApplicationFilters onFilterChange={handleFilterChange} filters={filters} companies={getUniqueCompanies()} />

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
      </div>
    </div>
  )
}

export default ApplicationsManagement
