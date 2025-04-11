import { useState } from "react"
import StatCard from "../components/StatCard"
import RecentApplicationsTable from "../components/RecentApplicationsTable"
import UpcomingDrivesCard from "../components/UpcomingDrivesCard"
import PlacementChart from "../components/PlacementChart"

// Mock data
const stats = [
  {
    title: "Total Students",
    value: 1248,
    change: "+12%",
    isPositive: true,
    icon: "users",
  },
  {
    title: "Placed Students",
    value: 876,
    change: "+8%",
    isPositive: true,
    icon: "check-circle",
  },
  {
    title: "Active Companies",
    value: 42,
    change: "+5",
    isPositive: true,
    icon: "briefcase",
  },
  {
    title: "Pending Applications",
    value: 156,
    change: "-23",
    isPositive: true,
    icon: "clock",
  },
]

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("This Month")

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500">Overview of placement activities and statistics</p>
          </div>

          <div className="mt-4 md:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Placement Statistics</h2>
            <PlacementChart />
          </div>

          <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Drives</h2>
            <UpcomingDrivesCard />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Applications</h2>
          <RecentApplicationsTable />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
