// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Users, Award, BookOpen, Video, CheckCircle, Star, Filter, Search, Play, ExternalLink, Globe, Download, ChevronRight } from 'lucide-react';

// // OnlineCourse Component
// const OnlineCourse = ({ 
//   course, 
//   enrollment, 
//   certification, 
//   courseModules = [], 
//   onEnroll, 
//   onViewModules, 
//   onPlayVideo 
// }) => {
//   const [loading, setLoading] = useState(false);

//   // Extract YouTube video ID from URL
//   const getYouTubeVideoId = (url) => {
//     if (!url) return null;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   // Generate Google Meet link (for demonstration)
//   const generateMeetLink = (courseId) => {
//     return `https://meet.google.com/${courseId}-${Math.random().toString(36).substr(2, 9)}`;
//   };

//   const handleEnroll = async () => {
//     setLoading(true);
//     try {
//       await onEnroll(course.id);
//     } catch (error) {
//       console.error('Error enrolling:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePlayPreview = () => {
//     const firstModule = courseModules[0];
//     if (firstModule) {
//       const videoId = getYouTubeVideoId(firstModule.media_url);
//       if (videoId) {
//         onPlayVideo(`https://www.youtube.com/embed/${videoId}`);
//       }
//     }
//   };

//   const videoId = courseModules.length > 0 ? getYouTubeVideoId(courseModules[0]?.media_url) : null;

//   return (
//     <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
//       {/* Course Header with Gradient */}
//       <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
//         <div className="absolute inset-0 bg-black bg-opacity-20"></div>
//         <div className="absolute top-4 left-4">
//           <div className="px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm bg-blue-500 bg-opacity-30">
//             <div className="flex items-center">
//               <BookOpen className="w-3 h-3 mr-1" />
//               Online Course
//             </div>
//           </div>
//         </div>
//         <div className="absolute top-4 right-4">
//           <div className="flex items-center space-x-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
//             <Star className="w-3 h-3 text-yellow-300 fill-current" />
//             <span className="text-xs font-medium text-white">{course.rating || '4.5'}</span>
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="mb-4">
//           <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
//             {course.title}
//           </h3>
//           <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
//         </div>

//         <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <Clock className="w-4 h-4 mr-1 text-blue-500" />
//               {course.duration}
//             </div>
//             <div className="flex items-center">
//               <Users className="w-4 h-4 mr-1 text-green-500" />
//               {course.enrolled || 0}
//             </div>
//           </div>
//           <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
//             by {course.instructor_name}
//           </div>
//         </div>

//         {/* Progress Bar for Enrolled Courses */}
//         {enrollment && (
//           <div className="mb-4">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm font-medium text-gray-700">Progress</span>
//               <span className="text-sm text-blue-600 font-semibold">{enrollment.progress || 0}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//               <div 
//                 className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
//                 style={{ width: `${enrollment.progress || 0}%` }}
//               ></div>
//             </div>
//           </div>
//         )}

//         {/* Certification Badge */}
//         {certification && (
//           <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <Award className="w-5 h-5 text-green-600 mr-2" />
//                 <span className="text-green-800 font-semibold">Certified</span>
//               </div>
//               <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
//                 <Download className="w-4 h-4 mr-1" />
//                 Download
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Online Course Specific Features */}
//         <div className="mb-4 space-y-2">
//           {videoId && (
//             <button
//               onClick={handlePlayPreview}
//               className="w-full flex items-center justify-center py-2 px-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors group"
//             >
//               <Play className="w-4 h-4 mr-2 text-red-600" />
//               <span className="text-red-700 font-medium">Watch Preview</span>
//             </button>
//           )}
//           <button
//             onClick={() => window.open(generateMeetLink(course.id), '_blank')}
//             className="w-full flex items-center justify-center py-2 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
//           >
//             <Globe className="w-4 h-4 mr-2 text-blue-600" />
//             <span className="text-blue-700 font-medium">Join Live Session</span>
//           </button>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex space-x-2">
//           {!enrollment ? (
//             <button
//               onClick={handleEnroll}
//               disabled={loading}
//               className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {loading ? 'Enrolling...' : 'Enroll Now'}
//             </button>
//           ) : (
//             <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
//               Continue Learning
//             </button>
//           )}
          
//           <button
//             onClick={() => onViewModules(course)}
//             className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center"
//           >
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Regular CourseCard Component (for non-online courses)
// const CourseCard = ({ course, enrollment, certification, courseModules, onEnroll, onShowModules, generateMeetLink, getYouTubeVideoId }) => {
//   const [loading, setLoading] = useState(false);

//   const handleEnroll = async () => {
//     setLoading(true);
//     try {
//       await onEnroll(course.id);
//     } catch (error) {
//       console.error('Error enrolling:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getTypeColor = (type) => {
//     switch (type) {
//       case 'webinar': return 'from-green-500 to-green-600';
//       case 'certification': return 'from-purple-500 to-purple-600';
//       default: return 'from-blue-500 to-blue-600';
//     }
//   };

//   const getTypeIcon = (type) => {
//     switch (type) {
//       case 'webinar': return Video;
//       case 'certification': return Award;
//       default: return BookOpen;
//     }
//   };

//   const TypeIcon = getTypeIcon(course.course_type);

//   return (
//     <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
//       <div className={`h-32 bg-gradient-to-br ${getTypeColor(course.course_type)} relative overflow-hidden`}>
//         <div className="absolute inset-0 bg-black bg-opacity-20"></div>
//         <div className="absolute top-4 left-4">
//           <div className="px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm bg-white bg-opacity-30">
//             <div className="flex items-center">
//               <TypeIcon className="w-3 h-3 mr-1" />
//               {course.course_type === 'webinar' ? 'Live Webinar' : 
//                course.course_type === 'certification' ? 'Certification' : 'Course'}
//             </div>
//           </div>
//         </div>
//         <div className="absolute top-4 right-4">
//           <div className="flex items-center space-x-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
//             <Star className="w-3 h-3 text-yellow-300 fill-current" />
//             <span className="text-xs font-medium text-white">{course.rating || '4.5'}</span>
//           </div>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="mb-4">
//           <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
//             {course.title}
//           </h3>
//           <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
//         </div>

//         <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <Clock className="w-4 h-4 mr-1 text-blue-500" />
//               {course.duration}
//             </div>
//             <div className="flex items-center">
//               <Users className="w-4 h-4 mr-1 text-green-500" />
//               {course.enrolled || 0}
//             </div>
//           </div>
//           <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
//             by {course.instructor_name}
//           </div>
//         </div>

//         {enrollment && (
//           <div className="mb-4">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm font-medium text-gray-700">Progress</span>
//               <span className="text-sm text-blue-600 font-semibold">{enrollment.progress || 0}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//               <div 
//                 className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
//                 style={{ width: `${enrollment.progress || 0}%` }}
//               ></div>
//             </div>
//           </div>
//         )}

//         {certification && (
//           <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <Award className="w-5 h-5 text-green-600 mr-2" />
//                 <span className="text-green-800 font-semibold">Certified</span>
//               </div>
//               <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
//                 <Download className="w-4 h-4 mr-1" />
//                 Download
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="flex space-x-2">
//           {!enrollment ? (
//             <button
//               onClick={handleEnroll}
//               disabled={loading}
//               className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               {loading ? 'Enrolling...' : 'Enroll Now'}
//             </button>
//           ) : (
//             <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
//               Continue Learning
//             </button>
//           )}
          
//           <button
//             onClick={() => onShowModules(course)}
//             className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center"
//           >
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnlineCourse;

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, Award, BookOpen, Video, CheckCircle, Star, 
  Filter, Search, Play, ExternalLink, Globe, Download, ChevronRight,
  MessageCircle, Send, Mic, MicOff, Camera, CameraOff, Monitor,
  Settings, Phone, PhoneOff, Volume2, VolumeX, MoreVertical,
  ArrowLeft, Share2, Edit3, Smile, Paperclip, X, Loader2, AlertCircle
} from 'lucide-react';

