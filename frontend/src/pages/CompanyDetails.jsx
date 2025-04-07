import { useParams } from "react-router-dom"
import ApplicationForm from "../components/ApplicationForm"

const jobDetails = {
  1: {
    company: "Google",
    description: "Work on core infrastructure and scalable solutions. Open to 2025 graduates.",
    skills: "DSA, React, System Design",
    deadline: "2025-01-31",
  },
  2: {
    company: "Microsoft",
    description: "Join the product team to build next-gen productivity tools.",
    skills: "OOP, Web Dev, Cloud",
    deadline: "2025-02-10",
  },
}

const CompanyDetails = () => {
  const { id } = useParams()
  const details = jobDetails[id]

  if (!details) return <div className="p-8 text-center font-medium text-gray-700">Company not found.</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
          <div className="relative p-8 border-b border-gray-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100 rounded-tr-full opacity-50"></div>

            <div className="relative">
              <h1 className="text-3xl font-bold mb-6 text-gray-800">{details.company}</h1>

              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-sm uppercase tracking-wider text-indigo-600 font-medium">Role Description</h2>
                  <p className="text-gray-700 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    {details.description}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="text-sm uppercase tracking-wider text-indigo-600 font-medium">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {details.skills.split(", ").map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="text-sm uppercase tracking-wider text-indigo-600 font-medium">Application Deadline</h2>
                  <div className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {details.deadline}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 relative">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-50"></div>
            <div className="relative">
              <ApplicationForm companyId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetails

