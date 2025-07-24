
//   import React, { useState, useEffect } from 'react';
//   import {  Bell, Settings, Search, User,} from 'lucide-react';


// export const Header = () =>{
//     return <>
//               <header className="bg-white shadow-sm border-b border-gray-200">
//             <div className="flex items-center justify-between px-6 py-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
//                 <p className="text-gray-600">Welcome back, Admin. Here's what's happening with GELEP today.</p>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
//                   <Bell size={20} />
//                   <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//                 </button>
//                 <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
//                   <Settings size={20} />
//                 </button>
//                 <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
//                   <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white mr-3">
//                     <User size={16} />
//                   </div>
//                   <div className="text-sm">
//                     <p className="font-medium text-gray-800">Admin John</p>
//                     <p className="text-gray-600">Super Admin</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </header>
//     </>
// }


import React, { useState, useEffect } from 'react';
import { Bell, Settings, Search, User } from 'lucide-react';

export const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Helper function to get user's initials
  const getUserInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-600">
            Welcome back, {loading ? 'Loading...' : user ? getFullName(user.firstName, user.lastName) : 'User'}. 
            Here's what's happening with GELEP today.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
            <Settings size={20} />
          </button>
          <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white mr-3">
              {loading ? (
                <User size={16} />
              ) : user ? (
                <span className="text-xs font-medium">
                  {getUserInitials(user.firstName, user.lastName)}
                </span>
              ) : (
                <User size={16} />
              )}
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
      </div>
    </header>
  );
};