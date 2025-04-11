import { useState } from "react"
import CompanyCard from "../components/CompanyCard"
import AddCompanyModal from "../components/AddCompanyModal"

// Mock data for companies
const mockCompanies = [
  {
    id: 1,
    name: "Google",
    logo: "https://logo.clearbit.com/google.com",
    industry: "Technology",
    website: "https://careers.google.com",
    contactPerson: "Sundar Pichai",
    email: "recruiting@google.com",
    phone: "+1 650-253-0000",
    status: "Active",
    openPositions: 3,
    totalHires: 12,
    lastDriveDate: "2023-10-15",
    upcomingDrive: "2024-01-20",
    roles: ["Software Engineer", "Product Manager", "UX Designer"],
    locations: ["Bangalore", "Hyderabad"],
    packages: ["18-24 LPA", "24-32 LPA"],
    description:
      "Google LLC is an American multinational technology company that specializes in Internet-related services and products.",
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    industry: "Technology",
    website: "https://careers.microsoft.com",
    contactPerson: "Satya Nadella",
    email: "recruiting@microsoft.com",
    phone: "+1 425-882-8080",
    status: "Active",
    openPositions: 5,
    totalHires: 15,
    lastDriveDate: "2023-09-20",
    upcomingDrive: "2024-02-10",
    roles: ["Software Engineer", "Cloud Solutions Architect", "Data Scientist"],
    locations: ["Bangalore", "Hyderabad", "Pune"],
    packages: ["16-22 LPA", "22-30 LPA"],
    description:
      "Microsoft Corporation is an American multinational technology corporation that produces computer software, consumer electronics, and related services.",
  },
  {
    id: 3,
    name: "Amazon",
    logo: "https://logo.clearbit.com/amazon.com",
    industry: "E-commerce, Technology",
    website: "https://www.amazon.jobs",
    contactPerson: "Andy Jassy",
    email: "university-recruiting@amazon.com",
    phone: "+1 206-266-1000",
    status: "Active",
    openPositions: 7,
    totalHires: 20,
    lastDriveDate: "2023-11-05",
    upcomingDrive: "2024-01-15",
    roles: ["SDE", "Operations Manager", "Business Analyst", "Product Manager"],
    locations: ["Bangalore", "Hyderabad", "Chennai"],
    packages: ["18-26 LPA", "26-35 LPA"],
    description:
      "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
  },
  {
    id: 4,
    name: "Infosys",
    logo: "https://logo.clearbit.com/infosys.com",
    industry: "IT Services",
    website: "https://www.infosys.com/careers",
    contactPerson: "Salil Parekh",
    email: "campus.recruitment@infosys.com",
    phone: "+91 80-2852-0261",
    status: "Active",
    openPositions: 100,
    totalHires: 150,
    lastDriveDate: "2023-10-25",
    upcomingDrive: "2024-02-05",
    roles: ["Systems Engineer", "Digital Specialist", "Technology Analyst"],
    locations: ["Bangalore", "Pune", "Hyderabad", "Chennai", "Mysore"],
    packages: ["4.5-6.5 LPA", "7-10 LPA"],
    description:
      "Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services.",
  },
  {
    id: 5,
    name: "TCS",
    logo: "https://logo.clearbit.com/tcs.com",
    industry: "IT Services",
    website: "https://www.tcs.com/careers",
    contactPerson: "Rajesh Gopinathan",
    email: "campus.recruitment@tcs.com",
    phone: "+91 22-6778-9999",
    status: "Inactive",
    openPositions: 0,
    totalHires: 200,
    lastDriveDate: "2023-08-15",
    upcomingDrive: null,
    roles: ["Assistant System Engineer", "Digital Specialist"],
    locations: ["Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune"],
    packages: ["3.5-7 LPA"],
    description:
      "Tata Consultancy Services Limited is an Indian multinational information technology services and consulting company.",
  },
  {
    id: 6,
    name: "Accenture",
    logo: "https://logo.clearbit.com/accenture.com",
    industry: "Consulting, Technology",
    website: "https://www.accenture.com/careers",
    contactPerson: "Julie Sweet",
    email: "campus.recruitment@accenture.com",
    phone: "+91 80-4139-0000",
    status: "Active",
    openPositions: 50,
    totalHires: 80,
    lastDriveDate: "2023-09-10",
    upcomingDrive: "2024-03-15",
    roles: ["Associate Software Engineer", "Technical Support", "Business Analyst"],
    locations: ["Bangalore", "Hyderabad", "Pune", "Chennai"],
    packages: ["4.5-8 LPA", "8-12 LPA"],
    description:
      "Accenture plc is an Irish-American professional services company specializing in information technology services and consulting.",
  },
]

const CompaniesManagement = () => {
  const [companies, setCompanies] = useState(mockCompanies)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  // Filter companies based on search term and status
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || company.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Function to add a new company
  const handleAddCompany = (newCompany) => {
    // In a real app, this would be an API call
    // POST /api/companies
    const companyWithId = {
      ...newCompany,
      id: companies.length + 1,
      totalHires: 0,
      lastDriveDate: null,
    }

    setCompanies([...companies, companyWithId])
    setIsAddModalOpen(false)
  }

  // Function to toggle company status
  const toggleCompanyStatus = (id) => {
    // In a real app, this would be an API call
    // PATCH /api/companies/{id}
    setCompanies(
      companies.map((company) => {
        if (company.id === id) {
          const newStatus = company.status === "Active" ? "Inactive" : "Active"
          return { ...company, status: newStatus }
        }
        return company
      }),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Company Management</h1>
            <p className="text-gray-500">Manage companies and job opportunities</p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} onToggleStatus={toggleCompanyStatus} />
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
