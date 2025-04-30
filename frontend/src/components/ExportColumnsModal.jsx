import { useState, useEffect } from "react"

const ExportColumnsModal = ({ isOpen, onClose, onExport, allColumns }) => {
  const [selectedColumns, setSelectedColumns] = useState({})

  // Initialize all columns as selected by default
  useEffect(() => {
    if (isOpen && allColumns) {
      const initialSelection = {}
      allColumns.forEach(column => {
        initialSelection[column] = true
      })
      setSelectedColumns(initialSelection)
    }
  }, [isOpen, allColumns])

  const handleToggleColumn = (column) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  const handleSelectAll = () => {
    const newSelection = {}
    allColumns.forEach(column => {
      newSelection[column] = true
    })
    setSelectedColumns(newSelection)
  }

  const handleDeselectAll = () => {
    const newSelection = {}
    allColumns.forEach(column => {
      newSelection[column] = false
    })
    setSelectedColumns(newSelection)
  }

  const handleExport = () => {
    const columnsToExport = Object.keys(selectedColumns).filter(col => selectedColumns[col])
    onExport(columnsToExport)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Columns to Export</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="mb-4 flex gap-2">
          <button 
            onClick={handleSelectAll}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Select All
          </button>
          <button 
            onClick={handleDeselectAll}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Deselect All
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {allColumns.map(column => (
            <div key={column} className="flex items-center">
              <input
                type="checkbox"
                id={`column-${column}`}
                checked={selectedColumns[column] || false}
                onChange={() => handleToggleColumn(column)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`column-${column}`} className="text-sm">
                {column}
              </label>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Export Selected Columns
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportColumnsModal