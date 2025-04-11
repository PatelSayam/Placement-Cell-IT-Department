const UpcomingDrivesCard = () => {
  // Mock data for upcoming drives
  const upcomingDrives = [
    {
      id: 1,
      companyName: "Google",
      date: "2024-01-20",
      positions: 3,
      status: "Confirmed",
    },
    {
      id: 2,
      companyName: "Microsoft",
      date: "2024-02-10",
      positions: 5,
      status: "Confirmed",
    },
    {
      id: 3,
      companyName: "Amazon",
      date: "2024-01-15",
      positions: 7,
      status: "Tentative",
    },
    {
      id: 4,
      companyName: "Accenture",
      date: "2024-03-15",
      positions: 50,
      status: "Confirmed",
    },
  ]

  return (
    <div className="space-y-4">
      {upcomingDrives.map((drive) => (
        <div key={drive.id} className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">{drive.companyName}</h3>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {drive.date}
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {drive.positions} positions
              </div>
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                drive.status === "Confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {drive.status}
            </span>
          </div>
        </div>
      ))}

      <button className="w-full py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
        View All Upcoming Drives
      </button>
    </div>
  )
}

export default UpcomingDrivesCard
