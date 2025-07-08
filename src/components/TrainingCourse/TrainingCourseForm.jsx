import React, { useState } from 'react';
import { X, BookOpen, User, Clock, Monitor, CheckCircle, AlertCircle, Plus, Edit3 } from 'lucide-react';

const TrainingCourseForm = ({ 
  showModal = true, 
  setShowModal = () => {}, 
  onCourseCreated = () => {},
  onCourseUpdated = () => {},
  editingCourse = null,
  mode = 'create' // 'create' or 'update'
}) => {
  const [form, setForm] = useState({
    title: editingCourse?.title || '',
    description: editingCourse?.description || '',
    course_type: editingCourse?.course_type || 'online',
    instructor_name: editingCourse?.instructor_name || '',
    duration: editingCourse?.duration || '',
    is_active: editingCourse?.is_active !== undefined ? editingCourse.is_active : true,
    created_date: editingCourse?.created_date || new Date().toISOString().split('T')[0]
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const courseTypes = [
    { value: 'online', label: 'Online Course', icon: '💻' },
    { value: 'webinar', label: 'Webinar', icon: '🎥' },
    { value: 'certification', label: 'Certification', icon: '📜' }
  ];

  // Enhanced validation function
  const validateForm = () => {
    const errors = {};
    
    // Title validation
    if (!form.title.trim()) {
      errors.title = 'Title is required';
    } else if (form.title.trim().length > 45) {
      errors.title = 'Title must not exceed 45 characters';
    }
    
    // Description validation
    if (!form.description.trim()) {
      errors.description = 'Description is required';
    } else if (form.description.trim().length > 255) {
      errors.description = 'Description must not exceed 255 characters';
    }
    
    // Course type validation
    if (!form.course_type) {
      errors.course_type = 'Course type is required';
    } else if (!['online', 'webinar', 'certification'].includes(form.course_type)) {
      errors.course_type = 'Course type must be one of: online, webinar, certification';
    }
    
    // Instructor name validation
    if (!form.instructor_name.trim()) {
      errors.instructor_name = 'Instructor name is required';
    } else if (form.instructor_name.trim().length > 45) {
      errors.instructor_name = 'Instructor name must not exceed 45 characters';
    }
    
    // Duration validation
    if (!form.duration.trim()) {
      errors.duration = 'Duration is required';
    } else if (form.duration.trim().length > 45) {
      errors.duration = 'Duration must not exceed 45 characters';
    }
    
    // Created date validation (only for create mode)
    if (mode === 'create' && !form.created_date) {
      errors.created_date = 'Created date is required';
    }
    
    return errors;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitStatus('error');
      setSubmitMessage('Please Insert all required fields correctly.');
      return;
    }
    
    setIsSubmitting(true);
    setValidationErrors({});
    setSubmitStatus(null);
    setSubmitMessage('');
    
    try {
      // Prepare the data for submission
      const formData = {
        title: form.title.trim(),
        description: form.description.trim(),
        course_type: form.course_type,
        instructor_name: form.instructor_name.trim(),
        duration: form.duration.trim(),
        is_active: form.is_active,
        ...(mode === 'create' && { created_date: form.created_date })
      };

      // Get token from localStorage
      const token = (
        localStorage.getItem('token') || 
        localStorage.getItem('authToken') || 
        localStorage.getItem('accessToken') ||
        localStorage.getItem('jwt')
      );
      
      console.log(`${mode === 'create' ? 'Creating' : 'Updating'} training course:`, formData);
      
      // API call
      const url = mode === 'create' 
        ? 'http://localhost:3000/api/v1/training_courses'
        : `http://localhost:3000/api/v1/training_courses/${editingCourse.id}`;
      
      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData)
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        // Handle different types of errors
        if (response.status === 400) {
          throw new Error(responseData.error || 'Invalid data provided');
        } else if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to perform this action');
        } else if (response.status === 404) {
          throw new Error('Training course not found');
        } else if (response.status === 409) {
          throw new Error('A training course with this title already exists');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(responseData.error || `Request failed with status ${response.status}`);
        }
      }

      setSubmitStatus('success');
      setSubmitMessage(
        mode === 'create' 
          ? 'Training course has been created successfully!' 
          : 'Training course has been updated successfully!'
      );
      
      // Call the appropriate callback
      if (mode === 'create' && onCourseCreated) {
        onCourseCreated(responseData);
      } else if (mode === 'update' && onCourseUpdated) {
        onCourseUpdated(responseData);
      }
      
      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1500);

    } catch (err) {
      console.error(`${mode === 'create' ? 'Create' : 'Update'} training course error:`, err);
      setSubmitStatus('error');
      
      // Provide more user-friendly error messages
      if (err.message.includes('fetch')) {
        setSubmitMessage('Unable to connect to server. Please check your connection and try again.');
      } else if (err.message.includes('Authentication') || err.message.includes('log in')) {
        setSubmitMessage('Please log in again to continue.');
      } else {
        setSubmitMessage(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      title: editingCourse?.title || '',
      description: editingCourse?.description || '',
      course_type: editingCourse?.course_type || 'online',
      instructor_name: editingCourse?.instructor_name || '',
      duration: editingCourse?.duration || '',
      is_active: editingCourse?.is_active !== undefined ? editingCourse.is_active : true,
      created_date: editingCourse?.created_date || new Date().toISOString().split('T')[0]
    });
    setValidationErrors({});
    setSubmitStatus(null);
    setSubmitMessage('');
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
            {mode === 'create' ? (
              <>
                <Plus className="w-5 h-5 mr-2 text-blue-500" />
                <span className="hidden sm:inline">Create Training Course</span>
                <span className="sm:hidden">New Course</span>
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5 mr-2 text-green-500" />
                <span className="hidden sm:inline">Update Training Course</span>
                <span className="sm:hidden">Edit Course</span>
              </>
            )}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Status Message */}
          {submitMessage && (
            <div className={`p-3 sm:p-4 rounded-lg flex items-center space-x-2 animate-fade-in ${
              submitStatus === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {submitStatus === 'success' ? 
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> : 
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              }
              <span className="text-xs sm:text-sm font-medium">{submitMessage}</span>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Course Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                validationErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter course title (max 45 characters)"
              maxLength={45}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              {validationErrors.title && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.title}
                </p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {form.title.length}/45
              </p>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                validationErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter course description (max 255 characters)"
              maxLength={255}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              {validationErrors.description && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.description}
                </p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {form.description.length}/255
              </p>
            </div>
          </div>

          {/* Course Type and Instructor Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Monitor className="w-4 h-4 inline mr-1" />
                Course Type *
              </label>
              <select
                value={form.course_type}
                onChange={(e) => handleInputChange('course_type', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.course_type ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                {courseTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
              {validationErrors.course_type && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.course_type}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Instructor Name *
              </label>
              <input
                type="text"
                value={form.instructor_name}
                onChange={(e) => handleInputChange('instructor_name', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.instructor_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter instructor name (max 45 characters)"
                maxLength={45}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.instructor_name && (
                  <p className="text-red-500 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.instructor_name}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {form.instructor_name.length}/45
                </p>
              </div>
            </div>
          </div>

          {/* Duration and Status Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Duration *
              </label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.duration ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g., 2 hours, 3 days, 1 week"
                maxLength={45}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-1">
                {validationErrors.duration && (
                  <p className="text-red-500 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.duration}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {form.duration.length}/45
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4 py-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_active"
                    checked={form.is_active === true}
                    onChange={() => handleInputChange('is_active', true)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="is_active"
                    checked={form.is_active === false}
                    onChange={() => handleInputChange('is_active', false)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Created Date Field (only for create mode) */}
          {mode === 'create' && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Created Date *
              </label>
              <input
                type="date"
                value={form.created_date}
                onChange={(e) => handleInputChange('created_date', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.created_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.created_date && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.created_date}
                </p>
              )}
            </div>
          )}

          {/* Course Information */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-2">Course Information:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• All fields marked with * are required</li>
              <li>• Title and instructor name are limited to 45 characters</li>
              <li>• Description is limited to 255 characters</li>
              <li>• Duration can be any format (e.g., "2 hours", "3 days", "1 week")</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm sm:text-base bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 px-4 py-2 text-sm sm:text-base ${
                mode === 'create' 
                  ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400' 
                  : 'bg-green-500 hover:bg-green-600 disabled:bg-green-400'
              } text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2 order-1 sm:order-2`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{mode === 'create' ? 'Creating...' : 'Updating...'}</span>
                </>
              ) : (
                <>
                  {mode === 'create' ? <Plus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  <span>{mode === 'create' ? 'Create Course' : 'Update Course'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCourseForm;