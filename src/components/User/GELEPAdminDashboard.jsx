import React, { useState, useEffect } from 'react';
import {
  Edit, List, Trash2, User, Users, Mail, Phone, Shield, Hash, MoreVertical, AlertCircle, X, UserPlus, Search, RefreshCw, Grid3X3, Menu, Smile, HelpCircle } from 'lucide-react';
import UserForm from './UserForm'; 

// Column definitions
const columnsList = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'gender', label: 'Gender' },
  { key: 'role', label: 'Role' },
  { key: 'telephone', label: 'Telephone' },
  { key: 'actions', label: 'Actions' },
];

const getGenderIcon = (gender) => {
  switch ((gender || '').toLowerCase()) {
    case 'male':
      return <User className="text-blue-500 w-5 h-5" />;
    case 'female':
      return <User className="text-pink-500 w-5 h-5" />;
    case 'other':
      return <Users className="text-purple-500 w-5 h-5" />;
    case 'prefer_not_to_say':
      return <HelpCircle className="text-gray-500 w-5 h-5" />;
    default:
      return <User className="text-gray-400 w-5 h-5" />;
  }
};

// Delete Confirmation Modal Component
const DeleteConfirmation = ({
  isOpen,
  userToDelete,
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
            <h3 className="text-xl font-semibold text-gray-900">Delete User</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              "{userToDelete?.firstName || ''} {userToDelete?.lastName || ''}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">Cancel</button>
          <button onClick={() => onConfirm(userToDelete?.id, userToDelete?.email)} className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium">Delete User</button>
        </div>
      </div>
    </div>
  );
};

const ModernUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true, name: true, email: true, gender: true, role: true, telephone: true, actions: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userToDelete: null });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Show create modal - FIXED: Clear all edit states
  const handleShowCreate = () => {
    console.log('Creating new user - clearing edit states');
    setUserToEdit(null);
    setIsEditMode(false);
    setShowCreateModal(true);
  };

  // Show edit modal - FIXED: Set proper edit states
  const handleShowEdit = (user) => {
    console.log('Editing user:', user);
    setUserToEdit(user);
    setIsEditMode(true);
    setShowCreateModal(true);
  };

  // Close user form - FIXED: Clear all states properly
  const handleCloseUserForm = () => {
    console.log('Closing user form - clearing all states');
    setShowCreateModal(false);
    setUserToEdit(null);
    setIsEditMode(false);
  };

  // After create/update, refresh users - FIXED: Clear all states
  const handleUserSaved = () => {
    console.log('User saved - refreshing and clearing states');
    fetchUsers();
    setShowCreateModal(false);
    setUserToEdit(null);
    setIsEditMode(false);
  };

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/api/v1/users', {
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Delete user
  const handleDelete = async (userId, userEmail) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // Column toggle
  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Delete modal handlers
  const handleDeleteClick = (user) => setDeleteModal({ isOpen: true, userToDelete: user });
  const handleDeleteConfirm = (userId, userEmail) => {
    handleDelete(userId, userEmail);
    setDeleteModal({ isOpen: false, userToDelete: null });
  };
  const handleDeleteCancel = () => setDeleteModal({ isOpen: false, userToDelete: null });

  // Filtered and paginated users
  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      (user.firstName && user.firstName.toLowerCase().includes(search)) ||
      (user.lastName && user.lastName.toLowerCase().includes(search)) ||
      (user.email && user.email.toLowerCase().includes(search)) ||
      (user.userRole && user.userRole.toLowerCase().includes(search)) ||
      (user.telephone && user.telephone.includes(searchTerm))
    );
  });
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const actualStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(actualStartIndex, actualStartIndex + itemsPerPage);

  // Mobile card view for small screens
  const MobileCard = ({ user, index }) => {
    const isExpanded = expandedCard === user?.id;
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-base">
                {(user?.firstName || '') + ' ' + (user?.lastName || '') || 'N/A'}
              </h3>
              <p className="text-gray-500 text-sm">
                ID: {actualStartIndex + index + 1}
              </p>
            </div>
          </div>
          <button onClick={() => setExpandedCard(isExpanded ? null : user?.id)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {visibleColumns.email && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-gray-700 text-sm truncate">{user?.email || 'N/A'}</span>
            </div>
          )}
          {visibleColumns.role && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                user?.userRole === 'Admin' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {user?.userRole || 'N/A'}
              </span>
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {visibleColumns.telephone && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700 text-sm">{user?.telephone || 'N/A'}</span>
              </div>
            )}
            {visibleColumns.gender && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                {getGenderIcon(user?.gender)}
              </div>
              <span className="text-gray-700 text-sm capitalize">{user?.gender?.replace(/_/g, ' ') || 'N/A'}</span>
            </div>
          )}
            {visibleColumns.actions && (
              <div className="flex items-center space-x-3 pt-3">
                <button
                onClick={() => handleShowEdit(user)}
                className="flex-1 bg-green-600 bg-opacity-1 hover:bg-opacity-30 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
                <button
                  onClick={() => handleDeleteClick(user)}
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
        {actualStartIndex + 1} - {Math.min(actualStartIndex + itemsPerPage, filteredUsers?.length || 0)} of {filteredUsers?.length || 0} rows visible
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
                  ? 'bg-green-500 text-white border-green-500 shadow-lg'
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
                  ? 'bg-green-500 text-white border-green-500 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
        <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">›</button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading users...</span>
      </div>
    );
  }

  // FIXED: Only show "No users found" when there are actually no users after filtering
  if (!users || users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleShowCreate}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                <UserPlus className="w-4 h-4" />
                Create User
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 bg-white shadow-sm"
                />
              </div>
              <button onClick={fetchUsers} className="p-2.5 text-gray-600 hover:text-gray-800 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 shadow-sm">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2.5 text-gray-600 hover:text-gray-800 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 shadow-sm">
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-12 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No users found</p>
              <p className="text-gray-500">Try adjusting your search criteria or add some users.</p>
            </div>
            <PaginationControls />
          </div>
          
          {/* FIXED: Add UserForm here too */}
          <UserForm
            showModal={showCreateModal}
            setShowModal={handleCloseUserForm}
            onUserSaved={handleUserSaved}
            userToEdit={userToEdit}
            isEditMode={isEditMode}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
          <div className="hidden lg:flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <button 
              onClick={handleShowCreate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create User</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 w-64"
                />
              </div>
              <button onClick={fetchUsers} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-sm transition-colors" title="Refresh">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-sm transition-colors" title={viewMode === 'table' ? 'Card View' : 'Table View'}>
                <List className="w-4 h-4" />
              </button>
              <div className="relative column-toggle-container">
                <button onClick={() => setShowColumnToggle(!showColumnToggle)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-sm transition-colors" title="Column Visibility">
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
                          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm">{column.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Mobile Header - FIXED: Use handleShowCreate instead of setShowCreateModal */}
          <div className="lg:hidden bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <button 
                onClick={handleShowCreate}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Create User</span>
                <span className="sm:hidden">Create</span>
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg">
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            {isMobileMenuOpen && (
              <div className="mt-3 mobile-menu-container bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button onClick={fetchUsers} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                  <button onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    <List className="w-4 h-4" />
                    <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
                  </button>
                  <button onClick={() => setShowColumnToggle(!showColumnToggle)} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors">
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
                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
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
        
        {/* FIXED: Show results info only when there are filtered results */}
        {filteredUsers.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600 text-sm font-medium">
              Showing {actualStartIndex + 1}-{Math.min(actualStartIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>
          </div>
        )}

        {/* FIXED: Show "no results" message when search returns no results */}
        {filteredUsers.length === 0 && searchTerm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No users match your search</p>
              <p className="text-gray-500">Try searching with different keywords or clear the search to see all users.</p>
<button 
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
            <PaginationControls />
          </div>
        )}

        {/* Main Content - Table or Cards */}
        {filteredUsers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {visibleColumns.id && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4" />
                            <span>ID</span>
                          </div>
                        </th>
                      )}
                      {visibleColumns.name && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Name</span>
                          </div>
                        </th>
                      )}
                      {visibleColumns.email && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Email</span>
                          </div>
                        </th>
                      )}
                      {visibleColumns.gender && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Gender</span>
                          </div>
                        </th>
                      )}
                      {visibleColumns.role && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Role</span>
                          </div>
                        </th>
                      )}
                      {visibleColumns.telephone && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>Telephone</span>
                          </div>
                        </th>
                      )}
                      {visibleColumns.actions && (
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.map((user, index) => (
                      <tr key={user?.id} className="hover:bg-gray-50 transition-colors">
                        {visibleColumns.id && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {actualStartIndex + index + 1}
                          </td>
                        )}
                        {visibleColumns.name && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {(user?.firstName || '') + ' ' + (user?.lastName || '') || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        {visibleColumns.email && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{user?.email || 'N/A'}</div>
                          </td>
                        )}
                        {visibleColumns.gender && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {getGenderIcon(user?.gender)}
                              <span className="text-sm text-gray-700 capitalize">
                                {user?.gender?.replace(/_/g, ' ') || 'N/A'}
                              </span>
                            </div>
                          </td>
                        )}
                        {visibleColumns.role && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              user?.userRole === 'Admin' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {user?.userRole || 'N/A'}
                            </span>
                          </td>
                        )}
                        {visibleColumns.telephone && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{user?.telephone || 'N/A'}</div>
                          </td>
                        )}
                        {visibleColumns.actions && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleShowEdit(user)}
                                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors shadow-sm"
                                title="Edit User"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors shadow-sm"
                                title="Delete User"
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
                <div className="grid gap-4">
                  {paginatedUsers.map((user, index) => (
                    <MobileCard key={user?.id} user={user} index={index} />
                  ))}
                </div>
              </div>
            )}
            <PaginationControls />
          </div>
        )}

        {/* User Form Modal */}
        <UserForm
          showModal={showCreateModal}
          setShowModal={handleCloseUserForm}
          onUserSaved={handleUserSaved}
          userToEdit={userToEdit}
          isEditMode={isEditMode}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={deleteModal.isOpen}
          userToDelete={deleteModal.userToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </div>
  );
};

export default ModernUserManagement;