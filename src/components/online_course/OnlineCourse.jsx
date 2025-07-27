// import React, { useState } from 'react';
// import { 
//   Calendar, Clock, Users, Award, BookOpen, Video, CheckCircle, Star, 
//   Play, ExternalLink, Globe, Loader2
// } from 'lucide-react';

// const OnlineCourseCard = ({ 
//   course, 
//   enrollment, 
//   certification, 
//   courseModules = [], 
//   onEnroll, 
//   onViewModules, 
//   onPlayVideo 
// }) => {
//   const [enrolling, setEnrolling] = useState(false);

//   const handleEnroll = async () => {
//     if (onEnroll) {
//       setEnrolling(true);
//       try {
//         await onEnroll(course.id);
//       } catch (error) {
//         console.error('Enrollment failed:', error);
//       } finally {
//         setEnrolling(false);
//       }
//     }
//   };

//   const handlePlayVideo = () => {
//     if (onPlayVideo && course.video_url) {
//       onPlayVideo(course.video_url);
//     }
//   };

//   const handleViewModules = () => {
//     if (onViewModules) {
//       onViewModules(course);
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString();
//     } catch (err) {
//       return new Date().toLocaleDateString();
//     }
//   };

//   const getYouTubeVideoId = (url) => {
//     if (!url) return null;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   const generateThumbnailUrl = (title) => {
//     const keywords = title.toLowerCase();
//     if (keywords.includes('leadership')) {
//       return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop';
//     } else if (keywords.includes('gender') || keywords.includes('equality')) {
//       return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop';
//     } else if (keywords.includes('digital')) {
//       return 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop';
//     }
//     return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop';
//   };

//   const generateTagsFromTitle = (title) => {
//     const keywords = title.toLowerCase();
//     const tags = [];
    
//     if (keywords.includes('leadership')) tags.push('Leadership');
//     if (keywords.includes('gender')) tags.push('Gender Equality');
//     if (keywords.includes('equality')) tags.push('Diversity');
//     if (keywords.includes('digital')) tags.push('Digital Leadership');
//     if (keywords.includes('management')) tags.push('Management');
//     if (keywords.includes('training')) tags.push('Professional Development');
    
//     return tags.length > 0 ? tags : ['Professional Development'];
//   };

//   // Ensure course has all required properties with defaults
//   const courseData = {
//     id: course.id,
//     title: course.title || 'Untitled Course',
//     description: course.description || 'No description available',
//     instructor_name: course.instructor_name || 'Unknown Instructor',
//     duration: course.duration || '1 hour',
//     rating: course.rating || 4.5,
//     enrolled: course.enrolled || 0,
//     video_url: course.video_url || course.media_url,
//     thumbnail_url: course.thumbnail_url || generateThumbnailUrl(course.title || ''),
//     status: course.status || (course.is_active !== false ? 'active' : 'inactive'),
//     created_at: course.created_at || new Date().toISOString(),
//     tags: course.tags || generateTagsFromTitle(course.title || ''),
//     modules_count: courseModules.length || 0
//   };

//   const isEnrolled = !!enrollment;
//   const isCertified = !!certification;
//   const hasModules = courseModules.length > 0;

//   return (
//     <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
//       {/* Course Thumbnail */}
//       <div className="h-48 relative overflow-hidden">
//         <img 
//           src={courseData.thumbnail_url} 
//           alt={courseData.title}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//           onError={(e) => {
//             e.target.src = generateThumbnailUrl(courseData.title);
//           }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
//         {/* Status Badge */}
//         <div className="absolute top-4 left-4">
//           <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm ${
//             courseData.status === 'active' 
//               ? 'bg-green-500 bg-opacity-80' 
//               : 'bg-orange-500 bg-opacity-80'
//           }`}>
//             <div className="flex items-center">
//               <Video className="w-3 h-3 mr-1" />
//               {courseData.status === 'active' ? 'Live' : 'Coming Soon'}
//             </div>
//           </div>
//         </div>

//         {/* Rating Badge */}
//         <div className="absolute top-4 right-4">
//           <div className="flex items-center space-x-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
//             <Star className="w-3 h-3 text-yellow-300 fill-current" />
//             <span className="text-xs font-medium text-white">{courseData.rating}</span>
//           </div>
//         </div>

