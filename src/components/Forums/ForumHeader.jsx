import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, RefreshCw, Grid3X3, Menu, X, Eye, EyeOff, Filter } from 'lucide-react';

const ForumHeader = ({ 
  handleCreateForum,
  fetchForums,
  loading,
  searchTerm,
  setSearchTerm,
  showColumnToggle,
  setShowColumnToggle,
  visibleColumns,
  toggleColumn,
  viewMode,
  setViewMode,
  indexOfFirstItem,
  indexOfLastItem,
  totalItems
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileColumnDropdownOpen, setIsMobileColumnDropdownOpen] = useState(false);
  
  const columnDropdownRef = useRef(null);
  const mobileColumnDropdownRef = useRef(null);

  const totalCount = totalItems || 0;

  const columnsList = [
    { key: 'title', label: 'TITLE' },
    { key: 'author', label: 'AUTHOR' },
    { key: 'category', label: 'CATEGORY' },
    { key: 'replies', label: 'REPLIES' },
    { key: 'created', label: 'CREATED' },
    { key: 'lastActivity', label: 'LAST ACTIVITY' },
    { key: 'actions', label: 'ACTIONS' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(event.target)) {
        setShowColumnToggle(false);
      }
      if (mobileColumnDropdownRef.current && !mobileColumnDropdownRef.current.contains(event.target)) {
        setIsMobileColumnDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowColumnToggle]);

  const handleColumnToggle = (columnKey, value = null) => {
    if (toggleColumn) {
      toggleColumn(columnKey, value);
    }
  };

  const ColumnDropdown = ({ isMobile = false }) => (
    <div className={`absolute ${isMobile ? 'right-0 top-full mt-1' : 'right-0 top-full mt-1'} bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-48`}>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Show/Hide Columns</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {columnsList.map((column) => (
            <label key={column.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
              <input
                type="checkbox"
                checked={visibleColumns[column.key] !== false}
                onChange={() => handleColumnToggle(column.key)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                {visibleColumns[column.key] !== false ? (
                  <Eye size={12} className="text-blue-600" />
                ) : (
                  <EyeOff size={12} className="text-gray-400" />
                )}
                {column.label}
              </span>
            </label>
          ))}
        </div>
        <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => {
              columnsList.forEach(col => handleColumnToggle(col.key, true));
            }}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Show All
          </button>
          <span className="text-gray-300 dark:text-gray-600 mx-2">|</span>
          <button
            onClick={() => {
              columnsList.forEach(col => {
                if (col.key !== 'actions') handleColumnToggle(col.key, false);
              });
            }}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Hide All
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1310px] mx-auto p-4">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-600 border-gray-200 rounded-lg mb-3">
          <div className="px-6 py-3">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleCreateForum}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium text-sm"
                >
                  <Plus size={16} />
                  New Post
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="search"
                    placeholder="Search forums..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 dark:bg-gray-800 border dark:border-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white w-64 text-sm text-gray-700 placeholder-gray-400"
                  />
                </div>
                <button 
                  onClick={fetchForums}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
                
                {/* Desktop Column Toggle */}
                <div className="relative" ref={columnDropdownRef}>
                  <button 
                    onClick={() => setShowColumnToggle(!showColumnToggle)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors" 
                    title="Columns"
                  >
                    <Filter size={16} />
                  </button>
                  
                  {showColumnToggle && <ColumnDropdown />}
                </div>
                
                <button 
                  onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors" 
                  title={viewMode === 'table' ? 'Cards View' : 'Table View'}
                >
                  {viewMode === 'table' ? <Grid3X3 size={16} /> : <Menu size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Counter outside the white container */}
        <div className="px-2">
          <p className="text-gray-600 text-sm">
            Showing {Math.min(indexOfFirstItem + 1, totalCount)}-{Math.min(indexOfLastItem, totalCount)} of {totalCount} Forums
          </p>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="bg-white dark:bg-gray-900 border dark:border-gray-600 border-gray-200 rounded-lg mb-3">
          {/* Top bar with Create button and hamburger */}
          <div className="px-3 py-2.5 border-b border-gray-200 dark:border-gray-600">
            <div className="flex justify-between items-center">
              <button 
                onClick={handleCreateForum}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors font-medium text-sm"
              >
                <Plus size={16} />
                New Post
              </button>
              
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-md transition-colors"
              >
                {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Search bar - always visible on mobile */}
          <div className="px-3 py-2.5 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search forums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-2 dark:bg-gray-800 border dark:border-gray-600 border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white w-full text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Expandable menu section */}
          {isMobileMenuOpen && (
            <div className="px-3 py-2.5">
              <div className="flex justify-center gap-2 bg-white dark:bg-gray-900 rounded-md p-1.5 border dark:border-gray-600 border-gray-200">
                <button 
                  onClick={fetchForums}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
                
                {/* Mobile Column Toggle */}
                <div className="relative" ref={mobileColumnDropdownRef}>
                  <button 
                    onClick={() => setIsMobileColumnDropdownOpen(!isMobileColumnDropdownOpen)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs" 
                    title="Columns"
                  >
                    <Filter size={14} />
                    Columns
                  </button>
                  
                  {isMobileColumnDropdownOpen && <ColumnDropdown isMobile={true} />}
                </div>
                
                <button 
                  onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs" 
                  title={viewMode === 'table' ? 'Cards' : 'Table'}
                >
                  {viewMode === 'table' ? <Grid3X3 size={14} /> : <Menu size={14} />}
                  {viewMode === 'table' ? 'Cards' : 'Table'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Counter outside the white container for mobile */}
        <div className="px-2">
          <p className="text-gray-600 text-xs">
            Showing {Math.min(indexOfFirstItem + 1, totalCount)}-{Math.min(indexOfLastItem, totalCount)} of {totalCount} Forums
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForumHeader;