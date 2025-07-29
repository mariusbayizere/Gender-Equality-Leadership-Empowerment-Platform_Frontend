import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle, Loader, AlertCircle, Menu, X } from 'lucide-react';
import { apiService } from './apiService';
import {ConnectionRequestModal } from './ConnectionRequestModal'

// ProfileAvatar Component - Handles avatar display with fallback to User icon
const ProfileAvatar = ({ avatar, name, size = "w-12 h-12" }) => {
  const [imageError, setImageError] = useState(false);
  
  // Check if avatar exists and is not empty/null
  const hasValidAvatar = avatar && avatar.trim() !== '' && !imageError;
  
  if (hasValidAvatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${size} rounded-full bg-gray-200 object-cover`}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Fallback to User icon with circular background
  return (
    <div className={`${size} rounded-full bg-blue-500 flex items-center justify-center`}>
      <User className="w-6 h-6 text-white" />
    </div>
  );
};

// Connection Request Modal Component
// const ConnectionRequestModal = ({ isOpen, onClose, recipient, onSend }) => {
//   const [message, setMessage] = useState('');
  
//   if (!isOpen) return null;
  
//   const handleSend = () => {
//     if (recipient) {
//       onSend(recipient.id, message);
//       setMessage('');
//       onClose();
//     }
//   };
  
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h3 className="text-lg font-semibold mb-4">Send Connection Request</h3>
//         <div className="flex items-center gap-3 mb-4">
//           <ProfileAvatar 
//             avatar={recipient?.avatar} 
//             name={recipient?.name} 
//             size="w-10 h-10" 
//           />
//           <div>
//             <p className="font-medium">{recipient?.name}</p>
//             <p className="text-sm text-gray-600">{recipient?.title}</p>
//           </div>
//         </div>
//         <textarea
//           placeholder="Add a personal message (optional)"
//           className="w-full p-3 border rounded-lg mb-4 resize-none"
//           rows="4"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <div className="flex gap-2 justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSend}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Send Request
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// Loading Component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-8">
    <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
    <span className="text-gray-600">{message}</span>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Professional Networking Component
export const ProfessionalNetworking = ({ activeTab, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [professionals, setProfessionals] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [stats, setStats] = useState({ totalConnections: 0, pendingRequests: 0, sentRequests: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('discover');

  // Load initial data
  useEffect(() => {
    loadData();
  }, [currentPage, searchTerm, selectedRole]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [professionalsData, connectionsData, requestsData, statsData] = await Promise.all([
        apiService.getProfessionals({
          search: searchTerm,
          role: selectedRole,
          page: currentPage,
          limit: 20
        }),
        apiService.getMyConnections(),
        apiService.getPendingRequests(),
        apiService.getConnectionStats()
      ]);

      setProfessionals(professionalsData.professionals || []);
      setTotalPages(professionalsData.totalPages || 1);
      setConnections(connectionsData || []);
      setPendingRequests(requestsData || []);
      setStats(statsData || { totalConnections: 0, pendingRequests: 0, sentRequests: 0 });
    } catch (err) {
      setError(err.message);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendConnectionRequest = async (recipientId, message) => {
    try {
      await apiService.sendConnectionRequest(recipientId, message);
      setProfessionals(prev =>
        prev.map(prof =>
          prof.id === recipientId
            ? { ...prof, requestSent: true }
            : prof
        )
      );
      setStats(prev => ({ ...prev, sentRequests: prev.sentRequests + 1 }));
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request: ' + error.message);
    }
  };

  const handleConnectionRequest = (professional) => {
    setSelectedRecipient(professional);
    setShowConnectionModal(true);
  };

  const handleRespondToRequest = async (requestId, status) => {
    console.log('Responding to request:', requestId, 'with status:', status);
    
    try {
      await apiService.respondToRequest(requestId, status);
      
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      
      if (status === 'accepted') {
        setStats(prev => ({
          ...prev,
          totalConnections: prev.totalConnections + 1,
          pendingRequests: prev.pendingRequests - 1
        }));
        
        const connectionsData = await apiService.getMyConnections();
        setConnections(connectionsData || []);
      } else {
        setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }));
      }
      
    } catch (error) {
      console.error('Error responding to request:', error);
      alert('Failed to respond to request: ' + error.message);
    }
  };

  const handleRemoveConnection = async (connectionId) => {
    if (window.confirm('Are you sure you want to remove this connection?')) {
      try {
        await apiService.removeConnection(connectionId);
        setConnections(prev => prev.filter(conn => conn.id !== connectionId));
        setStats(prev => ({ ...prev, totalConnections: prev.totalConnections - 1 }));
      } catch (error) {
        console.error('Error removing connection:', error);
        alert('Failed to remove connection: ' + error.message);
      }
    }
  };

  const renderDiscoverTab = () => (
    <div className="space-y-4">
      {/* Search and Filters - Responsive */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search professionals..."
            className="w-full pl-10 pr-4 py-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value="all">All Roles</option>
          <option value="mentor">Mentors</option>
          <option value="mentee">Mentees</option>
        </select>
      </div>

      {/* Professionals List - Responsive */}
      {loading ? (
        <LoadingSpinner message="Finding professionals..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadData} />
      ) : professionals.length === 0 ? (
        <div className="text-center py-8 px-4">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No professionals found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {professionals.map((professional) => (
            <div key={professional.id} className="p-4 border rounded-lg hover:bg-gray-50">
              {/* Mobile Layout */}
              <div className="sm:hidden space-y-4">
                <div className="flex items-start gap-3">
                  <ProfileAvatar 
                    avatar={professional.avatar} 
                    name={professional.name}
                    size="w-12 h-12" 
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{professional.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{professional.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                      <span className="text-xs text-gray-500 truncate">{professional.location}</span>
                    </div>
                    <span className="text-xs text-gray-500">{professional.mutual} mutual connections</span>
                  </div>
                </div>
                
                {/* Skills */}
                {professional.expertise && (
                  <div className="flex flex-wrap gap-1">
                    {professional.expertise.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Action Button */}
                <div className="flex">
                  {professional.connected ? (
                    <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Message
                    </button>
                  ) : professional.requestSent ? (
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg" disabled>
                      Request Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectionRequest(professional)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <ProfileAvatar 
                    avatar={professional.avatar} 
                    name={professional.name} 
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900">{professional.name}</h3>
                    <p className="text-sm text-gray-600">{professional.title}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {professional.location}
                      </span>
                      <span className="text-xs text-gray-500">{professional.mutual} mutual connections</span>
                    </div>
                    {professional.expertise && (
                      <div className="flex gap-1 mt-2">
                        {professional.expertise.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {professional.connected ? (
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Message
                    </button>
                  ) : professional.requestSent ? (
                    <button className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg" disabled>
                      Request Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnectionRequest(professional)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination - Responsive */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6 px-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-full sm:w-auto px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const renderConnectionsTab = () => (
    <div className="space-y-4">
      {connections.length === 0 ? (
        <div className="text-center py-8 px-4">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">You don't have any connections yet.</p>
          <button
            onClick={() => setActiveSubTab('discover')}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Discover Professionals
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {connections.map((connection) => (
            <div key={connection.id} className="p-4 border rounded-lg">
              {/* Mobile Layout */}
              <div className="sm:hidden space-y-4">
                <div className="flex items-center gap-3">
                  <ProfileAvatar 
                    avatar={connection.avatar} 
                    name={connection.name}
                    size="w-12 h-12" 
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{connection.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{connection.title}</p>
                    <p className="text-xs text-gray-500">Connected on {new Date(connection.connectedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Message
                  </button>
                  <button
                    onClick={() => handleRemoveConnection(connection.id)}
                    className="flex-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ProfileAvatar 
                    avatar={connection.avatar} 
                    name={connection.name} 
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{connection.name}</h3>
                    <p className="text-sm text-gray-600">{connection.title}</p>
                    <p className="text-xs text-gray-500">Connected on {new Date(connection.connectedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Message
                  </button>
                  <button
                    onClick={() => handleRemoveConnection(connection.id)}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRequestsTab = () => (
    <div className="space-y-4">
      {pendingRequests.length === 0 ? (
        <div className="text-center py-8 px-4">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No pending connection requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 sm:gap-4 mb-3">
                <ProfileAvatar 
                  avatar={request.requester?.avatar} 
                  name={request.requester?.name}
                  size="w-12 h-12" 
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{request.requester?.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{request.requester?.title}</p>
                  <p className="text-xs text-gray-500">
                    Sent {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {request.message && (
                <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded">
                  "{request.message}"
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleRespondToRequest(request.id, 'accepted')}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRespondToRequest(request.id, 'rejected')}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const subTabs = [
    { id: 'discover', label: 'Discover', count: null },
    { id: 'connections', label: 'My Connections', count: stats.totalConnections },
    { id: 'requests', label: 'Requests', count: stats.pendingRequests }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Professional Network</h2>
          <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Invite
          </button>
        </div>

        {/* Sub-navigation - Responsive */}
        <div className="flex space-x-1 sm:space-x-6 border-b -mb-4 sm:-mb-6 overflow-x-auto">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                activeSubTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.id === 'discover' ? 'Discover' : tab.id === 'connections' ? 'Connections' : 'Requests'}
              </span>
              {tab.count !== null && tab.count > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {activeSubTab === 'discover' && renderDiscoverTab()}
        {activeSubTab === 'connections' && renderConnectionsTab()}
        {activeSubTab === 'requests' && renderRequestsTab()}
      </div>

      {/* Connection Request Modal */}
      <ConnectionRequestModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        recipient={selectedRecipient}
        onSend={handleSendConnectionRequest}
      />
    </div>
  );
};