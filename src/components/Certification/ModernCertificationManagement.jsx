import React, { useState, useEffect } from 'react';
import {
  Edit, List, Trash2, Award, Calendar, Hash, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, UserCheck, Clock, CheckCircle, UserPlus, Link
} from 'lucide-react';

// Column definitions
const columnsList = [
  { key: 'id', label: 'ID' },
  { key: 'user_id', label: 'User ID' },
  { key: 'training_course_id', label: 'Course ID' },
  { key: 'issued_at', label: 'Issued At' },
  { key: 'certificate_url', label: 'Certificate URL' },
  { key: 'actions', label: 'Actions' },
];

// Certification Form Component
const CertificationForm = ({
  showModal,
  setShowModal,
  onCertificationSaved,
  certificationToEdit,
  isEditMode
}) => {
  const [formData, setFormData] = useState({
    user_id: '',
    training_course_id: '',
    issued_at: new Date().toISOString().split('T')[0],
    certificate_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showModal) {
      if (isEditMode && certificationToEdit) {
        setFormData({
          user_id: certificationToEdit.user_id || '',
          training_course_id: certificationToEdit.training_course_id || '',
          issued_at: certificationToEdit.issued_at ? 
            new Date(certificationToEdit.issued_at).toISOString().split('T')[0] : 
            new Date().toISOString().split('T')[0],
          certificate_url: certificationToEdit.certificate_url || ''
        });
      } else {
        setFormData({
          user_id: '',
          training_course_id: '',
          issued_at: new Date().toISOString().split('T')[0],
          certificate_url: ''
        });
      }
      setErrors({});
    }
  }, [showModal, isEditMode, certificationToEdit]);

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
    if (!formData.issued_at) newErrors.issued_at = 'Issue date is required';
    if (formData.certificate_url && !isValidUrl(formData.certificate_url)) {
      newErrors.certificate_url = 'Certificate URL must be a valid URI';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const url = isEditMode 
        ? `http://localhost:3000/api/v1/certifications/${certificationToEdit.id}`
        : 'http://localhost:3000/api/v1/certifications';
      
      const method = isEditMode ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        issued_at: new Date(formData.issued_at).toISOString()
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
        throw new Error(errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} certification`);
      }

      onCertificationSaved();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving certification:', error);
      alert(error.message || `Failed to ${isEditMode ? 'update' : 'create'} certification`);
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
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Edit Certification' : 'Create New Certification'}
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
                Issue Date *
              </label>
              <input
                type="date"
                name="issued_at"
                value={formData.issued_at}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  errors.issued_at 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
              />
              {errors.issued_at && (
                <p className="mt-1 text-sm text-red-600">{errors.issued_at}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate URL
              </label>
              <input
                type="url"
                name="certificate_url"
                value={formData.certificate_url}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  errors.certificate_url 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
                placeholder="https://example.com/certificate.pdf"
              />
              {errors.certificate_url && (
                <p className="mt-1 text-sm text-red-600">{errors.certificate_url}</p>
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
                isEditMode ? 'Update Certification' : 'Create Certification'
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
  certificationToDelete,
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
            <h3 className="text-xl font-semibold text-gray-900">Delete Certification</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete the certification for{' '}
            <span className="font-semibold text-gray-900">
              User: {certificationToDelete?.user_id || ''} in Course: {certificationToDelete?.training_course_id || ''}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">Cancel</button>
          <button onClick={() => onConfirm(certificationToDelete?.id)} className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium">Delete Certification</button>
        </div>
      </div>
    </div>
  );
};

const ModernCertificationManagement = () => {
  const [certifications, setCertifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true, user_name: true, course_title: true, issued_at: true, certificate_url: true, actions: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, certificationToDelete: null });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [certificationToEdit, setCertificationToEdit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Show create modal
  const handleShowCreate = () => {
    console.log('Creating new certification - clearing edit states');
    setCertificationToEdit(null);
    setIsEditMode(false);
    setShowCreateModal(true);
  };

  // Show edit modal
  const handleShowEdit = (certification) => {
    console.log('Editing certification:', certification);
    setCertificationToEdit(certification);
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  // Close certification form
  const handleCloseCertificationForm = () => {
    console.log('Closing certification form - clearing all states');
    setShowCreateModal(false);
    setCertificationToEdit(null);
    setIsEditMode(false);
  };

  // After create/update, refresh certifications
  const handleCertificationSaved = () => {
    console.log('Certification saved - refreshing and clearing states');
    fetchCertifications();
    setShowCreateModal(false);
    setCertificationToEdit(null);
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

  // Fetch certifications from API
  const fetchCertifications = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/api/v1/certifications', {
        headers: { 
          'Content-Type': 'application/json', 
          ...(token && { Authorization: `Bearer ${token}` }) 
        }
      });
      if (!res.ok) throw new Error('Failed to fetch certifications');
      const data = await res.json();
      setCertifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load certifications');
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
    Promise.all([fetchUsers(), fetchCourses(), fetchCertifications()]);
  }, []);

  // Delete certification
  const handleDelete = async (certificationId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:3000/api/v1/certifications/${certificationId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json', 
          ...(token && { Authorization: `Bearer ${token}` }) 
        }
      });
      if (!res.ok) throw new Error('Failed to delete certification');
      setCertifications(certifications.filter(c => c.id !== certificationId));
    } catch (err) {
      alert(err.message || 'Failed to delete certification');
    }
  };

  // Column toggle
  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Delete modal handlers
  const handleDeleteClick = (certification) => setDeleteModal({ isOpen: true, certificationToDelete: certification });
  const handleDeleteConfirm = (certificationId) => {
    handleDelete(certificationId);
    setDeleteModal({ isOpen: false, certificationToDelete: null });
  };
  const handleDeleteCancel = () => setDeleteModal({ isOpen: false, certificationToDelete: null });

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

  // Filtered and paginated certifications
  const filteredCertifications = certifications.filter(certification => {
    const search = searchTerm.toLowerCase();
    const userName = getUserName(certification.user_id).toLowerCase();
    const courseTitle = getCourseTitle(certification.training_course_id).toLowerCase();
    
    return (
      userName.includes(search) ||
      courseTitle.includes(search) ||
      (certification.certificate_url && certification.certificate_url.toLowerCase().includes(search))
    );
  });
  const totalPages = Math.ceil(filteredCertifications.length / itemsPerPage);
  const actualStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCertifications = filteredCertifications.slice(actualStartIndex, actualStartIndex + itemsPerPage);

  // Mobile card view for small screens
  const MobileCard = ({ certification, index }) => {
    const isExpanded = expandedCard === certification?.id;
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-base">
                {truncateText(getUserName(certification?.user_id), 20)}
              </h3>
              <p className="text-gray-500 text-sm">
                ID: {actualStartIndex + index + 1}
              </p>
            </div>
          </div>
          <button onClick={() => setExpandedCard(isExpanded ? null : certification?.id)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {visibleColumns.course_title && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Hash className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 text-sm">{getCourseTitle(certification?.training_course_id)}</span>
            </div>
          )}
          {visibleColumns.issued_at && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-700 text-sm">{formatDate(certification?.issued_at)}</span>
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {visibleColumns.certificate_url && certification?.certificate_url && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Link className="w-4 h-4 text-blue-600" />
                </div>
                <a 
                  href={certification.certificate_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  View Certificate
                </a>
              </div>
            )}
            {visibleColumns.actions && (
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => handleShowEdit(certification)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(certification)}
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
        {actualStartIndex + 1} - {Math.min(actualStartIndex + itemsPerPage, filteredCertifications?.length || 0)} of {filteredCertifications?.length || 0} rows visible
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
        <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading certifications...</span>
      </div>
    );
  }

  // Show "No certifications found" when there are actually no certifications
  if (!certifications || certifications.length === 0) {
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
                Create Certification
                </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Certifications Found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Get started by creating your first certification record.
              </p>
              <button 
                onClick={handleShowCreate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <Plus className="w-5 h-5" />
                Create First Certification
              </button>
            </div>
          </div>
        </div>

        <CertificationForm
          showModal={showCreateModal}
          setShowModal={handleCloseCertificationForm}
          onCertificationSaved={handleCertificationSaved}
          certificationToEdit={certificationToEdit}
          isEditMode={isEditMode}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium mb-2">Error Loading Certifications</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchCertifications}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Certification Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage and track user certifications</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
            >
              <Menu className="w-4 h-4" />
              Menu
            </button>

            {/* Desktop buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <button 
                onClick={handleShowCreate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Certification
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowColumnToggle(!showColumnToggle)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium"
                >
                  <Grid3X3 className="w-4 h-4" />
                  Columns
                </button>
                
                {showColumnToggle && (
                  <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-48 z-30">
                    <div className="space-y-2">
                      {Object.entries({
                        id: 'ID',
                        user_name: 'User Name',
                        course_title: 'Course Title',
                        issued_at: 'Issue Date',
                        certificate_url: 'Certificate URL',
                        actions: 'Actions'
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                          <input
                            type="checkbox"
                            checked={visibleColumns[key]}
                            onChange={() => toggleColumn(key)}
                            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'table' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white rounded-xl p-4 mb-6 shadow-sm space-y-3">
            <button 
              onClick={() => {
                handleShowCreate();
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Certification
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <List className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Grid3X3 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search certifications..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Main Content */}
        {filteredCertifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No certifications match your search criteria. Try adjusting your search terms.
              </p>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          // Table View
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {visibleColumns.id && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        ID
                      </th>
                    )}
                    {visibleColumns.user_name && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User Name
                      </th>
                    )}
                    {visibleColumns.course_title && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Course Title
                      </th>
                    )}
                    {visibleColumns.issued_at && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Issue Date
                      </th>
                    )}
                    {visibleColumns.certificate_url && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Certificate
                      </th>
                    )}
                    {visibleColumns.actions && (
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCertifications.map((certification, index) => (
                    <tr key={certification.id} className="hover:bg-gray-50 transition-colors">
                      {visibleColumns.id && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {actualStartIndex + index + 1}
                        </td>
                      )}
                      {visibleColumns.user_name && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                              <UserCheck className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {getUserName(certification.user_id)}
                            </div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.course_title && (
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">
                            {getCourseTitle(certification.training_course_id)}
                          </div>
                        </td>
                      )}
                      {visibleColumns.issued_at && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {formatDate(certification.issued_at)}
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.certificate_url && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {certification.certificate_url ? (
                            <a 
                              href={certification.certificate_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                            >
                              <Link className="w-4 h-4" />
                              View
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleShowEdit(certification)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(certification)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
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
          </div>
        ) : (
          // Grid View (Mobile Cards)
          <div>
            <div className="space-y-4 mb-6">
              {paginatedCertifications.map((certification, index) => (
                <MobileCard key={certification.id} certification={certification} index={index} />
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm">
              <PaginationControls />
            </div>
          </div>
        )}

        {/* Modals */}
        <CertificationForm
          showModal={showCreateModal}
          setShowModal={handleCloseCertificationForm}
          onCertificationSaved={handleCertificationSaved}
          certificationToEdit={certificationToEdit}
          isEditMode={isEditMode}
        />



        <DeleteConfirmation
          isOpen={deleteModal.isOpen}
          certificationToDelete={deleteModal.certificationToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>

      {/* Click outside handler for column toggle */}
      {showColumnToggle && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setShowColumnToggle(false)}
        />
      )}
    </div>
  );
};

export default ModernCertificationManagement;