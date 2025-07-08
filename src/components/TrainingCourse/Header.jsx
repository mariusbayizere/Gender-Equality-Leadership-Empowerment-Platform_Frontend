import React from 'react';
import { Plus, Search, RefreshCw, List, Grid3X3, Menu, X } from 'lucide-react';

export const ModernTrainingCourseManagementHeader = ({
  handleCreateCourse,
  searchTerm,
  setSearchTerm,
  fetchCourses,
  viewMode,
  setViewMode,
  showColumnToggle,
  setShowColumnToggle,
  columns,
  visibleColumns,
  toggleColumn,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  return (
    <>
      <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <button 
            onClick={handleCreateCourse} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
            <button
              onClick={fetchCourses}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
              title={viewMode === 'table' ? 'Card View' : 'Table View'}
            >
              <List className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowColumnToggle(!showColumnToggle)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
                title="Column Visibility"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              {showColumnToggle && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 z-50 min-w-[150px]">
                  {columns.map(column => (
                    <label key={column.key} className="flex items-center space-x-2 py-1 cursor-pointer text-gray-700 hover:bg-gray-50 rounded px-2">
                      <input
                        type="checkbox"
                        checked={visibleColumns[column.key]}
                        onChange={() => toggleColumn(column.key)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">{column.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={handleCreateCourse} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Course</span>
              <span className="sm:hidden">Create</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {isMobileMenuOpen && (
            <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={fetchCourses}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>

                <button 
                  onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  <List className="w-4 h-4" />
                  <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
                </button>
                <button
                  onClick={() => setShowColumnToggle(!showColumnToggle)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Columns</span>
                </button>
              </div>
              {showColumnToggle && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {columns.map(column => (
                      <label key={column.key} className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:bg-gray-50 rounded px-2 py-1">
                        <input
                          type="checkbox"
                          checked={visibleColumns[column.key]}
                          onChange={() => toggleColumn(column.key)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm">{column.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>    
    </>
  );
};