const OnlineCourse = () => {
  const [currentView, setCurrentView] = useState('courses'); // 'courses' or 'meeting'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  
  // Loading and error states
  const [courses, setCourses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // API Base URL - Replace with your actual API endpoint
  const API_BASE_URL = 'http://localhost:3000/api/v1';

  // Fixed auth token management - now matches your main component
  const getAuthToken = () => {
    // Get token from localStorage first, then fallback
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No auth token found in localStorage');
      return null;
    }
    
    return token;
  };

  // Enhanced API request helper with better error handling
  const makeApiRequest = async (url, options = {}) => {
    const token = getAuthToken();
    
    // If no token, don't make the request and use fallback data
    if (!token) {
      console.warn('No authentication token available, using fallback data');
      throw new Error('No authentication token');
    }
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      // Handle different types of responses
      if (response.status === 401) {
        console.warn('Authentication failed - token may be expired');
        // Clear invalid token
        localStorage.removeItem('authToken');
        throw new Error('Authentication failed');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  // Fetch courses from API with fallback data
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await makeApiRequest(`${API_BASE_URL}/training_courses?type=online`);
      
      // Handle different response structures
      const coursesData = data.courses || data.data || data || [];
      const onlineCourses = Array.isArray(coursesData) 
        ? coursesData.filter(course => course.course_type === 'online' || course.type === 'online')
        : [];
      
      setCourses(onlineCourses);
      
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Unable to connect to server. Please check your connection and login status.');
      
      // Enhanced fallback data
      setCourses([
        {
          id: 1,
          title: 'Leadership Training and Development',
          description: 'Comprehensive leadership development program focusing on modern management techniques and team building strategies. Learn essential skills for effective leadership in today\'s dynamic workplace.',
          instructor_name: 'Dr. Sarah Johnson',
          duration: '6 weeks',
          course_type: 'online',
          rating: 4.8,
          enrolled: 1247,
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
          status: 'active',
          created_at: new Date().toISOString(),
          tags: ['Leadership', 'Management', 'Professional Development']
        },
        {
          id: 2,
          title: 'Gender Equality in Workplace',
          description: 'Understanding and implementing gender equality practices in professional environments. Create inclusive workplaces that promote diversity and equal opportunities.',
          instructor_name: 'Prof. Maria Rodriguez',
          duration: '4 weeks',
          course_type: 'online',
          rating: 4.9,
          enrolled: 892,
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
          status: 'active',
          created_at: new Date().toISOString(),
          tags: ['Gender Equality', 'Diversity', 'Workplace Culture']
        },
        {
          id: 3,
          title: 'Digital Leadership Excellence',
          description: 'Master digital transformation leadership skills for the modern era. Learn to lead remote teams and navigate digital workplace challenges.',
          instructor_name: 'Dr. Michael Chen',
          duration: '8 weeks',
          course_type: 'online',
          rating: 4.7,
          enrolled: 654,
          video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop',
          status: 'active',
          created_at: new Date().toISOString(),
          tags: ['Digital Leadership', 'Remote Work', 'Technology']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch participants for a specific course
  const fetchParticipants = async (courseId) => {
    try {
      const data = await makeApiRequest(`${API_BASE_URL}/courses/${courseId}/participants`);
      const participantsData = data.participants || data.data || data || [];
      setParticipants(participantsData);
    } catch (err) {
      console.error('Error fetching participants:', err);
      // Enhanced fallback participants data
      setParticipants([
        { 
          id: 1,
          name: 'Raissa Abjuru', 
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
          status: 'online',
          role: 'participant'
        },
        { 
          id: 2,
          name: 'Ishimwe Noala', 
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          status: 'online',
          role: 'participant'
        },
        { 
          id: 3,
          name: 'Ketty Leina', 
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          status: 'online',
          role: 'participant'
        },
        { 
          id: 4,
          name: 'Raissa Ingabire', 
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          status: 'online',
          role: 'participant'
        },
        { 
          id: 5,
          name: 'Pamella Uwicyeza', 
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
          status: 'online',
          role: 'participant'
        },
        { 
          id: 6,
          name: 'Gefly Jessica', 
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          status: 'online',
          role: 'participant'
        }
      ]);
    }
  };

  // Fetch chat messages for a course
  const fetchChatMessages = async (courseId) => {
    try {
      setChatLoading(true);
      const data = await makeApiRequest(`${API_BASE_URL}/training_courses/${courseId}/messages`);
      const messagesData = data.messages || data.data || data || [];
      setChatMessages(messagesData);
    } catch (err) {
      console.error('Error fetching messages:', err);
      // Enhanced fallback messages
      setChatMessages([
        {
          id: 1,
          user_id: 1,
          user_name: 'Amir',
          message: 'Hello everyone! How are you all doing today?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 2,
          user_id: 2,
          user_name: 'Jessica',
          message: 'Hi Amir! Great to be here for this session.',
          timestamp: new Date(Date.now() - 3500000).toISOString(),
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face'
        },
        {
          id: 3,
          user_id: 3,
          user_name: 'Anna',
          message: 'Hey everyone! What\'s the main topic for this week\'s discussion?',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (courseId, message) => {
    try {
      setSendingMessage(true);
      
      const data = await makeApiRequest(`${API_BASE_URL}/courses/${courseId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          message: message,
          course_id: courseId,
          timestamp: new Date().toISOString()
        })
      });

      // Add the new message to the chat
      const newMsg = {
        id: data.id || Date.now(),
        user_id: 'current_user',
        user_name: 'You',
        message: message,
        timestamp: new Date().toISOString(),
        isCurrentUser: true
      };
      
      setChatMessages(prev => [...prev, newMsg]);
      
    } catch (err) {
      console.error('Error sending message:', err);
      // Fallback: add message locally even if API fails
      const newMsg = {
        id: Date.now(),
        user_id: 'current_user',
        user_name: 'You',
        message: message,
        timestamp: new Date().toISOString(),
        isCurrentUser: true
      };
      setChatMessages(prev => [...prev, newMsg]);
    } finally {
      setSendingMessage(false);
    }
  };

  // Enroll in a course
  const enrollInCourse = async (courseId) => {
    try {
      const data = await makeApiRequest(`${API_BASE_URL}/courses/${courseId}/enroll`, {
        method: 'POST'
      });

      console.log('Enrolled successfully:', data);
      
      // Refresh courses to update enrollment status
      await fetchCourses();
      alert('Successfully enrolled in the course!');
      
    } catch (err) {
      console.error('Error enrolling in course:', err);
      alert('Unable to enroll at this time. Please check your connection and try again.');
    }
  };

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (err) {
      return new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedCourse) {
      await sendMessage(selectedCourse.id, newMessage);
      setNewMessage('');
    }
  };

  // Handle joining a course
  const handleJoinCourse = async (course) => {
    const token = getAuthToken();
    if (!token) {
      alert('Please log in to join the course session.');
      return;
    }

    setSelectedCourse(course);
    setCurrentView('meeting');
    
    // Fetch course-specific data
    await Promise.all([
      fetchParticipants(course.id),
      fetchChatMessages(course.id)
    ]);
  };

  // Handle leaving meeting
  const handleLeaveMeeting = () => {
    setCurrentView('courses');
    setSelectedCourse(null);
    setChatMessages([]);
    setParticipants([]);
  };

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  // Auto-refresh chat messages when in meeting - only if authenticated
  useEffect(() => {
    let interval;
    if (currentView === 'meeting' && selectedCourse && getAuthToken()) {
      interval = setInterval(() => {
        fetchChatMessages(selectedCourse.id);
      }, 30000); // Refresh every 30 seconds to reduce server load
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentView, selectedCourse]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  // Courses List View - Mobile Only
  if (currentView === 'courses') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-sm mx-auto">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Gender Equality Leadership Empowerment Platform
            </h1>
            <p className="text-gray-600 text-sm">Professional Online Courses</p>
            {error && (
              <div className="mt-2 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                {error}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Course Header */}
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={course.thumbnail_url || course.thumbnailUrl || 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <div className="px-2 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm bg-blue-500 bg-opacity-80">
                      <div className="flex items-center">
                        <Video className="w-3 h-3 mr-1" />
                        {course.status === 'live' ? 'Live Now' : 'Online Course'}
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center space-x-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-300 fill-current" />
                      <span className="text-xs font-medium text-white">{course.rating || '4.5'}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 leading-tight">
                      {course.title}
                    </h3>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{course.description}</p>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="text-xs">{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-green-500" />
                        <span className="text-xs">{course.enrolled || 0}</span>
                      </div>
                    </div>
                    <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      by {course.instructor_name}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleJoinCourse(course)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg text-sm"
                    >
                      Join Live Session
                    </button>
                    <button
                      onClick={() => enrollInCourse(course.id)}
                      className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-xl font-medium transition-colors text-sm"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Meeting View - Mobile Only
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={handleLeaveMeeting}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`p-2 rounded-full ${isCameraOff ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {isCameraOff ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <h2 className="font-semibold text-gray-900 text-sm truncate">{selectedCourse?.title}</h2>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <div className={`w-2 h-2 ${isRecording ? 'bg-red-500' : 'bg-gray-400'} rounded-full mr-2`}></div>
          {isRecording ? 'Recording' : 'Not Recording'} 26:32
          <span className="ml-4">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 bg-gray-900 relative min-h-[250px]">
        <div className="absolute inset-0">
          <iframe
            src={selectedCourse?.video_url || selectedCourse?.videoUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Overlay with course information */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-8 bg-gradient-to-r from-blue-500 to-yellow-400 rounded overflow-hidden flex items-center justify-center">
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm line-clamp-1">{selectedCourse?.title}</h3>
                <p className="text-xs opacity-90">with {selectedCourse?.instructor_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Grid - Mobile */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Participants ({participants.length})</h3>
        <div className="grid grid-cols-3 gap-2">
          {participants.slice(0, 6).map((participant, index) => (
            <div key={participant.id || index} className="relative">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src={participant.avatar} 
                  alt={participant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=6366f1&color=fff`;
                  }}
                />
              </div>
              <div className="absolute bottom-1 left-1 right-1">
                <div className="bg-black bg-opacity-60 text-white text-xs px-1 py-1 rounded text-center truncate">
                  {participant.name}
                  {participant.status === 'online' && (
                    <div className="w-1 h-1 bg-green-400 rounded-full inline-block ml-1"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 bg-white flex flex-col max-h-[300px]">
        {/* Chat Header */}
        <div className="p-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm">Live Chat</h3>
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              {participants.length} online
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
          {chatLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <MessageCircle className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <img
                  src={message.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.user_name)}&background=6366f1&color=fff`}
                  alt={message.user_name}
                  className="w-6 h-6 rounded-full flex-shrink-0"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(message.user_name)}&background=6366f1&color=fff`;
                  }}
                />
                <div className={`flex-1 ${message.isCurrentUser ? 'text-right' : ''}`}>
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-xs font-medium text-gray-900">
                      {message.user_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`inline-block px-2 py-1 rounded-lg text-xs max-w-xs break-words ${
                      message.isCurrentUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.message}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={sendingMessage}
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendingMessage}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              {sendingMessage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-opacity-80 transition-colors`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`p-3 rounded-full ${isCameraOff ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-opacity-80 transition-colors`}
          >
            {isCameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
          </button>
          <button
            onClick={handleLeaveMeeting}
            className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineCourse;