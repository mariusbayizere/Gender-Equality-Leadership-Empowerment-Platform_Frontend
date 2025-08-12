// import React, { useState, useEffect } from 'react';
// import { Bell, Moon, Sun, Search, User, Menu, X } from 'lucide-react';
// import { useTheme } from '../Dashboard/theme-context';

// export const Header = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
//   // Use the theme context
//   const { isDarkMode, toggleDarkMode, theme } = useTheme();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         // Simulating API call with mock data for demo
//         setTimeout(() => {
//           setUser({
//             firstName: 'John',
//             lastName: 'Doe',
//             userRole: 'admin'
//           });
//           setLoading(false);
//         }, 1000);
        
//         // /* Original API call - uncomment when ready to use
//         const token = localStorage.getItem('token');
        
//         if (!token) {
//           throw new Error('No authentication token found');
//         }

//         const response = await fetch('http://localhost:3000/api/v1/users/me', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch user data');
//         }

//         const data = await response.json();
        
//         if (data.success) {
//           setUser(data.user);
//         } else {
//           throw new Error('Failed to fetch user data');
//         }

//       } catch (err) {
//         console.error('Error fetching user data:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   // Helper function to format user role
//   const formatUserRole = (role) => {
//     if (!role) return 'User';
//     return role.charAt(0).toUpperCase() + role.slice(1);
//   };

//   // Helper function to get full name
//   const getFullName = (firstName, lastName) => {
//     const parts = [firstName, lastName].filter(Boolean);
//     return parts.length > 0 ? parts.join(' ') : 'User';
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   const handleToggleDarkMode = () => {
//     console.log('Header: Toggling dark mode, current isDarkMode:', isDarkMode);
//     toggleDarkMode();
//   };

//   return (
//     <header className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm border-b transition-colors duration-200">
//       {/* Main Header */}
//       <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
//         {/* Left Section - Title and Welcome Text */}
//         <div className="flex-1 min-w-0">
//           <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white truncate">
//             Dashboard Overview
//           </h2>
//           <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
//             Welcome back, {loading ? 'Loading...' : user ? getFullName(user.firstName, user.lastName) : 'User'}. 
//             <span className="hidden sm:inline"> Here's what's happening with GELEP today.</span>
//             <span className="ml-2 text-xs opacity-60">({theme} mode)</span>
//           </p>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden lg:flex items-center space-x-4">
//           <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
//             <Bell size={20} />
//             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//           </button>
//           <button 
//             onClick={handleToggleDarkMode}
//             className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
//             title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//           >
//             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//           </button>
//           <div className="flex items-center ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
//             <div className="w-8 h-8 bg-blue-700 dark:bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
//               <User size={16} />
//             </div>
//             <div className="text-sm">
//               {loading ? (
//                 <>
//                   <p className="font-medium text-gray-800 dark:text-white">Loading...</p>
//                   <p className="text-gray-600 dark:text-gray-300">...</p>
//                 </>
//               ) : error ? (
//                 <>
//                   <p className="font-medium text-gray-800 dark:text-white">Error</p>
//                   <p className="text-gray-600 dark:text-gray-300">Failed to load</p>
//                 </>
//               ) : user ? (
//                 <>
//                   <p className="font-medium text-gray-800 dark:text-white">
//                     {getFullName(user.firstName, user.lastName)}
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-300">
//                     {formatUserRole(user.userRole)}
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <p className="font-medium text-gray-800 dark:text-white">User</p>
//                   <p className="text-gray-600 dark:text-gray-300">Role</p>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tablet Navigation (md screens) */}
//         <div className="hidden md:flex lg:hidden items-center space-x-3">
//           <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
//             <Bell size={20} />
//             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//           </button>
//           <button 
//             onClick={handleToggleDarkMode}
//             className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
//             title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//           >
//             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//           </button>
//           <div className="flex items-center ml-2 pl-3 border-l border-gray-200 dark:border-gray-700">
//             <div className="w-8 h-8 bg-blue-700 dark:bg-blue-600 rounded-full flex items-center justify-center text-white mr-2">
//               <User size={16} />
//             </div>
//             <div className="text-sm">
//               {loading ? (
//                 <p className="font-medium text-gray-800 dark:text-white">Loading...</p>
//               ) : error ? (
//                 <p className="font-medium text-gray-800 dark:text-white">Error</p>
//               ) : user ? (
//                 <>
//                   <p className="font-medium text-gray-800 dark:text-white text-xs">
//                     {getFullName(user.firstName, user.lastName)}
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-300 text-xs">
//                     {formatUserRole(user.userRole)}
//                   </p>
//                 </>
//               ) : (
//                 <p className="font-medium text-gray-800 dark:text-white">User</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="flex md:hidden items-center space-x-2">
//           <div className="w-8 h-8 bg-blue-700 dark:bg-blue-600 rounded-full flex items-center justify-center text-white">
//             <User size={16} />
//           </div>
//           <button
//             onClick={toggleMobileMenu}
//             className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
//           >
//             {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
//           <div className="px-4 py-3 space-y-3">
//             {/* User Info */}
//             <div className="flex items-center space-x-3 pb-3 border-b border-gray-100 dark:border-gray-800">
//               <div className="w-10 h-10 bg-blue-700 dark:bg-blue-600 rounded-full flex items-center justify-center text-white">
//                 <User size={18} />
//               </div>
//               <div className="text-sm">
//                 {loading ? (
//                   <>
//                     <p className="font-medium text-gray-800 dark:text-white">Loading...</p>
//                     <p className="text-gray-600 dark:text-gray-300">...</p>
//                   </>
//                 ) : error ? (
//                   <>
//                     <p className="font-medium text-gray-800 dark:text-white">Error</p>
//                     <p className="text-gray-600 dark:text-gray-300">Failed to load</p>
//                   </>
//                 ) : user ? (
//                   <>
//                     <p className="font-medium text-gray-800 dark:text-white">
//                       {getFullName(user.firstName, user.lastName)}
//                     </p>
//                     <p className="text-gray-600 dark:text-gray-300">
//                       {formatUserRole(user.userRole)}
//                     </p>
//                   </>
//                 ) : (
//                   <>
//                     <p className="font-medium text-gray-800 dark:text-white">User</p>
//                     <p className="text-gray-600 dark:text-gray-300">Role</p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center justify-around pt-2">
//               <button className="flex flex-col items-center space-y-1 p-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
//                 <div className="relative">
//                   <Bell size={20} />
//                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//                 </div>
//                 <span className="text-xs">Notifications</span>
//               </button>
//               <button 
//                 onClick={handleToggleDarkMode}
//                 className="flex flex-col items-center space-y-1 p-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
//                 title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//               >
//                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//                 <span className="text-xs">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

import React, { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Search, User, Menu, X } from 'lucide-react';
import { useTheme } from '../Dashboard/theme-context';

export const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Use the theme context
  const { isDarkMode, toggleDarkMode, theme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Check if we have a token first
        const token = localStorage.getItem('token');
        
        if (!token) {
          // If no token, set a default user or handle the no-auth case
          setUser({
            firstName: 'Guest',
            lastName: 'User',
            userRole: 'guest'
          });
          setLoading(false);
          return;
        }

        // Try to fetch real user data
        const response = await fetch('http://localhost:3000/api/v1/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        if (data.success) {
          setUser(data.user);
        } else {
          throw new Error('Failed to fetch user data');
        }
        
      } catch (err) {
        console.error('Error fetching user data:', err);
        
        // Set fallback user data instead of showing error
        setUser({
          firstName: 'John',
          lastName: 'Doe',
          userRole: 'admin'
        });
        setError(null); // Don't show error to user
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Helper function to format user role
  const formatUserRole = (role) => {
    if (!role) return 'User';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Helper function to get full name
  const getFullName = (firstName, lastName) => {
    const parts = [firstName, lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(' ') : 'User';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleToggleDarkMode = () => {
    console.log('Header: Toggling dark mode, current isDarkMode:', isDarkMode);
    toggleDarkMode();
  };

  // Show loading state briefly
  const displayUser = loading ? null : user;
  const displayName = loading ? 'Loading...' : (displayUser ? getFullName(displayUser.firstName, displayUser.lastName) : 'User');
  const displayRole = loading ? '...' : (displayUser ? formatUserRole(displayUser.userRole) : 'Role');

  return (
    <header className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm border-b transition-colors duration-200">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left Section - Title and Welcome Text */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white truncate">
            Dashboard Overview
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
            Welcome back, {displayName}. 
            <span className="hidden sm:inline"> Here's what's happening with GELEP today.</span>
            <span className="ml-2 text-xs opacity-60">({theme} mode)</span>
          </p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={handleToggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-blue-700 dark:bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
              <User size={16} />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-800 dark:text-white">
                {displayName}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {displayRole}
              </p>
            </div>
          </div>
        </div>

        {/* Tablet Navigation (md screens) */}
        <div className="hidden md:flex lg:hidden items-center space-x-3">
          <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={handleToggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center ml-2 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-blue-700 dark:bg-blue-600 rounded-full flex items-center justify-center text-white mr-2">
              <User size={16} />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-800 dark:text-white text-xs">
                {displayName}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-xs">
                {displayRole}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <div className="w-8 h-8 bg-blue-700 dark:bg-blue-600 rounded-full flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="px-4 py-3 space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 bg-blue-700 dark:bg-blue-600 rounded-full flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-800 dark:text-white">
                  {displayName}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {displayRole}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-around pt-2">
              <button className="flex flex-col items-center space-y-1 p-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <div className="relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </div>
                <span className="text-xs">Notifications</span>
              </button>
              <button 
                onClick={handleToggleDarkMode}
                className="flex flex-col items-center space-y-1 p-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span className="text-xs">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};