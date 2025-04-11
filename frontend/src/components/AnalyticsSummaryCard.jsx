const AnalyticsSummaryCard = ({ title, value, change, isPositive, description }) => {
    return (
      <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6 hover:shadow-lg transition-shadow">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
        </div>
  
        <div className={`mt-2 flex items-center ${isPositive ? "text-green-600" : "text-red-600"}`}>
          <span className="text-sm font-medium">{change}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ml-1 ${!isPositive && "transform rotate-180"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
  
        <p className="mt-2 text-xs text-gray-500">{description}</p>
      </div>
    )
  }
  
  export default AnalyticsSummaryCard
  