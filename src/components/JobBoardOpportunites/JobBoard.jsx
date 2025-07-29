import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Calendar, Users, BookOpen, Award, Filter, ChevronLeft, ChevronRight, Eye, ExternalLink } from 'lucide-react';

const JobBoard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    company: '',
    job_type: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    hasNext: false,
    hasPrev: false
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [stats, setStats] = useState(null);

  // Career resources data (since this might not be in your API yet)
  const careerResources = [
    {
      id: 1,
      title: "Resume Building Workshop",
      description: "Learn to create compelling resumes that highlight your leadership potential",
      type: "workshop",
      duration: "2 hours",
      level: "Beginner to Advanced"
    },
    {
      id: 2,
      title: "Interview Preparation Bootcamp",
      description: "Master the art of executive-level interviews with practical tips and mock sessions",
      type: "bootcamp",
      duration: "1 day",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Leadership Communication Skills",
      description: "Develop powerful communication strategies for executive roles",
      type: "course",
      duration: "4 weeks",
      level: "Advanced"
    },
    {
      id: 4,
      title: "Networking for Women Leaders",
      description: "Build meaningful professional networks and strategic partnerships",
      type: "workshop",
      duration: "3 hours",
      level: "All Levels"
    }
  ];

  // API base URL - adjust according to your setup
  const API_BASE = 'http://localhost:3000/api/v1/job-opportunities';

  // Get authentication token from localStorage or sessionStorage
  const getAuthToken = () => {
    // Try different possible token storage keys
    const possibleKeys = ['token', 'authToken', 'accessToken', 'jwt', 'auth_token', 'access_token'];
    
    for (const key of possibleKeys) {
      const token = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (token) {
        return token;
      }
    }
    
    // If no token found, try to get from cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (possibleKeys.includes(name)) {
        return value;
      }
    }
    
    return null;
  };

  // Create headers with authentication
  const getAuthHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      // Try different authorization header formats
      headers['Authorization'] = `Bearer ${token}`;
      // Some APIs might use different formats
      headers['X-Auth-Token'] = token;
      headers['X-Access-Token'] = token;
    }

    return headers;
  };

  // Enhanced fetch function with authentication and error handling
  const authenticatedFetch = async (url, options = {}) => {
    const headers = getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token might be expired or invalid
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      } else {
        throw new Error('Authentication failed. Your session may have expired. Please log in again.');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  };

  // Fetch jobs based on current tab and filters
  const fetchJobs = async (page = 1) => {
    setLoading(true);
    setError('');
    
    try {
      let url = `${API_BASE}`;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9'
      });

      // Route based on active tab
      switch (activeTab) {
        case 'leadership':
          url = `${API_BASE}/leadership`;
          break;
        case 'internships':
          url = `${API_BASE}/internships`;
          break;
        case 'fellowships':
          url = `${API_BASE}/fellowships`;
          break;
        case 'featured':
          url = `${API_BASE}/featured`;
          break;
        default:
          url = `${API_BASE}`;
      }

      // Add search and filter params for advanced search
      if (searchQuery || filters.location || filters.company || filters.job_type) {
        url = `${API_BASE}/search/advanced`;
        if (searchQuery) params.append('q', searchQuery);
        if (filters.location) params.append('location', filters.location);
        if (filters.company) params.append('company', filters.company);
        if (filters.job_type) params.append('job_type', filters.job_type);
      }

      const response = await authenticatedFetch(`${url}?${params}`);
      const data = await response.json();
      
      // Handle different response formats
      if (activeTab === 'featured') {
        setJobs(Array.isArray(data) ? data : []);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalJobs: Array.isArray(data) ? data.length : 0,
          hasNext: false,
          hasPrev: false
        });
      } else {
        setJobs(data.jobs || []);
        setPagination(data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalJobs: 0,
          hasNext: false,
          hasPrev: false
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch job opportunities');
      setJobs([]);
      
      // If authentication error, you might want to redirect to login
      if (err.message.includes('Authentication')) {
        console.error('Authentication error:', err.message);
        // Optionally, you can dispatch an event or call a function to handle re-authentication
        // window.location.href = '/login'; // Uncomment if you want to redirect
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch job statistics
  const fetchStats = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Don't show error for stats as it's not critical
    }
  };

  // Fetch single job details
  const fetchJobDetails = async (jobId) => {
    try {
      const response = await authenticatedFetch(`${API_BASE}/${jobId}`);
      const data = await response.json();
      setSelectedJob(data);
      setShowJobModal(true);
    } catch (err) {
      console.error('Failed to fetch job details:', err);
      setError('Failed to fetch job details. Please try again.');
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [activeTab]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery || Object.values(filters).some(filter => filter)) {
        fetchJobs(1);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      location: '',
      company: '',
      job_type: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'leadership': return 'bg-purple-100 text-purple-800';
      case 'internship': return 'bg-blue-100 text-blue-800';
      case 'fellowship': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building2 className="w-4 h-4 mr-2" />
            <span className="text-sm">{job.company}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{job.location}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.job_type)}`}>
          {job.job_type}
        </span>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-500 text-xs">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Deadline: {formatDate(job.application_deadline)}</span>
        </div>
        <button
          onClick={() => fetchJobDetails(job.id)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  );

  const ResourceCard = ({ resource }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {resource.title}
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            {resource.description}
          </p>
        </div>
        <BookOpen className="w-6 h-6 text-purple-600 flex-shrink-0 ml-4" />
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <span className="bg-gray-100 px-2 py-1 rounded">
          {resource.type}
        </span>
        <span>{resource.duration}</span>
        <span>{resource.level}</span>
      </div>
      
      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center">
        <ExternalLink className="w-4 h-4 mr-2" />
        Access Resource
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Women's Leadership Job Board
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover leadership opportunities, career resources, and professional development programs designed to advance women's careers
            </p>
          </div>
          
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.active}</div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.byType?.leadership || 0}</div>
                <div className="text-sm text-gray-600">Leadership Roles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.byType?.internship || 0}</div>
                <div className="text-sm text-gray-600">Internships</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.byType?.fellowship || 0}</div>
                <div className="text-sm text-gray-600">Fellowships</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'all', label: 'All Opportunities', icon: Users },
              { id: 'featured', label: 'Featured', icon: Award },
              { id: 'leadership', label: 'Leadership', icon: Users },
              { id: 'internships', label: 'Internships', icon: BookOpen },
              { id: 'fellowships', label: 'Fellowships', icon: Award },
              { id: 'resources', label: 'Career Resources', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      {activeTab !== 'resources' && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filters.job_type}
                  onChange={(e) => handleFilterChange('job_type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="leadership">Leadership</option>
                  <option value="internship">Internship</option>
                  <option value="fellowship">Fellowship</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                <input
                  type="text"
                  placeholder="Company"
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                {(searchQuery || Object.values(filters).some(filter => filter)) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            {error.includes('Authentication') && (
              <div className="mt-2">
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-red-800 underline hover:no-underline"
                >
                  Refresh page
                </button>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'resources' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careerResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <>
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                      No opportunities found matching your criteria.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {jobs.map(job => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="flex justify-center items-center space-x-4">
                        <button
                          onClick={() => fetchJobs(pagination.currentPage - 1)}
                          disabled={!pagination.hasPrev}
                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </button>
                        
                        <span className="text-sm text-gray-700">
                          Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        
                        <button
                          onClick={() => fetchJobs(pagination.currentPage + 1)}
                          disabled={!pagination.hasNext}
                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedJob.title}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building2 className="w-5 h-5 mr-2" />
                    <span>{selectedJob.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{selectedJob.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(selectedJob.job_type)}`}>
                  {selectedJob.job_type}
                </span>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Posted:</span>
                  <div>{formatDate(selectedJob.posted_date)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Deadline:</span>
                  <div>{formatDate(selectedJob.application_deadline)}</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors duration-200">
                  Apply Now
                </button>
                <button 
                  onClick={() => setShowJobModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;