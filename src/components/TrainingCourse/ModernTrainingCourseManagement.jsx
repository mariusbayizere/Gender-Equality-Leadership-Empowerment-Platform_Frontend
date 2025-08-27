
  import React, { useState, useEffect } from 'react';
  import { Edit, List, Trash2, BookOpen, User, Clock, Hash, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, Award, Globe, Video } from 'lucide-react';
  import TrainingCourseForm from './TrainingCourseForm';
  import { formatDate } from './formatDate'
  import { DeleteConfirmation } from './DeleteConfirmation';
  import {ModernTrainingCourseManagementHeader} from './Header';
  import { columns } from './Hardcodedcolumn';
  import { getCourseTypeIcon, getCourseTypeBadge } from './CourseTypeBadge'; 
  import { MobileCard} from './MobileCard';

  const API_BASE_URL = 'http://localhost:3000/api/v1';
  const API_ENDPOINTS = {
    courses: `${API_BASE_URL}/training_courses`,
    courseById: (id) => `${API_BASE_URL}/training_courses/${id}`
  };

  // API Service functions
  const apiService = {
    // Get auth token (modify this based on your auth implementation)
    getAuthToken: () => {
      return localStorage.getItem('token') || '';
    },

    // Get headers with auth
    getHeaders: () => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiService.getAuthToken()}`
    }),

    // Fetch all courses
    fetchCourses: async () => {
      try {
        const response = await fetch(API_ENDPOINTS.courses, {
          method: 'GET',
          headers: apiService.getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
      }
    },

    // Delete course
    deleteCourse: async (courseId) => {
      try {
        const response = await fetch(API_ENDPOINTS.courseById(courseId), {
          method: 'DELETE',
          headers: apiService.getHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return true;
      } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
      }
    }
  };

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading courses...</span>
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


  const ModernTrainingCourseManagement = () => {
    // State management
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [expandedCard, setExpandedCard] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
      isOpen: false,
      courseToDelete: null
    });
    const [visibleColumns, setVisibleColumns] = useState({
      id: true,
      title: true,
      course_type: true,
      instructor_name: true,
      duration: true,
      is_active: true,
      actions: true
    });
    const [viewMode, setViewMode] = useState('table');
    const [showColumnToggle, setShowColumnToggle] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    const handleCreateCourse = () => {
      setShowCreateModal(true);
    };

    const handleCourseCreated = (newCourse) => {
      setCourses(prevCourses => [...prevCourses, newCourse]);
    };

    useEffect(() => {
      fetchCourses();
    }, []);

    // Filter courses based on search term
    useEffect(() => {
      if (!courses.length) {
        setFilteredCourses([]);
        return;
      }

      const filtered = courses.filter(course =>
        course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
      setCurrentPage(1);
    }, [searchTerm, courses]);

    // Responsive view mode - automatically switch to cards on mobile
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

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.fetchCourses();
        setCourses(data);
      } catch (error) {
        setError(`Failed to fetch courses: ${error.message}`);
        setCourses([]);
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

    // Improved handleEdit function
    const handleEdit = (course) => {
      console.log('Editing course:', course); // Debug log
      setEditingCourse(course);
      setShowUpdateModal(true);
    };

    // Handler for closing update modal
    const handleCloseUpdateModal = () => {
      setShowUpdateModal(false);
      setEditingCourse(null);
    };

    // Handler for when course is updated
    const handleCourseUpdated = (updatedCourse) => {
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === updatedCourse.id ? updatedCourse : course
        )
      );
      handleCloseUpdateModal();
    };

    // Debug useEffect
    useEffect(() => {
      console.log('EditingCourse state:', editingCourse);
      console.log('ShowUpdateModal state:', showUpdateModal);
    }, [editingCourse, showUpdateModal]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const actualStartIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCourses = filteredCourses.slice(actualStartIndex, actualStartIndex + itemsPerPage);

    const handleDelete = async (courseId) => {
      try {
        await apiService.deleteCourse(courseId);
        setCourses(prev => prev.filter(course => course.id !== courseId));
        console.log('Course deleted successfully');
      } catch (error) {
        setError(`Failed to delete course: ${error.message}`);
      }
    };

    const handleDeleteClick = (course) => {
      setDeleteModal({
        isOpen: true,
        courseToDelete: course
      });
    };

    const handleDeleteConfirm = (courseId) => {
      handleDelete(courseId);
      setDeleteModal({
        isOpen: false,
        courseToDelete: null
      });
    };

    const handleDeleteCancel = () => {
      setDeleteModal({
        isOpen: false,
        courseToDelete: null
      });
    };

    // Add handleSort function
    const handleSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });

      const sortedCourses = [...filteredCourses].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'asc' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      setFilteredCourses(sortedCourses);
    };

    // Pagination component
    const PaginationControls = () => (
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
        <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
          {actualStartIndex + 1} - {Math.min(actualStartIndex + itemsPerPage, filteredCourses?.length || 0)} of {filteredCourses?.length || 0} rows visible
        </div>
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ‹
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && (
            <>
              <span className="text-gray-600 px-2">...</span>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
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
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ›
          </button>
        </div>
      </div>
    );

    // Loading state
    if (loading) {
      return <LoadingSpinner />;
    }

    // No courses found (completely empty)
    if (!courses || courses.length === 0) {
      return (
        <div className="h-full flex flex-col bg-gray-50">
          <div className="p-6 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleCreateCourse}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create Course
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-sm"
                  />
                </div>
                <button onClick={fetchCourses} className="p-2.5 text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-200 shadow-sm">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="p-2.5 text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-200 shadow-sm">
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center bg-white mx-6 mb-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No courses found</p>
              <p className="text-gray-500">Try adjusting your search criteria or add some courses.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Header Section - Matching user management exactly */}
        <div className="flex-shrink-0 p-6 pb-0">
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
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
                <button onClick={fetchCourses} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors" title="Refresh">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors" title={viewMode === 'table' ? 'Card View' : 'Table View'}>
                  <List className="w-4 h-4" />
                </button>
                <div className="relative column-toggle-container">
                  <button onClick={() => setShowColumnToggle(!showColumnToggle)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors" title="Column Visibility">
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
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
                  {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {isMobileMenuOpen && (
                <div className="mt-3 mobile-menu-container bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={fetchCourses} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                    <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
                      <List className="w-4 h-4" />
                      <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
                    </button>
                    <button onClick={() => setShowColumnToggle(!showColumnToggle)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
                      <Grid3X3 className="w-4 h-4" />
                      <span>Columns</span>
                    </button>
                  </div>
                  {showColumnToggle && (
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <h4 className="text-gray-700 text-sm font-medium mb-2">Show Columns:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {columns.map(column => (
                          <label key={column.key} className="flex items-center space-x-2 text-gray-700 text-sm">
                            <input
                              type="checkbox"
                              checked={visibleColumns[column.key]}
                              onChange={() => toggleColumn(column.key)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span>{column.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-sm">
              <strong>Error:</strong> <span>{error}</span>
            </div>
          )}
          
          {/* Results info */}
          {filteredCourses.length > 0 && (
            <div className="mb-6">
              <p className="text-gray-600 text-sm font-medium">
                Showing {actualStartIndex + 1}-{Math.min(actualStartIndex + itemsPerPage, filteredCourses.length)} of {filteredCourses.length} courses
              </p>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 px-6 pb-6 min-h-0">
          {/* No results message for search */}
          {filteredCourses.length === 0 && searchTerm && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-800 text-xl font-semibold mb-2">No courses match your search</p>
                  <p className="text-gray-500">Try searching with different keywords or clear the search to see all courses.</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
              <div className="mt-auto">
                <PaginationControls />
              </div>
            </div>
          )}

          {/* Main Content - Table or Cards */}
          {filteredCourses.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              {viewMode === 'table' ? (
                <>
                  <div className="flex-1 min-h-0">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                        <tr>
                          {columns.map(column => (
                            visibleColumns[column.key] && (
                              <th
                                key={column.key}
                                className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => column.key !== 'actions' && handleSort(column.key)}
                              >
                                <div className="flex items-center space-x-1">
                                  <span>{column.label}</span>
                                  {column.key !== 'actions' && sortConfig.key === column.key && (
                                    <span className="text-blue-600">
                                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                    </span>
                                  )}
                                </div>
                              </th>
                            )
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedCourses.map((course, index) => (
                          <tr key={course.id || index} className="hover:bg-gray-50 transition-colors">
                            {visibleColumns.id && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {actualStartIndex + index + 1}
                              </td>
                            )}
                            {visibleColumns.title && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                    <BookOpen className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">
                                      {course.title || 'N/A'}
                                    </div>
                                    {course.description && (
                                      <div className="text-sm text-gray-500 truncate max-w-xs">
                                        {course.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            )}
                            {visibleColumns.course_type && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  {getCourseTypeIcon(course.course_type)}
                                  <span className={getCourseTypeBadge(course.course_type)}>
                                    {course.course_type?.charAt(0).toUpperCase() + course.course_type?.slice(1) || 'N/A'}
                                  </span>
                                </div>
                              </td>
                            )}
                            {visibleColumns.instructor_name && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">
                                    {course.instructor_name || 'N/A'}
                                  </span>
                                </div>
                              </td>
                            )}
                            {visibleColumns.duration && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-900">
                                    {course.duration || 'N/A'}
                                  </span>
                                </div>
                              </td>
                            )}
                            {visibleColumns.is_active && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                  course.is_active 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {course.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            )}
                            {visibleColumns.actions && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleEdit(course)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors shadow-sm"
                                    title="Edit Course"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(course)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-sm"
                                    title="Delete Course"
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
                  <div className="mt-auto">
                    <PaginationControls />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 p-6 min-h-0">
                    <div className="grid gap-4">
                      {paginatedCourses.map((course, index) => (
                        <MobileCard
                          key={course.id || index}
                          course={course}
                          index={index}
                          startIndex={actualStartIndex}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
                          onExpand={setExpandedCard}
                          isExpanded={expandedCard === course.id}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <PaginationControls />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <TrainingCourseForm 
          showModal={showCreateModal}
          setShowModal={setShowCreateModal}
          onCourseCreated={handleCourseCreated}
          mode="create"
        />
        <TrainingCourseForm 
          showModal={showUpdateModal}
          setShowModal={handleCloseUpdateModal}
          onCourseUpdated={handleCourseUpdated}
          editingCourse={editingCourse}
          mode="update"
          key={editingCourse?.id || 'update-form'}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={deleteModal.isOpen}
          courseToDelete={deleteModal.courseToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    );
  };

  export default ModernTrainingCourseManagement;