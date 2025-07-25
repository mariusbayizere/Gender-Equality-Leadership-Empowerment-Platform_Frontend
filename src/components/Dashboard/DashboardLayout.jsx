import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3, Users, Calendar, UserCheck, FileText, MessageSquare, Target,
  Settings, LogOut, ChevronLeft, Menu, Bell, Search, User
} from 'lucide-react';
import { Header } from './header';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar navigation items
  const sidebarItems = [
    { 
      name: 'Dashboard', 
      icon: BarChart3, 
      path: '/dashboard',
      description: 'Overview and analytics'
    },
    { 
      name: 'Users', 
      icon: Users, 
      path: '/dashboard/users',
      description: 'User management'
    },
    { 
      name: 'Events', 
      icon: Calendar, 
      path: '/dashboard/events',
      description: 'Event management'
    },
    { 
      name: 'Mentorship', 
      icon: UserCheck, 
      path: '/dashboard/mentorship',
      description: 'Mentorship programs'
    },
    { 
      name: 'Reports', 
      icon: FileText, 
      path: '/dashboard/reports',
      description: 'Analytics and reports'
    },
    { 
      name: 'Forum', 
      icon: MessageSquare, 
      path: '/dashboard/forum',
      description: 'Forum management'
    },
    { 
      name: 'Progress', 
      icon: Target, 
      path: '/dashboard/progress',
      description: 'Progress tracking'
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/dashboard/settings',
      description: 'System settings'
    },
  ];

  // Check if current path matches the item path
  const isActiveItem = (itemPath) => {
    if (itemPath === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(itemPath);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-outfit">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl text-gray-800 transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 hidden'}`}>
              GELEP Admin
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        {/* Navigation Items */}
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
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={!isSidebarOpen ? item.name : ''}
                >
                  <Icon 
                    size={20} 
                    className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} transition-colors duration-200`}
                  />
                  
                  {isSidebarOpen && (
                    <div className="ml-3 text-left">
                      <span className="block font-medium text-sm">{item.name}</span>
                      <span className={`block text-xs ${
                        isActive ? 'text-blue-100' : 'text-gray-400'
                      } transition-colors duration-200`}>
                        {item.description}
                      </span>
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                  
                  {/* Tooltip for collapsed sidebar */}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
            title={!isSidebarOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className="text-red-500" />
            {isSidebarOpen && (
              <span className="ml-3 font-medium">Logout</span>
            )}
            
            {/* Tooltip for collapsed sidebar */}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {/* Breadcrumb */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Dashboard</span>
              {location.pathname !== '/dashboard' && location.pathname !== '/' && (
                <>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">
                    {sidebarItems.find(item => location.pathname.startsWith(item.path) && item.path !== '/dashboard')?.name || 'Page'}
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* Outlet for nested routes */}
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;