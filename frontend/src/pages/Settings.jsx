import { useState, useRef } from "react"
import * as XLSX from "xlsx"
import axios from "axios";
import AddEmailsToAllowedList from "../components/AddEmailsToAllowedList";

const Settings = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [generalSettings, setGeneralSettings] = useState({
    instituteName: "Dharamsinh Desai University (IT)",
    instituteWebsite: "ddu.ac.in",
    placementOfficerName: "Prof. Viral Shah",
    placementOfficerEmail: "placement@ddit.edu",
    placementOfficerPhone: "+91 9876543210",
    academicYear: "2023-2024",
  })

  const [emailSettings, setEmailSettings] = useState({
    emailNotifications: true,
    studentApplicationNotification: true,
    companyRegistrationNotification: true,
    placementUpdateNotification: true,
    emailSignature: "Regards,\nPlacement Cell\nDharamsinh Desai University (IT)",
  })

  const [placementSettings, setPlacementSettings] = useState({
    allowMultipleOffers: false,
    minimumCGPA: "6.0",
    maximumActiveBacklogs: "0",
    allowPlacementBreak: true,
    placementBreakDuration: "6 months",
  })

  const [accessSettings, setAccessSettings] = useState({
    enableStudentRegistration: true,
    enableCompanyRegistration: true,
    moderateCompanyPostings: true,
    studentProfileApproval: true,
  })

  const [excelData, setExcelData] = useState(null)
  const [columns, setColumns] = useState([])
  const [selectedColumn, setSelectedColumn] = useState("")
  const [extractedEmails, setExtractedEmails] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")

  const handleGeneralSettingsChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleEmailSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setEmailSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handlePlacementSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setPlacementSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleAccessSettingsChange = (e) => {
    const { name, checked } = e.target
    setAccessSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        if (jsonData.length > 0) {
          setExcelData(jsonData)
          setColumns(Object.keys(jsonData[0]))
        } else {
          alert("The Excel file appears to be empty.")
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error)
        alert("Failed to parse the Excel file. Please make sure it's a valid Excel file.")
      } finally {
        setIsUploading(false)
      }
    }

    reader.onerror = () => {
      alert("Failed to read the file.")
      setIsUploading(false)
    }

    reader.readAsArrayBuffer(file)
  }

  const handleColumnSelect = (e) => {
    setSelectedColumn(e.target.value)
  }

  const extractEmails = () => {
    if (!excelData || !selectedColumn) {
      alert("Please upload an Excel file and select a column first.")
      return
    }

    const emails = excelData
      .map((row) => row[selectedColumn])
      .filter((value) => value && typeof value === "string" && value.includes("@"))

    setExtractedEmails(emails)
  }

  const sendEmailsToBackend = async () => {
    if (extractedEmails.length === 0) {
      alert("No emails to send. Please extract emails first.")
      return
    }

    if (!emailSubject.trim()) {
      alert("Please enter an email subject.")
      return
    }

    if (!emailMessage.trim()) {
      alert("Please enter an email message.")
      return
    }

    try {
      // This is a dummy function that would call the backend
      console.log("Sending emails to backend:", {
        emails: extractedEmails,
        subject: emailSubject,
        message: emailMessage,
      })

      alert(`${extractedEmails.length} emails would be sent to the backend.`)

      await axios.post(
        `${apiUrl}/admin/notify`,
        {
          emails: extractedEmails,
          subject: emailSubject,
          message: emailMessage
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );
    } catch (error) {
      console.error("Error sending emails:", error)
      alert("Failed to send emails. Please try again.")
    }
  }

  const saveSettings = (settingType) => {
    // In a real app, this would be an API call
    // PUT /api/settings/{settingType}
    alert(`${settingType} settings saved successfully!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500">Configure system settings and preferences</p>
        </div>

        <div className="space-y-8">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Institute Name</label>
                  <input
                    type="text"
                    name="instituteName"
                    value={generalSettings.instituteName}
                    onChange={handleGeneralSettingsChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Institute Website</label>
                  <input
                    type="url"
                    name="instituteWebsite"
                    value={generalSettings.instituteWebsite}
                    onChange={handleGeneralSettingsChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Placement Officer Name</label>
                  <input
                    type="text"
                    name="placementOfficerName"
                    value={generalSettings.placementOfficerName}
                    onChange={handleGeneralSettingsChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Placement Officer Email</label>
                  <input
                    type="email"
                    name="placementOfficerEmail"
                    value={generalSettings.placementOfficerEmail}
                    onChange={handleGeneralSettingsChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Placement Officer Phone</label>
                  <input
                    type="tel"
                    name="placementOfficerPhone"
                    value={generalSettings.placementOfficerPhone}
                    onChange={handleGeneralSettingsChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                  <input
                    type="text"
                    name="academicYear"
                    value={generalSettings.academicYear}
                    onChange={handleGeneralSettingsChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => saveSettings("General")}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  Save General Settings
                </button>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Email Notifications</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={emailSettings.emailNotifications}
                    onChange={handleEmailSettingsChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                    Enable Email Notifications
                  </label>
                </div>

                <div className="pl-6 space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="studentApplicationNotification"
                      name="studentApplicationNotification"
                      checked={emailSettings.studentApplicationNotification}
                      onChange={handleEmailSettingsChange}
                      disabled={!emailSettings.emailNotifications}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor="studentApplicationNotification"
                      className="ml-2 block text-sm text-gray-700 disabled:opacity-50"
                    >
                      Student Application Notifications
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="companyRegistrationNotification"
                      name="companyRegistrationNotification"
                      checked={emailSettings.companyRegistrationNotification}
                      onChange={handleEmailSettingsChange}
                      disabled={!emailSettings.emailNotifications}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor="companyRegistrationNotification"
                      className="ml-2 block text-sm text-gray-700 disabled:opacity-50"
                    >
                      Company Registration Notifications
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="placementUpdateNotification"
                      name="placementUpdateNotification"
                      checked={emailSettings.placementUpdateNotification}
                      onChange={handleEmailSettingsChange}
                      disabled={!emailSettings.emailNotifications}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label
                      htmlFor="placementUpdateNotification"
                      className="ml-2 block text-sm text-gray-700 disabled:opacity-50"
                    >
                      Placement Update Notifications
                    </label>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700">Email Signature</label>
                  <textarea
                    name="emailSignature"
                    value={emailSettings.emailSignature}
                    onChange={handleEmailSettingsChange}
                    rows={4}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => saveSettings("Email")}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  Save Email Settings
                </button>
              </div>
            </div>
          </div>

          {/* Placement Settings */}
          <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Placement Rules</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowMultipleOffers"
                      name="allowMultipleOffers"
                      checked={placementSettings.allowMultipleOffers}
                      onChange={handlePlacementSettingsChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowMultipleOffers" className="ml-2 block text-sm text-gray-700">
                      Allow Students to Accept Multiple Offers
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Minimum CGPA Required</label>
                  <input
                    type="text"
                    name="minimumCGPA"
                    value={placementSettings.minimumCGPA}
                    onChange={handlePlacementSettingsChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Maximum Active Backlogs Allowed</label>
                  <input
                    type="text"
                    name="maximumActiveBacklogs"
                    value={placementSettings.maximumActiveBacklogs}
                    onChange={handlePlacementSettingsChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowPlacementBreak"
                      name="allowPlacementBreak"
                      checked={placementSettings.allowPlacementBreak}
                      onChange={handlePlacementSettingsChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowPlacementBreak" className="ml-2 block text-sm text-gray-700">
                      Allow Placement Break
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Placement Break Duration</label>
                  <input
                    type="text"
                    name="placementBreakDuration"
                    value={placementSettings.placementBreakDuration}
                    onChange={handlePlacementSettingsChange}
                    disabled={!placementSettings.allowPlacementBreak}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => saveSettings("Placement")}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  Save Placement Rules
                </button>
              </div>
            </div>
          </div>

          {/* Access Control Settings */}
          <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Access Control</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableStudentRegistration"
                    name="enableStudentRegistration"
                    checked={accessSettings.enableStudentRegistration}
                    onChange={handleAccessSettingsChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableStudentRegistration" className="ml-2 block text-sm text-gray-700">
                    Enable Student Registration
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableCompanyRegistration"
                    name="enableCompanyRegistration"
                    checked={accessSettings.enableCompanyRegistration}
                    onChange={handleAccessSettingsChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enableCompanyRegistration" className="ml-2 block text-sm text-gray-700">
                    Enable Company Registration
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="moderateCompanyPostings"
                    name="moderateCompanyPostings"
                    checked={accessSettings.moderateCompanyPostings}
                    onChange={handleAccessSettingsChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="moderateCompanyPostings" className="ml-2 block text-sm text-gray-700">
                    Moderate Company Job Postings
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="studentProfileApproval"
                    name="studentProfileApproval"
                    checked={accessSettings.studentProfileApproval}
                    onChange={handleAccessSettingsChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="studentProfileApproval" className="ml-2 block text-sm text-gray-700">
                    Require Student Profile Approval
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => saveSettings("Access")}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  Save Access Settings
                </button>
              </div>
            </div>
          </div>

          {/* Excel Email Import */}
          <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Email Import from Excel</h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Upload Excel File</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".xlsx,.xls"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
                    >
                      {isUploading ? "Uploading..." : "Choose Excel File"}
                    </button>
                    {excelData && (
                      <span className="text-sm text-green-600">
                        File uploaded successfully! ({excelData.length} rows)
                      </span>
                    )}
                  </div>
                </div>

                {excelData && columns.length > 0 && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Select Email Column</label>
                      <div className="flex gap-3">
                        <select
                          value={selectedColumn}
                          onChange={handleColumnSelect}
                          className="w-full md:w-1/2 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">-- Select Column --</option>
                          {columns.map((column) => (
                            <option key={column} value={column}>
                              {column}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={extractEmails}
                          disabled={!selectedColumn}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Extract Emails
                        </button>
                      </div>
                    </div>

                    {extractedEmails.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700">
                            Extracted Emails ({extractedEmails.length})
                          </label>
                          <button
                            onClick={sendEmailsToBackend}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors"
                          >
                            Process Emails
                          </button>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                          <ul className="space-y-1">
                            {extractedEmails.map((email, index) => (
                              <li key={index} className="text-sm text-gray-700">
                                {email}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Email Subject</label>
                            <input
                              type="text"
                              value={emailSubject}
                              onChange={(e) => setEmailSubject(e.target.value)}
                              placeholder="Enter email subject"
                              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Email Body</label>
                            <textarea
                              value={emailMessage}
                              onChange={(e) => setEmailMessage(e.target.value)}
                              placeholder="Enter email message"
                              rows={6}
                              className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <AddEmailsToAllowedList/>
        </div>
      </div>
    </div>
  )
}

export default Settings
