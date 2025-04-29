const CompanyCard = ({ company, onClick, onDelete }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] border border-indigo-100"
    >
      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
      <div className="p-6">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center p-2 border border-indigo-100">
            <img src={company.logo || "/placeholder.svg"} alt={company.name} className="w-12 h-12 object-contain" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-center text-gray-800 mb-1">{company.name}</h3>
        <p className="text-indigo-600 font-medium text-center mb-4">{company.role || company.industry}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Location
            </span>
            <span className="text-gray-800 font-medium">
              {company.locations && company.locations.length > 0 
                ? company.locations[0] 
                : company.location || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Package
            </span>
            <span className="text-gray-800 font-medium">
              {company.packages && company.packages.length > 0 
                ? company.packages[0] 
                : company.ctc || "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex space-x-2">
          <button 
            onClick={onClick} 
            className="flex-1 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-lg font-medium hover:from-indigo-100 hover:to-purple-100 transition-colors border border-indigo-100"
          >
            View Details
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }} 
            className="p-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors border border-red-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyCard