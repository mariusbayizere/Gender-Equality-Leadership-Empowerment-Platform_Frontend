import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Search, Bell, Plus, Filter, Star, MapPin, Clock, User, Send, Heart, Share2, Eye, MessageCircle } from 'lucide-react';



// Discussion Forums Component
export const DiscussionForums = () => {
  const [forums, setForums] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newForum, setNewForum] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  const sampleForums = [
    {
      id: 1,
      title: 'Breaking Through Glass Ceilings in Tech',
      content: 'What strategies have worked for you in advancing to leadership positions in male-dominated industries?',
      category: 'career',
      author: 'Marie Uwimana',
      createdAt: '2024-07-25T10:00:00Z',
      replies: 12,
      likes: 24,
      views: 156
    },
    {
      id: 2,
      title: 'Mentorship Success Stories',
      content: 'Share your experiences with mentorship - both as a mentor and mentee. What made the relationship successful?',
      category: 'mentorship',
      author: 'Grace Mukamana',
      createdAt: '2024-07-24T14:30:00Z',
      replies: 8,
      likes: 18,
      views: 89
    },
    {
      id: 3,
      title: 'Upcoming GELEP Annual Conference',
      content: 'Exciting news! Registration is now open for our annual conference. Early bird pricing available until August 1st.',
      category: 'events',
      author: 'GELEP Admin',
      createdAt: '2024-07-23T09:15:00Z',
      replies: 15,
      likes: 32,
      views: 245
    }
  ];

  useEffect(() => {
    setForums(sampleForums);
  }, []);

  const createForum = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/forums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newForum,
          user_id: 'current_user_id' // Replace with actual user ID
        })
      });

      if (response.ok) {
        const createdForum = await response.json();
        setForums(prev => [
          {
            ...createdForum,
            author: 'Current User',
            replies: 0,
            likes: 0,
            views: 0
          },
          ...prev
        ]);
        setNewForum({ title: '', content: '', category: 'general' });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'general', label: 'General' },
    { id: 'mentorship', label: 'Mentorship' },
    { id: 'career', label: 'Career' },
    { id: 'technical', label: 'Technical' },
    { id: 'events', label: 'Events' }
  ];

  const filteredForums = forums.filter(forum =>
    selectedCategory === 'all' || forum.category === selectedCategory
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Discussion Forums</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
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
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {showCreateForm && (
        <div className="p-6 border-b bg-gray-50">
          <form onSubmit={createForum} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newForum.title}
                onChange={(e) => setNewForum(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter topic title..."
                maxLength={100}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={newForum.category}
                onChange={(e) => setNewForum(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.slice(1).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={newForum.content}
                onChange={(e) => setNewForum(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={4}
                placeholder="Share your thoughts, ask questions, or start a discussion..."
                maxLength={500}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Create Topic
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6">
        <div className="space-y-4">
          {filteredForums.map((forum) => (
            <div key={forum.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{forum.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      forum.category === 'career' ? 'bg-blue-100 text-blue-700' :
                      forum.category === 'mentorship' ? 'bg-green-100 text-green-700' :
                      forum.category === 'events' ? 'bg-orange-100 text-orange-700' :
                      forum.category === 'technical' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {forum.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{forum.content}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {forum.author}
                    </span>
                    <span>{new Date(forum.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {forum.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {forum.replies}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {forum.likes}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200">
                    Join Discussion
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};