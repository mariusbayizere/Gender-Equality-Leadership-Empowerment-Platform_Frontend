
// import React, { useState, useEffect } from 'react';
// import { Eye, EyeOff, Mail, Shield, Lock, AlertCircle, CheckCircle, RefreshCw, User, Phone, ChevronDown } from 'lucide-react';

// // Mock countries data
// const countries = [
//   { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dial_code: '+250' },
//   { code: 'US', name: 'United States', flag: '🇺🇸', dial_code: '+1' },
//   { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dial_code: '+44' },
//   { code: 'KE', name: 'Kenya', flag: '🇰🇪', dial_code: '+254' },
//   { code: 'UG', name: 'Uganda', flag: '🇺🇬', dial_code: '+256' },
//   { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dial_code: '+255' },
// ];

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     userRole: '',
//     gender: '',
//     telephone: ''
//   });
  
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [submitMessage, setSubmitMessage] = useState('');
//   const [countriesData, setCountriesData] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);

//   // Load countries data
//   useEffect(() => {
//     setCountriesData(countries);
//     // Set Rwanda as default
//     const rwanda = countries.find(country => country.code === "RW");
//     setSelectedCountry(rwanda);
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showCountryDropdown && !event.target.closest('.country-dropdown-container')) {
//         setShowCountryDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showCountryDropdown]);

//   // Client-side validation function
//   const validateFormData = () => {
//     const newErrors = {};

//     // First name validation
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//     } else if (formData.firstName.trim().length < 2) {
//       newErrors.firstName = 'First name must be at least 2 characters';
//     }

//     // Last name validation
//     if (!formData.lastName.trim()) {
//       newErrors.lastName = 'Last name is required';
//     } else if (formData.lastName.trim().length < 2) {
//       newErrors.lastName = 'Last name must be at least 2 characters';
//     }

//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     // User role validation
//     if (!formData.userRole) {
//       newErrors.userRole = 'Please select a user role';
//     }

//     // Gender validation
//     if (!formData.gender) {
//       newErrors.gender = 'Please select your gender';
//     }

//     // Telephone validation
//     if (!formData.telephone.trim()) {
//       newErrors.telephone = 'Telephone number is required';
//     } else if (!/^\d{9,15}$/.test(formData.telephone.trim())) {
//       newErrors.telephone = 'Please enter a valid telephone number (9-15 digits)';
//     }

//     // Country selection validation
//     if (!selectedCountry) {
//       newErrors.telephone = 'Please select a country';
//     }

//     return newErrors;
//   };

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     // Clear errors when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }

//     // Clear submit status when user makes changes
//     if (submitStatus) {
//       setSubmitStatus(null);
//       setSubmitMessage('');
//     }
//   };

//   // Handle country selection
//   const handleCountrySelect = (country) => {
//     setSelectedCountry(country);
//     setShowCountryDropdown(false);
    
//     // Clear telephone error when country changes
//     if (errors.telephone) {
//       setErrors(prev => ({
//         ...prev,
//         telephone: ''
//       }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const validationErrors = validateFormData();
    
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setSubmitStatus('error');
//       setSubmitMessage('Please fix the errors above and try again.');
//       return;
//     }
    
//     setIsSubmitting(true);
//     setErrors({});
//     setSubmitStatus(null);
//     setSubmitMessage('');
    
//     try {
//       // Prepare data for API
//       const submitData = {
//         ...formData,
//         telephone: selectedCountry.dial_code + formData.telephone
//       };
      
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       setSubmitStatus('success');
//       setSubmitMessage('Registration successful! Please check your email for welcome message.');
      
//       // Reset form after successful registration
//       setTimeout(() => {
//         setFormData({
//           firstName: '',
//           lastName: '',
//           email: '',
//           password: '',
//           confirmPassword: '',
//           userRole: '',
//           gender: '',
//           telephone: ''
//         });
//         setErrors({});
//         setSubmitStatus(null);
//         setSubmitMessage('');
//         // Redirect to login or dashboard
//         // window.location.href = '/login';
//       }, 3000);

//     } catch (error) {
//       setSubmitStatus('error');
//       setSubmitMessage(error.message || 'Registration failed. Please try again.');
//       console.error('Registration error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
//       <div className="flex w-full max-w-6xl bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden">
//         {/* Left Side - Sign Up Form */}
//         <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12">
//           <div className="max-w-md mx-auto">
//             {/* Logo and Header */}
//             <div className="mb-6 sm:mb-8 flex flex-col items-center">
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create your Account</h1>
//               <p className="text-gray-600 text-sm text-center">Join us today! Select method to sign up:</p>
//             </div>

//             {/* Divider */}
//             <div className="relative mb-4 sm:mb-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Continue with email</span>
//               </div>
//             </div>

//             {/* Submit Status */}
//             {submitStatus && (
//               <div className={`flex items-center p-3 rounded-lg text-sm mb-4 animate-fade-in ${
//                 submitStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
//               }`}>
//                 {submitStatus === 'success' ? (
//                   <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
//                 ) : (
//                   <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
//                 )}
//                 <span className="text-xs sm:text-sm">{submitMessage}</span>
//               </div>
//             )}

//             {/* Registration Form */}
//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//               {/* First Name & Last Name */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div>
//                   <label htmlFor="firstName" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                     <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
//                     First Name <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="firstName"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                       errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter first name"
//                     disabled={isSubmitting}
//                   />
//                   {errors.firstName && (
//                     <div className="flex items-center mt-1 text-red-600 text-xs">
//                       <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
//                       {errors.firstName}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="lastName" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                     <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
//                     Last Name <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     id="lastName"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                       errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter last name"
//                     disabled={isSubmitting}
//                   />
//                   {errors.lastName && (
//                     <div className="flex items-center mt-1 text-red-600 text-xs">
//                       <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
//                       {errors.lastName}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Email Input */}
//               <div>
//                 <label htmlFor="email" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                   <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
//                   Email Address <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                     errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                   }`}
//                   placeholder="marius.green@example.com"
//                   disabled={isSubmitting}
//                 />
//                 {errors.email && (
//                   <div className="flex items-center mt-1 text-red-600 text-xs">
//                     <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
//                     {errors.email}
//                   </div>
//                 )}
//               </div>

//               {/* Password Input */}
//               <div>
//                 <label htmlFor="password" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                   <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
//                   Password <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 sm:pr-12 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                       errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     placeholder="Password"
//                     disabled={isSubmitting}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     disabled={isSubmitting}
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <div className="flex items-center mt-1 text-red-600 text-xs">
//                     <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
//                     {errors.password}
//                   </div>
//                 )}
//               </div>

//               {/* Confirm Password Input */}
//               <div>
//                 <label htmlFor="confirmPassword" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                   <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
//                   Confirm Password <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-10 sm:pr-12 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                       errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     placeholder="Confirm password"
//                     disabled={isSubmitting}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     disabled={isSubmitting}
//                   >
//                     {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <div className="flex items-center mt-1 text-red-600 text-xs">
//                     <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
//                     {errors.confirmPassword}
//                   </div>
//                 )}
//               </div>

//               {/* User Role & Gender */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                 <div className="relative">
//                   <label htmlFor="userRole" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                     <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
//                     User Role <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <select
//                     id="userRole"
//                     name="userRole"
//                     value={formData.userRole}
//                     onChange={handleChange}
//                     className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                       errors.userRole ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     disabled={isSubmitting}
//                   >
//                     <option value="">Select role</option>
//                     <option value="mentor">Mentor</option>
//                     <option value="mentee">Mentee</option>
//                     <option value="admin">Admin</option>
//                   </select>
//                   {errors.userRole && (
//                     <div className="flex items-center mt-1 text-red-600 text-xs">
//                       <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
//                       {errors.userRole}
//                     </div>
//                   )}
//                 </div>

//                 <div className="relative">
//                   <label htmlFor="gender" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                     <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
//                     Gender <span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <select
//                     id="gender"
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleChange}
//                     className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                       errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     disabled={isSubmitting}
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                     <option value="prefer_not_to_say">Prefer not to say</option>
//                   </select>
//                   {errors.gender && (
//                     <div className="flex items-center mt-1 text-red-600 text-xs">
//                       <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
//                       {errors.gender}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Telephone Input */}
//               <div className="country-dropdown-container relative">
//                 <label htmlFor="telephone" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                   <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
//                   Telephone <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="flex gap-2">
//                   {/* Country Code Dropdown */}
//                   <div className="relative">
//                     <button
//                       type="button"
//                       onClick={() => setShowCountryDropdown(!showCountryDropdown)}
//                       className="flex items-center px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors min-w-[100px] sm:min-w-[120px]"
//                       disabled={isSubmitting}
//                     >
//                       <span className="mr-1 sm:mr-2 text-sm">{selectedCountry?.flag}</span>
//                       <span className="text-xs sm:text-sm text-gray-700 hidden sm:inline">{selectedCountry?.dial_code}</span>
//                       <span className="text-xs sm:text-sm text-gray-700 sm:hidden">{selectedCountry?.dial_code}</span>
//                       <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 text-gray-400" />
//                     </button>
                    
