// import React, { useState, useEffect } from 'react';
// import { Edit, List, Trash2, User, Clock, Target, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, TrendingUp, CheckCircle, Activity, BarChart } from 'lucide-react';

// // Column definitions
// const columns = [
//   { key: 'id', label: '# ID' },
//   { key: 'user_info', label: 'User' },
//   { key: 'course_info', label: 'Course' },
//   { key: 'progress_percentage', label: 'Progress' },
//   { key: 'status', label: 'Status' },
//   { key: 'session_count', label: 'Sessions' },
//   { key: 'completion_date', label: 'Due Date' },
//   { key: 'actions', label: 'Actions' }
// ];

// // API Configuration
// const API_BASE_URL = 'http://localhost:3000/api/v1';
// const API_ENDPOINTS = {
//   progress: `${API_BASE_URL}/progress_tracking`,
//   progressById: (id) => `${API_BASE_URL}/progress_tracking/${id}`,
//   users: `${API_BASE_URL}/users`,
//   courses: `${API_BASE_URL}/training_courses`
// };

// // API Service functions
// const apiService = {
//   getAuthToken: () => {
//     // Replace with your actual token storage method
//     return 'your-auth-token-here';
//   },

//   getHeaders: () => ({
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${apiService.getAuthToken()}`
//   }),

//   fetchProgressEntries: async () => {
//     try {
//       const response = await fetch(API_ENDPOINTS.progress, {
//         method: 'GET',
//         headers: apiService.getHeaders()
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching progress entries:', error);
//       throw error;
//     }
//   },

//   deleteProgressEntry: async (id) => {
//     try {
//       const response = await fetch(API_ENDPOINTS.progressById(id), {
//         method: 'DELETE',
//         headers: apiService.getHeaders()
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return true;
//     } catch (error) {
//       console.error('Error deleting progress entry:', error);
//       throw error;
//     }
//   }
// };

// // Mock data for development
// const mockProgressData = [
//   {
//     id: '1',
//     user_id: 'user1',
//     training_course_id: 'course1',
//     feedback: 'Great progress on fundamentals',
//     status: 'in_progress',
//     progress_percentage: 75,
//     completion_date: '2024-12-15',
//     session_count: 8,
//     goals: ['Complete module 1', 'Pass quiz', 'Submit project'],
//     user_info: { name: 'John Doe', email: 'john@example.com' },
//     course_info: { title: 'React Fundamentals', type: 'online' }
//   },
//   {
//     id: '2',
//     user_id: 'user2',
//     training_course_id: 'course2',
//     feedback: 'Excellent understanding of concepts',
//     status: 'completed',
//     progress_percentage: 100,
//     completion_date: '2024-11-20',
//     session_count: 12,
//     goals: ['Master advanced topics', 'Build portfolio project'],
//     user_info: { name: 'Jane Smith', email: 'jane@example.com' },
//     course_info: { title: 'Advanced JavaScript', type: 'webinar' }
//   },
//   {
//     id: '3',
//     user_id: 'user3',
//     training_course_id: 'course3',
//     feedback: 'Needs more practice with practical exercises',
//     status: 'not_started',
//     progress_percentage: 0,
//     completion_date: '2024-12-30',
//     session_count: 0,
//     goals: ['Start course', 'Complete introduction'],
//     user_info: { name: 'Mike Johnson', email: 'mike@example.com' },
//     course_info: { title: 'Python Certification', type: 'certification' }
//   }
// ];

// // Delete Confirmation Modal Component
// const DeleteConfirmation = ({ isOpen, entryToDelete, onConfirm, onCancel }) => {
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape' && isOpen) {
//         onCancel();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, onCancel]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
//       <div 
//         className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//           <div className="flex items-center space-x-3">
//             <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//               <AlertCircle className="w-5 h-5 text-red-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900">Delete Progress Entry</h3>
//           </div>
//           <button
//             onClick={onCancel}
//             className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>
//         <div className="p-6">
//           <p className="text-gray-700 mb-2">
//             Are you sure you want to delete the progress entry for{' '}
//             <span className="font-semibold text-gray-900">
//               {entryToDelete?.user_info?.name || 'this user'}
//             </span>
//             ?
//           </p>
//           <p className="text-sm text-gray-500">This action cannot be undone.</p>
//         </div>
//         <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
//           <button
//             onClick={() => onConfirm(entryToDelete?.id)}
//             className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors font-medium text-base sm:text-sm"
//           >
//             Delete Entry
//           </button>
//           <button
//             onClick={onCancel}
//             className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium text-base sm:text-sm"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Loading Component
// const LoadingSpinner = () => (
//   <div className="flex items-center justify-center p-8">
//     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//   </div>
// );

// // Error Component
// const ErrorMessage = ({ message, onRetry }) => (
//   <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
//     <div className="flex items-center">
//       <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
//       <p className="text-red-800">{message}</p>
//     </div>
//     {onRetry && (
//       <button
//         onClick={onRetry}
//         className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
//       >
//         Try Again
//       </button>
//     )}
//   </div>
// );

// // Status badge helper
// const getStatusBadge = (status) => {
//   const baseClasses = "inline-flex px-3 py-1.5 text-xs font-semibold rounded-full";
//   switch (status) {
//     case 'completed':
//       return `${baseClasses} bg-green-100 text-green-700`;
//     case 'in_progress':
//       return `${baseClasses} bg-blue-100 text-blue-700`;
//     case 'not_started':
//       return `${baseClasses} bg-gray-100 text-gray-700`;
//     case 'paused':
//       return `${baseClasses} bg-yellow-100 text-yellow-700`;
//     default:
//       return `${baseClasses} bg-gray-100 text-gray-700`;
//   }
// };

// // Status icon helper
// const getStatusIcon = (status) => {
//   switch (status) {
//     case 'completed':
//       return <CheckCircle className="w-4 h-4 text-green-600" />;
//     case 'in_progress':
//       return <Activity className="w-4 h-4 text-blue-600" />;
//     case 'not_started':
//       return <Clock className="w-4 h-4 text-gray-600" />;
//     case 'paused':
//       return <Clock className="w-4 h-4 text-yellow-600" />;
//     default:
//       return <Activity className="w-4 h-4 text-gray-600" />;
//   }
// };

// // Progress bar component
// const ProgressBar = ({ percentage }) => (
//   <div className="w-full bg-gray-200 rounded-full h-2.5">
//     <div 
//       className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
//       style={{ width: `${percentage}%` }}
//     ></div>
//   </div>
// );

// // Mobile Card Component
// const MobileCard = ({ entry, index, onEdit, onDelete, onExpand, isExpanded, startIndex }) => {
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between mb-3">
//         <div className="flex items-center space-x-3 flex-1 min-w-0">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
//             <TrendingUp className="w-4 h-4 text-white" />
//           </div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-gray-900 text-sm truncate">
//               {entry?.user_info?.name || 'N/A'}
//             </h3>
//             <p className="text-xs text-gray-500">ID: {startIndex + index + 1}</p>
//           </div>
//         </div>
//         <button 
//           onClick={() => onExpand?.(isExpanded ? null : entry.id)}
//           className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
//         >
//           <MoreVertical className="w-5 h-5" />
//         </button>
//       </div>

//       <div className="space-y-2 mb-3">
//         <div className="flex items-center space-x-2">
//           <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
//           <span className="text-sm text-gray-600 truncate">
//             {entry?.course_info?.title || 'N/A'}
//           </span>
//         </div>

//         <div className="flex items-center space-x-2">
//           {getStatusIcon(entry?.status)}
//           <span className={getStatusBadge(entry?.status)}>
//             {entry?.status?.replace('_', ' ').toUpperCase() || 'N/A'}
//           </span>
//         </div>

//         <div className="space-y-1">
//           <div className="flex items-center justify-between">
//             <span className="text-sm text-gray-600">Progress</span>
//             <span className="text-sm font-medium text-gray-900">
//               {entry?.progress_percentage || 0}%
//             </span>
//           </div>
//           <ProgressBar percentage={entry?.progress_percentage || 0} />
//         </div>

//         {isExpanded && (
//           <div className="space-y-2 pt-2 border-t border-gray-100">
//             <div className="flex items-center space-x-2">
//               <BarChart className="w-4 h-4 text-gray-400 flex-shrink-0" />
//               <span className="text-sm text-gray-600">
//                 {entry?.session_count || 0} sessions
//               </span>
//             </div>

//             <div className="flex items-center space-x-2">
//               <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
//               <span className="text-sm text-gray-600">
//                 Due: {formatDate(entry?.completion_date)}
//               </span>
//             </div>

//             {entry?.goals && entry.goals.length > 0 && (
//               <div className="space-y-1">
//                 <div className="flex items-center space-x-2">
//                   <Target className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                   <span className="text-sm text-gray-600">Goals:</span>
//                 </div>
//                 <div className="ml-6 space-y-1">
//                   {entry.goals.slice(0, 2).map((goal, idx) => (
//                     <div key={idx} className="text-xs text-gray-500">
//                       • {goal}
//                     </div>
//                   ))}
//                   {entry.goals.length > 2 && (
//                     <div className="text-xs text-gray-400">
//                       +{entry.goals.length - 2} more
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {entry?.feedback && (
//               <div className="space-y-1">
//                 <span className="text-sm text-gray-600">Feedback:</span>
//                 <p className="text-xs text-gray-500 italic">
//                   "{entry.feedback}"
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {isExpanded && (
//         <div className="flex space-x-2 pt-3 border-t border-gray-100">
//           <button
//             onClick={() => onEdit?.(entry)}
//             className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
//           >
//             <Edit className="w-4 h-4" />
//             <span>Edit</span>
//           </button>
//           <button
//             onClick={() => onDelete?.(entry)}
//             className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
//           >
//             <Trash2 className="w-4 h-4" />
//             <span>Delete</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const ModernProgressTrackingManagement = () => {
//   // State management
//   const [progressEntries, setProgressEntries] = useState([]);
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(8);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const [expandedCard, setExpandedCard] = useState(null);
//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,
//     entryToDelete: null
//   });
//   const [visibleColumns, setVisibleColumns] = useState({
//     id: true,
//     user_info: true,
//     course_info: true,
//     progress_percentage: true,
//     status: true,
//     session_count: true,
//     completion_date: true,
//     actions: true
//   });
//   const [viewMode, setViewMode] = useState('table');
//   const [showColumnToggle, setShowColumnToggle] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch progress entries on component mount
//   useEffect(() => {
//     fetchProgressEntries();
//   }, []);

//   // Filter entries based on search term
//   useEffect(() => {
//     if (!progressEntries.length) {
//       setFilteredEntries([]);
//       return;
//     }

//     const filtered = progressEntries.filter(entry =>
//       entry.user_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       entry.user_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       entry.course_info?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       entry.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       entry.feedback?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredEntries(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, progressEntries]);

//   // Responsive view mode
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setViewMode('cards');
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const fetchProgressEntries = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       // Use mock data for now - replace with actual API call
//       // const data = await apiService.fetchProgressEntries();
//       setTimeout(() => {
//         setProgressEntries(mockProgressData);
//         setLoading(false);
//       }, 1000);
//     } catch (error) {
//       setError(`Failed to fetch progress entries: ${error.message}`);
//       setProgressEntries([]);
//       setLoading(false);
//     }
//   };

//   const toggleColumn = (key) => {
//     setVisibleColumns(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });

//     const sortedEntries = [...filteredEntries].sort((a, b) => {
//       let aValue = a[key];
//       let bValue = b[key];

//       // Handle nested objects
//       if (key === 'user_info') {
//         aValue = a.user_info?.name || '';
//         bValue = b.user_info?.name || '';
//       } else if (key === 'course_info') {
//         aValue = a.course_info?.title || '';
//         bValue = b.course_info?.title || '';
//       }

//       if (aValue < bValue) return direction === 'asc' ? -1 : 1;
//       if (aValue > bValue) return direction === 'asc' ? 1 : -1;
//       return 0;
//     });

//     setFilteredEntries(sortedEntries);
//   };

//   // Calculate pagination
//   const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

//   const handleDelete = async (entryId) => {
//     try {
//       // await apiService.deleteProgressEntry(entryId);
//       setProgressEntries(prev => prev.filter(entry => entry.id !== entryId));
//       console.log('Progress entry deleted successfully');
//     } catch (error) {
//       setError(`Failed to delete progress entry: ${error.message}`);
//     }
//   };

//   const handleDeleteClick = (entry) => {
//     setDeleteModal({
//       isOpen: true,
//       entryToDelete: entry
//     });
//   };

//   const handleDeleteConfirm = (entryId) => {
//     handleDelete(entryId);
//     setDeleteModal({
//       isOpen: false,
//       entryToDelete: null
//     });
//   };

//   const handleDeleteCancel = () => {
//     setDeleteModal({
//       isOpen: false,
//       entryToDelete: null
//     });
//   };

//   const handleEdit = (entry) => {
//     console.log('Edit entry:', entry);
//     // Implement edit functionality
//   };

//   const handleCreateEntry = () => {
//     console.log('Create new entry');
//     // Implement create functionality
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   // Pagination component
//   const PaginationControls = () => (
//     <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
//       <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
//         {filteredEntries.length > 0 ? `${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredEntries.length)} of ${filteredEntries.length} rows visible` : 'No data available'}
//       </div>
//       <div className="flex items-center space-x-2 order-1 sm:order-2">
//         <button
//           onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//           disabled={currentPage === 1}
//           className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//         >
//           ‹
//         </button>
//         {[...Array(Math.min(3, totalPages))].map((_, i) => {
//           const pageNum = i + 1;
//           return (
//             <button
//               key={pageNum}
//               onClick={() => setCurrentPage(pageNum)}
//               className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
//                 currentPage === pageNum
//                   ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
//                   : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
//               }`}
//             >
//               {pageNum}
//             </button>
//           );
//         })}
//         {totalPages > 3 && (
//           <>
//             <span className="text-gray-600 px-1">...</span>
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
//                 currentPage === totalPages
//                   ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
//                   : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
//               }`}
//             >
//               {totalPages}
//             </button>
//           </>
//         )}
//         <button
//           onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//           disabled={currentPage === totalPages}
//           className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//         >
//           ›
//         </button>
//       </div>
//     </div>
//   );

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <LoadingSpinner />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <ErrorMessage message={error} onRetry={fetchProgressEntries} />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Empty state
//   if (!paginatedEntries || paginatedEntries.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col space-y-4 mb-6">
//             <div className="bg-white rounded-xl p-4 shadow-sm">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                 <button 
//                   onClick={handleCreateEntry}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span className="hidden sm:inline">Create Entry</span>
//                   <span className="sm:hidden">Create</span>
//                 </button>
//                 <div className="flex items-center gap-3 w-full sm:w-auto">
//                   <div className="relative flex-1 sm:flex-initial">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       placeholder="Search progress entries..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 bg-white shadow-sm"
//                     />
//                   </div>
//                   <button 
//                     onClick={fetchProgressEntries}
//                     className="p-2.5 text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-200 shadow-sm"
//                   >
//                     <RefreshCw className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="p-8 sm:p-12 text-center">
//               <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-800 text-xl font-semibold mb-2">No progress entries found</p>
//               <p className="text-gray-500">Try adjusting your search criteria or add some progress entries.</p>
//             </div>
//             <PaginationControls />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       <div className="max-w-7xl mx-auto">
// <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
//         {/* Desktop Header */}
//         <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//           <button 
//             // onClick={handleCreateCourse} 
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Create Progress</span>
//           </button>
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
//               />
//             </div>
//             <button
//               // onClick={fetchCourses}
//               className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
//               title="Refresh"
//             >
//               <RefreshCw className="w-4 h-4" />
//             </button>
//             <button 
//               onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
//               className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
//               title={viewMode === 'table' ? 'Card View' : 'Table View'}
//             >
//               <List className="w-4 h-4" />
//             </button>
//             <div className="relative">
//               <button
//                 onClick={() => setShowColumnToggle(!showColumnToggle)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
//                 title="Column Visibility"
//               >
//                 <Grid3X3 className="w-4 h-4" />
//               </button>
//               {showColumnToggle && (
//                 <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 z-50 min-w-[150px]">
//                   {columns.map(column => (
//                     <label key={column.key} className="flex items-center space-x-2 py-1 cursor-pointer text-gray-700 hover:bg-gray-50 rounded px-2">
//                       <input
//                         type="checkbox"
//                         checked={visibleColumns[column.key]}
//                         onChange={() => toggleColumn(column.key)}
//                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//                       />
//                       <span className="text-sm">{column.label}</span>
//                     </label>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile Header */}
//         <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//           <div className="flex items-center justify-between mb-3">
//             <button 
//               // onClick={handleCreateCourse} 
//               className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
//             >
//               <Plus className="w-4 h-4" />
//               <span className="hidden sm:inline">Create Course</span>
//               <span className="sm:hidden">Create</span>
//             </button>
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
//             >
//               {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
//             </button>
//           </div>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
//             <input
//               type="text"
//               placeholder="Search courses..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           {isMobileMenuOpen && (
//             <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   // onClick={fetchCourses}
//                   className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                   <span>Refresh</span>
//                 </button>

//                 <button 
//                   onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
//                   className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
//                 >
//                   <List className="w-4 h-4" />
//                   <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
//                 </button>
//                 <button
//                   onClick={() => setShowColumnToggle(!showColumnToggle)}
//                   className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
//                 >
//                   <Grid3X3 className="w-4 h-4" />
//                   <span>Columns</span>
//                 </button>
//               </div>
//               {showColumnToggle && (
//                 <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
//                   <div className="grid grid-cols-2 gap-2">
//                     {columns.map(column => (
//                       <label key={column.key} className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:bg-gray-50 rounded px-2 py-1">
//                         <input
//                           type="checkbox"
//                           checked={visibleColumns[column.key]}
//                           onChange={() => toggleColumn(column.key)}
//                           className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//                         />
//                         <span className="text-sm">{column.label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>  

//         {/* Main Content */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           {viewMode === 'table' ? (
//             // Table View
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-200">
//                     {columns.map(column => (
//                       visibleColumns[column.key] && (
//                         <th
//                           key={column.key}
//                           className={`px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
//                             column.key !== 'actions' ? 'cursor-pointer hover:bg-gray-100' : ''
//                           }`}
//                           onClick={() => column.key !== 'actions' && handleSort(column.key)}
//                         >
//                           <div className="flex items-center space-x-1">
//                             <span>{column.label}</span>
//                             {column.key !== 'actions' && sortConfig.key === column.key && (
//                               <span className="text-blue-600">
//                                 {sortConfig.direction === 'asc' ? '↑' : '↓'}
//                               </span>
//                             )}
//                           </div>
//                         </th>
//                       )
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {paginatedEntries.map((entry, index) => (
//                     <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
//                       {visibleColumns.id && (
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {startIndex + index + 1}
//                         </td>
//                       )}
//                       {visibleColumns.user_info && (
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
//                               <User className="w-4 h-4 text-white" />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {entry.user_info?.name || 'N/A'}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 {entry.user_info?.email || 'N/A'}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       )}
//                       {visibleColumns.course_info && (
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {entry.course_info?.title || 'N/A'}
//                           </div>
//                           <div className="text-sm text-gray-500 capitalize">
//                             {entry.course_info?.type || 'N/A'}
//                           </div>
//                         </td>
//                       )}
//                       {visibleColumns.progress_percentage && (
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
//                               <div 
//                                 className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//                                 style={{ width: `${entry.progress_percentage || 0}%` }}
//                               ></div>
//                             </div>
//                             <span className="text-sm font-medium text-gray-900 min-w-0">
//                               {entry.progress_percentage || 0}%
//                             </span>
//                           </div>
//                         </td>
//                       )}
//                       {visibleColumns.status && (
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center space-x-2">
//                             {getStatusIcon(entry.status)}
//                             <span className={getStatusBadge(entry.status)}>
//                               {entry.status?.replace('_', ' ').toUpperCase() || 'N/A'}
//                             </span>
//                           </div>
//                         </td>
//                       )}
//                       {visibleColumns.session_count && (
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <div className="flex items-center space-x-1">
//                             <BarChart className="w-4 h-4 text-gray-400" />
//                             <span>{entry.session_count || 0}</span>
//                           </div>
//                         </td>
//                       )}
//                       {visibleColumns.completion_date && (
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <div className="flex items-center space-x-1">
//                             <Calendar className="w-4 h-4 text-gray-400" />
//                             <span>{formatDate(entry.completion_date)}</span>
//                           </div>
//                         </td>
//                       )}
//                       {visibleColumns.actions && (
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center space-x-2">
//                             <button
//                               onClick={() => handleEdit(entry)}
//                               className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
//                               title="Edit"
//                             >
//                               <Edit className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteClick(entry)}
//                               className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
//                               title="Delete"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             // Cards View
//             <div className="p-4 sm:p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {paginatedEntries.map((entry, index) => (
//                   <MobileCard
//                     key={entry.id}
//                     entry={entry}
//                     index={index}
//                     onEdit={handleEdit}
//                     onDelete={handleDeleteClick}
//                     onExpand={setExpandedCard}
//                     isExpanded={expandedCard === entry.id}
//                     startIndex={startIndex}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
          
//           <PaginationControls />
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmation
//         isOpen={deleteModal.isOpen}
//         entryToDelete={deleteModal.entryToDelete}
//         onConfirm={handleDeleteConfirm}
//         onCancel={handleDeleteCancel}
//       />
//     </div>
//   );
// };

// export default ModernProgressTrackingManagement;
