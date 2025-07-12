// import React, { useState, useEffect } from 'react';
// import { X, Calendar, MapPin, Users, Type, FileText, Link, CheckCircle, AlertCircle, Plus, Edit } from 'lucide-react';

// const EventForm = ({ 
//   showModal = true, 
//   setShowModal = () => {}, 
//   onEventSaved = () => {},
//   eventToEdit = null, // null for create, event object for update
//   isEditMode = false
// }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     event_type: 'workshop',
//     event_date: '',
//     location: '',
//     number_participants: 1,
//     user_ids: [],
//     session_link: ''
//   });

//   const [validationErrors, setValidationErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [submitMessage, setSubmitMessage] = useState('');

//   const eventTypes = [
//     { value: 'workshop', label: 'Workshop' },
//     { value: 'networking', label: 'Networking' },
//     { value: 'mentorship_session', label: 'Mentorship Session' },
//     { value: 'other', label: 'Other' }
//   ];

//   // Initialize form data when editing
//   useEffect(() => {
//     if (isEditMode && eventToEdit) {
//       // Format date for input field (YYYY-MM-DDTHH:MM)
//       const formatDateForInput = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         return date.toISOString().slice(0, 16);
//       };

//       setFormData({
//         title: eventToEdit.title || '',
//         description: eventToEdit.description || '',
//         event_type: eventToEdit.event_type || 'workshop',
//         event_date: formatDateForInput(eventToEdit.event_date),
//         location: eventToEdit.location || '',
//         number_participants: eventToEdit.number_participants || 1,
//         user_ids: eventToEdit.user_ids || [],
//         session_link: eventToEdit.session_link || ''
//       });
//     }
//   }, [isEditMode, eventToEdit]);

//   // Validation function based on your Joi schema
//   const validateForm = () => {
//     const errors = {};
    
//     // Title validation
//     if (!formData.title.trim()) {
//       errors.title = 'Event title is required';
//     } else if (formData.title.trim().length > 45) {
//       errors.title = 'Event title must not exceed 45 characters';
//     }
    
//     // Description validation
//     if (!formData.description.trim()) {
//       errors.description = 'Description is required';
//     } else if (formData.description.trim().length > 100) {
//       errors.description = 'Description must not exceed 100 characters';
//     }
    
//     // Event type validation
//     if (!formData.event_type) {
//       errors.event_type = 'Event type is required';
//     } else if (!['workshop', 'networking', 'mentorship_session', 'other'].includes(formData.event_type)) {
//       errors.event_type = 'Event type must be one of: workshop, networking, mentorship_session, other';
//     }

//     // Event date validation
//     if (!formData.event_date) {
//       errors.event_date = 'Event date is required';
//     } else {
//       const eventDate = new Date(formData.event_date);
//       const now = new Date();
//       if (eventDate < now) {
//         errors.event_date = 'Event date cannot be in the past';
//       }
//     }
    
//     // Location validation
//     if (!formData.location.trim()) {
//       errors.location = 'Location is required';
//     } else if (formData.location.trim().length > 45) {
//       errors.location = 'Location must not exceed 45 characters';
//     }

//     // Number of participants validation
//     if (!formData.number_participants || formData.number_participants < 1) {
//       errors.number_participants = 'Number of participants must be at least 1';
//     } else if (!Number.isInteger(Number(formData.number_participants))) {
//       errors.number_participants = 'Number of participants must be an integer';
//     }

//     // User IDs validation
//     if (!formData.user_ids || formData.user_ids.length === 0) {
//       errors.user_ids = 'At least one user ID is required';
//     }

//     // Session link validation (optional)
//     if (formData.session_link && formData.session_link.trim()) {
//       const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
//       if (!urlPattern.test(formData.session_link.trim())) {
//         errors.session_link = 'Session link must be a valid URI';
//       }
//     }
    
//     return errors;
//   };

//   // Handle input changes
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     // Clear validation error when user starts typing
//     if (validationErrors[field]) {
//       setValidationErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//   };

//   // Handle user IDs input (comma-separated)
//   const handleUserIdsChange = (value) => {
//     const userIds = value.split(',').map(id => id.trim()).filter(id => id);
//     handleInputChange('user_ids', userIds);
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     const errors = validateForm();
    
//     if (Object.keys(errors).length > 0) {
//       setValidationErrors(errors);
//       setSubmitStatus('error');
//       setSubmitMessage('Please fix the errors above');
//       return;
//     }
    
//     setIsSubmitting(true);
//     setValidationErrors({});
//     setSubmitStatus(null);
//     setSubmitMessage('');
    
//     try {
//       // Prepare the data for submission
//       const submitData = {
//         title: formData.title.trim(),
//         description: formData.description.trim(),
//         event_type: formData.event_type,
//         event_date: new Date(formData.event_date).toISOString(),
//         location: formData.location.trim(),
//         number_participants: parseInt(formData.number_participants, 10),
//         user_ids: formData.user_ids
//       };

//       // Add session link if provided
//       if (formData.session_link && formData.session_link.trim()) {
//         submitData.session_link = formData.session_link.trim();
//       }

//       const token = localStorage.getItem('token') || 
//                    localStorage.getItem('authToken') || 
//                    localStorage.getItem('accessToken') ||
//                    localStorage.getItem('jwt');
      
//       console.log(`${isEditMode ? 'Updating' : 'Creating'} event data:`, submitData);
      
//       // Determine API endpoint and method
//       const url = isEditMode 
//         ? `http://localhost:3000/api/v1/events/${eventToEdit.id}`
//         : 'http://localhost:3000/api/v1/events';
      
//       const method = isEditMode ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//           ...(token && { 'Authorization': `Bearer ${token}` })
//         },
//         body: JSON.stringify(submitData)
//       });

//       let responseData;
//       try {
//         responseData = await response.json();
//       } catch (parseError) {
//         throw new Error('Invalid response from server');
//       }

//       if (!response.ok) {
//         // Handle different types of errors
//         if (response.status === 400) {
//           throw new Error(responseData.error || 'Invalid data provided');
//         } else if (response.status === 401) {
//           throw new Error('Authentication required. Please log in again.');
//         } else if (response.status === 403) {
//           throw new Error('You do not have permission to perform this action');
//         } else if (response.status === 404) {
//           throw new Error('Event not found');
//         } else if (response.status >= 500) {
//           throw new Error('Server error. Please try again later.');
//         } else {
//           throw new Error(responseData.error || `Request failed with status ${response.status}`);
//         }
//       }

//       setSubmitStatus('success');
//       setSubmitMessage(isEditMode ? 'Event has been updated successfully!' : 'Event has been created successfully!');
      
//       // Call the callback to refresh the event list
//       if (onEventSaved) {
//         onEventSaved(responseData);
//       }
      
//       // Close modal after success
//       setTimeout(() => {
//         setShowModal(false);
//         resetForm();
//       }, 1500);

//     } catch (err) {
//       console.error(`${isEditMode ? 'Update' : 'Create'} event error:`, err);
//       setSubmitStatus('error');
      
//       // Provide more user-friendly error messages
//       if (err.message.includes('fetch')) {
//         setSubmitMessage('Unable to connect to server. Please check your connection and try again.');
//       } else if (err.message.includes('Authentication') || err.message.includes('log in')) {
//         setSubmitMessage('Please log in again to continue.');
//       } else {
//         setSubmitMessage(err.message || 'An unexpected error occurred. Please try again.');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       event_type: 'workshop',
//       event_date: '',
//       location: '',
//       number_participants: 1,
//       user_ids: [],
//       session_link: ''
//     });
//     setValidationErrors({});
//     setSubmitStatus(null);
//     setSubmitMessage('');
//   };

//   // Close modal
//   const handleClose = () => {
//     setShowModal(false);
//     resetForm();
//   };

//   if (!showModal) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
//             {isEditMode ? (
//               <Edit className="w-5 h-5 mr-2 text-blue-500" />
//             ) : (
//               <Plus className="w-5 h-5 mr-2 text-green-500" />
//             )}
//             <span className="hidden sm:inline">
//               {isEditMode ? 'Edit Event' : 'Create New Event'}
//             </span>
//             <span className="sm:hidden">
//               {isEditMode ? 'Edit' : 'New Event'}
//             </span>
//           </h2>
//           <button
//             onClick={handleClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors p-1"
//             disabled={isSubmitting}
//           >
//             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
//           {/* Status Message */}
//           {submitMessage && (
//             <div className={`p-3 sm:p-4 rounded-lg flex items-center space-x-2 animate-fade-in ${
//               submitStatus === 'success' 
//                 ? 'bg-green-100 text-green-800 border border-green-200' 
//                 : 'bg-red-100 text-red-800 border border-red-200'
//             }`}>
//               {submitStatus === 'success' ? 
//                 <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> : 
//                 <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
//               }
//               <span className="text-xs sm:text-sm font-medium">{submitMessage}</span>
//             </div>
//           )}

//           {/* Title Field */}
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//               <FileText className="w-4 h-4 inline mr-1" />
//               Event Title *
//             </label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => handleInputChange('title', e.target.value)}
//               className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
//                 validationErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
//               }`}
//               placeholder="Enter event title"
//               disabled={isSubmitting}
//               maxLength={45}
//             />
//             {validationErrors.title && (
//               <p className="text-red-500 text-xs mt-1 flex items-center">
//                 <AlertCircle className="w-3 h-3 mr-1" />
//                 {validationErrors.title}
//               </p>
//             )}
//             <p className="text-xs text-gray-500 mt-1">{formData.title.length}/45 characters</p>
//           </div>

//           {/* Description Field */}
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//               <FileText className="w-4 h-4 inline mr-1" />
//               Description *
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => handleInputChange('description', e.target.value)}
//               className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
//                 validationErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
//               }`}
//               placeholder="Enter event description"
//               disabled={isSubmitting}
//               maxLength={100}
//               rows={3}
//             />
//             {validationErrors.description && (
//               <p className="text-red-500 text-xs mt-1 flex items-center">
//                 <AlertCircle className="w-3 h-3 mr-1" />
//                 {validationErrors.description}
//               </p>
//             )}
//             <p className="text-xs text-gray-500 mt-1">{formData.description.length}/100 characters</p>
//           </div>

//           {/* Event Type and Date */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 <Type className="w-4 h-4 inline mr-1" />
//                 Event Type *
//               </label>
//               <select
//                 value={formData.event_type}
//                 onChange={(e) => handleInputChange('event_type', e.target.value)}
//                 className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
//                   validationErrors.event_type ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                 }`}
//                 disabled={isSubmitting}
//               >
//                 {eventTypes.map(type => (
//                   <option key={type.value} value={type.value}>
//                     {type.label}
//                   </option>
//                 ))}
//               </select>
//               {validationErrors.event_type && (
//                 <p className="text-red-500 text-xs mt-1 flex items-center">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   {validationErrors.event_type}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 <Calendar className="w-4 h-4 inline mr-1" />
//                 Event Date *
//               </label>
//               <input
//                 type="datetime-local"
//                 value={formData.event_date}
//                 onChange={(e) => handleInputChange('event_date', e.target.value)}
//                 className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
//                   validationErrors.event_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                 }`}
//                 disabled={isSubmitting}
//               />
//               {validationErrors.event_date && (
//                 <p className="text-red-500 text-xs mt-1 flex items-center">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   {validationErrors.event_date}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Location and Participants */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 <MapPin className="w-4 h-4 inline mr-1" />
//                 Location *
//               </label>
//               <input
//                 type="text"
//                 value={formData.location}
//                 onChange={(e) => handleInputChange('location', e.target.value)}
//                 className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
//                   validationErrors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter event location"
//                 disabled={isSubmitting}
//                 maxLength={45}
//               />
//               {validationErrors.location && (
//                 <p className="text-red-500 text-xs mt-1 flex items-center">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   {validationErrors.location}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                 <Users className="w-4 h-4 inline mr-1" />
//                 Number of Participants *
//               </label>
//               <input
//                 type="number"
//                 value={formData.number_participants}
//                 onChange={(e) => handleInputChange('number_participants', parseInt(e.target.value) || 1)}
//                 className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
//                   validationErrors.number_participants ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                 }`}
//                 min="1"
//                 disabled={isSubmitting}
//               />
//               {validationErrors.number_participants && (
//                 <p className="text-red-500 text-xs mt-1 flex items-center">
//                   <AlertCircle className="w-3 h-3 mr-1" />
//                   {validationErrors.number_participants}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* User IDs Field */}
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//               <Users className="w-4 h-4 inline mr-1" />
//               User IDs *
//             </label>
//             <input
//               type="text"
//               value={formData.user_ids.join(', ')}
//               onChange={(e) => handleUserIdsChange(e.target.value)}
//               className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
//                 validationErrors.user_ids ? 'border-red-500 bg-red-50' : 'border-gray-300'
//               }`}
//               placeholder="Enter user IDs separated by commas (e.g., user1, user2, user3)"
//               disabled={isSubmitting}
//             />
//             {validationErrors.user_ids && (
//               <p className="text-red-500 text-xs mt-1 flex items-center">
//                 <AlertCircle className="w-3 h-3 mr-1" />
//                 {validationErrors.user_ids}
//               </p>
//             )}
//             <p className="text-xs text-gray-500 mt-1">
//               {formData.user_ids.length} user(s) selected
//             </p>
//           </div>

//           {/* Session Link Field */}
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//               <Link className="w-4 h-4 inline mr-1" />
//               Session Link (Optional)
//             </label>
//             <input
//               type="url"
//               value={formData.session_link}
//               onChange={(e) => handleInputChange('session_link', e.target.value)}
//               className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
//                 validationErrors.session_link ? 'border-red-500 bg-red-50' : 'border-gray-300'
//               }`}
//               placeholder="https://example.com/session"
//               disabled={isSubmitting}
//             />
//             {validationErrors.session_link && (
//               <p className="text-red-500 text-xs mt-1 flex items-center">
//                 <AlertCircle className="w-3 h-3 mr-1" />
//                 {validationErrors.session_link}
//               </p>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="flex-1 px-4 py-2 text-sm sm:text-base bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors flex items-center justify-center"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   {isEditMode ? 'Updating...' : 'Creating...'}
//                 </>
//               ) : (
//                 <>
//                   {isEditMode ? (
//                     <>
//                       <Edit className="w-4 h-4 mr-2" />
//                       Update Event
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="w-4 h-4 mr-2" />
//                       Create Event
//                     </>
//                   )}
//                 </>
//               )}
//             </button>
            
//             <button
//               onClick={handleClose}
//               disabled={isSubmitting}
//               className="flex-1 px-4 py-2 text-sm sm:text-base bg-white hover:bg-gray-50 disabled:bg-gray-100 text-black border border-gray-300 rounded-lg transition-colors flex items-center justify-center"
//             >
//               <X className="w-4 h-4 mr-2" />
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventForm;

import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Type, FileText, Link, CheckCircle, AlertCircle, Plus, Edit } from 'lucide-react';

const EventForm = ({ 
  showModal = true, 
  setShowModal = () => {}, 
  onEventSaved = () => {},
  eventToEdit = null, // null for create, event object for update
  isEditMode = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'workshop',
    event_date: '',
    location: '',
    number_participants: 1,
    user_ids: [],
    session_link: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'networking', label: 'Networking' },
    { value: 'mentorship_session', label: 'Mentorship Session' },
    { value: 'other', label: 'Other' }
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (isEditMode && eventToEdit) {
      // Improved date formatting with validation
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        
        try {
          const date = new Date(dateString);
          
          // Check if the date is valid
          if (isNaN(date.getTime())) {
            console.warn('Invalid date provided:', dateString);
            return '';
          }
          
          return date.toISOString().slice(0, 16);
        } catch (error) {
          console.error('Error formatting date:', error, dateString);
          return '';
        }
      };

      setFormData({
        title: eventToEdit.title || '',
        description: eventToEdit.description || '',
        event_type: eventToEdit.event_type || 'workshop',
        event_date: formatDateForInput(eventToEdit.event_date),
        location: eventToEdit.location || '',
        number_participants: eventToEdit.number_participants || 1,
        user_ids: eventToEdit.user_ids || [],
        session_link: eventToEdit.session_link || ''
      });
    }
  }, [isEditMode, eventToEdit]);

  // Validation function based on your Joi schema
  const validateForm = () => {
    const errors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      errors.title = 'Event title is required';
    } else if (formData.title.trim().length > 45) {
      errors.title = 'Event title must not exceed 45 characters';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length > 100) {
      errors.description = 'Description must not exceed 100 characters';
    }
    
    // Event type validation
    if (!formData.event_type) {
      errors.event_type = 'Event type is required';
    } else if (!['workshop', 'networking', 'mentorship_session', 'other'].includes(formData.event_type)) {
      errors.event_type = 'Event type must be one of: workshop, networking, mentorship_session, other';
    }

    // Event date validation
    if (!formData.event_date) {
      errors.event_date = 'Event date is required';
    } else {
      try {
        const eventDate = new Date(formData.event_date);
        const now = new Date();
        
        if (isNaN(eventDate.getTime())) {
          errors.event_date = 'Invalid date format';
        } else if (eventDate < now) {
          errors.event_date = 'Event date cannot be in the past';
        }
      } catch (error) {
        errors.event_date = 'Invalid date format';
      }
    }
    
    // Location validation
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.trim().length > 45) {
      errors.location = 'Location must not exceed 45 characters';
    }

    // Number of participants validation
    if (!formData.number_participants || formData.number_participants < 1) {
      errors.number_participants = 'Number of participants must be at least 1';
    } else if (!Number.isInteger(Number(formData.number_participants))) {
      errors.number_participants = 'Number of participants must be an integer';
    }

    // User IDs validation
    if (!formData.user_ids || formData.user_ids.length === 0) {
      errors.user_ids = 'At least one user ID is required';
    }

    // Session link validation (optional)
    if (formData.session_link && formData.session_link.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.session_link.trim())) {
        errors.session_link = 'Session link must be a valid URI';
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
      // Prepare the data for submission with better date handling
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        event_type: formData.event_type,
        event_date: new Date(formData.event_date).toISOString(),
        location: formData.location.trim(),
        number_participants: parseInt(formData.number_participants, 10),
        user_ids: formData.user_ids
      };

      // Add session link if provided
      if (formData.session_link && formData.session_link.trim()) {
        submitData.session_link = formData.session_link.trim();
      }

      const token = localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || 
                   localStorage.getItem('accessToken') ||
                   localStorage.getItem('jwt');
      
      console.log(`${isEditMode ? 'Updating' : 'Creating'} event data:`, submitData);
      
      // Determine API endpoint and method
      const url = isEditMode 
        ? `http://localhost:3000/api/v1/events/${eventToEdit.id}`
        : 'http://localhost:3000/api/v1/events';
      
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
          throw new Error(responseData.error || 'Invalid data provided');
        } else if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to perform this action');
        } else if (response.status === 404) {
          throw new Error('Event not found');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(responseData.error || `Request failed with status ${response.status}`);
        }
      }

      setSubmitStatus('success');
      setSubmitMessage(isEditMode ? 'Event has been updated successfully!' : 'Event has been created successfully!');
      
      // Call the callback to refresh the event list
      if (onEventSaved) {
        onEventSaved(responseData);
      }
      
      // Close modal after success
      setTimeout(() => {
        setShowModal(false);
        resetForm();
      }, 1500);

    } catch (err) {
      console.error(`${isEditMode ? 'Update' : 'Create'} event error:`, err);
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
      description: '',
      event_type: 'workshop',
      event_date: '',
      location: '',
      number_participants: 1,
      user_ids: [],
      session_link: ''
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
            {isEditMode ? (
              <Edit className="w-5 h-5 mr-2 text-blue-500" />
            ) : (
              <Plus className="w-5 h-5 mr-2 text-green-500" />
            )}
            <span className="hidden sm:inline">
              {isEditMode ? 'Edit Event' : 'Create New Event'}
            </span>
            <span className="sm:hidden">
              {isEditMode ? 'Edit' : 'New Event'}
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

          {/* Title Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Event Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                validationErrors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter event title"
              disabled={isSubmitting}
              maxLength={45}
            />
            {validationErrors.title && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.title}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/45 characters</p>
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
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                validationErrors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter event description"
              disabled={isSubmitting}
              maxLength={100}
              rows={3}
            />
            {validationErrors.description && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.description}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/100 characters</p>
          </div>

          {/* Event Type and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Type className="w-4 h-4 inline mr-1" />
                Event Type *
              </label>
              <select
                value={formData.event_type}
                onChange={(e) => handleInputChange('event_type', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  validationErrors.event_type ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {validationErrors.event_type && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.event_type}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Event Date *
              </label>
              <input
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => handleInputChange('event_date', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  validationErrors.event_date ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {validationErrors.event_date && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.event_date}
                </p>
              )}
            </div>
          </div>

          {/* Location and Participants */}
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
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  validationErrors.location ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter event location"
                disabled={isSubmitting}
                maxLength={45}
              />
              {validationErrors.location && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Number of Participants *
              </label>
              <input
                type="number"
                value={formData.number_participants}
                onChange={(e) => handleInputChange('number_participants', parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  validationErrors.number_participants ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                min="1"
                disabled={isSubmitting}
              />
              {validationErrors.number_participants && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {validationErrors.number_participants}
                </p>
              )}
            </div>
          </div>

          {/* User IDs Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              User IDs *
            </label>
            <input
              type="text"
              value={formData.user_ids.join(', ')}
              onChange={(e) => handleUserIdsChange(e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                validationErrors.user_ids ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter user IDs separated by commas (e.g., user1, user2, user3)"
              disabled={isSubmitting}
            />
            {validationErrors.user_ids && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.user_ids}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.user_ids.length} user(s) selected
            </p>
          </div>

          {/* Session Link Field */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              <Link className="w-4 h-4 inline mr-1" />
              Session Link (Optional)
            </label>
            <input
              type="url"
              value={formData.session_link}
              onChange={(e) => handleInputChange('session_link', e.target.value)}
              className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                validationErrors.session_link ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="https://example.com/session"
              disabled={isSubmitting}
            />
            {validationErrors.session_link && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {validationErrors.session_link}
              </p>
            )}
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
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Event
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
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

export default EventForm;