import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, Heart, MessageSquare, Calendar, Search, Filter, UserPlus, CheckCircle, XCircle, Clock, Star, BookOpen, Award, TrendingUp, Send, Target, Plus, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import ProfessionalChat from './MentorshipChat';

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1/mentorship';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

// Enhanced API Helper with caching
const apiCall = async (endpoint, options = {}) => {
  const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  
  // Return cached data if it's still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Cache successful GET requests only
    if (!options.method || options.method === 'GET') {
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Clear cache function
const clearCache = (pattern = null) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};

const MentorshipDashboard = () => {
  const [chatMentorship, setChatMentorship] = useState(null);
  
  // State Management
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('discover');
  const [mentors, setMentors] = useState([]);
  const [matchedMentors, setMatchedMentors] = useState([]);
  const [myMentorships, setMyMentorships] = useState([]);
  const [menteeRequests, setMenteeRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState({});
  const [error, setError] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [fieldFilter, setFieldFilter] = useState('');
  const [analytics, setAnalytics] = useState({});
  
  // Chat State
  const [selectedMentorship, setSelectedMentorship] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  // Progress Tracking State
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalData, setGoalData] = useState({
    goal_title: '',
    goal_description: '',
    target_date: '',
    goal_category: 'general'
  });
  const [mentorshipGoals, setMentorshipGoals] = useState([]);

  // Track loaded tabs to avoid unnecessary API calls
  const [loadedTabs, setLoadedTabs] = useState(new Set());

  // Memoized filtered mentors to avoid unnecessary filtering
  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const matchesSearch = !searchFilter ||
        `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(searchFilter.toLowerCase()) ||
        mentor.field.toLowerCase().includes(searchFilter.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesField = !fieldFilter || mentor.field === fieldFilter;
      return matchesSearch && matchesField;
    });
  }, [mentors, searchFilter, fieldFilter]);

  // Memoized unique fields
  const uniqueFields = useMemo(() => {
    return [...new Set(mentors.map(mentor => mentor.field))];
  }, [mentors]);

  // Enhanced fetch functions with better error handling and caching
  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await fetch('http://localhost:3000/api/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      return data.user;
    } catch (err) {
      console.error('Error fetching user:', err);
      return null;
    }
  }, []);

  const fetchAvailableMentors = useCallback(async () => {
    if (loadedTabs.has('mentors')) return;
    
    try {
      const response = await apiCall('/available-mentors');
      setMentors(response.mentors || []);
      setLoadedTabs(prev => new Set([...prev, 'mentors']));
    } catch (error) {
      setError('Failed to load mentors');
    }
  }, [loadedTabs]);

  const fetchMatchedMentors = useCallback(async () => {
    if (loadedTabs.has('matched')) return;
    
    setTabLoading(prev => ({ ...prev, matched: true }));
    try {
      const response = await apiCall('/matching-algorithm');
      setMatchedMentors(response.matches || []);
      setLoadedTabs(prev => new Set([...prev, 'matched']));
    } catch (error) {
      setError('Failed to load matched mentors');
    } finally {
      setTabLoading(prev => ({ ...prev, matched: false }));
    }
  }, [loadedTabs]);

  const fetchMyMentorships = useCallback(async () => {
    if (loadedTabs.has('mentorships')) return;
    
    try {
      const response = await apiCall('/my-mentorships');
      setMyMentorships(response.mentorships || []);
      setLoadedTabs(prev => new Set([...prev, 'mentorships']));
    } catch (error) {
      setError('Failed to load mentorships');
    }
  }, [loadedTabs]);

  const fetchMenteeRequests = useCallback(async () => {
    if (loadedTabs.has('requests')) return;
    
    try {
      const response = await apiCall('/mentee-requests');
      setMenteeRequests(response.menteeRequests || []);
      setLoadedTabs(prev => new Set([...prev, 'requests']));
    } catch (error) {
      setError('Failed to load mentee requests');
    }
  }, [loadedTabs]);

  const fetchAnalytics = useCallback(async () => {
    if (loadedTabs.has('analytics')) return;
    
    try {
      const response = await apiCall('/analytics');
      setAnalytics(response.analytics || {});
      setLoadedTabs(prev => new Set([...prev, 'analytics']));
    } catch (error) {
      setError('Failed to load analytics');
    }
  }, [loadedTabs]);

  const fetchMessages = useCallback(async (mentorshipId) => {
    try {
      const response = await apiCall(`/messages/${mentorshipId}`);
      setChatMessages(response.messages || []);
    } catch (error) {
      setError('Failed to load messages');
    }
  }, []);

  const fetchGoals = useCallback(async (mentorshipId) => {
    try {
      const response = await apiCall(`/goals/${mentorshipId}`);
      setMentorshipGoals(response.goals || []);
    } catch (error) {
      setError('Failed to load goals');
    }
  }, []);

  // Optimized initial data loading
  const loadInitialData = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Load only essential data first, other tabs will load on demand
      if (currentUser.userRole === 'mentee') {
        setActiveTab('discover');
        await fetchAvailableMentors();
      } else if (currentUser.userRole === 'mentor') {
        setActiveTab('requests');
        await fetchMenteeRequests();
      }
      
      // Load mentorships in parallel as it's commonly accessed
      await fetchMyMentorships();
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [currentUser, fetchAvailableMentors, fetchMenteeRequests, fetchMyMentorships]);

  // Lazy load data when switching tabs
  const handleTabChange = useCallback(async (tabName) => {
    setActiveTab(tabName);
    
    // Load data only when needed
    switch (tabName) {
      case 'matched':
        if (!loadedTabs.has('matched')) {
          await fetchMatchedMentors();
        }
        break;
      case 'analytics':
        if (!loadedTabs.has('analytics')) {
          await fetchAnalytics();
        }
        break;
      default:
        break;
    }
  }, [loadedTabs, fetchMatchedMentors, fetchAnalytics]);

  // Fetch current user on mount
  useEffect(() => {
    const initializeUser = async () => {
      const user = await fetchCurrentUser();
      setCurrentUser(user);
    };
    initializeUser();
  }, [fetchCurrentUser]);

  // Load initial data when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      loadInitialData();
    }
  }, [currentUser, loadInitialData]);

  // Optimized action functions with cache invalidation
  const handleSelectMentor = async (mentorId, message) => {
    setLoading(true);
    try {
      await apiCall('/select-mentor', {
        method: 'POST',
        body: JSON.stringify({
          mentor_id: mentorId,
          message: message
        })
      });
      
      // Clear mentorships cache and reload
      clearCache('my-mentorships');
      setLoadedTabs(prev => {
        const newSet = new Set(prev);
        newSet.delete('mentorships');
        return newSet;
      });
      
      await fetchMyMentorships();
      setActiveTab('my-mentorships');
      setError('');
    } catch (error) {
      setError('Failed to send mentorship request');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setLoading(true);
    try {
      await apiCall('/accept-request', {
        method: 'POST',
        body: JSON.stringify({ request_id: requestId })
      });
      
      // Clear relevant caches
      clearCache('mentee-requests');
      clearCache('my-mentorships');
      setLoadedTabs(prev => {
        const newSet = new Set(prev);
        newSet.delete('requests');
        newSet.delete('mentorships');
        return newSet;
      });
      
      await Promise.all([fetchMenteeRequests(), fetchMyMentorships()]);
      setError('');
    } catch (error) {
      setError('Failed to accept request');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId, reason) => {
    setLoading(true);
    try {
      await apiCall('/reject-request', {
        method: 'POST',
        body: JSON.stringify({
          request_id: requestId,
          rejection_reason: reason
        })
      });
      
      // Clear requests cache
      clearCache('mentee-requests');
      setLoadedTabs(prev => {
        const newSet = new Set(prev);
        newSet.delete('requests');
        return newSet;
      });
      
      await fetchMenteeRequests();
      setError('');
    } catch (error) {
      setError('Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedMentorship) return;
    try {
      await apiCall('/send-message', {
        method: 'POST',
        body: JSON.stringify({
          mentorship_id: selectedMentorship.id,
          message_content: newMessage,
          message_type: 'text'
        })
      });
      setNewMessage('');
      
      // Clear messages cache and reload
      clearCache(`messages/${selectedMentorship.id}`);
      await fetchMessages(selectedMentorship.id);
    } catch (error) {
      setError('Failed to send message');
    }
  };

  const handleCreateGoal = async () => {
    if (!goalData.goal_title.trim()) return;
    try {
      await apiCall('/create-goal', {
        method: 'POST',
        body: JSON.stringify({
          mentorship_id: selectedMentorship.id,
          ...goalData
        })
      });
      setGoalData({
        goal_title: '',
        goal_description: '',
        target_date: '',
        goal_category: 'general'
      });
      setShowGoalForm(false);
      
      // Clear goals cache and reload
      clearCache(`goals/${selectedMentorship.id}`);
      await fetchGoals(selectedMentorship.id);
    } catch (error) {
      setError('Error creating goal');
    }
  };

  const handleUpdateGoal = async (goalId, updateData) => {
    try {
      await apiCall(`/update-goal/${goalId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      // Clear goals cache and reload
      clearCache(`goals/${selectedMentorship.id}`);
      await fetchGoals(selectedMentorship.id);
    } catch (error) {
      setError('Error updating goal');
    }
  };

  // Refresh function to clear all caches and reload
  const handleRefresh = useCallback(() => {
    clearCache();
    setLoadedTabs(new Set());
    loadInitialData();
  }, [loadInitialData]);



// const MentorCard = ({ mentor, isMatched = false, matchData = null }) => {
//   const [showRequestForm, setShowRequestForm] = useState(false);
//   const [requestMessage, setRequestMessage] = useState('');
  
//   // Simple display of userRole since backend now provides it
//   const displayRole = mentor.userRole || 'Mentors';
  
//   return (
//     <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
//       <div className="p-6">
//         <div className="flex items-start justify-between">
//           <div className="flex-1">
//             <div className="flex items-center space-x-3 mb-3">
//               <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
//                 {mentor.firstName?.[0]}{mentor.lastName?.[0]}
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   {mentor.firstName} {mentor.lastName}
//                 </h3>
//                 {/* Fixed: Using direct userRole field */}
//                 <p className="text-sm text-gray-600 capitalize">
//                   {displayRole}
//                 </p>
//               </div>
//             </div>
//             <div className="space-y-2 mb-4">
//               <div className="flex items-center text-sm text-gray-600">
//                 <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
//                 {mentor.field || 'Field not specified'}
//               </div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <Award className="w-4 h-4 mr-2 text-blue-500" />
//                 {mentor.yearsOfExperience || mentor.years_of_experience || 0} years experience
//               </div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <Star className="w-4 h-4 mr-2 text-blue-500" />
//                 {mentor.specialization || 'Specialization not specified'}
//               </div>
//             </div>
//             {isMatched && matchData && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm font-medium text-green-800">
//                     {matchData.compatibility} Match
//                   </span>
//                   <span className="text-sm text-green-600">
//                     {matchData.matchScore}% compatibility
//                   </span>
//                 </div>
//                 <p className="text-xs text-green-700">
//                   {matchData.matchReasons?.join(', ')}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//         {!showRequestForm ? (
//           <button
//             onClick={() => setShowRequestForm(true)}
//             className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
//           >
//             <UserPlus className="w-4 h-4" />
//             <span>Request Mentorship</span>
//           </button>
//         ) : (
//           <div className="space-y-3">
//             <textarea
//               placeholder="Write a message to introduce yourself and explain why you'd like this mentor..."
//               value={requestMessage}
//               onChange={(e) => setRequestMessage(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//               rows={3}
//             />
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => {
//                   handleSelectMentor(mentor.id, requestMessage);
//                   setShowRequestForm(false);
//                   setRequestMessage('');
//                 }}
//                 disabled={loading || !requestMessage.trim()}
//                 className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Send Request
//               </button>
//               <button
//                 onClick={() => {
//                   setShowRequestForm(false);
//                   setRequestMessage('');
//                 }}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


const MentorCard = ({ mentor, isMatched = false, matchData = null }) => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  
  // Simple display of userRole since backend now provides it
  const displayRole = mentor.userRole || 'Mentors';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 w-full max-w-full">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-3 space-y-3 sm:space-y-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg sm:text-xl mx-auto sm:mx-0 flex-shrink-0">
                {mentor.firstName?.[0]}{mentor.lastName?.[0]}
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                  {mentor.firstName} {mentor.lastName}
                </h3>
                {/* Fixed: Using direct userRole field */}
                <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                  {displayRole}
                </p>
              </div>
            </div>
            
            {/* Info Grid - Responsive layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-3 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <BookOpen className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate">{mentor.field || 'Field not specified'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Award className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate">{mentor.yearsOfExperience || mentor.years_of_experience || 0} years experience</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <Star className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                <span className="truncate">{mentor.specialization || 'Specialization not specified'}</span>
              </div>
            </div>
            
            {/* Match Info */}
            {isMatched && matchData && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    {matchData.compatibility} Match
                  </span>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    {matchData.matchScore}% compatibility
                  </span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300 break-words">
                  {matchData.matchReasons?.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        {!showRequestForm ? (
          <button
            onClick={() => setShowRequestForm(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-600 dark:from-blue-500 dark:to-blue-600 text-white py-3 sm:py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Request Mentorship</span>
          </button>
        ) : (
          <div className="space-y-3">
            <textarea
              placeholder="Write a message to introduce yourself and explain why you'd like this mentor..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none text-sm"
              rows={4}
            />
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => {
                  handleSelectMentor(mentor.id, requestMessage);
                  setShowRequestForm(false);
                  setRequestMessage('');
                }}
                disabled={loading || !requestMessage.trim()}
                className="flex-1 bg-blue-600 dark:bg-blue-500 text-white py-3 sm:py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
              >
                Send Request
              </button>
              <button
                onClick={() => {
                  setShowRequestForm(false);
                  setRequestMessage('');
                }}
                className="px-4 py-3 sm:py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


  const MentorshipCard = ({ mentorship }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  const partnerDetails = currentUser.userRole === 'mentor' ? mentorship.mentee_details : mentorship.mentor_details;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 w-full max-w-none">
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
              {partnerDetails?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                {partnerDetails?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{partnerDetails?.field}</p>
            </div>
          </div>
          <div className="flex justify-start sm:justify-end">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mentorship.program_status)} flex-shrink-0`}>
              {mentorship.program_status?.charAt(0).toUpperCase() + mentorship.program_status?.slice(1)}
            </span>
          </div>
        </div>

        {/* Date and Criteria Info */}
        <div className="space-y-2 mb-4">
          {mentorship.start_date && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <span className="truncate">Started: {formatDate(mentorship.start_date)}</span>
            </div>
          )}
          {mentorship.request_date && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
              <span className="truncate">Requested: {formatDate(mentorship.request_date)}</span>
            </div>
          )}
          {mentorship.matching_criteria && (
            <div className="text-xs text-gray-500 dark:text-gray-400 break-words">
              {mentorship.matching_criteria}
            </div>
          )}
        </div>

        {/* Selection Message */}
        {mentorship.selection_message && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
              <span className="font-medium">Message:</span> "{mentorship.selection_message}"
            </p>
          </div>
        )}

        {/* Active Status Buttons */}
        {mentorship.program_status === 'active' && (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setChatMentorship(mentorship)}
              className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-2.5 sm:py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
            {chatMentorship && (
              <ProfessionalChat
                mentorshipId={chatMentorship.id}
                currentUser={currentUser}
                partnerName={
                  currentUser.userRole === 'mentor'
                    ? chatMentorship.mentee_details?.name
                    : chatMentorship.mentor_details?.name
                }
                onClose={() => setChatMentorship(null)}
              />
            )}
            <button
              onClick={() => {
                setSelectedMentorship(mentorship);
                fetchGoals(mentorship.id);
              }}
              className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-2.5 sm:py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base font-medium"
            >
              <Target className="w-4 h-4" />
              <span>Goals</span>
            </button>
          </div>
        )}

        {/* Pending Status Message */}
        {mentorship.program_status === 'pending' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
              Waiting for {currentUser.userRole === 'mentor' ? 'your' : 'mentor'} approval...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};



  const MenteeRequestCard = ({ request }) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 w-full max-w-none">
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base flex-shrink-0">
              {request.firstName?.[0]}{request.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                {request.firstName} {request.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{request.field}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{request.email}</p>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 self-start sm:self-auto flex-shrink-0">
            {new Date(request.requestDate).toLocaleDateString()}
          </div>
        </div>

        {/* Message Section */}
        {request.requestMessage && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
              <span className="font-medium">Message:</span> "{request.requestMessage}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {!showRejectForm ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleAcceptRequest(request.requestId)}
              disabled={loading}
              className="flex-1 bg-green-600 dark:bg-green-700 text-white py-2.5 sm:py-2 px-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Accept</span>
            </button>
            <button
              onClick={() => setShowRejectForm(true)}
              className="flex-1 bg-red-600 dark:bg-red-700 text-white py-2.5 sm:py-2 px-4 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base font-medium"
            >
              <XCircle className="w-4 h-4" />
              <span>Decline</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              placeholder="Optional: Provide a reason for declining..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
              rows={2}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  handleRejectRequest(request.requestId, rejectionReason);
                  setShowRejectForm(false);
                  setRejectionReason('');
                }}
                className="flex-1 bg-red-600 dark:bg-red-700 text-white py-2.5 sm:py-2 px-4 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors text-sm sm:text-base font-medium"
              >
                Confirm Decline
              </button>
              <button
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2.5 sm:py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm sm:text-base font-medium border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

  const ChatModal = () => {
    if (!showChat || !selectedMentorship) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl h-96 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Chat with {currentUser.userRole === 'mentor' ? selectedMentorship.mentee_details?.name : selectedMentorship.mentor_details?.name}
            </h3>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.map(message => (
              <div key={message.id} className={`flex ${message.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_id === currentUser.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}>
                  <p className="text-sm">{message.message_content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 flex space-x-2">
            <input
              type="text" value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const GoalsModal = () => {
    if (!selectedMentorship) return null;
    
    const updateGoalProgress = (goalId, progress) => {
      handleUpdateGoal(goalId, { progress_percentage: progress });
    };
    
    const toggleGoalCompletion = (goalId, currentStatus) => {
      handleUpdateGoal(goalId, { 
        goal_status: currentStatus === 'completed' ? 'active' : 'completed',
        progress_percentage: currentStatus === 'completed' ? 0 : 100
      });
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Goals for {currentUser.userRole === 'mentor' ? selectedMentorship.mentee_details?.name : selectedMentorship.mentor_details?.name}
            </h3>
            <button
              onClick={() => {
                setSelectedMentorship(null);
                setMentorshipGoals([]);
                setShowGoalForm(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Progress Tracking</h4>
                <p className="text-sm text-gray-600">Set and track goals for your mentorship journey</p>
              </div>
              <button
                onClick={() => setShowGoalForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Goal</span>
              </button>
            </div>
            
            {showGoalForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h5 className="font-medium text-gray-900 mb-3">Create New Goal</h5>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Goal title"
                    value={goalData.goal_title}
                    onChange={(e) => setGoalData(prev => ({ ...prev, goal_title: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Goal description"
                    value={goalData.goal_description}
                    onChange={(e) => setGoalData(prev => ({ ...prev, goal_description: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="flex space-x-3">
                    <input
                      type="date"
                      value={goalData.target_date}
                      onChange={(e) => setGoalData(prev => ({ ...prev, target_date: e.target.value }))}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={goalData.goal_category}
                      onChange={(e) => setGoalData(prev => ({ ...prev, goal_category: e.target.value }))}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="skill">Skill Development</option>
                      <option value="career">Career</option>
                      <option value="project">Project</option>
                      <option value="learning">Learning</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateGoal}
                      disabled={!goalData.goal_title.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Goal
                    </button>
                    <button
                      onClick={() => setShowGoalForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {mentorshipGoals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No goals set yet</p>
                  <p className="text-sm">Create your first goal to start tracking progress</p>
                </div>
              ) : (
                mentorshipGoals.map(goal => (
                  <div key={goal.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h6 className="font-medium text-gray-900 flex items-center space-x-2">
                          <span>{goal.goal_title}</span>
                          {goal.goal_status === 'completed' && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </h6>
                        <p className="text-sm text-gray-600 mt-1">{goal.goal_description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          goal.goal_category === 'skill' ? 'bg-blue-100 text-blue-800' :
                          goal.goal_category === 'career' ? 'bg-green-100 text-green-800' :
                          goal.goal_category === 'project' ? 'bg-purple-100 text-purple-800' :
                          goal.goal_category === 'learning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {goal.goal_category}
                        </span>
                      </div>
                    </div>
                    
                    {goal.target_date && (
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        Target: {new Date(goal.target_date).toLocaleDateString()}
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900 font-medium">{goal.progress_percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress_percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateGoalProgress(goal.id, Math.min(100, (goal.progress_percentage || 0) + 25))}
                          disabled={goal.goal_status === 'completed'}
                          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                        >
                          +25%
                        </button>
                        <button
                          onClick={() => updateGoalProgress(goal.id, Math.max(0, (goal.progress_percentage || 0) - 25))}
                          disabled={goal.goal_status === 'completed'}
                          className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          -25%
                        </button>
                      </div>
                      <button
                        onClick={() => toggleGoalCompletion(goal.id, goal.goal_status)}
                        className={`text-sm px-3 py-1 rounded-lg transition-colors ${
                          goal.goal_status === 'completed'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {goal.goal_status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AnalyticsView = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Mentorships</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalMentorships || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeSessions || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.messagesSent || 0}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Goals Completed</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.goalsCompleted || 0}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
        
        {analytics.recentActivity && analytics.recentActivity.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-gray-700">{activity.description}</p>
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main render function
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg mb-8 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {currentUser.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                {currentUser.userRole === 'mentor' ? 'Guide and inspire your mentees' : 'Continue your learning journey'}
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex overflow-x-auto">
            {currentUser.userRole === 'mentee' && (
              <>
                <button
                  onClick={() => handleTabChange('discover')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'discover'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Search className="w-5 h-5 mx-auto mb-1" />
                  Discover Mentors
                </button>
                <button
                  onClick={() => handleTabChange('matched')}
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                    activeTab === 'matched'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Heart className="w-5 h-5 mx-auto mb-1" />
                  Matched Mentors
                </button>
              </>
            )}
            {currentUser.userRole === 'mentor' && (
              <button
                onClick={() => handleTabChange('requests')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === 'requests'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Users className="w-5 h-5 mx-auto mb-1" />
                Mentee Requests
              </button>
            )}
            <button
              onClick={() => handleTabChange('my-mentorships')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'my-mentorships'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <MessageSquare className="w-5 h-5 mx-auto mb-1" />
              My Mentorships
            </button>
            <button
              onClick={() => handleTabChange('analytics')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 className="w-5 h-5 mx-auto mb-1" />
              Analytics
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {(loading || tabLoading[activeTab]) && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        )}

        {/* Tab Content */}
        {!loading && !tabLoading[activeTab] && (
          <>
            {/* Discover Mentors Tab */}
            {activeTab === 'discover' && currentUser.userRole === 'mentee' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search mentors by name, field, or company..."
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          value={fieldFilter}
                          onChange={(e) => setFieldFilter(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                          <option value="">All Fields</option>
                          {uniqueFields.map(field => (
                            <option key={field} value={field}>{field}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mentors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMentors.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">No mentors found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                  ) : (
                    filteredMentors.map(mentor => (
                      <MentorCard key={mentor.id} mentor={mentor} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Matched Mentors Tab */}
            {activeTab === 'matched' && currentUser.userRole === 'mentee' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Matched Mentors</h2>
                  <p className="text-gray-600">AI-recommended mentors based on your profile and goals</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedMentors.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">No matches yet</p>
                      <p className="text-sm">Complete your profile to get better matches</p>
                    </div>
                  ) : (
                    matchedMentors.map(match => (
                      <MentorCard
                        key={match.mentor.id}
                        mentor={match.mentor}
                        isMatched={true}
                        matchData={match}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Mentee Requests Tab */}
            {activeTab === 'requests' && currentUser.userRole === 'mentor' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Mentee Requests</h2>
                  <p className="text-gray-600">Review and respond to mentorship requests</p>
                </div>
                
                <div className="space-y-4">
                  {menteeRequests.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">No pending requests</p>
                      <p className="text-sm">New mentee requests will appear here</p>
                    </div>
                  ) : (
                    menteeRequests.map(request => (
                      <MenteeRequestCard key={request.requestId} request={request} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* My Mentorships Tab */}
            {activeTab === 'my-mentorships' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">My Mentorships</h2>
                  <p className="text-gray-600">
                    {currentUser.userRole === 'mentor' 
                      ? 'Manage your mentees and track progress' 
                      : 'Your mentorship connections and progress'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myMentorships.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg">No active mentorships</p>
                      <p className="text-sm">
                        {currentUser.userRole === 'mentee' 
                          ? 'Start by discovering and connecting with mentors'
                          : 'Accept mentee requests to start mentoring'}
                      </p>
                    </div>
                  ) : (
                    myMentorships.map(mentorship => (
                      <MentorshipCard key={mentorship.id} mentorship={mentorship} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
                  <p className="text-gray-600">Track your mentorship journey and progress</p>
                </div>
                <AnalyticsView />
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <ChatModal />
        <GoalsModal />
      </div>
    </div>
  );
};

export default MentorshipDashboard;