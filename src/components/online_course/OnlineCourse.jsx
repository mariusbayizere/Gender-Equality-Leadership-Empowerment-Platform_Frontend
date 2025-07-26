// import React, { useState } from 'react';
// import { Clock, Users, Award, BookOpen, Star, Play, Globe, Download, ChevronRight, CheckCircle, ExternalLink } from 'lucide-react';

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

// export default OnlineCourse;



import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Award, BookOpen, Video, CheckCircle, Star, Filter, Search, Play, ExternalLink, Globe, Download, ChevronRight } from 'lucide-react';

// OnlineCourse Component
const OnlineCourse = ({ 
  course, 
  enrollment, 
  certification, 
  courseModules = [], 
  onEnroll, 
  onViewModules, 
  onPlayVideo 
}) => {
  const [loading, setLoading] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Generate Google Meet link (for demonstration)
  const generateMeetLink = (courseId) => {
    return `https://meet.google.com/${courseId}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await onEnroll(course.id);
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPreview = () => {
    const firstModule = courseModules[0];
    if (firstModule) {
      const videoId = getYouTubeVideoId(firstModule.media_url);
      if (videoId) {
        onPlayVideo(`https://www.youtube.com/embed/${videoId}`);
      }
    }
  };

  const videoId = courseModules.length > 0 ? getYouTubeVideoId(courseModules[0]?.media_url) : null;

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      {/* Course Header with Gradient */}
      <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm bg-blue-500 bg-opacity-30">
            <div className="flex items-center">
              <BookOpen className="w-3 h-3 mr-1" />
              Online Course
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-300 fill-current" />
            <span className="text-xs font-medium text-white">{course.rating || '4.5'}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-green-500" />
              {course.enrolled || 0}
            </div>
          </div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            by {course.instructor_name}
          </div>
        </div>

        {/* Progress Bar for Enrolled Courses */}
        {enrollment && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-blue-600 font-semibold">{enrollment.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${enrollment.progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Certification Badge */}
        {certification && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-semibold">Certified</span>
              </div>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
          </div>
        )}

        {/* Online Course Specific Features */}
        <div className="mb-4 space-y-2">
          {videoId && (
            <button
              onClick={handlePlayPreview}
              className="w-full flex items-center justify-center py-2 px-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors group"
            >
              <Play className="w-4 h-4 mr-2 text-red-600" />
              <span className="text-red-700 font-medium">Watch Preview</span>
            </button>
          )}
          <button
            onClick={() => window.open(generateMeetLink(course.id), '_blank')}
            className="w-full flex items-center justify-center py-2 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
          >
            <Globe className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-blue-700 font-medium">Join Live Session</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {!enrollment ? (
            <button
              onClick={handleEnroll}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Enrolling...' : 'Enroll Now'}
            </button>
          ) : (
            <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Continue Learning
            </button>
          )}
          
          <button
            onClick={() => onViewModules(course)}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Regular CourseCard Component (for non-online courses)
const CourseCard = ({ course, enrollment, certification, courseModules, onEnroll, onShowModules, generateMeetLink, getYouTubeVideoId }) => {
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await onEnroll(course.id);
    } catch (error) {
      console.error('Error enrolling:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'webinar': return 'from-green-500 to-green-600';
      case 'certification': return 'from-purple-500 to-purple-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'webinar': return Video;
      case 'certification': return Award;
      default: return BookOpen;
    }
  };

  const TypeIcon = getTypeIcon(course.course_type);

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
      <div className={`h-32 bg-gradient-to-br ${getTypeColor(course.course_type)} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm bg-white bg-opacity-30">
            <div className="flex items-center">
              <TypeIcon className="w-3 h-3 mr-1" />
              {course.course_type === 'webinar' ? 'Live Webinar' : 
               course.course_type === 'certification' ? 'Certification' : 'Course'}
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center space-x-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 text-yellow-300 fill-current" />
            <span className="text-xs font-medium text-white">{course.rating || '4.5'}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-blue-500" />
              {course.duration}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-green-500" />
              {course.enrolled || 0}
            </div>
          </div>
          <div className="text-xs bg-gray-100 px-2 py-1 rounded-full">
            by {course.instructor_name}
          </div>
        </div>

        {enrollment && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-blue-600 font-semibold">{enrollment.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${enrollment.progress || 0}%` }}
              ></div>
            </div>
          </div>
        )}

        {certification && (
          <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800 font-semibold">Certified</span>
              </div>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          {!enrollment ? (
            <button
              onClick={handleEnroll}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Enrolling...' : 'Enroll Now'}
            </button>
          ) : (
            <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Continue Learning
            </button>
          )}
          
          <button
            onClick={() => onShowModules(course)}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnlineCourse;
