import React, { useState, useEffect } from 'react';
import {
  Edit, List, Trash2, Calendar, MapPin, Users, Clock, Link, MoreVertical, AlertCircle, X, Plus, Search, RefreshCw, Grid3X3, Menu, Hash, Globe
} from 'lucide-react';
import { formatDate } from './formatDate';
import EventForm from './EventForm'; 

// Column definitions
const columnsList = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'event_type', label: 'Type' },
  { key: 'event_date', label: 'Date' },
  { key: 'location', label: 'Location' },
  { key: 'number_participants', label: 'Participants' },
  { key: 'session_link', label: 'Session Link' },
  { key: 'actions', label: 'Actions' },
];

const getEventTypeIcon = (eventType) => {
  switch (eventType) {
    case 'workshop':
      return <Users className="text-blue-500 w-5 h-5" />;
    case 'networking':
      return <Globe className="text-green-500 w-5 h-5" />;
    case 'mentorship_session':
      return <Clock className="text-purple-500 w-5 h-5" />;
    case 'other':
      return <Calendar className="text-orange-500 w-5 h-5" />;
    default:
      return <Calendar className="text-gray-400 w-5 h-5" />;
  }
};

const getEventTypeColor = (eventType) => {
  switch (eventType) {
    case 'workshop':
      return 'bg-blue-100 text-blue-700';
    case 'networking':
      return 'bg-green-100 text-green-700';
    case 'mentorship_session':
      return 'bg-purple-100 text-purple-700';
    case 'other':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Delete Confirmation Modal Component
const DeleteConfirmation = ({
  isOpen,
  eventToDelete,
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
            <h3 className="text-xl font-semibold text-gray-900">Delete Event</h3>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete the event{' '}
            <span className="font-semibold text-gray-900">
              "{eventToDelete?.title || ''}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium">Cancel</button>
          <button onClick={() => onConfirm(eventToDelete?.id)} className="flex-1 px-4 py-2.5 text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors font-medium">Delete Event</button>
        </div>
      </div>
    </div>
  );
};

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true, title: true, description: true, event_type: true, event_date: true, location: true, number_participants: true, session_link: true, actions: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [expandedCard, setExpandedCard] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, eventToDelete: null });
  const [viewMode, setViewMode] = useState('table');
  const [showColumnToggle, setShowColumnToggle] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

const [showEventForm, setShowEventForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);


  const handleCreateEvent = () => {
  setIsEditMode(false);      // Set to create mode
  setEventToEdit(null);      // Clear any existing event data
  setShowEventForm(true);    // Show the modal
};


  const handleEditEvent = (event) => {
  setIsEditMode(true);       // Set to edit mode
  setEventToEdit(event);     // Pass the event to edit
  setShowEventForm(true);    // Show the modal
};

