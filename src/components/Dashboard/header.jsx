// import React, { useState, useEffect } from 'react';
// import { Bell, Settings, Search, User, Menu, X } from 'lucide-react';

// export const Header = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token'); // Adjust based on how you store the token
        
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
//       } finally {
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

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200">
//       {/* Main Header */}
//       <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
//         {/* Left Section - Title and Welcome Text */}
//         <div className="flex-1 min-w-0">
//           <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
//             Dashboard Overview
//           </h2>
//           <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">
//             Welcome back, {loading ? 'Loading...' : user ? getFullName(user.firstName, user.lastName) : 'User'}. 
//             <span className="hidden sm:inline"> Here's what's happening with GELEP today.</span>
//           </p>
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden lg:flex items-center space-x-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//             />
//           </div>
//           <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
//             <Bell size={20} />
//             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//           </button>
//           <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
//             <Settings size={20} />
//           </button>
//           <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
//             <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white mr-3">
//               <User size={16} />
//             </div>
//             <div className="text-sm">
//               {loading ? (
//                 <>
//                   <p className="font-medium text-gray-800">Loading...</p>
//                   <p className="text-gray-600">...</p>
//                 </>
//               ) : error ? (
//                 <>
//                   <p className="font-medium text-gray-800">Error</p>
//                   <p className="text-gray-600">Failed to load</p>
//                 </>
//               ) : user ? (
//                 <>
//                   <p className="font-medium text-gray-800">
//                     {getFullName(user.firstName, user.lastName)}
//                   </p>
//                   <p className="text-gray-600">
//                     {formatUserRole(user.userRole)}
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <p className="font-medium text-gray-800">User</p>
//                   <p className="text-gray-600">Role</p>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tablet Navigation (md screens) */}
//         <div className="hidden md:flex lg:hidden items-center space-x-3">
//           <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
//             <Bell size={20} />
//             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//           </button>
//           <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
//             <Settings size={20} />
//           </button>
//           <div className="flex items-center ml-2 pl-3 border-l border-gray-200">
//             <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white mr-2">
//               <User size={16} />
//             </div>
//             <div className="text-sm">
//               {loading ? (
//                 <p className="font-medium text-gray-800">Loading...</p>
//               ) : error ? (
//                 <p className="font-medium text-gray-800">Error</p>
//               ) : user ? (
//                 <>
//                   <p className="font-medium text-gray-800 text-xs">
//                     {getFullName(user.firstName, user.lastName)}
//                   </p>
//                   <p className="text-gray-600 text-xs">
//                     {formatUserRole(user.userRole)}
//                   </p>
//                 </>
//               ) : (
//                 <p className="font-medium text-gray-800">User</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="flex md:hidden items-center space-x-2">
//           <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white">
//             <User size={16} />
//           </div>
//           <button
//             onClick={toggleMobileMenu}
//             className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu Dropdown */}
//       {isMobileMenuOpen && (
//         <div className="md:hidden border-t border-gray-200 bg-white">
//           <div className="px-4 py-3 space-y-3">
//             {/* User Info */}
//             <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
//               <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white">
//                 <User size={18} />
//               </div>
//               <div className="text-sm">
//                 {loading ? (
//                   <>
//                     <p className="font-medium text-gray-800">Loading...</p>
//                     <p className="text-gray-600">...</p>
//                   </>
//                 ) : error ? (
//                   <>
//                     <p className="font-medium text-gray-800">Error</p>
//                     <p className="text-gray-600">Failed to load</p>
//                   </>
//                 ) : user ? (
//                   <>
//                     <p className="font-medium text-gray-800">
//                       {getFullName(user.firstName, user.lastName)}
//                     </p>
//                     <p className="text-gray-600">
//                       {formatUserRole(user.userRole)}
//                     </p>
//                   </>
//                 ) : (
//                   <>
//                     <p className="font-medium text-gray-800">User</p>
//                     <p className="text-gray-600">Role</p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Search Bar */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center justify-around pt-2">
//               <button className="flex flex-col items-center space-y-1 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
//                 <div className="relative">
//                   <Bell size={20} />
//                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//                 </div>
//                 <span className="text-xs">Notifications</span>
//               </button>
//               <button className="flex flex-col items-center space-y-1 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
//                 <Settings size={20} />
//                 <span className="text-xs">Settings</span>
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

export const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // Adjust based on how you store the token
        
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can add logic here to actually toggle dark mode in your app
    // For example: document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left Section - Title and Welcome Text */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">
            Dashboard Overview
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">
            Welcome back, {loading ? 'Loading...' : user ? getFullName(user.firstName, user.lastName) : 'User'}. 
            <span className="hidden sm:inline"> Here's what's happening with GELEP today.</span>
          </p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white mr-3">
              <User size={16} />
            </div>
            <div className="text-sm">
              {loading ? (
                <>
                  <p className="font-medium text-gray-800">Loading...</p>
                  <p className="text-gray-600">...</p>
                </>
              ) : error ? (
                <>
                  <p className="font-medium text-gray-800">Error</p>
                  <p className="text-gray-600">Failed to load</p>
                </>
              ) : user ? (
                <>
                  <p className="font-medium text-gray-800">
                    {getFullName(user.firstName, user.lastName)}
                  </p>
                  <p className="text-gray-600">
                    {formatUserRole(user.userRole)}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-gray-800">User</p>
                  <p className="text-gray-600">Role</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tablet Navigation (md screens) */}
        <div className="hidden md:flex lg:hidden items-center space-x-3">
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="flex items-center ml-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white mr-2">
              <User size={16} />
            </div>
            <div className="text-sm">
              {loading ? (
                <p className="font-medium text-gray-800">Loading...</p>
              ) : error ? (
                <p className="font-medium text-gray-800">Error</p>
              ) : user ? (
                <>
                  <p className="font-medium text-gray-800 text-xs">
                    {getFullName(user.firstName, user.lastName)}
                  </p>
                  <p className="text-gray-600 text-xs">
                    {formatUserRole(user.userRole)}
                  </p>
                </>
              ) : (
                <p className="font-medium text-gray-800">User</p>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white">
            <User size={16} />
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <div className="text-sm">
                {loading ? (
                  <>
                    <p className="font-medium text-gray-800">Loading...</p>
                    <p className="text-gray-600">...</p>
                  </>
                ) : error ? (
                  <>
                    <p className="font-medium text-gray-800">Error</p>
                    <p className="text-gray-600">Failed to load</p>
                  </>
                ) : user ? (
                  <>
                    <p className="font-medium text-gray-800">
                      {getFullName(user.firstName, user.lastName)}
                    </p>
                    <p className="text-gray-600">
                      {formatUserRole(user.userRole)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-800">User</p>
                    <p className="text-gray-600">Role</p>
                  </>
                )}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-around pt-2">
              <button className="flex flex-col items-center space-y-1 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </div>
                <span className="text-xs">Notifications</span>
              </button>
              <button 
                onClick={toggleDarkMode}
                className="flex flex-col items-center space-y-1 p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
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