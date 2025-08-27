// API configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';

// API service functions
export const apiService = {
  // Get authentication token from localStorage
  getAuthToken: () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },

  // Common headers for API requests
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiService.getAuthToken()}`
  }),

  // ================= FORUM ENDPOINTS =================

  // Fetch all forums
  getForums: async (category = 'all') => {
    try {
      const url = category === 'all' 
        ? `${API_BASE_URL}/forums`
        : `${API_BASE_URL}/forums?category=${category}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: apiService.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch forums: ${response.status}`);
      }

      const forums = await response.json();
      
      // Fetch user data for each forum
      const forumsWithUsers = await Promise.all(
        forums.map(async (forum) => {
          if (forum.user_id) {
            try {
              const userResponse = await fetch(`${API_BASE_URL}/users/${forum.user_id}`, {
                method: 'GET',
                headers: apiService.getHeaders()
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                return {
                  ...forum,
                  user: userData
                };
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }
          return forum;
        })
      );

      return forumsWithUsers;
    } catch (error) {
      console.error('Error fetching forums:', error);
      throw error;
    }
  },

  // Get single forum with details
  getForum: async (forumId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forums/${forumId}`, {
        method: 'GET',
        headers: apiService.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch forum: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching forum:', error);
      throw error;
    }
  },

  // Create new forum
  createForum: async (forumData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forums/test`, {
        method: 'POST',
        headers: apiService.getHeaders(),
        body: JSON.stringify(forumData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create forum: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating forum:', error);
      throw error;
    }
  },

  // ================= COMMENT ENDPOINTS =================

  // Get comments for a forum
  getComments: async (forumId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forums/${forumId}/comments`, {
        method: 'GET',
        headers: apiService.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }

      const comments = await response.json();
      
      // Fetch user data for each comment
      const commentsWithUsers = await Promise.all(
        comments.map(async (comment) => {
          if (comment.user_id) {
            try {
              const userResponse = await fetch(`${API_BASE_URL}/users/${comment.user_id}`, {
                method: 'GET',
                headers: apiService.getHeaders()
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                return {
                  ...comment,
                  user: userData
                };
              }
            } catch (error) {
              console.error('Error fetching comment user data:', error);
            }
          }
          return comment;
        })
      );

      return commentsWithUsers;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Add comment to forum
  addComment: async (forumId, commentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forums/${forumId}/comments`, {
        method: 'POST',
        headers: apiService.getHeaders(),
        body: JSON.stringify(commentData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to add comment: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (forumId, commentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forums/${forumId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: apiService.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete comment: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // ================= LIKE ENDPOINTS =================

  // Toggle like on forum
  toggleLike: async (forumId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forums/${forumId}/like`, {
        method: 'POST',
        headers: apiService.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to toggle like: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Toggle like on comment
  toggleCommentLike: async (forumId, commentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forums/${forumId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: apiService.getHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to toggle comment like: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error;
    }
  },

  // ================= SHARE ENDPOINTS =================

  // Share forum
  shareForum: async (forumId, shareData = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forums/${forumId}/share`, {
        method: 'POST',
        headers: apiService.getHeaders(),
        body: JSON.stringify(shareData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to share forum: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sharing forum:', error);
      throw error;
    }
  },

  // Get forum shares
  getForumShares: async (forumId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forums/${forumId}/shares`, {
        method: 'GET',
        headers: apiService.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch shares: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching shares:', error);
      throw error;
    }
  },

  // ================= USER ENDPOINTS =================

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'GET',
        headers: apiService.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user info:', error);
      throw error;
    }
  }
};

// Helper function to get user display name
export const getUserDisplayName = (forum) => {
  // Check if user data is populated in user_id field (after backend populate)
  if (forum.user_id && typeof forum.user_id === 'object' && forum.user_id.firstName) {
    return `${forum.user_id.firstName} ${forum.user_id.lastName || ''}`.trim();
  }
  
  // Check if user data is in separate user field (frontend solution)
  if (forum.user && forum.user.firstName) {
    return `${forum.user.firstName} ${forum.user.lastName || ''}`.trim();
  }
  
  // Check if there's an author field directly
  if (forum.author && typeof forum.author === 'string') {
    return forum.author;
  }
  
  // Check other possible fields
  if (forum.userName) {
    return forum.userName;
  }
  
  if (forum.createdBy) {
    return forum.createdBy;
  }
  
  // Default fallback
  return 'Anonymous User';
};

// Helper function to format date
export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Unknown date';
  }
};

// Helper function to truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};