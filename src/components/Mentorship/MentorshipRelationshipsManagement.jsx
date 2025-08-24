
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Edit, List, Trash2, User, Clock, Target, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, TrendingUp, CheckCircle, Activity, BarChart, Users, Heart } from 'lucide-react';
// import MentorshipRelationshipForm from './MentorshipRelationshipForm';
// import { apiService } from './api_route';
// import { DeleteConfirmation} from './DeleteConfirmation';
// import { columns } from './columns';
// import { getStatusBadge, getStatusIcon } from './getStatusBadge'
// import { MobileCard } from './MobileCard';

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

// // Success Message Component
// const SuccessMessage = ({ message, onClose }) => (
//   <div className="bg-green-50 border border-green-200 rounded-lg p-4 m-4">
//     <div className="flex items-center justify-between">
//       <div className="flex items-center">
//         <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
//         <p className="text-green-800">{message}</p>
//       </div>
//       <button
//         onClick={onClose}
//         className="text-green-600 hover:text-green-800"
//       >
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   </div>
// );

// const MentorshipRelationshipsManagement = () => {
//   // State management
//   const [relationships, setRelationships] = useState([]);
//   const [filteredRelationships, setFilteredRelationships] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(8);
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const [expandedCard, setExpandedCard] = useState(null);
//   const [deleteModal, setDeleteModal] = useState({
//     isOpen: false,
//     relationshipToDelete: null
//   });
//   const [visibleColumns, setVisibleColumns] = useState({
//     id: true,
//     mentor_info: true,
//     mentee_info: true,
//     status: true,
//     program_status: true,
//     matching_criteria: true,
//     actions: true
//   });
//   const [viewMode, setViewMode] = useState('table');
//   const [showColumnToggle, setShowColumnToggle] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [formMode, setFormMode] = useState('create');
//   const [editingRelationship, setEditingRelationship] = useState(null);
  
//   // Cache management
//   const [cache, setCache] = useState({
//     data: null,
//     timestamp: null,
//     lastModified: null
//   });
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Memoized filtered and sorted relationships
//   const processedRelationships = useMemo(() => {
//     if (!relationships.length) return [];
    
//     let filtered = relationships.filter(relationship =>
//       relationship.mentor_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       relationship.mentor_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       relationship.mentee_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       relationship.mentee_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       relationship.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       relationship.program_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       relationship.matching_criteria?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     if (sortConfig.key) {
//       filtered = [...filtered].sort((a, b) => {
//         let aValue = a[sortConfig.key];
//         let bValue = b[sortConfig.key];

//         if (sortConfig.key === 'mentor_info') {
//           aValue = a.mentor_info?.name || '';
//           bValue = b.mentor_info?.name || '';
//         } else if (sortConfig.key === 'mentee_info') {
//           aValue = a.mentee_info?.name || '';
//           bValue = b.mentee_info?.name || '';
//         }

//         if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
//         if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }

//     return filtered;
//   }, [relationships, searchTerm, sortConfig]);

//   // Memoized pagination
//   const paginationData = useMemo(() => {
//     const totalPages = Math.ceil(processedRelationships.length / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const paginatedData = processedRelationships.slice(startIndex, startIndex + itemsPerPage);
    
//     return {
//       totalPages,
//       startIndex,
//       paginatedData
//     };
//   }, [processedRelationships, currentPage, itemsPerPage]);

//   // Pagination component
//   const PaginationControls = () => (
//     <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
//       <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
//         {filteredRelationships.length > 0 ? `${paginationData.startIndex + 1} - ${Math.min(paginationData.startIndex + itemsPerPage, filteredRelationships.length)} of ${filteredRelationships.length} rows visible` : 'No data available'}
//       </div>
//       <div className="flex items-center space-x-2 order-1 sm:order-2">
//         <button
//           onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//           disabled={currentPage === 1}
//           className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//         >
//           ‹
//         </button>
//         {[...Array(Math.min(3, paginationData.totalPages))].map((_, i) => {
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
//         {paginationData.totalPages > 3 && (
//           <>
//             <span className="text-gray-600 px-1">...</span>
//             <button
//               onClick={() => setCurrentPage(paginationData.totalPages)}
//               className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
//                 currentPage === paginationData.totalPages
//                   ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
//                   : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
//               }`}
//             >
//               {paginationData.totalPages}
//             </button>
//           </>
//         )}
//         <button
//           onClick={() => setCurrentPage(Math.min(paginationData.totalPages, currentPage + 1))}
//           disabled={currentPage === paginationData.totalPages}
//           className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
//         >
//           ›
//         </button>
//       </div>
//     </div>
//   );

//   // Optimized fetch function with caching
//   const fetchRelationships = useCallback(async (forceRefresh = false) => {
//     try {
//       const now = Date.now();
//       const cacheAge = now - (cache.timestamp || 0);
//       const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes cache

//       // Use cache if valid and not forcing refresh
//       if (!forceRefresh && cacheValid && cache.data) {
//         setRelationships(cache.data);
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError(null);
      
//       const data = await apiService.fetchMentorshipRelationships();
      
//       // Update cache
//       setCache({
//         data,
//         timestamp: now,
//         lastModified: data.length > 0 ? Math.max(...data.map(item => new Date(item.updated_at || item.created_at).getTime())) : now
//       });
      
//       setRelationships(data);
//       setCurrentPage(1); // Reset to first page when data changes
//     } catch (error) {
//       setError(`Failed to fetch mentorship relationships: ${error.message}`);
//       setRelationships([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [cache]);

//   // Optimized refresh function
//   const handleRefresh = useCallback(async () => {
//     setIsRefreshing(true);
//     await fetchRelationships(true);
//     setIsRefreshing(false);
//   }, [fetchRelationships]);

//   // Fetch relationships on component mount
//   useEffect(() => {
//     fetchRelationships();
//   }, [fetchRelationships]);

//   // Update filtered relationships when processed data changes
//   useEffect(() => {
//     setFilteredRelationships(processedRelationships);
//   }, [processedRelationships]);

//   // Reset to first page when search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

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

//   const toggleColumn = useCallback((key) => {
//     setVisibleColumns(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   }, []);

//   const handleSort = useCallback((key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   }, [sortConfig]);

//   const handleDelete = useCallback(async (relationshipId) => {
//     try {
//       setDeleting(true);
//       await apiService.deleteMentorshipRelationship(relationshipId);
      
//       // Update local state immediately
//       setRelationships(prev => prev.filter(relationship => relationship.id !== relationshipId));
      
//       // Invalidate cache to force refresh on next fetch
//       setCache(prev => ({ ...prev, timestamp: 0 }));
      
//       setSuccessMessage('Mentorship relationship deleted successfully');
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       setError(`Failed to delete mentorship relationship: ${error.message}`);
//     } finally {
//       setDeleting(false);
//     }
//   }, []);

//   const handleDeleteClick = useCallback((relationship) => {
//     setDeleteModal({
//       isOpen: true,
//       relationshipToDelete: relationship
//     });
//   }, []);

//   const handleDeleteConfirm = useCallback((relationshipId) => {
//     handleDelete(relationshipId);
//     setDeleteModal({
//       isOpen: false,
//       relationshipToDelete: null
//     });
//   }, [handleDelete]);

//   const handleDeleteCancel = useCallback(() => {
//     setDeleteModal({
//       isOpen: false,
//       relationshipToDelete: null
//     });
//   }, []);

//   const handleCreateNew = useCallback(() => {
//     setFormMode('create');
//     setEditingRelationship(null);
//     setShowModal(true);
//   }, []);

//   const handleEdit = useCallback((relationship) => {
//     setFormMode('update');
//     setEditingRelationship(relationship);
//     setShowModal(true);
//   }, []);

//   const handleRelationshipCreated = useCallback((newRelationship) => {
//     // Add new relationship to local state immediately
//     setRelationships(prev => [newRelationship, ...prev]);
    
//     // Invalidate cache
//     setCache(prev => ({ ...prev, timestamp: 0 }));
    
//     setSuccessMessage('Mentorship relationship created successfully');
//     setTimeout(() => setSuccessMessage(null), 3000);
    
//     // Close modal
//     setShowModal(false);
//   }, []);

//   const handleRelationshipUpdated = useCallback((updatedRelationship) => {
//     // Update relationship in local state immediately
//     setRelationships(prev => 
//       prev.map(rel => 
//         rel.id === updatedRelationship.id ? updatedRelationship : rel
//       )
//     );
    
//     // Invalidate cache
//     setCache(prev => ({ ...prev, timestamp: 0 }));
    
//     setSuccessMessage('Mentorship relationship updated successfully');
//     setTimeout(() => setSuccessMessage(null), 3000);
    
//     // Close modal
//     setShowModal(false);
//   }, []);

//   const handleCreateRelationship = useCallback(() => {
//     handleCreateNew();
//   }, [handleCreateNew]);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString();
//   };

//   // Loading state
//   if (loading && !cache.data) {
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
//   if (error && !cache.data) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <ErrorMessage message={error} onRetry={fetchRelationships} />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Empty state
//   if (!paginationData.paginatedData || paginationData.paginatedData.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//         <div className="max-w-7xl mx-auto">
//           {successMessage && (
//             <SuccessMessage 
//               message={successMessage} 
//               onClose={() => setSuccessMessage(null)} 
//             />
//           )}
//           <div className="flex flex-col space-y-4 mb-6">
//             <div className="bg-white rounded-xl p-4 shadow-sm">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//                 <button 
//                   onClick={handleCreateRelationship}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
//                 >
//                   <Plus className="w-4 h-4" />
//                   <span className="hidden sm:inline">Create Relationship</span>
//                   <span className="sm:hidden">Create</span>
//                 </button>
//                 <div className="flex items-center gap-3 w-full sm:w-auto">
//                   <div className="relative flex-1 sm:flex-initial">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       placeholder="Search relationships..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 bg-white shadow-sm"
//                     />
//                   </div>
//                   <button 
//                     onClick={handleRefresh}
//                     disabled={isRefreshing}
//                     className="p-2.5 text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50"
//                   >
//                     <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="p-8 sm:p-12 text-center">
//               <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-800 text-xl font-semibold mb-2">No mentorship relationships found</p>
//               <p className="text-gray-500">Try adjusting your search criteria or add some relationships.</p>
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
//         {successMessage && (
//           <SuccessMessage 
//             message={successMessage} 
//             onClose={() => setSuccessMessage(null)} 
//           />
//         )}
        
//         <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
//           {/* Desktop Header */}
//           <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//             <button 
//               onClick={handleCreateNew} 
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
//             >
//               <Plus className="w-4 h-4" />
//               <span>Create Relationship</span>
//             </button>
//             <div className="flex items-center space-x-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search relationships..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
//                 />
//               </div>
//               <button
//                 onClick={handleRefresh}
//                 disabled={isRefreshing}
//                 className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors disabled:opacity-50"
//                 title="Refresh"
//               >
//                 <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
//               </button>
//               <button 
//                 onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
//                 className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
//                 title={viewMode === 'table' ? 'Card View' : 'Table View'}
//               >
//                 <List className="w-4 h-4" />
//               </button>
//               <div className="relative">
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
    
//           {/* Mobile Header */}
//           <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 border border-gray-200">
//             <div className="flex items-center justify-between mb-3">
//               <button 
//                 onClick={handleCreateNew} 
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span className="hidden sm:inline">Create Relationship</span>
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
//                 placeholder="Search relationships..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             {isMobileMenuOpen && (
//               <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     onClick={handleRefresh}
//                     disabled={isRefreshing}
//                     className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
//                   >
//                     <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
//                     <span>Refresh</span>
//                   </button>
    
//                   <button 
//                     onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
//                     className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
//                   >
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
//                 {showColumnToggle && (
//                   <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
//                     <div className="grid grid-cols-2 gap-2">
//                       {columns.map(column => (
//                         <label key={column.key} className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:bg-gray-50 rounded px-2 py-1">
//                           <input
//                             type="checkbox"
//                             checked={visibleColumns[column.key]}
//                             onChange={() => toggleColumn(column.key)}
//                             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//                           />
//                           <span className="text-sm">{column.label}</span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>   

//         {/* Main Content */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           {viewMode === 'table' ? (
//             <>
//               <div className="overflow-hidden">
//                 <table className="w-full table-fixed">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       {columns.map((column) => (
//                         visibleColumns[column.key] && (
//                           <th
//                             key={column.key}
//                             className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${
//                               column.key === 'id' ? 'w-16' :
//                               column.key === 'mentor_info' ? 'w-64' :
//                               column.key === 'mentee_info' ? 'w-64' :
//                               column.key === 'status' ? 'w-32' :
//                               column.key === 'program_status' ? 'w-32' :
//                               column.key === 'matching_criteria' ? 'w-48' :
//                               column.key === 'actions' ? 'w-24' : 'w-auto'
//                             }`}
//                             onClick={() => column.key !== 'actions' && handleSort(column.key)}
//                           >
//                             <div className="flex items-center space-x-1">
//                               <span className="truncate">{column.label}</span>
//                               {column.key !== 'actions' && (
//                                 <div className="flex flex-col">
//                                   <div className={`w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-400 ${
//                                     sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'border-b-blue-600' : ''
//                                   }`} />
//                                   <div className={`w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-400 ${
//                                     sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'border-t-blue-600' : ''
//                                   }`} />
//                                 </div>
//                               )}
//                             </div>
//                           </th>
//                         )
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {paginationData.paginatedData.map((relationship, index) => (
//                       <tr key={relationship.id} className="hover:bg-gray-50 transition-colors">
//                         {visibleColumns.id && (
//                           <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate">
//                             {paginationData.startIndex + index + 1}
//                           </td>
//                         )}
//                         {visibleColumns.mentor_info && (
//                           <td className="px-6 py-4">
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 h-10 w-10">
//                                 <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                                   <User className="h-5 w-5 text-blue-600" />
//                                 </div>
//                               </div>
//                               <div className="ml-4 min-w-0 flex-1">
//                                 <div className="text-sm font-medium text-gray-900 truncate">
//                                   {relationship.mentor_info?.name || 'N/A'}
//                                 </div>
//                                 <div className="text-sm text-gray-500 truncate">
//                                   {relationship.mentor_info?.email || 'N/A'}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                         )}
//                         {visibleColumns.mentee_info && (
//                           <td className="px-6 py-4">
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 h-10 w-10">
//                                 <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
//                                   <User className="h-5 w-5 text-green-600" />
//                                 </div>
//                               </div>
//                               <div className="ml-4 min-w-0 flex-1">
//                                 <div className="text-sm font-medium text-gray-900 truncate">
//                                   {relationship.mentee_info?.name || 'N/A'}
//                                 </div>
//                                 <div className="text-sm text-gray-500 truncate">
//                                   {relationship.mentee_info?.email || 'N/A'}
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                         )}
//                         {visibleColumns.status && (
//                           <td className="px-6 py-4">
//                             <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full truncate ${getStatusBadge(relationship.status)}`}>
//                               {relationship.status?.toUpperCase() || 'N/A'}
//                             </span>
//                           </td>
//                         )}
//                         {visibleColumns.program_status && (
//                           <td className="px-6 py-4">
//                             <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full truncate ${getStatusBadge(relationship.program_status)}`}>
//                               {relationship.program_status?.toUpperCase() || 'N/A'}
//                             </span>
//                           </td>
//                         )}
//                         {visibleColumns.matching_criteria && (
//                           <td className="px-6 py-4 text-sm text-gray-900">
//                             <div className="truncate" title={relationship.matching_criteria || 'N/A'}>
//                               {relationship.matching_criteria || 'N/A'}
//                             </div>
//                           </td>
//                         )}
//                         {visibleColumns.actions && (
//                           <td className="px-6 py-4 text-sm font-medium">
//                             <div className="flex items-center space-x-2">
//                               <button
//                                 onClick={() => handleEdit(relationship)}
//                                 className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
//                                 title="Edit"
//                               >
//                                 <Edit className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteClick(relationship)}
//                                 className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
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
//             <div className="p-4 sm:p-6">
//               <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 {paginationData.paginatedData.map((relationship, index) => (
//                   <MobileCard
//                     key={relationship.id}
//                     relationship={relationship}
//                     index={index}
//                     startIndex={paginationData.startIndex}
//                     onEdit={handleEdit}
//                     onDelete={handleDeleteClick}
//                     onExpand={setExpandedCard}
//                     isExpanded={expandedCard === relationship.id}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
          
//           <PaginationControls />
//         </div>
//       </div>
      
//       <MentorshipRelationshipForm
//         showModal={showModal}
//         setShowModal={setShowModal}
//         onRelationshipCreated={handleRelationshipCreated}
//         onRelationshipUpdated={handleRelationshipUpdated}
//         editingRelationship={editingRelationship}
//         mode={formMode}
//       />

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmation
//         isOpen={deleteModal.isOpen}
//         relationshipToDelete={deleteModal.relationshipToDelete}
//         onConfirm={handleDeleteConfirm}
//         onCancel={handleDeleteCancel}
//       />
//     </div>
//   );
// };

// export default MentorshipRelationshipsManagement;


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Edit, List, Trash2, User, Clock, Target, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, TrendingUp, CheckCircle, Activity, BarChart, Users, Heart } from 'lucide-react';
import MentorshipRelationshipForm from './MentorshipRelationshipForm';
import { apiService } from './api_route';
import { DeleteConfirmation} from './DeleteConfirmation';
import { columns } from './columns';
import { getStatusBadge, getStatusIcon } from './getStatusBadge'
import { MobileCard } from './MobileCard';

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

// Success Message Component
const SuccessMessage = ({ message, onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
        <p className="text-green-800">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-green-600 hover:text-green-800"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const MentorshipRelationshipsManagement = () => {
  // State management
  const [relationships, setRelationships] = useState([]);
  const [filteredRelationships, setFilteredRelationships] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    relationshipToDelete: null
  });
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    mentor_info: true,
    mentee_info: true,
    status: true,
    program_status: true,
    matching_criteria: true,
    actions: true
  });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [editingRelationship, setEditingRelationship] = useState(null);
  
  // Cache management
  const [cache, setCache] = useState({
    data: null,
    timestamp: null,
    lastModified: null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoized filtered and sorted relationships
  const processedRelationships = useMemo(() => {
    if (!relationships.length) return [];
    
    let filtered = relationships.filter(relationship =>
      relationship.mentor_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.mentor_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.mentee_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.mentee_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.program_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.matching_criteria?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'mentor_info') {
          aValue = a.mentor_info?.name || '';
          bValue = b.mentor_info?.name || '';
        } else if (sortConfig.key === 'mentee_info') {
          aValue = a.mentee_info?.name || '';
          bValue = b.mentee_info?.name || '';
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [relationships, searchTerm, sortConfig]);

  // Memoized pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(processedRelationships.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = processedRelationships.slice(startIndex, startIndex + itemsPerPage);
    
    return {
      totalPages,
      startIndex,
      paginatedData
    };
  }, [processedRelationships, currentPage, itemsPerPage]);

  // Pagination component
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
      <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
        {filteredRelationships.length > 0 ? `${paginationData.startIndex + 1} - ${Math.min(paginationData.startIndex + itemsPerPage, filteredRelationships.length)} of ${filteredRelationships.length} rows visible` : 'No data available'}
      </div>
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ‹
        </button>
        {[...Array(Math.min(3, paginationData.totalPages))].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        {paginationData.totalPages > 3 && (
          <>
            <span className="text-gray-600 px-1">...</span>
            <button
              onClick={() => setCurrentPage(paginationData.totalPages)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                currentPage === paginationData.totalPages
                  ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
              }`}
            >
              {paginationData.totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => setCurrentPage(Math.min(paginationData.totalPages, currentPage + 1))}
          disabled={currentPage === paginationData.totalPages}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );

  // Optimized fetch function with caching
  const fetchRelationships = useCallback(async (forceRefresh = false) => {
    try {
      const now = Date.now();
      const cacheAge = now - (cache.timestamp || 0);
      const cacheValid = cacheAge < 5 * 60 * 1000; // 5 minutes cache

      // Use cache if valid and not forcing refresh
      if (!forceRefresh && cacheValid && cache.data) {
        setRelationships(cache.data);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      const data = await apiService.fetchMentorshipRelationships();
      
      // Update cache
      setCache({
        data,
        timestamp: now,
        lastModified: data.length > 0 ? Math.max(...data.map(item => new Date(item.updated_at || item.created_at).getTime())) : now
      });
      
      setRelationships(data);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      setError(`Failed to fetch mentorship relationships: ${error.message}`);
      setRelationships([]);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  // Optimized refresh function
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchRelationships(true);
    setIsRefreshing(false);
  }, [fetchRelationships]);

  // Fetch relationships on component mount
  useEffect(() => {
    fetchRelationships();
  }, [fetchRelationships]);

  // Update filtered relationships when processed data changes
  useEffect(() => {
    setFilteredRelationships(processedRelationships);
  }, [processedRelationships]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('cards');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleColumn = useCallback((key) => {
    setVisibleColumns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const handleDelete = useCallback(async (relationshipId) => {
    try {
      setDeleting(true);
      await apiService.deleteMentorshipRelationship(relationshipId);
      
      // Update local state immediately
      setRelationships(prev => prev.filter(relationship => relationship.id !== relationshipId));
      
      // Invalidate cache to force refresh on next fetch
      setCache(prev => ({ ...prev, timestamp: 0 }));
      
      setSuccessMessage('Mentorship relationship deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(`Failed to delete mentorship relationship: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  }, []);

  const handleDeleteClick = useCallback((relationship) => {
    setDeleteModal({
      isOpen: true,
      relationshipToDelete: relationship
    });
  }, []);

  const handleDeleteConfirm = useCallback((relationshipId) => {
    handleDelete(relationshipId);
    setDeleteModal({
      isOpen: false,
      relationshipToDelete: null
    });
  }, [handleDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      relationshipToDelete: null
    });
  }, []);

  const handleCreateNew = useCallback(() => {
    setFormMode('create');
    setEditingRelationship(null);
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((relationship) => {
    setFormMode('update');
    setEditingRelationship(relationship);
    setShowModal(true);
  }, []);

  const handleRelationshipCreated = useCallback((newRelationship) => {
    // Add new relationship to local state immediately
    setRelationships(prev => [newRelationship, ...prev]);
    
    // Invalidate cache
    setCache(prev => ({ ...prev, timestamp: 0 }));
    
    setSuccessMessage('Mentorship relationship created successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
    
    // Close modal
    setShowModal(false);
  }, []);

  const handleRelationshipUpdated = useCallback((updatedRelationship) => {
    // Update relationship in local state immediately
    setRelationships(prev => 
      prev.map(rel => 
        rel.id === updatedRelationship.id ? updatedRelationship : rel
      )
    );
    
    // Invalidate cache
    setCache(prev => ({ ...prev, timestamp: 0 }));
    
    setSuccessMessage('Mentorship relationship updated successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
    
    // Close modal
    setShowModal(false);
  }, []);

  const handleCreateRelationship = useCallback(() => {
    handleCreateNew();
  }, [handleCreateNew]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Loading state
  if (loading && !cache.data) {
    return (
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Error state
  if (error && !cache.data) {
    return (
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <ErrorMessage message={error} onRetry={fetchRelationships} />
        </div>
      </div>
    );
  }

  // Empty state
  if (!paginationData.paginatedData || paginationData.paginatedData.length === 0) {
    return (
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
        {successMessage && (
          <div className="flex-shrink-0 p-6 pb-0">
            <SuccessMessage 
              message={successMessage} 
              onClose={() => setSuccessMessage(null)} 
            />
          </div>
        )}
        
        <div className="flex-shrink-0 p-6 pb-0">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <button 
              onClick={handleCreateRelationship}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Relationship</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search relationships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
                title={viewMode === 'table' ? 'Card View' : 'Table View'}
              >
                <List className="w-4 h-4" />
              </button>
              <div className="relative">
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

          {/* Mobile Header */}
          <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <button 
                onClick={handleCreateNew} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Relationship</span>
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
                placeholder="Search relationships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {isMobileMenuOpen && (
              <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button 
                    onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    <List className="w-4 h-4" />
                    <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
                  </button>
                  <button
                    onClick={() => setShowColumnToggle(!showColumnToggle)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span>Columns</span>
                  </button>
                </div>
                {showColumnToggle && (
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {columns.map(column => (
                        <label key={column.key} className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:bg-gray-50 rounded px-2 py-1">
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
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 px-6 pb-6 overflow-hidden">
          <div className="h-full bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-800 text-xl font-semibold mb-2">No mentorship relationships found</p>
                <p className="text-gray-500">Try adjusting your search criteria or add some relationships.</p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <PaginationControls />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden">
      {successMessage && (
        <div className="flex-shrink-0 p-6 pb-0">
          <SuccessMessage 
            message={successMessage} 
            onClose={() => setSuccessMessage(null)} 
          />
        </div>
      )}
      
      <div className="flex-shrink-0 p-6 pb-0">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <button 
            onClick={handleCreateNew} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Relationship</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search relationships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors"
              title={viewMode === 'table' ? 'Card View' : 'Table View'}
            >
              <List className="w-4 h-4" />
            </button>
            <div className="relative">
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

        {/* Mobile Header */}
        <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={handleCreateNew} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Relationship</span>
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
              placeholder="Search relationships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {isMobileMenuOpen && (
            <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                <button 
                  onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  <List className="w-4 h-4" />
                  <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
                </button>
                <button
                  onClick={() => setShowColumnToggle(!showColumnToggle)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Columns</span>
                </button>
              </div>
              {showColumnToggle && (
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {columns.map(column => (
                      <label key={column.key} className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:bg-gray-50 rounded px-2 py-1">
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
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results info */}
        {filteredRelationships.length > 0 && (
          <div className="mt-4">
            <p className="text-gray-600 text-sm font-medium">
              Showing {paginationData.startIndex + 1}-{Math.min(paginationData.startIndex + itemsPerPage, filteredRelationships.length)} of {filteredRelationships.length} relationships
            </p>
          </div>
        )}
      </div>

      {/* Main Content Area - This will fill remaining height */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        {/* No results message */}
        {filteredRelationships.length === 0 && searchTerm && (
          <div className="h-full bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-800 text-xl font-semibold mb-2">No relationships match your search</p>
                <p className="text-gray-500">Try searching with different keywords or clear the search to see all relationships.</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <PaginationControls />
            </div>
          </div>
        )}

        {/* Main Content - Table or Cards */}
        {filteredRelationships.length > 0 && (
          <div className="h-full bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden">
              {viewMode === 'table' ? (
                <div className="h-full overflow-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                      <tr>
                        {columns.map((column) => (
                          visibleColumns[column.key] && (
                            <th
                              key={column.key}
                              className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${
                                column.key === 'id' ? 'w-16' :
                                column.key === 'mentor_info' ? 'w-64' :
                                column.key === 'mentee_info' ? 'w-64' :
                                column.key === 'status' ? 'w-32' :
                                column.key === 'program_status' ? 'w-32' :
                                column.key === 'matching_criteria' ? 'w-48' :
                                column.key === 'actions' ? 'w-24' : 'w-auto'
                              }`}
                              onClick={() => column.key !== 'actions' && handleSort(column.key)}
                            >
                              <div className="flex items-center space-x-1">
                                <span className="truncate">{column.label}</span>
                                {column.key !== 'actions' && (
                                  <div className="flex flex-col">
                                    <div className={`w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-gray-400 ${
                                      sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'border-b-blue-600' : ''
                                    }`} />
                                    <div className={`w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-400 ${
                                      sortConfig.key === column.key && sortConfig.direction === 'desc' ? 'border-t-blue-600' : ''
                                    }`} />
                                  </div>
                                )}
                              </div>
                            </th>
                          )
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginationData.paginatedData.map((relationship, index) => (
                        <tr key={relationship.id} className="hover:bg-gray-50 transition-colors">
                          {visibleColumns.id && (
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate">
                              {paginationData.startIndex + index + 1}
                            </td>
                          )}
                          {visibleColumns.mentor_info && (
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-blue-600" />
                                  </div>
                                </div>
                                <div className="ml-4 min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {relationship.mentor_info?.name || 'N/A'}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate">
                                    {relationship.mentor_info?.email || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>
                          )}
                          {visibleColumns.mentee_info && (
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-green-600" />
                                  </div>
                                </div>
                                <div className="ml-4 min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {relationship.mentee_info?.name || 'N/A'}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate">
                                    {relationship.mentee_info?.email || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>
                          )}
                          {visibleColumns.status && (
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full truncate ${getStatusBadge(relationship.status)}`}>
                                {relationship.status?.toUpperCase() || 'N/A'}
                              </span>
                            </td>
                          )}
                          {visibleColumns.program_status && (
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full truncate ${getStatusBadge(relationship.program_status)}`}>
                                {relationship.program_status?.toUpperCase() || 'N/A'}
                              </span>
                            </td>
                          )}
                          {visibleColumns.matching_criteria && (
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="truncate" title={relationship.matching_criteria || 'N/A'}>
                                {relationship.matching_criteria || 'N/A'}
                              </div>
                            </td>
                          )}
                          {visibleColumns.actions && (
                            <td className="px-6 py-4 text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleEdit(relationship)}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(relationship)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
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
                <div className="h-full overflow-auto p-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {paginationData.paginatedData.map((relationship, index) => (
                      <MobileCard
                        key={relationship.id}
                        relationship={relationship}
                        index={index}
                        startIndex={paginationData.startIndex}
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                        onExpand={setExpandedCard}
                        isExpanded={expandedCard === relationship.id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <PaginationControls />
            </div>
          </div>
        )}
      </div>
      
      <MentorshipRelationshipForm
        showModal={showModal}
        setShowModal={setShowModal}
        onRelationshipCreated={handleRelationshipCreated}
        onRelationshipUpdated={handleRelationshipUpdated}
        editingRelationship={editingRelationship}
        mode={formMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        relationshipToDelete={deleteModal.relationshipToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default MentorshipRelationshipsManagement;