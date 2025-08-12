import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Users, Calendar, MessageSquare, UserCheck, 
  TrendingUp, Activity, UserPlus, CalendarPlus, FileText, Target, 
  AlertTriangle, Server, Database, Cpu, Clock, XCircle, Eye,
  Briefcase, GraduationCap, HandHeart, MessageCircle, Award
} from 'lucide-react';
import UserGrowthAnalytics from './UserGrowthAnalytics';
import GELEPUserGrowthChart from './GELEPUserGrowthChart';

const DashboardMain = () => {
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [mentorshipCount, setMentorshipCount] = useState(0);
  const [forumCount, setForumCount] = useState(0);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState(null);

  // Fetch health data from backend
  const fetchHealthData = async () => {
    try {
      setHealthLoading(true);
      const response = await fetch('http://localhost:3000/health/detailed');
      if (!response.ok) throw new Error('Failed to fetch health data');
      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      setHealthData({
        status: 'Error',
        checks: {
          '✅ System Status': 'Unknown',
          '✅ Database Health': 'Unknown',
          '✅ Server Load': 'Unknown',
          '✅ Active Sessions': 'Unknown'
        },
        details: {
          timestamp: new Date().toISOString(),
          server: { status: 'Unknown', uptime: 0, memory: { used: 'N/A', total: 'N/A' } },
          database: { status: 'Unknown', connectionTime: null, collections: 0 },
          system: { loadAverage: 'N/A', freeMemory: 'N/A', totalMemory: 'N/A', cpuCount: 0 }
        }
      });
    } finally {
      setHealthLoading(false);
    }
  };

  // Fetch recent activities from API
  const fetchRecentActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication token not found');
      const response = await fetch('http://localhost:3000/activity/all?limit=10', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(`Failed to fetch activities: ${response.status}`);
      const data = await response.json();
      if (data.success && data.data) {
        setRecentActivities(data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setActivitiesError(err.message);
      setRecentActivities([
        { 
          activity_id: '1',
          title: 'System Monitoring Active',
          description: 'Unable to load recent activities from server',
          activity_type: 'system',
          timestamp: new Date().toISOString(),
          metadata: { entity_name: 'System' }
        }
      ]);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Get activity icon based on activity type
  const getActivityIcon = (activityType, entityType) => {
    switch (activityType) {
      case 'event_created':
      case 'event_updated':
        return Calendar;
      case 'job_applied':
      case 'job_created':
        return Briefcase;
      case 'mentorship_started':
      case 'mentorship_ended':
        return HandHeart;
      case 'forum_post':
      case 'forum_reply':
        return MessageCircle;
      case 'training_completed':
      case 'training_started':
        return GraduationCap;
      case 'achievement_earned':
        return Award;
      case 'user_registered':
        return Users;
      default:
        return Activity;
    }
  };

  // Get activity color based on type
  const getActivityColor = (activityType) => {
    switch (activityType) {
      case 'event_created':
      case 'event_updated':
        return 'bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'job_applied':
      case 'job_created':
        return 'bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
      case 'mentorship_started':
      case 'mentorship_ended':
        return 'bg-purple-100 dark:bg-purple-900 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200';
      case 'forum_post':
      case 'forum_reply':
        return 'bg-orange-100 dark:bg-orange-900 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200';
      case 'training_completed':
      case 'training_started':
        return 'bg-indigo-100 dark:bg-indigo-900 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200';
      case 'achievement_earned':
        return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'user_registered':
        return 'bg-emerald-100 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return activityTime.toLocaleDateString();
  };

  // Mark activity as read
  const markActivityAsRead = async (activityId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/activity/${activityId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setRecentActivities(prev => 
          prev.map(activity => 
            activity.activity_id === activityId 
              ? { ...activity, is_read: true }
              : activity
          )
        );
      }
    } catch (error) {
      // Ignore error
    }
  };

  // Fetch counts and health data
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        const [userResponse, eventResponse, mentorshipResponse, forumResponse] = await Promise.all([
          fetch('http://localhost:3000/api/v1/users/count', { headers }),
          fetch('http://localhost:3000/api/v1/events/count', { headers }),
          fetch('http://localhost:3000/api/v1/mentorship/count', { headers }),
          fetch('http://localhost:3000/api/v1/forums/count', { headers })
        ]);
        const userData = userResponse.ok ? await userResponse.json() : { totalUsers: 0 };
        const eventData = eventResponse.ok ? await eventResponse.json() : { totalEvents: 0 };
        const mentorshipData = mentorshipResponse.ok ? await mentorshipResponse.json() : { totalMentorshipRelationships: 0 };
        const forumData = forumResponse.ok ? await forumResponse.json() : { totalForumPosts: 0 };
        setUserCount(userData.totalUsers || 0);
        setEventCount(eventData.totalEvents || 0);
        setMentorshipCount(mentorshipData.totalMentorshipRelationships || 0);
        setForumCount(forumData.totalForumPosts || 0);
      } catch (err) {
        setError(err.message);
        setUserCount(2847);
        setEventCount(156);
        setMentorshipCount(428);
        setForumCount(1234);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
    fetchHealthData();
    fetchRecentActivities();

    const healthInterval = setInterval(fetchHealthData, 30000);
    const activitiesInterval = setInterval(fetchRecentActivities, 60000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(activitiesInterval);
    };
  }, []);

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    if (status === 'Online' || status === 'Connected' || status === 'Healthy' || status === 'Operational') {
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    } else if (status === 'Moderate' || status === 'Normal') {
      return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
    } else if (status === 'High' || status === 'Critical') {
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  };

  // Helper function to format uptime
  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const stats = [
    { 
      title: 'Total Users', 
      value: loading ? 'Loading...' : (userCount || 0).toLocaleString(), 
      change: `+${(userCount || 0).toLocaleString()}%`, 
      icon: Users,
      color: 'bg-white dark:bg-gray-800',
      iconColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: 'up'
    },
    { 
      title: 'Active Events', 
      value: loading ? 'Loading...' : (eventCount || 0).toLocaleString(), 
      change: `+${(eventCount || 0).toLocaleString()}%`,
      icon: Calendar, 
      color: 'bg-white dark:bg-gray-800',
      iconColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      trend: 'up'
    },
    { 
      title: 'Mentorship Pairs', 
      value: loading ? 'Loading...' : (mentorshipCount || 0).toLocaleString(), 
      change: `+${(mentorshipCount || 0).toLocaleString()}%`, 
      icon: UserCheck, 
      color: 'bg-white dark:bg-gray-800',
      iconColor: 'bg-gradient-to-br from-violet-500 to-violet-600',
      trend: 'up'
    },
    { 
      title: 'Forum Posts', 
      value: loading ? 'Loading...' : (forumCount || 0).toLocaleString(), 
      change: `+${(forumCount || 0).toLocaleString()}%`, 
      icon: MessageSquare, 
      color: 'bg-white dark:bg-gray-800',
      iconColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
      trend: 'up'
    },
  ];

  const quickActions = [
    { title: 'Add New User', icon: UserPlus, color: 'bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200' },
    { title: 'Create Event', icon: CalendarPlus, color: 'bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 text-green-700 dark:text-green-200' },
    { title: 'View Reports', icon: FileText, color: 'bg-purple-50 dark:bg-purple-900 hover:bg-purple-100 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-200' },
    { title: 'Monitor Progress', icon: Target, color: 'bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-700 dark:text-red-200' },
  ];

  return (
    <div className="w-full h-full overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="p-3 sm:p-4 lg:p-6 max-w-full">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-200 text-xs sm:text-sm">Error loading data: {error}</p>
          </div>
        )}

        {/* Activities Error Message */}
        {activitiesError && (
          <div className="mb-4 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center">
            <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-200 mr-2 flex-shrink-0" />
            <p className="text-yellow-700 dark:text-yellow-200 text-xs sm:text-sm">
              Activities Error: {activitiesError}
            </p>
          </div>
        )}

        {/* System Status Alert */}
        {healthData && healthData.status !== 'Healthy' && (
          <div className="mb-4 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center">
            <AlertTriangle size={16} className="text-yellow-600 dark:text-yellow-200 mr-2 flex-shrink-0" />
            <p className="text-yellow-700 dark:text-yellow-200 text-xs sm:text-sm">
              System Status: {healthData.status} - Some services may be experiencing issues
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.color} p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 truncate">{stat.title}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white truncate">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-green-600 dark:text-green-300 flex items-center mt-1">
                    <TrendingUp size={12} className="mr-1 flex-shrink-0 sm:w-3.5 sm:h-3.5" />
                    <span className="truncate">{stat.change} from last month</span>
                  </p>
                </div>
                <div className={`p-2 sm:p-2.5 lg:p-3 rounded-full ${stat.iconColor} shadow-lg flex-shrink-0 ml-2`}>
                  <stat.icon size={16} className="text-white sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:scale-105 ${action.color} text-center`}
              >
                <action.icon size={18} className="mx-auto mb-2 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                <p className="text-xs sm:text-sm font-medium leading-tight">{action.title}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity and System Health */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-white">
                Recent Activity
                {activitiesLoading && <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-2">(Loading...)</span>}
              </h3>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button 
                  onClick={fetchRecentActivities}
                  disabled={activitiesLoading}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs sm:text-sm font-medium flex items-center disabled:opacity-50"
                >
                  <Activity size={12} className="mr-1 sm:w-3.5 sm:h-3.5" />
                  Refresh
                </button>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs sm:text-sm font-medium flex items-center">
                  <Eye size={12} className="mr-1 sm:w-3.5 sm:h-3.5" />
                  View All
                </button>
              </div>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : recentActivities.length > 0 ? (
                <>
                  {(showAllActivities ? recentActivities : recentActivities.slice(0, 3)).map((activity, index) => {
                    const ActivityIcon = getActivityIcon(activity.activity_type, activity.entity_type);
                    return (
                      <div 
                        key={activity.activity_id || index} 
                        className={`flex items-start p-2 sm:p-3 lg:p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                          activity.is_read 
                            ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700' 
                            : getActivityColor(activity.activity_type)
                        }`}
                        onClick={() => !activity.is_read && markActivityAsRead(activity.activity_id)}
                      >
                        <div className="flex-shrink-0 mr-2 sm:mr-3">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-sm">
                            <ActivityIcon size={12} className="text-gray-600 dark:text-gray-300 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs sm:text-sm font-medium ${activity.is_read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'} truncate`}>
                                {activity.title}
                              </p>
                              <p className={`text-xs mt-1 ${activity.is_read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-600 dark:text-gray-200'} line-clamp-2`}>
                                {activity.description}
                              </p>
                              {activity.metadata?.entity_name && (
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium truncate">
                                  {activity.metadata.entity_name}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center ml-2 flex-shrink-0">
                              {!activity.is_read && (
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-1 sm:mr-2"></div>
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {formatTimeAgo(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {recentActivities.length > 3 && (
                    <div className="flex justify-center pt-3 sm:pt-4">
                      <button
                        onClick={() => setShowAllActivities(!showAllActivities)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs sm:text-sm font-medium flex items-center transition-colors duration-200"
                      >
                        {showAllActivities ? (
                          <>
                            <ChevronUp size={12} className="mr-1 sm:w-3.5 sm:h-3.5" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown size={12} className="mr-1 sm:w-3.5 sm:h-3.5" />
                            Show More ({recentActivities.length - 3} more)
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                  <Activity size={20} className="mx-auto mb-2 opacity-50 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                  <p className="text-xs sm:text-sm">No recent activities found</p>
                  <button 
                    onClick={fetchRecentActivities}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs sm:text-sm mt-2"
                  >
                    Try refreshing
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-white">Platform Health</h3>
              <button 
                onClick={fetchHealthData}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-xs sm:text-sm font-medium self-start sm:self-auto"
                disabled={healthLoading}
              >
                {healthLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            {healthLoading ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : healthData ? (
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate mr-2">System Status</span>
                  <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${getStatusColor(healthData.checks['✅ System Status'])}`}>
                    {healthData.checks['✅ System Status']}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate mr-2">Database</span>
                  <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${getStatusColor(healthData.checks['✅ Database Health'])}`}>
                    {healthData.checks['✅ Database Health']}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate mr-2">Server Load</span>
                  <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${getStatusColor(healthData.checks['✅ Server Load'])}`}>
                    {healthData.checks['✅ Server Load']}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate mr-2">Active Sessions</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 flex-shrink-0">
                    {healthData.checks['✅ Active Sessions']}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <XCircle size={20} className="mx-auto mb-2 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                <p className="text-xs sm:text-sm">Unable to load health data</p>
              </div>
            )}
          </div>
        </div>

        <GELEPUserGrowthChart/>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-8">
        <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
            <div className="mb-2 sm:mb-0">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                © 2025 <span className="font-semibold text-purple-600 dark:text-purple-400">GELEP</span> - Gender Equality Leadership Empowerment Platform
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span>Made with ❤️ for gender equality</span>
              <span>•</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardMain;



        {/* Detailed System Metrics */}
        {/* Server Metrics */}
        {/* {healthData && healthData.details && (
          <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <Server size={14} className="text-blue-600 mr-2 flex-shrink-0 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 truncate">Server Metrics</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">Uptime</span>
                  <span className="text-xs sm:text-sm font-medium text-right flex-shrink-0">
                    {formatUptime(healthData.details.server.uptime)}
                  </span>
                </div>
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">Memory Used</span>
                  <span className="text-xs sm:text-sm font-medium text-right flex-shrink-0">
                    {healthData.details.server.memory.used}
                  </span>
                </div>
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">Total Memory</span>
                  <span className="text-xs sm:text-sm font-medium text-right flex-shrink-0">
                    {healthData.details.server.memory.total}
                  </span>
                </div>
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">Status</span>
                  <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${getStatusColor(healthData.details.server.status)}`}>
                    {healthData.details.server.status}
                  </span>
                </div>
              </div>
            </div> */}

            {/* Database Metrics */}
            {/* <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <Database size={14} className="text-green-600 mr-2 flex-shrink-0 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 truncate">Database Metrics</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">Status</span>
                  <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${getStatusColor(healthData.details.database.status)}`}>
                    {healthData.details.database.status}
                  </span>
                </div>
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">Connection Time</span>
                  <span className="text-xs sm:text-sm font-medium text-right flex-shrink-0">
                    {healthData.details.database.connectionTime ? `${healthData.details.database.connectionTime}ms` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">Collections</span>
                  <span className="text-xs sm:text-sm font-medium text-right flex-shrink-0">
                    {healthData.details.database.collections}
                  </span>
                </div>
              </div>
            </div> */}

            {/* System Metrics */}
            {/* <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-3 sm:mb-4">
                <Cpu size={14} className="text-purple-600 mr-2 flex-shrink-0 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 truncate">System Metrics</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">Load Average</span>
                  <span className="text-xs sm:text-sm font-medium text-right flex-shrink-0">
                    {healthData.details.system.loadAverage}
                  </span>
                </div>
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">Free Memory</span>
                  <span className="text-xs sm:text-sm font-medium text-right flex-shrink-0">
                    {healthData.details.system.freeMemory}
                  </span>
                </div>
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-xs sm:text-sm text-gray-600 truncate pr-2">CPU Cores</span>
                  <span className="text-xs sm:text-sm font-medium text-right flex-shrink-0">
                    {healthData.details.system.cpuCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* <UserGrowthAnalytics/> */}