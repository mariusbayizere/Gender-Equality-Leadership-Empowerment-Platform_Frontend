// import React, { useState, useEffect } from 'react';
// import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle } from 'lucide-react';
// import {eventsAPI } from './eventsAPI'


// // Enhanced Events Calendar Component
// export const EventsCalendar = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [registrationLoading, setRegistrationLoading] = useState({});
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userLoading, setUserLoading] = useState(true);
  
//   // Load current user and events on component mount
//   useEffect(() => {
//     const initializeComponent = async () => {
//       await loadCurrentUser();
//     };
//     initializeComponent();
//   }, []);

//   // Load events after user is loaded
//   useEffect(() => {
//     if (currentUser !== null || !userLoading) {
//       loadEvents();
//     }
//   }, [currentUser, userLoading]);
  
//   // Load current user info
//   const loadCurrentUser = async () => {
//     try {
//       setUserLoading(true);
//       const token = eventsAPI.getAuthToken();
      
//       if (!token) {
//         console.warn('No auth token found');
//         setCurrentUser(null);
//         return;
//       }

//       const userData = await eventsAPI.getCurrentUser();
//       console.log('Current user loaded:', userData);
      
//       // Handle nested response structure {success: true, user: {...}}
//       const user = userData.user || userData;
//       console.log('Extracted user:', user);
//       setCurrentUser(user);
//     } catch (err) {
//       console.error('Error loading current user:', err);
//       setCurrentUser(null);
//       // Optionally redirect to login or show login message
//     } finally {
//       setUserLoading(false);
//     }
//   };
  
//   // Load events from API
//   const loadEvents = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const eventsData = await eventsAPI.getAllEvents();
      
//       console.log('Raw events data from API:', eventsData);
      
//       // Transform API data to match component expected format
//       const transformedEvents = eventsData.map(event => {
//         // Determine registration status immediately if currentUser is available
//         const isUserRegistered = currentUser && currentUser.id ? 
//           (event.user_ids || []).includes(currentUser.id) : false;
          
//         const transformedEvent = {
//           id: event.id,
//           title: event.title,
//           date: event.event_date,
//           time: extractTimeFromDate(event.event_date),
//           location: event.location,
//           type: event.event_type,
//           description: event.description,
//           attendees: (event.user_ids && Array.isArray(event.user_ids)) ? event.user_ids.length : 0,
//           maxAttendees: event.number_participants || 0,
//           registeredUsers: event.user_ids || [],
//           isRegistered: isUserRegistered,
//           sessionLink: event.session_link,
//           createdAt: event.createdAt,
//           updatedAt: event.updatedAt
//         };
        
//         console.log(`Event ${event.id}: User registered = ${isUserRegistered}, Registered users:`, event.user_ids || []);
//         return transformedEvent;
//       });
      
//       setEvents(transformedEvents);
//     } catch (err) {
//       setError('Failed to load events. Please try again later.');
//       console.error('Error loading events:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Extract time from date string
//   const extractTimeFromDate = (dateString) => {
//     try {
//       if (!dateString) return '16:00 PM';
      
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '16:00 PM';
      
//       return date.toLocaleTimeString('en-US', { 
//         hour: '2-digit', 
//         minute: '2-digit',
//         hour12: true 
//       });
//     } catch (error) {
//       console.error('Error extracting time:', error);
//       return '16:00 PM';
//     }
//   };
  
//   // Handle event registration with improved logic
//   const handleEventRegistration = async (eventId) => {
//     // Check if user is authenticated
//     const token = eventsAPI.getAuthToken();
//     if (!token || !currentUser || !currentUser.id) {
//       alert('Please log in to register for events.');
//       return;
//     }
    
//     // Prevent multiple clicks while loading
//     if (registrationLoading[eventId]) {
//       return;
//     }

//     // Find the current event
//     const currentEvent = events.find(e => e.id === eventId);
//     if (!currentEvent) {
//       console.error('Event not found:', eventId);
//       return;
//     }

//     console.log('=== REGISTRATION DEBUG ===');
//     console.log('Event ID:', eventId);
//     console.log('Current User ID:', currentUser.id);
//     console.log('Event registered users:', currentEvent.registeredUsers);
//     console.log('Event isRegistered flag:', currentEvent.isRegistered);
    
//     // Determine if user is currently registered
//     const isCurrentlyRegistered = currentEvent.registeredUsers.includes(currentUser.id);
//     console.log('Is currently registered:', isCurrentlyRegistered);
    
//     try {
//       setRegistrationLoading(prev => ({ ...prev, [eventId]: true }));
      
//       let response;
//       let newRegisteredUsers;
      
//       if (isCurrentlyRegistered) {
//         // User is registered, so unregister them
//         console.log('Unregistering user from event');
//         response = await eventsAPI.unregisterFromEvent(eventId);
//         newRegisteredUsers = currentEvent.registeredUsers.filter(id => id !== currentUser.id);
//       } else {
//         // User is not registered, so register them
//         console.log('Registering user for event');
//         response = await eventsAPI.registerForEvent(eventId);
//         newRegisteredUsers = [...currentEvent.registeredUsers, currentUser.id];
//       }
      
//       // Update the event in state immediately
//       setEvents(prev =>
//         prev.map(event => {
//           if (event.id === eventId) {
//             return {
//               ...event,
//               isRegistered: !isCurrentlyRegistered,
//               registeredUsers: newRegisteredUsers,
//               attendees: newRegisteredUsers.length
//             };
//           }
//           return event;
//         })
//       );
      
//       // Show success message
//       const message = isCurrentlyRegistered 
//         ? 'Successfully unregistered from event!' 
//         : 'Successfully registered for event!';
      
//       console.log(message);
      
//     } catch (err) {
//       console.error('Registration error:', err);
      
//       // Show error message
//       const errorMessage = err.message || 'Registration failed. Please try again.';
//       alert(errorMessage);
      
//     } finally {
//       setRegistrationLoading(prev => ({ ...prev, [eventId]: false }));
//     }
//   };
  
//   // Handle search with proper error handling
//   const handleSearch = async (query) => {
//     if (!query.trim()) {
//       loadEvents();
//       return;
//     }
    
//     try {
//       setIsSearching(true);
//       setError(null);
//       const searchResults = await eventsAPI.searchEvents(query);
      
//       const transformedResults = searchResults.map(event => {
//         // Determine registration status immediately
//         const isUserRegistered = currentUser && currentUser.id ? 
//           (event.user_ids || []).includes(currentUser.id) : false;
          
//         return {
//           id: event.id,
//           title: event.title,
//           date: event.event_date,
//           time: extractTimeFromDate(event.event_date),
//           location: event.location,
//           type: event.event_type,
//           description: event.description,
//           attendees: (event.user_ids && Array.isArray(event.user_ids)) ? event.user_ids.length : 0,
//           maxAttendees: event.number_participants || 0,
//           registeredUsers: event.user_ids || [],
//           isRegistered: isUserRegistered,
//           sessionLink: event.session_link
//         };
//       });
      
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
//         return 'bg-blue-100 text-blue-700';
//       default:
//         return 'bg-blue-100 text-blue-700';
//     }
//   };

//   // Format date function
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
  
//   if (loading || userLoading) {
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
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
//         {/* <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold text-gray-900">Events Calendar</h2>
//           {currentUser?.userRole === 'admin' && (
//             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
//               <Plus className="w-4 h-4" />
//               Create Event
//             </button>
//           )}
//         </div> */}
        
//         {/* Show login message if not authenticated */}
//         {!currentUser && (
//           <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//             <p className="text-sm text-yellow-800">
//               Please log in to register for events and access all features.
//             </p>
//           </div>
//         )}
        
//         {/* Show current user info for debugging */}
//         {/* {currentUser && (
//           <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//             <p className="text-sm text-blue-800">
//               Welcome, {currentUser.firstName} {currentUser.lastName}! (ID: {currentUser.id})
//             </p>
//           </div>
//         )}
//          */}
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
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             {isSearching && (
//               <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
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
//                   ? 'bg-blue-100 text-blue-700'
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
//               const isUserRegistered = event.isRegistered;
              
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
//                         {isUserRegistered && (
//                           <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
//                             You're Registered
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
//                             className="text-sm text-blue-600 hover:text-blue-800"
//                           >
//                             Join Session Link →
//                           </a>
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="ml-4">
//                       {!currentUser ? (
//                         <button 
//                           className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed" 
//                           disabled
//                           title="Please log in to register"
//                         >
//                           Login Required
//                         </button>
//                       ) : isPastEvent ? (
//                         <button className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg" disabled>
//                           Event Ended
//                         </button>
//                       ) : isUserRegistered ? (
//                         <button
//                           onClick={() => handleEventRegistration(event.id)}
//                           disabled={isLoadingRegistration}
//                           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
//                           title="Click to unregister from this event"
//                         >
//                           {isLoadingRegistration ? (
//                             <>
//                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                               Unregistering...
//                             </>
//                           ) : (
//                             <>
//                               ✓ Registered
//                             </>
//                           )}
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleEventRegistration(event.id)}
//                           disabled={isLoadingRegistration || isFull}
//                           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                           title={isFull ? "Event is full" : "Click to register for this event"}
//                         >
//                           {isLoadingRegistration ? (
//                             <>
//                               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                               Registering...
//                             </>
//                           ) : (
//                             isFull ? 'Full' : 'Register'
//                           )}
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
import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import {eventsAPI } from './eventsAPI'


// Enhanced Events Calendar Component
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
  const [showPastEvents, setShowPastEvents] = useState(false);
  
  // Check if event is in the past
  const isEventPast = (dateString) => {
    try {
      if (!dateString) return false;
      
      let eventDate;
      
      // Handle different date formats
      if (typeof dateString === 'object' && dateString._seconds !== undefined) {
        // Firestore timestamp
        const millis = dateString._seconds * 1000 + Math.floor((dateString._nanoseconds || 0) / 1e6);
        eventDate = new Date(millis);
      } else if (typeof dateString === 'object' && typeof dateString.toDate === 'function') {
        // Firestore timestamp with toDate method
        eventDate = dateString.toDate();
      } else {
        // String or number date
        eventDate = new Date(dateString);
      }
      
      if (isNaN(eventDate.getTime())) return false;
      
      const today = new Date();
      
      // Set both dates to start of day for accurate comparison
      today.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      
      console.log('Date comparison:', {
        eventDateString: dateString,
        eventDate: eventDate.toDateString(),
        today: today.toDateString(),
        isPast: eventDate < today
      });
      
      return eventDate < today;
    } catch (error) {
      console.error('Error in isEventPast:', error);
      return false;
    }
  };
  
  // Load current user and events on component mount
  useEffect(() => {
    const initializeComponent = async () => {
      await loadCurrentUser();
    };
    initializeComponent();
  }, []);

  // Load events after user is loaded
  useEffect(() => {
    if (currentUser !== null || !userLoading) {
      loadEvents();
    }
  }, [currentUser, userLoading]);
  
  // Load current user info
  const loadCurrentUser = async () => {
    try {
      setUserLoading(true);
      const token = eventsAPI.getAuthToken();
      
      if (!token) {
        console.warn('No auth token found');
        setCurrentUser(null);
        return;
      }

      const userData = await eventsAPI.getCurrentUser();
      console.log('Current user loaded:', userData);
      
      // Handle nested response structure {success: true, user: {...}}
      const user = userData.user || userData;
      console.log('Extracted user:', user);
      setCurrentUser(user);
    } catch (err) {
      console.error('Error loading current user:', err);
      setCurrentUser(null);
      // Optionally redirect to login or show login message
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
      
      console.log('Raw events data from API:', eventsData);
      
      // Transform API data to match component expected format
      const transformedEvents = eventsData.map(event => {
        // Determine registration status immediately if currentUser is available
        const isUserRegistered = currentUser && currentUser.id ? 
          (event.user_ids || []).includes(currentUser.id) : false;
          
        const transformedEvent = {
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
          isRegistered: isUserRegistered,
          sessionLink: event.session_link,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt
        };
        
        console.log(`Event ${event.id}: User registered = ${isUserRegistered}, Registered users:`, event.user_ids || []);
        return transformedEvent;
      });
      
      setEvents(transformedEvents);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

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
  
  // Handle event registration with improved logic
  const handleEventRegistration = async (eventId) => {
    // Check if user is authenticated
    const token = eventsAPI.getAuthToken();
    if (!token || !currentUser || !currentUser.id) {
      alert('Please log in to register for events.');
      return;
    }
    
    // Prevent multiple clicks while loading
    if (registrationLoading[eventId]) {
      return;
    }

    // Find the current event
    const currentEvent = events.find(e => e.id === eventId);
    if (!currentEvent) {
      console.error('Event not found:', eventId);
      return;
    }

    console.log('=== REGISTRATION DEBUG ===');
    console.log('Event ID:', eventId);
    console.log('Current User ID:', currentUser.id);
    console.log('Event registered users:', currentEvent.registeredUsers);
    console.log('Event isRegistered flag:', currentEvent.isRegistered);
    
    // Determine if user is currently registered
    const isCurrentlyRegistered = currentEvent.registeredUsers.includes(currentUser.id);
    console.log('Is currently registered:', isCurrentlyRegistered);
    
    try {
      setRegistrationLoading(prev => ({ ...prev, [eventId]: true }));
      
      let response;
      let newRegisteredUsers;
      
      if (isCurrentlyRegistered) {
        // User is registered, so unregister them
        console.log('Unregistering user from event');
        response = await eventsAPI.unregisterFromEvent(eventId);
        newRegisteredUsers = currentEvent.registeredUsers.filter(id => id !== currentUser.id);
      } else {
        // User is not registered, so register them
        console.log('Registering user for event');
        response = await eventsAPI.registerForEvent(eventId);
        newRegisteredUsers = [...currentEvent.registeredUsers, currentUser.id];
      }
      
      // Update the event in state immediately
      setEvents(prev =>
        prev.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              isRegistered: !isCurrentlyRegistered,
              registeredUsers: newRegisteredUsers,
              attendees: newRegisteredUsers.length
            };
          }
          return event;
        })
      );
      
      // Show success message
      const message = isCurrentlyRegistered 
        ? 'Successfully unregistered from event!' 
        : 'Successfully registered for event!';
      
      console.log(message);
      
    } catch (err) {
      console.error('Registration error:', err);
      
      // Show error message
      const errorMessage = err.message || 'Registration failed. Please try again.';
      alert(errorMessage);
      
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
      
      const transformedResults = searchResults.map(event => {
        // Determine registration status immediately
        const isUserRegistered = currentUser && currentUser.id ? 
          (event.user_ids || []).includes(currentUser.id) : false;
          
        return {
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
          isRegistered: isUserRegistered,
          sessionLink: event.session_link
        };
      });
      
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

  // Separate current/future events from past events
  const currentEvents = filteredEvents.filter(event => !isEventPast(event.date));
  const pastEvents = filteredEvents.filter(event => isEventPast(event.date));
  
  // Get event type badge color
  const getEventTypeBadgeColor = (type) => {
    switch (type) {
      case 'workshop':
        return 'bg-green-100 text-green-700';
      case 'networking':
        return 'bg-orange-100 text-orange-700';
      case 'mentorship_session':
        return 'bg-blue-100 text-blue-700';
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
  // const isEventPast = (dateString) => {
  //   try {
  //     if (!dateString) return false;
  //     const eventDate = new Date(dateString);
  //     const today = new Date();
  //     // Set today to start of day for better comparison
  //     today.setHours(0, 0, 0, 0);
  //     eventDate.setHours(0, 0, 0, 0);
  //     return !isNaN(eventDate.getTime()) && eventDate < today;
  //   } catch {
  //     return false;
  //   }
  // };

  // Render event card
  const renderEventCard = (event, isPastEvent = false) => {
    const isLoadingRegistration = registrationLoading[event.id];
    const isFull = event.attendees >= event.maxAttendees;
    const isUserRegistered = event.isRegistered;
    
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
              {isUserRegistered && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  You're Registered
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
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Join Session Link →
                </a>
              </div>
            )}
          </div>
          
          <div className="ml-4">
            {!currentUser ? (
              <button 
                className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed" 
                disabled
                title="Please log in to register"
              >
                Login Required
              </button>
            ) : isPastEvent ? (
              <button className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg" disabled>
                Event Ended
              </button>
            ) : isUserRegistered ? (
              <button
                onClick={() => handleEventRegistration(event.id)}
                disabled={isLoadingRegistration}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                title="Click to unregister from this event"
              >
                {isLoadingRegistration ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Unregistering...
                  </>
                ) : (
                  <>
                    ✓ Registered
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => handleEventRegistration(event.id)}
                disabled={isLoadingRegistration || isFull}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={isFull ? "Event is full" : "Click to register for this event"}
              >
                {isLoadingRegistration ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Registering...
                  </>
                ) : (
                  isFull ? 'Full' : 'Register'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        
        {/* Show login message if not authenticated */}
        {!currentUser && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Please log in to register for events and access all features.
            </p>
          </div>
        )}
        
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
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
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {type === 'mentorship_session' ? 'Mentorship' : type}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Current/Future Events Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Events ({currentEvents.length})
          </h3>
          
          {currentEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No upcoming events found matching your search.' : 'No upcoming events available.'}
            </div>
          ) : (
            <div className="space-y-4">
              {currentEvents.map((event) => renderEventCard(event, false))}
            </div>
          )}
        </div>

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <div>
            <button
              onClick={() => setShowPastEvents(!showPastEvents)}
              className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4 hover:text-gray-700 transition-colors"
            >
              <Clock className="w-5 h-5" />
              Past Events ({pastEvents.length})
              {showPastEvents ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {showPastEvents && (
              <div className="space-y-4">
                {pastEvents.map((event) => renderEventCard(event, true))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};