import { useState } from "react"
import StudentFilters from "../components/StudentFilters"
import StudentTable from "../components/StudentTable"
import StudentDetailsModal from "../components/StudentDetailsModal"

// Mock data for students
const mockStudents = [
  {
    id: 1,
    name: "Aditya Sharma",
    rollNo: "CS2021001",
    branch: "Computer Science",
    year: "4th Year",
    cgpa: 9.2,
    placementStatus: "Placed",
    company: "Google",
    package: "24 LPA",
    email: "aditya.s@example.com",
    phone: "9876543210",
    skills: ["React", "Node.js", "Python", "Machine Learning"],
    applications: 4,
    offers: 2,
  },
  {
    id: 2,
    name: "Priya Patel",
    rollNo: "EC2021015",
    branch: "Electronics",
    year: "4th Year",
    cgpa: 8.7,
    placementStatus: "Placed",
    company: "Microsoft",
    package: "21 LPA",
    email: "priya.p@example.com",
    phone: "9876543211",
    skills: ["VLSI", "Embedded Systems", "C++", "IoT"],
    applications: 5,
    offers: 1,
  },
  {
    id: 3,
    name: "Rahul Verma",
    rollNo: "ME2021032",
    branch: "Mechanical",
    year: "4th Year",
    cgpa: 8.1,
    placementStatus: "Not Placed",
    company: null,
    package: null,
    email: "rahul.v@example.com",
    phone: "9876543212",
    skills: ["AutoCAD", "SolidWorks", "Project Management"],
    applications: 6,
    offers: 0,
  },
  {
    id: 4,
    name: "Sneha Gupta",
    rollNo: "CS2021042",
    branch: "Computer Science",
    year: "4th Year",
    cgpa: 9.5,
    placementStatus: "Placed",
    company: "Amazon",
    package: "26 LPA",
    email: "sneha.g@example.com",
    phone: "9876543213",
    skills: ["Java", "Spring Boot", "AWS", "Microservices"],
    applications: 3,
    offers: 3,
  },
  {
    id: 5,
    name: "Vikram Singh",
    rollNo: "IT2021056",
    branch: "Information Technology",
    year: "4th Year",
    cgpa: 8.4,
    placementStatus: "Placed",
    company: "Infosys",
    package: "10 LPA",
    email: "vikram.s@example.com",
    phone: "9876543214",
    skills: ["JavaScript", "React", "SQL", "MongoDB"],
    applications: 8,
    offers: 1,
  },
  {
    id: 6,
    name: "Neha Kapoor",
    rollNo: "CS2021078",
    branch: "Computer Science",
    year: "4th Year",
    cgpa: 7.9,
    placementStatus: "Not Placed",
    company: null,
    package: null,
    email: "neha.k@example.com",
    phone: "9876543215",
    skills: ["Python", "Data Analysis", "Machine Learning"],
    applications: 4,
    offers: 0,
  },
  {
    id: 7,
    name: "Arjun Reddy",
    rollNo: "EE2021089",
    branch: "Electrical",
    year: "4th Year",
    cgpa: 8.8,
    placementStatus: "Placed",
    company: "Tata Power",
    package: "12 LPA",
    email: "arjun.r@example.com",
    phone: "9876543216",
    skills: ["Power Systems", "Electrical Design", "PLC Programming"],
    applications: 3,
    offers: 1,
  },
  {
    id: 8,
    name: "Kavita Desai",
    rollNo: "CH2021102",
    branch: "Chemical",
    year: "4th Year",
    cgpa: 9.0,
    placementStatus: "Placed",
    company: "Reliance Industries",
    package: "14 LPA",
    email: "kavita.d@example.com",
    phone: "9876543217",
    skills: ["Process Engineering", "MATLAB", "Chemical Simulation"],
    applications: 2,
    offers: 1,
  },
]

const StudentsManagement = () => {
  const [students, setStudents] = useState(mockStudents)
  const [filteredStudents, setFilteredStudents] = useState(mockStudents)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    branch: "All",
    placementStatus: "All",
    year: "All",
  })

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
          student.name.toLowerCase().includes(term.toLowerCase()) ||
          student.rollNo.toLowerCase().includes(term.toLowerCase()) ||
          student.email.toLowerCase().includes(term.toLowerCase()),
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
  const viewStudentDetails = (student) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
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
          <StudentTable students={filteredStudents} onViewDetails={viewStudentDetails} />
        </div>

        {isModalOpen && (
          <StudentDetailsModal student={selectedStudent} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </div>
  )
}

export default StudentsManagement
