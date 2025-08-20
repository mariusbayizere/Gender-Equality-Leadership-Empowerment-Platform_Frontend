// // Enhanced API Service with Chat Functions and Better Error Handling
// export const apiService = {
//   baseURL: 'http://localhost:3000/api/v1',
  
//   getAuthHeaders: () => ({
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${localStorage.getItem('token')}`
//   }),

//   // Existing connection methods...
//   async getProfessionals(params = {}) {
//     const URL = 'http://localhost:3000/api/v1'
//     const queryParams = new URLSearchParams(params).toString();
//     const response = await fetch(`${URL}/connections/professionals?${queryParams}`, {
//       headers: this.getAuthHeaders()
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to fetch professionals');
//     }
//     return response.json();
//   },

//   async sendConnectionRequest(recipientId, message = '') {
//     const URL = 'http://localhost:3000/api/v1'
//     const response = await fetch(`${URL}/connections`, {
//       method: 'POST',
//       headers: this.getAuthHeaders(),
//       body: JSON.stringify({
//         requester_id: this.getCurrentUserId(),
//         recipient_id: recipientId,
//         message: message || 'I would like to connect with you for professional networking.'
//       })
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to send connection request');
//     }
//     return response.json();
//   },

//   async getMyConnections() {
//     const URL = 'http://localhost:3000/api/v1'
//     const response = await fetch(`${URL}/connections/my-connections`, {
//       headers: this.getAuthHeaders()
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to fetch connections');
//     }
//     return response.json();
//   },

//   async getPendingRequests() {
//     const URL = 'http://localhost:3000/api/v1'
//     const response = await fetch(`${URL}/connections/requests`, {
//       headers: this.getAuthHeaders()
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to fetch requests');
//     }
//     return response.json();
//   },

//   async respondToRequest(requestId, status, message = '') {
//     const URL = 'http://localhost:3000/api/v1'
    
//     const validStatuses = ['accepted', 'rejected'];
//     if (!validStatuses.includes(status)) {
//       throw new Error(`Invalid status: ${status}. Must be 'accepted' or 'rejected'`);
//     }

//     const requestBody = {
//       status: status,
//       ...(message && { message: message })
//     };

//     console.log('Sending request to:', `${URL}/connections/${requestId}/respond`);
//     console.log('Request body:', requestBody);

//     const response = await fetch(`${URL}/connections/${requestId}/respond`, {
//       method: 'PUT',
//       headers: this.getAuthHeaders(),
//       body: JSON.stringify(requestBody)
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       console.error('Backend error response:', error);
//       throw new Error(error.message || error.error || 'Failed to respond to request');
//     }
//     return response.json();
//   },

//   async removeConnection(connectionId) {
//     const URL = 'http://localhost:3000/api/v1'
//     const response = await fetch(`${URL}/connections/${connectionId}`, {
//       method: 'DELETE',
//       headers: this.getAuthHeaders()
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to remove connection');
//     }
//     return response.json();
//   },

//   async getConnectionStats() {
//     const URL = 'http://localhost:3000/api/v1'

//     const response = await fetch(`${URL}/connections/stats`, {
//       headers: this.getAuthHeaders()
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to fetch stats');
//     }
//     return response.json();
//   },

//   // NEW CHAT API METHODS

//   async getChatConversations() {
//     const URL = 'http://localhost:3000/api/v1';
//     const response = await fetch(`${URL}/chat/conversations`, {
//       headers: this.getAuthHeaders()
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to fetch conversations');
//     }
//     const data = await response.json();
//     // Backend returns array directly, wrap it for frontend compatibility
//     return { conversations: Array.isArray(data) ? data : [] };
//   },

//   async getMessages(conversationId, page = 1, limit = 50) {
//     const URL = 'http://localhost:3000/api/v1';
//     const queryParams = new URLSearchParams({ 
//       limit: limit.toString(),
//       ...(page > 1 && { before: '' }) // Add pagination support if needed
//     });
//     const response = await fetch(`${URL}/chat/conversations/${conversationId}/messages?${queryParams}`, {
//       headers: this.getAuthHeaders()
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to fetch messages');
//     }
//     const data = await response.json();
//     // Backend returns array directly, wrap it for frontend compatibility
//     return { messages: Array.isArray(data) ? data : [] };
//   },

//   async getOrCreateConversation(participantId) {
//     const URL = 'http://localhost:3000/api/v1';
//     const response = await fetch(`${URL}/chat/conversations`, {
//       method: 'POST',
//       headers: this.getAuthHeaders(),
//       body: JSON.stringify({
//         participantId: participantId  // Changed from participant_id to participantId
//       })
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || error.message || 'Failed to create conversation');
//     }
//     return response.json();
//   },

//   // FIXED: Send a message with better error handling and logging
//   async sendMessage(conversationId, content, type = 'text') {
//     const URL = 'http://localhost:3000/api/v1';
    
//     // Log the data being sent for debugging
//     const messageData = {
//       content: content,
//       type: type
//     };
    
//     console.log('Sending message to:', `${URL}/chat/conversations/${conversationId}/messages`);
//     console.log('Message data:', messageData);
//     console.log('Headers:', this.getAuthHeaders());
    
//     const response = await fetch(`${URL}/chat/conversations/${conversationId}/messages`, {
//       method: 'POST',
//       headers: this.getAuthHeaders(),
//       body: JSON.stringify(messageData)
//     });
    
//     // Enhanced error handling
//     if (!response.ok) {
//       let errorMessage = 'Failed to send message';
//       try {
//         const errorData = await response.json();
//         console.error('Backend error response:', errorData);
        
//         // Handle different error formats
//         if (errorData.error) {
//           errorMessage = errorData.error;
//         } else if (errorData.message) {
//           errorMessage = errorData.message;
//         } else if (errorData.details) {
//           errorMessage = errorData.details;
//         }
//       } catch (parseError) {
//         console.error('Error parsing error response:', parseError);
//         errorMessage = `HTTP ${response.status}: ${response.statusText}`;
//       }
      
//       throw new Error(errorMessage);
//     }
    
//     const result = await response.json();
//     console.log('Message sent successfully:', result);
//     return result;
//   },

//   async markMessagesAsRead(conversationId) {
//     // Since your backend only supports marking individual messages as read,
//     // we need to get all unread messages for this conversation first
//     try {
//       const messagesResponse = await this.getMessages(conversationId);
//       const messages = messagesResponse.messages || [];
      
//       // Filter unread messages that the current user is the recipient of
//       const currentUserId = this.getCurrentUserId();
//       const unreadMessages = messages.filter(msg => 
//         msg.recipientId === currentUserId && 
//         msg.status !== 'read'
//       );
      
//       // Mark each unread message as read
//       const promises = unreadMessages.map(msg => {
//         const URL = 'http://localhost:3000/api/v1';
//         return fetch(`${URL}/chat/messages/${msg.id}/read`, {
//           method: 'PUT',
//           headers: this.getAuthHeaders()
//         });
//       });
      
//       await Promise.all(promises);
//       return { success: true };
//     } catch (error) {
//       console.error('Error marking messages as read:', error);
//       throw error;
//     }
//   },

//   // Delete a message
//   async deleteMessage(conversationId, messageId) {
//     const URL = 'http://localhost:3000/api/v1';
//     const response = await fetch(`${URL}/chat/conversations/${conversationId}/messages/${messageId}`, {
//       method: 'DELETE',
//       headers: this.getAuthHeaders()
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to delete message');
//     }
//     return response.json();
//   },

//   // Get chat statistics
//   async getChatStats() {
//     const URL = 'http://localhost:3000/api/v1';
//     const response = await fetch(`${URL}/chat/stats`, {
//       headers: this.getAuthHeaders()
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Failed to fetch chat stats');
//     }
//     return response.json();
//   },

//   getCurrentUserId() {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         console.log('Current user ID from token:', payload.id || payload.userId || payload.user_id);
//         return payload.id || payload.userId || payload.user_id;
//       } catch (e) {
//         console.error('Error parsing token:', e);
//         return null;
//       }
//     }
//     return null;
//   }
// };

// Enhanced API Service with Chat Functions and Better Error Handling
const apiService = {
  baseURL: 'http://localhost:3000/api/v1',
  
  // Cache for user ID to avoid repeated token parsing
  _cachedUserId: null,
  _tokenCache: null,
  _lastCacheTime: 0,
  
  // Cache timeout (5 minutes)
  CACHE_TIMEOUT: 5 * 60 * 1000,

  getAuthHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }),

  // OPTIMIZED: Cache user ID with timeout to avoid repeated token parsing
  getCurrentUserId() {
    const currentToken = localStorage.getItem('token');
    const now = Date.now();
    
    // Return cached ID if token hasn't changed and cache is still valid
    if (this._cachedUserId && 
        this._tokenCache === currentToken && 
        (now - this._lastCacheTime) < this.CACHE_TIMEOUT) {
      return this._cachedUserId;
    }
    
    if (currentToken) {
      try {
        const payload = JSON.parse(atob(currentToken.split('.')[1]));
        this._cachedUserId = payload.id || payload.userId || payload.user_id;
        this._tokenCache = currentToken;
        this._lastCacheTime = now;
        
        // Only log once when cache is updated (removed excessive logging)
        if (this._cachedUserId && !this._tokenCache) {
          console.log('User ID cached:', this._cachedUserId);
        }
        
        return this._cachedUserId;
      } catch (e) {
        console.error('Error parsing token:', e);
        this.clearCache();
        return null;
      }
    }
    
    this.clearCache();
    return null;
  },

  // Clear cache when user logs out
  clearCache() {
    this._cachedUserId = null;
    this._tokenCache = null;
    this._lastCacheTime = 0;
  },

  // OPTIMIZED: Request caching for conversations
  _conversationsCache: null,
  _conversationsCacheTime: 0,
  CONVERSATIONS_CACHE_TIMEOUT: 30 * 1000, // 30 seconds

  // Existing connection methods...
  async getProfessionals(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/connections/professionals?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch professionals');
    }
    return response.json();
  },

  async sendConnectionRequest(recipientId, message = '') {
    const response = await fetch(`${this.baseURL}/connections`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        requester_id: this.getCurrentUserId(),
        recipient_id: recipientId,
        message: message || 'I would like to connect with you for professional networking.'
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send connection request');
    }
    return response.json();
  },

  async getMyConnections() {
    const response = await fetch(`${this.baseURL}/connections/my-connections`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch connections');
    }
    return response.json();
  },

  async getPendingRequests() {
    const response = await fetch(`${this.baseURL}/connections/requests`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch requests');
    }
    return response.json();
  },

  async respondToRequest(requestId, status, message = '') {
    const validStatuses = ['accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be 'accepted' or 'rejected'`);
    }

    const requestBody = {
      status: status,
      ...(message && { message: message })
    };

    const response = await fetch(`${this.baseURL}/connections/${requestId}/respond`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.error || 'Failed to respond to request');
    }
    return response.json();
  },

  async removeConnection(connectionId) {
    const response = await fetch(`${this.baseURL}/connections/${connectionId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove connection');
    }
    return response.json();
  },

  async getConnectionStats() {
    const response = await fetch(`${this.baseURL}/connections/stats`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch stats');
    }
    return response.json();
  },

  // OPTIMIZED CHAT API METHODS WITH CACHING

  async getChatConversations(forceRefresh = false) {
    const now = Date.now();
    
    // Return cached data if available and not expired
    if (!forceRefresh && 
        this._conversationsCache && 
        (now - this._conversationsCacheTime) < this.CONVERSATIONS_CACHE_TIMEOUT) {
      return this._conversationsCache;
    }
    
    const response = await fetch(`${this.baseURL}/chat/conversations`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch conversations');
    }
    const data = await response.json();
    const result = { conversations: Array.isArray(data) ? data : [] };
    
    // Cache the result
    this._conversationsCache = result;
    this._conversationsCacheTime = now;
    
    return result;
  },

  // Message caching
  _messagesCache: new Map(),
  _messagesCacheTime: new Map(),
  MESSAGES_CACHE_TIMEOUT: 15 * 1000, // 15 seconds

  async getMessages(conversationId, page = 1, limit = 50, forceRefresh = false) {
    const cacheKey = `${conversationId}-${page}-${limit}`;
    const now = Date.now();
    
    // Return cached messages if available and not expired
    if (!forceRefresh && 
        this._messagesCache.has(cacheKey) && 
        (now - this._messagesCacheTime.get(cacheKey)) < this.MESSAGES_CACHE_TIMEOUT) {
      return this._messagesCache.get(cacheKey);
    }
    
    const queryParams = new URLSearchParams({ 
      limit: limit.toString(),
      ...(page > 1 && { before: '' })
    });
    const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}/messages?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch messages');
    }
    const data = await response.json();
    const result = { messages: Array.isArray(data) ? data : [] };
    
    // Cache the result
    this._messagesCache.set(cacheKey, result);
    this._messagesCacheTime.set(cacheKey, now);
    
    return result;
  },

  // Clear message cache for a specific conversation when new message is sent
  clearMessageCache(conversationId) {
    const keysToDelete = [];
    for (let key of this._messagesCache.keys()) {
      if (key.startsWith(`${conversationId}-`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => {
      this._messagesCache.delete(key);
      this._messagesCacheTime.delete(key);
    });
  },

  async getOrCreateConversation(participantId) {
    const response = await fetch(`${this.baseURL}/chat/conversations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        participantId: participantId
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || error.message || 'Failed to create conversation');
    }
    
    // Clear conversations cache since we might have a new conversation
    this._conversationsCache = null;
    this._conversationsCacheTime = 0;
    
    return response.json();
  },

  // OPTIMIZED: Reduced logging and better error handling
  async sendMessage(conversationId, content, type = 'text') {
    const messageData = {
      content: content,
      type: type
    };
    
    // Remove excessive logging
    const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(messageData)
    });
    
    if (!response.ok) {
      let errorMessage = 'Failed to send message';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorData.details || errorMessage;
      } catch (parseError) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    // Clear message cache for this conversation
    this.clearMessageCache(conversationId);
    
    // Clear conversations cache to refresh last message
    this._conversationsCache = null;
    this._conversationsCacheTime = 0;
    
    return response.json();
  },

  // OPTIMIZED: Batch mark messages as read with single API call
  async markMessagesAsRead(conversationId) {
    try {
      const messagesResponse = await this.getMessages(conversationId);
      const messages = messagesResponse.messages || [];
      
      const currentUserId = this.getCurrentUserId();
      const unreadMessages = messages.filter(msg => 
        msg.recipientId === currentUserId && 
        msg.status !== 'read'
      );
      
      if (unreadMessages.length === 0) {
        return { success: true };
      }
      
      // Process in smaller batches to avoid overwhelming the server
      const batchSize = 3;
      const batches = [];
      for (let i = 0; i < unreadMessages.length; i += batchSize) {
        batches.push(unreadMessages.slice(i, i + batchSize));
      }
      
      for (const batch of batches) {
        const promises = batch.map(msg => 
          fetch(`${this.baseURL}/chat/messages/${msg.id}/read`, {
            method: 'PUT',
            headers: this.getAuthHeaders()
          }).catch(error => {
            console.warn(`Failed to mark message ${msg.id} as read:`, error);
            return null;
          })
        );
        await Promise.allSettled(promises);
        
        // Small delay between batches to avoid rate limiting
        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Clear message cache to refresh read status
      this.clearMessageCache(conversationId);
      
      return { success: true };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  },

  async deleteMessage(conversationId, messageId) {
    const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}/messages/${messageId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete message');
    }
    
    // Clear message cache for this conversation
    this.clearMessageCache(conversationId);
    
    return response.json();
  },

  async getChatStats() {
    const response = await fetch(`${this.baseURL}/chat/stats`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch chat stats');
    }
    return response.json();
  },

  // Clear all caches (useful for logout)
  clearAllCaches() {
    this.clearCache();
    this._conversationsCache = null;
    this._conversationsCacheTime = 0;
    this._messagesCache.clear();
    this._messagesCacheTime.clear();
  }
};

// PROPER EXPORT - This is the key fix for the import error
export { apiService };