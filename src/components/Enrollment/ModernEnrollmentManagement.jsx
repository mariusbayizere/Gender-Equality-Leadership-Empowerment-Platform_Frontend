import React, { useState, useEffect } from 'react';
import {
  Edit, List, Trash2, Users, Calendar, Hash, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, UserCheck, Clock, CheckCircle, UserPlus
} from 'lucide-react';

// Column definitions
const columnsList = [
  { key: 'id', label: 'ID' },
  { key: 'user_id', label: 'User ID' },
  { key: 'training_course_id', label: 'Course ID' },
  { key: 'status', label: 'Status' },
  { key: 'enrolled_at', label: 'Enrolled At' },
  { key: 'actions', label: 'Actions' },
];

// Status options
const statusOptions = [
  { value: 'enrolled', label: 'Enrolled', color: 'blue' },
  { value: 'in_progress', label: 'In Progress', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'green' }
];

// Enrollment Form Component
const EnrollmentForm = ({
  showModal,
  setShowModal,
  onEnrollmentSaved,
  enrollmentToEdit,
  isEditMode
}) => {
  const [formData, setFormData] = useState({
    user_id: '',
    training_course_id: '',
    status: 'enrolled',
    enrolled_at: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showModal) {
      if (isEditMode && enrollmentToEdit) {
        setFormData({
          user_id: enrollmentToEdit.user_id || '',
          training_course_id: enrollmentToEdit.training_course_id || '',
          status: enrollmentToEdit.status || 'enrolled',
          enrolled_at: enrollmentToEdit.enrolled_at ? 
            new Date(enrollmentToEdit.enrolled_at).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0]
        });
      } else {
        setFormData({
          user_id: '',
          training_course_id: '',
          status: 'enrolled',
          enrolled_at: new Date().toISOString().split('T')[0]
        });
      }
      setErrors({});
    }
  }, [showModal, isEditMode, enrollmentToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.user_id.trim()) newErrors.user_id = 'User ID is required';
    if (!formData.training_course_id.trim()) newErrors.training_course_id = 'Training Course ID is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.enrolled_at) newErrors.enrolled_at = 'Enrollment date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const url = isEditMode 
        ? `http://localhost:3000/api/v1/enrollments/${enrollmentToEdit.id}`
        : 'http://localhost:3000/api/v1/enrollments';
      
      const method = isEditMode ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        enrolled_at: new Date(formData.enrolled_at).toISOString()
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} enrollment`);
      }

      onEnrollmentSaved();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving enrollment:', error);
      alert(error.message || `Failed to ${isEditMode ? 'update' : 'create'} enrollment`);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Edit Enrollment' : 'Create New Enrollment'}
            </h3>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID *
              </label>
              <input
                type="text"
                name="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  errors.user_id 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
                placeholder="Enter user ID"
              />
              {errors.user_id && (
                <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Training Course ID *
              </label>
              <input
                type="text"
                name="training_course_id"
                value={formData.training_course_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  errors.training_course_id 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
                placeholder="Enter training course ID"
              />
              {errors.training_course_id && (
                <p className="mt-1 text-sm text-red-600">{errors.training_course_id}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  errors.status 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enrollment Date *
              </label>
              <input
                type="date"
                name="enrolled_at"
                value={formData.enrolled_at}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  errors.enrolled_at 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
              />
              {errors.enrolled_at && (
                <p className="mt-1 text-sm text-red-600">{errors.enrolled_at}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Enrollment' : 'Create Enrollment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmation = ({
  isOpen,
  enrollmentToDelete,
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Delete Enrollment</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete the enrollment for{' '}
            <span className="font-semibold text-gray-900">
              User: {enrollmentToDelete?.user_id || ''} in Course: {enrollmentToDelete?.training_course_id || ''}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">Cancel</button>
          <button onClick={() => onConfirm(enrollmentToDelete?.id)} className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium">Delete Enrollment</button>
        </div>
      </div>
    </div>
  );
};

const ModernEnrollmentManagement = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true, user_name: true, course_title: true, status: true, enrolled_at: true, actions: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, enrollmentToDelete: null });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [enrollmentToEdit, setEnrollmentToEdit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Show create modal
  const handleShowCreate = () => {
    console.log('Creating new enrollment - clearing edit states');
    setEnrollmentToEdit(null);
    setIsEditMode(false);
    setShowCreateModal(true);
  };

  // Show edit modal
  const handleShowEdit = (enrollment) => {
    console.log('Editing enrollment:', enrollment);
    setEnrollmentToEdit(enrollment);
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  // Close enrollment form
  const handleCloseEnrollmentForm = () => {
    console.log('Closing enrollment form - clearing all states');
    setShowCreateModal(false);
    setEnrollmentToEdit(null);
    setIsEditMode(false);
  };

  // After create/update, refresh enrollments
  const handleEnrollmentSaved = () => {
    console.log('Enrollment saved - refreshing and clearing states');
    fetchEnrollments();
    setShowCreateModal(false);
    setEnrollmentToEdit(null);
    setIsEditMode(false);
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/api/v1/users', {
        headers: { 
          'Content-Type': 'application/json', 
          ...(token && { Authorization: `Bearer ${token}` }) 
        }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users:', err.message);
    }
  };

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/api/v1/training_courses', {
        headers: { 
          'Content-Type': 'application/json', 
          ...(token && { Authorization: `Bearer ${token}` }) 
        }
      });
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load courses:', err.message);
    }
  };

  // Fetch enrollments from API
  const fetchEnrollments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/api/v1/enrollments', {
        headers: { 
          'Content-Type': 'application/json', 
          ...(token && { Authorization: `Bearer ${token}` }) 
        }
      });
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      const data = await res.json();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : userId || 'Unknown User';
  };

  // Get course title by ID
  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : courseId || 'Unknown Course';
  };

  useEffect(() => {
    // Fetch all data in parallel
    Promise.all([fetchUsers(), fetchCourses(), fetchEnrollments()]);
  }, []);

  // Delete enrollment
  const handleDelete = async (enrollmentId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:3000/api/v1/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json', 
          ...(token && { Authorization: `Bearer ${token}` }) 
        }
      });
      if (!res.ok) throw new Error('Failed to delete enrollment');
      setEnrollments(enrollments.filter(e => e.id !== enrollmentId));
    } catch (err) {
      alert(err.message || 'Failed to delete enrollment');
    }
  };

  // Column toggle
  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Delete modal handlers
  const handleDeleteClick = (enrollment) => setDeleteModal({ isOpen: true, enrollmentToDelete: enrollment });
  const handleDeleteConfirm = (enrollmentId) => {
    handleDelete(enrollmentId);
    setDeleteModal({ isOpen: false, enrollmentToDelete: null });
  };
  const handleDeleteCancel = () => setDeleteModal({ isOpen: false, enrollmentToDelete: null });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Truncate text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status) || statusOptions[0];
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800'
    };
    
    const iconMap = {
      enrolled: UserPlus,
      in_progress: Clock,
      completed: CheckCircle
    };
    
    const IconComponent = iconMap[status] || UserCheck;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses[statusConfig.color]}`}>
        <IconComponent className="w-3 h-3" />
        {statusConfig.label}
      </span>
    );
  };

  // Filtered and paginated enrollments
  const filteredEnrollments = enrollments.filter(enrollment => {
    const search = searchTerm.toLowerCase();
    const userName = getUserName(enrollment.user_id).toLowerCase();
    const courseTitle = getCourseTitle(enrollment.training_course_id).toLowerCase();
    
    return (
      userName.includes(search) ||
      courseTitle.includes(search) ||
      (enrollment.status && enrollment.status.toLowerCase().includes(search))
    );
  });
  const totalPages = Math.ceil(filteredEnrollments.length / itemsPerPage);
  const actualStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnrollments = filteredEnrollments.slice(actualStartIndex, actualStartIndex + itemsPerPage);

  // Mobile card view for small screens
  const MobileCard = ({ enrollment, index }) => {
    const isExpanded = expandedCard === enrollment?.id;
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-base">
                {truncateText(getUserName(enrollment?.user_id), 20)}
              </h3>
              <p className="text-gray-500 text-sm">
                ID: {actualStartIndex + index + 1}
              </p>
            </div>
          </div>
          <button onClick={() => setExpandedCard(isExpanded ? null : enrollment?.id)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {visibleColumns.course_title && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Hash className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 text-sm">{getCourseTitle(enrollment?.training_course_id)}</span>
            </div>
          )}
          {visibleColumns.status && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div>{getStatusBadge(enrollment?.status)}</div>
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {visibleColumns.enrolled_at && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700 text-sm">{formatDate(enrollment?.enrolled_at)}</span>
              </div>
            )}
            {visibleColumns.actions && (
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => handleShowEdit(enrollment)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(enrollment)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Pagination component
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
      <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
        {actualStartIndex + 1} - {Math.min(actualStartIndex + itemsPerPage, filteredEnrollments?.length || 0)} of {filteredEnrollments?.length || 0} rows visible
      </div>
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">‹</button>
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
        <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">›</button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading enrollments...</span>
      </div>
    );
  }

  // Show "No enrollments found" when there are actually no enrollments
  if (!enrollments || enrollments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleShowCreate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Enrollment
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search enrollments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-sm"
                />
              </div>
              <button onClick={fetchEnrollments} className="p-2.5 text-gray-600 hover:text-gray-800 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2.5 text-gray-600 hover:text-gray-800 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm">
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Enrollments Found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first enrollment.</p>
              <button 
                onClick={handleShowCreate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create First Enrollment
              </button>
            </div>
          </div>
        </div>
        
        <EnrollmentForm
          showModal={showCreateModal}
          setShowModal={handleCloseEnrollmentForm}
          onEnrollmentSaved={handleEnrollmentSaved}
          enrollmentToEdit={enrollmentToEdit}
          isEditMode={isEditMode}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Enrollments</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <button 
                onClick={fetchEnrollments}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
          <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <button 
              onClick={handleShowCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Enrollment</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                {enrollments.length} total enrollment{enrollments.length !== 1 ? 's' : ''}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search enrollments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button onClick={fetchEnrollments} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors" title="Refresh">
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
                    {columnsList.map(column => (
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
                onClick={handleShowCreate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Enrollment</span>
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
                placeholder="Search enrollments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {isMobileMenuOpen && (
              <div className="mt-3 mobile-menu-container bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button onClick={fetchEnrollments} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
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
                  <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Toggle Columns</h4>
                    {columnsList.map(column => (
                      <label key={column.key} className="flex items-center space-x-2 cursor-pointer text-gray-700">
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
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {viewMode === 'table' ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {visibleColumns.id && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                      )}
                      {visibleColumns.user_name && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User Name</th>
                      )}
                      {visibleColumns.course_title && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Title</th>
                      )}
                      {visibleColumns.status && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      )}
                      {visibleColumns.enrolled_at && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Enrolled At</th>
                      )}
                      {visibleColumns.actions && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedEnrollments.map((enrollment, index) => (
                      <tr key={enrollment?.id} className="hover:bg-gray-50 transition-colors">
                        {visibleColumns.id && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {actualStartIndex + index + 1}
                          </td>
                        )}
                        {visibleColumns.user_name && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {getUserName(enrollment?.user_id)}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        {visibleColumns.course_title && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {truncateText(getCourseTitle(enrollment?.training_course_id), 40)}
                          </td>
                        )}
                        {visibleColumns.status && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(enrollment?.status)}
                          </td>
                        )}
                        {visibleColumns.enrolled_at && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(enrollment?.enrolled_at)}
                          </td>
                        )}
                        {visibleColumns.actions && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleShowEdit(enrollment)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(enrollment)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                title="Delete"
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
              <PaginationControls />
            </>
          ) : (
            <>
              <div className="p-6">
                {paginatedEnrollments.map((enrollment, index) => (
                  <MobileCard key={enrollment?.id} enrollment={enrollment} index={index} />
                ))}
              </div>
              <PaginationControls />
            </>
          )}
        </div>

        {/* Show message when no results found after filtering */}
        {filteredEnrollments.length === 0 && searchTerm && (
          <div className="flex items-center justify-center py-16 bg-white rounded-xl shadow-sm mt-4">
            <div className="text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-500 mb-6">
                No enrollments match your search for "{searchTerm}"
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium mx-auto"
              >
                <X className="w-4 h-4" />
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EnrollmentForm
        showModal={showCreateModal}
        setShowModal={handleCloseEnrollmentForm}
        onEnrollmentSaved={handleEnrollmentSaved}
        enrollmentToEdit={enrollmentToEdit}
        isEditMode={isEditMode}
      />

      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        enrollmentToDelete={deleteModal.enrollmentToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default ModernEnrollmentManagement;