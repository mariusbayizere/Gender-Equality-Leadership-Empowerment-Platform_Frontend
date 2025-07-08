// import React, { useState, useEffect } from 'react';
// import { Edit, List, Trash2, BookOpen, User, Clock, Hash, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, Award, Globe, Video } from 'lucide-react';
// import { mockCourses } from './Hardcoded'; // Import mock data for training courses
// import { columns } from './Hardcodedcolumn.js'; // Import column definitions

// // Mock data for training courses


// // Column definitions

// // Delete Confirmation Modal Component
// const DeleteConfirmation = ({
//   isOpen,
//   courseToDelete,
//   onConfirm,
//   onCancel
// }) => {
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
//             <h3 className="text-xl font-semibold text-gray-900">
//               Delete Course
//             </h3>
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
//             Are you sure you want to delete{' '}
//             <span className="font-semibold text-gray-900">
//               "{courseToDelete?.title || ''}"
//             </span>
//             ?
//           </p>
//           <p className="text-sm text-gray-500">
//             This action cannot be undone.
//           </p>
//         </div>
//         <div className="flex gap-3 p-6 pt-0">
//           <button
//             onClick={onCancel}
//             className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onConfirm(courseToDelete?.id)}
//             className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium"
//           >
//             Delete Course
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Course type icon helper
// const getCourseTypeIcon = (type) => {
//   switch (type) {
//     case 'online':
//       return <Globe className="w-4 h-4 text-blue-600" />;
//     case 'webinar':
//       return <Video className="w-4 h-4 text-purple-600" />;
//     case 'certification':
//       return <Award className="w-4 h-4 text-green-600" />;
//     default:
//       return <BookOpen className="w-4 h-4 text-gray-600" />;
//   }
// };

// // Course type badge helper
// const getCourseTypeBadge = (type) => {
//   const baseClasses = "inline-flex px-3 py-1.5 text-xs font-semibold rounded-full";
//   switch (type) {
//     case 'online':
//       return `${baseClasses} bg-blue-100 text-blue-700`;
//     case 'webinar':
//       return `${baseClasses} bg-purple-100 text-purple-700`;
//     case 'certification':
//       return `${baseClasses} bg-green-100 text-green-700`;
//     default:
//       return `${baseClasses} bg-gray-100 text-gray-700`;
//   }
// };

// const ModernTrainingCourseManagement = () => {
//   const [courses, setCourses] = useState(mockCourses);
//   const [filteredCourses, setFilteredCourses] = useState(mockCourses);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(8);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const [expandedCard, setExpandedCard] = useState(null);
//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,
//     courseToDelete: null
//   });
//   const [visibleColumns, setVisibleColumns] = useState({
//     id: true,
//     title: true,
//     description: true,
//     course_type: true,
//     instructor_name: true,
//     duration: true,
//     is_active: true,
//     created_date: true,
//     actions: true
//   });
//   const [viewMode, setViewMode] = useState('table');
//   const [showColumnToggle, setShowColumnToggle] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   // Filter courses based on search term
//   useEffect(() => {
//     const filtered = courses.filter(course =>
//       course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       course.course_type.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredCourses(filtered);
//     setCurrentPage(1);
//   }, [searchTerm, courses]);

//   // Toggle column visibility
//   const toggleColumn = (key) => {
//     setVisibleColumns(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   // Handle sorting
//   const handleSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Calculate pagination
//   const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

//   // Handle edit course
//   const handleEdit = (course) => {
//     console.log('Edit course:', course);
//     // Here you would typically open an edit modal or navigate to edit page
//   };

//   // Handle delete course
//   const handleDelete = async (courseId) => {
//     try {
//         const URL = `http://localhost:3000/api/v1/training_courses/${courseId}`;
//       // Call your API endpoint: DELETE /api/v1/training_courses/:id
//       const response = await fetch(`${URL}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store token in localStorage
//         }
//       });

//       if (response.ok) {
//         setCourses(prev => prev.filter(course => course.id !== courseId));
//         console.log('Course deleted successfully');
//       } else {
//         console.error('Failed to delete course');
//       }
//     } catch (error) {
//       console.error('Error deleting course:', error);
//     }
//   };

//   // Handle delete button click - opens confirmation modal
//   const handleDeleteClick = (course) => {
//     setDeleteModal({
//       isOpen: true,
//       courseToDelete: course
//     });
//   };

//   // Handle delete confirmation
//   const handleDeleteConfirm = (courseId) => {
//     handleDelete(courseId);
//     setDeleteModal({
//       isOpen: false,
//       courseToDelete: null
//     });
//   };

//   // Handle delete cancellation
//   const handleDeleteCancel = () => {
//     setDeleteModal({
//       isOpen: false,
//       courseToDelete: null
//     });
//   };

//   // Fetch courses function
//   const fetchCourses = async () => {
//     try {
//         const URL =`http://localhost:3000/api/v1/training_courses`;
//       // Call your API endpoint: GET /api/v1/training_courses
//       const response = await fetch(`${URL}`, );
//       if (response.ok) {
//         const data = await response.json();
//         setCourses(data);
//       } else {
//         console.error('Failed to fetch courses');
//       }
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     }
//   };

//   // Mobile card view for small screens
//   const MobileCard = ({ course, index }) => {
//     const isExpanded = expandedCard === course?.id;
//     return (
//       <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
//               <BookOpen className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h3 className="text-gray-900 font-semibold text-base truncate max-w-32">
//                 {course?.title || 'N/A'}
//               </h3>
//               <p className="text-gray-500 text-sm">
//                 ID: {startIndex + index + 1}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={() => setExpandedCard(isExpanded ? null : course?.id)}
//             className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <MoreVertical className="w-5 h-5" />
//           </button>
//         </div>
//         <div className="space-y-3">
//           {visibleColumns.course_type && (
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                 {getCourseTypeIcon(course?.course_type)}
//               </div>
//               <span className={getCourseTypeBadge(course?.course_type)}>
//                 {course?.course_type?.charAt(0).toUpperCase() + course?.course_type?.slice(1) || 'N/A'}
//               </span>
//             </div>
//           )}
//           {visibleColumns.instructor_name && (
//             <div className="flex items-center space-x-3">
//               <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                 <User className="w-4 h-4 text-green-600" />
//               </div>
//               <span className="text-gray-700 text-sm">{course?.instructor_name || 'N/A'}</span>
//             </div>
//           )}
//           {visibleColumns.is_active && (
//             <div className="flex items-center space-x-3">
//               <div className={`w-3 h-3 rounded-full ${course?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
//               <span className={`text-sm font-medium ${course?.is_active ? 'text-green-700' : 'text-red-700'}`}>
//                 {course?.is_active ? 'Active' : 'Inactive'}
//               </span>
//             </div>
//           )}
//         </div>
//         {isExpanded && (
//           <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
//             {visibleColumns.description && (
//               <div className="space-y-2">
//                 <h4 className="text-sm font-medium text-gray-700">Description</h4>
//                 <p className="text-gray-600 text-sm">{course?.description || 'N/A'}</p>
//               </div>
//             )}
//             {visibleColumns.duration && (
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
//                   <Clock className="w-4 h-4 text-purple-600" />
//                 </div>
//                 <span className="text-gray-700 text-sm">{course?.duration || 'N/A'}</span>
//               </div>
//             )}
//             {visibleColumns.created_date && (
//               <div className="flex items-center space-x-3">
//                 <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
//                   <Calendar className="w-4 h-4 text-orange-600" />
//                 </div>
//                 <span className="text-gray-700 text-sm">{course?.created_date || 'N/A'}</span>
//               </div>
//             )}
//             {visibleColumns.actions && (
//               <div className="flex items-center space-x-3 pt-3">
//                 <button
//                   onClick={() => handleEdit(course)}
//                   className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
//                   title="Edit"
//                 >
//                   <Edit className="w-4 h-4" />
//                   <span>Edit</span>
//                 </button>
//                 <button
//                   onClick={() => handleDeleteClick(course)}
//                   className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
//                   title="Delete"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                   <span>Delete</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Pagination component
//   const PaginationControls = () => (
//     <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
//       <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
//         {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredCourses.length)} of {filteredCourses.length} rows visible
//       </div>
//       <div className="flex items-center space-x-2 order-1 sm:order-2">
//         <button
//           onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//           disabled={currentPage === 1}
//           className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//         >
//           ‹
//         </button>
//         {[...Array(Math.min(5, totalPages))].map((_, i) => {
//           const pageNum = i + 1;
//           return (
//             <button
//               key={pageNum}
//               onClick={() => setCurrentPage(pageNum)}
//               className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
//                 currentPage === pageNum
//                   ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
//                   : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
//               }`}
//             >
//               {pageNum}
//             </button>
//           );
//         })}
//         {totalPages > 5 && (
//           <>
//             <span className="text-gray-600 px-2">...</span>
//             <button
//               onClick={() => setCurrentPage(totalPages)}
//               className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
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
//           className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//         >
//           ›
//         </button>
//       </div>
//     </div>
//   );

//   if (!paginatedCourses || paginatedCourses.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white rounded-xl p-4 shadow-sm">
//             <div className="flex items-center gap-4">
//               <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
//                 <Plus className="w-4 h-4" />
//                 Create Course
//               </button>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search courses..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-sm"
//                 />
//               </div>
//               <button 
//                 onClick={fetchCourses}
//                 className="p-2.5 text-gray-600 hover:text-gray-800 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm"
//               >
//                 <RefreshCw className="w-4 h-4" />
//               </button>
//               <button className="p-2.5 text-gray-600 hover:text-gray-800 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm">
//                 <Grid3X3 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="p-12 text-center">
//               <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-800 text-xl font-semibold mb-2">No courses found</p>
//               <p className="text-gray-500">Try adjusting your search criteria or add some courses.</p>
//             </div>
//             <PaginationControls />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
//           <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//             <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm">
//               <Plus className="w-4 h-4" />
//               <span>Create Course</span>
//             </button>
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search courses..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
//                 />
//               </div>
//               <button
//                 onClick={fetchCourses}
//                 className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
//                 title="Refresh"
//               >
//                 <RefreshCw className="w-4 h-4" />
//               </button>
//               <button 
//                 onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
//                 className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
//                 title={viewMode === 'table' ? 'Card View' : 'Table View'}
//               >
//                 <List className="w-4 h-4" />
//               </button>
//               <div className="relative column-toggle-container">
//                 <button
//                   onClick={() => setShowColumnToggle(!showColumnToggle)}
//                   className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
//                   title="Column Visibility"
//                 >
//                   <Grid3X3 className="w-4 h-4" />
//                 </button>
//                 {showColumnToggle && (
//                   <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 z-50 min-w-[150px]">
//                     {columns.map(column => (
//                       <label key={column.key} className="flex items-center space-x-2 py-1 cursor-pointer text-gray-700 hover:bg-gray-50 rounded px-2">
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
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//             <div className="flex items-center justify-between mb-3">
//               <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors">
//                 <Plus className="w-4 h-4" />
//                 <span className="hidden sm:inline">Create Course</span>
//                 <span className="sm:hidden">Create</span>
//               </button>
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
//               >
//                 {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
//               </button>
//             </div>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             {isMobileMenuOpen && (
//               <div className="mt-3 mobile-menu-container bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     onClick={fetchCourses}
//                     className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
//                   >
//                     <RefreshCw className="w-4 h-4" />
//                     <span>Refresh</span>
//                   </button>
//                   <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
//                     <List className="w-4 h-4" />
//                     <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
//                   </button>
//                   <button
//                     onClick={() => setShowColumnToggle(!showColumnToggle)}
//                     className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
//                   >
//                     <Grid3X3 className="w-4 h-4" />
//                     <span>Columns</span>
//                   </button>
//                 </div>
//                 {showColumnToggle // This is the remaining code to complete your component

// // Add this after the showColumnToggle section in mobile menu
// && (
//   <div className="bg-white rounded-lg p-3 border border-gray-200">
//     <h4 className="text-sm font-medium text-gray-700 mb-2">Show Columns</h4>
//     <div className="grid grid-cols-2 gap-2">
//       {columns.map(column => (
//         <label key={column.key} className="flex items-center space-x-2 cursor-pointer text-gray-700">
//           <input
//             type="checkbox"
//             checked={visibleColumns[column.key]}
//             onChange={() => toggleColumn(column.key)}
//             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//           />
//           <span className="text-sm">{column.label}</span>
//         </label>
//       ))}
//     </div>
//   </div>
// )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           {viewMode === 'table' ? (
//             <>
//               {/* Table View */}
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       {columns.map(column => (
//                         visibleColumns[column.key] && (
//                           <th 
//                             key={column.key}
//                             className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
//                             onClick={() => column.key !== 'actions' && handleSort(column.key)}
//                           >
//                             <div className="flex items-center space-x-1">
//                               <span>{column.label}</span>
//                               {column.key !== 'actions' && (
//                                 <div className="flex flex-col">
//                                   <div className={`w-0 h-0 border-l-2 border-r-2 border-transparent border-b-2 ${sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'border-b-blue-500' : 'border-b-gray-300'}`}></div>
//                                   <div className={`w-0 h-0 border-l-2 border-r-2 border-transparent border-t-2 ${sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'border-t-blue-500' : 'border-t-gray-300'}`}></div>
//                                 </div>
//                               )}
//                             </div>
//                           </th>
//                         )
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {paginatedCourses.map((course, index) => (
//                       <tr key={course.id} className="hover:bg-gray-50 transition-colors">
//                         {visibleColumns.id && (
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                             {startIndex + index + 1}
//                           </td>
//                         )}
//                         {visibleColumns.title && (
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
//                                 <BookOpen className="w-4 h-4 text-white" />
//                               </div>
//                               <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
//                                 {course.title}
//                               </div>
//                             </div>
//                           </td>
//                         )}
//                         {visibleColumns.description && (
//                           <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
//                             {course.description}
//                           </td>
//                         )}
//                         {visibleColumns.course_type && (
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               {getCourseTypeIcon(course.course_type)}
//                               <span className={`ml-2 ${getCourseTypeBadge(course.course_type)}`}>
//                                 {course.course_type.charAt(0).toUpperCase() + course.course_type.slice(1)}
//                               </span>
//                             </div>
//                           </td>
//                         )}
//                         {visibleColumns.instructor_name && (
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <User className="w-4 h-4 text-gray-400 mr-2" />
//                               <span className="text-sm text-gray-900">{course.instructor_name}</span>
//                             </div>
//                           </td>
//                         )}
//                         {visibleColumns.duration && (
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center">
//                               <Clock className="w-4 h-4 text-gray-400 mr-2" />
//                               <span className="text-sm text-gray-900">{course.duration}</span>
//                             </div>
//                           </td>
//                         )}
//                         {visibleColumns.is_active && (
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                               {course.is_active ? 'Active' : 'Inactive'}
//                             </span>
//                           </td>
//                         )}
//                         {visibleColumns.created_date && (
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {course.created_date}
//                           </td>
//                         )}
//                         {visibleColumns.actions && (
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             <div className="flex space-x-2">
//                               <button
//                                 onClick={() => handleEdit(course)}
//                                 className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
//                                 title="Edit"
//                               >
//                                 <Edit className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteClick(course)}
//                                 className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
//                                 title="Delete"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </td>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           ) : (
//             <>
//               {/* Card View */}
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {paginatedCourses.map((course, index) => (
//                     <MobileCard key={course.id} course={course} index={index} />
//                   ))}
//                 </div>
//               </div>
//             </>
//           )}
          
//           {/* Pagination */}
//           <PaginationControls />
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmation
//         isOpen={deleteModal.isOpen}
//         courseToDelete={deleteModal.courseToDelete}
//         onConfirm={handleDeleteConfirm}
//         onCancel={handleDeleteCancel}
//       />
//     </div>
//   );
// };

// export default ModernTrainingCourseManagement;



import React, { useState, useEffect } from 'react';
import { Edit, List, Trash2, BookOpen, User, Clock, Hash, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, Award, Globe, Video } from 'lucide-react';

// Column definitions
const columns = [
  { key: 'id', label: '# ID' },
  { key: 'title', label: 'Course Title' },
//   { key: 'description', label: 'Description' },
  { key: 'course_type', label: 'Type' },
  { key: 'instructor_name', label: 'Instructor' },
  { key: 'duration', label: 'Duration' },
  { key: 'is_active', label: 'Status' },
//   { key: 'created_date', label: 'Created' },
  { key: 'actions', label: 'Actions' }
];

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';
const API_ENDPOINTS = {
  courses: `${API_BASE_URL}/training_courses`,
  courseById: (id) => `${API_BASE_URL}/training_courses/${id}`
};

// API Service functions
const apiService = {
  // Get auth token (modify this based on your auth implementation)
  getAuthToken: () => {
    return localStorage.getItem('token') || '';
  },

  // Get headers with auth
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiService.getAuthToken()}`
  }),

  // Fetch all courses
  fetchCourses: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.courses, {
        method: 'GET',
        headers: apiService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Delete course
  deleteCourse: async (courseId) => {
    try {
      const response = await fetch(API_ENDPOINTS.courseById(courseId), {
        method: 'DELETE',
        headers: apiService.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};

// Delete Confirmation Modal Component
const DeleteConfirmation = ({
  isOpen,
  courseToDelete,
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Delete Course
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              "{courseToDelete?.title || ''}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(courseToDelete?.id)}
            className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Delete Course
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
    <div className="flex items-center">
      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
      <p className="text-red-800">{message}</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        Try Again
      </button>
    )}
  </div>
);

// Course type icon helper
const getCourseTypeIcon = (type) => {
  switch (type) {
    case 'online':
      return <Globe className="w-4 h-4 text-blue-600" />;
    case 'webinar':
      return <Video className="w-4 h-4 text-purple-600" />;
    case 'certification':
      return <Award className="w-4 h-4 text-green-600" />;
    default:
      return <BookOpen className="w-4 h-4 text-gray-600" />;
  }
};

// Course type badge helper
const getCourseTypeBadge = (type) => {
  const baseClasses = "inline-flex px-3 py-1.5 text-xs font-semibold rounded-full";
  switch (type) {
    case 'online':
      return `${baseClasses} bg-blue-100 text-blue-700`;
    case 'webinar':
      return `${baseClasses} bg-purple-100 text-purple-700`;
    case 'certification':
      return `${baseClasses} bg-green-100 text-green-700`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-700`;
  }
};

const ModernTrainingCourseManagement = () => {
  // State management
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    courseToDelete: null
  });
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    title: true,
    // description: true,
    course_type: true,
    instructor_name: true,
    duration: true,
    is_active: true,
    created_date: true,
    actions: true
  });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses based on search term
  useEffect(() => {
    if (!courses.length) {
      setFilteredCourses([]);
      return;
    }

    const filtered = courses.filter(course =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
    setCurrentPage(1);
  }, [searchTerm, courses]);

  // Fetch courses function
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.fetchCourses();
      setCourses(data);
    } catch (error) {
      setError(`Failed to fetch courses: ${error.message}`);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle column visibility
  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';

  try {
    // Handle Firestore-like timestamp object from JSON
    if (typeof dateValue === 'object' && dateValue._seconds !== undefined) {
      const millis = dateValue._seconds * 1000 + Math.floor((dateValue._nanoseconds || 0) / 1e6);
      return new Date(millis).toLocaleDateString();
    }

    // Firestore Timestamp (with .toDate method)
    if (typeof dateValue === 'object' && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString();
    }

    // Native Date object
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString();
    }

    // ISO date string
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    }

    // Timestamp in ms
    if (typeof dateValue === 'number') {
      return new Date(dateValue).toLocaleDateString();
    }

    return 'N/A';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

  // Calculate pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

  // Handle edit course
  const handleEdit = (course) => {
    console.log('Edit course:', course);
    // Here you would typically open an edit modal or navigate to edit page
  };

  // Handle delete course
  const handleDelete = async (courseId) => {
    try {
      await apiService.deleteCourse(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
      console.log('Course deleted successfully');
    } catch (error) {
      setError(`Failed to delete course: ${error.message}`);
    }
  };

  // Handle delete button click - opens confirmation modal
  const handleDeleteClick = (course) => {
    setDeleteModal({
      isOpen: true,
      courseToDelete: course
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (courseId) => {
    handleDelete(courseId);
    setDeleteModal({
      isOpen: false,
      courseToDelete: null
    });
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      courseToDelete: null
    });
  };
  // Pagination component
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
      <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
        {filteredCourses.length > 0 ? `${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredCourses.length)} of ${filteredCourses.length} rows visible` : 'No data available'}
      </div>
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ‹
        </button>
        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        {totalPages > 5 && (
          <>
            <span className="text-gray-600 px-2">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                currentPage === totalPages
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ErrorMessage message={error} onRetry={fetchCourses} />
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!paginatedCourses || paginatedCourses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
                <Plus className="w-4 h-4" />
                Create Course
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-sm"
                />
              </div>
              <button 
                onClick={fetchCourses}
                className="p-2.5 text-gray-600 hover:text-gray-800 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2.5 text-gray-600 hover:text-gray-800 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm">
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No courses found</p>
              <p className="text-gray-500">Try adjusting your search criteria or add some courses.</p>
            </div>
            <PaginationControls />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
          <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Create Course</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button
                onClick={fetchCourses}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
                title={viewMode === 'table' ? 'Card View' : 'Table View'}
              >
                <List className="w-4 h-4" />
              </button>
              <div className="relative column-toggle-container">
                <button
                  onClick={() => setShowColumnToggle(!showColumnToggle)}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
                  title="Column Visibility"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                {showColumnToggle && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 z-50 min-w-[150px]">
                    {columns.map(column => (
                      <label key={column.key} className="flex items-center space-x-2 py-1 cursor-pointer text-gray-700 hover:bg-gray-50 rounded px-2">
                        <input
                          type="checkbox"
                          checked={visibleColumns[column.key]}
                          onChange={() => toggleColumn(column.key)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm">{column.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 border border-gray-300">
            <div className="flex items-center justify-between mb-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Course</span>
                <span className="sm:hidden">Create</span>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {isMobileMenuOpen && (
              <div className="mt-3 mobile-menu-container bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={fetchCourses}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                  <button 
                    onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    <List className="w-4 h-4" />
                    <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
                  </button>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Column Visibility</p>
                  <div className="grid grid-cols-2 gap-2">
                    {columns.map(column => (
                      <label key={column.key} className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:bg-gray-50 rounded px-2 py-1">
                        <input
                          type="checkbox"
                          checked={visibleColumns[column.key]}
                          onChange={() => toggleColumn(column.key)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs">{column.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {columns.map(column => (
                      visibleColumns[column.key] && (
                        <th
                          key={column.key}
                          className="text-left py-4 px-6 font-semibold text-gray-700 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => column.key !== 'actions' && handleSort(column.key)}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{column.label}</span>
                            {column.key !== 'actions' && (
                              <div className="text-gray-400">
                                {/* {sortConfig.key === column.key ? (
                                  sortConfig.direction === 'asc' ? '↑' : '↓'
                                ) : '↕'} */}
                              </div>
                            )}
                          </div>
                        </th>
                      )
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                     {paginatedCourses.map((course, index) => (
                       <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                         {visibleColumns.id && (
                           <td className="px-6 py-4 whitespace-nowrap min-w-[90px]  text-sm text-gray-900">
                             {startIndex + index + 1}
                           </td>
                         )}

                      {visibleColumns.title && (
                        <td className="py-4 px-6 min-w-[360px]">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center ">
                              <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{course?.title || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.course_type && (
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            {getCourseTypeIcon(course?.course_type)}
                            <span className={getCourseTypeBadge(course?.course_type)}>
                              {course?.course_type?.charAt(0).toUpperCase() + course?.course_type?.slice(1) || 'N/A'}
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.instructor_name && (
                        <td className="py-4 px-6 min-w-[260px]">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{course?.instructor_name || 'N/A'}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.duration && (
                        <td className="py-4 px-6 min-w-[140px]">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{course?.duration || 'N/A'}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.is_active && (
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${course?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`text-sm font-medium ${course?.is_active ? 'text-green-700' : 'text-red-700'}`}>
                              {course?.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                             <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                            {formatDate(course?.created_date)}
                            </span>
                          </div>
                        </td>
                      )}
                      {/* {visibleColumns.created_date && (
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">
                            {formatDate(course?.created_date)}
                            </span>
                          </div>
                        </td>
                      )} */}
                      {visibleColumns.actions && (
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(course)}
                              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors shadow-sm"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(course)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-sm"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedCourses.map((course, index) => (
                  <MobileCard key={course?.id || index} course={course} index={index} />
                ))}
              </div>
            </div>
          )}
          
          <PaginationControls />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        courseToDelete={deleteModal.courseToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Click outside handler for column toggle */}
      {showColumnToggle && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowColumnToggle(false)}
        />
      )}
    </div>
  );
};

export default ModernTrainingCourseManagement;