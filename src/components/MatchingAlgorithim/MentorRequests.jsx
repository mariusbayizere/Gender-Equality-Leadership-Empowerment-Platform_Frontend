import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Star, UserCheck, Clock, Send, AlertCircle, CheckCircle, Loader, User, Building, Mail, Brain, Target, Award, ChevronRight, MessageCircle, Video, Plus, X, Check } from 'lucide-react';

export const MentorRequests = () => {
  const [activeTab, setActiveTab] = useState('pending-requests');
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [connectedMentees, setConnectedMentees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [actionState, setActionState] = useState({
    loading: false,
    actionType: null, // 'accept' or 'reject'
    requestId: null,
    rejectionReason: '',
    showRejectionModal: false
  });

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
        throw new Error('Access denied. Only mentors can access this feature.');
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

  // Load pending mentee requests
  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/mentee-requests');
      
      setPendingRequests(response.menteeRequests || []);
      if (response.menteeRequests && response.menteeRequests.length > 0) {
        setSuccess(`Found ${response.menteeRequests.length} pending requests`);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      setError(error.message);
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Load connected mentees
  const loadConnectedMentees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/connected-mentees');
      
      setConnectedMentees(response.connectedMentees || []);
      if (response.connectedMentees && response.connectedMentees.length > 0) {
        setSuccess(`Found ${response.connectedMentees.length} connected mentees`);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (error) {
      setError(error.message);
      setConnectedMentees([]);
    } finally {
      setLoading(false);
    }
  };

  // Accept mentee request
  const acceptRequest = async (requestId) => {
    try {
      setActionState(prev => ({ ...prev, loading: true, actionType: 'accept', requestId }));
      
      const response = await apiCall('/accept-request', 'POST', { request_id: requestId });
      
      setSuccess('Mentorship request accepted successfully!');
      
      // Refresh both lists
      await Promise.all([loadPendingRequests(), loadConnectedMentees()]);
      
      // Switch to connected mentees tab
      setActiveTab('connected-mentees');
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (error) {
      setError('Failed to accept request: ' + error.message);
      setTimeout(() => setError(null), 5000);
    } finally {
      setActionState(prev => ({ ...prev, loading: false, actionType: null, requestId: null }));
    }
  };

  // Show rejection modal
  const showRejectionModal = (requestId) => {
    setActionState(prev => ({
      ...prev,
      actionType: 'reject',
      requestId,
      showRejectionModal: true,
      rejectionReason: ''
    }));
  };

  // Reject mentee request
  const rejectRequest = async () => {
    if (!actionState.requestId) return;

    try {
      setActionState(prev => ({ ...prev, loading: true }));
      
      const response = await apiCall('/reject-request', 'POST', {
        request_id: actionState.requestId,
        rejection_reason: actionState.rejectionReason.trim() || 'No reason provided'
      });
      
      setSuccess('Mentorship request rejected');
      
      // Refresh pending requests
      await loadPendingRequests();
      
      // Close modal
      setActionState({
        loading: false,
        actionType: null,
        requestId: null,
        rejectionReason: '',
        showRejectionModal: false
      });
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to reject request: ' + error.message);
      setTimeout(() => setError(null), 5000);
      setActionState(prev => ({ ...prev, loading: false }));
    }
  };

  // Load initial data when user is available
  useEffect(() => {
    if (currentUser?.userRole === 'mentor') {
      Promise.all([
        loadPendingRequests(),
        loadConnectedMentees()
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
          <p className="text-gray-600">Please log in to access mentor dashboard</p>
        </div>
      </div>
    );
  }

  // Check if user is a mentor
  if (currentUser.userRole !== 'mentor') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
          <p className="text-gray-600">Only mentors can access this dashboard.</p>
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

      {/* Mentor Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {currentUser.firstName?.charAt(0) || ''}{currentUser.lastName?.charAt(0) || ''}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Mentor Dashboard - {currentUser.firstName} {currentUser.lastName}
              </h1>
              <div className="flex items-center space-x-4 text-blue-100">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                  {currentUser.userRole}
                </span>
                {currentUser.field && <span>• {currentUser.field}</span>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{connectedMentees.length}</div>
            <div className="text-blue-100">Connected Mentees</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending-requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pending-requests'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Pending Requests</span>
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                  {pendingRequests.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('connected-mentees')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'connected-mentees'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Connected Mentees</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {connectedMentees.length}
                </span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Pending Requests Tab */}
          {activeTab === 'pending-requests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Pending Mentorship Requests</h2>
                  <p className="text-gray-600 mt-1">Review and respond to mentee connection requests</p>
                </div>
                <button
                  onClick={loadPendingRequests}
                  disabled={loading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Clock className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-orange-600 mr-3" />
                  <span className="text-gray-600">Loading pending requests...</span>
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Requests</h3>
                  <p className="text-gray-600">You don't have any pending mentorship requests at the moment.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pendingRequests.map((request) => (
                    <div key={request.requestId} className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                            {request.firstName?.charAt(0)}{request.lastName?.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {request.firstName} {request.lastName}
                            </h3>
                            <p className="text-sm text-orange-600 font-medium">{request.field}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-orange-100 px-2 py-1 rounded-full">
                          <Clock className="w-4 h-4 text-orange-600 mr-1" />
                          <span className="text-orange-800 text-sm font-medium">Pending</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2" />
                          {request.university || 'Not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="w-4 h-4 mr-2" />
                          Year {request.yearOfStudy || 'Not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Target className="w-4 h-4 mr-2" />
                          {request.careerGoals || 'Not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {request.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {new Date(request.requestDate).toLocaleDateString()}
                        </div>
                      </div>

                      {request.requestMessage && (
                        <div className="bg-white bg-opacity-70 p-3 rounded-lg mb-4">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Message:</span> {request.requestMessage}
                          </p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={() => acceptRequest(request.requestId)}
                          disabled={actionState.loading && actionState.requestId === request.requestId && actionState.actionType === 'accept'}
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm disabled:opacity-50"
                        >
                          {actionState.loading && actionState.requestId === request.requestId && actionState.actionType === 'accept' ? (
                            <Loader className="w-4 h-4 animate-spin mr-1" />
                          ) : (
                            <Check className="w-4 h-4 mr-1" />
                          )}
                          Accept
                        </button>
                        <button
                          onClick={() => showRejectionModal(request.requestId)}
                          disabled={actionState.loading && actionState.requestId === request.requestId}
                          className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm disabled:opacity-50"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Connected Mentees Tab */}
          {activeTab === 'connected-mentees' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Connected Mentees</h2>
                  <p className="text-gray-600 mt-1">Manage your active mentorship relationships</p>
                </div>
                <button
                  onClick={loadConnectedMentees}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>

              {connectedMentees.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Connected Mentees</h3>
                  <p className="text-gray-600 mb-4">You haven't accepted any mentorship requests yet.</p>
                  <button
                    onClick={() => setActiveTab('pending-requests')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    View Pending Requests
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {connectedMentees.map((mentee) => (
                    <div key={mentee.relationshipId} className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {mentee.firstName?.charAt(0)}{mentee.lastName?.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {mentee.firstName} {mentee.lastName}
                            </h3>
                            <p className="text-sm text-green-600 font-medium">{mentee.field}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          <span className="text-green-800 text-sm font-medium">Active</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          Connected: {new Date(mentee.connectionDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-2" />
                          {mentee.university || 'Not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="w-4 h-4 mr-2" />
                          Year {mentee.yearOfStudy || 'Not specified'}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Target className="w-4 h-4 mr-2" />
                          {mentee.careerGoals || 'Not specified'}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </button>
                        <button className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-sm">
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

      {/* Rejection Modal */}
      {actionState.showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject Mentorship Request</h3>
              <button
                onClick={() => setActionState(prev => ({ ...prev, showRejectionModal: false }))}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to reject this mentorship request? This action cannot be undone.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection (optional)
              </label>
              <textarea
                value={actionState.rejectionReason}
                onChange={(e) => setActionState(prev => ({ ...prev, rejectionReason: e.target.value }))}
                placeholder="Provide a reason for rejecting this request..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setActionState(prev => ({ ...prev, showRejectionModal: false }))}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={rejectRequest}
                disabled={actionState.loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {actionState.loading ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};