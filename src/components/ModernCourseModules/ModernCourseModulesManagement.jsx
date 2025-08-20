import React, { useState, useEffect } from 'react';
import {
  Edit, List, Trash2, BookOpen, Users, Calendar, Link, Hash, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, FileText, HelpCircle, Play
} from 'lucide-react';

// Column definitions
const columnsList = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'training_course_id', label: 'Course ID' },
  { key: 'content', label: 'Content' },
  { key: 'media_url', label: 'Media' },
  { key: 'created_at', label: 'Created' },
  { key: 'actions', label: 'Actions' },
];

// Module Form Component
const ModuleForm = ({
  showModal,
  setShowModal,
  onModuleSaved,
  moduleToEdit,
  isEditMode
}) => {
  const [formData, setFormData] = useState({
    training_course_id: '',
    title: '',
    content: '',
    media_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (showModal) {
      if (isEditMode && moduleToEdit) {
        setFormData({
          training_course_id: moduleToEdit.training_course_id || '',
          title: moduleToEdit.title || '',
          content: moduleToEdit.content || '',
          media_url: moduleToEdit.media_url || ''
        });
      } else {
        setFormData({
          training_course_id: '',
          title: '',
          content: '',
          media_url: ''
        });
      }
      setErrors({});
    }
  }, [showModal, isEditMode, moduleToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.training_course_id.trim()) newErrors.training_course_id = 'Training Course ID is required';
    if (!formData.title.trim()) newErrors.title = 'Module title is required';
    if (formData.title.length > 100) newErrors.title = 'Title must not exceed 100 characters';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.media_url && !isValidUrl(formData.media_url)) {
      newErrors.media_url = 'Please enter a valid URL';
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
        ? `http://localhost:3000/api/v1/course-modules/${moduleToEdit.id}`
        : 'http://localhost:3000/api/v1/course-modules';
      
      const method = isEditMode ? 'PUT' : 'POST';
      const payload = {
        ...formData,
        created_at: isEditMode ? moduleToEdit.created_at : new Date().toISOString()
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
        throw new Error(errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} module`);
      }

      onModuleSaved();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving module:', error);
      alert(error.message || `Failed to ${isEditMode ? 'update' : 'create'} module`);
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
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Edit Module' : 'Create New Module'}
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
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                } focus:outline-none focus:ring-2`}
                placeholder="Enter training course ID"
              />
              {errors.training_course_id && (
                <p className="mt-1 text-sm text-red-600">{errors.training_course_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Module Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                maxLength={100}
                className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                  errors.title 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                } focus:outline-none focus:ring-2`}
                placeholder="Enter module title"
              />
              <div className="flex justify-between mt-1">
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
                <p className="text-sm text-gray-500">{formData.title.length}/100</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={6}
              className={`w-full px-4 py-3 rounded-xl border transition-colors resize-none ${
                errors.content 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter module content..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media URL (Optional)
            </label>
            <input
              type="url"
              name="media_url"
              value={formData.media_url}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                errors.media_url 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
              } focus:outline-none focus:ring-2`}
              placeholder="https://example.com/media.mp4"
            />
            {errors.media_url && (
              <p className="mt-1 text-sm text-red-600">{errors.media_url}</p>
            )}
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
              className="flex-1 px-6 py-3 text-white bg-green-500 rounded-xl hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Module' : 'Create Module'
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
  moduleToDelete,
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
            <h3 className="text-xl font-semibold text-gray-900">Delete Module</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete the module{' '}
            <span className="font-semibold text-gray-900">
              "{moduleToDelete?.title || ''}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">Cancel</button>
          <button onClick={() => onConfirm(moduleToDelete?.id)} className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium">Delete Module</button>
        </div>
      </div>
    </div>
  );
};

const ModernCourseModulesManagement = () => {
  const [modules, setModules] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true, title: true, training_course_id: true, content: true, media_url: true, created_at: true, actions: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, moduleToDelete: null });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [moduleToEdit, setModuleToEdit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [courseMap, setCourseMap] = useState({});

  const [courses, setCourses] = useState([]);

  // Show create modal
  const handleShowCreate = () => {
    console.log('Creating new module - clearing edit states');
    setModuleToEdit(null);
    setIsEditMode(false);
    setShowCreateModal(true);
  };

  // Show edit modal
  const handleShowEdit = (module) => {
    console.log('Editing module:', module);
    setModuleToEdit(module);
    setIsEditMode(true);
    setShowCreateModal(true);
  };
  // Close module form
  const handleCloseModuleForm = () => {
    console.log('Closing module form - clearing all states');
    setShowCreateModal(false);
    setModuleToEdit(null);
    setIsEditMode(false);
  };

  // After create/update, refresh modules
  const handleModuleSaved = () => {
    console.log('Module saved - refreshing and clearing states');
    fetchModules();
    setShowCreateModal(false);
    setModuleToEdit(null);
    setIsEditMode(false);
  };
  // Fetch modules from API
  const fetchModules = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/api/v1/course-modules', {
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('Failed to fetch modules');
      const data = await res.json();
      setModules(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchModules(); }, []);

  // Delete module
  const handleDelete = async (moduleId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:3000/api/v1/course-modules/${moduleId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('Failed to delete module');
      setModules(modules.filter(m => m.id !== moduleId));
    } catch (err) {
      alert(err.message || 'Failed to delete module');
    }
  };

  const fetchCourses = async () => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    const res = await fetch('http://localhost:3000/api/v1/training-courses', {
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
    });
    if (!res.ok) throw new Error('Failed to fetch courses');
    const data = await res.json();
    const coursesArray = Array.isArray(data) ? data : [];
    setCourses(coursesArray);
    
    // Create a map for quick lookups - THIS IS THE KEY PART
    const map = {};
    coursesArray.forEach(course => {
      map[course.id] = course.title;  // Assuming your course object has 'id' and 'title'
    });
    setCourseMap(map);
  } catch (err) {
    console.error('Error fetching courses:', err);
  }
};

// Update your useEffect to fetch both courses and modules
useEffect(() => { 
  fetchCourses().then(() => fetchModules()); 
}, []);

const getCourseName = (courseId) => {
  return courseMap[courseId] || 'Unknown Course';
};


  // Delete modal handlers
  const handleDeleteClick = (module) => setDeleteModal({ isOpen: true, moduleToDelete: module });
  const handleDeleteConfirm = (moduleId) => {
    handleDelete(moduleId);
    setDeleteModal({ isOpen: false, moduleToDelete: null });
  };
  const handleDeleteCancel = () => setDeleteModal({ isOpen: false, moduleToDelete: null });

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

  // Filtered and paginated modules
  const filteredModules = modules.filter(module => {
    const search = searchTerm.toLowerCase();
    return (
      (module.title && module.title.toLowerCase().includes(search)) ||
      (module.training_course_id && module.training_course_id.toLowerCase().includes(search)) ||
      (module.content && module.content.toLowerCase().includes(search))
    );
  });
  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);
  const actualStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedModules = filteredModules.slice(actualStartIndex, actualStartIndex + itemsPerPage);

  // Mobile card view for small screens
  const MobileCard = ({ module, index }) => {
    const isExpanded = expandedCard === module?.id;
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-base">
                {truncateText(module?.title, 30)}
              </h3>
              <p className="text-gray-500 text-sm">
                ID: {actualStartIndex + index + 1}
              </p>
            </div>
          </div>
          <button onClick={() => setExpandedCard(isExpanded ? null : module?.id)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {visibleColumns.training_course_id && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Hash className="w-4 h-4 text-blue-600" />
              </div>
              {/* <span className="text-gray-700 text-sm">{module?.training_course_id || 'N/A'}</span> */}
              <span className="text-gray-700 text-sm">{getCourseName(module?.training_course_id)}</span>
            </div>
          )}
          {visibleColumns.content && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-700 text-sm">{truncateText(module?.content, 60)}</span>
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {visibleColumns.media_url && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  {module?.media_url ? <Play className="w-4 h-4 text-orange-600" /> : <HelpCircle className="w-4 h-4 text-gray-400" />}
                </div>
                {module?.media_url ? (
                  <a href={module.media_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">
                    View Media
                  </a>
                ) : (
                  <span className="text-gray-500 text-sm">No media</span>
                )}
              </div>
            )}
            {visibleColumns.created_at && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 text-sm">{formatDate(module?.created_at)}</span>
              </div>
            )}
            {visibleColumns.actions && (
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => handleShowEdit(module)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(module)}
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
        {actualStartIndex + 1} - {Math.min(actualStartIndex + itemsPerPage, filteredModules?.length || 0)} of {filteredModules?.length || 0} rows visible
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
                  ? 'bg-green-500 text-white border-green-500 shadow-lg'
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
                  ? 'bg-green-500 text-white border-green-500 shadow-lg'
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading modules...</span>
      </div>
    );
  }

  // Show "No modules found" when there are actually no modules
  if (!modules || modules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleShowCreate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Module
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 bg-white shadow-sm"
                />
              </div>
              <button onClick={fetchModules} className="p-2.5 text-gray-600 hover:text-gray-800 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 shadow-sm">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2.5 text-gray-600 hover:text-gray-800 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 shadow-sm">
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No modules found</p>
              <p className="text-gray-500">Try adjusting your search criteria or add some modules.</p>
            </div>
            <PaginationControls />
          </div>
        </div>
        
        <ModuleForm
          showModal={showCreateModal}
          setShowModal={handleCloseModuleForm}
          onModuleSaved={handleModuleSaved}
          moduleToEdit={moduleToEdit}
          isEditMode={isEditMode}
        />
        
        <DeleteConfirmation
          isOpen={deleteModal.isOpen}
          moduleToDelete={deleteModal.moduleToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
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
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Module</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
                />
              </div>
              <button onClick={fetchModules} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-sm transition-colors" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-sm transition-colors" title={viewMode === 'table' ? 'Card View' : 'Table View'}>
                <List className="w-4 h-4" />
              </button>
              <div className="relative column-toggle-container">
                <button onClick={() => setShowColumnToggle(!showColumnToggle)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-sm transition-colors" title="Column Visibility">
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
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
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
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Module</span>
                <span className="sm:hidden">Create</span>
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg">
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            {isMobileMenuOpen && (
              <div className="mt-3 mobile-menu-container bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button onClick={fetchModules} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                  <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    <List className="w-4 h-4" />
                    <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
                  </button>
                  <button onClick={() => setShowColumnToggle(!showColumnToggle)} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    <Grid3X3 className="w-4 h-4" />
                    <span>Columns</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {columnsList.map((col) => (
                      visibleColumns[col.key] && (
                        <th key={col.key} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {col.label}
                        </th>
                      )
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedModules.map((module, index) => (
                    <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                      {visibleColumns.id && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {actualStartIndex + index + 1}
                        </td>
                      )}
                      {visibleColumns.title && (
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {truncateText(module.title, 30)}
                        </td>
                      )}
                      {visibleColumns.training_course_id && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {module.training_course_id || 'N/A'}
                        </td>
                      )}

                      {visibleColumns.content && (
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {truncateText(module.content, 50)}
                        </td>
                      )}
                      {visibleColumns.media_url && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {module.media_url ? (
                            <a 
                              href={module.media_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <Link className="w-4 h-4" />
                              Media
                            </a>
                          ) : (
                            <span className="text-gray-500">No media</span>
                          )}
                        </td>
                      )}
                      {visibleColumns.created_at && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatDate(module.created_at)}
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleShowEdit(module)}
                              className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(module)}
                              className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
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
          ) : (
            <div className="p-6">
              {paginatedModules.map((module, index) => (
                <MobileCard key={module.id} module={module} index={index} />
              ))}
            </div>
          )}
          
          {filteredModules.length === 0 && searchTerm && (
            <div className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No results found</p>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          )}

          <PaginationControls />
        </div>
      </div>

      {/* Modals */}
      <ModuleForm
        showModal={showCreateModal}
        setShowModal={handleCloseModuleForm}
        onModuleSaved={handleModuleSaved}
        moduleToEdit={moduleToEdit}
        isEditMode={isEditMode}
      />
      
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        moduleToDelete={deleteModal.moduleToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>



  );
};

export default ModernCourseModulesManagement;
