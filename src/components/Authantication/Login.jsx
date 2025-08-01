import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Backend API base URL - consistent endpoint
  const API_BASE_URL = 'http://localhost:3000';

  // Check for OAuth callback parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const user = urlParams.get('user');
    const error = urlParams.get('error');

    if (error) {
      setSubmitStatus('error');
      setSubmitMessage(decodeURIComponent(error));
    } else if (token && user) {
      // Handle successful OAuth login
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        console.log('Google OAuth login successful:', { token, user: userData });
        
        // Store authentication data
        storeAuthData({ token, user: userData });
        
        setSubmitStatus('success');
        setSubmitMessage('Google login successful! Redirecting...');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          console.log('Redirecting to dashboard...');
          if (userData.userRole === 'admin') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/farmer';
          }
        }, 2000);
      } catch (err) {
        console.error('Error parsing user data:', err);
        setSubmitStatus('error');
        setSubmitMessage('Login successful but failed to parse user data.');
      }
    }
  }, []);

  // Enhanced token storage function with better error handling
  const storeAuthData = (data) => {
    try {
      // Clear any existing auth data first
      const keysToRemove = ['user', 'token', 'authToken', 'access_token'];
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Could not remove ${key} from localStorage:`, e);
        }
      });
      
      // Store new auth data
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('User data stored:', data.user);
      }
      
      // Handle different possible token field names from backend
      const token = data.token || data.accessToken || data.authToken || data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token); // Fallback storage
        
        // Also store with Bearer prefix for easier use
        localStorage.setItem('Authorization', `Bearer ${token}`);
        
        console.log('Token stored successfully:', {
          token: token.substring(0, 20) + '...',
          tokenType: typeof token,
          tokenLength: token.length
        });
      }
      
      // Set up axios defaults if available
      if (typeof window !== 'undefined' && window.axios) {
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Auth data stored successfully:', {
        hasUser: !!data.user,
        hasToken: !!token,
        tokenType: typeof token
      });
      
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
  };

  // Handle regular email/password login with improved error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus(null);
    setSubmitMessage('');
    
    try {
      console.log('Attempting login with:', { email: formData.email });
      
      const response = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Login response:', { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      // Ensure we have both token and user data
      if (!data.token || !data.user) {
        throw new Error('Invalid response: missing token or user data');
      }
      
      const userData = {
        token: data.token,
        user: data.user
      };
      
      console.log('Login successful, storing auth data:', userData);
      
      // Store authentication data
      await storeAuthData(userData);
      
      setSubmitStatus('success');
      setSubmitMessage('Login successful! Redirecting...');
      
      // Redirect after successful login with proper delay
      setTimeout(() => {
        console.log('Redirecting based on user role:', data.user.userRole);
        
        // Clear the URL of any query parameters before redirecting
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect based on user role
        if (data.user.userRole === 'admin') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/farmer';
        }
      }, 2000);

    } catch (error) {
      console.error('Login error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google OAuth login - Fixed to use consistent endpoint
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    setIsGoogleLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');
    
    // Clear any existing errors
    setErrors({});
    
    // Store OAuth flow state
    try {
      localStorage.setItem('oauth_flow', 'google_redirect');
    } catch (e) {
      console.warn('Could not store oauth_flow in localStorage:', e);
    }
    
    // Redirect to your backend Google OAuth endpoint - using consistent API base
    const googleAuthUrl = `${API_BASE_URL}/auth/google`;
    
    console.log('Redirecting to Google OAuth:', googleAuthUrl);
    
    // This will redirect the user to Google's OAuth consent screen
    window.location.href = googleAuthUrl;
  };

  // Alternative Google Login using popup (if you prefer popup over redirect)
  const handleGoogleLoginPopup = async () => {
    console.log('Google popup login clicked');
    setIsGoogleLoading(true);
    setSubmitStatus(null);
    setSubmitMessage('');
    setErrors({});
    
    try {
      // Open popup window for Google OAuth
      const popup = window.open(
        `${API_BASE_URL}/auth/google?popup=true`,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );
      
      // Listen for popup messages
      const handleMessage = (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          popup.close();
          const { token, user } = event.data.data;
          
          // Store authentication data
          storeAuthData({ token, user });
          
          setSubmitStatus('success');
          setSubmitMessage('Google login successful! Redirecting...');
          
          setTimeout(() => {
            if (user.userRole === 'Admin') {
              window.location.href = '/dashboard';
            } else {
              window.location.href = '/farmer';
            }
          }, 2000);
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          popup.close();
          setSubmitStatus('error');
          setSubmitMessage(event.data.error || 'Google login failed');
        }
        
        window.removeEventListener('message', handleMessage);
        setIsGoogleLoading(false);
      };
      
      window.addEventListener('message', handleMessage);
      
      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setIsGoogleLoading(false);
          setSubmitStatus('error');
          setSubmitMessage('Google login was cancelled');
        }
      }, 1000);
      
    } catch (error) {
      setIsGoogleLoading(false);
      setSubmitStatus('error');
      setSubmitMessage('Failed to open Google login popup');
      console.error('Google popup error:', error);
    }
  };

  // Handle Facebook login (placeholder)
  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
    setSubmitStatus('error');
    setSubmitMessage('Facebook login is not implemented yet.');
  };

  // Debug function to check stored auth data
  const checkStoredAuth = () => {
    console.log('Checking stored auth data:');
    console.log('Token:', localStorage.getItem('token'));
    console.log('User:', localStorage.getItem('user'));
    console.log('AuthToken:', localStorage.getItem('authToken'));
    console.log('Authorization:', localStorage.getItem('Authorization'));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        {/* Blue Design Panel - Compact mobile version */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4 sm:p-6 lg:p-10 min-h-[200px] sm:min-h-[250px] lg:min-h-[600px] order-1 lg:order-2">
          <div className="text-center text-white max-w-md w-full">
            <div className="mb-4 sm:mb-6 lg:mb-12">
              <div className="relative">
                {/* Main illustration container - Simplified for mobile */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-10 mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md flex items-center justify-center">
                  <div className="space-y-3 sm:space-y-4 lg:space-y-10 w-full">
                    {/* Profile icons - Smaller on mobile */}
                    <div className="flex justify-center space-x-3 sm:space-x-4 lg:space-x-8">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-16 lg:h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xs sm:text-sm lg:text-xl">A</span>
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-16 lg:h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xs sm:text-sm lg:text-xl">B</span>
                      </div>
                    </div>
                    
                    {/* Google icon - Smaller on mobile */}
                    <div className="flex justify-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-12 lg:h-12" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                    </div>
                    
                    {/* Chat interface mockup - Simplified for mobile */}
                    <div className="bg-white/20 rounded-lg p-2 sm:p-3 lg:p-6 text-left lg:block hidden">
                      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-9 lg:h-9 bg-white/30 rounded-full flex-shrink-0"></div>
                          <div className="h-1.5 sm:h-2 lg:h-3 bg-white/30 rounded flex-1"></div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-9 lg:h-9 bg-white/30 rounded-full flex-shrink-0"></div>
                          <div className="h-1.5 sm:h-2 lg:h-3 bg-white/30 rounded flex-1"></div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-9 lg:h-9 bg-white/30 rounded-full flex-shrink-0"></div>
                          <div className="h-1.5 sm:h-2 lg:h-3 bg-white/30 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-sm sm:text-lg lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-6 px-2 sm:px-4">Connect with every application.</h2>
            <p className="text-blue-100 mb-3 sm:mb-4 lg:mb-12 text-xs sm:text-sm lg:text-lg px-2 sm:px-4">Everything you need in an easily customizable dashboard.</p>
            
            {/* Pagination dots */}
            <div className="flex justify-center space-x-1 sm:space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 rounded-full"></div>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Login Form Panel */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-10 xl:p-12 order-2 lg:order-1">
          <div className="max-w-sm mx-auto">
            {/* Logo and Header */}
            <div className="mb-6 sm:mb-8 flex flex-col items-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Log in to GELEP</h1>
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">Welcome back! Select method to log in:</p>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-2.5 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">Google</span>
              </button>
              
              <button
                onClick={handleFacebookLogin}
                className="w-full flex items-center justify-center px-4 py-2.5 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {/* Submit Status */}
              {submitStatus && (
                <div className={`flex items-center p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${
                  submitStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                  )}
                  <span>{submitMessage}</span>
                </div>
              )}



            {/* Email/Password Form */}
            <div className="space-y-4 sm:space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex-shrink-0" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center mt-1 text-red-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-2.5 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    required
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
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-xs sm:text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="/update-password" className="text-xs sm:text-sm text-blue-600 hover:text-blue-500">
                  Forgot Password?
                </a>
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`w-full py-2.5 sm:py-2.5 px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-xs sm:text-sm">Logging in...</span>
                  </>
                ) : (
                  <span className="text-xs sm:text-sm">Log In</span>
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-gray-600 text-xs sm:text-sm">
                Don't have an account?{' '}
                <a href="/SignUp" className="text-blue-600 hover:text-blue-500 font-medium">
                  Create an account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


// import React, { useState, useEffect } from 'react';
// import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [submitMessage, setSubmitMessage] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [isGoogleLoading, setIsGoogleLoading] = useState(false);

//   // Backend API base URL - consistent endpoint
//   const API_BASE_URL = 'http://localhost:3000';

//   // Function to handle role-based redirection
//   const redirectUserByRole = (userRole) => {
//     console.log('Redirecting based on user role:', userRole);
    
//     if (userRole === 'admin') {
//       window.location.href = '/dashboard';
//     } else if (userRole === 'Mentor' || userRole === 'Mentee') {
//       window.location.href = '/farmer';
//     } else {
//       // Default fallback for any other roles
//       console.warn('Unknown user role:', userRole, 'redirecting to farmer page');
//       window.location.href = '/farmer';
//     }
//   };

//   // Check for OAuth callback parameters on component mount
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get('token');
//     const user = urlParams.get('user');
//     const error = urlParams.get('error');

//     if (error) {
//       setSubmitStatus('error');
//       setSubmitMessage(decodeURIComponent(error));
//     } else if (token && user) {
//       // Handle successful OAuth login
//       try {
//         const userData = JSON.parse(decodeURIComponent(user));
//         console.log('Google OAuth login successful:', { token, user: userData });
        
//         // Store authentication data
//         storeAuthData({ token, user: userData });
        
//         setSubmitStatus('success');
//         setSubmitMessage('Google login successful! Redirecting...');
        
//         // Redirect to appropriate page after successful login
//         setTimeout(() => {
//           console.log('Redirecting to appropriate page...');
//           redirectUserByRole(userData.userRole);
//         }, 2000);
//       } catch (err) {
//         console.error('Error parsing user data:', err);
//         setSubmitStatus('error');
//         setSubmitMessage('Login successful but failed to parse user data.');
//       }
//     }
//   }, []);

//   // Enhanced token storage function with better error handling
//   const storeAuthData = (data) => {
//     try {
//       // Clear any existing auth data first
//       const keysToRemove = ['user', 'token', 'authToken', 'access_token'];
//       keysToRemove.forEach(key => {
//         try {
//           localStorage.removeItem(key);
//         } catch (e) {
//           console.warn(`Could not remove ${key} from localStorage:`, e);
//         }
//       });
      
//       // Store new auth data
//       if (data.user) {
//         localStorage.setItem('user', JSON.stringify(data.user));
//         console.log('User data stored:', data.user);
//       }
      
//       // Handle different possible token field names from backend
//       const token = data.token || data.accessToken || data.authToken || data.access_token;
//       if (token) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('authToken', token); // Fallback storage
        
//         // Also store with Bearer prefix for easier use
//         localStorage.setItem('Authorization', `Bearer ${token}`);
        
//         console.log('Token stored successfully:', {
//           token: token.substring(0, 20) + '...',
//           tokenType: typeof token,
//           tokenLength: token.length
//         });
//       }
      
//       // Set up axios defaults if available
//       if (typeof window !== 'undefined' && window.axios) {
//         window.axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       }
      
//       console.log('Auth data stored successfully:', {
//         hasUser: !!data.user,
//         hasToken: !!token,
//         tokenType: typeof token
//       });
      
//     } catch (error) {
//       console.error('Error storing auth data:', error);
//       throw new Error('Failed to store authentication data');
//     }
//   };

//   // Validation function
//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
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
//   };

//   // Handle regular email/password login with improved error handling
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const validationErrors = validateForm();
    
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
    
//     setIsSubmitting(true);
//     setErrors({});
//     setSubmitStatus(null);
//     setSubmitMessage('');
    
//     try {
//       console.log('Attempting login with:', { email: formData.email });
      
//       const response = await fetch('http://localhost:3000/api/v1/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();
//       console.log('Login response:', { status: response.status, data });

//       if (!response.ok) {
//         throw new Error(data.error || data.message || 'Login failed');
//       }

//       // Ensure we have both token and user data
//       if (!data.token || !data.user) {
//         throw new Error('Invalid response: missing token or user data');
//       }
      
//       const userData = {
//         token: data.token,
//         user: data.user
//       };
      
//       console.log('Login successful, storing auth data:', userData);
      
//       // Store authentication data
//       await storeAuthData(userData);
      
//       setSubmitStatus('success');
//       setSubmitMessage('Login successful! Redirecting...');
      
//       // Redirect after successful login with proper delay
//       setTimeout(() => {
//         console.log('Redirecting based on user role:', data.user.userRole);
        
//         // Clear the URL of any query parameters before redirecting
//         window.history.replaceState({}, document.title, window.location.pathname);
        
//         // Redirect based on user role using the new function
//         redirectUserByRole(data.user.userRole);
//       }, 2000);

//     } catch (error) {
//       console.error('Login error:', error);
//       setSubmitStatus('error');
//       setSubmitMessage(error.message || 'Login failed. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle Google OAuth login - Fixed to use consistent endpoint
//   const handleGoogleLogin = () => {
//     console.log('Google login clicked');
//     setIsGoogleLoading(true);
//     setSubmitStatus(null);
//     setSubmitMessage('');
    
//     // Clear any existing errors
//     setErrors({});
    
//     // Store OAuth flow state
//     try {
//       localStorage.setItem('oauth_flow', 'google_redirect');
//     } catch (e) {
//       console.warn('Could not store oauth_flow in localStorage:', e);
//     }
    
//     // Redirect to your backend Google OAuth endpoint - using consistent API base
//     const googleAuthUrl = `${API_BASE_URL}/auth/google`;
    
//     console.log('Redirecting to Google OAuth:', googleAuthUrl);
    
//     // This will redirect the user to Google's OAuth consent screen
//     window.location.href = googleAuthUrl;
//   };

//   // Alternative Google Login using popup (if you prefer popup over redirect)
//   const handleGoogleLoginPopup = async () => {
//     console.log('Google popup login clicked');
//     setIsGoogleLoading(true);
//     setSubmitStatus(null);
//     setSubmitMessage('');
//     setErrors({});
    
//     try {
//       // Open popup window for Google OAuth
//       const popup = window.open(
//         `${API_BASE_URL}/auth/google?popup=true`,
//         'google-oauth',
//         'width=500,height=600,scrollbars=yes,resizable=yes'
//       );
      
//       // Listen for popup messages
//       const handleMessage = (event) => {
//         if (event.origin !== window.location.origin) return;
        
//         if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
//           popup.close();
//           const { token, user } = event.data.data;
          
//           // Store authentication data
//           storeAuthData({ token, user });
          
//           setSubmitStatus('success');
//           setSubmitMessage('Google login successful! Redirecting...');
          
//           setTimeout(() => {
//             redirectUserByRole(user.userRole);
//           }, 2000);
//         } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
//           popup.close();
//           setSubmitStatus('error');
//           setSubmitMessage(event.data.error || 'Google login failed');
//         }
        
//         window.removeEventListener('message', handleMessage);
//         setIsGoogleLoading(false);
//       };
      
//       window.addEventListener('message', handleMessage);
      
//       // Check if popup was closed manually
//       const checkClosed = setInterval(() => {
//         if (popup.closed) {
//           clearInterval(checkClosed);
//           window.removeEventListener('message', handleMessage);
//           setIsGoogleLoading(false);
//           setSubmitStatus('error');
//           setSubmitMessage('Google login was cancelled');
//         }
//       }, 1000);
      
//     } catch (error) {
//       setIsGoogleLoading(false);
//       setSubmitStatus('error');
//       setSubmitMessage('Failed to open Google login popup');
//       console.error('Google popup error:', error);
//     }
//   };

//   // Handle Facebook login (placeholder)
//   const handleFacebookLogin = () => {
//     console.log('Facebook login clicked');
//     setSubmitStatus('error');
//     setSubmitMessage('Facebook login is not implemented yet.');
//   };

//   // Debug function to check stored auth data
//   const checkStoredAuth = () => {
//     console.log('Checking stored auth data:');
//     console.log('Token:', localStorage.getItem('token'));
//     console.log('User:', localStorage.getItem('user'));
//     console.log('AuthToken:', localStorage.getItem('authToken'));
//     console.log('Authorization:', localStorage.getItem('Authorization'));
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="flex flex-col lg:flex-row w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
//         {/* Blue Design Panel - Compact mobile version */}
//         <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4 sm:p-6 lg:p-10 min-h-[200px] sm:min-h-[250px] lg:min-h-[600px] order-1 lg:order-2">
//           <div className="text-center text-white max-w-md w-full">
//             <div className="mb-4 sm:mb-6 lg:mb-12">
//               <div className="relative">
//                 {/* Main illustration container - Simplified for mobile */}
//                 <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4 lg:p-10 mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md flex items-center justify-center">
//                   <div className="space-y-3 sm:space-y-4 lg:space-y-10 w-full">
//                     {/* Profile icons - Smaller on mobile */}
//                     <div className="flex justify-center space-x-3 sm:space-x-4 lg:space-x-8">
//                       <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-16 lg:h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
//                         <span className="text-white font-bold text-xs sm:text-sm lg:text-xl">A</span>
//                       </div>
//                       <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-16 lg:h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
//                         <span className="text-white font-bold text-xs sm:text-sm lg:text-xl">B</span>
//                       </div>
//                     </div>
                    
//                     {/* Google icon - Smaller on mobile */}
//                     <div className="flex justify-center">
//                       <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
//                         <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-12 lg:h-12" viewBox="0 0 24 24">
//                           <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                           <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                           <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                           <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                         </svg>
//                       </div>
//                     </div>
                    
//                     {/* Chat interface mockup - Simplified for mobile */}
//                     <div className="bg-white/20 rounded-lg p-2 sm:p-3 lg:p-6 text-left lg:block hidden">
//                       <div className="space-y-2 sm:space-y-3 lg:space-y-4">
//                         <div className="flex items-center space-x-2 sm:space-x-3">
//                           <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-9 lg:h-9 bg-white/30 rounded-full flex-shrink-0"></div>
//                           <div className="h-1.5 sm:h-2 lg:h-3 bg-white/30 rounded flex-1"></div>
//                         </div>
//                         <div className="flex items-center space-x-2 sm:space-x-3">
//                           <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-9 lg:h-9 bg-white/30 rounded-full flex-shrink-0"></div>
//                           <div className="h-1.5 sm:h-2 lg:h-3 bg-white/30 rounded flex-1"></div>
//                         </div>
//                         <div className="flex items-center space-x-2 sm:space-x-3">
//                           <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-9 lg:h-9 bg-white/30 rounded-full flex-shrink-0"></div>
//                           <div className="h-1.5 sm:h-2 lg:h-3 bg-white/30 rounded w-3/4"></div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <h2 className="text-sm sm:text-lg lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-6 px-2 sm:px-4">Connect with every application.</h2>
//             <p className="text-blue-100 mb-3 sm:mb-4 lg:mb-12 text-xs sm:text-sm lg:text-lg px-2 sm:px-4">Everything you need in an easily customizable dashboard.</p>
            
//             {/* Pagination dots */}
//             <div className="flex justify-center space-x-1 sm:space-x-2">
//               <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
//               <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 rounded-full"></div>
//               <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/50 rounded-full"></div>
//             </div>
//           </div>
//         </div>

//         {/* Login Form Panel */}
//         <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-10 xl:p-12 order-2 lg:order-1">
//           <div className="max-w-sm mx-auto">
//             {/* Logo and Header */}
//             <div className="mb-6 sm:mb-8 flex flex-col items-center">
//               <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Log in to GELEP</h1>
//               <p className="text-gray-600 text-xs sm:text-sm lg:text-base text-center">Welcome back! Select method to log in:</p>
//             </div>

//             {/* Social Login Buttons */}
//             <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
//               <button
//                 onClick={handleGoogleLogin}
//                 className="w-full flex items-center justify-center px-4 py-2.5 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//                 <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">Google</span>
//               </button>
              
//               <button
//                 onClick={handleFacebookLogin}
//                 className="w-full flex items-center justify-center px-4 py-2.5 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" viewBox="0 0 24 24">
//                   <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                 </svg>
//                 <span className="text-gray-700 font-medium text-xs sm:text-sm lg:text-base">Facebook</span>
//               </button>
//             </div>

//             {/* Divider */}
//             <div className="relative mb-6 sm:mb-8">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-xs sm:text-sm">
//                 <span className="px-2 bg-white text-gray-500">or continue with email</span>
//               </div>
//             </div>

//             {/* Submit Status */}
//               {submitStatus && (
//                 <div className={`flex items-center p-2 sm:p-3 rounded-lg text-xs sm:text-sm mb-4 ${
//                   submitStatus === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
//                 }`}>
//                   {submitStatus === 'success' ? (
//                     <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
//                   ) : (
//                     <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
//                   )}
//                   <span>{submitMessage}</span>
//                 </div>
//               )}

//             {/* Email/Password Form */}
//             <div className="space-y-4 sm:space-y-5">
//               {/* Email Input */}
//               <div>
//                 <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex-shrink-0" />
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-4 py-2.5 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm ${
//                       errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your email"
//                     required
//                   />
//                 </div>
//                 {errors.email && (
//                   <div className="flex items-center mt-1 text-red-600 text-xs">
//                     <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
//                     {errors.email}
//                   </div>
//                 )}
//               </div>

//               {/* Password Input */}
//               <div>
//                 <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex-shrink-0" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`w-full pl-10 pr-12 py-2.5 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-xs sm:text-sm ${
//                       errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your password"
//                     required
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
//                     <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
//                     {errors.password}
//                   </div>
//                 )}
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="remember"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                     className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="remember" className="ml-2 block text-xs sm:text-sm text-gray-700">
//                     Remember me
//                   </label>
//                 </div>
//                 <a href="/update-password" className="text-xs sm:text-sm text-blue-600 hover:text-blue-500">
//                   Forgot Password?
//                 </a>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 onClick={handleSubmit}
//                 className={`w-full py-2.5 sm:py-2.5 px-4 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
//                   isSubmitting 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <RefreshCw className="w-4 h-4 animate-spin" />
//                     <span className="text-xs sm:text-sm">Logging in...</span>
//                   </>
//                 ) : (
//                   <span className="text-xs sm:text-sm">Log In</span>
//                 )}
//               </button>
//             </div>

//             {/* Sign Up Link */}
//             <div className="mt-6 sm:mt-8 text-center">
//               <p className="text-gray-600 text-xs sm:text-sm">
//                 Don't have an account?{' '}
//                 <a href="/SignUp" className="text-blue-600 hover:text-blue-500 font-medium">
//                   Create an account
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;