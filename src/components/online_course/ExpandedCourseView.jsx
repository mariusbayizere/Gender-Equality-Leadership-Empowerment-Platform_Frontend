import React, { useState, useEffect } from 'react';
import { X, Clock, BookOpen, CheckCircle, Play, ChevronRight, Users, Star, Eye, BookmarkPlus, Heart, Share2, Download, PlayCircle, Volume2, VolumeX } from 'lucide-react';
import { moduleData } from './moduleData';
// Module data

const ExpandedCourseView = ({ 
  courseData = null, 
  onClose, 
  isEnrolled = true,
  isCertified = false 
}) => {
  // HARDCODED DATA FOR TESTING
  const hardcodedData = {
    title: "Complete Leadership Masterclass",
    instructor_name: "Immaculée Uwanyirigira",
    duration: "4 weeks",
    modules_count: 10,
    description: "Introduction to leadership principles and skills.",
    tags: ["Leadership"],
    rating: "4.8",
    enrolled: "12,453",
    video_url: "https://youtu.be/0iwvEeGU4B0"
  };

  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
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

  const markCurrentModuleCompleted = () => {
    const newModules = [...modules];
    newModules[currentModuleIndex].completed = true;
    setModules(newModules);
  };

  useEffect(() => {
    if (showVideo && !loading) {
      // Auto-complete module after 10 seconds of watching (you can adjust this)
      const timer = setTimeout(() => {
        markCurrentModuleCompleted();
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [showVideo, loading, currentModuleIndex]);

  const handleModuleClick = (moduleIndex) => {
    const newModules = [...modules];
    
    // Mark the current module as completed when moving to a new module
    if (currentModuleIndex !== moduleIndex && currentModuleIndex < modules.length) {
      newModules[currentModuleIndex].completed = true;
      newModules[currentModuleIndex].current = false;
    }
    
    // Set the new current module
    newModules.forEach((module, index) => {
      module.current = index === moduleIndex;
    });
    
    // Mark all previous modules as completed if moving forward
    if (moduleIndex > currentModuleIndex) {
      for (let i = 0; i < moduleIndex; i++) {
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
  const isLastModuleCompleted = modules[modules.length - 1]?.completed;
  const isAllModulesCompleted = completedModules === modules.length;

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
      {/* Header with dark background - Responsive */}
      <div className="bg-slate-800 dark:bg-slate-900 text-white p-2 sm:p-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-600">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 hover:bg-slate-700 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <h1 className="text-sm sm:text-lg font-semibold truncate">{hardcodedData.title}</h1>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
          {showVideo && (
            <button
              onClick={toggleMute}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
              title={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          )}
          <button className="p-1.5 sm:p-2 hover:bg-slate-700 dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:block">
            <BookmarkPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="p-1.5 sm:p-2 hover:bg-slate-700 dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:block">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="p-1.5 sm:p-2 hover:bg-slate-700 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button className="p-1.5 sm:p-2 hover:bg-slate-700 dark:hover:bg-slate-800 rounded-lg transition-colors hidden sm:block">
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Main Content - Responsive Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side - Course Content - Responsive */}
        <div className="w-full lg:w-1/2 bg-gray-50 dark:bg-gray-800 flex flex-col overflow-hidden order-2 lg:order-1">
          {/* Fixed Header Content - Responsive */}
          <div className="flex-shrink-0 p-3 sm:p-6 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            {/* Instructor Info - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-bold flex-shrink-0">
                J
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">{hardcodedData.instructor_name}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Instructor</p>
              </div>
            </div>

            {/* Course Duration and Modules - Responsive */}
            <div className="flex items-center space-x-3 sm:space-x-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
              <div className="flex items-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>{hardcodedData.duration}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>{modules.length} modules</span>
              </div>
            </div>

            {/* Course Description - Responsive */}
            <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">{hardcodedData.description}</p>

            {/* Tags - Responsive */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {hardcodedData.tags.map((tag, idx) => (
                <span key={idx} className="text-xs sm:text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 sm:px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Modules Section with Fixed Header and Scrollable Content - Responsive */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Fixed Modules Header - Responsive */}
            <div className="flex-shrink-0 p-3 sm:p-6 pb-2 sm:pb-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-500 dark:text-purple-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Course Modules ({modules.length})</h4>
              </div>
            </div>
            
            {/* Scrollable Module List - Responsive */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 pb-2 sm:pb-4">
              <div className="space-y-2 sm:space-y-3">
                {modules.map((module, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleModuleClick(idx)}
                    className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                      module.completed
                        ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'
                        : module.current
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 border-2 shadow-sm'
                        : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        {module.completed ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </div>
                        ) : module.current ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white ml-0.5" fill="white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400 ml-0.5" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h5 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{module.title}</h5>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{module.duration}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed Bottom Content - Responsive */}
          <div className="flex-shrink-0 p-3 sm:p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
            {/* Course Progress - Responsive */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Course Progress</span>
                <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 sm:h-2">
                <div 
                  className="bg-blue-500 dark:bg-blue-400 h-1.5 sm:h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                {completedModules} of {modules.length} modules completed
              </p>
            </div>

            {/* Continue Learning Button - Responsive */}
            <button 
              onClick={() => {
                if (isAllModulesCompleted) {
                  alert('Congratulations! You have completed the course!');
                } else {
                  handleModuleClick(currentModuleIndex);
                }
              }}
              className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-colors text-sm sm:text-base ${
                isAllModulesCompleted 
                  ? 'bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
              }`}
            >
              {isAllModulesCompleted ? 'Course Completed! 🎉' : 'Continue Learning'}
            </button>
          </div>
        </div>

        {/* Right Side - Video Player - Responsive */}
        <div className="w-full lg:w-1/2 bg-black dark:bg-gray-900 flex flex-col order-1 lg:order-2 h-64 sm:h-80 lg:h-auto">
          {!showVideo ? (
            // Video Preview/Play Button - Responsive
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 dark:from-gray-800 dark:via-gray-900 dark:to-black">
              <div className="text-white text-center max-w-xs sm:max-w-md px-4 sm:px-8">
                <div className="relative mb-4 sm:mb-8">
                  <button
                    onClick={handlePlayClick}
                    className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 mx-auto"
                  >
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1 text-white" fill="white" />
                  </button>
                  <div className="absolute inset-0 w-16 h-16 sm:w-24 sm:h-24 bg-red-500 rounded-xl sm:rounded-2xl animate-ping opacity-20 pointer-events-none mx-auto"></div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-white">{currentModule?.title}</h3>
                <p className="text-gray-300 dark:text-gray-400 mb-2 sm:mb-3 text-xs sm:text-sm leading-relaxed">{currentModule?.description}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Duration: {currentModule?.duration}</p>
                <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{viewCount.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                    <span>{hardcodedData.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Video Player - Responsive
            <div className="flex-1 relative flex items-center justify-center">
              {loading && (
                <div className="absolute inset-0 bg-black dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-90 flex items-center justify-center z-10">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 relative">
                      <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-blue-500" />
                    </div>
                    <p className="text-base sm:text-lg font-semibold mb-2 text-white">Loading video...</p>
                    <p className="text-gray-300 dark:text-gray-400 text-xs sm:text-sm">Starting {currentModule?.title}</p>
                  </div>
                </div>
              )}
              
              {hasValidVideo ? (
                <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
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
                    <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-red-400 dark:text-red-500" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Video Not Available</h3>
                    <p className="text-gray-300 dark:text-gray-400 text-sm">Please check the video URL</p>
                  </div>
                </div>
              )}
              
              {/* Video Overlay Info - Responsive */}
              {showVideo && !loading && (
                <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 z-20">
                  <div className="bg-black dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-80 backdrop-blur-sm rounded-lg p-2 sm:p-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="text-xs sm:text-sm font-medium truncate mr-2">{currentModule?.title}</div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-xs bg-blue-600 dark:bg-blue-700 px-2 py-1 rounded">Module {currentModuleIndex + 1}</span>
                        {isMuted && (
                          <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 dark:text-red-500" />
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