import { useState } from "react"
import PlacementTrendsChart from "../components/PlacementTrendsChart"
import CompanyWisePlacementChart from "../components/CompanyWisePlacementChart"
import BranchWisePlacementChart from "../components/BranchWisePlacementChart"
import PackageDistributionChart from "../components/PackageDistributionChart"
import AnalyticsSummaryCard from "../components/AnalyticsSummaryCard"

// Mock data for analytics
const placementTrendsData = [
  { year: "2019", placed: 650, total: 800 },
  { year: "2020", placed: 680, total: 850 },
  { year: "2021", placed: 720, total: 900 },
  { year: "2022", placed: 750, total: 950 },
  { year: "2023", placed: 800, total: 1000 },
]

const companyWisePlacementData = [
  { company: "Google", count: 15 },
  { company: "Microsoft", count: 18 },
  { company: "Amazon", count: 22 },
  { company: "Infosys", count: 85 },
  { company: "TCS", count: 120 },
  { company: "Wipro", count: 75 },
  { company: "Accenture", count: 65 },
  { company: "Others", count: 400 },
]

const branchWisePlacementData = [
  { branch: "Computer Science", placed: 250, total: 280 },
  { branch: "Information Technology", placed: 180, total: 200 },
  { branch: "Electronics", placed: 150, total: 180 },
  { branch: "Electrical", placed: 90, total: 120 },
  { branch: "Mechanical", placed: 70, total: 100 },
  { branch: "Civil", placed: 40, total: 70 },
  { branch: "Chemical", placed: 20, total: 50 },
]

const packageDistributionData = [
  { range: "3-6 LPA", count: 350 },
  { range: "6-10 LPA", count: 250 },
  { range: "10-15 LPA", count: 120 },
  { range: "15-20 LPA", count: 50 },
  { range: "20+ LPA", count: 30 },
]

const analyticsSummary = [
  {
    title: "Placement Rate",
    value: "80%",
    change: "+5%",
    isPositive: true,
    description: "Overall placement rate for the current year",
  },
  {
    title: "Average Package",
    value: "8.5 LPA",
    change: "+1.2 LPA",
    isPositive: true,
    description: "Average package offered to students",
  },
  {
    title: "Highest Package",
    value: "45 LPA",
    change: "+7 LPA",
    isPositive: true,
    description: "Highest package offered this year",
  },
  {
    title: "Companies Visited",
    value: "42",
    change: "+8",
    isPositive: true,
    description: "Total companies that visited for recruitment",
  },
]

const Analytics = () => {
  const [year, setYear] = useState("2023")

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Placement Analytics</h1>
            <p className="text-gray-500">Insights and statistics about placement activities</p>
          </div>

          <div className="mt-4 md:mt-0">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {analyticsSummary.map((item, index) => (
            <AnalyticsSummaryCard key={index} {...item} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Placement Trends (Last 5 Years)</h2>
            <PlacementTrendsChart data={placementTrendsData} />
          </div>

          <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Company-wise Placements</h2>
            <CompanyWisePlacementChart data={companyWisePlacementData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Branch-wise Placement Rate</h2>
            <BranchWisePlacementChart data={branchWisePlacementData} />
          </div>

          <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Package Distribution</h2>
            <PackageDistributionChart data={packageDistributionData} />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-md border border-indigo-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Detailed Reports</h2>
            <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors border border-indigo-100 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Reports
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportCard
              title="Placement Summary Report"
              description="Complete overview of placement statistics"
              icon="chart-bar"
            />
            <ReportCard
              title="Company-wise Analysis"
              description="Detailed breakdown by company"
              icon="office-building"
            />
            <ReportCard
              title="Student Performance Report"
              description="Analysis of student performance in placements"
              icon="academic-cap"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const ReportCard = ({ title, description, icon }) => {
  const icons = {
    "chart-bar": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    "office-building": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    "academic-cap": (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      </svg>
    ),
  }

  return (
    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">{icons[icon]}</div>
        <div>
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default Analytics
