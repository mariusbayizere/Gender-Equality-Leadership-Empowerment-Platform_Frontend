
// import React, { useState } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import {
//   BarChart3, Users, Calendar, UserCheck, FileText, MessageSquare, Target,
//   Settings, LogOut, ChevronLeft, Menu, Bell, Search, User, X
// } from 'lucide-react';
// import { Header } from './header';

// const DashboardLayout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isLoggingOut, setIsLoggingOut] = useState(false); // Loading state for logout
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Sidebar navigation items
//   const sidebarItems = [
//     { 
//       name: 'Dashboard', 
//       icon: BarChart3, 
//       path: '/dashboard',
//     },
//     { 
//       name: 'Users', 
//       icon: Users, 
//       path: '/dashboard/users',
//     },
//     { 
//       name: 'Events', 
//       icon: Calendar, 
//       path: '/dashboard/events',
//     },
//     { 
//       name: 'Mentorship', 
//       icon: UserCheck, 
//       path: '/dashboard/mentorship',
//     },
//     { 
//       name: 'Reports', 
//       icon: FileText, 
//       path: '/dashboard/reports',
//     },
//     { 
//       name: 'Forum', 
//       icon: MessageSquare, 
//       path: '/dashboard/forum',
//     },
//     { 
//       name: 'Progress', 
//       icon: Target, 
//       path: '/dashboard/progress',
//     },
//     { 
//       name: 'Settings', 
//       icon: Settings, 
//       path: '/dashboard/settings',
//     },
//   ];

//   // Check if current path matches the item path
//   const isActiveItem = (itemPath) => {
//     if (itemPath === '/dashboard') {
//       return location.pathname === '/dashboard' || location.pathname === '/';
//     }
//     return location.pathname.startsWith(itemPath);
//   };

//   // Handle navigation
//   const handleNavigation = (path) => {
//     navigate(path);
//     // Close mobile menu after navigation
//     setIsMobileMenuOpen(false);
//   };

//   // Handle logout with API call
//   const handleLogout = async () => {
//     setIsLoggingOut(true);
    
//     try {
//       const token = localStorage.getItem('authToken');
      
//       if (!token) {
//         // If no token, just redirect to login
//         navigate('/login');
//         return;
//       }

//       const response = await fetch('http://localhost:3000/api/v1/auth/logout', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Successfully logged out
//         console.log('Logout successful:', data.message);
        
//         // Clear token from localStorage
//         localStorage.removeItem('authToken');
        
//         // Redirect to login page
//         navigate('/login');
//       } else {
//         // Handle error response
//         console.error('Logout failed:', data.error);
        
//         // Even if logout failed, clear token and redirect
//         localStorage.removeItem('authToken');
//         navigate('/login');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
      
//       // Even if network error, clear token and redirect
//       localStorage.removeItem('authToken');
//       navigate('/login');
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   // Toggle mobile menu
//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 font-outfit overflow-hidden">
//       {/* Mobile Menu Overlay */}
//       {isMobileMenuOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Desktop Layout Container */}
//       <div className="hidden lg:flex h-full w-full overflow-hidden">
//         {/* Sidebar - Desktop */}
//         <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out flex-col flex`}>
//           {/* Sidebar Header */}
//           <div className="p-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h1 className={`font-bold text-xl text-gray-800 transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 hidden'}`}>
//                 GELEP Admin
//               </h1>
//               <button
//                 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                 className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//                 title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
//               >
//                 {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
//               </button>
//             </div>
//           </div>
          
//           {/* Navigation Items */}
//           <nav className="mt-4 flex-1 overflow-y-auto">
//             <div className="space-y-1 px-2">
//               {sidebarItems.map((item, index) => {
//                 const isActive = isActiveItem(item.path);
//                 const Icon = item.icon;
                
//                 return (
//                   <button
//                     key={index}
//                     onClick={() => handleNavigation(item.path)}
//                     className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
//                       isActive 
//                         ? 'bg-blue-500 text-white shadow-sm' 
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }`}
//                     title={!isSidebarOpen ? item.name : ''}
//                   >
//                     <Icon 
//                       size={20} 
//                       className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} transition-colors duration-200`}
//                     />
                    
//                     {isSidebarOpen && (
//                       <div className="ml-3 text-left">
//                         <span className="block font-medium text-sm">{item.name}</span>
//                       </div>
//                     )}
                    
//                     {/* Tooltip for collapsed sidebar */}
//                     {!isSidebarOpen && (
//                       <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                         {item.name}
//                       </div>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </nav>
          
//           {/* Sidebar Footer */}
//           <div className="p-4 border-t border-gray-200 mt-auto">
//             <button 
//               onClick={handleLogout}
//               disabled={isLoggingOut}
//               className={`flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group ${
//                 isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               title={!isSidebarOpen ? 'Logout' : ''}
//             >
//               <LogOut size={20} className="text-red-500" />
//               {isSidebarOpen && (
//                 <span className="ml-3 font-medium">
//                   {isLoggingOut ? 'Logging out...' : 'Logout'}
//                 </span>
//               )}
              
