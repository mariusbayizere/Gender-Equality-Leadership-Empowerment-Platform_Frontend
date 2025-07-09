import React, { useState, useEffect } from 'react';
import { Edit, List, Trash2, User, Clock, Target, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, TrendingUp, CheckCircle, Activity, BarChart, Key, Shield } from 'lucide-react';
import { formatDate } from './formatDate';
import { apiService } from './api_file'; // Import the API service
import ProgressTrackingForm from './ProgressTrackingForm'; 
import { getStatusBadge, getStatusIcon } from './getStatusBadge'
import { columns } from './columns';
import { DeleteConfirmation } from './DeleteConfirmation'; // Import the DeleteConfirmation component
import { MobileCard } from './MobileCard'; // Import the MobileCard component}


// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';
const API_ENDPOINTS = {
  progress: `${API_BASE_URL}/progress_tracking`,
  progressById: (id) => `${API_BASE_URL}/progress_tracking/${id}`,
  users: `${API_BASE_URL}/users`,
  courses: `${API_BASE_URL}/training_courses`,
  auth: `${API_BASE_URL}/auth/login`,
  refresh: `${API_BASE_URL}/auth/refresh`
};

// Enhanced API Service with better auth handling


// Delete Confirmation Modal Component


// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
    <div className="flex items-center">
      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
      <p className="text-red-800">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        Try Again
      </button>
    )}
  </div>
);


// Progress bar component
const ProgressBar = ({ percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div 
      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);



// Mobile Card Component

const ModernProgressTrackingManagement = () => {
  // State management
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [editingProgress, setEditingProgress] = useState(null);
  const [formMode, setFormMode] = useState('create');
  // 
  const [progressEntries, setProgressEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    entryToDelete: null
  });
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    user_info: true,
    course_info: true,
    progress_percentage: true,
    status: true,
    session_count: true,
    completion_date: true,
    actions: true
  });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch progress entries on component mount
  useEffect(() => {
    fetchProgressEntries();
  }, []);

  // Filter entries based on search term
  useEffect(() => {
    if (!progressEntries.length) {
      setFilteredEntries([]);
      return;
    }

    const filtered = progressEntries.filter(entry =>
      entry.user_info?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.course_info?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.feedback?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEntries(filtered);
    setCurrentPage(1);
  }, [searchTerm, progressEntries]);

  // Responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('cards');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProgressEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiService.fetchProgressEntries();
      setProgressEntries(data);
    } catch (error) {
      setError(`Failed to fetch progress entries: ${error.message}`);
      setProgressEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedEntries = [...filteredEntries].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Handle nested objects
      if (key === 'user_info') {
        aValue = a.user_info?.name || '';
        bValue = b.user_info?.name || '';
      } else if (key === 'course_info') {
        aValue = a.course_info?.title || '';
        bValue = b.course_info?.title || '';
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredEntries(sortedEntries);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (entryId) => {
    try {
      setDeleteLoading(true);
      await apiService.deleteProgressEntry(entryId);
      
      // Remove from local state
      setProgressEntries(prev => prev.filter(entry => entry.id !== entryId));
      
      // Show success message (you can customize this)
      console.log('Progress entry deleted successfully');
      
      // Adjust current page if necessary
      const newTotalItems = filteredEntries.length - 1;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      setError(`Failed to delete progress entry: ${error.message}`);
    } finally {
      setDeleteLoading(false);
    }
  };

    const handleCreateProgress = () => {
    setEditingProgress(null);
    setFormMode('create');
    setShowProgressForm(true);
  };

  const handleEditProgress = (progressData) => {
    setEditingProgress(progressData);
    setFormMode('update');
    setShowProgressForm(true);
  };


// new one
  const handleDeleteClick = (entry) => {
    setDeleteModal({
      isOpen: true,
      entryToDelete: entry
    });
  };

  const handleDeleteConfirm = (entryId) => {
    handleDelete(entryId);
    setDeleteModal({
      isOpen: false,
      entryToDelete: null
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      entryToDelete: null
    });
  };

  const handleEdit = (entry) => {
    console.log('Edit entry:', entry);
    // Implement edit functionality
  };

  const handleCreateEntry = () => {
    console.log('Create new entry');
    // Implement create functionality
  };

  // Pagination component
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
      <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
        {filteredEntries.length > 0 ? `${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredEntries.length)} of ${filteredEntries.length} rows visible` : 'No data available'}
      </div>
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ‹
        </button>
        {[...Array(Math.min(3, totalPages))].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        {totalPages > 3 && (
          <>
            <span className="text-gray-600 px-1">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                currentPage === totalPages
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ErrorMessage message={error} onRetry={fetchProgressEntries} />
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!paginatedEntries || paginatedEntries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button 
                  onClick={handleCreateEntry}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Entry</span>
                  <span className="sm:hidden">Create</span>
                </button>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search progress entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
 className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={fetchProgressEntries}
                    className="p-2.5 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BarChart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Progress Entries Found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'No entries match your search criteria.' : 'Get started by creating your first progress entry.'}
              </p>
              <button
                onClick={handleCreateEntry}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <Plus className="w-5 h-5" />
                Create First Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
<div className="flex flex-col space-y-4 mb-4 sm:mb-6">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <button 
            onClick={handleCreateProgress} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Progress</span>
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
              // onClick={fetchCourses}
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
              onClick={handleCreateProgress} 
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
                  // onClick={fetchCourses}
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

        {/* Main Content */}
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
  {viewMode === 'table' ? (
    <>
      {/* Remove overflow-x-auto and add overflow-hidden */}
      <div className="overflow-hidden">
        <table className="w-full table-fixed"> {/* Add table-fixed for consistent column widths */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                visibleColumns[column.key] && (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${
                      // Add specific widths for each column
                      column.key === 'id' ? 'w-16' :
                      column.key === 'user_info' ? 'w-64' :
                      column.key === 'course_info' ? 'w-64' :
                      column.key === 'progress_percentage' ? 'w-32' :
                      column.key === 'status' ? 'w-40' :
                      column.key === 'session_count' ? 'w-24' :
                      column.key === 'completion_date' ? 'w-32' :
                      column.key === 'actions' ? 'w-24' : 'w-auto'
                    }`}
                    onClick={() => column.key !== 'actions' && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span className="truncate">{column.label}</span>
                      {column.key !== 'actions' && (
                        <div className="flex flex-col">
                          <div className={`w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-400 ${
                            sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'border-b-blue-600' : ''
                          }`}></div>
                          <div className={`w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-400 ${
                            sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'border-t-blue-600' : ''
                          }`}></div>
                        </div>
                      )}
                    </div>
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedEntries.map((entry, index) => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                {visibleColumns.id && (
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate">
                    {startIndex + index + 1}
                  </td>
                )}
                {visibleColumns.user_info && (
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {entry?.user_info?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {entry?.user_info?.email || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                )}
                {visibleColumns.course_info && (
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {entry?.course_info?.title || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {entry?.course_info?.type || 'N/A'}
                    </div>
                  </td>
                )}
                {visibleColumns.progress_percentage && (
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${entry?.progress_percentage || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 min-w-max">
                        {entry?.progress_percentage || 0}%
                      </span>
                    </div>
                  </td>
                )}
                {visibleColumns.status && (
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(entry?.status)}
                      <span className={getStatusBadge(entry?.status)}>
                        {entry?.status?.replace('_', ' ').toUpperCase() || 'N/A'}
                      </span>
                    </div>
                  </td>
                )}
                {visibleColumns.session_count && (
                  <td className="px-6 py-4 text-sm text-gray-900 truncate">
                    {entry?.session_count || 0}
                  </td>
                )}
                {visibleColumns.completion_date && (
                  <td className="px-6 py-4 text-sm text-gray-900 truncate">
                    {formatDate(entry?.completion_date)}
                  </td>
                )}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditProgress(entry)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(entry)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            </>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedEntries.map((entry, index) => (
                  <MobileCard
                    key={entry.id}
                    entry={entry}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onExpand={setExpandedCard}
                    isExpanded={expandedCard === entry.id}
                    startIndex={startIndex}
                  />
                ))}
              </div>
            </div>
          )}
          
          <PaginationControls />
        </div>
      </div>

    <ProgressTrackingForm
      showModal={showProgressForm}
      setShowModal={setShowProgressForm}
      onProgressCreated={handleCreateProgress}
      onProgressUpdated={handleEditProgress}
      editingProgress={editingProgress}
      mode={formMode}
    />      

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        entryToDelete={deleteModal.entryToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ModernProgressTrackingManagement;
