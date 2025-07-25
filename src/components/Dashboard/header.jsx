// import React, { useState, useEffect } from 'react';
// import { Bell, Moon, Sun, Search, User, Menu, X } from 'lucide-react';

// export const Header = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   // Initialize dark mode from memory (since localStorage isn't available in artifacts)
//   useEffect(() => {
//     // In a real app, you'd use localStorage:
//     // const savedDarkMode = localStorage.getItem('darkMode');
//     // if (savedDarkMode) {
//     //   setIsDarkMode(JSON.parse(savedDarkMode));
//     // }
    
//     // For now, we'll just use the state
//     console.log('Dark mode initialized:', isDarkMode);
//   }, []);

//   // Apply dark mode to document
//   useEffect(() => {
//     console.log('Applying dark mode:', isDarkMode);
    
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//       document.body.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       document.body.classList.remove('dark');
//     }
    
//     // In a real app, you'd save to localStorage:
//     // localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
//     console.log('Document classes:', document.documentElement.classList.toString());
//   }, [isDarkMode]);

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
//         // */
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

//   const toggleDarkMode = () => {
//     console.log('Toggling dark mode from:', isDarkMode, 'to:', !isDarkMode);
//     setIsDarkMode(!isDarkMode);
//   };

//   return (
//     <header className={`${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b transition-colors duration-200`}>
//       {/* Main Header */}
//       <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
//         {/* Left Section - Title and Welcome Text */}
//         <div className="flex-1 min-w-0">
//           <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} truncate`}>
//             Dashboard Overview
//           </h2>
//           <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} truncate mt-1`}>
//             Welcome back, {loading ? 'Loading...' : user ? getFullName(user.firstName, user.lastName) : 'User'}. 
//             <span className="hidden sm:inline"> Here's what's happening with GELEP today.</span>
//           </p>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden lg:flex items-center space-x-4">
//           <div className="relative">
//             <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
//             <input
//               type="text"
//               placeholder="Search..."
//               className={`pl-10 pr-4 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-800 text-white placeholder-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64`}
//             />
//           </div>
//           <button className={`relative p-2 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'} rounded-lg transition-colors`}>
//             <Bell size={20} />
//             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//           </button>
//           <button 
//             onClick={toggleDarkMode}
//             className={`p-2 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'} rounded-lg transition-colors`}
//             title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//           >
//             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//           </button>
//           <div className={`flex items-center ml-4 pl-4 border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//             <div className={`w-8 h-8 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-700'} rounded-full flex items-center justify-center text-white mr-3`}>
//               <User size={16} />
//             </div>
//             <div className="text-sm">
//               {loading ? (
//                 <>
//                   <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Loading...</p>
//                   <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>...</p>
//                 </>
//               ) : error ? (
//                 <>
//                   <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Error</p>
//                   <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Failed to load</p>
//                 </>
//               ) : user ? (
//                 <>
//                   <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
//                     {getFullName(user.firstName, user.lastName)}
//                   </p>
//                   <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     {formatUserRole(user.userRole)}
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>User</p>
//                   <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Role</p>
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
//             onClick={toggleDarkMode}
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

//             {/* Search Bar */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
//               />
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
//                 onClick={toggleDarkMode}
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
        // Simulating API call with mock data for demo
        setTimeout(() => {
          setUser({
            firstName: 'John',
            lastName: 'Doe',
            userRole: 'admin'
          });
          setLoading(false);
        }, 1000);
        
        // /* Original API call - uncomment when ready to use
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

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
        setError(err.message);
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
            Welcome back, {loading ? 'Loading...' : user ? getFullName(user.firstName, user.lastName) : 'User'}. 
            <span className="hidden sm:inline"> Here's what's happening with GELEP today.</span>
            <span className="ml-2 text-xs opacity-60">({theme} mode)</span>
          </p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
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
              {loading ? (
                <>
                  <p className="font-medium text-gray-800 dark:text-white">Loading...</p>
                  <p className="text-gray-600 dark:text-gray-300">...</p>
                </>
              ) : error ? (
                <>
                  <p className="font-medium text-gray-800 dark:text-white">Error</p>
                  <p className="text-gray-600 dark:text-gray-300">Failed to load</p>
                </>
              ) : user ? (
                <>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {getFullName(user.firstName, user.lastName)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {formatUserRole(user.userRole)}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-800 dark:text-white">User</p>
                  <p className="text-gray-600 dark:text-gray-300">Role</p>
                </>
              )}
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
              {loading ? (
                <p className="font-medium text-gray-800 dark:text-white">Loading...</p>
              ) : error ? (
                <p className="font-medium text-gray-800 dark:text-white">Error</p>
              ) : user ? (
                <>
                  <p className="font-medium text-gray-800 dark:text-white text-xs">
                    {getFullName(user.firstName, user.lastName)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">
                    {formatUserRole(user.userRole)}
                  </p>
                </>
              ) : (
                <p className="font-medium text-gray-800 dark:text-white">User</p>
              )}
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
                {loading ? (
                  <>
                    <p className="font-medium text-gray-800 dark:text-white">Loading...</p>
                    <p className="text-gray-600 dark:text-gray-300">...</p>
                  </>
                ) : error ? (
                  <>
                    <p className="font-medium text-gray-800 dark:text-white">Error</p>
                    <p className="text-gray-600 dark:text-gray-300">Failed to load</p>
                  </>
                ) : user ? (
                  <>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {getFullName(user.firstName, user.lastName)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {formatUserRole(user.userRole)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-800 dark:text-white">User</p>
                    <p className="text-gray-600 dark:text-gray-300">Role</p>
                  </>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
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