import React, { useState, useEffect } from 'react';
import { Users, X,  Award, Calendar, Briefcase, MessageSquare, BookOpen, TrendingUp, UserCheck, Clock, CheckCircle, AlertTriangle, XCircle, Bell, Menu, Sun, Moon, User, Home, BarChart3, Settings, LogOut, Target, Network, GraduationCap, Building2, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JobBoard from '../JobBoardOpportunites/JobBoard'
import { EventsCalendar }from '../ProfessionalNetworking/EventsCalendar'
import  GELEPMentorshipPlat  from '../GELEPMentorship/GELEPMentorshipPlatform'
import LeadershipTrainingDevelopment from '../online_course/LeadershipTrainingDevelopment';
import GELEPPlatform from '../ProfessionalNetworking/GELEPPlatform';
import JobApplicationsPage from '../JobBoardOpportunites/JobApplicationsPage';
import LeadershipExam from '../online_course/LeadershipExam';

// Mock data for the dashboard (keeping stats and other data)
const mockData = {
  stats: {
    totalUsers: 12,
    activeMentorships: 8,
    upcomingEvents: 4,
    jobOpportunities: 6,
    completedTrainings: 9,
    forumPosts: 3
  },
  recentActivities: [
    { id: 1, type: 'mentorship', title: 'New mentorship request from Emily Davis', time: '2 hours ago', status: 'pending' },
    { id: 2, type: 'event', title: 'Leadership Workshop scheduled for next week', time: '5 hours ago', status: 'confirmed' },
    { id: 3, type: 'job', title: 'New job opportunity: Senior Manager at TechCorp', time: '1 day ago', status: 'active' },
    { id: 4, type: 'forum', title: 'Discussion: Breaking Glass Ceiling in Tech', time: '2 days ago', status: 'trending' },
    { id: 5, type: 'training', title: 'Completed: Advanced Leadership Skills', time: '3 days ago', status: 'completed' }
  ],
  upcomingEvents: [
    { id: 1, title: 'Women in Leadership Summit', date: '2025-08-15', type: 'networking', participants: 50 },
    { id: 2, title: 'Mentorship Skills Workshop', date: '2025-08-20', type: 'workshop', participants: 45 },
    { id: 3, title: 'Career Development Session', date: '2025-08-25', type: 'mentorship_session', participants: 30 }
  ],
  genderDistribution: {
    female: 14,
    male: 7,
    other: 3,
    prefer_not_to_say: 1
  },
  roleDistribution: {
    mentees: 1,
    mentors: 2,
    admins: 8
  }
};


const Header = ({ isCollapsed, setIsCollapsed, isDarkMode, setIsDarkMode, userData, isLoadingUser }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoginNotificationRead, setIsLoginNotificationRead] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'New Mentorship Request', message: 'Emily Davis wants to connect with you', type: 'mentorship', time: '2h ago', read: false },
    { id: 2, title: 'Event Reminder', message: 'Leadership Workshop starts in 2 days', type: 'event', time: '1d ago', read: false },
    { id: 3, title: 'Forum Activity', message: 'Your post received 15 new comments', type: 'forum', time: '3h ago', read: true }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
const totalUnreadCount = (isLoginNotificationRead ? 0 : 1) + (unreadCount || 0);

return (
  <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
    <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      {/* Left Section */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        
        {/* Logo and Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
            <span className="hidden xs:inline">GELEP Dashboard</span>
            <span className="xs:hidden">GELEP</span>
          </h1>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button 
            className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {/* Show notification badge only if there are unread notifications */}
            {totalUnreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                <span className="text-xs sm:text-xs">{totalUnreadCount > 9 ? '9+' : totalUnreadCount}</span>
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown - Responsive */}
          {showNotifications && (
            <>
              {/* Mobile/Tablet Full Screen Overlay */}
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowNotifications(false)} />
              
              {/* Notifications Panel */}
              <div className="absolute right-0 top-full mt-2 w-screen max-w-sm sm:max-w-md md:w-96 bg-white dark:bg-gray-800 rounded-none sm:rounded-lg shadow-xl border-l border-r md:border border-gray-200 dark:border-gray-700 z-50 max-h-[70vh] md:max-h-96 overflow-hidden">
                {/* Header */}
                <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <button 
                    className="md:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    onClick={() => setShowNotifications(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Notifications List */}
                <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                  {/* Hardcoded Login Success Notification */}
                  <div 
                    className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setIsLoginNotificationRead(true)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium break-words ${isLoginNotificationRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            Login Successful
                          </p>
                          {!isLoginNotificationRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                          You have successfully logged into GELEP Dashboard
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Just now</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Original notifications from your array */}
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium break-words ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">{notification.message}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show this only if there are no other notifications */}
                  {notifications.length === 0 && (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No additional notifications</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Dark Mode Toggle */}
        <button 
          className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button>
        
        {/* User Profile Section */}
        <div className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-700">
          {/* User Avatar */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          
          {/* User Info - Hidden only on very small screens */}
          <div className="text-xs sm:text-sm hidden sm:block min-w-0">
            {isLoadingUser ? (
              <div className="animate-pulse">
                <div className="h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 sm:w-24 mb-1"></div>
                <div className="h-2 sm:h-3 bg-gray-300 dark:bg-gray-600 rounded w-12 sm:w-16"></div>
              </div>
            ) : userData ? (
              <>
                <p className="font-medium text-gray-900 dark:text-white truncate max-w-[100px] sm:max-w-[150px]">
                  <span className="hidden sm:inline">{userData.firstName} {userData.lastName}</span>
                  <span className="sm:hidden">{userData.firstName}</span>
                </p>
                <p className="text-gray-500 dark:text-gray-400 capitalize truncate max-w-[100px] sm:max-w-[150px]">
                  {userData.userRole || userData.role}
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-gray-900 dark:text-white">User</p>
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </header>
);
}
const Sidebar = ({ isCollapsed, setIsCollapsed, activeTab, setActiveTab }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'GELEPMentorship', icon: Users, label: 'Mentorship' },
    { id: 'jobBoard' , icon: Briefcase, label: 'Job Opportunities'},
    { id : 'eventsCalendar', icon: Calendar, label: 'Events'},
    { id: 'leadershipTraining', icon: BookOpen, label: 'Training Courses' },
    { id: 'GELEPPlatform', icon: MessageSquare, label: 'Community Forums' },
    { id: 'applicationstatus', icon: BarChart3, label: 'Application Status' },
    { id: 'exam', icon: FileCheck, label: 'Take Exam' }
    // { id: 'exam', icon: User, label: 'Leadership Exam' }

  ];

  // Handle logout with API call
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        // If no token, just redirect to login
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
        // Successfully logged out
        console.log('Logout successful:', data.message);
        
        // Clear token from localStorage
        localStorage.removeItem('authToken');
        
        // Redirect to login page
        navigate('/login');
      } else {
        // Handle error response
        console.error('Logout failed:', data.error);
        
        // Even if logout failed, clear token and redirect
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if network error, clear token and redirect
      localStorage.removeItem('authToken');
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className={`
      ${isCollapsed ? 'w-20' : 'w-64'} 
      lg:relative absolute inset-y-0 left-0 z-50
      ${isCollapsed ? 'lg:translate-x-0' : 'lg:translate-x-0'}
      ${!isCollapsed ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'}
      bg-white dark:bg-gray-800 shadow-sm flex-shrink-0 flex flex-col transition-all duration-300
    `}>
      
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Menu className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
          {!isCollapsed && <span className="ml-2">Close</span>}
        </button>
      </div>
      
      <nav className="p-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className={`${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'} flex-shrink-0`} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 flex-shrink-0">
        <button 
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors ${
            isLoggingOut ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleLogout}
          disabled={isLoggingOut}
          title={isCollapsed ? (isLoggingOut ? 'Logging out...' : 'Logout') : ''}
        >
          <LogOut className={`${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'} flex-shrink-0 ${isLoggingOut ? 'animate-spin' : ''}`} />
          {!isCollapsed && (
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          )}
        </button>
      </div>
    </aside>
  );
};

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    purple: 'bg-purple-100 text-blue-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-blue-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-2">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-500 text-sm">{trendValue}</span>
        </div>
      )}
    </div>
  );
};

const OverviewTab = ({ data, userData, isLoadingUser }) => {
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            {isLoadingUser ? (
              <div className="animate-pulse">
                <div className="h-8 bg-blue-400 rounded w-48 mb-2"></div>
                <div className="h-4 bg-blue-400 rounded w-64"></div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold">
                  Welcome back, {userData?.firstName || 'User'}!
                </h2>
                <p className="text-blue-100 mt-1">Empowering women leaders, one connection at a time</p>
              </>
            )}
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Your Role</p>
            {isLoadingUser ? (
              <div className="animate-pulse">
                <div className="h-6 bg-blue-400 rounded w-16"></div>
              </div>
            ) : (
              <p className="text-xl font-bold capitalize">
                {userData?.userRole || userData?.role || 'User'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Platform followers" 
          value={data.stats.totalUsers.toLocaleString()} 
          icon={Users} 
          trend={true} 
          trendValue="+12% this month"
          color="blue"
        />
        <StatsCard 
          title="Active Mentorships" 
          value={data.stats.activeMentorships} 
          icon={UserCheck} 
          trend={true} 
          trendValue="+8 this week"
          color="blue"
        />
        <StatsCard 
          title="Upcoming Events" 
          value={data.stats.upcomingEvents} 
          icon={Calendar} 
          trend={false}
          color="green"
        />
        <StatsCard 
          title="Job Opportunities" 
          value={data.stats.jobOpportunities} 
          icon={Briefcase} 
          trend={true} 
          trendValue="+1 new today"
          color="orange"
        />
        <StatsCard 
          title="Training Completed" 
          value={data.stats.completedTrainings} 
          icon={GraduationCap} 
          trend={true} 
          trendValue="+2 this month"
          color="blue"
        />
        <StatsCard 
          title="Forum Discussions" 
          value={data.stats.forumPosts} 
          icon={MessageSquare} 
          trend={true} 
          trendValue="+2 today"
          color="indigo"
        />
      </div>

      {/* Recent Activities & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {data.recentActivities.map((activity) => {
              const getActivityIcon = (type) => {
                switch(type) {
                  case 'mentorship': return <Users className="h-4 w-4 text-blue-500" />;
                  case 'event': return <Calendar className="h-4 w-4 text-green-500" />;
                  case 'job': return <Briefcase className="h-4 w-4 text-blue-500" />;
                  case 'forum': return <MessageSquare className="h-4 w-4 text-orange-500" />;
                  case 'training': return <BookOpen className="h-4 w-4 text-blue-500" />;
                  default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
                }
              };

              const getStatusBadge = (status) => {
                const statusClasses = {
                  pending: 'bg-yellow-100 text-yellow-800',
                  confirmed: 'bg-green-100 text-green-800',
                  active: 'bg-blue-100 text-blue-800',
                  trending: 'bg-blue-100 text-blue-800',
                  completed: 'bg-gray-100 text-gray-800'
                };
                return (
                  <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[status]}`}>
                    {status}
                  </span>
                );
              };

              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {data.upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {event.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <Users className="h-4 w-4 ml-4 mr-2" />
                  <span>{event.participants} participants</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gender & Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gender Distribution</h3>
          <div className="space-y-3">
            {Object.entries(data.genderDistribution).map(([gender, percentage]) => (
              <div key={gender} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {gender.replace('_', ' ')}
                </span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Roles</h3>
          <div className="space-y-4">
            {Object.entries(data.roleDistribution).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">{role}</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

const GELEPDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);
  const navigate = useNavigate();

  // Fetch current user data
  const fetchUserData = async () => {
    try {
      setIsLoadingUser(true);
      setUserError(null);
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/v1/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUserData(data.user);
        console.log('User data fetched successfully:', data.user);
      } else {
        console.error('Failed to fetch user data:', data.error);
        setUserError(data.error || 'Failed to fetch user data');
        
        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserError('Network error occurred');
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // If there's a critical error, show error message
  if (userError && !userData) {
    return (
      <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Unable to Load User Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{userError}</p>
          <button 
            onClick={fetchUserData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
      <Header 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        userData={userData}
        isLoadingUser={isLoadingUser}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab 
                data={mockData} 
                userData={userData} 
                isLoadingUser={isLoadingUser} 
              />
            )}
            
            {activeTab === 'GELEPMentorship' && (
              <GELEPMentorshipPlat />
            )}
            
            {activeTab === 'jobBoard' && (
              <JobBoard />
            )}
            
            {activeTab === 'eventsCalendar' && (
              <EventsCalendar />
            )}
            
            {activeTab === 'leadershipTraining' && (
              <LeadershipTrainingDevelopment />
            )}
            
            {activeTab === 'GELEPPlatform' && (
              <GELEPPlatform />
            )}
            
            {activeTab === 'applicationstatus' && (
               <JobApplicationsPage/>
            )}
            
            {activeTab === 'exam' && (
              <LeadershipExam/>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GELEPDashboard;