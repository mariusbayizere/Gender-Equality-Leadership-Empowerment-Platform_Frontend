import React, { useState, useEffect } from 'react';
import { Users, Award, Calendar, Briefcase, MessageSquare, BookOpen, TrendingUp, UserCheck, Clock, CheckCircle, AlertTriangle, XCircle, Bell, Menu, Sun, Moon, User, Home, BarChart3, Settings, LogOut, Target, Network, GraduationCap, Building2 } from 'lucide-react';
import JobBoard from '../JobBoardOpportunites/JobBoard'
import { EventsCalendar }from '../ProfessionalNetworking/EventsCalendar'
import  GELEPMentorshipPlat  from '../GELEPMentorship/GELEPMentorshipPlatform'
import LeadershipTrainingDevelopment from '../online_course/LeadershipTrainingDevelopment';
import GELEPPlatform from '../ProfessionalNetworking/GELEPPlatform';

// eventsCalendar




// Mock data for the dashboard
const mockData = {
  userData: {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@gelep.org",
    userRole: "mentor",
    gender: "female"
  },
  stats: {
    totalUsers: 28,
    activeMentorships: 14,
    upcomingEvents: 8,
    jobOpportunities: 13,
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
    { id: 1, title: 'Women in Leadership Summit', date: '2025-08-15', type: 'networking', participants: 250 },
    { id: 2, title: 'Mentorship Skills Workshop', date: '2025-08-20', type: 'workshop', participants: 45 },
    { id: 3, title: 'Career Development Session', date: '2025-08-25', type: 'mentorship_session', participants: 30 }
  ],
  genderDistribution: {
    female: 68,
    male: 28,
    other: 3,
    prefer_not_to_say: 1
  },
  roleDistribution: {
    mentees: 1520,
    mentors: 985,
    admins: 342
  }
};

const Header = ({ isCollapsed, setIsCollapsed, isDarkMode, setIsDarkMode, userData }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'New Mentorship Request', message: 'Emily Davis wants to connect with you', type: 'mentorship', time: '2h ago', read: false },
    { id: 2, title: 'Event Reminder', message: 'Leadership Workshop starts in 2 days', type: 'event', time: '1d ago', read: false },
    { id: 3, title: 'Forum Activity', message: 'Your post received 15 new comments', type: 'forum', time: '3h ago', read: true }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button 
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-600 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">GELEP Dashboard</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">{userData.firstName} {userData.lastName}</p>
              <p className="text-gray-500 dark:text-gray-400 capitalize">{userData.userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    // { id: 'mentorship', icon: Users, label: 'Mentorship' },
    // { id: 'events', icon: Calendar, label: 'Events' },
    // { id: 'jobs', icon: Briefcase, label: 'Job Opportunities' },
    // { id: 'training', icon: BookOpen, label: 'Training Courses' },
    // { id: 'forums', icon: MessageSquare, label: 'Community Forums' },

    { id: 'GELEPMentorship', icon: Users, label: 'Mentorship' },
    { id: 'jobBoard' , icon: Briefcase, label: 'Job Opportunities'},
    { id : 'eventsCalendar', icon: Calendar, label: 'Events'},
    { id: 'leadershipTraining', icon: BookOpen, label: 'Training Courses' },
    { id: 'GELEPPlatform', icon: MessageSquare, label: 'Community Forums' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'profile', icon: User, label: 'My Profile' }
  ];

  const handleLogout = () => {
    // Simulate logout
    alert('Logging out...');
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
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg`}
          onClick={handleLogout}
        >
          <LogOut className={`${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'} flex-shrink-0`} />
          {!isCollapsed && <span>Logout</span>}
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

const OverviewTab = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {data.userData.firstName}!</h2>
            <p className="text-blue-100 mt-1">Empowering women leaders, one connection at a time</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Your Role</p>
            <p className="text-xl font-bold capitalize">{data.userData.userRole}</p>
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
          trendValue="+5 new today"
          color="orange"
        />
        <StatsCard 
          title="Training Completed" 
          value={data.stats.completedTrainings} 
          icon={GraduationCap} 
          trend={true} 
          trendValue="+15 this month"
          color="blue"
        />
        <StatsCard 
          title="Forum Discussions" 
          value={data.stats.forumPosts} 
          icon={MessageSquare} 
          trend={true} 
          trendValue="+23 today"
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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="w-screen h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden flex flex-col">
      <Header 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        userData={mockData.userData}
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
            {activeTab === 'overview' && <OverviewTab data={mockData} />}
            
            {activeTab === 'GELEPMentorship' && (
              <div className="text-center py-20">
                <GELEPMentorshipPlat/>
                {/* <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mentorship Hub</h2>
                <p className="text-gray-600 dark:text-gray-400">Connect with mentors and mentees, manage relationships</p> */}
              </div>
            )}
            
            {/* {activeTab === 'events' && (
              <div className="text-center py-20">
                <Calendar className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Events & Workshops</h2>
                <p className="text-gray-600 dark:text-gray-400">Discover and manage leadership development events</p>
              </div>
            )}
             */}
            

       {activeTab === 'eventsCalendar' && (
              <div className="text-center py-20">
                <EventsCalendar/>
                {/* <Calendar className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Events & Workshops</h2>
                <p className="text-gray-600 dark:text-gray-400">Discover and manage leadership development events</p> */}
              </div>
            )}
                    



        {activeTab === 'jobBoard' && (
            <div className="text-center py-20">
                {/* <Briefcase className="h-16 w-16 text-blue-500 mx-auto mb-4" /> */}
                <JobBoard/>
                {/* <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Opportunities</h2>
                <p className="text-gray-600 dark:text-gray-400">Explore leadership positions and career opportunities</p> */}
              </div>
            )}     

            {/* {activeTab === 'jobs' && (
              <div className="text-center py-20">
                <Briefcase className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Opportunities</h2>
                <p className="text-gray-600 dark:text-gray-400">Explore leadership positions and career opportunities</p>
              </div>
            )} */}

            {activeTab === 'leadershipTraining' && (
              <div className="text-center py-20">
                {/* <BookOpen className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Training Courses</h2>
                <p className="text-gray-600 dark:text-gray-400">Access leadership development courses and certifications</p> */}
                <LeadershipTrainingDevelopment/>
              </div>
            )}
            
            {activeTab === 'GELEPPlatform' && (
              <div className="text-center py-20">
                {/* <MessageSquare className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Community Forums</h2>
                <p className="text-gray-600 dark:text-gray-400">Engage in discussions about leadership and career growth</p> */}
              <GELEPPlatform/>
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="text-center py-20">
                <BarChart3 className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics & Insights</h2>
                <p className="text-gray-600 dark:text-gray-400">Track progress and platform engagement metrics</p>
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="text-center py-20">
                <User className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your profile and account settings</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GELEPDashboard;