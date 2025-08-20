import React, { useState, useEffect } from 'react';
import { Users, Heart, MessageSquare, Calendar, Search, Filter, UserPlus, CheckCircle, XCircle, Clock, Star, BookOpen, Award, TrendingUp, Send, Target, Plus, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import ProfessionalChat from './MentorshipChat';

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1/mentorship';

// API Helper Functions
const apiCall = async (endpoint, options = {}) => {
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

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
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

  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch('http://localhost:3000/api/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setCurrentUser(data.user);
      } catch (err) {
        setCurrentUser(null);
      }
    };
    fetchCurrentUser();
  }, []);

  // Load initial data when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      loadInitialData();
    }
    // eslint-disable-next-line
  }, [currentUser]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      if (currentUser.userRole === 'mentee') {
        setActiveTab('discover');
        await Promise.all([
          fetchAvailableMentors(),
          fetchMyMentorships(),
          fetchAnalytics()
        ]);
      } else if (currentUser.userRole === 'mentor') {
        setActiveTab('requests');
        await Promise.all([
          fetchMenteeRequests(),
          fetchMyMentorships(),
          fetchAnalytics()
        ]);
      }
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // API Functions
  const fetchAvailableMentors = async () => {
    try {
      const response = await apiCall('/available-mentors');
      setMentors(response.mentors || []);
    } catch (error) {
      setError('Failed to load mentors');
    }
  };

  const fetchMatchedMentors = async () => {
    try {
      const response = await apiCall('/matching-algorithm');
      setMatchedMentors(response.matches || []);
    } catch (error) {
      setError('Failed to load matched mentors');
    }
  };

  const fetchMyMentorships = async () => {
    try {
      const response = await apiCall('/my-mentorships');
      setMyMentorships(response.mentorships || []);
    } catch (error) {
      setError('Failed to load mentorships');
    }
  };

  const fetchMenteeRequests = async () => {
    try {
      const response = await apiCall('/mentee-requests');
      setMenteeRequests(response.menteeRequests || []);
    } catch (error) {
      setError('Failed to load mentee requests');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await apiCall('/analytics');
      setAnalytics(response.analytics || {});
    } catch (error) {
      setError('Failed to load analytics');
    }
  };

  const fetchMessages = async (mentorshipId) => {
    try {
      const response = await apiCall(`/messages/${mentorshipId}`);
      setChatMessages(response.messages || []);
    } catch (error) {
      setError('Failed to load messages');
    }
  };

  const fetchGoals = async (mentorshipId) => {
    try {
      const response = await apiCall(`/goals/${mentorshipId}`);
      setMentorshipGoals(response.goals || []);
    } catch (error) {
      setError('Failed to load goals');
    }
  };

  // Action Functions
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
      await fetchGoals(selectedMentorship.id);
    } catch (error) {
      setError('Error updating goal');
    }
  };

  // Filter mentors
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = !searchFilter ||
      `${mentor.firstName} ${mentor.lastName}`.toLowerCase().includes(searchFilter.toLowerCase()) ||
      mentor.field.toLowerCase().includes(searchFilter.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesField = !fieldFilter || mentor.field === fieldFilter;
    return matchesSearch && matchesField;
  });

  const uniqueFields = [...new Set(mentors.map(mentor => mentor.field))];

  // Components
  const MentorCard = ({ mentor, isMatched = false, matchData = null }) => {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestMessage, setRequestMessage] = useState('');
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {mentor.firstName?.[0]}{mentor.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mentor.firstName} {mentor.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{mentor.company}</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                  {mentor.field}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="w-4 h-4 mr-2 text-purple-500" />
                  {mentor.yearsOfExperience} years experience
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-purple-500" />
                  {mentor.specialization}
                </div>
              </div>
              {isMatched && matchData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">
                      {matchData.compatibility} Match
                    </span>
                    <span className="text-sm text-green-600">
                      {matchData.matchScore}% compatibility
                    </span>
                  </div>
                  <p className="text-xs text-green-700">
                    {matchData.matchReasons?.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>
          {!showRequestForm ? (
            <button
              onClick={() => setShowRequestForm(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Request Mentorship</span>
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                placeholder="Write a message to introduce yourself and explain why you'd like this mentor..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    handleSelectMentor(mentor.id, requestMessage);
                    setShowRequestForm(false);
                    setRequestMessage('');
                  }}
                  disabled={loading || !requestMessage.trim()}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Request
                </button>
                <button
                  onClick={() => {
                    setShowRequestForm(false);
                    setRequestMessage('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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
        case 'active': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };
    const partnerDetails = currentUser.userRole === 'mentor' ? mentorship.mentee_details : mentorship.mentor_details;
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {partnerDetails?.name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {partnerDetails?.name}
                </h3>
                <p className="text-sm text-gray-600">{partnerDetails?.field}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mentorship.program_status)}`}>
              {mentorship.program_status?.charAt(0).toUpperCase() + mentorship.program_status?.slice(1)}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            {mentorship.start_date && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                Started: {formatDate(mentorship.start_date)}
              </div>
            )}
            {mentorship.request_date && (
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                Requested: {formatDate(mentorship.request_date)}
              </div>
            )}
            {mentorship.matching_criteria && (
              <div className="text-xs text-gray-500">
                {mentorship.matching_criteria}
              </div>
            )}
          </div>
          {mentorship.selection_message && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Message:</span> "{mentorship.selection_message}"
              </p>
            </div>
          )}
          {mentorship.program_status === 'active' && (
            <div className="flex space-x-2">
              {/* <button
                onClick={() => {
                  setSelectedMentorship(mentorship);
                  setShowChat(true);
                  fetchMessages(mentorship.id);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
              </button> */}
              <button
  onClick={() => setChatMentorship(mentorship)}
  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
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
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Target className="w-4 h-4" />
                <span>Goals</span>
              </button>
            </div>
          )}
          {mentorship.program_status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800 text-center">
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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {request.firstName?.[0]}{request.lastName?.[0]}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {request.firstName} {request.lastName}
                </h3>
                <p className="text-sm text-gray-600">{request.field}</p>
                <p className="text-sm text-gray-500">{request.email}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(request.requestDate).toLocaleDateString()}
            </div>
          </div>
          {request.requestMessage && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Message:</span> "{request.requestMessage}"
              </p>
            </div>
          )}
          {!showRejectForm ? (
            <div className="flex space-x-3">
              <button
                onClick={() => handleAcceptRequest(request.requestId)}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Accept</span>
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    handleRejectRequest(request.requestId, rejectionReason);
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirm Decline
                </button>
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
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
                    ? 'bg-purple-600 text-white'
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
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl h-3/4 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Progress Tracking</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowGoalForm(true)}
                className="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Goal</span>
              </button>
              <button
                onClick={() => setSelectedMentorship(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {mentorshipGoals.map(goal => (
              <div key={goal.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{goal.goal_title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                    goal.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {goal.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                {goal.goal_description && (
                  <p className="text-sm text-gray-600 mb-2">{goal.goal_description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Progress: {goal.progress_percentage}%</span>
                  {goal.target_date && (
                    <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress_percentage}%` }}
                  ></div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleUpdateGoal(goal.id, {
                      progress_percentage: Math.min(100, goal.progress_percentage + 10)
                    })}
                    className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Update Progress
                  </button>
                  {goal.progress_percentage < 100 && (
                    <button
                      onClick={() => handleUpdateGoal(goal.id, {
                        status: 'completed',
                        progress_percentage: 100
                      })}
                      className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
            {mentorshipGoals.length === 0 && (
              <div className="text-center py-8">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No goals set yet. Create your first goal to start tracking progress.</p>
              </div>
            )}
          </div>
          {showGoalForm && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Goal title"
                  value={goalData.goal_title}
                  onChange={(e) => setGoalData({ ...goalData, goal_title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <textarea
                  placeholder="Goal description (optional)"
                  value={goalData.goal_description}
                  onChange={(e) => setGoalData({ ...goalData, goal_description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={2}
                />
                <div className="flex space-x-3">
                  <input
                    type="date"
                    value={goalData.target_date}
                    onChange={(e) => setGoalData({ ...goalData, target_date: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <select
                    value={goalData.goal_category}
                    onChange={(e) => setGoalData({ ...goalData, goal_category: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="career">Career</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateGoal}
                    disabled={!goalData.goal_title.trim()}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Goal
                  </button>
                  <button
                    onClick={() => setShowGoalForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const AnalyticsPanel = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {currentUser.userRole === 'mentor' ? 'Active Mentees' : 'Active Mentorships'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.activeMentorships || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+{analytics.growthRate || 0}% this month</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Messages Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.messagesSent || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Goals Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.goalsCompleted || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.successRate || 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );

  const ErrorAlert = () => {
    if (!error) return null;
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Guard rendering with currentUser
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading user...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mentorship Dashboard
          </h1>
          <p className="text-gray-600">
            {currentUser.userRole === 'mentor'
              ? 'Manage your mentees and track their progress'
              : 'Find mentors and track your learning journey'
            }
          </p>
        </div>
        {/* Analytics Panel */}
        <AnalyticsPanel />
        {/* Error Alert */}
        <ErrorAlert />
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {currentUser.userRole === 'mentee' && (
              <>
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'discover'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Discover Mentors</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('matched');
                    fetchMatchedMentors();
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'matched'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Matched for You</span>
                  </div>
                </button>
              </>
            )}
            {currentUser.userRole === 'mentor' && (
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Mentee Requests</span>
                  {menteeRequests.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {menteeRequests.length}
                    </span>
                  )}
                </div>
              </button>
            )}
            <button
              onClick={() => setActiveTab('my-mentorships')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-mentorships'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>My {currentUser.userRole === 'mentor' ? 'Mentees' : 'Mentorships'}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </button>
          </nav>
        </div>
        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Discover Mentors Tab */}
            {activeTab === 'discover' && currentUser.userRole === 'mentee' && (
              <div>
                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search mentors by name, field, or company..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={fieldFilter}
                        onChange={(e) => setFieldFilter(e.target.value)}
                        className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="">All Fields</option>
                        {uniqueFields.map(field => (
                          <option key={field} value={field}>{field}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {/* Mentors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMentors.length > 0 ? (
                    filteredMentors.map(mentor => (
                      <MentorCard key={mentor.id} mentor={mentor} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {mentors.length === 0 ? 'No mentors available at the moment' : 'No mentors match your search criteria'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Matched Mentors Tab */}
            {activeTab === 'matched' && currentUser.userRole === 'mentee' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Mentors Matched for You</h2>
                  <p className="text-gray-600">Based on your profile and preferences, here are your top mentor matches.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedMentors.length > 0 ? (
                    matchedMentors.map(match => (
                      <MentorCard
                        key={match.mentor.id}
                        mentor={match.mentor}
                        isMatched={true}
                        matchData={match}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No matched mentors found. Update your profile to get better matches.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Mentee Requests Tab */}
            {activeTab === 'requests' && currentUser.userRole === 'mentor' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Mentee Requests</h2>
                  <p className="text-gray-600">Review and respond to mentorship requests from potential mentees.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {menteeRequests.length > 0 ? (
                    menteeRequests.map(request => (
                      <MenteeRequestCard key={request.requestId} request={request} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No pending mentee requests at the moment.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* My Mentorships Tab */}
            {activeTab === 'my-mentorships' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    My {currentUser.userRole === 'mentor' ? 'Mentees' : 'Mentorships'}
                  </h2>
                  <p className="text-gray-600">
                    {currentUser.userRole === 'mentor'
                      ? 'Track progress and communicate with your mentees'
                      : 'View your active mentorships and track your progress'
                    }
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myMentorships.length > 0 ? (
                    myMentorships.map(mentorship => (
                      <MentorshipCard key={mentorship.id} mentorship={mentorship} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {currentUser.userRole === 'mentor'
                          ? 'No active mentorships yet. Mentee requests will appear here once accepted.'
                          : 'No active mentorships yet. Find a mentor to get started!'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Insights</h2>
                  <p className="text-gray-600">Track your mentorship journey and progress over time.</p>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Detailed analytics coming soon!</p>
                    <p className="text-sm text-gray-400 mt-2">
                      We're working on comprehensive analytics to help you track your mentorship progress.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Modals */}
      <ChatModal />
      <GoalsModal />
    </div>
  );
};

export default MentorshipDashboard;