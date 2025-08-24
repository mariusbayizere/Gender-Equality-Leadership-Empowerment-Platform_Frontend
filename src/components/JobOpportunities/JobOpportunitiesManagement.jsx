import React, { useState, useEffect } from 'react';
import {
    Edit, List, Trash2, Briefcase, Building, MapPin, Calendar, 
    Users, Clock, AlertCircle, X, Plus, Search, RefreshCw, 
    Grid3X3, Menu, CheckCircle, XCircle, Hash, MoreVertical
} from 'lucide-react';
import JobOpportunityForm from './JobOpportunityForm';

// Column definitions
const columnsList = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Job Title' },
  { key: 'company', label: 'Company' },
  { key: 'location', label: 'Location' },
  { key: 'job_type', label: 'Job Type' },
  { key: 'posted_date', label: 'Posted Date' },
//   { key: 'application_deadline', label: 'Deadline' },
  { key: 'is_active', label: 'Status' },
  { key: 'actions', label: 'Actions' },
];

const getJobTypeIcon = (jobType) => {
  switch (jobType?.toLowerCase()) {
    case 'leadership':
      return <Users className="text-purple-500 w-5 h-5" />;
    case 'internship':
      return <Clock className="text-blue-500 w-5 h-5" />;
    case 'fellowship':
      return <Briefcase className="text-green-500 w-5 h-5" />;
    default:
      return <Briefcase className="text-gray-400 w-5 h-5" />;
  }
};

const getJobTypeColor = (jobType) => {
  switch (jobType?.toLowerCase()) {
    case 'leadership':
      return 'bg-purple-100 text-purple-700';
    case 'internship':
      return 'bg-blue-100 text-blue-700';
    case 'fellowship':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';

  try {
    // Handle Firestore timestamp objects
    if (typeof dateValue === 'object' && dateValue._seconds !== undefined) {
      const millis = dateValue._seconds * 1000 + Math.floor((dateValue._nanoseconds || 0) / 1e6);
      return new Date(millis).toLocaleDateString();
    }

    // Handle Firestore timestamp objects with toDate method
    if (typeof dateValue === 'object' && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toLocaleDateString();
    }

    // Handle Date objects
    if (dateValue instanceof Date) {
      return dateValue.toLocaleDateString();
    }

    // Handle ISO string dates (your case)
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    }

    // Handle timestamp numbers
    if (typeof dateValue === 'number') {
      return new Date(dateValue).toLocaleDateString();
    }

    return 'N/A';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const isDeadlinePassed = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
};

// Delete Confirmation Modal Component
const DeleteConfirmation = ({
  isOpen,
  jobToDelete,
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onCancel();
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Delete Job Opportunity</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete the job opportunity{' '}
            <span className="font-semibold text-gray-900">
              "{jobToDelete?.title || 'N/A'}"
            </span>
            {' '}at{' '}
            <span className="font-semibold text-gray-900">
              {jobToDelete?.company || 'N/A'}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button 
            onClick={onCancel} 
            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(jobToDelete?.id)} 
            className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Delete Job
          </button>
        </div>
      </div>
    </div>
  );
};

const JobOpportunitiesManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true, title: true, company: true, location: true, job_type: true, 
    posted_date: true, application_deadline: true, is_active: true, actions: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, jobToDelete: null });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const [showJobForm, setShowJobForm] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [jobToEdit, setJobToEdit] = useState(null);
// const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
  setLoading(true);
  setError('');
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    const res = await fetch('http://localhost:3000/api/v1/job-opportunities', {
      headers: { 
        'Content-Type': 'application/json', 
        ...(token && { Authorization: `Bearer ${token}` }) 
      }
    });
    if (!res.ok) throw new Error('Failed to fetch job opportunities');
    const data = await res.json();
    
    // Fix: Access the jobs array from the response object
    if (data.jobs && Array.isArray(data.jobs)) {
      setJobs(data.jobs);
    } else {
      // Fallback: if the response structure is different, try to handle it
      setJobs(Array.isArray(data) ? data : []);
    }
  } catch (err) {
    setError(err.message || 'Failed to load job opportunities');
    setJobs([]); // Set empty array on error
  } finally {
    setLoading(false);
  }
};


  useEffect(() => { fetchJobs(); }, []);

  // Delete job
  const handleDelete = async (jobId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:3000/api/v1/job-opportunities/${jobId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json', 
          ...(token && { Authorization: `Bearer ${token}` }) 
        }
      });
      if (!res.ok) throw new Error('Failed to delete job opportunity');
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (err) {
      alert(err.message || 'Failed to delete job opportunity');
    }
  };

  const handleCreateJob = () => {
        setIsEditMode(false);
        setJobToEdit(null);
        setShowJobForm(true);
        };

  const handleEditJob = (job) => {
    setIsEditMode(true);
    setJobToEdit(job);
    setShowJobForm(true);
    };
  
  const handleJobSaved = (savedJob) => {
        if (isEditMode) {
            // Update existing job in the list
            setJobs(prevJobs => 
            prevJobs.map(job => 
                job.id === savedJob.id ? savedJob : job
            )
            );
        } else {
            // Add new job to the list
            setJobs(prevJobs => [...prevJobs, savedJob]);
        }
        
        // Reset form state
        setShowJobForm(false);
        setIsEditMode(false);
        setJobToEdit(null);
        };
    

  // Column toggle
  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Delete modal handlers
  const handleDeleteClick = (job) => setDeleteModal({ isOpen: true, jobToDelete: job });
  const handleDeleteConfirm = (jobId) => {
    handleDelete(jobId);
    setDeleteModal({ isOpen: false, jobToDelete: null });
  };
  const handleDeleteCancel = () => setDeleteModal({ isOpen: false, jobToDelete: null });

  // Filtered and paginated jobs
  const filteredJobs = jobs.filter(job => {
    const search = searchTerm.toLowerCase();
    return (
      (job.title && job.title.toLowerCase().includes(search)) ||
      (job.company && job.company.toLowerCase().includes(search)) ||
      (job.location && job.location.toLowerCase().includes(search)) ||
      (job.job_type && job.job_type.toLowerCase().includes(search)) ||
      (job.description && job.description.toLowerCase().includes(search))
    );
  });
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const actualStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(actualStartIndex, actualStartIndex + itemsPerPage);

  // Mobile card view for small screens
  const MobileCard = ({ job, index }) => {
    const isExpanded = expandedCard === job?.id;
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-base">
                {job?.title || 'N/A'}
              </h3>
              <p className="text-gray-500 text-sm">
                ID: {actualStartIndex + index + 1}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setExpandedCard(isExpanded ? null : job?.id)} 
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          {visibleColumns.company && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Building className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 text-sm truncate">{job?.company || 'N/A'}</span>
            </div>
          )}
          
          {visibleColumns.location && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-gray-700 text-sm">{job?.location || 'N/A'}</span>
            </div>
          )}
          
          {visibleColumns.job_type && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                {getJobTypeIcon(job?.job_type)}
              </div>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getJobTypeColor(job?.job_type)}`}>
                {job?.job_type?.charAt(0).toUpperCase() + job?.job_type?.slice(1) || 'N/A'}
              </span>
            </div>
          )}
          
          {visibleColumns.is_active && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {job?.is_active ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
              </div>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                job?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {job?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          )}
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {visibleColumns.posted_date && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-gray-700 text-sm">Posted: {formatDate(job?.posted_date)}</span>
              </div>
            )}
            
            {visibleColumns.application_deadline && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <span className={`text-sm ${isDeadlinePassed(job?.application_deadline) ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                  Deadline: {formatDate(job?.application_deadline)}
                </span>
              </div>
            )}
            
            {/* {job?.description && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-700 text-sm">{job.description}</p>
              </div>
            )} */}
            
            {visibleColumns.actions && (
              <div className="flex items-center space-x-3 pt-3">
                <button
                //  onClick={handleCreateJob}
                //   onClick={() => console.log('Edit job:', job.id)}
                  onClick={() => handleEditJob(job)}
                  className="flex-1 bg-blue-600 bg-opacity-1 hover:bg-opacity-30 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(job)}
                  className="flex-1 bg-red-600 bg-opacity-1 hover:bg-opacity-100 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Pagination component
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
      <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
        {actualStartIndex + 1} - {Math.min(actualStartIndex + itemsPerPage, filteredJobs?.length || 0)} of {filteredJobs?.length || 0} jobs visible
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading job opportunities...</span>
      </div>
    );
  }

  if (!paginatedJobs || paginatedJobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
                <Plus className="w-4 h-4" />
                Create Job
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-sm"
                />
              </div>
              <button onClick={fetchJobs} className="p-2.5 text-gray-600 hover:text-gray-800 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No job opportunities found</p>
              <p className="text-gray-500">Try adjusting your search criteria or add some job opportunities.</p>
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
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <button 
            //   onClick={() => console.log('Create job opportunity')}
             onClick={handleCreateJob}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Job</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button onClick={fetchJobs} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors" title={viewMode === 'table' ? 'Card View' : 'Table View'}>
                <List className="w-4 h-4" />
              </button>
              <div className="relative column-toggle-container">
                <button onClick={() => setShowColumnToggle(!showColumnToggle)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors" title="Column Visibility">
                  <Grid3X3 className="w-4 h-4" />
                </button>
                {showColumnToggle && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 z-50 min-w-[150px]">
                    {columnsList.map(column => (
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
                // onClick={() => console.log('Create job opportunity')}
                onClick={handleCreateJob}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Job</span>
                <span className="sm:hidden">Create</span>
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {isMobileMenuOpen && (
              <div className="mt-3 mobile-menu-container bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button onClick={fetchJobs} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                  <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    <List className="w-4 h-4" />
                    <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
                  </button>
                  <button onClick={() => setShowColumnToggle(!showColumnToggle)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    <Grid3X3 className="w-4 h-4" />
                    <span>Columns</span>
                  </button>
                </div>
                {showColumnToggle && (
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <h4 className="text-gray-700 text-sm font-medium mb-2">Show Columns:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {columnsList.map(column => (
                        <label key={column.key} className="flex items-center space-x-2 text-gray-700 text-sm">
                          <input
                            type="checkbox"
                            checked={visibleColumns[column.key]}
                            onChange={() => toggleColumn(column.key)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span>{column.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-sm">
            <strong>Error:</strong> <span>{error}</span>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-gray-600 text-sm font-medium">
            Showing {actualStartIndex + 1}-{Math.min(actualStartIndex + itemsPerPage, filteredJobs.length)} of {filteredJobs.length}
            </p>
        </div>

        {/* Main Content */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columnsList.map(column => (
                      visibleColumns[column.key] && (
                        <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {column.label}
                        </th>
                      )
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedJobs.map((job, index) => (
                    <tr key={job?.id || index} className="hover:bg-gray-50">
                      {visibleColumns.id && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Hash className="w-4 h-4 text-gray-400 mr-2" />
                            {actualStartIndex + index + 1}
                          </div>
                        </td>
                      )}
                      {visibleColumns.title && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {job?.title || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.company && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 text-gray-400 mr-2" />
                            {job?.company || 'N/A'}
                          </div>
                        </td>
                      )}
                      {visibleColumns.location && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            {job?.location || 'N/A'}
                          </div>
                        </td>
                      )}
                      {visibleColumns.job_type && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeColor(job?.job_type)}`}>
                            <span className="mr-1">{getJobTypeIcon(job?.job_type)}</span>
                            {job?.job_type?.charAt(0).toUpperCase() + job?.job_type?.slice(1) || 'N/A'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.posted_date && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            {formatDate(job?.posted_date)}
                          </div>
                        </td>
                      )}
                      {/* {visibleColumns.application_deadline && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-gray-400 mr-2" />
                            <span className={isDeadlinePassed(job?.application_deadline) ? 'text-red-600 font-medium' : 'text-gray-900'}>
                              {formatDate(job?.application_deadline)}
                            </span>
                          </div>
                        </td>
                      )} */}
                      {visibleColumns.is_active && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            job?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {job?.is_active ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
                            {job?.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                            //   onClick={() => console.log('Edit job:', job.id)}
                              onClick={() => handleEditJob(job)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(job)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
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
            <PaginationControls />
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedJobs.map((job, index) => (
              <MobileCard key={job?.id || index} job={job} index={index} />
            ))}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <PaginationControls />
            </div>
          </div>
        )}
      </div>

      <JobOpportunityForm
        showModal={showJobForm}
        setShowModal={setShowJobForm}
        onJobSaved={handleJobSaved}
        jobToEdit={jobToEdit}
        isEditMode={isEditMode}
        />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        jobToDelete={deleteModal.jobToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default JobOpportunitiesManagement;