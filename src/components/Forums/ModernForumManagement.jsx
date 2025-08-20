import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Trash2, User, Calendar, Tag, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Hash, Filter, Clock, Users, Zap, Code, Calendar as CalendarIcon, HelpCircle, Edit, 
} from 'lucide-react';
import ForumForm from './ForumForm'; 
import { formatDate} from './formatDate';
import ForumHeader from './ForumHeader';


// Column definitions
const columnsList = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'content', label: 'Content' },
  { key: 'category', label: 'Category' },
  { key: 'author', label: 'Author' },
  { key: 'created_at', label: 'Created At' },
  { key: 'actions', label: 'Actions' },
];

// Category icons and colors
const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'general':
      return <MessageSquare className="text-blue-500 w-5 h-5" />;
    case 'mentorship':
      return <Users className="text-green-500 w-5 h-5" />;
    case 'career':
      return <Zap className="text-yellow-500 w-5 h-5" />;
    case 'technical':
      return <Code className="text-purple-500 w-5 h-5" />;
    case 'events':
      return <CalendarIcon className="text-red-500 w-5 h-5" />;
    default:
      return <HelpCircle className="text-gray-400 w-5 h-5" />;
  }
};

const getCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case 'general':
      return 'bg-blue-100 text-blue-700';
    case 'mentorship':
      return 'bg-green-100 text-green-700';
    case 'career':
      return 'bg-yellow-100 text-yellow-700';
    case 'technical':
      return 'bg-purple-100 text-purple-700';
    case 'events':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Delete Confirmation Modal Component
const DeleteConfirmation = ({
  isOpen,
  forumToDelete,
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
            <h3 className="text-xl font-semibold text-gray-900">Delete Forum Post</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete the forum post{' '}
            <span className="font-semibold text-gray-900">
              "{forumToDelete?.title || 'Untitled'}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">Cancel</button>
          <button onClick={() => onConfirm(forumToDelete?.id)} className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium">Delete Post</button>
        </div>
      </div>
    </div>
  );
};

// Edit Modal Component
const EditModal = ({
  isOpen,
  forum,
  onSave,
  onCancel
}) => {
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    category: ''
  });

  useEffect(() => {
    if (isOpen && forum) {
      setEditForm({
        title: forum.title || '',
        content: forum.content || '',
        category: forum.category || ''
      });
    }
  }, [isOpen, forum]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(forum.id, editForm);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Edit className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Edit Forum Post</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="general">General</option>
                <option value="mentorship">Mentorship</option>
                <option value="career">Career</option>
                <option value="technical">Technical</option>
                <option value="events">Events</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-medium">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ModernForumManagement = () => {

  const [showForumModal, setShowForumModal] = useState(false);

  const [forums, setForums] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true, title: true, content: true, category: true, author: true, created_at: true, actions: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, forumToDelete: null });
  const [editModal, setEditModal] = useState({ isOpen: false, forumToEdit: null });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [usersData, setUsersData] = useState([]);

  const handleCreateForum = () => {
    setShowForumModal(true);
  };

  // FIXED: Update the handleForumCreated function
  const handleForumCreated = async (newForum) => {
    console.log('New forum created:', newForum);
    
    // Close the modal first
    setShowForumModal(false);
    
    // Add the new forum to the list immediately for better UX
    if (newForum) {
      setForums(prev => [newForum, ...prev]);
    }
    
    // Then refresh the data to ensure consistency
    try {
      await fetchForums();
    } catch (error) {
      console.error('Error refreshing forums after creation:', error);
      // If refresh fails, at least we have the optimistic update above
    }
  };

  // FIXED: Get auth token function
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      const tokenKeys = ['token', 'authToken', 'accessToken', 'jwt', 'bearerToken'];
      for (const key of tokenKeys) {
        const storedToken = localStorage.getItem(key);
        if (storedToken) {
          console.log(`Found token with key: ${key}`);
          return storedToken;
        }
      }
    }
    console.warn('No auth token found in localStorage');
    return null;
  };

  const fetchUsersByIds = async (userIds) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        console.warn('No auth token available for fetching users');
        return [];
      }
      
      // Method 1: Try bulk fetch if your API supports it
      const bulkResponse = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userIds })
      });

      if (bulkResponse.ok) {
        const userData = await bulkResponse.json();
        return userData;
      }

      // Method 2: If bulk fetch fails, try individual requests
      console.log('Bulk fetch failed, trying individual requests...');
      const userPromises = userIds.map(async (userId) => {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const user = await response.json();
            return user;
          }
          return null;
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
          return null;
        }
      });

      const users = await Promise.all(userPromises);
      return users.filter(user => user !== null);

    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Method 3: Try alternative endpoint structure
      try {
        const token = getAuthToken();
        if (!token) return [];
        
        const response = await fetch('http://localhost:3000/api/v1/users', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const allUsers = await response.json();
          // Filter to only return users with matching IDs
          const usersArray = Array.isArray(allUsers) ? allUsers : (allUsers.users || allUsers.data || []);
          return usersArray.filter(user => userIds.includes(user.id || user.user_id || user.userId));
        }
      } catch (fallbackError) {
        console.error('Fallback user fetch failed:', fallbackError);
      }
      
      return [];
    }
  };

  // FIXED: Improved fetchForums function
  const fetchForums = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch('http://localhost:3000/api/v1/forums', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch forums: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Handle different response formats
      let forumsArray = [];
      if (Array.isArray(data)) {
        forumsArray = data;
      } else if (data && typeof data === 'object') {
        forumsArray = data.forums || data.data || data.results || [];
      }
      
      console.log('Processed forums array:', forumsArray);
      
      // Ensure we have an array
      if (!Array.isArray(forumsArray)) {
        console.warn('Forums data is not an array:', forumsArray);
        forumsArray = [];
      }
      
      setForums(forumsArray);
      
      // Extract unique user IDs from forums
      const userIds = [];
      forumsArray.forEach(forum => {
        const userId = forum.user_id || forum.userId || forum.author_id;
        if (userId && !userIds.includes(userId)) {
          userIds.push(userId);
        }
      });
      
      console.log('Extracted user IDs:', userIds);
      
      // Fetch user data for all unique IDs
      if (userIds.length > 0) {
        try {
          const userData = await fetchUsersByIds(userIds);
          console.log('Raw user data response:', userData);
          
          // Handle different response formats
          let userArray = [];
          if (Array.isArray(userData)) {
            userArray = userData;
          } else if (userData && typeof userData === 'object') {
            userArray = userData.users || userData.data || Object.values(userData);
          }
          
          console.log('Processed user array:', userArray);
          setUsersData(userArray);
          
          if (userArray.length === 0) {
            console.warn('No user data was loaded. Check your API endpoints.');
          }
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
          setUsersData([]);
        }
      } else {
        console.warn('No user IDs found in forums data');
        setUsersData([]);
      }
      
      setError(''); // Clear any previous errors
      
    } catch (err) {
      console.error('Error fetching forums:', err);
      const errorMessage = err.message || 'Failed to load forum posts';
      setError(errorMessage);
      setForums([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchForums(); 
  }, []);

  // Enhanced getUserName function with better debugging
  const getUserName = (userId) => {
    console.log("Looking for user with ID:", userId);
    console.log("Available users data:", usersData);
    console.log("Users data length:", usersData.length);
    
    if (!userId) {
      console.log("No user ID provided");
      return 'Unknown User';
    }
    
    if (!Array.isArray(usersData)) {
      console.error("usersData is not an array:", usersData);
      return 'Unknown User';
    }
    
    if (usersData.length === 0) {
      console.warn("usersData array is empty");
      return 'Loading...';
    }
    
    // Log the structure of the first user for debugging
    if (usersData.length > 0) {
      console.log("First user structure:", usersData[0]);
    }
    
    const user = usersData.find(user => {
      // Try different possible ID formats
      const matches = user.id === userId || 
                     user.user_id === userId || 
                     user.userId === userId ||
                     user._id === userId;
      
      if (matches) {
        console.log("Found matching user:", user);
      }
      return matches;
    });
    
    console.log("Found user:", user);
    
    if (user) {
      // Try different possible name formats
      const firstName = user.firstName || user.first_name || user.fname || '';
      const lastName = user.lastName || user.last_name || user.lname || '';
      const fullName = user.name || user.fullName || user.full_name || '';
      const username = user.username || user.userName || '';
      const email = user.email || '';
      
      console.log("User name fields:", { firstName, lastName, fullName, username, email });
      
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      } else if (firstName) {
        return firstName;
      } else if (fullName) {
        return fullName;
      } else if (username) {
        return username;
      } else if (email) {
        return email.split('@')[0]; // Use email prefix if no name
      }
    }
    
    return 'Unknown User';
  };

  // Delete forum post
  const handleDelete = async (forumId) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch(`http://localhost:3000/api/v1/forums/${forumId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete forum post: ${res.status} ${res.statusText}`);
      }
      
      setForums(forums.filter(f => f.id !== forumId));
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.message || 'Failed to delete forum post');
    }
  };

  // Update forum post
  const handleUpdate = async (forumId, formData) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch(`http://localhost:3000/api/v1/forums/${forumId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update forum post: ${res.status} ${res.statusText}`);
      }
      
      const updatedForum = await res.json();
      setForums(forums.map(f => f.id === forumId ? updatedForum : f));
      setEditModal({ isOpen: false, forumToEdit: null });
    } catch (err) {
      console.error('Update error:', err);
      alert(err.message || 'Failed to update forum post');
    }
  };

  // Column toggle
  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Modal handlers
  const handleDeleteClick = (forum) => setDeleteModal({ isOpen: true, forumToDelete: forum });
  const handleDeleteConfirm = (forumId) => {
    handleDelete(forumId);
    setDeleteModal({ isOpen: false, forumToDelete: null });
  };
  const handleDeleteCancel = () => setDeleteModal({ isOpen: false, forumToDelete: null });

  const handleEditClick = (forum) => setEditModal({ isOpen: true, forumToEdit: forum });
  const handleEditSave = (forumId, formData) => handleUpdate(forumId, formData);
  const handleEditCancel = () => setEditModal({ isOpen: false, forumToEdit: null });

  // Truncate content
  const truncateContent = (content, maxLength = 100) => {
    if (!content) return 'N/A';
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  // Filtered and paginated forums - removed category filter
  const filteredForums = forums.filter(forum => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      (forum.title && forum.title.toLowerCase().includes(search)) ||
      (forum.content && forum.content.toLowerCase().includes(search)) ||
      (forum.category && forum.category.toLowerCase().includes(search))
    );
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredForums.length / itemsPerPage);
  const actualStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedForums = filteredForums.slice(actualStartIndex, actualStartIndex + itemsPerPage);

  // Mobile card view for small screens
  const MobileCard = ({ forum, index }) => {
    const isExpanded = expandedCard === forum?.id;
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-base line-clamp-1">
                {forum?.title || 'Untitled'}
              </h3>
              <p className="text-gray-500 text-sm">
                ID: {actualStartIndex + index + 1}
              </p>
            </div>
          </div>
          <button onClick={() => setExpandedCard(isExpanded ? null : forum?.id)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {visibleColumns.content && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-gray-700 text-sm line-clamp-2">{truncateContent(forum?.content, 80)}</span>
            </div>
          )}
          {visibleColumns.category && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                {getCategoryIcon(forum?.category)}
              </div>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(forum?.category)}`}>
                {forum?.category || 'N/A'}
              </span>
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {visibleColumns.author && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 text-sm">{getUserName(forum?.user_id)}</span>
              </div>
            )}
            {visibleColumns.created_at && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-gray-700 text-sm">{formatDate(forum?.createdAt) || 'N/A'}</span>
              </div>
            )}
            {visibleColumns.actions && (
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => handleEditClick(forum)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(forum)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200"
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
        {actualStartIndex + 1} - {Math.min(actualStartIndex + itemsPerPage, filteredForums?.length || 0)} of {filteredForums?.length || 0} rows visible
      </div>
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">‹</button>
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <ForumHeader
          handleCreateForum={handleCreateForum}
          fetchForums={fetchForums}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          showColumnToggle={showColumnToggle}
          setShowColumnToggle={setShowColumnToggle}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
          viewMode={viewMode}
          setViewMode={setViewMode}
          indexOfFirstItem={actualStartIndex}
          indexOfLastItem={Math.min(actualStartIndex + itemsPerPage, filteredForums.length)}
          totalItems={filteredForums.length}
        />

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-gray-600 font-medium">Loading forum posts...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-red-600 font-medium">Error loading forums</p>
                  <p className="text-gray-600 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={fetchForums}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredForums.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <MessageSquare className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-gray-600 font-medium">No forum posts found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {searchTerm ? 'Try adjusting your search terms' : 'Create your first forum post'}
                  </p>
                </div>
              </div>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedForums.map((forum, index) => (
                  <MobileCard key={forum?.id || index} forum={forum} index={index} />
                ))}
              </div>
              <PaginationControls />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {visibleColumns.id && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>}
                    {visibleColumns.title && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>}
                    {visibleColumns.content && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Content</th>}
                    {visibleColumns.category && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>}
                    {visibleColumns.author && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Author</th>}
                    {visibleColumns.created_at && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created At</th>}
                    {visibleColumns.actions && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedForums.map((forum, index) => (
                    <tr key={forum?.id || index} className="hover:bg-gray-50 transition-colors">
                      {visibleColumns.id && <td className="px-6 py-4 text-sm text-gray-900">{actualStartIndex + index + 1}</td>}
                      {visibleColumns.title && <td className="px-6 py-4 text-sm font-medium text-gray-900">{forum?.title || 'Untitled'}</td>}
                      {visibleColumns.content && <td className="px-6 py-4 text-sm text-gray-700">{truncateContent(forum?.content)}</td>}
                      {visibleColumns.category && (
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(forum?.category)}`}>
                            {getCategoryIcon(forum?.category)}
                            <span className="ml-2">{forum?.category || 'N/A'}</span>
                          </span>
                        </td>
                      )}
                      {visibleColumns.author && <td className="px-6 py-4 text-sm text-gray-700">{getUserName(forum?.user_id)}</td>}
                      {visibleColumns.created_at && <td className="px-6 py-4 text-sm text-gray-500">{formatDate(forum?.createdAt) || 'N/A'}</td>}
                      {visibleColumns.actions && (
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditClick(forum)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(forum)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
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
              <PaginationControls />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        forumToDelete={deleteModal.forumToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <EditModal
        isOpen={editModal.isOpen}
        forum={editModal.forumToEdit}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />
      {showForumModal && (
  <ForumForm
    showModal={showForumModal}                    // ✅ Changed from 'isOpen' to 'showModal'
    setShowModal={setShowForumModal}              // ✅ Changed from 'onClose' to 'setShowModal'
    onForumCreated={handleForumCreated}
  />
)}
    </div>
  );
};

export default ModernForumManagement;