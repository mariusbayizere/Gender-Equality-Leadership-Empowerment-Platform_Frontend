// import React, { useState, useEffect } from 'react';
// import { Calendar, Clock, Users, Award, BookOpen, Video, CheckCircle, Star, Filter, Search, Play, ExternalLink, Globe, Download, ChevronRight } from 'lucide-react';
// import CourseCard from './CourseCard';
// import OnlineCourse from './OnlineCourse';

// const LeadershipTrainingDevelopment = () => {
//   const [activeTab, setActiveTab] = useState('courses');
//   const [courses, setCourses] = useState([]);
//   const [onlineCourses, setOnlineCourses] = useState([]);
//   const [modules, setModules] = useState([]);
//   const [enrollments, setEnrollments] = useState([]);
//   const [certifications, setCertifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showModules, setShowModules] = useState(false);
//   const [showVideoPlayer, setShowVideoPlayer] = useState(false);
//   const [currentVideo, setCurrentVideo] = useState('');
//   const [error, setError] = useState('');

//   // API Base URL - adjust according to your backend
//   const API_BASE_URL = 'http://localhost:3000/api/v1';

//   // Get auth token from localStorage or your auth system
//   const getAuthToken = () => {
//     return localStorage.getItem('authToken') || 'dummy-token-for-testing';
//   };

//   // Modified fetchCourses to separate online and regular courses
//   const fetchCourses = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/training_courses`, {
//         headers: {
//           'Authorization': `Bearer ${getAuthToken()}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       if (!response.ok) throw new Error('Failed to fetch courses');
//       const data = await response.json();
      
//       // Remove duplicates using Set with course IDs
//       const uniqueData = data.filter((course, index, self) => 
//         index === self.findIndex(c => c.id === course.id)
//       );
      
//       // Separate online courses from regular courses
//       const regularCourses = uniqueData.filter(course => course.course_type !== 'online');
//       const onlineCourses = uniqueData.filter(course => course.course_type === 'online');
      
//       return { regularCourses, onlineCourses };
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       setError('Failed to load courses');
//       return { regularCourses: [], onlineCourses: [] };
//     }
//   };

//   const fetchModules = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/course-modules`, {
//         headers: {
//           'Authorization': `Bearer ${getAuthToken()}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       if (!response.ok) throw new Error('Failed to fetch modules');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching modules:', error);
//       return [];
//     }
//   };

//   const fetchEnrollments = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/enrollments`, {
//         headers: {
//           'Authorization': `Bearer ${getAuthToken()}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       if (!response.ok) throw new Error('Failed to fetch enrollments');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching enrollments:', error);
//       return [];
//     }
//   };

//   const fetchCertifications = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/certifications`, {
//         headers: {
//           'Authorization': `Bearer ${getAuthToken()}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       if (!response.ok) throw new Error('Failed to fetch certifications');
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching certifications:', error);
//       return [];
//     }
//   };

//   // Load all data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       setLoading(true);
//       try {
//         const [courseData, modulesData, enrollmentsData, certificationsData] = await Promise.all([
//           fetchCourses(),
//           fetchModules(),
//           fetchEnrollments(),
//           fetchCertifications()
//         ]);

//         setCourses(courseData.regularCourses);
//         setOnlineCourses(courseData.onlineCourses);
//         setModules(modulesData);
//         setEnrollments(enrollmentsData);
//         setCertifications(certificationsData);
//       } catch (error) {
//         console.error('Error loading data:', error);
//         setError('Failed to load training data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Enhanced filtering with deduplication
//   const filteredCourses = courses.filter((course, index, self) => {
//     // Remove duplicates first
//     const isUnique = index === self.findIndex(c => c.id === course.id);
    
//     const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          course.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterType === 'all' || course.course_type === filterType;
    
//     return isUnique && matchesSearch && matchesFilter;
//   });

//   const filteredOnlineCourses = onlineCourses.filter((course, index, self) => {
//     // Remove duplicates first
//     const isUnique = index === self.findIndex(c => c.id === course.id);
    
//     const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          course.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterType === 'all' || filterType === 'online';
    
//     return isUnique && matchesSearch && matchesFilter;
//   });

//   const getCourseModules = (courseId) => {
//     return modules.filter(module => module.training_course_id === courseId);
//   };

//   const getUserEnrollment = (courseId) => {
//     return enrollments.find(enrollment => enrollment.training_course_id === courseId);
//   };

//   const getUserCertification = (courseId) => {
//     return certifications.find(cert => cert.training_course_id === courseId);
//   };

