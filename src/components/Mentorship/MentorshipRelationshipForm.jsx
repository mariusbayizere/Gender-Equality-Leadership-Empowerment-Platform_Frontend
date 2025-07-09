import React, { useState } from 'react';
import { X, Users, User, Calendar, CheckCircle, AlertCircle, Plus, Edit3, Clock } from 'lucide-react';

const MentorshipRelationshipForm = ({ 
  showModal = true, 
  setShowModal = () => {}, 
  onRelationshipCreated = () => {},
  onRelationshipUpdated = () => {},
  editingRelationship = null,
  mode = 'create' // 'create' or 'update'
}) => {
  const [form, setForm] = useState({
    status: editingRelationship?.status || '',
    start_date: editingRelationship?.start_date || '',
    end_date: editingRelationship?.end_date || '',
    matching_criteria: editingRelationship?.matching_criteria || '',
    mentor_id: editingRelationship?.mentor_id || '',
    mentee_id: editingRelationship?.mentee_id || '',
    program_status: editingRelationship?.program_status || 'active'
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const programStatusOptions = [
    { value: 'active', label: 'Active', icon: '🟢' },
    { value: 'completed', label: 'Completed', icon: '✅' },
    { value: 'paused', label: 'Paused', icon: '⏸️' }
  ];

  // Enhanced validation function
  const validateForm = () => {
    const errors = {};
    
    // Status validation
    if (!form.status.trim()) {
      errors.status = 'Status is required';
    }
    
    // Start date validation
    if (!form.start_date) {
      errors.start_date = 'Start date is required';
    }
    
    // End date validation (optional but if provided, must be valid)
    if (form.end_date && form.start_date) {
      const startDate = new Date(form.start_date);
      const endDate = new Date(form.end_date);
      if (endDate <= startDate) {
        errors.end_date = 'End date must be after start date';
      }
    }
    
    // Matching criteria validation
    if (!form.matching_criteria.trim()) {
      errors.matching_criteria = 'Matching criteria is required';
    }
    
    // Mentor ID validation
    if (!form.mentor_id.trim()) {
      errors.mentor_id = 'Mentor ID is required';
    }
    
    // Mentee ID validation
    if (!form.mentee_id.trim()) {
      errors.mentee_id = 'Mentee ID is required';
    }
    
    // Program status validation
    if (!form.program_status) {
      errors.program_status = 'Program status is required';
    } else if (!['active', 'completed', 'paused'].includes(form.program_status)) {
      errors.program_status = 'Program status must be either "active", "completed", or "paused"';
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
        status: form.status.trim(),
        start_date: form.start_date,
        matching_criteria: form.matching_criteria.trim(),
        mentor_id: form.mentor_id.trim(),
        mentee_id: form.mentee_id.trim(),
        program_status: form.program_status,
        ...(form.end_date && { end_date: form.end_date })
      };

      // Get token from localStorage
      const token = (
        localStorage.getItem('token') || 
        localStorage.getItem('authToken') || 
        localStorage.getItem('accessToken') ||
        localStorage.getItem('jwt')
      );
      
      console.log(`${mode === 'create' ? 'Creating' : 'Updating'} mentorship relationship:`, formData);
      
      // API call
      const url = mode === 'create' 
        ? 'http://localhost:3000/api/v1/mentorship'
        : `http://localhost:3000/api/v1/mentorship/${editingRelationship.id}`;
      
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
          throw new Error('Mentorship relationship not found');
        } else if (response.status === 409) {
          throw new Error('A mentorship relationship with this configuration already exists');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(responseData.error || `Request failed with status ${response.status}`);
        }
      }

      setSubmitStatus('success');
      setSubmitMessage(
        mode === 'create' 
          ? 'Mentorship relationship has been created successfully!' 
          : 'Mentorship relationship has been updated successfully!'
      );
      
      // Call the appropriate callback
      if (mode === 'create' && onRelationshipCreated) {
        onRelationshipCreated(responseData);
      } else if (mode === 'update' && onRelationshipUpdated) {
        onRelationshipUpdated(responseData);
      }
      
      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1500);

    } catch (err) {
      console.error(`${mode === 'create' ? 'Create' : 'Update'} mentorship relationship error:`, err);
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
      status: editingRelationship?.status || '',
      start_date: editingRelationship?.start_date || '',
      end_date: editingRelationship?.end_date || '',
      matching_criteria: editingRelationship?.matching_criteria || '',
      mentor_id: editingRelationship?.mentor_id || '',
      mentee_id: editingRelationship?.mentee_id || '',
      program_status: editingRelationship?.program_status || 'active'
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
                <span className="hidden sm:inline">Create Mentorship Relationship</span>
                <span className="sm:hidden">New Relationship</span>
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5 mr-2 text-green-500" />
                <span className="hidden sm:inline">Update Mentorship Relationship</span>
                <span className="sm:hidden">Edit Relationship</span>
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

          {/* Status and Program Status Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Status *
              </label>
              <input
                type="text"
                value={form.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.status ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter relationship status"
                disabled={isSubmitting}
              />
              {validationErrors.status && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.status}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Program Status *
              </label>
              <select
                value={form.program_status}
                onChange={(e) => handleInputChange('program_status', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.program_status ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                {programStatusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.icon} {status.label}
                  </option>
                ))}
              </select>
              {validationErrors.program_status && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.program_status}
                </p>
              )}
            </div>
          </div>

          {/* Start Date and End Date Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Start Date *
              </label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.start_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.start_date && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.start_date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                End Date (Optional)
              </label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.end_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.end_date && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.end_date}
                </p>
              )}
            </div>
          </div>

          {/* Mentor ID and Mentee ID Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Mentor ID *
              </label>
              <input
                type="text"
                value={form.mentor_id}
                onChange={(e) => handleInputChange('mentor_id', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.mentor_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter mentor ID"
                disabled={isSubmitting}
              />
              {validationErrors.mentor_id && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.mentor_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Mentee ID *
              </label>
              <input
                type="text"
                value={form.mentee_id}
                onChange={(e) => handleInputChange('mentee_id', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.mentee_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter mentee ID"
                disabled={isSubmitting}
              />
              {validationErrors.mentee_id && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.mentee_id}
                </p>
              )}
            </div>
          </div>

          {/* Matching Criteria Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Matching Criteria *
            </label>
            <textarea
              value={form.matching_criteria}
              onChange={(e) => handleInputChange('matching_criteria', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                validationErrors.matching_criteria ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter matching criteria for this mentorship relationship"
              disabled={isSubmitting}
            />
            {validationErrors.matching_criteria && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.matching_criteria}
              </p>
            )}
          </div>

          {/* Relationship Information */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-2">Relationship Information:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• All fields marked with * are required</li>
              <li>• End date is optional but must be after start date if provided</li>
              <li>• Program status can be: Active, Completed, or Paused</li>
              <li>• Mentor and Mentee IDs should be valid user identifiers</li>
              <li>• Matching criteria should describe why this pairing was made</li>
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
                  <span>{mode === 'create' ? 'Create Relationship' : 'Update Relationship'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipRelationshipForm;