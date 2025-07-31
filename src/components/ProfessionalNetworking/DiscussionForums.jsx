
import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle, AlertCircle, Loader } from 'lucide-react';
import {apiService , getUserDisplayName} from './apiServiceForum'



// Main Discussion Forums Component
export const DiscussionForums = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [newForum, setNewForum] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'general', label: 'General' },
    { id: 'mentorship', label: 'Mentorship' },
    { id: 'career', label: 'Career' },
    { id: 'technical', label: 'Technical' },
    { id: 'events', label: 'Events' }
  ];

  // Load current user on component mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await apiService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to load user:', error);
        // Don't set error state for user loading failure
      }
    };

    loadCurrentUser();
  }, []);

  // Load forums when component mounts or category changes
  useEffect(() => {
    loadForums();
  }, [selectedCategory]);

  const loadForums = async () => {
    try {
      setLoading(true);
      setError(null);
      const forumsData = await apiService.getForums(selectedCategory);
      console.log('Forums data:', forumsData); // Debug log to see the structure
      
      // Log each forum to see its structure
      forumsData.forEach((forum, index) => {
        console.log(`Forum ${index}:`, {
          id: forum.id || forum._id,
          title: forum.title,
          author: forum.author,
          user: forum.user,
          user_id: forum.user_id,
          createdBy: forum.createdBy,
          userName: forum.userName,
          // Log all properties to see what's available
          allProperties: Object.keys(forum)
        });
      });
      
      setForums(forumsData);
    } catch (error) {
      setError('Failed to load forums. Please try again.');
      console.error('Error loading forums:', error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATED createForum function
  const createForum = async () => {
    if (!newForum.title.trim() || !newForum.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    
    if (!currentUser) {
      setError('You must be logged in to create a forum.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare forum data WITHOUT user_id - backend will handle it automatically
      const forumData = {
        title: newForum.title.trim(),
        content: newForum.content.trim(),
        category: newForum.category
        // No user_id needed - backend gets it from the authenticated user's token
      };

      console.log('Sending forum data:', forumData);

      const createdForum = await apiService.createForum(forumData);
      
      // Add the new forum to the top of the list
      setForums(prev => [createdForum, ...prev]);
      
      // Reset form
      setNewForum({ title: '', content: '', category: 'general' });
      setShowCreateForm(false);
      
    } catch (error) {
      console.error('Full error details:', error);
      setError(error.message || 'Failed to create forum. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (forumId) => {
    if (!currentUser) {
      setError('You must be logged in to like posts.');
      return;
    }

    try {
      await apiService.toggleLike(forumId);
      
      // Update the forum in the local state
      setForums(prev => prev.map(forum => 
        forum.id === forumId || forum._id === forumId
          ? { 
              ...forum, 
              likes: (forum.likes || 0) + (forum.isLiked ? -1 : 1),
              isLiked: !forum.isLiked 
            }
          : forum
      ));
    } catch (error) {
      console.error('Error liking forum:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      career: 'bg-blue-100 text-blue-700',
      mentorship: 'bg-green-100 text-green-700',
      events: 'bg-orange-100 text-orange-700',
      technical: 'bg-red-100 text-red-700',
      general: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Discussion Forums</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            disabled={!currentUser}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              currentUser 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={!currentUser ? 'Please log in to create topics' : 'Create new topic'}
          >
            <Plus className="w-4 h-4" />
            New Topic
          </button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Create Forum Form */}
      {showCreateForm && (
        <div className="p-6 border-b bg-gray-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={newForum.title}
                onChange={(e) => setNewForum(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter topic title..."
                maxLength={100}
                required
                disabled={submitting}
              />
              <div className="text-xs text-gray-500 mt-1">
                {newForum.title.length}/100 characters
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={newForum.category}
                onChange={(e) => setNewForum(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
              >
                {categories.slice(1).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                value={newForum.content}
                onChange={(e) => setNewForum(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                maxLength={500}
                required
                disabled={submitting}
              />
              <div className="text-xs text-gray-500 mt-1">
                {newForum.content.length}/500 characters
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={createForum}
                disabled={submitting}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  submitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {submitting && <Loader className="w-4 h-4 animate-spin" />}
                {submitting ? 'Creating...' : 'Create Topic'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewForum({ title: '', content: '', category: 'general' });
                  setError(null);
                }}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forums List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading forums...</span>
          </div>
        ) : forums.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No forums found in this category.</p>
            <p className="text-sm">Be the first to start a discussion!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {forums.map((forum) => {
              const forumId = forum.id || forum._id;
              const displayName = getUserDisplayName(forum);
              
              return (
                <div key={forumId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {forum.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(forum.category)}`}>
                          {forum.category}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {forum.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {displayName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(forum.createdAt || forum.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {forum.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {forum.replies || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {forum.likes || 0}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleLike(forumId)}
                        disabled={!currentUser}
                        className={`p-2 rounded transition-colors ${
                          forum.isLiked 
                            ? 'text-red-600 bg-red-50' 
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                        } ${!currentUser ? 'cursor-not-allowed opacity-50' : ''}`}
                        title={!currentUser ? 'Please log in to like posts' : 'Like this post'}
                      >
                        <Heart className={`w-4 h-4 ${forum.isLiked ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                        Join Discussion
                      </button>
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

export default DiscussionForums;
