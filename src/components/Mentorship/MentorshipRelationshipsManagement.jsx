
import React, { useState, useEffect } from 'react';
import { Edit, List, Trash2, User, Clock, Target, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, TrendingUp, CheckCircle, Activity, BarChart, Users, Heart } from 'lucide-react';

// Column definitions
const columns = [
  { key: 'id', label: '# ID' },
  { key: 'mentor_info', label: 'Mentor' },
  { key: 'mentee_info', label: 'Mentee' },
  { key: 'status', label: 'Status' },
  { key: 'program_status', label: 'Program Status' },
  { key: 'matching_criteria', label: 'Matching Criteria' },
  { key: 'actions', label: 'Actions' }
];

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';
const API_ENDPOINTS = {
  mentorship: `${API_BASE_URL}/mentorship`,
  mentorshipById: (id) => `${API_BASE_URL}/mentorship/${id}`,
  users: `${API_BASE_URL}/users`,
  auth: `${API_BASE_URL}/auth/login`,
  refresh: `${API_BASE_URL}/auth/refresh`
};

// Enhanced API Service functions
const apiService = {
  // Enhanced token retrieval with debugging
  getAuthToken: () => {
    console.log('🔍 Searching for authentication token...');
    
    if (typeof window !== 'undefined') {
      const tokenKeys = ['authToken', 'token', 'accessToken', 'jwt', 'bearerToken', 'access_token'];
      
      for (const key of tokenKeys) {
        const storedToken = localStorage.getItem(key);
        if (storedToken) {
          console.log(`✅ Found token in localStorage with key: ${key}`);
          console.log(`📄 Token preview: ${storedToken.substring(0, 20)}...`);
          
          // Check if token looks valid (basic validation)
          try {
            const tokenParts = storedToken.split('.');
            if (tokenParts.length === 3) {
              // JWT token structure
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('🔍 Token payload:', payload);
              
              // Check expiration
              if (payload.exp) {
                const currentTime = Math.floor(Date.now() / 1000);
                const isExpired = payload.exp < currentTime;
                console.log(`⏰ Token expires at: ${new Date(payload.exp * 1000)}`);
                console.log(`⏰ Current time: ${new Date()}`);
                console.log(`${isExpired ? '❌' : '✅'} Token expired: ${isExpired}`);
                
                if (isExpired) {
                  console.log('🗑️ Removing expired token from localStorage');
                  localStorage.removeItem(key);
                  continue;
                }
              }
            }
          } catch (e) {
            console.log('⚠️ Token is not a valid JWT, but will try to use it anyway');
          }
          
          return storedToken;
        }
      }
      
      console.log('❌ No authentication token found in localStorage');
      console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
    }
    
    return null;
  },

  // Enhanced headers with debugging
  getHeaders: () => {
    const token = apiService.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Added Authorization header to request');
    } else {
      console.log('⚠️ No token available - making request without Authorization header');
    }
    
    console.log('📋 Request headers:', headers);
    return headers;
  },

  // Enhanced error handling
  handleApiError: async (response, operation = 'API call') => {
    console.log(`❌ ${operation} failed with status: ${response.status}`);
    
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.log('📄 Error response data:', errorData);
        errorMessage += ` - ${JSON.stringify(errorData)}`;
        
        // Handle specific auth errors
        if (response.status === 401) {
          console.log('🔐 Authentication error detected');
          if (errorData.error && errorData.error.includes('expired')) {
            console.log('⏰ Token expired - clearing localStorage');
            apiService.clearAuthTokens();
          }
        }
      } else {
        const errorText = await response.text();
        console.log('📄 Error response text:', errorText);
        errorMessage += ` - ${errorText}`;
      }
    } catch (e) {
      console.log('⚠️ Could not parse error response:', e);
    }
    
    throw new Error(errorMessage);
  },

  // Clear all possible auth tokens
  clearAuthTokens: () => {
    console.log('🗑️ Clearing all authentication tokens...');
    const tokenKeys = ['authToken', 'token', 'accessToken', 'jwt', 'bearerToken', 'access_token'];
    
    tokenKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ Removing token: ${key}`);
        localStorage.removeItem(key);
      }
    });
  },

  // Test API connection
  testConnection: async () => {
    console.log('🔍 Testing API connection...');
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(`📡 API connection test: ${response.status}`);
      return response.ok;
    } catch (error) {
      console.log('❌ API connection failed:', error);
      return false;
    }
  },

  // Enhanced fetch with retry logic
  fetchWithRetry: async (url, options, retries = 1) => {
    console.log(`📡 Making request to: ${url}`);
    console.log(`⚙️ Request options:`, options);
    
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, options);
        console.log(`📡 Response status: ${response.status}`);
        
        if (!response.ok) {
          await apiService.handleApiError(response, `Request to ${url}`);
        }
        
        return response;
      } catch (error) {
        console.log(`❌ Request attempt ${i + 1} failed:`, error);
        
        if (i === retries) {
          throw error;
        }
        
        console.log(`🔄 Retrying in 1 second... (${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  },

  fetchMentorshipRelationships: async () => {
    console.log('🤝 Fetching mentorship relationships...');
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.mentorship, 
        {
          method: 'GET',
          headers: apiService.getHeaders()
        }
      );
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('⚠️ Server returned non-JSON response:', responseText);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('✅ Mentorship relationships fetched successfully:', data);
      
      // Transform the data to match your component's expected format
      const transformedData = await Promise.all(data.map(async (relationship) => {
        console.log(`🔄 Processing relationship ${relationship.id}...`);
        
        // Fetch mentor information
        let mentorInfo = { name: 'Unknown Mentor', email: 'N/A', expertise: 'N/A' };
        if (relationship.mentor_id) {
          try {
            const mentorResponse = await apiService.fetchWithRetry(
              `${API_ENDPOINTS.users}/${relationship.mentor_id}`, 
              {
                headers: apiService.getHeaders()
              }
            );
            
            if (mentorResponse.ok) {
              const mentorData = await mentorResponse.json();
              mentorInfo = {
                name: `${mentorData.firstName || ''} ${mentorData.lastName || ''}`.trim() || 'Unknown Mentor',
                email: mentorData.email || 'N/A',
                expertise: mentorData.expertise || mentorData.skills || 'N/A'
              };
              console.log(`✅ Mentor info fetched for mentor ${relationship.mentor_id}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to fetch mentor info for mentor_id: ${relationship.mentor_id}`, error);
          }
        }

        // Fetch mentee information
        let menteeInfo = { name: 'Unknown Mentee', email: 'N/A', level: 'N/A' };
        if (relationship.mentee_id) {
          try {
            const menteeResponse = await apiService.fetchWithRetry(
              `${API_ENDPOINTS.users}/${relationship.mentee_id}`, 
              {
                headers: apiService.getHeaders()
              }
            );
            
            if (menteeResponse.ok) {
              const menteeData = await menteeResponse.json();
              menteeInfo = {
                name: `${menteeData.firstName || ''} ${menteeData.lastName || ''}`.trim() || 'Unknown Mentee',
                email: menteeData.email || 'N/A',
                level: menteeData.level || menteeData.experience_level || 'N/A'
              };
              console.log(`✅ Mentee info fetched for mentee ${relationship.mentee_id}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to fetch mentee info for mentee_id: ${relationship.mentee_id}`, error);
          }
        }

        return {
          ...relationship,
          mentor_info: mentorInfo,
          mentee_info: menteeInfo
        };
      }));
      
      console.log('✅ Data transformation completed');
      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching mentorship relationships:', error);
      throw error;
    }
  },

  deleteMentorshipRelationship: async (id) => {
    console.log(`🗑️ Deleting mentorship relationship: ${id}`);
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.mentorshipById(id), 
        {
          method: 'DELETE',
          headers: apiService.getHeaders()
        }
      );
      
      console.log('✅ Mentorship relationship deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting mentorship relationship:', error);
      throw error;
    }
  },

  createMentorshipRelationship: async (relationshipData) => {
    console.log('➕ Creating mentorship relationship:', relationshipData);
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.mentorship, 
        {
          method: 'POST',
          headers: apiService.getHeaders(),
          body: JSON.stringify(relationshipData)
        }
      );
      
      const result = await response.json();
      console.log('✅ Mentorship relationship created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating mentorship relationship:', error);
      throw error;
    }
  },

  updateMentorshipRelationship: async (id, relationshipData) => {
    console.log(`📝 Updating mentorship relationship ${id}:`, relationshipData);
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.mentorshipById(id), 
        {
          method: 'PUT',
          headers: apiService.getHeaders(),
          body: JSON.stringify(relationshipData)
        }
      );
      
      const result = await response.json();
      console.log('✅ Mentorship relationship updated successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error updating mentorship relationship:', error);
      throw error;
    }
  }
};

// Delete Confirmation Modal Component
const DeleteConfirmation = ({ isOpen, relationshipToDelete, onConfirm, onCancel }) => {
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
            <h3 className="text-xl font-semibold text-gray-900">Delete Mentorship Relationship</h3>
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
            Are you sure you want to delete the mentorship relationship between{' '}
            <span className="font-semibold text-gray-900">
              {relationshipToDelete?.mentor_info?.name || 'this mentor'}
            </span>
            {' and '}
            <span className="font-semibold text-gray-900">
              {relationshipToDelete?.mentee_info?.name || 'this mentee'}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
          <button
            onClick={() => onConfirm(relationshipToDelete?.id)}
            className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors font-medium text-base sm:text-sm"
          >
            Delete Relationship
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium text-base sm:text-sm"
          >
            Cancel
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

// Success Message Component
const SuccessMessage = ({ message, onClose }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 m-4">
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

// Status badge helper
const getStatusBadge = (status) => {
  const baseClasses = "inline-flex px-3 py-1.5 text-xs font-semibold rounded-full";
  switch (status) {
    case 'active':
      return `${baseClasses} bg-green-100 text-green-700`;
    case 'completed':
      return `${baseClasses} bg-blue-100 text-blue-700`;
    case 'paused':
      return `${baseClasses} bg-yellow-100 text-yellow-700`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-700`;
  }
};

// Status icon helper
const getStatusIcon = (status) => {
  switch (status) {
    case 'active':
      return <Activity className="w-4 h-4 text-green-600" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-blue-600" />;
    case 'paused':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    default:
      return <Activity className="w-4 h-4 text-gray-600" />;
  }
};

// Mobile Card Component
const MobileCard = ({ relationship, index, onEdit, onDelete, onExpand, isExpanded, startIndex }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {relationship?.mentor_info?.name || 'N/A'} → {relationship?.mentee_info?.name || 'N/A'}
            </h3>
            <p className="text-xs text-gray-500">ID: {startIndex + index + 1}</p>
          </div>
        </div>
        <button 
          onClick={() => onExpand?.(isExpanded ? null : relationship.id)}
          className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm text-gray-600 truncate">
            {relationship?.matching_criteria || 'N/A'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusIcon(relationship?.status)}
          <span className={getStatusBadge(relationship?.status)}>
            {relationship?.status?.toUpperCase() || 'N/A'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {getStatusIcon(relationship?.program_status)}
          <span className={getStatusBadge(relationship?.program_status)}>
            {relationship?.program_status?.toUpperCase() || 'N/A'}
          </span>
        </div>

        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">Mentor Details:</span>
              </div>
              <div className="ml-6 space-y-1">
                <div className="text-xs text-gray-500">
                  {relationship?.mentor_info?.email || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {relationship?.mentor_info?.expertise || 'N/A'}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">Mentee Details:</span>
              </div>
              <div className="ml-6 space-y-1">
                <div className="text-xs text-gray-500">
                  {relationship?.mentee_info?.email || 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  {relationship?.mentee_info?.level || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit?.(relationship)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete?.(relationship)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

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

  // Fetch relationships on component mount
  useEffect(() => {
    fetchRelationships();
  }, []);

  // Filter relationships based on search term
  useEffect(() => {
    if (!relationships.length) {
      setFilteredRelationships([]);
      return;
    }

    const filtered = relationships.filter(relationship =>
      relationship.mentor_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.mentor_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.mentee_info?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.mentee_info?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.program_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.matching_criteria?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRelationships(filtered);
    setCurrentPage(1);
  }, [searchTerm, relationships]);

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

  const fetchRelationships = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.fetchMentorshipRelationships();
      setRelationships(data);
    } catch (error) {
      setError(`Failed to fetch mentorship relationships: ${error.message}`);
      setRelationships([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedRelationships = [...filteredRelationships].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Handle nested objects
      if (key === 'mentor_info') {
        aValue = a.mentor_info?.name || '';
        bValue = b.mentor_info?.name || '';
      } else if (key === 'mentee_info') {
        aValue = a.mentee_info?.name || '';
        bValue = b.mentee_info?.name || '';
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredRelationships(sortedRelationships);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredRelationships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRelationships = filteredRelationships.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (relationshipId) => {
    try {
      setDeleting(true);
      await apiService.deleteMentorshipRelationship(relationshipId);
      setRelationships(prev => prev.filter(relationship => relationship.id !== relationshipId));
      setSuccessMessage('Mentorship relationship deleted successfully');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError(`Failed to delete mentorship relationship: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteClick = (relationship) => {
    setDeleteModal({
      isOpen: true,
      relationshipToDelete: relationship
    });
  };

  const handleDeleteConfirm = (relationshipId) => {
    handleDelete(relationshipId);
    setDeleteModal({
      isOpen: false,
      relationshipToDelete: null
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      relationshipToDelete: null
    });
  };

  const handleEdit = (relationship) => {
    console.log('Edit relationship:', relationship);
    // Implement edit functionality
  };

  const handleCreateRelationship = () => {
    console.log('Create new relationship');
    // Implement create functionality
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Pagination component
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
      <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
        {filteredRelationships.length > 0 ? `${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredRelationships.length)} of ${filteredRelationships.length} rows visible` : 'No data available'}
      </div>
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ‹
        </button>
        {[...Array(Math.min(3, totalPages))].map((_, i) => {
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
        {totalPages > 3 && (
          <>
            <span className="text-gray-600 px-1">...</span>
            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
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
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
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
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <ErrorMessage message={error} onRetry={fetchRelationships} />
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!paginatedRelationships || paginatedRelationships.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {successMessage && (
            <SuccessMessage 
              message={successMessage} 
              onClose={() => setSuccessMessage(null)} 
            />
          )}
          <div className="flex flex-col space-y-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button 
                  onClick={handleCreateRelationship}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Relationship</span>
                  <span className="sm:hidden">Create</span>
                </button>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search relationships..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 bg-white shadow-sm"
                    />
                  </div>
                  <button 
                    onClick={fetchRelationships}
                    disabled={loading}
                    className="p-2.5 text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 sm:p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No mentorship relationships found</p>
              <p className="text-gray-500">Try adjusting your search criteria or add some relationships.</p>
            </div>
            <PaginationControls />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {successMessage && (
          <SuccessMessage 
            message={successMessage} 
            onClose={() => setSuccessMessage(null)} 
          />
        )}
        
     <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <button 
                // onClick={handleCreateCourse} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
              >
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
                //   onClick={fetchCourses}
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
                //   onClick={handleCreateCourse} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
                >
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
                <div className="mt-3 bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <button
                    //   onClick={fetchCourses}
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

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {viewMode === 'table' ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {columns.map((column) => (
                      visibleColumns[column.key] && (
                        <th
                          key={column.key}
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => column.key !== 'actions' && handleSort(column.key)}
                        >
                          <div className="flex items-center space-x-1">
                            <span>{column.label}</span>
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
                  {paginatedRelationships.map((relationship, index) => (
                    <tr key={relationship.id} className="hover:bg-gray-50 transition-colors">
                      {visibleColumns.id && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {startIndex + index + 1}
                        </td>
                      )}
                      {visibleColumns.mentor_info && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {relationship.mentor_info?.name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {relationship.mentor_info?.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.mentee_info && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-green-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {relationship.mentee_info?.name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {relationship.mentee_info?.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(relationship.status)}>
                            {relationship.status?.toUpperCase() || 'N/A'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.program_status && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(relationship.program_status)}>
                            {relationship.program_status?.toUpperCase() || 'N/A'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.matching_criteria && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {relationship.matching_criteria || 'N/A'}
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
            /* Cards View */
            <div className="p-4 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedRelationships.map((relationship, index) => (
                  <MobileCard
                    key={relationship.id}
                    relationship={relationship}
                    index={index}
                    startIndex={startIndex}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onExpand={setExpandedCard}
                    isExpanded={expandedCard === relationship.id}
                  />
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
        relationshipToDelete={deleteModal.relationshipToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default MentorshipRelationshipsManagement;