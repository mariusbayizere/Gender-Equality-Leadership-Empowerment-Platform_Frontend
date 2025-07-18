
// import React, { useState, useEffect } from 'react';
// import { Users, Calendar, MessageSquare, UserCheck, BarChart3, TrendingUp,Activity,Bell,Settings,Search,Menu,X,Eye,UserPlus, CalendarPlus,FileText,Target,LogOut,ChevronLeft,User} from 'lucide-react';

// const AdminDashboard = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [userCount, setUserCount] = useState(0);
//   const [eventCount, setEventCount] = useState(0);
//   const [mentorshipCount, setMentorshipCount] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch user count, event count, and mentorship count from API
//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         setLoading(true);
//         // Get the auth token from localStorage or wherever you store it
//         const token = localStorage.getItem('authToken'); // Adjust based on your auth implementation
        
//         const headers = {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         };

//         // Fetch user count
//         const userResponse = await fetch('http://localhost:3000/api/v1/users/count', {
//           headers
//         });

//         // Fetch event count
//         const eventResponse = await fetch('http://localhost:3000/api/v1/events/count', {
//           headers
//         });

//         // Fetch mentorship count
//         const mentorshipResponse = await fetch('http://localhost:3000/api/v1/mentorship/count', {
//           headers
//         });

//         if (!userResponse.ok) {
//           throw new Error('Failed to fetch user count');
//         }

//         if (!eventResponse.ok) {
//           throw new Error('Failed to fetch event count');
//         }

//         if (!mentorshipResponse.ok) {
//           throw new Error('Failed to fetch mentorship count');
//         }

//         const userData = await userResponse.json();
//         const eventData = await eventResponse.json();
//         const mentorshipData = await mentorshipResponse.json();
        
//         setUserCount(userData.totalUsers || 0);
//         setEventCount(eventData.totalEvents || 0);
//         setMentorshipCount(mentorshipData.totalMentorshipRelationships || 0);
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching counts:', err);
//         // Fallback to hardcoded values on error
//         setUserCount(2847);
//         setEventCount(156);
//         setMentorshipCount(428);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCounts();
//   }, []);

//   const sidebarItems = [
//     { name: 'Dashboard', icon: BarChart3, active: true },
//     { name: 'Users', icon: Users },
//     { name: 'Events', icon: Calendar },
//     { name: 'Mentorship', icon: UserCheck },
//     { name: 'Reports', icon: FileText },
//     { name: 'Forum', icon: MessageSquare },
//     { name: 'Progress', icon: Target },
//   ];

//   const stats = [
//     { 
//       title: 'Total Users', 
//       value: loading ? 'Loading...' : (userCount || 0).toLocaleString(), 
//       change: '+12%', 
//       icon: Users,
//       color: 'bg-white',
//       iconColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
//       trend: 'up'
//     },
//     { 
//       title: 'Active Events', 
//       value: loading ? 'Loading...' : (eventCount || 0).toLocaleString(), 
//       change: '+8%', 
//       icon: Calendar, 
//       color: 'bg-white',
//       iconColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
//       trend: 'up'
//     },
//     { 
//       title: 'Mentorship Pairs', 
//       value: loading ? 'Loading...' : (mentorshipCount || 0).toLocaleString(), 
//       change: '+23%', 
//       icon: UserCheck, 
//       color: 'bg-white',
//       iconColor: 'bg-gradient-to-br from-violet-500 to-violet-600',
//       trend: 'up'
//     },
//     { 
//       title: 'Forum Posts', 
//       value: '1,234', 
//       change: '+15%', 
//       icon: MessageSquare, 
//       color: 'bg-white',
//       iconColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
//       trend: 'up'
//     },
//   ];

//   const recentActivities = [
//     { action: 'New user registration', user: 'Sarah Johnson', time: '2 mins ago', type: 'user' },
//     { action: 'Event created', user: 'Leadership Workshop', time: '15 mins ago', type: 'event' },
//     { action: 'Mentorship request', user: 'Maria Santos', time: '1 hour ago', type: 'mentorship' },
//     { action: 'Forum post published', user: 'Emily Chen', time: '2 hours ago', type: 'forum' },
//     { action: 'Progress milestone reached', user: 'Anna Wilson', time: '3 hours ago', type: 'progress' },
//   ];

//   const quickActions = [
//     { title: 'Add New User', icon: UserPlus, color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
//     { title: 'Create Event', icon: CalendarPlus, color: 'bg-green-50 hover:bg-green-100 text-green-700' },
//     { title: 'View Reports', icon: FileText, color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
//     { title: 'Monitor Progress', icon: Target, color: 'bg-red-50 hover:bg-red-100 text-red-700' },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50 font-outfit">
//       {/* Sidebar */}
//       <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h1 className={`font-bold text-xl text-gray-800 ${!isSidebarOpen && 'hidden'}`}>
//               GELEP Admin
//             </h1>
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
//             </button>
//           </div>
//         </div>
        
//         <nav className="mt-4 flex-1">
//           {sidebarItems.map((item, index) => (
//             <a
//               key={index}
//               href="#"
//               className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
//                 item.active 
//                   ? 'text-white' 
//                   : 'text-gray-600 hover:bg-gray-50'
//               }`}
//               style={item.active ? { backgroundColor: '#1E90FF' } : {}}
//             >
//               <item.icon size={20} />
//               {isSidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
//             </a>
//           ))}
//         </nav>
        
//         {/* Logout Button - Fixed at bottom */}
//         <div className="p-4 border-t border-gray-200 mt-auto">
//           <button className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//             <LogOut size={20} />
//             {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b border-gray-200">
//           <div className="flex items-center justify-between px-6 py-4">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
//               <p className="text-gray-600">Welcome back, Admin. Here's what's happening with GELEP today.</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
//                 <Bell size={20} />
//                 <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
//               </button>
//               <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
//                 <Settings size={20} />
//               </button>
//               <div className="flex items-center ml-4 pl-4 border-l border-gray-200">
//                 <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white mr-3">
//                   <User size={16} />
//                 </div>
//                 <div className="text-sm">
//                   <p className="font-medium text-gray-800">Admin John</p>
//                   <p className="text-gray-600">Super Admin</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Dashboard Content */}
//         <main className="p-6">
//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <p className="text-red-700 text-sm">Error loading data: {error}</p>
//             </div>
//           )}

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {stats.map((stat, index) => (
//               <div key={index} className={`${stat.color} p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105`}>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
//                     <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
//                     <p className="text-sm text-green-600 flex items-center mt-1">
//                       <TrendingUp size={16} className="mr-1" />
//                       {stat.change} from last month
//                     </p>
//                   </div>
//                   <div className={`p-3 rounded-full ${stat.iconColor} shadow-lg`}>
//                     <stat.icon size={24} className="text-white" />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Quick Actions */}
//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               {quickActions.map((action, index) => (
//                 <button
//                   key={index}
//                   className={`p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md hover:scale-105 ${action.color}`}
//                 >
//                   <action.icon size={24} className="mx-auto mb-2" />
//                   <p className="text-sm font-medium">{action.title}</p>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Recent Activity and Analytics */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Recent Activity */}
//             <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
//                 <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
//                   <Eye size={16} className="mr-1" />
//                   View All
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 {recentActivities.map((activity, index) => (
//                   <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-800">{activity.action}</p>
//                       <p className="text-xs text-gray-600">{activity.user}</p>
//                     </div>
//                     <span className="text-xs text-gray-500">{activity.time}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Platform Health */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Health</h3>
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-600">System Status</span>
//                   <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operational</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-600">Database</span>
//                   <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Healthy</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-600">Server Load</span>
//                   <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Moderate</span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-600">Active Sessions</span>
//                   <span className="text-sm font-medium text-gray-800">1,847</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* User Growth Chart Placeholder */}
//           <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth Analytics</h3>
//             <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
//               <div className="text-center">
//                 <BarChart3 size={48} className="mx-auto text-gray-400 mb-2" />
//                 <p className="text-gray-600">Chart visualization would be integrated here</p>
//                 <p className="text-sm text-gray-500">Showing user growth trends over time</p>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, UserCheck, BarChart3, TrendingUp,Activity,Bell,Settings,Search,Menu,X,Eye,UserPlus, CalendarPlus,FileText,Target,LogOut,ChevronLeft,User} from 'lucide-react';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [mentorshipCount, setMentorshipCount] = useState(0);
  const [forumCount, setForumCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user count, event count, mentorship count, and forum count from API
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        // Get the auth token from localStorage or wherever you store it
        const token = localStorage.getItem('authToken'); // Adjust based on your auth implementation
        
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch user count
        const userResponse = await fetch('http://localhost:3000/api/v1/users/count', {
          headers
        });

        // Fetch event count
        const eventResponse = await fetch('http://localhost:3000/api/v1/events/count', {
          headers
        });

        // Fetch mentorship count
        const mentorshipResponse = await fetch('http://localhost:3000/api/v1/mentorship/count', {
          headers
        });

        // Fetch forum count
        const forumResponse = await fetch('http://localhost:3000/api/v1/forums/count', {
          headers
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user count');
        }

        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event count');
        }

        if (!mentorshipResponse.ok) {
          throw new Error('Failed to fetch mentorship count');
        }

        if (!forumResponse.ok) {
          throw new Error('Failed to fetch forum count');
        }

        const userData = await userResponse.json();
        const eventData = await eventResponse.json();
        const mentorshipData = await mentorshipResponse.json();
        const forumData = await forumResponse.json();
        
        setUserCount(userData.totalUsers || 0);
        setEventCount(eventData.totalEvents || 0);
        setMentorshipCount(mentorshipData.totalMentorshipRelationships || 0);
        setForumCount(forumData.totalForumPosts || 0);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching counts:', err);
        // Fallback to hardcoded values on error
        setUserCount(2847);
        setEventCount(156);
        setMentorshipCount(428);
        setForumCount(1234);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const sidebarItems = [
    { name: 'Dashboard', icon: BarChart3, active: true },
    { name: 'Users', icon: Users },
    { name: 'Events', icon: Calendar },
    { name: 'Mentorship', icon: UserCheck },
    { name: 'Reports', icon: FileText },
    { name: 'Forum', icon: MessageSquare },
    { name: 'Progress', icon: Target },
  ];

  const stats = [
    { 
      title: 'Total Users', 
      value: loading ? 'Loading...' : (userCount || 0).toLocaleString(), 
      change: '+12%', 
      icon: Users,
      color: 'bg-white',
      iconColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: 'up'
    },
    { 
      title: 'Active Events', 
      value: loading ? 'Loading...' : (eventCount || 0).toLocaleString(), 
      change: '+8%', 
      icon: Calendar, 
      color: 'bg-white',
      iconColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      trend: 'up'
    },
    { 
      title: 'Mentorship Pairs', 
      value: loading ? 'Loading...' : (mentorshipCount || 0).toLocaleString(), 
      change: '+23%', 
      icon: UserCheck, 
      color: 'bg-white',
      iconColor: 'bg-gradient-to-br from-violet-500 to-violet-600',
      trend: 'up'
    },
    { 
      title: 'Forum Posts', 
      value: loading ? 'Loading...' : (forumCount || 0).toLocaleString(), 
      change: '+15%', 
      icon: MessageSquare, 
      color: 'bg-white',
      iconColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
      trend: 'up'
    },
  ];

  const recentActivities = [
    { action: 'New user registration', user: 'Sarah Johnson', time: '2 mins ago', type: 'user' },
    { action: 'Event created', user: 'Leadership Workshop', time: '15 mins ago', type: 'event' },
    { action: 'Mentorship request', user: 'Maria Santos', time: '1 hour ago', type: 'mentorship' },
    { action: 'Forum post published', user: 'Emily Chen', time: '2 hours ago', type: 'forum' },
    { action: 'Progress milestone reached', user: 'Anna Wilson', time: '3 hours ago', type: 'progress' },
  ];

  const quickActions = [
    { title: 'Add New User', icon: UserPlus, color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
    { title: 'Create Event', icon: CalendarPlus, color: 'bg-green-50 hover:bg-green-100 text-green-700' },
    { title: 'View Reports', icon: FileText, color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
    { title: 'Monitor Progress', icon: Target, color: 'bg-red-50 hover:bg-red-100 text-red-700' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-outfit">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl text-gray-800 ${!isSidebarOpen && 'hidden'}`}>
              GELEP Admin
            </h1>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        <nav className="mt-4 flex-1">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-colors ${
                item.active 
                  ? 'text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              style={item.active ? { backgroundColor: '#1E90FF' } : {}}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
            </a>
          ))}
        </nav>
        
        {/* Logout Button - Fixed at bottom */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
              <p className="text-gray-600">Welcome back, Admin. Here's what's happening with GELEP today.</p>
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
                  <User size={16} />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-800">Admin John</p>
                  <p className="text-gray-600">Super Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">Error loading data: {error}</p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className={`${stat.color} p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp size={16} className="mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.iconColor} shadow-lg`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`p-4 rounded-lg border border-gray-200 transition-all hover:shadow-md hover:scale-105 ${action.color}`}
                >
                  <action.icon size={24} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">{action.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  <Eye size={16} className="mr-1" />
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Health */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server Load</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Moderate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm font-medium text-gray-800">1,847</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Growth Chart Placeholder */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">User Growth Analytics</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Chart visualization would be integrated here</p>
                <p className="text-sm text-gray-500">Showing user growth trends over time</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;