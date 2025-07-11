import React, { useState, useEffect } from 'react';
import { X, Users, MessageSquare, UserPlus, CheckCircle, AlertCircle, Send, UserCheck, UserX } from 'lucide-react';

const ConnectionsForm = ({ 
  showModal = true, 
  setShowModal = () => {}, 
  onConnectionSaved = () => {},
  connectionToRespond = null, // null for create, connection object for respond
  isResponseMode = false,
  availableUsers = [] // List of users to send connection requests to
}) => {
  const [formData, setFormData] = useState({
    requester_id: '',
    recipient_id: '',
    message: '',
    status: 'pending'
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const CONNECTION_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    BLOCKED: 'blocked'
  };

  // Initialize form data when responding to a connection
  useEffect(() => {
    if (isResponseMode && connectionToRespond) {
      setFormData({
        requester_id: connectionToRespond.requester_id || '',
        recipient_id: connectionToRespond.recipient_id || '',
        message: connectionToRespond.message || '',
        status: connectionToRespond.status || 'pending'
      });
    }
  }, [isResponseMode, connectionToRespond]);

  // Validation function
  const validateForm = () => {
    const errors = {};
    
    if (!isResponseMode) {
      // Requester ID validation (for new requests)
      if (!formData.requester_id.trim()) {
        errors.requester_id = 'Requester ID is required';
      }
      
      // Recipient ID validation
      if (!formData.recipient_id.trim()) {
        errors.recipient_id = 'Recipient is required';
      } else if (formData.requester_id === formData.recipient_id) {
        errors.recipient_id = 'Cannot connect to yourself';
      }
    } else {
      // Status validation for responses
      if (!formData.status) {
        errors.status = 'Status is required';
      } else if (!Object.values(CONNECTION_STATUS).includes(formData.status)) {
        errors.status = 'Status must be one of: pending, accepted, rejected, blocked';
      }
    }
    
    // Message validation (optional)
    if (formData.message && formData.message.length > 200) {
      errors.message = 'Message must not exceed 200 characters';
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
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || 
                   localStorage.getItem('accessToken') ||
                   localStorage.getItem('jwt');
      
      let url, method, submitData;
      
      if (isResponseMode) {
        // Responding to a connection request
        url = `http://localhost:3000/api/v1/connections/${connectionToRespond.id}/respond`;
        method = 'PUT';
        submitData = {
          status: formData.status,
          message: formData.message || null
        };
      } else {
        // Creating a new connection request
        url = 'http://localhost:3000/api/v1/connections';
        method = 'POST';
        submitData = {
          requester_id: formData.requester_id.trim(),
          recipient_id: formData.recipient_id.trim(),
          message: formData.message.trim() || null
        };
      }
      
      console.log(`${isResponseMode ? 'Responding to' : 'Creating'} connection:`, submitData);
      
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
          throw new Error(responseData.error || responseData.message || 'Invalid data provided');
        } else if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } 
        else if (response.status === 403) {
          throw new Error('You do not have permission to perform this action');
        } 
        else if (response.status === 404) {
          throw new Error(responseData.error || 'Connection request not found');
        } else if (response.status === 409) {
          throw new Error(responseData.error || 'Connection already exists');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(responseData.error || responseData.message || `Request failed with status ${response.status}`);
        }
      }

      setSubmitStatus('success');
      setSubmitMessage(responseData.message || 
        (isResponseMode ? 'Connection response sent successfully!' : 'Connection request sent successfully!'));
      
      // Call the callback to refresh the connections list
      if (onConnectionSaved) {
        onConnectionSaved(responseData);
      }
      
      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1500);

    } catch (err) {
      console.error(`${isResponseMode ? 'Response' : 'Create'} connection error:`, err);
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
      requester_id: '',
      recipient_id: '',
      message: '',
      status: 'pending'
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
            {isResponseMode ? (
              <UserCheck className="w-5 h-5 mr-2 text-blue-500" />
            ) : (
              <UserPlus className="w-5 h-5 mr-2 text-green-500" />
            )}
            <span className="hidden sm:inline">
              {isResponseMode ? 'Respond to Connection' : 'Send Connection Request'}
            </span>
            <span className="sm:hidden">
              {isResponseMode ? 'Respond' : 'Connect'}
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

          {/* Connection Info (for response mode) */}
          {isResponseMode && connectionToRespond && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Connection Request Details</h4>
              <p className="text-sm text-blue-700">
                <span className="font-medium">From:</span> {connectionToRespond.requester_name || connectionToRespond.requester_id}
              </p>
              <p className="text-sm text-blue-700">
                <span className="font-medium">To:</span> {connectionToRespond.recipient_name || connectionToRespond.recipient_id}
              </p>
              {connectionToRespond.message && (
                <p className="text-sm text-blue-700 mt-1">
                  <span className="font-medium">Message:</span> {connectionToRespond.message}
                </p>
              )}
            </div>
          )}

          {/* User Selection (for new requests) */}
          {!isResponseMode && (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Your ID (Requester) *
                </label>
                <input
                  type="text"
                  value={formData.requester_id}
                  onChange={(e) => handleInputChange('requester_id', e.target.value)}
                  className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    validationErrors.requester_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your user ID"
                  disabled={isSubmitting}
                />
                {validationErrors.requester_id && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.requester_id}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Connect with (Recipient) *
                </label>
                {availableUsers.length > 0 ? (
                  <select
                    value={formData.recipient_id}
                    onChange={(e) => handleInputChange('recipient_id', e.target.value)}
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      validationErrors.recipient_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a user to connect with</option>
                    {availableUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.firstName} {user.lastName} ({user.email})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.recipient_id}
                    onChange={(e) => handleInputChange('recipient_id', e.target.value)}
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                      validationErrors.recipient_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter recipient user ID"
                    disabled={isSubmitting}
                  />
                )}
                {validationErrors.recipient_id && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {validationErrors.recipient_id}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Status Selection (for response mode) */}
          {isResponseMode && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <UserCheck className="w-4 h-4 inline mr-1" />
                Your Response *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('status', 'accepted')}
                  className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center space-x-2 ${
                    formData.status === 'accepted' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-300 hover:border-green-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <UserCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Accept</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('status', 'rejected')}
                  className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center space-x-2 ${
                    formData.status === 'rejected' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <UserX className="w-4 h-4" />
                  <span className="text-sm font-medium">Reject</span>
                </button>
              </div>
              {validationErrors.status && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.status}
                </p>
              )}
            </div>
          )}

          {/* Message Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Message (Optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={3}
              maxLength={200}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-none ${
                validationErrors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder={isResponseMode ? "Add a response message..." : "Add a personal message with your connection request..."}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              {validationErrors.message && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.message}
                </p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.message.length}/200 characters
              </p>
            </div>
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
                  {isResponseMode ? 'Responding...' : 'Sending...'}
                </>
              ) : (
                <>
                  {isResponseMode ? (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Send Response
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Request
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

export default ConnectionsForm;
