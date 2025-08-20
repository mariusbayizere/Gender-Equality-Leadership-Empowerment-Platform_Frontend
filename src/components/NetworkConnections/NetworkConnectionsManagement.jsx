import React, { useState, useEffect } from 'react';
import { Edit, List, Trash2, Users, User, Clock, Hash, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Calendar, UserPlus, UserCheck, UserX, MessageSquare, CheckCircle, XCircle, Shield } from 'lucide-react';
import ConnectionsForm from './ConnectionsForm';
import {CONNECTION_STATUS, columns, formatDate, apiService} from './api_route';

// Delete Confirmation Modal Component
const DeleteConfirmation = ({ isOpen, connectionToDelete, onConfirm, onCancel }) => {
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
            <h3 className="text-xl font-semibold text-gray-900">Remove Connection</h3>
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
            Are you sure you want to remove the connection between{' '}
            <span className="font-semibold text-gray-900">
              {connectionToDelete?.requester_id || 'User'}
            </span>
            {' and '}
            <span className="font-semibold text-gray-900">
              {connectionToDelete?.recipient_id || 'User'}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 p-6 pt-0">
          <button
            onClick={() => onConfirm(connectionToDelete?.id)}
            className="w-full sm:flex-1 px-4 py-3 sm:py-2.5 text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors font-medium text-base sm:text-sm"
          >
            Remove Connection
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

// Status icon helper
const getStatusIcon = (status) => {
  switch (status) {
    case CONNECTION_STATUS.PENDING:
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case CONNECTION_STATUS.ACCEPTED:
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case CONNECTION_STATUS.REJECTED:
      return <XCircle className="w-4 h-4 text-red-600" />;
    case CONNECTION_STATUS.BLOCKED:
      return <Shield className="w-4 h-4 text-gray-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

// Status badge helper
const getStatusBadge = (status) => {
  const baseClasses = "inline-flex px-3 py-1.5 text-xs font-semibold rounded-full";
  switch (status) {
    case CONNECTION_STATUS.PENDING:
      return `${baseClasses} bg-yellow-100 text-yellow-700`;
    case CONNECTION_STATUS.ACCEPTED:
      return `${baseClasses} bg-green-100 text-green-700`;
    case CONNECTION_STATUS.REJECTED:
      return `${baseClasses} bg-red-100 text-red-700`;
    case CONNECTION_STATUS.BLOCKED:
      return `${baseClasses} bg-gray-100 text-gray-700`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-700`;
  }
};

// Mobile Card Component - Fixed version
const MobileCard = ({ 
  connection, 
  index, 
  onEdit, 
  onDelete, 
  onExpand, 
  isExpanded, 
  startIndex,
  usersData,
  getUserName
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {getUserName(connection?.requester_id)} → {getUserName(connection?.recipient_id)}
            </h3>
            <p className="text-xs text-gray-500">ID: {startIndex + index + 1}</p>
          </div>
        </div>
        <button 
          onClick={() => onExpand?.(isExpanded ? null : connection.id)}
          className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon(connection?.status)}
          <span className={getStatusBadge(connection?.status)}>
            {connection?.status?.charAt(0).toUpperCase() + connection?.status?.slice(1) || 'N/A'}
          </span>
        </div>

        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                From: {getUserName(connection?.requester_id)}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                To: {getUserName(connection?.recipient_id)}
              </span>
            </div>

            {connection?.message && (
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">
                  {connection.message}
                </span>
              </div>
            )}

            {connection?.created_date && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  {formatDate(connection.createdAt) || formatDate(connection.created_date) || '7/1/2025'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => onEdit?.(connection)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete?.(connection)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove</span>
          </button>
        </div>
      )}
    </div>
  );
};

const NetworkManagement = () => {
  // State management
  const [connections, setConnections] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersData, setUsersData] = useState([]);
  const [itemsPerPage] = useState(8);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states - Fixed naming to match usage
  const [isConnectionFormOpen, setIsConnectionFormOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [isResponseMode, setIsResponseMode] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    connectionToDelete: null
  });

  // View configuration states
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    requester_name: true,
    recipient_name: true,
    status: true,
    message: true,
    created_date: true,
    actions: true
  });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // User management
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user on mount
  useEffect(() => {
    const getCurrentUserId = () => {
      const possibleKeys = [
        'currentUserId',
        'userId', 
        'user_id',
        'loggedInUserId',
        'authUserId'
      ];
      
      for (const key of possibleKeys) {
        const id = localStorage.getItem(key);
        if (id) return id;
      }
      
      const userStr = localStorage.getItem('user') || localStorage.getItem('currentUser');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          return user.id || user.userId || user.user_id;
        } catch (e) {
          console.error('Error parsing user:', e);
        }
      }
      
      return null;
    };
    
    const userId = getCurrentUserId();
    setCurrentUser(userId);
    console.log('Current user ID:', userId);
  }, []);

  // Fetch connections on component mount
  useEffect(() => {
    fetchConnections();
  }, []);

  // Filter connections based on search term
  useEffect(() => {
    if (!connections.length) {
      setFilteredConnections([]);
      return;
    }

    const filtered = connections.filter(connection => {
      const requesterName = getUserName(connection.requester_id);
      const recipientName = getUserName(connection.recipient_id);
      
      return requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connection.status?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    setFilteredConnections(filtered);
    setCurrentPage(1);
  }, [searchTerm, connections, usersData]);

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

  // Fetch connections function
  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.fetchNetworks();
      setConnections(data);
      
      // Extract unique user IDs from connections
      const userIds = [];
      data.forEach(connection => {
        if (connection.requester_id) userIds.push(connection.requester_id);
        if (connection.recipient_id) userIds.push(connection.recipient_id);
      });
      
      // Fetch user data for all unique IDs
      if (userIds.length > 0) {
        const userData = await apiService.fetchUsersByIds(userIds);
        const userArray = Object.values(userData);
        setUsersData(userArray); 
      }
    } catch (error) {
      setError(`Failed to fetch connections: ${error.message}`);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  // Get user name helper function
  const getUserName = (userId) => {
    if (!Array.isArray(usersData)) {
      return 'Unknown User';
    }
    
    const user = usersData.find(user => user.id === userId);
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Unknown User';
  };

  // FIXED: Handle create connection - this was the main issue
  const handleCreateConnection = () => {
    console.log('Opening create connection modal');
    setSelectedConnection(null);
    setIsResponseMode(false);
    setIsConnectionFormOpen(true); // This was missing!
  };

  // Handle connection saved
  const handleConnectionSaved = (newConnection) => {
    console.log('Connection saved:', newConnection);
    setIsConnectionFormOpen(false);
    fetchConnections(); // Refresh the connections list
  };

  // Handle opening response modal
  const handleOpenResponseModal = (connection) => {
    console.log('Opening response modal for connection:', connection);
    console.log('Current user:', currentUser);
    
    if (!currentUser) {
      alert('Unable to identify current user. Please log in again.');
      return;
    }
    
    if (connection.recipient_id !== currentUser) {
      alert(`You can only respond to connection requests sent to you. This request was sent to user ID: ${connection.recipient_id}, but you are logged in as: ${currentUser}`);
      return;
    }
    
    setSelectedConnection(connection);
    setIsResponseMode(true);
    setIsConnectionFormOpen(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setIsConnectionFormOpen(false);
    setSelectedConnection(null);
    setIsResponseMode(false);
  };

  // Column toggle functionality
  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Sorting functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredConnections].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredConnections(sorted);
  };

  // Delete functionality
  const handleDelete = async (connectionId) => {
    try {
      await apiService.deleteConnection(connectionId);
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      console.log('Connection removed successfully');
    } catch (error) {
      setError(`Failed to remove connection: ${error.message}`);
    }
  };

  const handleDeleteClick = (connection) => {
    setDeleteModal({
      isOpen: true,
      connectionToDelete: connection
    });
  };

  const handleDeleteConfirm = (connectionId) => {
    handleDelete(connectionId);
    setDeleteModal({
      isOpen: false,
      connectionToDelete: null
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      connectionToDelete: null
    });
  };

  const handleEdit = (connection) => {
    handleOpenResponseModal(connection);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredConnections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedConnections = filteredConnections.slice(startIndex, startIndex + itemsPerPage);

  // Pagination component
  const PaginationControls = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-t border-gray-100 bg-white space-y-3 sm:space-y-0">
      <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
        {filteredConnections.length > 0 ? `${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredConnections.length)} of ${filteredConnections.length} rows visible` : 'No data available'}
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
            <ErrorMessage message={error} onRetry={fetchConnections} />
          </div>
        </div>
      </div>
    );
  }

  // Empty state - FIXED: Now properly calls handleCreateConnection
  if (!paginatedConnections || paginatedConnections.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button 
                  onClick={handleCreateConnection} // FIXED: This now opens the modal
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Connection</span>
                  <span className="sm:hidden">Create</span>
                </button>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search connections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 bg-white shadow-sm"
                    />
                  </div>
                  <button 
                    onClick={fetchConnections}
                    className="p-2.5 text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 sm:p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No connections found</p>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria or add some connections.</p>
              <button 
                onClick={handleCreateConnection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-200 font-medium"
              >
                <UserPlus className="w-5 h-5" />
                Create Your First Connection
              </button>
            </div>
            <PaginationControls />
          </div>
        </div>

        {/* Connection Form Modal */}
        <ConnectionsForm 
          showModal={isConnectionFormOpen}
          setShowModal={setIsConnectionFormOpen}
          onConnectionSaved={handleConnectionSaved}
          availableUsers={users}
          isResponseMode={isResponseMode}
          connectionToRespond={selectedConnection}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <button 
              onClick={handleCreateConnection}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Connection</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search connections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button
                onClick={fetchConnections}
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
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{column.header}</span>
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
                onClick={handleCreateConnection}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create</span>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {isMobileMenuOpen && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2">
                <button
                  onClick={fetchConnections}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <button 
                  onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                >
                  <List className="w-4 h-4" />
                  <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {viewMode === 'table' ? (
            // Table View
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {columns.map(column => 
                      visibleColumns[column.key] && (
                        <th key={column.key} className="px-6 py-4 text-left">
                          <button
                            onClick={() => handleSort(column.key)}
                            className="flex items-center space-x-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-900 transition-colors"
                          >
                            <span>{column.header}</span>
                            {sortConfig.key === column.key && (
                              <span className="text-blue-500">
                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                              </span>
                            )}
                          </button>
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedConnections.map((connection, index) => (
                    <tr key={connection.id} className="hover:bg-gray-50 transition-colors">
                      {visibleColumns.id && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {startIndex + index + 1}
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.requester_name && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {getUserName(connection.requester_id)}
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.recipient_name && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {getUserName(connection.recipient_id)}
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(connection.status)}
                            <span className={getStatusBadge(connection.status)}>
                              {connection.status?.charAt(0).toUpperCase() + connection.status?.slice(1) || 'N/A'}
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.message && (
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 line-clamp-2">
                            {connection.message || 'No message'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.created_date && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatDate(connection.createdAt) || formatDate(connection.created_date) || '7/1/2025'}
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(connection)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(connection)}
                              className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
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
            // Cards View
            <div className="p-4 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedConnections.map((connection, index) => (
                  <MobileCard
                    key={connection.id}
                    connection={connection}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onExpand={setExpandedCard}
                    isExpanded={expandedCard === connection.id}
                    startIndex={startIndex}
                    usersData={usersData}
                    getUserName={getUserName}
                  />
                ))}
              </div>
            </div>
          )}

          <PaginationControls />
        </div>
      </div>

      {/* Connection Form Modal */}
      <ConnectionsForm 
        showModal={isConnectionFormOpen}
        setShowModal={handleFormClose}
        onConnectionSaved={handleConnectionSaved}
        availableUsers={users}
        isResponseMode={isResponseMode}
        connectionToRespond={selectedConnection}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={deleteModal.isOpen}
        connectionToDelete={deleteModal.connectionToDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default NetworkManagement;