"use client"

const ApplicationDetailsModal = ({ application, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !application) return null

  // Format date if available
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

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
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Application Details</h3>
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
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl text-indigo-600 font-medium">
                          {application.studentDetails?.fullName?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">
                          {application.studentDetails?.fullName || application.studentName || "Unknown Student"}
                        </h4>
                        <p className="text-gray-500">
                          {application.studentId || application.studentDetails?._id || "No ID"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        application.status === "Selected"
                          ? "bg-green-100 text-green-800"
                          : application.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-4 mb-4 border border-indigo-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium text-gray-800">
                          {application.companyDetails?.name || application.companyName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="font-medium text-gray-800">
                          {application.companyDetails?.jobRole || application.role || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Applied Date</p>
                        <p className="font-medium text-gray-800">
                          {formatDate(application.appliedDate || application.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Student Details</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-gray-500">College Email</p>
                          <p className="text-sm">{application.studentDetails?.collegeEmail || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Personal Email</p>
                          <p className="text-sm">{application.studentDetails?.personalEmail || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {application.studentDetails?.resume && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Resume</p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <a
                          href={application.studentDetails.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                        >
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
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          View Resume
                        </a>
                      </div>
                    </div>
                  )}

                  {application.companyDetails?.description && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Company Description</p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm">{application.companyDetails.description}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Update Application Status</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onUpdateStatus(application._id, application.studentDetails?._id, "Pending")}
                        className={`px-3 py-1.5 rounded text-sm font-medium ${
                          application.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-gray-100 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() => onUpdateStatus(application._id, application.studentDetails?._id, "Selected")}
                        className={`px-3 py-1.5 rounded text-sm font-medium ${
                          application.status === "Selected"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        Selected
                      </button>
                      <button
                        onClick={() => onUpdateStatus(application._id, application.studentDetails?._id, "Rejected")}
                        className={`px-3 py-1.5 rounded text-sm font-medium ${
                          application.status === "Rejected"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700"
                        }`}
                      >
                        Rejected
                      </button>
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
            {application.studentDetails?.resume && (
              <a
                href={application.studentDetails.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                View Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetailsModal
