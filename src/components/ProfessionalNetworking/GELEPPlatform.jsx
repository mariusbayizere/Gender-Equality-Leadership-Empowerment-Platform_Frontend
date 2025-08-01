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
//             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
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
//               <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to--600 rounded-lg flex items-center justify-center">
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
import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle, Loader, AlertCircle, Menu, X } from 'lucide-react';
import { apiService } from './apiService';
import { DiscussionForums } from './DiscussionForums';
import { ProfessionalNetworking } from './ProfessionalNetworking'
import { EventsCalendar } from './EventsCalendar' 
// import  DiscussionForums  from './DiscussionForums';


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
        className={`${size} rounded-full bg-gray-200 object-cover flex-shrink-0`}
        onError={() => setImageError(true)}
      />
    );
  }
  
  // Fallback to User icon with circular background
  return (
    <div className={`${size} rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0`}>
      <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
    </div>
  );
};

// Connection Request Modal Component - Now fully responsive
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Send Connection Request</h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <ProfileAvatar 
              avatar={recipient?.avatar} 
              name={recipient?.name} 
              size="w-10 h-10" 
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{recipient?.name}</p>
              <p className="text-sm text-gray-600 truncate">{recipient?.title}</p>
            </div>
          </div>
          
          <textarea
            placeholder="Add a personal message (optional)"
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        
        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t">
          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 order-1 sm:order-2"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center py-8">
    <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
    <span className="text-gray-600 text-sm sm:text-base">{message}</span>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex items-center justify-center py-8">
    <div className="text-center px-4">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-gray-600 mb-4 text-sm sm:text-base">{message}</p>
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

// Professional Networking Component - Now fully responsive

// Placeholder components for other tabs - Now responsive
// const EventsCalendar = () => (
//   <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
//     <h2 className="text-xl font-semibold text-gray-900 mb-4">Events Calendar</h2>
//     <p className="text-gray-600 text-sm sm:text-base">Events calendar functionality will be implemented here.</p>
//   </div>
// );


// Main GELEP Platform Component - Fully responsive
const GELEPPlatform = () => {
  const [activeTab, setActiveTab] = useState('networking');
  const [notifications, setNotifications] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { id: 'networking', label: 'Professional Network', icon: Users, shortLabel: 'Network' },
    { id: 'events', label: 'Events Calendar', icon: Calendar, shortLabel: 'Events' },
    { id: 'forums', label: 'Discussion Forums', icon: MessageSquare, shortLabel: 'Forums' }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'networking':
        return <ProfessionalNetworking activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'events':
        return <EventsCalendar activeTab={activeTab} setActiveTab={setActiveTab}/>;
      case 'forums':
        return <DiscussionForums activeTab={activeTab} setActiveTab={setActiveTab}/>;
      default:
        return <ProfessionalNetworking activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg">G</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">GELEP</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Gender Equality Leadership Empowerment Platform</p>
              </div>
            </div>
            
            {/* Desktop Actions */}
            {/* <div className="hidden sm:flex items-center gap-4">
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
            </div> */}

            {/* Mobile Actions */}
            {/* <div className="flex sm:hidden items-center gap-2">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>
              <ProfileAvatar 
                avatar={null} 
                name="Current User" 
                size="w-8 h-8" 
              />
            </div> */}
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Responsive */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden">
            <div className="flex justify-around py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                      activeTab === tab.id
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{tab.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Responsive */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {renderActiveComponent()}
      </main>

      {/* Footer - Responsive */}
      <footer className="bg-white border-t mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-500">
            <p className="text-sm">&copy; 2024 GELEP - Gender Equality Leadership Empowerment Platform. All rights reserved.</p>
            <p className="mt-2 text-xs sm:text-sm">Empowering women leaders through professional networking and mentorship.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default GELEPPlatform;
