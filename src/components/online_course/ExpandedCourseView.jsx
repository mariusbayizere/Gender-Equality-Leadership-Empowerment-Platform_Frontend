// import React, { useState, useEffect } from 'react';
// import { 
//   X, Clock, BookOpen, CheckCircle, Play, ChevronRight, Users, Star, Eye,
//   BookmarkPlus, Heart, Share2, Download, PlayCircle, Volume2, VolumeX
// } from 'lucide-react';

// const ExpandedCourseView = ({ 
//   courseData = null, 
//   onClose, 
//   isEnrolled = true,
//   isCertified = false 
// }) => {
//   // HARDCODED DATA FOR TESTING
//   const hardcodedData = {
//     title: "Complete Leadership Masterclass",
//     instructor_name: "John Doe",
//     duration: "4 weeks",
//     modules_count: 10,
//     description: "Introduction to leadership principles and skills.",
//     tags: ["Leadership"],
//     rating: "4.8",
//     enrolled: "12,453",
//     video_url: "https://www.youtube.com/watch?v=fOsbEchn2oQ"
//   };

//   // Module data with individual YouTube videos
//   const moduleData = [
//     { 
//       title: "Introduction to Leadership", 
//       duration: "15 min", 
//       completed: true,
//       video_url: "https://www.youtube.com/watch?v=fOsbEchn2oQ",
//       description: "Learn the fundamentals of effective leadership"
//     },
//     { 
//       title: "Communication Skills", 
//       duration: "22 min", 
//       completed: true,
//       video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//       description: "Master verbal and non-verbal communication techniques"
//     },
//     { 
//       title: "Team Management", 
//       duration: "18 min", 
//       completed: false, 
//       current: true,
//       video_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
//       description: "Build and manage high-performing teams"
//     },
//     { 
//       title: "Conflict Resolution", 
//       duration: "25 min", 
//       completed: false,
//       video_url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
//       description: "Resolve conflicts effectively in workplace settings"
//     },
//     { 
//       title: "Strategic Planning", 
//       duration: "30 min", 
//       completed: false,
//       video_url: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
//       description: "Develop strategic thinking and planning skills"
//     },
//     { 
//       title: "Decision Making", 
//       duration: "28 min", 
//       completed: false,
//       video_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
//       description: "Master critical thinking and decision-making processes"
//     },
//     { 
//       title: "Emotional Intelligence", 
//       duration: "35 min", 
//       completed: false,
//       video_url: "https://www.youtube.com/watch?v=Y7m9eNoB3NU",
//       description: "Develop emotional awareness and interpersonal skills"
//     },
//     { 
//       title: "Change Management", 
//       duration: "32 min", 
//       completed: false,
//       video_url: "https://www.youtube.com/watch?v=iMi1dQ38M7w",
//       description: "Lead organizational change and transformation"
//     },
//     { 
//       title: "Performance Management", 
//       duration: "26 min", 
//       completed: false,
//       video_url: "https://www.youtube.com/watch?v=VFbYadm_mrw",
//       description: "Optimize team performance and productivity"
//     },
//     { 
//       title: "Leadership Ethics", 
//       duration: "20 min", 
//       completed: false,
//       video_url: "https://www.youtube.com/watch?v=JWA5hJl4Dv0",
//       description: "Build ethical leadership and moral decision-making"
//     }
//   ];

//   const [showVideo, setShowVideo] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [isMuted, setIsMuted] = useState(true);
//   const [hasUserInteracted, setHasUserInteracted] = useState(false);
//   const [currentModuleIndex, setCurrentModuleIndex] = useState(2);
//   const [modules, setModules] = useState(moduleData);
//   const [viewCount, setViewCount] = useState(0);

//   // Initialize view count
//   useEffect(() => {
//     setViewCount(Math.floor(Math.random() * 5000) + 1000);
//   }, []);

//   // Extract YouTube video ID
//   const extractVideoId = (url) => {
//     if (!url) return null;
    
//     const regexPatterns = [
//       /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
//       /youtube\.com\/.*[?&]v=([^&\n?#]+)/
//     ];
    
//     for (const pattern of regexPatterns) {
//       const match = url.match(pattern);
//       if (match && match[1]) {
//         return match[1];
//       }
//     }
//     return null;
//   };

//   // Create optimized YouTube embed URL
//   const createEmbedUrl = (videoId, autoplay = false) => {
//     if (!videoId) return null;
    
//     const params = new URLSearchParams({
//       autoplay: autoplay && hasUserInteracted ? '1' : '0',
//       mute: isMuted ? '1' : '0',
//       controls: '1',
//       rel: '0',
//       modestbranding: '1',
//       playsinline: '1',
//       enablejsapi: '1',
//       origin: window.location.origin,
//       start: '0'
//     });
    
//     return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
//   };

//   const handlePlayClick = () => {
//     setHasUserInteracted(true);
//     setLoading(true);
//     setShowVideo(true);
    
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
//   };

//   const handleModuleClick = (moduleIndex) => {
//     const newModules = [...modules];
    
//     newModules.forEach((module, index) => {
//       module.current = index === moduleIndex;
//     });
    
//     if (moduleIndex > currentModuleIndex) {
//       for (let i = currentModuleIndex; i < moduleIndex; i++) {
//         newModules[i].completed = true;
//         newModules[i].current = false;
//       }
//     }
    
//     setModules(newModules);
//     setCurrentModuleIndex(moduleIndex);
//     setShowVideo(false);
//     setHasUserInteracted(false);
//     setLoading(false);
    
//     setTimeout(() => {
//       handlePlayClick();
//     }, 500);
//   };

//   const handleClose = () => {
//     if (onClose) onClose();
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//   };

//   // Get current module and video info
//   const currentModule = modules[currentModuleIndex];
//   const currentVideoUrl = currentModule?.video_url || hardcodedData.video_url;
//   const videoId = extractVideoId(currentVideoUrl);
//   const embedUrl = createEmbedUrl(videoId, showVideo);
//   const hasValidVideo = !!videoId;

//   // Calculate progress
//   const completedModules = modules.filter(module => module.completed).length;
//   const progressPercentage = Math.round((completedModules / modules.length) * 100);

//   if (showVideo) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col">
//         {/* Video Header */}
//         <div className="bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-700">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setShowVideo(false)}
//               className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </button>
//             <div>
//               <h1 className="text-xl font-bold">{currentModule?.title}</h1>
//               <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
//                 <div className="flex items-center space-x-1">
//                   <Eye className="w-4 h-4" />
//                   <span>{viewCount.toLocaleString()} views</span>
//                 </div>
//                 <div className="flex items-center space-x-1">
//                   <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                   <span>{hardcodedData.rating}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={toggleMute}
//               className={`p-2 rounded-lg transition-colors ${
//                 isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
//               }`}
//             >
//               {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
//             </button>
//             <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
//               <BookmarkPlus className="w-5 h-5" />
//             </button>
//             <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
//               <Heart className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Video Player */}
//         <div className="flex-1 bg-black relative flex items-center justify-center">
//           {hasValidVideo ? (
//             <div className="w-full h-full relative bg-black">
//               {loading && (
//                 <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10">
//                   <div className="text-white text-center">
//                     <div className="w-16 h-16 mx-auto mb-4 relative">
//                       <PlayCircle className="w-16 h-16 animate-spin text-blue-500" />
//                     </div>
//                     <p className="text-lg font-semibold mb-2">Loading video...</p>
//                     <p className="text-gray-300 text-sm">Starting {currentModule?.title}</p>
//                   </div>
//                 </div>
//               )}
              
//               <iframe
//                 key={`${videoId}-${isMuted}-${hasUserInteracted}-${currentModuleIndex}`}
//                 src={embedUrl}
//                 title={currentModule?.title}
//                 className="w-full h-full"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                 allowFullScreen={true}
//                 onLoad={() => setLoading(false)}
//                 onError={() => setLoading(false)}
//               />
              
