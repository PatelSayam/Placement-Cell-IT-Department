import { useState, useEffect } from "react"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
          <p className="text-gray-500">View and manage student profiles and placement status</p>
        </div>

        <StudentFilters onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} />

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