// import React, { useState, useEffect } from 'react';
// import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle } from 'lucide-react';

// // API service for events
// const eventsAPI = {
//   baseURL: 'http://localhost:3000/api/v1/events',
  
//   // Get authentication token from localStorage or context
//   getAuthToken: () => {
//     return localStorage.getItem('authToken') || '';
//   },
  
//   // Get all events
//   getAllEvents: async () => {
//     try {
//       const response = await fetch(`${eventsAPI.baseURL}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       throw error;
//     }
//   },
  
//   // Register for an event
//   registerForEvent: async (eventId, userId) => {
//     try {
//       const response = await fetch(`${eventsAPI.baseURL}/${eventId}/register`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId }),
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error registering for event:', error);
//       throw error;
//     }
//   },
  
//   // Unregister from an event
//   unregisterFromEvent: async (eventId, userId) => {
//     try {
//       const response = await fetch(`${eventsAPI.baseURL}/${eventId}/unregister`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId }),
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error unregistering from event:', error);
//       throw error;
//     }
//   },
  
//   // Search events - FIXED: Using correct endpoint
//   searchEvents: async (query) => {
//     try {
//       const response = await fetch(`${eventsAPI.baseURL}/search?q=${encodeURIComponent(query)}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
//           'Content-Type': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error searching events:', error);
//       throw error;
//     }
//   },
  
//   // Create new event (admin only)
//   createEvent: async (eventData) => {
//     try {
//       const response = await fetch(`${eventsAPI.baseURL}`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(eventData),
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error creating event:', error);
//       throw error;
//     }
//   }
// };

// // Enhanced Events Calendar Component
// export const EventsCalendar = ({ currentUser }) => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [registrationLoading, setRegistrationLoading] = useState({});
  
//   // Load events on component mount
//   useEffect(() => {
//     loadEvents();
//   }, []);
  
//   // Load events from API
//   const loadEvents = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const eventsData = await eventsAPI.getAllEvents();
      
//       // Transform API data to match component expected format
//       const transformedEvents = eventsData.map(event => ({
//         id: event.id,
//         title: event.title,
//         date: event.event_date,
//         time: extractTimeFromDate(event.event_date),
//         location: event.location,
//         type: event.event_type,
//         description: event.description,
//         attendees: (event.user_ids && Array.isArray(event.user_ids)) ? event.user_ids.length : 0,
//         maxAttendees: event.number_participants || 0,
//         registeredUsers: event.user_ids || [],
//         isRegistered: event.user_ids?.includes(currentUser?.id) || false,
//         sessionLink: event.session_link,
//         createdAt: event.createdAt,
//         updatedAt: event.updatedAt
//       }));
      
//       setEvents(transformedEvents);
//     } catch (err) {
//       setError('Failed to load events. Please try again later.');
//       console.error('Error loading events:', err);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // FIXED: Extract time from date string
//   const extractTimeFromDate = (dateString) => {
//     try {
//       if (!dateString) return '00:00';
      
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '00:00';
      
//       return date.toLocaleTimeString('en-US', { 
//         hour: '2-digit', 
//         minute: '2-digit',
//         hour12: true 
//       });
//     } catch (error) {
//       console.error('Error extracting time:', error);
//       return '00:00';
//     }
//   };
  
//   // Handle event registration
//   const handleEventRegistration = async (eventId, isCurrentlyRegistered) => {
//     if (!currentUser?.id) {
//       alert('Please log in to register for events.');
//       return;
//     }
    
//     try {
//       setRegistrationLoading(prev => ({ ...prev, [eventId]: true }));
      
//       if (isCurrentlyRegistered) {
//         await eventsAPI.unregisterFromEvent(eventId, currentUser.id);
//       } else {
//         await eventsAPI.registerForEvent(eventId, currentUser.id);
//       }
      
