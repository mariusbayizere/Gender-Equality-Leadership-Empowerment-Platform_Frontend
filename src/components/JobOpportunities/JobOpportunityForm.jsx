import React, { useState, useEffect } from 'react';
import { X, Briefcase, Building, MapPin, Calendar, Users, CheckCircle, AlertCircle, Plus, Edit, FileText, Clock } from 'lucide-react';

const JobOpportunityForm = ({ 
  showModal = true, 
  setShowModal = () => {}, 
  onJobSaved = () => {},
  jobToEdit = null, // null for create, job object for update
  isEditMode = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    is_active: true,
    posted_date: '',
    job_type: 'internship',
    application_deadline: '',
    user_ids: []
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const jobTypes = ['leadership', 'internship', 'fellowship'];

const formatDateForInput = (dateString) => {
  // Handle all possible input types
  if (!dateString) {
    return '';
  }
  
  // Convert to string if it's not already
  const dateStr = typeof dateString === 'string' ? dateString.trim() : String(dateString);
  
  if (!dateStr || dateStr === 'null' || dateStr === 'undefined') {
    return '';
  }
  
  try {
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string provided:', dateStr);
      return '';
    }
    
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.warn('Error formatting date:', dateStr, error);
    return '';
  }
};

useEffect(() => {
  if (isEditMode && jobToEdit) {
    // Remove the local formatDateForInput function entirely
    // Use the safe one defined earlier in the component
    
    setFormData({
      title: jobToEdit.title || '',
      company: jobToEdit.company || '',
      description: jobToEdit.description || '',
      location: jobToEdit.location || '',
      is_active: jobToEdit.is_active !== undefined ? jobToEdit.is_active : true,
      posted_date: formatDateForInput(jobToEdit.posted_date), // Uses the safe function
      job_type: jobToEdit.job_type || 'internship',
      application_deadline: formatDateForInput(jobToEdit.application_deadline), // Uses the safe function
      user_ids: jobToEdit.user_ids || []
    });
  }
}, [isEditMode, jobToEdit]);


  // Validation function based on your Joi schema
  const validateForm = () => {
    const errors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    } else if (formData.title.trim().length > 45) {
      errors.title = 'Job title must not exceed 45 characters';
    }
    
    // Company validation
    if (!formData.company.trim()) {
      errors.company = 'Company name is required';
    } else if (formData.company.trim().length > 45) {
      errors.company = 'Company name must not exceed 45 characters';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length > 200) {
      errors.description = 'Description must not exceed 200 characters';
    }

    // Location validation
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.trim().length > 45) {
      errors.location = 'Location must not exceed 45 characters';
    }

    // Posted date validation
    if (!formData.posted_date) {
      errors.posted_date = 'Posted date is required';
    }

    // Job type validation
    if (!formData.job_type) {
      errors.job_type = 'Job type is required';
    } else if (!jobTypes.includes(formData.job_type)) {
      errors.job_type = 'Job type must be one of: leadership, internship, fellowship';
    }

    // Application deadline validation
    if (!formData.application_deadline) {
      errors.application_deadline = 'Application deadline is required';
    } else if (formData.posted_date && formData.application_deadline) {
      const postedDate = new Date(formData.posted_date);
      const deadlineDate = new Date(formData.application_deadline);
      if (deadlineDate <= postedDate) {
        errors.application_deadline = 'Application deadline must be after posted date';
      }
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

  // Handle user IDs input (comma-separated)
  const handleUserIdsChange = (value) => {
    const userIds = value.split(',').map(id => id.trim()).filter(id => id);
    handleInputChange('user_ids', userIds);
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
        company: formData.company.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        is_active: formData.is_active,
        posted_date: new Date(formData.posted_date).toISOString(),
        job_type: formData.job_type,
        application_deadline: new Date(formData.application_deadline).toISOString(),
        user_ids: formData.user_ids
      };

      const token = localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || 
                   localStorage.getItem('accessToken') ||
                   localStorage.getItem('jwt');
      
      console.log(`${isEditMode ? 'Updating' : 'Creating'} job opportunity:`, submitData);
      
      // Determine API endpoint and method
      const url = isEditMode 
        ? `http://localhost:3000/api/v1/job-opportunities/${jobToEdit.id}`
        : 'http://localhost:3000/api/v1/job-opportunities';
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
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
          throw new Error(responseData.message || responseData.error || 'Invalid data provided');
        } else if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to perform this action');
        } else if (response.status === 404) {
          throw new Error('Job opportunity not found');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(responseData.message || responseData.error || `Request failed with status ${response.status}`);
        }
      }

      setSubmitStatus('success');
      setSubmitMessage(isEditMode ? 'Job opportunity has been updated successfully!' : 'Job opportunity has been created successfully!');
      
      // Call the callback to refresh the job opportunities list
      if (onJobSaved) {
        onJobSaved(responseData);
      }
      
      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1500);

    } catch (err) {
      console.error(`${isEditMode ? 'Update' : 'Create'} job opportunity error:`, err);
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
      company: '',
      description: '',
      location: '',
      is_active: true,
      posted_date: '',
      job_type: 'internship',
      application_deadline: '',
      user_ids: []
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
            {isEditMode ? (
              <Edit className="w-5 h-5 mr-2 text-blue-500" />
            ) : (
              <Plus className="w-5 h-5 mr-2 text-green-500" />
            )}
            <span className="hidden sm:inline">
              {isEditMode ? 'Edit Job Opportunity' : 'Create New Job Opportunity'}
            </span>
            <span className="sm:hidden">
              {isEditMode ? 'Edit Job' : 'New Job'}
            </span>
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

          {/* Title and Company Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter job title"
                disabled={isSubmitting}
                maxLength={45}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.title.length}/45 characters
              </div>
              {validationErrors.title && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Company *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.company ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter company name"
                disabled={isSubmitting}
                maxLength={45}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.company.length}/45 characters
              </div>
              {validationErrors.company && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.company}
                </p>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                validationErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter job description"
              disabled={isSubmitting}
              maxLength={200}
              rows={4}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.description.length}/200 characters
            </div>
            {validationErrors.description && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.description}
              </p>
            )}
          </div>

          {/* Location and Job Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter location"
                disabled={isSubmitting}
                maxLength={45}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.location.length}/45 characters
              </div>
              {validationErrors.location && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Job Type *
              </label>
              <select
                value={formData.job_type}
                onChange={(e) => handleInputChange('job_type', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.job_type ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {validationErrors.job_type && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.job_type}
                </p>
              )}
            </div>
          </div>

          {/* Date Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Posted Date *
              </label>
              <input
                type="date"
                value={formData.posted_date}
                onChange={(e) => handleInputChange('posted_date', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.posted_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.posted_date && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.posted_date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Application Deadline *
              </label>
              <input
                type="date"
                value={formData.application_deadline}
                onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.application_deadline ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.application_deadline && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.application_deadline}
                </p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active Job Opportunity
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Job Opportunity
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Job Opportunity
                    </>
                  )}
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

export default JobOpportunityForm;