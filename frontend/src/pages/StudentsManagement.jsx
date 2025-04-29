"use client"

import { useState, useEffect } from "react"
import * as XLSX from "xlsx"
import StudentFilters from "../components/StudentFilters"
import StudentTable from "../components/StudentTable"
import StudentDetailsModal from "../components/StudentDetailsModal"

const StudentsManagement = () => {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [filters, setFilters] = useState({
    branch: "All",
    placementStatus: "All",
    year: "All",
  })

  // Fetch all students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:8000/v1/student/get-all-students")

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("API Response:", data.data)

        if (data.statusCode === 200 && data.data) {
          setStudents(data.data)
          setFilteredStudents(data.data)
        } else {
          throw new Error(data.message || "Failed to fetch students")
        }
      } catch (err) {
        console.error("Error fetching students:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  // Watch for filter changes to trigger Excel export
  useEffect(() => {
    if (filters.branch !== "All" || filters.placementStatus !== "All" || filters.year !== "All") {
      // Only auto-export when a specific filter is applied
      exportToExcel(filteredStudents)
    }
  }, [filters.branch, filters.placementStatus, filters.year])

  // Function to handle search and filtering
  const handleSearch = (term) => {
    setSearchTerm(term)
    applyFilters(term, filters)
  }

  // Function to handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    applyFilters(searchTerm, newFilters)
  }

  // Apply filters and search
  const applyFilters = (term, filterOptions) => {
    let result = [...students]

    // Apply search term
    if (term) {
      result = result.filter(
        (student) =>
          (student.name && student.name.toLowerCase().includes(term.toLowerCase())) ||
          (student.rollNo && student.rollNo.toLowerCase().includes(term.toLowerCase())) ||
          (student.personalEmail && student.personalEmail.toLowerCase().includes(term.toLowerCase())) ||
          (student.collegeEmail && student.collegeEmail.toLowerCase().includes(term.toLowerCase())),
      )
    }

    // Apply branch filter
    if (filterOptions.branch !== "All") {
      result = result.filter((student) => student.branch === filterOptions.branch)
    }

    // Apply placement status filter
    if (filterOptions.placementStatus !== "All") {
      result = result.filter((student) => student.placementStatus === filterOptions.placementStatus)
    }

    // Apply year filter
    if (filterOptions.year !== "All") {
      result = result.filter((student) => student.year === filterOptions.year)
    }

    setFilteredStudents(result)
  }

  // Function to fetch student details
  const fetchStudentDetails = async (personalEmail) => {
    try {
      const response = await fetch("http://localhost:8000/v1/student/view-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ personalEmail }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.statusCode === 200 && data.data) {
        return data.data
      } else {
        throw new Error(data.message || "Failed to fetch student details")
      }
    } catch (err) {
      console.error(`Error fetching details for student ${personalEmail}:`, err)
      return null
    }
  }

  // Function to export students to Excel
  const exportToExcel = async (studentsToExport) => {
    if (studentsToExport.length === 0) return

    setExportLoading(true)
    try {
      // Create an array to hold the enriched student data
      const enrichedData = []

      // Fetch detailed information for each student
      for (const student of studentsToExport) {
        if (!student.personalEmail) continue

        // Fetch student details using view-profile endpoint
        const studentDetails = await fetchStudentDetails(student.personalEmail)

        // Create an enriched student object with all the data we want to include
        const enrichedStudent = {
          Name: student.name || studentDetails?.name || "N/A",
          "Roll No": student.rollNo || studentDetails?.rollNo || "N/A",
          Branch: student.branch || studentDetails?.branch || "N/A",
          Year: student.year || studentDetails?.year || "N/A",
          "College Email": student.collegeEmail || studentDetails?.collegeEmail || "N/A",
          "Personal Email": student.personalEmail || studentDetails?.personalEmail || "N/A",
          Phone: student.phone || studentDetails?.phone || "N/A",
          CGPA: student.cgpa || studentDetails?.cgpa || "N/A",
          "Placement Status": student.placementStatus || studentDetails?.placementStatus || "N/A",
          Skills: studentDetails?.skills?.join(", ") || "N/A",
          LinkedIn: studentDetails?.linkedin || "N/A",
          GitHub: studentDetails?.github || "N/A",
          Portfolio: studentDetails?.portfolio || "N/A",
          "Resume URL": studentDetails?.resume || "N/A",
          Address: studentDetails?.address || "N/A",
        }

        // Add additional fields if they exist
        if (studentDetails?.projects) {
          enrichedStudent["Projects"] = Array.isArray(studentDetails.projects)
            ? studentDetails.projects.map((p) => p.title).join(", ")
            : "N/A"
        }

        if (studentDetails?.education) {
          enrichedStudent["Education"] = Array.isArray(studentDetails.education)
            ? studentDetails.education.map((e) => `${e.degree} - ${e.institution}`).join(", ")
            : "N/A"
        }

        enrichedData.push(enrichedStudent)
      }

      // Create a worksheet from the enriched data
      const worksheet = XLSX.utils.json_to_sheet(enrichedData)

      // Create a workbook and add the worksheet
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students")

      // Generate Excel file name based on filters
      let fileName = "Students"
      if (filters.branch !== "All") fileName += `_${filters.branch}`
      if (filters.placementStatus !== "All") fileName += `_${filters.placementStatus}`
      if (filters.year !== "All") fileName += `_${filters.year}`
      fileName += `_${new Date().toISOString().split("T")[0]}.xlsx`

      // Write the workbook and trigger download
      XLSX.writeFile(workbook, fileName)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Failed to export students to Excel. Please try again.")
    } finally {
      setExportLoading(false)
    }
  }

  // Function to view student details
  const viewStudentDetails = async (student) => {
    try {
      // Make sure we're using personalEmail for the API call
      if (!student.personalEmail) {
        throw new Error("Personal email is missing for this student")
      }

      const response = await fetch("http://localhost:8000/v1/student/view-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ personalEmail: student.personalEmail }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Student details response:", data)

      if (data.statusCode === 200 && data.data) {
        setSelectedStudent(data.data)
        setIsModalOpen(true)
      } else {
        throw new Error(data.message || "Failed to fetch student details")
      }
    } catch (err) {
      console.error("Error fetching student details:", err)
      alert("Failed to load student details: " + err.message)
    }
  }

  // Manual export button handler
  const handleManualExport = () => {
    exportToExcel(filteredStudents)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
            <p className="text-gray-500">View and manage student profiles and placement status</p>
          </div>
          <button
            onClick={handleManualExport}
            disabled={exportLoading || filteredStudents.length === 0}
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

        <StudentFilters onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} />

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
            Preparing Excel export... This may take a moment as we gather detailed information for each student.
          </div>
        )}

        <div className="mt-6 bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading students...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <StudentTable students={filteredStudents} onViewDetails={viewStudentDetails} />
          )}
        </div>

        {isModalOpen && (
          <StudentDetailsModal student={selectedStudent} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </div>
  )
}

export default StudentsManagement
