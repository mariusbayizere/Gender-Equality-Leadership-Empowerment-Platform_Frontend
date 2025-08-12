import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Star, UserCheck, Clock, Send, AlertCircle, CheckCircle, Loader, User, Building, Mail, Brain, Target, Award, ChevronRight, MessageCircle, Video, Plus } from 'lucide-react';

export const MentorMatching = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [currentUser, setCurrentUser] = useState(null);
  const [availableMentors, setAvailableMentors] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedField, setSelectedField] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectionState, setSelectionState] = useState({
    loading: false,
    selectedMentor: null,
    message: '',
    showModal: false
  });
  const [myMentorships, setMyMentorships] = useState([]);

  // API Configuration
  const API_BASE_URL = 'http://localhost:3000/api/v1/mentorship';

  // Authentication token helper
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  // Generic API call function
  const apiCall = async (endpoint, method = 'GET', data = null) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Please log in to access this feature');
      }

      const config = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      
      if (response.status === 403) {
        throw new Error('Access denied. Only mentees can access this feature.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Initialize user from stored data
  useEffect(() => {
    const initializeUser = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        } else {
          setError('User session not found. Please log in again.');
        }
      } catch (error) {
        console.error('Error initializing user:', error);
        setError('Failed to load user session. Please log in again.');
      }
    };

    initializeUser();
  }, []);

  // Load available fields for filtering
  const loadAvailableFields = async () => {
    try {
      const response = await apiCall('/fields');
      setAvailableFields(response.fields || []);
    } catch (error) {
      console.error('Failed to load fields:', error);
    }
  };

  // Load available mentors from API
  const loadAvailableMentors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/available-mentors');
      
      setAvailableMentors(response.mentors || []);
      if (response.mentors && response.mentors.length > 0) {
        setSuccess(`Found ${response.mentors.length} available mentors`);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      setError(error.message);
      setAvailableMentors([]);
    } finally {
      setLoading(false);
    }
  };

  // Load smart recommendations using matching algorithm
  const loadRecommendedMentors = async () => {
    try {
      setRecommendationLoading(true);
      
      const response = await apiCall('/matching-algorithm');
      
      setRecommendedMentors(response.matches || []);
      if (response.matches && response.matches.length > 0) {
        setSuccess(`Found ${response.matches.length} recommended mentors based on your field: ${response.menteeProfile?.field}`);
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      setError('Failed to load personalized recommendations: ' + error.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setRecommendationLoading(false);
    }
  };

  // Load user's mentorships
  const loadMyMentorships = async () => {
    try {
      const response = await apiCall('/my-mentorships');
      setMyMentorships(response.mentorships || []);
    } catch (error) {
      console.error('Failed to load mentorships:', error);
    }
  };

  // Handle mentor selection
  const handleSelectMentor = (mentor, isRecommended = false) => {
    const mentorData = isRecommended ? mentor.mentor : mentor;
    setSelectionState({
      loading: false,
      selectedMentor: { ...mentorData, isRecommended, matchInfo: isRecommended ? mentor : null },
      message: '',
      showModal: true
    });
  };

  // Confirm mentor selection
  const confirmMentorSelection = async () => {
    if (!selectionState.selectedMentor) return;

    setSelectionState(prev => ({ ...prev, loading: true }));

    try {
      const selectionData = {
        mentor_id: selectionState.selectedMentor.id,
        message: selectionState.message.trim()
      };

      const response = await apiCall('/select-mentor', 'POST', selectionData);
      
      if (response.id) {
        setSelectionState({
          loading: false,
          selectedMentor: null,
          message: '',
          showModal: false
        });

        setSuccess(`Successfully connected with ${selectionState.selectedMentor.firstName} ${selectionState.selectedMentor.lastName}!`);
        
        // Refresh data
        await Promise.all([
          loadMyMentorships(),
          loadAvailableMentors(),
          loadRecommendedMentors()
        ]);

        setActiveTab('my-mentorships');
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (error) {
      setSelectionState(prev => ({ ...prev, loading: false }));
      setError('Failed to connect with mentor: ' + error.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  // Filter mentors based on search and field
  const filteredMentors = availableMentors.filter(mentor => {
    const matchesSearch = searchTerm === '' || 
      mentor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.field?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesField = selectedField === '' || mentor.field === selectedField;
    
    return matchesSearch && matchesField;
  });

  // Load initial data when user is available
  useEffect(() => {
    if (currentUser?.userRole === 'mentee') {
      Promise.all([
        loadAvailableMentors(),
        loadMyMentorships(),
        loadAvailableFields(),
        loadRecommendedMentors()
      ]);
    }
  }, [currentUser]);

  // Show login prompt if no user
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">Please log in to access mentor matching</p>
        </div>
      </div>
    );
  }

  // Check if user is a mentee
  if (currentUser.userRole !== 'mentee') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">Only mentees can access the mentor matching feature.</p>
          <p className="text-sm text-gray-500 mt-2">Your current role: {currentUser.userRole}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 ml-4 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {currentUser.firstName?.charAt(0) || ''}{currentUser.lastName?.charAt(0) || ''}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome, {currentUser.firstName} {currentUser.lastName}
              </h1>
              <div className="flex items-center space-x-4 text-purple-100">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                  {currentUser.userRole}
                </span>
                {currentUser.field && <span>• {currentUser.field}</span>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{myMentorships.length}</div>
            <div className="text-purple-100">Active Mentorships</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'recommendations'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Smart Recommendations</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  {recommendedMentors.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'browse'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Browse All</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {availableMentors.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('my-mentorships')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'my-mentorships'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>My Mentorships</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {myMentorships.length}
                </span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Smart Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Personalized Mentor Recommendations</h2>
                  <p className="text-gray-600 mt-1">Mentors matched based on your field: <strong>{currentUser.field}</strong></p>
                </div>
                <button
                  onClick={loadRecommendedMentors}
                  disabled={recommendationLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center"
                >
                  {recommendationLoading ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Brain className="w-4 h-4 mr-2" />
                  )}
                  Refresh Recommendations
                </button>
              </div>

              {recommendationLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-purple-600 mr-3" />
                  <span className="text-gray-600">Finding your perfect mentors...</span>
                </div>
              ) : recommendedMentors.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
                  <p className="text-gray-600 mb-4">We couldn't find mentors in your field yet.</p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse All Mentors
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {recommendedMentors.map((match, index) => (
                    <div key={match.mentor.id} className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {match.mentor.firstName?.charAt(0)}{match.mentor.lastName?.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {match.mentor.firstName} {match.mentor.lastName}
                            </h3>
                            <p className="text-sm text-purple-600 font-medium">{match.mentor.field}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-purple-100 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-purple-600 mr-1" />
                          <span className="text-purple-800 text-sm font-medium">{match.compatibilityScore}%</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2" />
                          {match.mentor.company || 'Not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="w-4 h-4 mr-2" />
                          {match.mentor.yearsOfExperience || 0} years experience
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Target className="w-4 h-4 mr-2" />
                          {match.mentor.specialization || 'General mentoring'}
                        </div>
                      </div>

                      {match.reason && (
                        <div className="bg-white bg-opacity-70 p-3 rounded-lg mb-4">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Why this match:</span> {match.reason}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => handleSelectMentor(match, true)}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Connect with Mentor
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Browse All Mentors Tab */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Browse All Available Mentors</h2>
                  <p className="text-gray-600 mt-1">Find and connect with mentors across all fields</p>
                </div>
                <button
                  onClick={loadAvailableMentors}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </button>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search mentors by name or field..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Fields</option>
                    {availableFields.map((field) => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                  <span className="text-gray-600">Loading mentors...</span>
                </div>
              ) : filteredMentors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || selectedField ? 'No mentors found' : 'No mentors available'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedField 
                      ? 'Try adjusting your search criteria.' 
                      : 'Check back later for new mentors.'}
                  </p>
                  {(searchTerm || selectedField) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedField('');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMentors.map((mentor) => (
                    <div key={mentor.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {mentor.firstName?.charAt(0)}{mentor.lastName?.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {mentor.firstName} {mentor.lastName}
                            </h3>
                            <p className="text-sm text-blue-600 font-medium">{mentor.field}</p>
                          </div>
                        </div>
                        {mentor.isRecommended && (
                          <div className="bg-purple-100 px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 text-purple-600" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2" />
                          {mentor.company || 'Not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="w-4 h-4 mr-2" />
                          {mentor.yearsOfExperience || 0} years experience
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Target className="w-4 h-4 mr-2" />
                          {mentor.specialization || 'General mentoring'}
                        </div>
                        {mentor.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {mentor.email}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleSelectMentor(mentor, false)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Connect with Mentor
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Mentorships Tab */}
          {activeTab === 'my-mentorships' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">My Mentorships</h2>
                  <p className="text-gray-600 mt-1">Manage your current mentor relationships</p>
                </div>
                <button
                  onClick={loadMyMentorships}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>

              {myMentorships.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Mentorships</h3>
                  <p className="text-gray-600 mb-4">You haven't connected with any mentors yet.</p>
                  <div className="space-x-4">
                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      View Recommendations
                    </button>
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Mentors
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {myMentorships.map((mentorship) => (
                    <div key={mentorship.id} className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {mentorship.mentor?.firstName?.charAt(0)}{mentorship.mentor?.lastName?.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {mentorship.mentor?.firstName} {mentorship.mentor?.lastName}
                            </h3>
                            <p className="text-sm text-green-600 font-medium">{mentorship.mentor?.field}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-green-800 text-sm font-medium">{mentorship.status}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          Started: {new Date(mentorship.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2" />
                          {mentorship.mentor?.company || 'Not specified'}
                        </div>
                        {mentorship.initialMessage && (
                          <div className="bg-white bg-opacity-70 p-3 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Your message:</span> {mentorship.initialMessage}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </button>
                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm">
                          <Video className="w-4 h-4 mr-1" />
                          Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mentor Selection Modal */}
      {selectionState.showModal && selectionState.selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Connect with Mentor</h3>
              <button
                onClick={() => setSelectionState(prev => ({ ...prev, showModal: false }))}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectionState.selectedMentor.firstName?.charAt(0)}{selectionState.selectedMentor.lastName?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectionState.selectedMentor.firstName} {selectionState.selectedMentor.lastName}
                  </h4>
                  <p className="text-sm text-purple-600">{selectionState.selectedMentor.field}</p>
                </div>
              </div>

              {selectionState.selectedMentor.isRecommended && selectionState.selectedMentor.matchInfo && (
                <div className="bg-purple-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="font-medium text-purple-800">
                      {selectionState.selectedMentor.matchInfo.compatibilityScore}% Match
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    {selectionState.selectedMentor.matchInfo.reason}
                  </p>
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {selectionState.selectedMentor.company || 'Not specified'}
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  {selectionState.selectedMentor.yearsOfExperience || 0} years experience
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Introduce yourself (optional)
              </label>
              <textarea
                value={selectionState.message}
                onChange={(e) => setSelectionState(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell your mentor about yourself and what you're looking for..."
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectionState(prev => ({ ...prev, showModal: false }))}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmMentorSelection}
                disabled={selectionState.loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {selectionState.loading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};