//   const handleEnroll = async (courseId) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/enrollments`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${getAuthToken()}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           user_id: 'current-user-id', // Replace with actual user ID
//           training_course_id: courseId,
//           status: 'enrolled',
//           enrolled_at: new Date().toISOString()
//         })
//       });

//       if (!response.ok) throw new Error('Failed to enroll');
      
//       const newEnrollment = await response.json();
//       setEnrollments([...enrollments, newEnrollment]);
//     } catch (error) {
//       console.error('Error enrolling:', error);
//       setError('Failed to enroll in course');
//     }
//   };

//   // Handler for online course video player
//   const handlePlayVideo = (videoUrl) => {
//     setCurrentVideo(videoUrl);
//     setShowVideoPlayer(true);
//   };

//   // Handler for viewing modules (works for both regular and online courses)
//   const handleViewModules = (course) => {
//     setSelectedCourse(course);
//     setShowModules(true);
//   };

//   // Extract YouTube video ID from URL
//   const getYouTubeVideoId = (url) => {
//     if (!url) return null;
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   // Generate Google Meet link (for demonstration - in production this would come from your backend)
//   const generateMeetLink = (courseId) => {
//     return `https://meet.google.com/${courseId}-${Math.random().toString(36).substr(2, 9)}`;
//   };

//   const VideoPlayerModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl p-6 w-full max-w-4xl">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-bold">Course Preview</h3>
//           <button
//             onClick={() => setShowVideoPlayer(false)}
//             className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//           >
//             ×
//           </button>
//         </div>
        
//         <div className="aspect-video">
//           <iframe
//             src={currentVideo}
//             className="w-full h-full rounded-lg"
//             frameBorder="0"
//             allowFullScreen
//             title="Course Preview"
//           ></iframe>
//         </div>
//       </div>
//     </div>
//   );

//   const ModulesModal = () => {
//     const courseModules = selectedCourse ? getCourseModules(selectedCourse.id) : [];
    
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-96 overflow-y-auto">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h3 className="text-xl font-bold text-gray-900">Course Modules</h3>
//               <p className="text-gray-600">{selectedCourse?.title}</p>
//             </div>
//             <button
//               onClick={() => setShowModules(false)}
//               className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
//             >
//               ×
//             </button>
//           </div>
          
//           <div className="space-y-4">
//             {courseModules.map((module, index) => (
//               <div key={module.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h4 className="font-semibold text-gray-900 mb-2">
//                       Module {index + 1}: {module.title}
//                     </h4>
//                     <p className="text-gray-600 text-sm mb-3">{module.content}</p>
//                     {module.media_url && (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => window.open(module.media_url, '_blank')}
//                           className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
//                         >
//                           <ExternalLink className="w-4 h-4 mr-1" />
//                           View Content
//                         </button>
//                         {getYouTubeVideoId(module.media_url) && (
//                           <button
//                             onClick={() => {
//                               setCurrentVideo(`https://www.youtube.com/embed/${getYouTubeVideoId(module.media_url)}`);
//                               setShowVideoPlayer(true);
//                               setShowModules(false);
//                             }}
//                             className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
//                           >
//                             <Play className="w-4 h-4 mr-1" />
//                             Play Video
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <CheckCircle className="w-6 h-6 text-green-500 ml-4" />
//                 </div>
//               </div>
//             ))}


//             {showCourses && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
//           <div className="fixed inset-4 bg-white rounded-lg overflow-hidden">
//             <div className="flex justify-between items-center p-4 border-b">
//               <h2 className="text-lg font-semibold">Online Courses</h2>
//               <button 
//                 onClick={() => setShowCourses(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="h-full overflow-auto">
//               <OnlineCourse />
//             </div>
//           </div>
//         </div>
//       )}


//             {courseModules.length === 0 && (
//               <div className="text-center py-8">
//                 <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                 <p className="text-gray-500">No modules available for this course.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const StatsCard = ({ title, value, icon: Icon, color, gradient }) => (
//     <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-200`}>
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-white text-opacity-80 text-sm font-medium">{title}</p>
//           <p className="text-3xl font-bold mt-1">{value}</p>
//         </div>
//         <div className="bg-white bg-opacity-20 rounded-xl p-3">
//           <Icon className="w-8 h-8" />
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="relative">
//             <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-200"></div>
//             <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-600 absolute top-0 left-0"></div>
//           </div>
//           <p className="mt-6 text-gray-600 font-medium">Loading your training courses...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
//         <div className="text-center bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-red-500 mb-4">
//             <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const totalCourses = courses.length + onlineCourses.length;
//   const hasOnlineCourses = filteredOnlineCourses.length > 0;
//   const hasRegularCourses = filteredCourses.length > 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Enhanced Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//           <StatsCard 
//             title="Total Courses" 
//             value={totalCourses} 
//             icon={BookOpen} 
//             gradient="from-blue-500 to-blue-600"
//           />
//           <StatsCard 
//             title="Online Courses" 
//             value={onlineCourses.length} 
//             icon={Globe} 
//             gradient="from-indigo-500 to-indigo-600"
//           />
//           <StatsCard 
//             title="Active Enrollments" 
//             value={enrollments.filter(e => e.status !== 'completed').length} 
//             icon={Users} 
//             gradient="from-green-500 to-emerald-600"
//           />
//           <StatsCard 
//             title="Certifications" 
//             value={certifications.length} 
//             icon={Award} 
//             gradient="from-purple-500 to-purple-600"
//           />
//         </div>

//         {/* Enhanced Search and Filter */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
//           <div className="flex flex-col lg:flex-row gap-6">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search for leadership courses..."
//                 className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <Filter className="h-5 w-5 text-gray-500" />
//                 <select
//                   value={filterType}
//                   onChange={(e) => setFilterType(e.target.value)}
//                   className="border border-gray-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 font-medium"
//                 >
//                   <option value="all">All Types</option>
//                   <option value="online">Online Courses</option>
//                   <option value="webinar">Live Webinars</option>
//                   <option value="certification">Certifications</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Online Courses Section - Fixed duplication issue */}
//         {hasOnlineCourses && (
//           <div className="mb-12">
//             <div className="flex items-center mb-6">
//               <Globe className="w-6 h-6 text-indigo-600 mr-3" />
//               <h2 className="text-2xl font-bold text-gray-900">Online Courses</h2>
//               <div className="ml-3 bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
//                 {filteredOnlineCourses.length} courses
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
//               {filteredOnlineCourses.map(course => (
//                 <OnlineCourse
//                   key={`online-${course.id}`}
//                   course={course}
//                   enrollment={getUserEnrollment(course.id)}
//                   certification={getUserCertification(course.id)}
//                   courseModules={getCourseModules(course.id)}
//                   onEnroll={handleEnroll}
//                   onViewModules={handleViewModules}
//                   onPlayVideo={handlePlayVideo}
//                 />
//               ))}

//             </div>
//           </div>
//         )}

//         {/* Regular Courses Section */}
//         {hasRegularCourses && (
//           <div className="mb-12">
//             <div className="flex items-center mb-6">
//               <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
//               <h2 className="text-2xl font-bold text-gray-900">Training Courses & Webinars</h2>
//               <div className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
//                 {filteredCourses.length} courses
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//               {filteredCourses.map(course => (
//                 <CourseCard
//                   key={`regular-${course.id}`}
//                   course={course}
//                   enrollment={getUserEnrollment(course.id)}
//                   certification={getUserCertification(course.id)}
//                   courseModules={getCourseModules(course.id)}
//                   onEnroll={handleEnroll}
//                   onShowModules={handleViewModules}
//                   generateMeetLink={generateMeetLink}
//                   getYouTubeVideoId={getYouTubeVideoId}
//                 />
//               ))}
//             </div>
//           </div>
//         )}


//         {!hasOnlineCourses && !hasRegularCourses && (
//           <div className="text-center py-16">
//             <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
//               <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
//               <h3 className="text-xl font-bold text-gray-900 mb-3">No courses found</h3>
//               <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria to find the perfect course for you.</p>
//               <button 
//                 onClick={() => {
//                   setSearchTerm('');
//                   setFilterType('all');
//                 }}
//                 className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {showModules && <ModulesModal />}
//       {showVideoPlayer && <VideoPlayerModal />}
//     </div>
//   );
// };

// export default LeadershipTrainingDevelopment;



import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Award, BookOpen, Video, CheckCircle, Star, Filter, Search, Play, ExternalLink, Globe, Download, ChevronRight } from 'lucide-react';
import CourseCard from './CourseCard';
import OnlineCourse from './OnlineCourse';

const LeadershipTrainingDevelopment = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState([]);
  const [onlineCourses, setOnlineCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModules, setShowModules] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [error, setError] = useState('');

  // API Base URL - adjust according to your backend
  const API_BASE_URL = 'http://localhost:3000/api/v1';

  // Get auth token from localStorage or your auth system
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || 'dummy-token-for-testing';
  };

  // Modified fetchCourses to separate online and regular courses
  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/training_courses`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch courses');
      const data = await response.json();
      
      // Remove duplicates using Set with course IDs
      const uniqueData = data.filter((course, index, self) => 
        index === self.findIndex(c => c.id === course.id)
      );
      
      // Separate online courses from regular courses
      const regularCourses = uniqueData.filter(course => course.course_type !== 'online');
      const onlineCourses = uniqueData.filter(course => course.course_type === 'online');
      
      return { regularCourses, onlineCourses };
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
      return { regularCourses: [], onlineCourses: [] };
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/course-modules`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch modules');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching modules:', error);
      return [];
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch enrollments');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }
  };

  const fetchCertifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/certifications`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch certifications');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching certifications:', error);
      return [];
    }
  };

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [courseData, modulesData, enrollmentsData, certificationsData] = await Promise.all([
          fetchCourses(),
          fetchModules(),
          fetchEnrollments(),
          fetchCertifications()
        ]);

        setCourses(courseData.regularCourses);
        setOnlineCourses(courseData.onlineCourses);
        setModules(modulesData);
        setEnrollments(enrollmentsData);
        setCertifications(certificationsData);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load training data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Enhanced filtering with deduplication
  const filteredCourses = courses.filter((course, index, self) => {
    // Remove duplicates first
    const isUnique = index === self.findIndex(c => c.id === course.id);
    
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || course.course_type === filterType;
    
    return isUnique && matchesSearch && matchesFilter;
  });

  const filteredOnlineCourses = onlineCourses.filter((course, index, self) => {
    // Remove duplicates first
    const isUnique = index === self.findIndex(c => c.id === course.id);
    
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || filterType === 'online';
    
    return isUnique && matchesSearch && matchesFilter;
  });

  const getCourseModules = (courseId) => {
    return modules.filter(module => module.training_course_id === courseId);
  };

  const getUserEnrollment = (courseId) => {
    return enrollments.find(enrollment => enrollment.training_course_id === courseId);
  };

  const getUserCertification = (courseId) => {
    return certifications.find(cert => cert.training_course_id === courseId);
  };

  const handleEnroll = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/enrollments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: 'current-user-id', // Replace with actual user ID
          training_course_id: courseId,
          status: 'enrolled',
          enrolled_at: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to enroll');
      
      const newEnrollment = await response.json();
      setEnrollments([...enrollments, newEnrollment]);
    } catch (error) {
      console.error('Error enrolling:', error);
      setError('Failed to enroll in course');
    }
  };

  // Handler for online course video player
  const handlePlayVideo = (videoUrl) => {
    setCurrentVideo(videoUrl);
    setShowVideoPlayer(true);
  };

  // Handler for viewing modules (works for both regular and online courses)
  const handleViewModules = (course) => {
    setSelectedCourse(course);
    setShowModules(true);
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Generate Google Meet link (for demonstration - in production this would come from your backend)
  const generateMeetLink = (courseId) => {
    return `https://meet.google.com/${courseId}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const VideoPlayerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 dark:bg-black dark:bg-opacity-85 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 w-full max-w-xs sm:max-w-4xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Course Preview</h3>
          <button
            onClick={() => setShowVideoPlayer(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl sm:text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="aspect-video">
          <iframe
            src={currentVideo}
            className="w-full h-full rounded-md sm:rounded-lg"
            frameBorder="0"
            allowFullScreen
            title="Course Preview"
          ></iframe>
        </div>
      </div>
    </div>
  );

  const ModulesModal = () => {
    const courseModules = selectedCourse ? getCourseModules(selectedCourse.id) : [];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-6 w-full max-w-xs sm:max-w-3xl max-h-[90vh] sm:max-h-96 overflow-y-auto">
          <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
            <div className="flex-1 pr-2">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Course Modules</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 break-words">{selectedCourse?.title}</p>
            </div>
            <button
              onClick={() => setShowModules(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl sm:text-2xl font-bold flex-shrink-0"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {courseModules.map((module, index) => (
              <div key={module.id} className="border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow bg-white dark:bg-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                  <div className="flex-1 mb-3 sm:mb-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                      Module {index + 1}: {module.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3">{module.content}</p>
                    {module.media_url && (
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => window.open(module.media_url, '_blank')}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          View Content
                        </button>
                        {getYouTubeVideoId(module.media_url) && (
                          <button
                            onClick={() => {
                              setCurrentVideo(`https://www.youtube.com/embed/${getYouTubeVideoId(module.media_url)}`);
                              setShowVideoPlayer(true);
                              setShowModules(false);
                            }}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start"
                          >
                            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            Play Video
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 dark:text-green-400 ml-0 sm:ml-4 self-center sm:self-start" />
                </div>
              </div>
            ))}

            {courseModules.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">No modules available for this course.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const StatsCard = ({ title, value, icon: Icon, color, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} dark:from-gray-700 dark:to-gray-800 rounded-xl sm:rounded-2xl shadow-lg dark:shadow-xl p-4 sm:p-6 text-white transform hover:scale-105 transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-white text-opacity-80 dark:text-gray-300 text-xs sm:text-sm font-medium truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold mt-1 text-white dark:text-white">{value}</p>
        </div>
        <div className="bg-white bg-opacity-20 dark:bg-white dark:bg-opacity-30 rounded-lg sm:rounded-xl p-2 sm:p-3 ml-2">
          <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-4 border-blue-200 dark:border-gray-600"></div>
            <div className="animate-spin rounded-full h-24 w-24 sm:h-32 sm:w-32 border-t-4 border-blue-600 dark:border-blue-400 absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 sm:mt-6 text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">Loading your training courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full border dark:border-gray-700">
          <div className="text-red-500 dark:text-red-400 mb-4">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalCourses = courses.length + onlineCourses.length;
  const hasOnlineCourses = filteredOnlineCourses.length > 0;
  const hasRegularCourses = filteredCourses.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <StatsCard 
            title="Total Courses" 
            value={totalCourses} 
            icon={BookOpen} 
            gradient="from-blue-500 to-blue-600"
          />
          <StatsCard 
            title="Online Courses" 
            value={onlineCourses.length} 
            icon={Globe} 
            gradient="from-indigo-500 to-indigo-600"
          />
          <StatsCard 
            title="Active Enrollments" 
            value={enrollments.filter(e => e.status !== 'completed').length} 
            icon={Users} 
            gradient="from-green-500 to-emerald-600"
          />
          <StatsCard 
            title="Certifications" 
            value={certifications.length} 
            icon={Award} 
            gradient="from-purple-500 to-purple-600"
          />
        </div>

        {/* Enhanced Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-3 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search for leadership courses..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm sm:text-lg transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm sm:text-base"
                >
                  <option value="all">All Types</option>
                  <option value="online">Online Courses</option>
                  <option value="webinar">Live Webinars</option>
                  <option value="certification">Certifications</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Online Courses Section - Fixed duplication issue */}
        {hasOnlineCourses && (
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
              <div className="flex items-center mb-2 sm:mb-0">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400 mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Online Courses</h2>
              </div>
              <div className="ml-0 sm:ml-3 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full w-fit">
                {filteredOnlineCourses.length} courses
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-8">
              {filteredOnlineCourses.map(course => (
                <OnlineCourse
                  key={`online-${course.id}`}
                  course={course}
                  enrollment={getUserEnrollment(course.id)}
                  certification={getUserCertification(course.id)}
                  courseModules={getCourseModules(course.id)}
                  onEnroll={handleEnroll}
                  onViewModules={handleViewModules}
                  onPlayVideo={handlePlayVideo}
                />
              ))}
            </div>
          </div>
        )}

        {/* Regular Courses Section */}
        {hasRegularCourses && (
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
              <div className="flex items-center mb-2 sm:mb-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 mr-2 sm:mr-3" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Training Courses & Webinars</h2>
              </div>
              <div className="ml-0 sm:ml-3 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full w-fit">
                {filteredCourses.length} courses
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8">
              {filteredCourses.map(course => (
                <CourseCard
                  key={`regular-${course.id}`}
                  course={course}
                  enrollment={getUserEnrollment(course.id)}
                  certification={getUserCertification(course.id)}
                  courseModules={getCourseModules(course.id)}
                  onEnroll={handleEnroll}
                  onShowModules={handleViewModules}
                  generateMeetLink={generateMeetLink}
                  getYouTubeVideoId={getYouTubeVideoId}
                />
              ))}
            </div>
          </div>
        )}

        {!hasOnlineCourses && !hasRegularCourses && (
          <div className="text-center py-12 sm:py-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 max-w-xs sm:max-w-md mx-auto border dark:border-gray-700">
              <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">No courses found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Try adjusting your search or filter criteria to find the perfect course for you.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors font-medium text-sm sm:text-base"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModules && <ModulesModal />}
      {showVideoPlayer && <VideoPlayerModal />}
    </div>
  );
};

export default LeadershipTrainingDevelopment;