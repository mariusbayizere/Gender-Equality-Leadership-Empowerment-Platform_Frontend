import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Edit, Trash2, User, Mail, Phone, Shield, Hash, MoreVertical, AlertCircle, X, UserPlus, Search, RefreshCw } from 'lucide-react';

// Mock data matching your component structure
const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    userRole: 'User',
    telephone: '+123456789001',
    gender: 'male',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    firstName: 'Ishimwe',
    lastName: 'Louis',
    email: 'ishimwelouis515@gmail.com',
    userRole: 'Admin',
    telephone: '+250785667725',
    gender: 'male',
    createdAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    firstName: 'mario',
    lastName: 'bio',
    email: 'mario@gmail.com',
    userRole: 'User',
    telephone: '+250777777777',
    gender: 'male',
    createdAt: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    firstName: 'root',
    lastName: 'bin',
    email: 'root@gmail.com',
    userRole: 'User',
    telephone: '+250777777770',
    gender: 'male',
    createdAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '5',
    firstName: 'louis',
    lastName: 'Ishimwe',
    email: 'ishimwelouis505@gmail.com',
    userRole: 'Admin',
    telephone: '+250785607725',
    gender: 'male',
    createdAt: '2024-01-19T11:30:00Z'
  },
  {
    id: '6',
    firstName: 'Ineza',
    lastName: 'Roxy',
    email: 'ineza@gmail.com',
    userRole: 'Admin',
    telephone: '+250787667755',
    gender: 'female',
    createdAt: '2024-01-20T11:30:00Z'
  },
  {
    id: '7',
    firstName: 'Marius',
    lastName: 'Bayiere',
    email: 'mariusbayizere119@gmail.com',
    userRole: 'User',
    telephone: '+250787777777',
    gender: 'male',
    createdAt: '2024-01-21T11:30:00Z'
  },
  {
    id: '8',
    firstName: 'flutter',
    lastName: 'Reci',
    email: 'flutter@gmail.com',
    userRole: 'User',
    telephone: '+250784891401',
    gender: 'male',
    createdAt: '2024-01-22T11:30:00Z'
  }
];

// Delete Confirmation Modal Component
const DeleteConfirmation = ({
  isOpen,
  userToDelete,
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
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Delete User
            </h3>
          </div>
          
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">
              "{userToDelete?.firstName || ''} {userToDelete?.lastName || ''}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(userToDelete?.id, userToDelete?.email)}
            className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
};

const ModernUserManagement = ({
  visibleColumns = {
    id: true,
    name: true,
    email: true,
    role: true,
    telephone: true,
    actions: true
  },
  sortConfig = { key: null, direction: 'asc' },
  handleSort = () => {},
  paginatedUsers = mockUsers,
  startIndex = 0,
  handleEdit = (user) => console.log('Edit user:', user),
  handleDelete = (userId, email) => console.log('Delete user:', userId, email),
  currentPage = 1,
  setCurrentPage = () => {},
  itemsPerPage = 8,
  filteredUsers = mockUsers,
  totalPages = 1
}) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userToDelete: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(paginatedUsers);

  // Handle delete button click - opens confirmation modal
  const handleDeleteClick = (user) => {
    setDeleteModal({
      isOpen: true,
      userToDelete: user
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (userId, userEmail) => {
    handleDelete(userId, userEmail);
    setDeleteModal({
      isOpen: false,
      userToDelete: null
    });
  };

  // Handle delete cancellation
  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      userToDelete: null
    });
  };

  // Calculate pagination
  const actualTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const actualStartIndex = (currentPage - 1) * itemsPerPage;

  // Mobile card view for small screens
  const MobileCard = ({ user, index }) => {
    const isExpanded = expandedCard === user?.id;
    
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-semibold">
                {(user?.firstName || 'U').charAt(0).toUpperCase()}
              </span>
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
          <button
            onClick={() => setExpandedCard(isExpanded ? null : user?.id)}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
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
            
            {visibleColumns.actions && (
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => handleEdit(user)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
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
    <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 bg-gray-50 space-y-3 sm:space-y-0">
      <div className="text-gray-600 text-sm font-medium order-2 sm:order-1">
        {actualStartIndex + 1} - {Math.min(actualStartIndex + itemsPerPage, filteredUsers?.length || 0)} of {filteredUsers?.length || 0} rows visible
      </div>
      
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ‹
        </button>
        
        {[...Array(Math.min(5, actualTotalPages))].map((_, i) => {
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
        
        {actualTotalPages > 5 && (
          <>
            <span className="text-gray-600 px-2">...</span>
            <button
              onClick={() => setCurrentPage(actualTotalPages)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                currentPage === actualTotalPages
                  ? 'bg-green-500 text-white border-green-500 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white border-gray-200 bg-white'
              }`}
            >
              {actualTotalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => setCurrentPage(Math.min(actualTotalPages, currentPage + 1))}
          disabled={currentPage === actualTotalPages}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          ›
        </button>
      </div>
    </div>
  );

  if (!paginatedUsers || paginatedUsers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
                <UserPlus className="w-5 h-5" />
                Create User
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-80 bg-white shadow-sm"
                />
              </div>
              <button className="p-3 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-2xl hover:bg-white transition-all duration-200 shadow-sm">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Empty state */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-12 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No users found</p>
              <p className="text-gray-500">Try adjusting your search criteria or add some users.</p>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-medium">
              <UserPlus className="w-5 h-5" />
              Create User
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-80 bg-white shadow-sm"
              />
            </div>
            <button className="p-3 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-2xl hover:bg-white transition-all duration-200 shadow-sm">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Users count */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm font-medium">
            Showing {actualStartIndex + 1}-{Math.min(actualStartIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </p>
        </div>

        {/* Mobile View - Cards */}
        <div className="block lg:hidden">
          <div className="space-y-4">
            {paginatedUsers.map((user, index) => (
              <MobileCard key={user?.id || index} user={user} index={index} />
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
            <PaginationControls />
          </div>
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  {visibleColumns.id && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4" />
                        <span>ID</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.name && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>NAME</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.email && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>EMAIL</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.role && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>ROLE</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.telephone && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>TELEPHONE</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.actions && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">ACTIONS</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user, index) => (
                  <tr key={user?.id || index} className="hover:bg-gray-50 transition-colors">
                    {visibleColumns.id && (
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {actualStartIndex + index + 1}
                      </td>
                    )}
                    {visibleColumns.name && (
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {(user?.firstName || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-900 font-medium">
                            {(user?.firstName || '') + ' ' + (user?.lastName || '') || 'N/A'}
                          </span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.email && (
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-900 truncate max-w-xs" title={user?.email}>
                            {user?.email || 'N/A'}
                          </span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.role && (
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1.5 text-xs font-semibold rounded-full ${
                          user?.userRole === 'Admin' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {user?.userRole || 'N/A'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.telephone && (
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-900">
                            {user?.telephone || 'N/A'}
                          </span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.actions && (
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-white hover:text-green-200 bg-green-600 hover:bg-green-700 transition-colors p-2.5 rounded-lg"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-white hover:text-red-200 bg-red-600 hover:bg-red-700 transition-colors p-2.5 rounded-lg"
                            title="Delete user"
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