const handleEventSaved = (savedEvent) => {
  if (isEditMode) {
    // Update existing event in the list
    setEvents(events.map(event => 
      event.id === savedEvent.id ? savedEvent : event
    ));
  } else {
    // Add new event to the list
    setEvents([...events, savedEvent]);
  }
  
  // Reset form state
  setShowEventForm(false);
  setIsEditMode(false);
  setEventToEdit(null);
};


  // Fetch events from API
  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/api/v1/events', {
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('Failed to fetch events');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  // Delete event
  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:3000/api/v1/events/${eventId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('Failed to delete event');
      setEvents(events.filter(e => e.id !== eventId));
    } catch (err) {
      alert(err.message || 'Failed to delete event');
    }
  };

  // Column toggle
  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Delete modal handlers
  const handleDeleteClick = (event) => setDeleteModal({ isOpen: true, eventToDelete: event });
  const handleDeleteConfirm = (eventId) => {
    handleDelete(eventId);
    setDeleteModal({ isOpen: false, eventToDelete: null });
  };
  const handleDeleteCancel = () => setDeleteModal({ isOpen: false, eventToDelete: null });


  // Filtered and paginated events
  const filteredEvents = events.filter(event => {
    const search = searchTerm.toLowerCase();
    return (
      (event.title && event.title.toLowerCase().includes(search)) ||
      (event.description && event.description.toLowerCase().includes(search)) ||
      (event.event_type && event.event_type.toLowerCase().includes(search)) ||
      (event.location && event.location.toLowerCase().includes(search))
    );
  });
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const actualStartIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(actualStartIndex, actualStartIndex + itemsPerPage);

  // Mobile card view for small screens
  const MobileCard = ({ event, index }) => {
    const isExpanded = expandedCard === event?.id;
    return (
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900 font-semibold text-base">
                {event?.title || 'N/A'}
              </h3>
              <p className="text-gray-500 text-sm">
                ID: {actualStartIndex + index + 1}
              </p>
            </div>
          </div>
          <button onClick={() => setExpandedCard(isExpanded ? null : event?.id)} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {visibleColumns.description && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                <Calendar className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-gray-700 text-sm">{event?.description || 'N/A'}</span>
            </div>
          )}
          {visibleColumns.event_type && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {getEventTypeIcon(event?.event_type)}
              </div>
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(event?.event_type)}`}>
                {event?.event_type?.replace(/_/g, ' ') || 'N/A'}
              </span>
            </div>
          )}
          {visibleColumns.event_date && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700 text-sm">{formatDate(event?.event_date)}</span>
            </div>
          )}
        </div>
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
            {visibleColumns.location && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700 text-sm">{event?.location || 'N/A'}</span>
              </div>
            )}
            {visibleColumns.number_participants && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-gray-700 text-sm">{event?.number_participants || 'N/A'} participants</span>
              </div>
            )}
            {visibleColumns.session_link && event?.session_link && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Link className="w-4 h-4 text-cyan-600" />
                </div>
                <a href={event.session_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:text-blue-800 truncate">
                  {event.session_link}
                </a>
              </div>
            )}
            {visibleColumns.actions && (
              <div className="flex items-center space-x-3 pt-3">
                <button
                  onClick={() => handleEditEvent(event)}
                  className="flex-1 bg-green-600 bg-opacity-1 hover:bg-opacity-30 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(event)}
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
        {actualStartIndex + 1} - {Math.min(actualStartIndex + itemsPerPage, filteredEvents?.length || 0)} of {filteredEvents?.length || 0} rows visible
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
        <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">›</button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600 text-sm sm:text-base">Loading events...</span>
      </div>
    );
  }

  if (!paginatedEvents || paginatedEvents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white shadow-sm"
                />
              </div>
              <button className="p-2.5 text-gray-600 hover:text-gray-800 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2.5 text-gray-600 hover:text-gray-800 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-sm">
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-800 text-xl font-semibold mb-2">No events found</p>
              <p className="text-gray-500">Try adjusting your search criteria or add some events.</p>
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
            <button 
              onClick={handleCreateEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button onClick={fetchEvents} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-sm transition-colors" title="Refresh">
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
                onClick={handleCreateEvent}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Event</span>
                <span className="sm:hidden">Create</span>
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg">
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-700 placeholder-gray-500 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {isMobileMenuOpen && (
              <div className="mt-3 mobile-menu-container bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button onClick={fetchEvents} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
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
            Showing {actualStartIndex + 1}-{Math.min(actualStartIndex + itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
          </p>
        </div>
        
        {/* Mobile View - Cards */}
        <div className="block lg:hidden">
          <div className="space-y-4">
            {paginatedEvents.map((event, index) => (
              <MobileCard key={event?.id || index} event={event} index={index} />
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4">
            <PaginationControls />
          </div>
        </div>
        
        {/* Desktop View - Table */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  {visibleColumns.id && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Hash className="w-4 h-4" />
                        <span>ID</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.title && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Title</span>
                      </div>
                    </th>
                  )}
                  {/* {visibleColumns.description && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <List className="w-4 h-4" />
                        <span>Description</span>
                      </div>
                    </th>
                  )} */}
                  {visibleColumns.event_type && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Type</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.event_date && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Date</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.location && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>Location</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.number_participants && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Participants</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.session_link && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Link className="w-4 h-4" />
                        <span>Session Link</span>
                      </div>
                    </th>
                  )}
                  {visibleColumns.actions && (
                    <th className="text-left py-4 px-6 text-gray-600 font-medium text-sm">
                      <div className="flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Actions</span>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedEvents.map((event, index) => (
                  <tr key={event?.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {visibleColumns.id && (
                      <td className="py-4 px-6 text-gray-700 text-sm">
                        {actualStartIndex + index + 1}
                      </td>
                    )}
                    {visibleColumns.title && (
                      <td className="py-4 px-6 text-gray-900 font-medium text-sm">
                        {event?.title || 'N/A'}
                      </td>
                    )}
                    {/* {visibleColumns.description && (
                      <td className="py-4 px-6 text-gray-700 text-sm max-w-xs">
                        <div className="truncate" title={event?.description || 'N/A'}>
                          {event?.description || 'N/A'}
                        </div>
                      </td>
                    )} */}
                    {visibleColumns.event_type && (
                      <td className="py-4 px-6 text-sm">
                        <div className="flex items-center space-x-2">
                          {getEventTypeIcon(event?.event_type)}
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event?.event_type)}`}>
                            {event?.event_type?.replace(/_/g, ' ') || 'N/A'}
                          </span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.event_date && (
                      <td className="py-4 px-6 text-gray-700 text-sm">
                        {formatDate(event?.event_date)}
                      </td>
                    )}
                    {visibleColumns.location && (
                      <td className="py-4 px-6 text-gray-700 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{event?.location || 'N/A'}</span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.number_participants && (
                      <td className="py-4 px-6 text-gray-700 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{event?.number_participants || 'N/A'}</span>
                        </div>
                      </td>
                    )}
                    {visibleColumns.session_link && (
                      <td className="py-4 px-6 text-sm">
                        {event?.session_link ? (
                          <a 
                            href={event.session_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline truncate block max-w-xs"
                            title={event.session_link}
                          >
                            {event.session_link}
                          </a>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                    )}
                    {visibleColumns.actions && (
                      <td className="py-4 px-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(event)}
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                            title="Delete Event"
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

        <EventForm
  showModal={showEventForm}  
  setShowModal={setShowEventForm}     
  onEventSaved={handleEventSaved}     
  eventToEdit={eventToEdit}           
  isEditMode={isEditMode}             
/>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmation
          isOpen={deleteModal.isOpen}
          eventToDelete={deleteModal.eventToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </div>
  );
};

export default EventManagement;