//                     {showCountryDropdown && (
//                       <div className="absolute z-[9999] mt-1 w-48 sm:w-64 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
//                         {countries.map((country) => (
//                           <button
//                             key={country.code}
//                             type="button"
//                             onClick={() => handleCountrySelect(country)}
//                             className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-left hover:bg-gray-50 transition-colors"
//                           >
//                             <span className="mr-2 sm:mr-3 text-sm">{country.flag}</span>
//                             <span className="flex-1 text-xs sm:text-sm text-gray-700 truncate">{country.name}</span>
//                             <span className="text-xs sm:text-sm text-gray-500 ml-2">{country.dial_code}</span>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Phone Number Input */}
//                   <input
//                     type="tel"
//                     id="telephone"
//                     name="telephone"
//                     value={formData.telephone}
//                     onChange={handleChange}
//                     className={`flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//                       errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     placeholder="788123456"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">
//                   Selected: {selectedCountry?.flag} {selectedCountry?.name}
//                 </p>
//                 {errors.telephone && (
//                   <div className="flex items-center mt-1 text-red-600 text-xs">
//                     <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
//                     {errors.telephone}
//                   </div>
//                 )}
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`w-full py-2.5 sm:py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base ${
//                   isSubmitting 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <RefreshCw className="w-4 h-4 animate-spin" />
//                     <span>Creating Account...</span>
//                   </>
//                 ) : (
//                   <span>Create Account</span>
//                 )}
//               </button>
//             </form>

//             {/* Sign In Link */}
//             <div className="mt-4 sm:mt-6 text-center">
//               <p className="text-gray-600 text-xs sm:text-sm">
//                 Already have an account?{' '}
//                 <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
//                   Sign in
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
        
//         {/* Right Side - Illustration */}
//         <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 items-center justify-center p-8">
//           <div className="text-center text-white max-w-md">
//             <div className="mb-8">
//               <div className="relative">
//                 <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mx-auto w-72 h-72 flex items-center justify-center">
//                   <div className="space-y-6">
//                     {/* Welcome illustration */}
//                     <div className="flex justify-center">
//                       <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
//                         <User className="w-10 h-10 text-blue-600" />
//                       </div>
//                     </div>
                    
//                     {/* Form fields mockup */}
//                     <div className="space-y-3">
//                       <div className="bg-white/20 rounded-lg p-3">
//                         <div className="h-2 bg-white/30 rounded w-3/4 mb-2"></div>
//                         <div className="h-2 bg-white/30 rounded w-1/2"></div>
//                       </div>
//                       <div className="bg-white/20 rounded-lg p-3">
//                         <div className="h-2 bg-white/30 rounded w-2/3 mb-2"></div>
//                         <div className="h-2 bg-white/30 rounded w-3/4"></div>
//                       </div>
//                       <div className="bg-white/20 rounded-lg p-3">
//                         <div className="h-2 bg-white/30 rounded w-1/2"></div>
//                       </div>
//                     </div>
                    
//                     {/* Success checkmark */}
//                     <div className="flex justify-center">
//                       <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
//                         <CheckCircle className="w-6 h-6 text-white" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <h2 className="text-2xl font-bold mb-4">Join our community today!</h2>
//             <p className="text-blue-100 mb-8">Create your account and start connecting with mentors and mentees.</p>
//             {/* Features list */}
//             <div className="space-y-3">
//               <div className="flex items-center text-blue-100">
//                 <CheckCircle className="w-5 h-5 mr-3 text-blue-300" />
//                 <span>Connect with experienced mentors</span>
//               </div>
//               <div className="flex items-center text-blue-100">
//                 <CheckCircle className="w-5 h-5 mr-3 text-blue-300" />
//                 <span>Share knowledge and grow together</span>
//               </div>
//               <div className="flex items-center text-blue-100">
//                 <CheckCircle className="w-5 h-5 mr-3 text-blue-300" />
//                 <span>Build lasting professional relationships</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;







import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Shield, Lock, AlertCircle, CheckCircle, RefreshCw, User, Phone, ChevronDown } from 'lucide-react';
import { countries } from '../constant/countries';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userRole: '',
    gender: '',
    telephone: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [countriesData, setCountriesData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showUserRoleDropdown, setShowUserRoleDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  // Load countries data
  useEffect(() => {
    setCountriesData(countries);
    // Set Rwanda as default
    const rwanda = countries.find(country => country.code === "RW");
    setSelectedCountry(rwanda);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCountryDropdown && !event.target.closest('.country-dropdown-container')) {
        setShowCountryDropdown(false);
      }
      if (showUserRoleDropdown && !event.target.closest('.user-role-dropdown-container')) {
        setShowUserRoleDropdown(false);
      }
      if (showGenderDropdown && !event.target.closest('.gender-dropdown-container')) {
        setShowGenderDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountryDropdown, showUserRoleDropdown, showGenderDropdown]);

  // Client-side validation function
  const validateFormData = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // User role validation
    if (!formData.userRole) {
      newErrors.userRole = 'Please select a user role';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    // Telephone validation
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Telephone number is required';
    } else if (!/^\d{9,15}$/.test(formData.telephone.trim())) {
      newErrors.telephone = 'Please enter a valid telephone number (9-15 digits)';
    }

    // Country selection validation
    if (!selectedCountry) {
      newErrors.telephone = 'Please select a country';
    }

    return newErrors;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear submit status when user makes changes
    if (submitStatus) {
      setSubmitStatus(null);
      setSubmitMessage('');
    }
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    
    // Clear telephone error when country changes
    if (errors.telephone) {
      setErrors(prev => ({
        ...prev,
        telephone: ''
      }));
    }
  };

  // Handle user role selection
  const handleUserRoleSelect = (role) => {
    setFormData(prev => ({
      ...prev,
      userRole: role
    }));
    setShowUserRoleDropdown(false);
    
    // Clear error when role changes
    if (errors.userRole) {
      setErrors(prev => ({
        ...prev,
        userRole: ''
      }));
    }
  };

  // Handle gender selection
  const handleGenderSelect = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender: gender
    }));
    setShowGenderDropdown(false);
    
    // Clear error when gender changes
    if (errors.gender) {
      setErrors(prev => ({
        ...prev,
        gender: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateFormData();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitStatus('error');
      setSubmitMessage('Please fix the errors above and try again.');
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus(null);
    setSubmitMessage('');
    
    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        telephone: selectedCountry.dial_code + formData.telephone
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setSubmitMessage('Registration successful! Please check your email for welcome message.');
      
      // Reset form after successful registration
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          userRole: '',
          gender: '',
          telephone: ''
        });
        setErrors({});
        setSubmitStatus(null);
        setSubmitMessage('');
        // Redirect to login or dashboard
        // window.location.href = '/login';
      }, 3000);

    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // User roles options
  const userRoles = [
    { value: 'mentor', label: 'Mentor' },
    { value: 'mentee', label: 'Mentee' },
    { value: 'admin', label: 'Admin' }
  ];

  // Gender options
  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
      <div className="flex w-full max-w-6xl bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden">
        {/* Left Side - Sign Up Form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12">
          <div className="max-w-md mx-auto">
            {/* Logo and Header */}
            <div className="mb-6 sm:mb-8 flex flex-col items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Create your Account</h1>
              <p className="text-gray-600 text-sm text-center">Join us today! Select method to sign up:</p>
            </div>

            {/* Divider */}
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Continue with email</span>
              </div>
            </div>

            {/* Submit Status */}
            {submitStatus && (
              <div className={`flex items-center p-3 rounded-lg text-sm mb-4 animate-fade-in ${
                submitStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {submitStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                )}
                <span className="text-xs sm:text-sm">{submitMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="firstName" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    First Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter first name"
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <div className="flex items-center mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                      {errors.firstName}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Last Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter last name"
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <div className="flex items-center mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Email Address <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your Email Adress"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <div className="flex items-center mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Password <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2 pr-10 sm:pr-12 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter Password"
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
                {errors.password && (
                  <div className="flex items-center mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Confirm Password <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-2 pr-10 sm:pr-12 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter Confirm password"
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
                {errors.confirmPassword && (
                  <div className="flex items-center mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* User Role & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* User Role Dropdown */}
                <div className="user-role-dropdown-container relative">
                  <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    User Role <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowUserRoleDropdown(!showUserRoleDropdown)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-left flex items-center justify-between ${
                        errors.userRole ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    >
                      <span className={formData.userRole ? 'text-gray-900' : 'text-gray-500'}>
                        {formData.userRole 
                          ? userRoles.find(r => r.value === formData.userRole)?.label
                          : 'Select role'
                        }
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {showUserRoleDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {userRoles.map((role) => (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => handleUserRoleSelect(role.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2 text-left hover:bg-gray-50 transition-colors text-sm sm:text-base"
                          >
                            {role.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.userRole && (
                    <div className="flex items-center mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                      {errors.userRole}
                    </div>
                  )}
                </div>

                {/* Gender Dropdown */}
                <div className="gender-dropdown-container relative">
                  <label className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Gender <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-left flex items-center justify-between ${
                        errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    >
                      <span className={formData.gender ? 'text-gray-900' : 'text-gray-500'}>
                        {formData.gender 
                          ? genders.find(g => g.value === formData.gender)?.label
                          : 'Select gender'
                        }
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {showGenderDropdown && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {genders.map((gender) => (
                          <button
                            key={gender.value}
                            type="button"
                            onClick={() => handleGenderSelect(gender.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2 text-left hover:bg-gray-50 transition-colors text-sm sm:text-base"
                          >
                            {gender.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.gender && (
                    <div className="flex items-center mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                      {errors.gender}
                    </div>
                  )}
                </div>
              </div>

              {/* Telephone Input */}
              <div className="country-dropdown-container relative">
                <label htmlFor="telephone" className="flex items-center text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Telephone <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center px-2 sm:px-3 py-2 sm:py-2 border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors min-w-[100px] sm:min-w-[120px]"
                      disabled={isSubmitting}
                    >
                      <span className="mr-1 sm:mr-2 text-sm">{selectedCountry?.flag}</span>
                      <span className="text-xs sm:text-sm text-gray-700 hidden sm:inline">{selectedCountry?.dial_code}</span>
                      <span className="text-xs sm:text-sm text-gray-700 sm:hidden">{selectedCountry?.dial_code}</span>
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 text-gray-400" />
                    </button>
                    
                    {showCountryDropdown && (
                      <div className="absolute z-50 mt-1 w-48 sm:w-64 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-2 text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="mr-2 sm:mr-3 text-sm">{country.flag}</span>
                            <span className="flex-1 text-xs sm:text-sm text-gray-700 truncate">{country.name}</span>
                            <span className="text-xs sm:text-sm text-gray-500 ml-2">{country.dial_code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Phone Number Input */}
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={`flex-1 px-3 sm:px-4 py-2 sm:py-2 text-sm sm:text-base border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.telephone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="788123456"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {selectedCountry?.flag} {selectedCountry?.name}
                </p>
                {errors.telephone && (
                  <div className="flex items-center mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.telephone}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 sm:py-2 px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-gray-600 text-xs sm:text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 items-center justify-center p-8">
          <div className="text-center text-white max-w-md">
            <div className="mb-8">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mx-auto w-72 h-72 flex items-center justify-center">
                  <div className="space-y-6">
                    {/* Welcome illustration */}
                    <div className="flex justify-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <User className="w-10 h-10 text-blue-600" />
                      </div>
                    </div>
                    
                    {/* Form fields mockup */}
                    <div className="space-y-3">
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="h-2 bg-white/30 rounded w-3/4 mb-2"></div>
                        <div className="h-2 bg-white/30 rounded w-1/2"></div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="h-2 bg-white/30 rounded w-2/3 mb-2"></div>
                        <div className="h-2 bg-white/30 rounded w-3/4"></div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="h-2 bg-white/30 rounded w-1/2"></div>
                      </div>
                    </div>
                    
                    {/* Success checkmark */}
                    <div className="flex justify-center">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Join our community today!</h2>
            <p className="text-blue-100 mb-8">Create your account and start connecting with mentors and mentees.</p>
            {/* Features list */}
            <div className="space-y-3">
              <div className="flex items-center text-blue-100">
                <CheckCircle className="w-5 h-5 mr-3 text-blue-300" />
                <span>Connect with experienced mentors</span>
              </div>
              <div className="flex items-center text-blue-100">
                <CheckCircle className="w-5 h-5 mr-3 text-blue-300" />
                <span>Share knowledge and grow together</span>
              </div>
              <div className="flex items-center text-blue-100">
                <CheckCircle className="w-5 h-5 mr-3 text-blue-300" />
                <span>Build lasting professional relationships</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;