//       // Update local state
//       setEvents(prev =>
//         prev.map(event => {
//           if (event.id === eventId) {
//             const updatedRegisteredUsers = isCurrentlyRegistered
//               ? event.registeredUsers.filter(id => id !== currentUser.id)
//               : [...event.registeredUsers, currentUser.id];
            
//             return {
//               ...event,
//               isRegistered: !isCurrentlyRegistered,
//               registeredUsers: updatedRegisteredUsers,
//               attendees: updatedRegisteredUsers.length
//             };
//           }
//           return event;
//         })
//       );
      
//     } catch (err) {
//       alert(isCurrentlyRegistered ? 'Failed to unregister from event.' : 'Failed to register for event.');
//       console.error('Registration error:', err);
//     } finally {
//       setRegistrationLoading(prev => ({ ...prev, [eventId]: false }));
//     }
//   };
  
//   // FIXED: Handle search with proper error handling
//   const handleSearch = async (query) => {
//     if (!query.trim()) {
//       loadEvents();
//       return;
//     }
    
//     try {
//       setIsSearching(true);
//       setError(null);
//       const searchResults = await eventsAPI.searchEvents(query);
      
//       const transformedResults = searchResults.map(event => ({
//         id: event.id,
//         title: event.title,
//         date: event.event_date,
//         time: extractTimeFromDate(event.event_date),
//         location: event.location,
//         type: event.event_type,
//         description: event.description,
//         attendees: (event.user_ids && Array.isArray(event.user_ids)) ? event.user_ids.length : 0,
//         maxAttendees: event.number_participants || 0,
//         registeredUsers: event.user_ids || [],
//         isRegistered: event.user_ids?.includes(currentUser?.id) || false,
//         sessionLink: event.session_link
//       }));
      
//       setEvents(transformedResults);
//     } catch (err) {
//       setError('Failed to search events. Please try again.');
//       console.error('Search error:', err);
//     } finally {
//       setIsSearching(false);
//     }
//   };
  
//   // Filter events based on type and search
//   const filteredEvents = events.filter(event => {
//     const matchesFilter = filter === 'all' || event.type === filter;
//     const matchesSearch = searchQuery === '' || 
//       event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
//     return matchesFilter && matchesSearch;
//   });
  
//   // Get event type badge color
//   const getEventTypeBadgeColor = (type) => {
//     switch (type) {
//       case 'workshop':
//         return 'bg-green-100 text-green-700';
//       case 'networking':
//         return 'bg-orange-100 text-orange-700';
//       case 'mentorship_session':
//         return 'bg-purple-100 text-purple-700';
//       default:
//         return 'bg-blue-100 text-blue-700';
//     }
//   };

//   // FIXED: Format date function
//   const formatDate = (dateValue) => {
//     if (!dateValue) return 'N/A';

//     try {
//       // Handle Firestore timestamp objects
//       if (typeof dateValue === 'object' && dateValue._seconds !== undefined) {
//         const millis = dateValue._seconds * 1000 + Math.floor((dateValue._nanoseconds || 0) / 1e6);
//         const date = new Date(millis);
//         return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//       }

//       // Handle Firestore timestamp objects with toDate method
//       if (typeof dateValue === 'object' && typeof dateValue.toDate === 'function') {
//         return dateValue.toDate().toLocaleDateString();
//       }

//       // Handle Date objects
//       if (dateValue instanceof Date) {
//         return isNaN(dateValue.getTime()) ? 'Invalid Date' : dateValue.toLocaleDateString();
//       }

//       // Handle ISO string dates
//       if (typeof dateValue === 'string') {
//         const date = new Date(dateValue);
//         return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//       }

//       // Handle timestamp numbers
//       if (typeof dateValue === 'number') {
//         const date = new Date(dateValue);
//         return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
//       }

//       return 'N/A';
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return 'Invalid Date';
//     }
//   };
  
//   // Check if event is in the past
//   const isEventPast = (dateString) => {
//     try {
//       if (!dateString) return false;
//       const eventDate = new Date(dateString);
//       return !isNaN(eventDate.getTime()) && eventDate < new Date();
//     } catch {
//       return false;
//     }
//   };
  
//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border p-6">
//         <div className="animate-pulse space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="h-32 bg-gray-200 rounded"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <div className="bg-white rounded-lg shadow-sm border p-6">
//         <div className="text-center py-8">
//           <div className="text-red-500 mb-4">{error}</div>
//           <button
//             onClick={loadEvents}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border">
//       <div className="p-6 border-b">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold text-gray-900">Events Calendar</h2>
//           {currentUser?.userRole === 'admin' && (
//             <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
//               <Plus className="w-4 h-4" />
//               Create Event
//             </button>
//           )}
//         </div>
        
//         {/* Search Bar */}
//         <div className="mb-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search events by title, location, or description..."
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 handleSearch(e.target.value);
//               }}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//             />
//             {isSearching && (
//               <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Filter Buttons */}
//         <div className="flex gap-2 flex-wrap">
//           {['all', 'workshop', 'networking', 'mentorship_session', 'other'].map((type) => (
//             <button
//               key={type}
//               onClick={() => setFilter(type)}
//               className={`px-3 py-1 rounded-full text-sm capitalize ${
//                 filter === type
//                   ? 'bg-purple-100 text-purple-700'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               {type === 'mentorship_session' ? 'Mentorship' : type}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="p-6">
//         {filteredEvents.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             {searchQuery ? 'No events found matching your search.' : 'No events available.'}
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredEvents.map((event) => {
//               const isPastEvent = isEventPast(event.date);
//               const isLoadingRegistration = registrationLoading[event.id];
//               const isFull = event.attendees >= event.maxAttendees;
              
//               return (
//                 <div key={event.id} className={`border rounded-lg p-4 ${isPastEvent ? 'opacity-75 bg-gray-50' : 'hover:bg-gray-50'}`}>
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2">
//                         <h3 className="font-medium text-gray-900">{event.title}</h3>
//                         <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeBadgeColor(event.type)}`}>
//                           {event.type === 'mentorship_session' ? 'Mentorship' : event.type}
//                         </span>
//                         {isPastEvent && (
//                           <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
//                             Past Event
//                           </span>
//                         )}
//                       </div>
                      
//                       <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      
//                       <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
//                         <span className="flex items-center gap-1">
//                           <Calendar className="w-4 h-4" />
//                           {formatDate(event.date)}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Clock className="w-4 h-4" />
//                           {event.time}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <MapPin className="w-4 h-4" />
//                           {event.location}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Users className="w-4 h-4" />
//                           {event.attendees} / {event.maxAttendees} attendees
//                         </span>
//                       </div>
                      
//                       {event.sessionLink && (
//                         <div className="mt-2">
//                           <a
//                             href={event.sessionLink}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-sm text-purple-600 hover:text-purple-800"
//                           >
//                             Join Session Link →
//                           </a>
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="ml-4">
//                       {isPastEvent ? (
//                         <button className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg" disabled>
//                           Event Ended
//                         </button>
//                       ) : event.isRegistered ? (
//                         <button
//                           onClick={() => handleEventRegistration(event.id, true)}
//                           disabled={isLoadingRegistration}
//                           className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
//                         >
//                           {isLoadingRegistration ? 'Loading...' : 'Registered'}
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleEventRegistration(event.id, false)}
//                           disabled={isLoadingRegistration || isFull}
//                           className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {isLoadingRegistration ? 'Loading...' : 
//                            isFull ? 'Full' : 'Register'}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle } from 'lucide-react';

// API service for events
const eventsAPI = {
  baseURL: 'http://localhost:3000/api/v1/events',
  
  // Get authentication token from localStorage or context
  getAuthToken: () => {
    return localStorage.getItem('authToken') || '';
  },
  
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await fetch(`${eventsAPI.baseURL}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },
  
  // Register for an event - FIXED: No userId needed, backend gets it from auth token
  registerForEvent: async (eventId) => {
    try {
      const response = await fetch(`${eventsAPI.baseURL}/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        // No body needed - backend gets user ID from auth middleware
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  },
  
  // Unregister from an event - FIXED: No userId needed, backend gets it from auth token
  unregisterFromEvent: async (eventId) => {
    try {
      const response = await fetch(`${eventsAPI.baseURL}/${eventId}/unregister`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        // No body needed - backend gets user ID from auth middleware
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error unregistering from event:', error);
      throw error;
    }
  },
  
  // Search events
  searchEvents: async (query) => {
    try {
      const response = await fetch(`${eventsAPI.baseURL}/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  },
  
  // Create new event (admin only)
  createEvent: async (eventData) => {
    try {
      const response = await fetch(`${eventsAPI.baseURL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Get current user info from token
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${eventsAPI.baseURL.replace('/events', '/users/me')}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
};

// Enhanced Events Calendar Component - FIXED: No currentUser prop needed
export const EventsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  
  // Load current user and events on component mount
  useEffect(() => {
    loadCurrentUser();
    loadEvents();
  }, []);
  
  // Load current user info
  const loadCurrentUser = async () => {
    try {
      setUserLoading(true);
      const userData = await eventsAPI.getCurrentUser();
      setCurrentUser(userData);
    } catch (err) {
      console.error('Error loading current user:', err);
      // You might want to redirect to login here
    } finally {
      setUserLoading(false);
    }
  };
  
  // Load events from API
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const eventsData = await eventsAPI.getAllEvents();
      
      // Transform API data to match component expected format
      const transformedEvents = eventsData.map(event => ({
        id: event.id,
        title: event.title,
        date: event.event_date,
        time: extractTimeFromDate(event.event_date),
        location: event.location,
        type: event.event_type,
        description: event.description,
        attendees: (event.user_ids && Array.isArray(event.user_ids)) ? event.user_ids.length : 0,
        maxAttendees: event.number_participants || 0,
        registeredUsers: event.user_ids || [],
        // We'll determine registration status after getting current user
        isRegistered: false,
        sessionLink: event.session_link,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }));
      
      setEvents(transformedEvents);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Update registration status when currentUser is loaded
  useEffect(() => {
    if (currentUser && events.length > 0) {
      setEvents(prevEvents => 
        prevEvents.map(event => ({
          ...event,
          isRegistered: event.registeredUsers.includes(currentUser.id)
        }))
      );
    }
  }, [currentUser, events.length]);
  
  // Extract time from date string
  const extractTimeFromDate = (dateString) => {
    try {
      if (!dateString) return '16:00 PM';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '16:00 PM';
      
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      console.error('Error extracting time:', error);
      return '16:00 PM';
    }
  };
  
  // Handle event registration - FIXED: No user ID needed
  const handleEventRegistration = async (eventId, isCurrentlyRegistered) => {
    // Check if user is authenticated
    const token = eventsAPI.getAuthToken();
    if (!token) {
      alert('Please log in to register for events.');
      return;
    }
    
    try {
      setRegistrationLoading(prev => ({ ...prev, [eventId]: true }));
      
      let response;
      if (isCurrentlyRegistered) {
        response = await eventsAPI.unregisterFromEvent(eventId);
      } else {
        response = await eventsAPI.registerForEvent(eventId);
      }
      
      // Update local state based on the response
      setEvents(prev =>
        prev.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              isRegistered: !isCurrentlyRegistered,
              attendees: response.registeredUsers || (isCurrentlyRegistered ? event.attendees - 1 : event.attendees + 1)
            };
          }
          return event;
        })
      );
      
      // Show success message
      const message = isCurrentlyRegistered 
        ? 'Successfully unregistered from event!' 
        : 'Successfully registered for event!';
      alert(message);
      
    } catch (err) {
      const errorMessage = err.message || (isCurrentlyRegistered ? 'Failed to unregister from event.' : 'Failed to register for event.');
      alert(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setRegistrationLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };
  
  // Handle search with proper error handling
  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadEvents();
      return;
    }
    
    try {
      setIsSearching(true);
      setError(null);
      const searchResults = await eventsAPI.searchEvents(query);
      
      const transformedResults = searchResults.map(event => ({
        id: event.id,
        title: event.title,
        date: event.event_date,
        time: extractTimeFromDate(event.event_date),
        location: event.location,
        type: event.event_type,
        description: event.description,
        attendees: (event.user_ids && Array.isArray(event.user_ids)) ? event.user_ids.length : 0,
        maxAttendees: event.number_participants || 0,
        registeredUsers: event.user_ids || [],
        isRegistered: currentUser ? event.user_ids?.includes(currentUser.id) || false : false,
        sessionLink: event.session_link
      }));
      
      setEvents(transformedResults);
    } catch (err) {
      setError('Failed to search events. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Filter events based on type and search
  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.type === filter;
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Get event type badge color
  const getEventTypeBadgeColor = (type) => {
    switch (type) {
      case 'workshop':
        return 'bg-green-100 text-green-700';
      case 'networking':
        return 'bg-orange-100 text-orange-700';
      case 'mentorship_session':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  // Format date function
  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';

    try {
      // Handle Firestore timestamp objects
      if (typeof dateValue === 'object' && dateValue._seconds !== undefined) {
        const millis = dateValue._seconds * 1000 + Math.floor((dateValue._nanoseconds || 0) / 1e6);
        const date = new Date(millis);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
      }

      // Handle Firestore timestamp objects with toDate method
      if (typeof dateValue === 'object' && typeof dateValue.toDate === 'function') {
        return dateValue.toDate().toLocaleDateString();
      }

      // Handle Date objects
      if (dateValue instanceof Date) {
        return isNaN(dateValue.getTime()) ? 'Invalid Date' : dateValue.toLocaleDateString();
      }

      // Handle ISO string dates
      if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
      }

      // Handle timestamp numbers
      if (typeof dateValue === 'number') {
        const date = new Date(dateValue);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
      }

      return 'N/A';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };
  
  // Check if event is in the past
  const isEventPast = (dateString) => {
    try {
      if (!dateString) return false;
      const eventDate = new Date(dateString);
      return !isNaN(eventDate.getTime()) && eventDate < new Date();
    } catch {
      return false;
    }
  };
  
  if (loading || userLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={loadEvents}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Events Calendar</h2>
          {currentUser?.userRole === 'admin' && (
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Event
            </button>
          )}
        </div>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events by title, location, or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'workshop', 'networking', 'mentorship_session', 'other'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${
                filter === type
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'mentorship_session' ? 'Mentorship' : type}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No events found matching your search.' : 'No events available.'}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const isPastEvent = isEventPast(event.date);
              const isLoadingRegistration = registrationLoading[event.id];
              const isFull = event.attendees >= event.maxAttendees;
              
              return (
                <div key={event.id} className={`border rounded-lg p-4 ${isPastEvent ? 'opacity-75 bg-gray-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeBadgeColor(event.type)}`}>
                          {event.type === 'mentorship_session' ? 'Mentorship' : event.type}
                        </span>
                        {isPastEvent && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            Past Event
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.attendees} / {event.maxAttendees} attendees
                        </span>
                      </div>
                      
                      {event.sessionLink && (
                        <div className="mt-2">
                          <a
                            href={event.sessionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:text-purple-800"
                          >
                            Join Session Link →
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      {isPastEvent ? (
                        <button className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg" disabled>
                          Event Ended
                        </button>
                      ) : event.isRegistered ? (
                        <button
                          onClick={() => handleEventRegistration(event.id, true)}
                          disabled={isLoadingRegistration}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
                        >
                          {isLoadingRegistration ? 'Loading...' : 'Registered'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEventRegistration(event.id, false)}
                          disabled={isLoadingRegistration || isFull}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoadingRegistration ? 'Loading...' : 
                           isFull ? 'Full' : 'Register'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};