//         {/* Play Button Overlay */}
//         {courseData.video_url && (
//           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <button
//               onClick={handlePlayVideo}
//               className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all duration-200 transform hover:scale-110"
//             >
//               <Play className="w-6 h-6 text-blue-600 fill-current" />
//             </button>
//           </div>
//         )}

//         {/* Course Title Overlay */}
//         <div className="absolute bottom-4 left-4 right-4">
//           <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 leading-tight">
//             {courseData.title}
//           </h3>
//         </div>
//       </div>

//       {/* Course Content */}
//       <div className="p-6">
//         {/* Description */}
//         <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
//           {courseData.description}
//         </p>

//         {/* Course Meta */}
//         <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center">
//               <Clock className="w-4 h-4 mr-1 text-blue-500" />
//               <span>{courseData.duration}</span>
//             </div>
//             <div className="flex items-center">
//               <Users className="w-4 h-4 mr-1 text-green-500" />
//               <span>{courseData.enrolled}</span>
//             </div>
//             {hasModules && (
//               <div className="flex items-center">
//                 <BookOpen className="w-4 h-4 mr-1 text-purple-500" />
//                 <span>{courseData.modules_count}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Instructor */}
//         <div className="flex items-center mb-4">
//           <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
//             {courseData.instructor_name.charAt(0).toUpperCase()}
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-900">{courseData.instructor_name}</p>
//             <p className="text-xs text-gray-500">Instructor</p>
//           </div>
//         </div>

//         {/* Tags */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           {courseData.tags.slice(0, 3).map((tag, idx) => (
//             <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
//               {tag}
//             </span>
//           ))}
//         </div>

//         {/* Enrollment Status */}
//         {isEnrolled && (
//           <div className="flex items-center mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
//             <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
//             <span className="text-sm font-medium text-green-700">
//               {isCertified ? 'Certified' : 'Enrolled'}
//             </span>
//             {isCertified && <Award className="w-4 h-4 text-yellow-500 ml-2" />}
//           </div>
//         )}

//         {/* Creation Date */}
//         <div className="text-xs text-gray-500 mb-4">
//           Created: {formatDate(courseData.created_at)}
//         </div>

//         {/* Action Buttons */}
//         <div className="space-y-3">
//           {/* Primary Action */}
//           {!isEnrolled ? (
//             <button
//               onClick={handleEnroll}
//               disabled={enrolling || courseData.status !== 'active'}
//               className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {enrolling ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                   Enrolling...
//                 </>
//               ) : courseData.status === 'active' ? (
//                 'Enroll Now'
//               ) : (
//                 'Coming Soon'
//               )}
//             </button>
//           ) : (
//             <button
//               onClick={handlePlayVideo}
//               disabled={!courseData.video_url}
//               className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center"
//             >
//               <Play className="w-4 h-4 mr-2" />
//               Continue Learning
//             </button>
//           )}

//           {/* Secondary Actions */}
//           <div className="flex space-x-2">
//             {hasModules && (
//               <button
//                 onClick={handleViewModules}
//                 className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
//               >
//                 <BookOpen className="w-4 h-4 mr-1" />
//                 Modules
//               </button>
//             )}
            
//             {courseData.video_url && (
//               <button
//                 onClick={handlePlayVideo}
//                 className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
//               >
//                 <Play className="w-4 h-4 mr-1" />
//                 Preview
//               </button>
//             )}

//             {getYouTubeVideoId(courseData.video_url) && (
//               <button
//                 onClick={() => window.open(courseData.video_url, '_blank')}
//                 className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
//               >
//                 <ExternalLink className="w-4 h-4 mr-1" />
//                 YouTube
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OnlineCourseCard;

import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Clock, Users, Award, BookOpen, Video, CheckCircle, Star, 
  Play, Loader2, MessageCircle, Send, Mic, MicOff,
  VideoIcon, VideoOff, PhoneOff, Settings, Maximize2, Minimize2,
  UserPlus, PlayCircle
} from 'lucide-react';
import ExpandedCourseView from './ExpandedCourseView'; // Import the separate component

