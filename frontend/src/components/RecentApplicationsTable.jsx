const RecentApplicationsTable = () => {
  // Mock data for recent applications
  const applications = [
    {
      id: 1,
      studentName: "Aditya Sharma",
      studentId: "CS2021001",
      companyName: "Google",
      role: "Software Engineer",
      appliedDate: "2023-12-10",
      status: "Selected",
    },
    {
      id: 2,
      studentName: "Priya Patel",
      studentId: "EC2021015",
      companyName: "Microsoft",
      role: "Software Engineer",
      appliedDate: "2023-12-08",
      status: "Selected",
    },
    {
      id: 3,
      studentName: "Rahul Verma",
      studentId: "ME2021032",
      companyName: "Amazon",
      role: "Product Manager",
      appliedDate: "2023-12-05",
      status: "Rejected",
    },
    {
      id: 4,
      studentName: "Sneha Gupta",
      studentId: "CS2021042",
      companyName: "Amazon",
      role: "Software Development Engineer",
      appliedDate: "2023-12-07",
      status: "Selected",
    },
    {
      id: 5,
      studentName: "Vikram Singh",
      studentId: "IT2021056",
      companyName: "Infosys",
      role: "Systems Engineer",
      appliedDate: "2023-12-01",
      status: "Selected",
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applied Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((application) => (
            <tr key={application.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">{application.studentName.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{application.studentName}</div>
                    <div className="text-sm text-gray-500">{application.studentId}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{application.companyName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{application.role}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{application.appliedDate}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    application.status === "Selected"
                      ? "bg-green-100 text-green-800"
                      : application.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {application.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        <button className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          View All Applications
        </button>
      </div>
    </div>
  )
}

export default RecentApplicationsTable
