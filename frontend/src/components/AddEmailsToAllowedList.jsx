import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const AddEmailsToAllowedList = () => {
    const fileInputRef = useRef(null);
    const [excelData, setExcelData] = useState(null);
    const [columns, setColumns] = useState([]);
    const [selectedColumn, setSelectedColumn] = useState("");
    const [extractedEmails, setExtractedEmails] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setColumns([]);
        setSelectedColumn("");
        setExtractedEmails([]);
        setResponseMessage("");
        setExcelData(null);

        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length > 0) {
                setColumns(Object.keys(jsonData[0]));
                setExcelData(jsonData);
            }

            setIsUploading(false);
        };

        reader.readAsArrayBuffer(file);
    };


    const handleColumnSelect = (e) => {
        setSelectedColumn(e.target.value);
    };

    const extractEmails = () => {
        if (!excelData || !selectedColumn) return;

        const emails = excelData
            .map((row) => row[selectedColumn])
            .filter((email) => typeof email === "string" && email.includes("@"));

        setExtractedEmails(emails);

        if (emails.length === 0) {
            setResponseMessage("No valid emails could be extracted from the selected column.");
        } else {
            setResponseMessage("");
        }
    };


    const sendEmailsToBackend = async () => {
        try {
            const response = await axios.post(`${apiUrl}/admin/add-emails`, {
                emails: extractedEmails,
            });

            if (response.data) {
                setResponseMessage("Emails added successfully!");
            }
        } catch (err) {
            setResponseMessage(err.response?.data?.message || "Failed to add emails.");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden mt-8">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Emails to Allowed List</h2>

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
                                            Submit to Allowed List
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

                                    {responseMessage && (
                                        <p className="text-sm mt-2 text-indigo-600 font-medium">{responseMessage}</p>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddEmailsToAllowedList;
