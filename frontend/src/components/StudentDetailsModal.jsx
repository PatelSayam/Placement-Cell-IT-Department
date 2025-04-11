const StudentDetailsModal = ({ student, isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Student Details</h3>
                  <button
                    onClick={onClose}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl text-indigo-600 font-medium">{student.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{student.name}</h4>
                      <p className="text-gray-500">{student.rollNo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Branch</p>
                      <p className="font-medium">{student.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium">{student.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">CGPA</p>
                      <p className="font-medium">{student.cgpa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Placement Status</p>
                      <p
                        className={`font-medium ${student.placementStatus === "Placed" ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {student.placementStatus}
                      </p>
                    </div>
                    {student.placementStatus === "Placed" && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Company</p>
                          <p className="font-medium">{student.company}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Package</p>
                          <p className="font-medium">{student.package}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Contact Information</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm">{student.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm">{student.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {student.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Application Summary</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">Total Applications</p>
                          <p className="text-sm font-medium">{student.applications}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Offers Received</p>
                          <p className="text-sm font-medium">{student.offers}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium text-white hover:from-indigo-700 hover:to-purple-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetailsModal
