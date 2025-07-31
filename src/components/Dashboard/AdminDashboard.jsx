  import React, { useState, useEffect } from 'react';
  import { ChevronDown,ChevronUp,
    Users, Calendar, MessageSquare, UserCheck, BarChart3, TrendingUp, Activity, Bell, Settings, 
    Search, Menu, Eye, UserPlus, CalendarPlus, FileText, Target, LogOut, ChevronLeft, User,
    Server, Database, Cpu, HardDrive, Clock, Zap, AlertTriangle, CheckCircle, XCircle,
    Briefcase, GraduationCap, HandHeart, MessageCircle, Award
  } from 'lucide-react';
  // import UserGrowthAnalytics from './UserGrowthAnalytics'
  import { Header } from './header'
  import { SliderBar  } from './sliderBar'
  import DashboardMain from './DashboardMain'

  const AdminDashboard = () => {
    const [showAllActivities, setShowAllActivities] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
        
        // const response = await fetch('http://localhost:3000/activity/recent?limit=10', {
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
          // Update the activity in the state
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

    return (
      <div className="flex h-screen bg-gray-50 font-outfit">
        {/* Sidebar */}
        <SliderBar/>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <Header/>


  {/* Main Dashboard Content */}

            <DashboardMain/>


        </div>
      </div>
    );
  };

  export default AdminDashboard;
                                                                                                                                                          