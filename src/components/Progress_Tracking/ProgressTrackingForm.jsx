import React, { useState, useEffect } from 'react';
import { X, TrendingUp, User, BookOpen, Calendar, Target, MessageCircle, BarChart3, Clock, CheckCircle, AlertCircle, Plus, Edit3 } from 'lucide-react';

const ProgressTrackingForm = ({ 
  showModal = true, 
  setShowModal = () => {}, 
  onProgressCreated = () => {},
  onProgressUpdated = () => {},
  editingProgress = null,
  mode = 'create' // 'create' or 'update'
}) => {
  const [form, setForm] = useState({
    feedback: editingProgress?.feedback || '',
    status: editingProgress?.status || '',
    progress_percentage: editingProgress?.progress_percentage || 0,
    completion_date: editingProgress?.completion_date || new Date().toISOString().split('T')[0],
    user_id: editingProgress?.user_id || '',
    training_course_id: editingProgress?.training_course_id || '',
    session_count: editingProgress?.session_count || 1,
    goals: editingProgress?.goals || ['']
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const statusOptions = [
    { value: '', label: 'Select Status', disabled: true },
    { value: 'not_started', label: 'Not Started', icon: '⏳' },
    { value: 'in_progress', label: 'In Progress', icon: '🔄' },
    { value: 'completed', label: 'Completed', icon: '✅' },
    { value: 'paused', label: 'Paused', icon: '⏸️' }
  ];

  // Fetch users and courses on mount
  useEffect(() => {
    if (showModal) {
      fetchUsers();
      fetchCourses();
    }
  }, [showModal]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = (
        localStorage.getItem('token') || 
        localStorage.getItem('authToken') || 
        localStorage.getItem('accessToken') ||
        localStorage.getItem('jwt')
      );

      const response = await fetch('http://localhost:3000/api/v1/users', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const token = (
        localStorage.getItem('token') || 
        localStorage.getItem('authToken') || 
        localStorage.getItem('accessToken') ||
        localStorage.getItem('jwt')
      );

      const response = await fetch('http://localhost:3000/api/v1/training_courses', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(Array.isArray(data) ? data : data.courses || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Enhanced validation function
  const validateForm = () => {
    const errors = {};
    
    // Feedback validation
    if (!form.feedback.trim()) {
      errors.feedback = 'Feedback is required';
    } else if (form.feedback.trim().length > 100) {
      errors.feedback = 'Feedback must not exceed 100 characters';
    }
    
    // Status validation
    if (!form.status.trim()) {
      errors.status = 'Status is required';
    }
    
    // Progress percentage validation
    if (form.progress_percentage < 0 || form.progress_percentage > 100) {
      errors.progress_percentage = 'Progress percentage must be between 0 and 100';
    }
    
    // Completion date validation
    if (!form.completion_date) {
      errors.completion_date = 'Completion date is required';
    }
    
    // User ID validation
    if (!form.user_id.trim()) {
      errors.user_id = 'User selection is required';
    }
    
    // Training course ID validation
    if (!form.training_course_id.trim()) {
      errors.training_course_id = 'Training course selection is required';
    }
    
    // Session count validation
    if (!form.session_count || form.session_count < 1) {
      errors.session_count = 'Session count must be at least 1';
    }
    
    // Goals validation
    if (!form.goals.length || form.goals.every(goal => !goal.trim())) {
      errors.goals = 'At least one goal is required';
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

  // Handle goals array changes
  const handleGoalChange = (index, value) => {
    const newGoals = [...form.goals];
    newGoals[index] = value;
    handleInputChange('goals', newGoals);
  };

  const addGoal = () => {
    handleInputChange('goals', [...form.goals, '']);
  };

  const removeGoal = (index) => {
    if (form.goals.length > 1) {
      const newGoals = form.goals.filter((_, i) => i !== index);
      handleInputChange('goals', newGoals);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmitStatus('error');
      setSubmitMessage('Please fill all required fields correctly.');
      return;
    }
    
    setIsSubmitting(true);
    setValidationErrors({});
    setSubmitStatus(null);
    setSubmitMessage('');
    
    try {
      // Prepare the data for submission
      const formData = {
        feedback: form.feedback.trim(),
        status: form.status,
        progress_percentage: Number(form.progress_percentage),
        completion_date: form.completion_date,
        user_id: form.user_id,
        training_course_id: form.training_course_id,
        session_count: Number(form.session_count),
        goals: form.goals.filter(goal => goal.trim())
      };

      // Get token from localStorage
      const token = (
        localStorage.getItem('token') || 
        localStorage.getItem('authToken') || 
        localStorage.getItem('accessToken') ||
        localStorage.getItem('jwt')
      );
      
      console.log(`${mode === 'create' ? 'Creating' : 'Updating'} progress tracking:`, formData);
      
      // API call
      const url = mode === 'create' 
        ? 'http://localhost:3000/api/v1/progress_tracking'
        : `http://localhost:3000/api/v1/progress_tracking/${editingProgress.id}`;
      
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
          throw new Error(responseData.error || 'Resource not found');
        } else if (response.status === 409) {
          throw new Error(responseData.error || 'Conflict occurred');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(responseData.error || `Request failed with status ${response.status}`);
        }
      }

      setSubmitStatus('success');
      setSubmitMessage(
        mode === 'create' 
          ? 'Progress tracking has been created successfully!' 
          : 'Progress tracking has been updated successfully!'
      );
      
      // Call the appropriate callback
      if (mode === 'create' && onProgressCreated) {
        onProgressCreated(responseData);
      } else if (mode === 'update' && onProgressUpdated) {
        onProgressUpdated(responseData);
      }
      
      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1500);

    } catch (err) {
      console.error(`${mode === 'create' ? 'Create' : 'Update'} progress tracking error:`, err);
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
      feedback: editingProgress?.feedback || '',
      status: editingProgress?.status || '',
      progress_percentage: editingProgress?.progress_percentage || 0,
      completion_date: editingProgress?.completion_date || new Date().toISOString().split('T')[0],
      user_id: editingProgress?.user_id || '',
      training_course_id: editingProgress?.training_course_id || '',
      session_count: editingProgress?.session_count || 1,
      goals: editingProgress?.goals || ['']
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
            {mode === 'create' ? (
              <>
                <Plus className="w-5 h-5 mr-2 text-blue-500" />
                <span className="hidden sm:inline">Create Progress Tracking</span>
                <span className="sm:hidden">New Progress</span>
              </>
            ) : (
              <>
                <Edit3 className="w-5 h-5 mr-2 text-green-500" />
                <span className="hidden sm:inline">Update Progress Tracking</span>
                <span className="sm:hidden">Edit Progress</span>
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

          {/* User and Course Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Select User *
              </label>
              <select
                value={form.user_id}
                onChange={(e) => handleInputChange('user_id', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.user_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting || loadingUsers}
              >
                <option value="">Select a user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email || user.username || `User ${user.id}`}
                  </option>
                ))}
              </select>
              {validationErrors.user_id && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.user_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Select Training Course *
              </label>
              <select
                value={form.training_course_id}
                onChange={(e) => handleInputChange('training_course_id', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.training_course_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting || loadingCourses}
              >
                <option value="">Select a training course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {validationErrors.training_course_id && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.training_course_id}
                </p>
              )}
            </div>
          </div>

          {/* Status and Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Status *
              </label>
              <select
                value={form.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.status ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.icon && `${option.icon} `}{option.label}
                  </option>
                ))}
              </select>
              {validationErrors.status && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.status}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <BarChart3 className="w-4 h-4 inline mr-1" />
                Progress Percentage *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.progress_percentage}
                  onChange={(e) => handleInputChange('progress_percentage', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    validationErrors.progress_percentage ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter progress percentage (0-100)"
                  disabled={isSubmitting}
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
              {validationErrors.progress_percentage && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.progress_percentage}
                </p>
              )}
            </div>
          </div>

          {/* Session Count and Completion Date */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Session Count *
              </label>
              <input
                type="number"
                min="1"
                value={form.session_count}
                onChange={(e) => handleInputChange('session_count', parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.session_count ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter number of sessions"
                disabled={isSubmitting}
              />
              {validationErrors.session_count && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.session_count}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Completion Date *
              </label>
              <input
                type="date"
                value={form.completion_date}
                onChange={(e) => handleInputChange('completion_date', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.completion_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.completion_date && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.completion_date}
                </p>
              )}
            </div>
          </div>

          {/* Feedback Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <MessageCircle className="w-4 h-4 inline mr-1" />
              Feedback *
            </label>
            <textarea
              value={form.feedback}
              onChange={(e) => handleInputChange('feedback', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                validationErrors.feedback ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter feedback (max 100 characters)"
              maxLength={100}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              {validationErrors.feedback && (
                <p className="text-red-500 text-xs flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.feedback}
                </p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {form.feedback.length}/100
              </p>
            </div>
          </div>

          {/* Goals Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Goals *
            </label>
            <div className="space-y-2">
              {form.goals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => handleGoalChange(index, e.target.value)}
                    className={`flex-1 px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      validationErrors.goals ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder={`Goal ${index + 1}`}
                    disabled={isSubmitting}
                  />
                  {form.goals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addGoal}
                className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 transition-colors text-sm"
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4" />
                <span>Add Goal</span>
              </button>
            </div>
            {validationErrors.goals && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.goals}
              </p>
            )}
          </div>

          {/* Progress Information */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-2">Progress Information:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• All fields marked with * are required</li>
              <li>• Feedback is limited to 100 characters</li>
              <li>• Progress percentage must be between 0 and 100</li>
              <li>• Session count must be at least 1</li>
              <li>• Add multiple goals to track various objectives</li>
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
                  <span>{mode === 'create' ? 'Create Progress' : 'Update Progress'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingForm;