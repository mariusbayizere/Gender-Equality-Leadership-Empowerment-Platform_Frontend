// import React, { useState } from 'react';
// import { Eye, EyeOff, Lock, Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

// const UpdatePassword = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const validatePassword = (password) => {
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,26}$/;
//     return passwordRegex.test(password);
//   };

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email) && email.length >= 5 && email.length <= 40;
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Email validation
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!validateEmail(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (!validatePassword(formData.password)) {
//       newErrors.password = 'Password must be 6–26 characters and include uppercase, lowercase, number, and symbol';
//     }

//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Confirm password is required';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e?.preventDefault();
//     setSuccess(false);

//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:3000/api/v1/auth/reset-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccess(true);
//         setFormData({
//           email: '',
//           password: '',
//           confirmPassword: ''
//         });
//         setErrors({});
//       } else {
//         // Handle specific error cases
//         if (response.status === 404) {
//           setErrors({ email: 'User not found with provided email' });
//         } else if (response.status === 400) {
//           setErrors({ general: data.error || 'Invalid request' });
//         } else {
//           setErrors({ general: 'An error occurred. Please try again.' });
//         }
//       }
//     } catch (error) {
//       setErrors({ general: 'Network error. Please check your connection and try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
//         {/* Mobile Header - Blue design on top for mobile */}
//         <div className="lg:hidden bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
//           <div className="text-white">
//             <div className="mb-4">
//               <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
//                 <Lock className="w-8 h-8 text-white" />
//               </div>
//             </div>
//             <h2 className="text-xl font-bold mb-2">Secure Password Update</h2>
//             <p className="text-blue-100 text-sm">Your account security is our priority</p>
//           </div>
//         </div>

//         {/* Left Side - Update Password Form */}
//         <div className="w-full lg:w-1/2 p-6 lg:p-12">
//           <div className="max-w-sm mx-auto">
//             {/* Header */}
//             <div className="mb-8 flex flex-col items-center">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Your Password</h1>
//               <p className="text-gray-600 text-sm text-center">Enter your email and new password to update your account</p>
//             </div>

//             {/* Success Message */}
//             {success && (
//               <div className="flex items-center p-3 rounded-lg text-sm bg-green-50 text-green-700 mb-6">
//                 <CheckCircle className="w-4 h-4 mr-2" />
//                 <span>Password has been successfully updated! A confirmation email has been sent.</span>
//               </div>
//             )}

//             {/* General Error Message */}
//             {errors.general && (
//               <div className="flex items-center p-3 rounded-lg text-sm bg-red-50 text-red-700 mb-6">
//                 <AlertCircle className="w-4 h-4 mr-2" />
//                 <span>{errors.general}</span>
//               </div>
//             )}

//             {/* Form */}
//             <div className="space-y-4">
//               {/* Email Input */}
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
//                       errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 {errors.email && (
//                   <div className="flex items-center mt-1 text-red-600 text-xs">
//                     <AlertCircle className="w-3 h-3 mr-1" />
//                     {errors.email}
//                   </div>
//                 )}
//               </div>

//               {/* New Password Input */}
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   New Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
//                       errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter new password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <div className="flex items-center mt-1 text-red-600 text-xs">
//                     <AlertCircle className="w-3 h-3 mr-1" />
//                     {errors.password}
//                   </div>
//                 )}
//                 <p className="mt-1 text-xs text-gray-500">
//                   Password must be 6-26 characters with uppercase, lowercase, number, and special character
//                 </p>
//               </div>

//               {/* Confirm Password Input */}
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//                   Confirm New Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
//                       errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     placeholder="Confirm new password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <div className="flex items-center mt-1 text-red-600 text-xs">
//                     <AlertCircle className="w-3 h-3 mr-1" />
//                     {errors.confirmPassword}
//                   </div>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
//                   loading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
//                 }`}
//               >
//                 {loading ? (
//                   <>
//                     <RefreshCw className="w-4 h-4 animate-spin" />
//                     <span>Updating Password...</span>
//                   </>
//                 ) : (
//                   <span>Update Password</span>
//                 )}
//               </button>
//             </div>

//             {/* Login Link */}
//             <div className="mt-6 text-center">
//               <p className="text-gray-600 text-sm">
//                 Remember your password?{' '}
//                 <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
//                   Back to Login
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Illustration (Desktop only) */}
//         <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 items-center justify-center p-8">
//           <div className="text-center text-white max-w-md">
//             <div className="mb-8">
//               <div className="relative">
//                 {/* Main illustration container */}
//                 <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mx-auto w-72 h-72 flex items-center justify-center">
//                   <div className="space-y-6">
//                     {/* Security icons */}
//                     <div className="flex justify-center space-x-6">
//                       <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
//                         <Lock className="w-7 h-7 text-white" />
//                       </div>
//                       <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
//                         <CheckCircle className="w-7 h-7 text-white" />
//                       </div>
//                     </div>
                    
//                     {/* Shield icon */}
//                     <div className="flex justify-center">
//                       <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
//                         <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
//                           <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
//                         </svg>
//                       </div>
//                     </div>
                    
//                     {/* Security indicators */}
//                     <div className="bg-white/20 rounded-lg p-4 text-left">
//                       <div className="space-y-3">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                           <div className="text-xs">Strong encryption</div>
//                         </div>
//                         <div className="flex items-center space-x-3">
//                           <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                           <div className="text-xs">Secure password reset</div>
//                         </div>
//                         <div className="flex items-center space-x-3">
//                           <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                           <div className="text-xs">Account protection</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <h2 className="text-2xl font-bold mb-4">Secure Password Update</h2>
//             <p className="text-blue-100 mb-8">Your account security is our priority. Update your password safely.</p>
            
//             {/* Pagination dots */}
//             <div className="flex justify-center space-x-2">
//               <div className="w-2 h-2 bg-white rounded-full"></div>
//               <div className="w-2 h-2 bg-white/50 rounded-full"></div>
//               <div className="w-2 h-2 bg-white/50 rounded-full"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdatePassword;



import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,26}$/;
    return passwordRegex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length >= 5 && email.length <= 40;
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be 6–26 characters and include uppercase, lowercase, number, and symbol';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          email: '',
          password: '',
          confirmPassword: ''
        });
        setErrors({});
      } else {
        // Handle specific error cases
        if (response.status === 404) {
          setErrors({ email: 'User not found with provided email' });
        } else if (response.status === 400) {
          setErrors({ general: data.error || 'Invalid request' });
        } else {
          setErrors({ general: 'An error occurred. Please try again.' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Mobile Header - Blue design on top for mobile */}
        <div className="lg:hidden bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center">
          <div className="text-white">
            <div className="mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">Secure Password Update</h2>
            <p className="text-blue-100 text-sm">Your account security is our priority</p>
          </div>
        </div>

        {/* Left Side - Update Password Form */}
        <div className="w-full lg:w-1/2 p-6 lg:p-12">
          <div className="max-w-sm mx-auto">
            {/* Header - Only shown on desktop */}
            <div className="mb-8 flex-col items-center hidden lg:flex">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Your Password</h1>
              <p className="text-gray-600 text-sm text-center">Enter your email and new password to update your account</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="flex items-center p-3 rounded-lg text-sm bg-green-50 text-green-700 mb-6">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>Password has been successfully updated! A confirmation email has been sent.</span>
              </div>
            )}

            {/* General Error Message */}
            {errors.general && (
              <div className="flex items-center p-3 rounded-lg text-sm bg-red-50 text-red-700 mb-6">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* New Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.password}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be 6-26 characters with uppercase, lowercase, number, and special character
                </p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Remember your password?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Back to Login
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration (Desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 items-center justify-center p-8">
          <div className="text-center text-white max-w-md">
            <div className="mb-8">
              <div className="relative">
                {/* Main illustration container */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mx-auto w-72 h-72 flex items-center justify-center">
                  <div className="space-y-6">
                    {/* Security icons */}
                    <div className="flex justify-center space-x-6">
                      <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Lock className="w-7 h-7 text-white" />
                      </div>
                      <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    
                    {/* Shield icon */}
                    <div className="flex justify-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V18H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Security indicators */}
                    <div className="bg-white/20 rounded-lg p-4 text-left">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div className="text-xs">Strong encryption</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div className="text-xs">Secure password reset</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div className="text-xs">Account protection</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Secure Password Update</h2>
            <p className="text-blue-100 mb-8">Your account security is our priority. Update your password safely.</p>
            
            {/* Pagination dots */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
              <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;