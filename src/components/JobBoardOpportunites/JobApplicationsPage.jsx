// import React, { useState, useEffect } from 'react';
// import { Calendar, MapPin, FileText, Clock, CheckCircle, XCircle, AlertCircle, User, Building } from 'lucide-react';

// const JobApplicationsPage = () => {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [statusSummary, setStatusSummary] = useState({});
//   const [filterStatus, setFilterStatus] = useState('all');

//   // Function to convert Firestore timestamp to readable date
//   const formatFirestoreDate = (timestamp) => {
//     if (!timestamp || !timestamp._seconds) return 'N/A';
//     const date = new Date(timestamp._seconds * 1000);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Function to get status color and icon
//   const getStatusInfo = (status) => {
//     const statusMap = {
//       'pending': { 
//         color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
//         icon: Clock, 
//         label: 'Pending' 
//       },
//       'under_review': { 
//         color: 'bg-blue-100 text-blue-800 border-blue-200', 
//         icon: AlertCircle, 
//         label: 'Under Review' 
//       },
//       'interview_scheduled': { 
//         color: 'bg-purple-100 text-purple-800 border-purple-200', 
//         icon: Calendar, 
//         label: 'Interview Scheduled' 
//       },
//       'accepted': { 
//         color: 'bg-green-100 text-green-800 border-green-200', 
//         icon: CheckCircle, 
//         label: 'Accepted' 
//       },
//       'rejected': { 
//         color: 'bg-red-100 text-red-800 border-red-200', 
//         icon: XCircle, 
//         label: 'Rejected' 
//       }
//     };
//     return statusMap[status] || { 
//       color: 'bg-gray-100 text-gray-800 border-gray-200', 
//       icon: AlertCircle, 
//       label: status 
//     };
//   };

//   // Fetch applications from API
//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         setLoading(true);
        
//         // Get token from localStorage (adjust based on your auth implementation)
//         const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        
//         if (!token) {
//           throw new Error('Authentication token not found. Please login.');
//         }

//         const response = await fetch('http://localhost:3000/api/v1/job-applications/my-applications', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         if (!response.ok) {
//           if (response.status === 401) {
//             throw new Error('Authentication failed. Please login again.');
//           }
//           throw new Error(`Failed to fetch applications: ${response.status}`);
//         }

//         const data = await response.json();
        
//         if (data.success) {
//           setApplications(data.data.applications);
//           setStatusSummary(data.data.statusSummary);
//         } else {
//           throw new Error(data.message || 'Failed to fetch applications');
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching applications:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplications();
//   }, []);

//   // Filter applications based on status
//   const filteredApplications = filterStatus === 'all' 
//     ? applications 
//     : applications.filter(app => app.applicationStatus === filterStatus);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your applications...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
//           <div className="text-center">
//             <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//             <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Applications</h2>
//             <p className="text-gray-600 mb-4">{error}</p>
//             <button 
//               onClick={() => window.location.reload()} 
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">My Job Applications</h1>
//           <p className="mt-2 text-gray-600">Track the status of your job applications</p>
//         </div>

//         {/* Status Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <div className="flex items-center">
//               <FileText className="h-8 w-8 text-blue-600" />
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Applications</p>
//                 <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
//               </div>
//             </div>
//           </div>
//           {Object.entries(statusSummary).map(([status, count]) => {
//             const statusInfo = getStatusInfo(status);
//             const StatusIcon = statusInfo.icon;
//             return (
//               <div key={status} className="bg-white p-6 rounded-lg shadow-sm border">
//                 <div className="flex items-center">
//                   <StatusIcon className="h-8 w-8 text-gray-600" />
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-600">{statusInfo.label}</p>
//                     <p className="text-2xl font-bold text-gray-900">{count}</p>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Filter */}
//         <div className="mb-6">
//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//           >
//             <option value="all">All Applications</option>
//             {Object.keys(statusSummary).map(status => (
//               <option key={status} value={status}>
//                 {getStatusInfo(status).label}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Applications List */}
//         {filteredApplications.length === 0 ? (
//           <div className="text-center py-12">
//             <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
//             <p className="text-gray-600">
//               {filterStatus === 'all' 
//                 ? "You haven't submitted any job applications yet." 
//                 : `No applications with status: ${getStatusInfo(filterStatus).label}`
//               }
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredApplications.map((application) => {
//               const statusInfo = getStatusInfo(application.applicationStatus);
//               const StatusIcon = statusInfo.icon;

//               return (
//                 <div key={application.applicationId} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
//                   <div className="p-6">
//                     {/* Header */}
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex-1">
//                         <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                           {application.jobTitle}
//                         </h3>
//                         <div className="flex items-center text-gray-600 mb-2">
//                           <Building className="h-4 w-4 mr-2" />
//                           <span>{application.company}</span>
//                         </div>
//                         {application.jobLocation && (
//                           <div className="flex items-center text-gray-600">
//                             <MapPin className="h-4 w-4 mr-2" />
//                             <span>{application.jobLocation}</span>
//                           </div>
//                         )}
//                       </div>
//                       <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
//                         <StatusIcon className="h-4 w-4 mr-2" />
//                         {statusInfo.label}
//                       </div>
//                     </div>

//                     {/* Application Details */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <p className="text-sm font-medium text-gray-700">Applied Date</p>
//                         <p className="text-sm text-gray-600">{formatFirestoreDate(application.appliedDate)}</p>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-700">Documents Status</p>
//                         <div className="flex items-center">
//                           {application.documentsVerified ? (
//                             <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
//                           ) : (
//                             <XCircle className="h-4 w-4 text-red-500 mr-1" />
//                           )}
//                           <p className="text-sm text-gray-600">
//                             {application.documentsVerified ? 'Verified' : 'Not Verified'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Verification Message */}
//                     {application.verificationMessage && (
//                       <div className="mb-4 p-3 bg-blue-50 rounded-md">
//                         <p className="text-sm text-blue-800">{application.verificationMessage}</p>
//                       </div>
//                     )}

//                     {/* Interview Details */}
//                     {application.interviewDetails && (
//                       <div className="mb-4 p-4 bg-green-50 rounded-md border border-green-200">
//                         <h4 className="text-sm font-medium text-green-800 mb-2">Interview Scheduled</h4>
//                         <div className="flex items-center text-green-700">
//                           <Calendar className="h-4 w-4 mr-2" />
//                           <span className="text-sm">
//                             {formatFirestoreDate(application.interviewDetails.date)} at {application.interviewDetails.time}
//                           </span>
//                         </div>
//                       </div>
//                     )}

//                     {/* Submitted Documents */}
//                     <div className="border-t pt-4">
//                       <h4 className="text-sm font-medium text-gray-700 mb-2">Submitted Documents</h4>
//                       <div className="flex flex-wrap gap-2">
//                         {application.cvFileName && (
//                           <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
//                             <FileText className="h-3 w-3 mr-1" />
//                             CV: {application.cvFileName}
//                           </span>
//                         )}
//                         {application.certificateFileName && (
//                           <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
//                             <FileText className="h-3 w-3 mr-1" />
//                             Certificate: {application.certificateFileName}
//                           </span>
//                         )}
//                       </div>
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

// export default JobApplicationsPage;

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, FileText, Clock, CheckCircle, XCircle, AlertCircle, User, Building } from 'lucide-react';

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusSummary, setStatusSummary] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');

  // Dark mode detection
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Function to convert Firestore timestamp to readable date
  const formatFirestoreDate = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return 'N/A';
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to get status color and icon with dark mode support
  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800', 
        icon: Clock, 
        label: 'Pending' 
      },
      'under_review': { 
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800', 
        icon: AlertCircle, 
        label: 'Under Review' 
      },
      'interview_scheduled': { 
        color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800', 
        icon: Calendar, 
        label: 'Interview Scheduled' 
      },
      'accepted': { 
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800', 
        icon: CheckCircle, 
        label: 'Accepted' 
      },
      'rejected': { 
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800', 
        icon: XCircle, 
        label: 'Rejected' 
      }
    };
    return statusMap[status] || { 
      color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700', 
      icon: AlertCircle, 
      label: status 
    };
  };

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        
        // Get token from localStorage (adjust based on your auth implementation)
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found. Please login.');
        }

        const response = await fetch('http://localhost:3000/api/v1/job-applications/my-applications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication failed. Please login again.');
          }
          throw new Error(`Failed to fetch applications: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setApplications(data.data.applications || []);
          setStatusSummary(data.data.statusSummary || {});
        } else {
          throw new Error(data.message || 'Failed to fetch applications');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching applications:', err);
        // Set default values on error
        setApplications([]);
        setStatusSummary({});
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filter applications based on status
  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.applicationStatus === filterStatus);

  // Ensure statusSummary is always an object
  const safeStatusSummary = statusSummary || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <XCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Applications</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Job Applications</h1>
          <p className="mt-1 sm:mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Track the status of your job applications</p>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Applications</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{applications.length}</p>
              </div>
            </div>
          </div>
          {Object.entries(safeStatusSummary).map(([status, count]) => {
            const statusInfo = getStatusInfo(status);
            const StatusIcon = statusInfo.icon;
            return (
              <div key={status} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center">
                  <StatusIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{statusInfo.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter */}
        <div className="mb-4 sm:mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full sm:w-48 px-3 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
          >
            <option value="all">All Applications</option>
            {Object.keys(safeStatusSummary).map(status => (
              <option key={status} value={status}>
                {getStatusInfo(status).label}
              </option>
            ))}
          </select>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Applications Found</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base px-4">
              {filterStatus === 'all' 
                ? "You haven't submitted any job applications yet." 
                : `No applications with status: ${getStatusInfo(filterStatus).label}`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredApplications.map((application) => {
              const statusInfo = getStatusInfo(application.applicationStatus);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={application.applicationId} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-all">
                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 break-words">
                          {application.jobTitle}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                          <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate text-sm sm:text-base">{application.company}</span>
                        </div>
                        {application.jobLocation && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate text-sm sm:text-base">{application.jobLocation}</span>
                          </div>
                        )}
                      </div>
                      <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${statusInfo.color} self-start`}>
                        <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">{statusInfo.label}</span>
                      </div>
                    </div>

                    {/* Application Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Applied Date</p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{formatFirestoreDate(application.appliedDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents Status</p>
                        <div className="flex items-center">
                          {application.documentsVerified ? (
                            <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-1 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 dark:text-red-400 mr-1 flex-shrink-0" />
                          )}
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {application.documentsVerified ? 'Verified' : 'Not Verified'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Verification Message */}
                    {application.verificationMessage && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">{application.verificationMessage}</p>
                      </div>
                    )}

                    {/* Interview Details */}
                    {application.interviewDetails && (
                      <div className="mb-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                        <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Interview Scheduled</h4>
                        <div className="flex items-center text-green-700 dark:text-green-400">
                          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm break-words">
                            {formatFirestoreDate(application.interviewDetails.date)} at {application.interviewDetails.time}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Submitted Documents */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Submitted Documents</h4>
                      <div className="flex flex-wrap gap-2">
                        {application.cvFileName && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 max-w-full">
                            <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">CV: {application.cvFileName}</span>
                          </span>
                        )}
                        {application.certificateFileName && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 max-w-full">
                            <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">Certificate: {application.certificateFileName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsPage;