const ApplicationFilters = ({ onFilterChange, filters, companies }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    const newFilters = { ...filters, [name]: value }
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <select
            name="company"
            value={filters.company}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="All">All Companies</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="All">All Time</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default ApplicationFilters
