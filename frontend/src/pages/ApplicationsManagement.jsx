import { useState } from "react"
import ApplicationsTable from "../components/ApplicationsTable"
import ApplicationFilters from "../components/ApplicationFilters"
import ApplicationDetailsModal from "../components/ApplicationDetailsModal"

// Mock data for applications
const mockApplications = [
  {
    id: 1,
    studentName: "Aditya Sharma",
    studentId: "CS2021001",
    companyName: "Google",
    role: "Software Engineer",
    appliedDate: "2023-12-10",
    status: "Selected",
    package: "24 LPA",
    resumeLink: "#",
    interviewDate: "2023-12-20",
    interviewFeedback: "Excellent problem-solving skills. Strong in algorithms and system design.",
    studentDetails: {
      email: "aditya.s@example.com",
      phone: "9876543210",
      cgpa: 9.2,
      branch: "Computer Science",
      skills: ["React", "Node.js", "Python", "Machine Learning"],
    },
  },
  {
    id: 2,
    studentName: "Priya Patel",
    studentId: "EC2021015",
    companyName: "Microsoft",
    role: "Software Engineer",
    appliedDate: "2023-12-08",
    status: "Selected",
    package: "21 LPA",
    resumeLink: "#",
    interviewDate: "2023-12-18",
    interviewFeedback: "Good technical knowledge. Performed well in coding rounds.",
    studentDetails: {
      email: "priya.p@example.com",
      phone: "9876543211",
      cgpa: 8.7,
      branch: "Electronics",
      skills: ["VLSI", "Embedded Systems", "C++", "IoT"],
    },
  },
  {
    id: 3,
    studentName: "Rahul Verma",
    studentId: "ME2021032",
    companyName: "Amazon",
    role: "Product Manager",
    appliedDate: "2023-12-05",
    status: "Rejected",
    package: null,
    resumeLink: "#",
    interviewDate: "2023-12-15",
    interviewFeedback: "Lacks product understanding. Communication skills need improvement.",
    studentDetails: {
      email: "rahul.v@example.com",
      phone: "9876543212",
      cgpa: 8.1,
      branch: "Mechanical",
      skills: ["AutoCAD", "SolidWorks", "Project Management"],
    },
  },
  {
    id: 4,
    studentName: "Sneha Gupta",
    studentId: "CS2021042",
    companyName: "Amazon",
    role: "Software Development Engineer",
    appliedDate: "2023-12-07",
    status: "Selected",
    package: "26 LPA",
    resumeLink: "#",
    interviewDate: "2023-12-17",
    interviewFeedback: "Excellent coding skills. Good understanding of system design principles.",
    studentDetails: {
      email: "sneha.g@example.com",
      phone: "9876543213",
      cgpa: 9.5,
      branch: "Computer Science",
      skills: ["Java", "Spring Boot", "AWS", "Microservices"],
    },
  },
  {
    id: 5,
    studentName: "Vikram Singh",
    studentId: "IT2021056",
    companyName: "Infosys",
    role: "Systems Engineer",
    appliedDate: "2023-12-01",
    status: "Selected",
    package: "10 LPA",
    resumeLink: "#",
    interviewDate: "2023-12-10",
    interviewFeedback: "Good technical knowledge. Communication skills are excellent.",
    studentDetails: {
      email: "vikram.s@example.com",
      phone: "9876543214",
      cgpa: 8.4,
      branch: "Information Technology",
      skills: ["JavaScript", "React", "SQL", "MongoDB"],
    },
  },
  {
    id: 6,
    studentName: "Neha Kapoor",
    studentId: "CS2021078",
    companyName: "TCS",
    role: "Assistant System Engineer",
    appliedDate: "2023-11-25",
    status: "Pending",
    package: null,
    resumeLink: "#",
    interviewDate: "2024-01-05",
    interviewFeedback: null,
    studentDetails: {
      email: "neha.k@example.com",
      phone: "9876543215",
      cgpa: 7.9,
      branch: "Computer Science",
      skills: ["Python", "Data Analysis", "Machine Learning"],
    },
  },
  {
    id: 7,
    studentName: "Arjun Reddy",
    studentId: "EE2021089",
    companyName: "Tata Power",
    role: "Graduate Engineer Trainee",
    appliedDate: "2023-11-20",
    status: "Selected",
    package: "12 LPA",
    resumeLink: "#",
    interviewDate: "2023-12-05",
    interviewFeedback: "Good domain knowledge. Performed well in technical interview.",
    studentDetails: {
      email: "arjun.r@example.com",
      phone: "9876543216",
      cgpa: 8.8,
      branch: "Electrical",
      skills: ["Power Systems", "Electrical Design", "PLC Programming"],
    },
  },
  {
    id: 8,
    studentName: "Kavita Desai",
    studentId: "CH2021102",
    companyName: "Reliance Industries",
    role: "Process Engineer",
    appliedDate: "2023-11-15",
    status: "Selected",
    package: "14 LPA",
    resumeLink: "#",
    interviewDate: "2023-11-30",
    interviewFeedback: "Excellent domain knowledge. Good understanding of chemical processes.",
    studentDetails: {
      email: "kavita.d@example.com",
      phone: "9876543217",
      cgpa: 9.0,
      branch: "Chemical",
      skills: ["Process Engineering", "MATLAB", "Chemical Simulation"],
    },
  },
]

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState(mockApplications)
  const [filteredApplications, setFilteredApplications] = useState(mockApplications)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    company: "All",
    status: "All",
    dateRange: "All",
  })

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
      result = result.filter((app) => app.companyName === filterOptions.company)
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
        result = result.filter((app) => new Date(app.appliedDate) >= lastWeek)
      } else if (filterOptions.dateRange === "Last 30 Days") {
        const lastMonth = new Date(today.getTime() - 30 * oneDay)
        result = result.filter((app) => new Date(app.appliedDate) >= lastMonth)
      } else if (filterOptions.dateRange === "Last 90 Days") {
        const lastQuarter = new Date(today.getTime() - 90 * oneDay)
        result = result.filter((app) => new Date(app.appliedDate) >= lastQuarter)
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
  const updateApplicationStatus = (id, newStatus) => {
    // In a real app, this would be an API call
    // PATCH /api/applications/{id}
    const updatedApplications = applications.map((app) => {
      if (app.id === id) {
        return { ...app, status: newStatus }
      }
      return app
    })

    setApplications(updatedApplications)
    setFilteredApplications(
      filteredApplications.map((app) => {
        if (app.id === id) {
          return { ...app, status: newStatus }
        }
        return app
      }),
    )

    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication({ ...selectedApplication, status: newStatus })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Applications Management</h1>
          <p className="text-gray-500">Track and manage student applications to companies</p>
        </div>

        <ApplicationFilters
          onFilterChange={handleFilterChange}
          filters={filters}
          companies={[...new Set(applications.map((app) => app.companyName))]}
        />

        <div className="mt-6 bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
          <ApplicationsTable
            applications={filteredApplications}
            onViewDetails={viewApplicationDetails}
            onUpdateStatus={updateApplicationStatus}
          />
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
