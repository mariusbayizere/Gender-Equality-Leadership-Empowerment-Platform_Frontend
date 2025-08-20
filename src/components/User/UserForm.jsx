

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Shield, Lock, Eye, EyeOff, CheckCircle, AlertCircle, UserPlus, Edit, Briefcase } from 'lucide-react';
import { fieldOptions } from './fieldOptions'; // Import your field options
// Import your countries constant
import { countries } from '../constant/countries';

const UserForm = ({ 
  showModal = true, 
  setShowModal = () => {}, 
  onUserSaved = () => {},
  userToEdit = null, // null for create, user object for update
  isEditMode = false
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userRole: 'mentee',
    gender: 'prefer_not_to_say',
    field: '', // Added field
    telephone: '',
    countryCode: '+250' // Rwanda default
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const allowedRoles = ['mentor', 'mentee', 'admin'];
  const genderOptions = ['male', 'female', 'other', 'prefer_not_to_say'];
  

  // Initialize form data when editing
  useEffect(() => {
    if (isEditMode && userToEdit) {
      const phoneNumber = userToEdit.telephone || '';
      const countryCode = countries.find(c => phoneNumber.startsWith(c.dial_code))?.dial_code || '+250';
      const cleanPhone = phoneNumber.replace(countryCode, '');
      
      setFormData({
        firstName: userToEdit.firstName || '',
        lastName: userToEdit.lastName || '',
        email: userToEdit.email || '',
        password: '',
        confirmPassword: '',
        userRole: userToEdit.userRole || 'mentee',
        gender: userToEdit.gender || 'prefer_not_to_say',
        field: userToEdit.field || '', // Added field
        telephone: cleanPhone,
        countryCode: countryCode
      });
    }
  }, [isEditMode, userToEdit]);

  // Validation function based on your Joi schema
  const validateForm = () => {
    const errors = {};
    
    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 3) {
      errors.firstName = 'First name must be at least 3 characters';
    } else if (formData.firstName.trim().length > 20) {
      errors.firstName = 'First name must not exceed 20 characters';
    }
    
    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 3) {
      errors.lastName = 'Last name must be at least 3 characters';
    } else if (formData.lastName.trim().length > 20) {
      errors.lastName = 'Last name must not exceed 20 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length < 5) {
      errors.email = 'Email must be at least 5 characters';
    } else if (formData.email.trim().length > 40) {
      errors.email = 'Email must not exceed 40 characters';
    }

    // Password validation (only for create mode or when password is provided in edit mode)
    if (!isEditMode || formData.password) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      } else if (formData.password.length > 26) {
        errors.password = 'Password must not exceed 26 characters';
      } else if (!/(?=.*[a-z])/.test(formData.password)) {
        errors.password = 'Password must contain at least one lowercase letter';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        errors.password = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        errors.password = 'Password must contain at least one number';
      } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
        errors.password = 'Password must contain at least one special character (@$!%*?&)';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Confirm password is required';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    // Role validation
    if (!formData.userRole) {
      errors.userRole = 'User role is required';
    } else if (!allowedRoles.includes(formData.userRole)) {
      errors.userRole = 'User role must be one of: mentor, mentee, admin';
    }

    // Gender validation
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    } else if (!genderOptions.includes(formData.gender)) {
      errors.gender = 'Gender must be one of: male, female, other, prefer_not_to_say';
    }

    // Field validation
    if (!formData.field) {
      errors.field = 'Field of interest is required';
    } else if (!fieldOptions.find(f => f.value === formData.field)) {
      errors.field = 'Please select a valid field';
    }
    
    // Telephone validation
    const fullPhone = formData.countryCode + formData.telephone;
    if (!formData.telephone.trim()) {
      errors.telephone = 'Telephone is required';
    } else if (fullPhone.length < 12) {
      errors.telephone = 'Telephone must be at least 12 digits';
    } else if (fullPhone.length > 16) {
      errors.telephone = 'Telephone must not exceed 16 digits';
    } else if (!/^\d+$/.test(formData.telephone.replace(/[\s-]/g, ''))) {
      errors.telephone = 'Telephone can only contain digits, spaces, and hyphens';
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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        userRole: formData.userRole,
        gender: formData.gender,
        field: formData.field, // Added field
        telephone: formData.countryCode + formData.telephone.replace(/[\s-]/g, '')
      };

      // Add password fields only for create mode or when password is provided in edit mode
      if (!isEditMode || formData.password) {
        submitData.password = formData.password;
        submitData.confirmPassword = formData.confirmPassword;
      }

      const token = localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || 
                   localStorage.getItem('accessToken') ||
                   localStorage.getItem('jwt');
      
      console.log(`${isEditMode ? 'Updating' : 'Creating'} user data:`, { 
        ...submitData, 
        password: submitData.password ? '[HIDDEN]' : undefined, 
        confirmPassword: submitData.confirmPassword ? '[HIDDEN]' : undefined 
      });
      
      // Determine API endpoint and method
      const url = isEditMode 
        ? `http://localhost:3000/api/v1/users/${userToEdit.id}`
        : 'http://localhost:3000/api/v1/auth';
      
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
          throw new Error('User not found');
        } else if (response.status === 409) {
          throw new Error('A user with this email already exists');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(responseData.message || responseData.error || `Request failed with status ${response.status}`);
        }
      }

      setSubmitStatus('success');
      setSubmitMessage(isEditMode ? 'User has been updated successfully!' : 'User has been created successfully!');
      
      // Call the callback to refresh the user list
      if (onUserSaved) {
        onUserSaved(responseData);
      }
      
      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1500);

    } catch (err) {
      console.error(`${isEditMode ? 'Update' : 'Create'} user error:`, err);
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      userRole: 'mentee',
      gender: 'prefer_not_to_say',
      field: '', // Added field
      telephone: '',
      countryCode: '+250'
    });
    setValidationErrors({});
    setSubmitStatus(null);
    setSubmitMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
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
            {isEditMode ? (
              <Edit className="w-5 h-5 mr-2 text-blue-500" />
            ) : (
              <UserPlus className="w-5 h-5 mr-2 text-blue-500" />
            )}
            <span className="hidden sm:inline">
              {isEditMode ? 'Edit User' : 'Create New User'}
            </span>
            <span className="sm:hidden">
              {isEditMode ? 'Edit' : 'New User'}
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

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  validationErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter first name"
                disabled={isSubmitting}
              />
              {validationErrors.firstName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  validationErrors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter last name"
                disabled={isSubmitting}
              />
              {validationErrors.lastName && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                validationErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
              disabled={isSubmitting}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Password {!isEditMode && '*'}
                {isEditMode && <span className="text-xs text-gray-500">(leave blank to keep current)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 pr-10 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    validationErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-start">
                  <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Confirm Password {!isEditMode && '*'}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-3 py-2 pr-10 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    validationErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Confirm password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Role, Gender, and Field Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                User Role *
              </label>
              <select
                value={formData.userRole}
                onChange={(e) => handleInputChange('userRole', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.userRole ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                {allowedRoles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              {validationErrors.userRole && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.userRole}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {validationErrors.gender && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.gender}
                </p>
              )}
            </div>
          </div>

          {/* Field of Interest */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Field of Interest *
            </label>
            <select
              value={formData.field}
              onChange={(e) => handleInputChange('field', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                validationErrors.field ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select your field</option>
              {fieldOptions.map(field => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
            {validationErrors.field && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.field}
              </p>
            )}
          </div>

          {/* Telephone Field with Country Code */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Telephone *
            </label>
            <div className="flex gap-2">
              <select
                value={formData.countryCode}
                onChange={(e) => handleInputChange('countryCode', e.target.value)}
                className="px-2 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[130px]"
                disabled={isSubmitting}
              >
                {countries.map(({ dial_code, code, flag, name }) => (
                  <option key={code} value={dial_code}>
                    {flag} {dial_code} {code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value.replace(/\D/g, ''))}
                className={`flex-1 px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  validationErrors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="788123456"
                disabled={isSubmitting}
              />
            </div>
            {validationErrors.telephone && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.telephone}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Selected: {countries.find(c => c.dial_code === formData.countryCode)?.flag} {countries.find(c => c.dial_code === formData.countryCode)?.name}
            </p>
          </div>

          {/* Password Requirements (only show for create mode or when password is being changed) */}
          {(!isEditMode || formData.password) && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h4 className="text-xs sm:text-sm font-medium text-blue-800 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 6-26 characters long</li>
                <li>• At least one uppercase letter (A-Z)</li>
                <li>• At least one lowercase letter (a-z)</li>
                <li>• At least one number (0-9)</li>
                <li>• At least one special character (@$!%*?&)</li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
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
                       Update User
                     </>
                   ) : (
                     <>
                       <UserPlus className="w-4 h-4 mr-2" />
                       Create User
                     </>
                   )}
                 </>
               )}
             </button>
            
             <button
               onClick={handleClose}
               disabled={isSubmitting}
                className="flex-1 px-4 py-2 text-sm sm:text-base bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center"
                // className="flex-1 px-4 py-2 text-sm sm:text-base bg-white hover:bg-gray-50 disabled:bg-gray-100 text-black border border-gray-300 rounded-lg transition-colors flex items-center justify-center"
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

 export default UserForm;