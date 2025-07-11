import React, { useState } from 'react';
import { X, MessageSquare, Tag, User, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const ForumForm = ({ 
  showModal = true, 
  setShowModal = () => {}, 
  onForumCreated = () => {}
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    user_id: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'mentorship', label: 'Mentorship' },
    { value: 'career', label: 'Career' },
    { value: 'technical', label: 'Technical' },
    { value: 'events', label: 'Events' }
  ];

  // Validation function based on your Joi schema
  const validateForm = () => {
    const errors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Forum title is required';
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Forum title must not exceed 100 characters';
    }
    
    // Content validation
    if (!formData.content.trim()) {
      errors.content = 'Forum content is required';
    } else if (formData.content.trim().length > 500) {
      errors.content = 'Forum content must not exceed 500 characters';
    }
    
    // Category validation
    if (!formData.category) {
      errors.category = 'Category is required';
    } else if (!categoryOptions.some(cat => cat.value === formData.category)) {
      errors.category = 'Category must be one of: general, mentorship, career, technical, events';
    }
    
    // User ID validation
    if (!formData.user_id.trim()) {
      errors.user_id = 'User ID is required';
    }
    
    return errors;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
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
      setSubmitMessage('Please fix the errors above');
      return;
    }
    
    setIsSubmitting(true);
    setValidationErrors({});
    setSubmitStatus(null);
    setSubmitMessage('');
    
    try {
      // Prepare the data for submission
      const submitData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        category: formData.category,
        user_id: formData.user_id.trim()
      };

      const token = localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || 
                   localStorage.getItem('accessToken') ||
                   localStorage.getItem('jwt');
      
      console.log('Creating forum post with data:', submitData);
      
      const response = await fetch('http://localhost:3000/api/v1/forums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(submitData)
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
          // Handle validation errors from your backend
          if (responseData.field) {
            setValidationErrors({ [responseData.field]: responseData.error });
            throw new Error(responseData.error || 'Invalid data provided');
          }
          throw new Error(responseData.message || responseData.error || 'Invalid data provided');
        } else if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to create forum posts');
        } else if (response.status === 404) {
          throw new Error(responseData.message || 'User not found');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(responseData.message || responseData.error || `Request failed with status ${response.status}`);
        }
      }

      setSubmitStatus('success');
      setSubmitMessage(responseData.message || 'Forum post created successfully!');
      
      // Call the callback to refresh the forum list
      if (onForumCreated) {
        onForumCreated(responseData);
      }
      
      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1500);

    } catch (err) {
      console.error('Create forum post error:', err);
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
    setFormData({
      title: '',
      content: '',
      category: 'general',
      user_id: ''
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-green-500" />
            <span className="hidden sm:inline">Create New Forum Post</span>
            <span className="sm:hidden">New Forum Post</span>
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
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Forum Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                validationErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter forum title (max 100 characters)"
              maxLength={100}
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
                {formData.title.length}/100
              </p>
            </div>
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                validationErrors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              {categoryOptions.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {validationErrors.category && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.category}
              </p>
            )}
          </div>

          {/* User ID Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              User ID *
            </label>
            <input
              type="text"
              value={formData.user_id}
              onChange={(e) => handleInputChange('user_id', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                validationErrors.user_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter user ID"
              disabled={isSubmitting}
            />
            {validationErrors.user_id && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.user_id}
              </p>
            )}
          </div>

          {/* Content Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Forum Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-vertical ${
                validationErrors.content ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter forum content (max 500 characters)"
              rows={6}
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              {validationErrors.content && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.content}
                </p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.content.length}/500
              </p>
            </div>
          </div>

          {/* Form Guidelines */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-2">Forum Post Guidelines:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Title must be descriptive and under 100 characters</li>
              <li>• Content should be detailed but not exceed 500 characters</li>
              <li>• Select the most appropriate category for your post</li>
              <li>• Make sure to provide a valid user ID</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm sm:text-base bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Forum Post
                </>
              )}
            </button>
            
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm sm:text-base bg-white hover:bg-gray-50 disabled:bg-gray-100 text-black border border-gray-300 rounded-lg transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumForm;