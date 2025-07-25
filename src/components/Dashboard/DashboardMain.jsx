import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, ChevronUp, Users, Calendar, MessageSquare, UserCheck, 
  TrendingUp, Activity, UserPlus, CalendarPlus, FileText, Target, 
  AlertTriangle, Server, Database, Cpu, Clock, XCircle, Eye,
  Briefcase, GraduationCap, HandHeart, MessageCircle, Award
} from 'lucide-react';

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
  
  // New state for activities
  const [recentActivities, setRecentActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState(null);

  // Fetch health data from backend
  const fetchHealthData = async () => {
    try {
      setHealthLoading(true);
      const response = await fetch('http://localhost:3000/health/detailed');
      
      if (!response.ok) {
        throw new Error('Failed to fetch health data');
      }
      
      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      console.error('Error fetching health data:', err);
      // Set fallback data if API fails
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
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('http://localhost:3000/activity/all?limit=10', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setRecentActivities(data.data);
      } else {
        throw new Error('Invalid response format');
      } 
    } catch (err) {
      console.error('Error fetching recent activities:', err);
      setActivitiesError(err.message);
      
      // Fallback to sample data if API fails
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
        return 'bg-green-100 border-green-200 text-green-800';
      case 'job_applied':
      case 'job_created':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'mentorship_started':
      case 'mentorship_ended':
        return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'forum_post':
      case 'forum_reply':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'training_completed':
      case 'training_started':
        return 'bg-indigo-100 border-indigo-200 text-indigo-800';
      case 'achievement_earned':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'user_registered':
        return 'bg-emerald-100 border-emerald-200 text-emerald-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
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
      console.error('Error marking activity as read:', error);
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

        // Fetch all counts
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
        console.error('Error fetching counts:', err);
        // Fallback values
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
    
    // Set up interval to refresh health data every 30 seconds
    const healthInterval = setInterval(fetchHealthData, 30000);
    
    // Set up interval to refresh activities every 60 seconds
    const activitiesInterval = setInterval(fetchRecentActivities, 60000);
    
    return () => {
      clearInterval(healthInterval);
      clearInterval(activitiesInterval);
    };
  }, []);

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    if (status === 'Online' || status === 'Connected' || status === 'Healthy' || status === 'Operational') {
      return 'bg-green-100 text-green-800';
    } else if (status === 'Moderate' || status === 'Normal') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (status === 'High' || status === 'Critical') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
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

  const quickActions = [
    { title: 'Add New User', icon: UserPlus, color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
    { title: 'Create Event', icon: CalendarPlus, color: 'bg-green-50 hover:bg-green-100 text-green-700' },
    { title: 'View Reports', icon: FileText, color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
    { title: 'Monitor Progress', icon: Target, color: 'bg-red-50 hover:bg-red-100 text-red-700' },
  ];

  return (
    <main className="p-6">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">Error loading data: {error}</p>
        </div>
      )}

      {/* Activities Error Message */}
      {activitiesError && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
          <AlertTriangle size={20} className="text-yellow-600 mr-2" />
          <p className="text-yellow-700 text-sm">
            Activities Error: {activitiesError}
          </p>
        </div>
      )}

      {/* System Status Alert */}
      {healthData && healthData.status !== 'Healthy' && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
          <AlertTriangle size={20} className="text-yellow-600 mr-2" />
          <p className="text-yellow-700 text-sm">
            System Status: {healthData.status} - Some services may be experiencing issues
          </p>
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

      {/* Recent Activity and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Updated to use real API data */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Activity
              {activitiesLoading && <span className="text-sm text-gray-500 ml-2">(Loading...)</span>}
            </h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={fetchRecentActivities}
                disabled={activitiesLoading}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center disabled:opacity-50"
              >
                <Activity size={16} className="mr-1" />
                Refresh
              </button>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                <Eye size={16} className="mr-1" />
                View All
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentActivities.length > 0 ? (
              <>
                {(showAllActivities ? recentActivities : recentActivities.slice(0, 3)).map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.activity_type, activity.entity_type);
                  return (
                    <div 
                      key={activity.activity_id || index} 
                      className={`flex items-start p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                        activity.is_read ? 'bg-gray-50 border-gray-200' : getActivityColor(activity.activity_type)
                      }`}
                      onClick={() => !activity.is_read && markActivityAsRead(activity.activity_id)}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <ActivityIcon size={16} className="text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${activity.is_read ? 'text-gray-700' : 'text-gray-900'}`}>
                              {activity.title}
                            </p>
                            <p className={`text-xs mt-1 ${activity.is_read ? 'text-gray-500' : 'text-gray-600'}`}>
                              {activity.description}
                            </p>
                            {activity.metadata?.entity_name && (
                              <p className="text-xs text-blue-600 mt-1 font-medium">
                                {activity.metadata.entity_name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center ml-2">
                            {!activity.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            )}
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Show More/Show Less button */}
                {recentActivities.length > 4 && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => setShowAllActivities(!showAllActivities)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors duration-200"
                    >
                      {showAllActivities ? (
                        <>
                          <ChevronUp size={16} className="mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} className="mr-1" />
                          Show More ({recentActivities.length - 4} more)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity size={32} className="mx-auto mb-2 opacity-50" />
                <p>No recent activities found</p>
                <button 
                  onClick={fetchRecentActivities}
                  className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                >
                  Try refreshing
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Platform Health</h3>
            <button 
              onClick={fetchHealthData}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={healthLoading}
            >
              {healthLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {healthLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : healthData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Status</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(healthData.checks['✅ System Status'])}`}>
                  {healthData.checks['✅ System Status']}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(healthData.checks['✅ Database Health'])}`}>
                  {healthData.checks['✅ Database Health']}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Server Load</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(healthData.checks['✅ Server Load'])}`}>
                  {healthData.checks['✅ Server Load']}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <span className="text-sm font-medium text-gray-800">
                  {healthData.checks['✅ Active Sessions']}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <XCircle size={32} className="mx-auto mb-2" />
              <p>Unable to load health data</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed System Metrics */}
      {healthData && healthData.details && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Server Metrics */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Server size={20} className="text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Server Metrics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="text-sm font-medium">{formatUptime(healthData.details.server.uptime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Memory Used</span>
                <span className="text-sm font-medium">{healthData.details.server.memory.used}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Memory Total</span>
                <span className="text-sm font-medium">{healthData.details.server.memory.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(healthData.details.server.status)}`}>
                  {healthData.details.server.status}
                </span>
              </div>
            </div>
          </div>

          {/* Database Metrics */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Database size={20} className="text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Database Metrics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Connection Time</span>
                <span className="text-sm font-medium">
                  {healthData.details.database.connectionTime ? 
                    `${healthData.details.database.connectionTime}ms` : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Collections</span>
                <span className="text-sm font-medium">{healthData.details.database.collections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(healthData.details.database.status)}`}>
                  {healthData.details.database.status}
                </span>
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <Cpu size={20} className="text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">System Metrics</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Load Average</span>
                <span className="text-sm font-medium">{healthData.details.system.loadAverage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Free Memory</span>
                <span className="text-sm font-medium">{healthData.details.system.freeMemory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Memory</span>
                <span className="text-sm font-medium">{healthData.details.system.totalMemory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">CPU Count</span>
                <span className="text-sm font-medium">{healthData.details.system.cpuCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Updated Info */}
      {healthData && healthData.details && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <Clock size={14} className="mr-1" />
            Last updated: {new Date(healthData.details.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </main>
  );
};

export default DashboardMain;