//               {!loading && (
//                 <div className="absolute bottom-4 left-4 right-4 z-20">
//                   <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-3">
//                     <div className="flex items-center justify-between text-white">
//                       <div className="text-sm font-medium">{currentModule?.title}</div>
//                       <div className="flex items-center space-x-2">
//                         <span className="text-xs bg-blue-600 px-2 py-1 rounded">Module {currentModuleIndex + 1}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full text-white">
//               <div className="text-center">
//                 <PlayCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
//                 <h3 className="text-xl font-semibold mb-2">Video Not Available</h3>
//                 <p className="text-gray-300">Please check the video URL</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-white z-50 flex flex-col">
//       {/* Header with dark background */}
//       <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
//         <button
//           onClick={handleClose}
//           className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
//         >
//           <X className="w-5 h-5" />
//         </button>
//         <div className="flex items-center space-x-3">
//           <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
//             <BookmarkPlus className="w-5 h-5" />
//           </button>
//           <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
//             <Heart className="w-5 h-5" />
//           </button>
//           <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
//             <Share2 className="w-5 h-5" />
//           </button>
//           <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
//             <Download className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Course Content */}
//       <div className="flex-1 overflow-y-auto bg-gray-50">
//         <div className="max-w-2xl mx-auto p-6">
//           {/* Instructor Info */}
//           <div className="flex items-center space-x-3 mb-4">
//             <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
//               J
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900">{hardcodedData.instructor_name}</h3>
//               <p className="text-sm text-gray-500">Instructor</p>
//             </div>
//           </div>

//           {/* Course Duration and Modules */}
//           <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
//             <div className="flex items-center">
//               <Clock className="w-4 h-4 mr-1" />
//               <span>{hardcodedData.duration}</span>
//             </div>
//             <div className="flex items-center">
//               <BookOpen className="w-4 h-4 mr-1" />
//               <span>0 modules</span>
//             </div>
//           </div>

//           {/* Course Description */}
//           <p className="text-gray-700 mb-4">{hardcodedData.description}</p>

//           {/* Tags */}
//           <div className="flex flex-wrap gap-2 mb-6">
//             {hardcodedData.tags.map((tag, idx) => (
//               <span key={idx} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
//                 {tag}
//               </span>
//             ))}
//           </div>

//           {/* Course Modules Section */}
//           <div className="mb-6">
//             <div className="flex items-center mb-4">
//               <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
//               <h4 className="font-semibold text-gray-900">Course Modules ({modules.length})</h4>
//             </div>

//             <div className="space-y-3">
//               {modules.map((module, idx) => (
//                 <div
//                   key={idx}
//                   onClick={() => handleModuleClick(idx)}
//                   className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
//                     module.completed
//                       ? 'bg-green-50 border-green-200'
//                       : module.current
//                       ? 'bg-blue-50 border-blue-300 border-2'
//                       : 'bg-white border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       {module.completed ? (
//                         <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
//                           <CheckCircle className="w-4 h-4 text-white" />
//                         </div>
//                       ) : module.current ? (
//                         <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                           <Play className="w-3 h-3 text-white ml-0.5" fill="white" />
//                         </div>
//                       ) : (
//                         <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
//                           <Play className="w-3 h-3 text-gray-400 ml-0.5" />
//                         </div>
//                       )}
//                       <div>
//                         <h5 className="font-medium text-gray-900">{module.title}</h5>
//                         <p className="text-sm text-gray-500">{module.duration}</p>
//                       </div>
//                     </div>
//                     <ChevronRight className="w-5 h-5 text-gray-400" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Course Progress */}
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-2">
//               <span className="font-medium text-gray-900">Course Progress</span>
//               <span className="text-gray-600">{progressPercentage}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
//                 style={{ width: `${progressPercentage}%` }}
//               ></div>
//             </div>
//             <p className="text-sm text-gray-500 mt-2">
//               {completedModules} of {modules.length} modules completed
//             </p>
//           </div>

//           {/* Continue Learning Button */}
//           <button 
//             onClick={() => handleModuleClick(currentModuleIndex)}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-colors"
//           >
//             Continue Learning
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpandedCourseView;


import React, { useState, useEffect } from 'react';
import { 
  X, Clock, BookOpen, CheckCircle, Play, ChevronRight, Users, Star, Eye,
  BookmarkPlus, Heart, Share2, Download, PlayCircle, Volume2, VolumeX
} from 'lucide-react';

const ExpandedCourseView = ({ 
  courseData = null, 
  onClose, 
  isEnrolled = true,
  isCertified = false 
}) => {
  // HARDCODED DATA FOR TESTING
  const hardcodedData = {
    title: "Complete Leadership Masterclass",
    instructor_name: "John Doe",
    duration: "4 weeks",
    modules_count: 10,
    description: "Introduction to leadership principles and skills.",
    tags: ["Leadership"],
    rating: "4.8",
    enrolled: "12,453",
    video_url: "https://www.youtube.com/watch?v=fOsbEchn2oQ"
  };

  // Module data with individual YouTube videos
  const moduleData = [
    { 
      title: "Introduction to Leadership", 
      duration: "15 min", 
      completed: true,
      video_url: "https://www.youtube.com/watch?v=fOsbEchn2oQ",
      description: "Learn the fundamentals of effective leadership"
    },
    { 
      title: "Communication Skills", 
      duration: "22 min", 
      completed: true,
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Master verbal and non-verbal communication techniques"
    },
    { 
      title: "Team Management", 
      duration: "18 min", 
      completed: false, 
      current: true,
      video_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      description: "Build and manage high-performing teams"
    },
    { 
      title: "Conflict Resolution", 
      duration: "25 min", 
      completed: false,
      video_url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      description: "Resolve conflicts effectively in workplace settings"
    },
    { 
      title: "Strategic Planning", 
      duration: "30 min", 
      completed: false,
      video_url: "https://www.youtube.com/watch?v=oHg5SJYRHA0",
      description: "Develop strategic thinking and planning skills"
    },
    { 
      title: "Decision Making", 
      duration: "28 min", 
      completed: false,
      video_url: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
      description: "Master critical thinking and decision-making processes"
    },
    { 
      title: "Emotional Intelligence", 
      duration: "35 min", 
      completed: false,
      video_url: "https://www.youtube.com/watch?v=Y7m9eNoB3NU",
      description: "Develop emotional awareness and interpersonal skills"
    },
    { 
      title: "Change Management", 
      duration: "32 min", 
      completed: false,
      video_url: "https://www.youtube.com/watch?v=iMi1dQ38M7w",
      description: "Lead organizational change and transformation"
    },
    { 
      title: "Performance Management", 
      duration: "26 min", 
      completed: false,
      video_url: "https://www.youtube.com/watch?v=VFbYadm_mrw",
      description: "Optimize team performance and productivity"
    },
    { 
      title: "Leadership Ethics", 
      duration: "20 min", 
      completed: false,
      video_url: "https://www.youtube.com/watch?v=JWA5hJl4Dv0",
      description: "Build ethical leadership and moral decision-making"
    }
  ];

  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(2);
  const [modules, setModules] = useState(moduleData);
  const [viewCount, setViewCount] = useState(0);

  // Initialize view count
  useEffect(() => {
    setViewCount(Math.floor(Math.random() * 5000) + 1000);
  }, []);

  // Extract YouTube video ID
  const extractVideoId = (url) => {
    if (!url) return null;
    
    const regexPatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/.*[?&]v=([^&\n?#]+)/
    ];
    
    for (const pattern of regexPatterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  // Create optimized YouTube embed URL
  const createEmbedUrl = (videoId, autoplay = false) => {
    if (!videoId) return null;
    
    const params = new URLSearchParams({
      autoplay: autoplay && hasUserInteracted ? '1' : '0',
      mute: isMuted ? '1' : '0',
      controls: '1',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      enablejsapi: '1',
      origin: window.location.origin,
      start: '0'
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  const handlePlayClick = () => {
    setHasUserInteracted(true);
    setLoading(true);
    setShowVideo(true);
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleModuleClick = (moduleIndex) => {
    const newModules = [...modules];
    
    newModules.forEach((module, index) => {
      module.current = index === moduleIndex;
    });
    
    if (moduleIndex > currentModuleIndex) {
      for (let i = currentModuleIndex; i < moduleIndex; i++) {
        newModules[i].completed = true;
        newModules[i].current = false;
      }
    }
    
    setModules(newModules);
    setCurrentModuleIndex(moduleIndex);
    setShowVideo(false);
    setHasUserInteracted(false);
    setLoading(false);
    
    setTimeout(() => {
      handlePlayClick();
    }, 500);
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Get current module and video info
  const currentModule = modules[currentModuleIndex];
  const currentVideoUrl = currentModule?.video_url || hardcodedData.video_url;
  const videoId = extractVideoId(currentVideoUrl);
  const embedUrl = createEmbedUrl(videoId, showVideo);
  const hasValidVideo = !!videoId;

  // Calculate progress
  const completedModules = modules.filter(module => module.completed).length;
  const progressPercentage = Math.round((completedModules / modules.length) * 100);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header with dark background */}
      <div className="bg-slate-800 text-white p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{hardcodedData.title}</h1>
        </div>
        <div className="flex items-center space-x-3">
          {showVideo && (
            <button
              onClick={toggleMute}
              className={`p-2 rounded-lg transition-colors ${
                isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
              title={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          )}
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <BookmarkPlus className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Course Content */}
        <div className="w-1/2 bg-gray-50 flex flex-col overflow-hidden">
          {/* Fixed Header Content */}
          <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white">
            {/* Instructor Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                J
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{hardcodedData.instructor_name}</h3>
                <p className="text-sm text-gray-500">Instructor</p>
              </div>
            </div>

            {/* Course Duration and Modules */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{hardcodedData.duration}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{modules.length} modules</span>
              </div>
            </div>

            {/* Course Description */}
            <p className="text-gray-700 mb-4">{hardcodedData.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {hardcodedData.tags.map((tag, idx) => (
                <span key={idx} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Modules Section with Fixed Header and Scrollable Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Fixed Modules Header */}
            <div className="flex-shrink-0 p-6 pb-4 bg-gray-50">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                <h4 className="font-semibold text-gray-900">Course Modules ({modules.length})</h4>
              </div>
            </div>
            
            {/* Scrollable Module List - This is the key fix */}
            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="space-y-3">
                {modules.map((module, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleModuleClick(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      module.completed
                        ? 'bg-green-50 border-green-200'
                        : module.current
                        ? 'bg-blue-50 border-blue-300 border-2 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {module.completed ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        ) : module.current ? (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-white ml-0.5" fill="white" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-gray-400 ml-0.5" />
                          </div>
                        )}
                        <div>
                          <h5 className="font-medium text-gray-900">{module.title}</h5>
                          <p className="text-sm text-gray-500">{module.duration}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed Bottom Content */}
          <div className="flex-shrink-0 p-6 bg-white border-t border-gray-200">
            {/* Course Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Course Progress</span>
                <span className="text-gray-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {completedModules} of {modules.length} modules completed
              </p>
            </div>

            {/* Continue Learning Button */}
            <button 
              onClick={() => handleModuleClick(currentModuleIndex)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </div>

        {/* Right Side - Video Player - Fixed to center the video properly */}
        <div className="w-1/2 bg-black flex flex-col">
          {!showVideo ? (
            // Video Preview/Play Button - Centered properly
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
              <div className="text-white text-center max-w-md px-8">
                <div className="relative mb-8">
                  <button
                    onClick={handlePlayClick}
                    className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mb-4 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 mx-auto"
                  >
                    <Play className="w-8 h-8 ml-1 text-white" fill="white" />
                  </button>
                  <div className="absolute inset-0 w-24 h-24 bg-red-500 rounded-2xl animate-ping opacity-20 pointer-events-none mx-auto"></div>
                </div>
                <h3 className="text-xl font-bold mb-4">{currentModule?.title}</h3>
                <p className="text-gray-300 mb-3 text-sm leading-relaxed">{currentModule?.description}</p>
                <p className="text-gray-400 text-sm mb-6">Duration: {currentModule?.duration}</p>
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{viewCount.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{hardcodedData.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Video Player - Fixed positioning
            <div className="flex-1 relative flex items-center justify-center">
              {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <PlayCircle className="w-16 h-16 animate-spin text-blue-500" />
                    </div>
                    <p className="text-lg font-semibold mb-2">Loading video...</p>
                    <p className="text-gray-300 text-sm">Starting {currentModule?.title}</p>
                  </div>
                </div>
              )}
              
              {hasValidVideo ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <iframe
                    key={`${videoId}-${isMuted}-${hasUserInteracted}-${currentModuleIndex}`}
                    src={embedUrl}
                    title={currentModule?.title}
                    className="w-full h-full max-w-full max-h-full rounded-lg"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen={true}
                    onLoad={() => setLoading(false)}
                    onError={() => setLoading(false)}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center">
                    <PlayCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <h3 className="text-xl font-semibold mb-2">Video Not Available</h3>
                    <p className="text-gray-300">Please check the video URL</p>
                  </div>
                </div>
              )}
              
              {/* Video Overlay Info */}
              {showVideo && !loading && (
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="text-sm font-medium">{currentModule?.title}</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-600 px-2 py-1 rounded">Module {currentModuleIndex + 1}</span>
                        {isMuted && (
                          <VolumeX className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpandedCourseView;