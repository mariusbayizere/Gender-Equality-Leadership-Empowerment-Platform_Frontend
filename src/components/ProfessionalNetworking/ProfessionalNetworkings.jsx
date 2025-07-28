// import React, { useState, useEffect } from 'react';
// import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle } from 'lucide-react';
// import {DiscussionForums} from './DiscussionForums'
// import {EventsCalendar} from './EventsCalendar'

// // Professional Networking Component
// const ProfessionalNetworking = ({ activeTab, setActiveTab }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [connections, setConnections] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [professionals, setProfessionals] = useState([
//     {
//       id: 1,
//       name: 'Marie Uwimana',
//       title: 'Tech Lead at Rwanda ICT Hub',
//       location: 'Kigali, Rwanda',
//       expertise: ['Leadership', 'Technology', 'Innovation'],
//       avatar: '/api/placeholder/60/60',
//       connected: false,
//       mutual: 12
//     },
//     {
//       id: 2,
//       name: 'Grace Mukamana',
//       title: 'Entrepreneur & Business Mentor',
//       location: 'Musanze, Rwanda',
//       expertise: ['Business Development', 'Mentoring', 'Finance'],
//       avatar: '/api/placeholder/60/60',
//       connected: true,
//       mutual: 8
//     },
//     {
//       id: 3,
//       name: 'Ange Kagame',
//       title: 'Policy Analyst at Ministry of Gender',
//       location: 'Kigali, Rwanda',
//       expertise: ['Policy Development', 'Gender Equality', 'Research'],
//       avatar: '/api/placeholder/60/60',
//       connected: false,
//       mutual: 15
//     }
//   ]);

//   const sendConnectionRequest = async (recipientId) => {
//     try {
//       const response = await fetch('/api/v1/connections', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({
//           requester_id: 'current_user_id', // Replace with actual user ID
//           recipient_id: recipientId,
//           message: 'I would like to connect with you for professional networking.'
//         })
//       });

//       if (response.ok) {
//         setProfessionals(prev => 
//           prev.map(prof => 
//             prof.id === recipientId 
//               ? { ...prof, requestSent: true }
//               : prof
//           )
//         );
//       }
//     } catch (error) {
//       console.error('Error sending connection request:', error);
//     }
//   };

//   const filteredProfessionals = professionals.filter(prof =>
//     prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     prof.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     prof.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   return (
//     <div className="bg-white rounded-lg shadow-sm border">
//       <div className="p-6 border-b">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold text-gray-900">Professional Network</h2>
//           <div className="flex gap-2">
//             <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
//               <Plus className="w-4 h-4" />
//               Invite
//             </button>
//           </div>
//         </div>
        
//         <div className="relative">
//           <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search professionals by name, title, or expertise..."
//             className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="grid gap-4">
//           {filteredProfessionals.map((professional) => (
//             <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={professional.avatar}
//                   alt={professional.name}
//                   className="w-12 h-12 rounded-full bg-gray-200"
//                 />
//                 <div>
//                   <h3 className="font-medium text-gray-900">{professional.name}</h3>
//                   <p className="text-sm text-gray-600">{professional.title}</p>
//                   <div className="flex items-center gap-4 mt-1">
//                     <span className="text-xs text-gray-500 flex items-center gap-1">
//                       <MapPin className="w-3 h-3" />
//                       {professional.location}
//                     </span>
//                     <span className="text-xs text-gray-500">{professional.mutual} mutual connections</span>
//                   </div>
//                   <div className="flex gap-1 mt-2">
//                     {professional.expertise.slice(0, 3).map((skill, index) => (
//                       <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
//                         {skill}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex gap-2">
//                 {professional.connected ? (
//                   <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
//                     Message
//                   </button>
//                 ) : professional.requestSent ? (
//                   <button className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg" disabled>
//                     Request Sent
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => sendConnectionRequest(professional.id)}
//                     className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//                   >
//                     Connect
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };




// // Main GELEP Platform Component
// const GELEPPlatform = () => {
//   const [activeTab, setActiveTab] = useState('networking');
//   const [notifications, setNotifications] = useState(3);

//   const tabs = [
//     { id: 'networking', label: 'Professional Network', icon: Users },
//     { id: 'events', label: 'Events Calendar', icon: Calendar },
//     { id: 'forums', label: 'Discussion Forums', icon: MessageSquare }
//   ];

//   const renderActiveComponent = () => {
//     switch (activeTab) {
//       case 'networking':
//         return <ProfessionalNetworking activeTab={activeTab} setActiveTab={setActiveTab} />;
//       case 'events':
//         return <EventsCalendar />;
//       case 'forums':
//         return <DiscussionForums />;
//       default:
//         return <ProfessionalNetworking activeTab={activeTab} setActiveTab={setActiveTab} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">G</span>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">GELEP</h1>
//                 <p className="text-xs text-gray-500">Gender Equality Leadership Empowerment Platform</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <button className="relative p-2 text-gray-400 hover:text-gray-600">
//                 <Bell className="w-6 h-6" />
//                 {notifications > 0 && (
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//                     {notifications}
//                   </span>
//                 )}
//               </button>
              
//               <div className="flex items-center gap-2">
//                 <img
//                   src="/api/placeholder/32/32"
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full bg-gray-200"
//                 />
//                 <span className="text-sm font-medium text-gray-700">Welcome back!</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Navigation Tabs */}
//       <nav className="bg-white border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex space-x-8">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm ${
//                     activeTab === tab.id
//                       ? 'border-purple-500 text-purple-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   {tab.label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {renderActiveComponent()}
//       </main>

//       {/* Footer */}
//       <footer className="bg-white border-t mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-center text-gray-500">
//             <p>&copy; 2024 GELEP - Gender Equality Leadership Empowerment Platform. Empowering women leaders in Rwanda and beyond.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default GELEPPlatform;



import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle, Loader, AlertCircle } from 'lucide-react';
import {apiService } from './apiService'


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

// Connection Request Modal Component (you need to implement this)
const ConnectionRequestModal = ({ isOpen, onClose, recipient, onSend }) => {
  const [message, setMessage] = useState('');
  
  if (!isOpen) return null;
  
  const handleSend = () => {
    if (recipient) {
      onSend(recipient.id, message);
      setMessage('');
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Send Connection Request</h3>
        <div className="flex items-center gap-3 mb-4">
          <ProfileAvatar 
            avatar={recipient?.avatar} 
            name={recipient?.name} 
            size="w-10 h-10" 
          />
          <div>
            <p className="font-medium">{recipient?.name}</p>
            <p className="text-sm text-gray-600">{recipient?.title}</p>
          </div>
        </div>
        <textarea
          placeholder="Add a personal message (optional)"
          className="w-full p-3 border rounded-lg mb-4 resize-none"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-8">
    <Loader className="w-6 h-6 animate-spin text-purple-600 mr-2" />
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
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Professional Networking Component
const ProfessionalNetworking = ({ activeTab, setActiveTab }) => {
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
      // Update the professional's status locally
      setProfessionals(prev =>
        prev.map(prof =>
          prof.id === recipientId
            ? { ...prof, requestSent: true }
            : prof
        )
      );
      // Update stats
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

  // FIXED: Handle connection request response
  const handleRespondToRequest = async (requestId, status) => {
    console.log('Responding to request:', requestId, 'with status:', status);
    
    try {
      await apiService.respondToRequest(requestId, status);
      
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(req => req.id !== requestId));
      
      // Update stats
      if (status === 'accepted') {
        setStats(prev => ({
          ...prev,
          totalConnections: prev.totalConnections + 1,
          pendingRequests: prev.pendingRequests - 1
        }));
        
        // Optionally reload connections to show the new connection
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
      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search professionals by name, title, or expertise..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="mentor">Mentors</option>
          <option value="mentee">Mentees</option>
        </select>
      </div>

      {/* Professionals List */}
      {loading ? (
        <LoadingSpinner message="Finding professionals..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadData} />
      ) : professionals.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No professionals found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {professionals.map((professional) => (
            <div key={professional.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <ProfileAvatar 
                  avatar={professional.avatar} 
                  name={professional.name} 
                />
                <div>
                  <h3 className="font-medium text-gray-900">{professional.name}</h3>
                  <p className="text-sm text-gray-600">{professional.title}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {professional.location}
                    </span>
                    <span className="text-xs text-gray-500">{professional.mutual} mutual connections</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {professional.expertise && professional.expertise.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
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
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
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
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">You don't have any connections yet.</p>
          <button
            onClick={() => setActiveSubTab('discover')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Discover Professionals
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {connections.map((connection) => (
            <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
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
          ))}
        </div>
      )}
    </div>
  );

  const renderRequestsTab = () => (
    <div className="space-y-4">
      {pendingRequests.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No pending connection requests.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingRequests.map((request) => (
            <div key={request.id} className="p-4 border rounded-lg">
              <div className="flex items-center gap-4 mb-3">
                <ProfileAvatar 
                  avatar={request.requester?.avatar} 
                  name={request.requester?.name} 
                />
                <div>
                  <h3 className="font-medium text-gray-900">{request.requester?.name}</h3>
                  <p className="text-sm text-gray-600">{request.requester?.title}</p>
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
              <div className="flex gap-2">
                <button
                  onClick={() => handleRespondToRequest(request.id, 'accepted')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRespondToRequest(request.id, 'rejected')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
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
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Professional Network</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Invite
            </button>
          </div>
        </div>

        {/* Sub-navigation */}
        <div className="flex space-x-6 border-b -mb-6">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`pb-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeSubTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
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

// Placeholder components for other tabs
const EventsCalendar = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Events Calendar</h2>
    <p className="text-gray-600">Events calendar functionality will be implemented here.</p>
  </div>
);

const DiscussionForums = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Discussion Forums</h2>
    <p className="text-gray-600">Discussion forums functionality will be implemented here.</p>
  </div>
);

// Main GELEP Platform Component
const GELEPPlatform = () => {
  const [activeTab, setActiveTab] = useState('networking');
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    // Load notification count
    const loadNotifications = async () => {
      try {
        const stats = await apiService.getConnectionStats();
        setNotifications(stats.pendingRequests || 0);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };
    loadNotifications();
  }, []);

  const tabs = [
    { id: 'networking', label: 'Professional Network', icon: Users },
    { id: 'events', label: 'Events Calendar', icon: Calendar },
    { id: 'forums', label: 'Discussion Forums', icon: MessageSquare }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'networking':
        return <ProfessionalNetworking activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'events':
        return <EventsCalendar />;
      case 'forums':
        return <DiscussionForums />;
      default:
        return <ProfessionalNetworking activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GELEP</h1>
                <p className="text-xs text-gray-500">Gender Equality Leadership Empowerment Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              <div className="flex items-center gap-2">
                <ProfileAvatar 
                  avatar={null} 
                  name="Current User" 
                  size="w-8 h-8" 
                />
                <span className="text-sm font-medium text-gray-700">Welcome back!</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveComponent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 GELEP - Gender Equality Leadership Empowerment Platform. All rights reserved.</p>
            <p className="mt-2 text-sm">Empowering women leaders through professional networking and mentorship.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GELEPPlatform;