//               {/* Tooltip for collapsed sidebar */}
//               {!isSidebarOpen && (
//                 <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                   {isLoggingOut ? 'Logging out...' : 'Logout'}
//                 </div>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Main Content Area - Desktop */}
//         <div className="flex-1 overflow-hidden flex flex-col min-w-0">
//           {/* Desktop Header */}
//           <Header />
          
//           {/* Page Content */}
//           <main className="flex-1 overflow-auto bg-gray-50">
//             <div className="h-full">
//               <Outlet />
//             </div>
//           </main>
//         </div>
//       </div>

//       {/* Mobile Sidebar */}
//       <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
//         isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
//       }`}>
//         {/* Mobile Sidebar Header */}
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h1 className="font-bold text-xl text-gray-800">GELEP Admin</h1>
//             <button
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//             >
//               <X size={20} />
//             </button>
//           </div>
//         </div>
        
//         {/* Mobile Navigation Items */}
//         <nav className="mt-4 flex-1 overflow-y-auto">
//           <div className="space-y-1 px-2">
//             {sidebarItems.map((item, index) => {
//               const isActive = isActiveItem(item.path);
//               const Icon = item.icon;
              
//               return (
//                 <button
//                   key={index}
//                   onClick={() => handleNavigation(item.path)}
//                   className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
//                     isActive 
//                       ? 'bg-blue-500 text-white shadow-sm' 
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                   }`}
//                 >
//                   <Icon 
//                     size={20} 
//                     className={`${isActive ? 'text-white' : 'text-gray-500'} transition-colors duration-200`}
//                   />
//                   <div className="ml-3 text-left">
//                     <span className="block font-medium text-sm">{item.name}</span>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </nav>
        
//         {/* Mobile Sidebar Footer */}
//         <div className="p-4 border-t border-gray-200 mt-auto">
//           <button 
//             onClick={handleLogout}
//             disabled={isLoggingOut}
//             className={`flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 ${
//               isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
//             }`}
//           >
//             <LogOut size={20} className="text-red-500" />
//             <span className="ml-3 font-medium">
//               {isLoggingOut ? 'Logging out...' : 'Logout'}
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Main Content Area - Works for both desktop and mobile */}
//       <div className="flex-1 overflow-hidden flex flex-col min-w-0">
//         {/* Mobile Header with Menu Button */}
//         <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 z-10">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={toggleMobileMenu}
//               className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//             >
//               <Menu size={20} />
//             </button>
//             <h1 className="font-bold text-lg text-gray-800">GELEP Admin</h1>
//             <div className="flex items-center space-x-2">
//               <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
//                 <Bell size={20} />
//               </button>
//               <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
//                 <User size={20} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Desktop Header */}
//         <div className="hidden lg:block">
//           <Header />
//         </div>
        
//         {/* Page Content */}
//         <main className="flex-1 overflow-auto bg-gray-50 min-h-0">
//           <div className="h-full min-h-full">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;


import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3, Users, Calendar, UserCheck, FileText, MessageSquare, Target,
  Settings, LogOut, ChevronLeft, Menu, Bell, User, X
} from 'lucide-react';
import { Header } from './header';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { name: 'Users', icon: Users, path: '/dashboard/users' },
    { name: 'Events', icon: Calendar, path: '/dashboard/events' },
    { name: 'Mentorship', icon: UserCheck, path: '/dashboard/mentorship' },
    { name: 'Reports', icon: FileText, path: '/dashboard/reports' },
    { name: 'Forum', icon: MessageSquare, path: '/dashboard/forum' },
    { name: 'Progress', icon: Target, path: '/dashboard/progress' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  const isActiveItem = (itemPath) => {
    if (itemPath === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(itemPath);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('http://localhost:3000/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        console.error('Logout failed:', data.error);
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('authToken');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-outfit overflow-hidden text-gray-900 dark:text-gray-100">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full w-full overflow-hidden">
        
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out flex-col flex`}>
          
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className={`font-bold text-xl text-gray-800 dark:text-white transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 hidden'}`}>
                GELEP Admin
              </h1>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          
          {/* Nav Items */}
          <nav className="mt-4 flex-1 overflow-y-auto">
            <div className="space-y-1 px-2">
              {sidebarItems.map((item, index) => {
                const isActive = isActiveItem(item.path);
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                      isActive 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    {isSidebarOpen && (
                      <div className="ml-3 text-left">
                        <span className="block font-medium text-sm">{item.name}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 group ${
                isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <LogOut size={20} className="text-red-500" />
              {isSidebarOpen && (
                <span className="ml-3 font-medium">
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="font-bold text-xl text-gray-800 dark:text-white">GELEP Admin</h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <X size={20} />
          </button>
        </div>
        <nav className="mt-4 flex-1 overflow-y-auto">
          <div className="space-y-1 px-2">
            {sidebarItems.map((item, index) => {
              const isActive = isActiveItem(item.path);
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <div className="ml-3 text-left">
                    <span className="block font-medium text-sm">{item.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
          >
            <LogOut size={20} className="text-red-500" />
            <span className="ml-3 font-medium">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0 lg:hidden">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
          <button onClick={toggleMobileMenu} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu size={20} />
          </button>
          <h1 className="font-bold text-lg text-gray-800 dark:text-white">GELEP Admin</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <User size={20} />
            </button>
          </div>
        </div>
        <div className="hidden lg:block">
          <Header />
        </div>
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