const OnlineCourseCard = ({ 
  course, 
  enrollment, 
  certification, 
  courseModules = [], 
  onEnroll, 
  onViewModules, 
  onPlayVideo,
  onJoinLiveSession,
  liveSessionData = null,
  currentUser = null
}) => {
  const [enrolling, setEnrolling] = useState(false);
  const [showLiveSession, setShowLiveSession] = useState(false);
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const chatContainerRef = useRef(null);

  // Sample chat messages for demo
  useEffect(() => {
    if (showLiveSession && chatMessages.length === 0) {
      setChatMessages([
        {
          id: 1,
          user: { name: 'Sarah Johnson', avatar: 'SJ' },
          message: 'Great insights on leadership strategies!',
          timestamp: new Date(Date.now() - 300000)
        },
        {
          id: 2,
          user: { name: 'Mike Chen', avatar: 'MC' },
          message: 'Could you share the presentation slides?',
          timestamp: new Date(Date.now() - 240000)
        }
      ]);
    }
  }, [showLiveSession]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleEnroll = async () => {
    if (onEnroll) {
      setEnrolling(true);
      try {
        await onEnroll(course.id);
      } catch (error) {
        console.error('Enrollment failed:', error);
      } finally {
        setEnrolling(false);
      }
    }
  };

  const handleJoinLiveSession = async () => {
    if (onJoinLiveSession) {
      try {
        await onJoinLiveSession(course.id);
        setShowLiveSession(true);
      } catch (error) {
        console.error('Failed to join live session:', error);
      }
    } else {
      setShowLiveSession(true);
    }
  };

  const handleContinueLearning = () => {
    setShowExpandedView(true);
    if (onPlayVideo && course.video_url) {
      onPlayVideo(course.video_url);
    }
  };

  const handleCloseExpandedView = () => {
    setShowExpandedView(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentUser) {
      const message = {
        id: Date.now(),
        user: {
          name: currentUser.name || 'Anonymous User',
          avatar: currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AU'
        },
        message: newMessage.trim(),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handlePlayVideo = () => {
    if (onPlayVideo && course.video_url) {
      onPlayVideo(course.video_url);
    }
  };

  const handleViewModules = () => {
    if (onViewModules) {
      onViewModules(course);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      return new Date().toLocaleDateString();
    }
  };

  const generateThumbnailUrl = (title) => {
    const keywords = title.toLowerCase();
    if (keywords.includes('leadership')) {
      return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop';
    } else if (keywords.includes('gender') || keywords.includes('equality')) {
      return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop';
    } else if (keywords.includes('digital')) {
      return 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop';
  };

  const generateTagsFromTitle = (title) => {
    const keywords = title.toLowerCase();
    const tags = [];
    
    if (keywords.includes('leadership')) tags.push('Leadership');
    if (keywords.includes('gender')) tags.push('Gender Equality');
    if (keywords.includes('equality')) tags.push('Diversity');
    if (keywords.includes('digital')) tags.push('Digital Leadership');
    if (keywords.includes('management')) tags.push('Management');
    if (keywords.includes('training')) tags.push('Professional Development');
    
    return tags.length > 0 ? tags : ['Professional Development'];
  };

  // Ensure course has all required properties with defaults
  const courseData = {
    id: course.id,
    title: course.title || 'Untitled Course',
    description: course.description || 'No description available',
    instructor_name: course.instructor_name || 'Unknown Instructor',
    duration: course.duration || '1 hour',
    rating: course.rating || 4.5,
    enrolled: course.enrolled || 0,
    video_url: course.video_url || course.media_url,
    thumbnail_url: course.thumbnail_url || generateThumbnailUrl(course.title || ''),
    status: course.status || (course.is_active !== false ? 'active' : 'inactive'),
    created_at: course.created_at || new Date().toISOString(),
    tags: course.tags || generateTagsFromTitle(course.title || ''),
    modules_count: courseModules.length || 0,
    is_live: course.is_live || false,
    live_session_url: course.live_session_url || null
  };

  const isEnrolled = !!enrollment;
  const isCertified = !!certification;
  const hasModules = courseModules.length > 0;
  const isLiveActive = courseData.is_live && liveSessionData?.is_active;

  // Live Session Component
  const LiveSessionInterface = () => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">LIVE</span>
          </div>
          <h2 className="text-lg font-semibold">{courseData.title}</h2>
          <div className="flex items-center space-x-1 text-sm text-gray-300">
            <Users className="w-4 h-4" />
            <span>{liveSessionData?.participants_count || 24} participants</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowLiveSession(false)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <PhoneOff className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 bg-gray-800 relative flex items-center justify-center">
          {courseData.live_session_url ? (
            <iframe
              src={courseData.live_session_url}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <div className="text-center text-white">
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Live Session</h3>
              <p className="text-gray-300">Instructor: {courseData.instructor_name}</p>
            </div>
          )}

          {/* Video Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-6 py-3">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className={`p-2 rounded-full transition-colors ${
                  isAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isAudioMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
              </button>
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-2 rounded-full transition-colors ${
                  isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <VideoIcon className="w-5 h-5 text-white" />}
              </button>
              <button className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-white border-l border-gray-300 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Live Chat</h3>
              <div className="flex items-center text-sm text-gray-500">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>{chatMessages.length}</span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {msg.user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{msg.user.name}</span>
                    <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 break-words">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render expanded view if active
  if (showExpandedView) {
    return (
      <ExpandedCourseView
        courseData={courseData}
        onClose={handleCloseExpandedView}
        isEnrolled={isEnrolled}
        isCertified={isCertified}
      />
    );
  }

  // Render live session if active
  if (showLiveSession) {
    return <LiveSessionInterface />;
  }

  // Regular card view
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      {/* Course Thumbnail */}
      <div className="h-48 relative overflow-hidden">
        <img 
          src={courseData.thumbnail_url} 
          alt={courseData.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = generateThumbnailUrl(courseData.title);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            courseData.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
          }`}>
            {courseData.status === 'active' ? 'Active' : 'Inactive'}
          </div>
        </div>

        {/* Live Badge */}
        {isLiveActive && (
          <div className="absolute top-4 right-4">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        {courseData.video_url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleContinueLearning}
              className="bg-white/90 backdrop-blur-sm text-gray-900 rounded-full p-4 hover:bg-white transition-colors shadow-lg"
            >
              <Play className="w-8 h-8 fill-current" />
            </button>
          </div>
        )}

        {/* Progress Bar for Enrolled Users */}
        {isEnrolled && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-blue-500 h-1" style={{ width: '40%' }}></div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Course Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {courseData.title}
        </h3>

        {/* Instructor Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {courseData.instructor_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{courseData.instructor_name}</p>
            <p className="text-xs text-gray-500">Instructor</p>
          </div>
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              <span>{courseData.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-green-500" />
              <span>{courseData.enrolled}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
              <span>{courseData.rating}</span>
            </div>
          </div>
        </div>

        {/* Course Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
          {courseData.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {courseData.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {tag}
            </span>
          ))}
          {courseData.tags.length > 3 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{courseData.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Course Modules Preview */}
        {hasModules && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="w-4 h-4 mr-1 text-purple-500" />
                <span>{courseData.modules_count} modules available</span>
              </div>
              <button
                onClick={handleViewModules}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            </div>
          </div>
        )}

        {/* Certification Badge */}
        {isCertified && (
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
            <Award className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-yellow-700">Certificate Earned!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Main Action Button */}
          {!isEnrolled ? (
            <button
              onClick={handleEnroll}
              disabled={enrolling || courseData.status !== 'active'}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:cursor-not-allowed flex items-center justify-center"
            >
              {enrolling ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enrolling...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Enroll Now
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleContinueLearning}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Continue Learning
              </button>
              
              {/* Live Session Button */}
              {isLiveActive && (
                <button
                  onClick={handleJoinLiveSession}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Join Live Session
                </button>
              )}
            </div>
          )}

          {/* Secondary Actions */}
          {isEnrolled && (
            <div className="grid grid-cols-2 gap-2">
              {courseData.video_url && (
                <button
                  onClick={handlePlayVideo}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Watch
                </button>
              )}
              {hasModules && (
                <button
                  onClick={handleViewModules}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Modules
                </button>
              )}
            </div>
          )}
        </div>

        {/* Course Date */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Created: {formatDate(courseData.created_at)}</span>
            </div>
            {isEnrolled && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>Enrolled</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineCourseCard;