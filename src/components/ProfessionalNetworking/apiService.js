

// API Service Functions
export const apiService = {
  baseURL: 'http://localhost:3000/api/v1',
  
  getAuthHeaders: () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }),

  // Get all professionals for networking
  async getProfessionals(params = {}) {
    const URL = 'http://localhost:3000/api/v1'
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${URL}/connections/professionals?${queryParams}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch professionals');
    }
    return response.json();
  },

  // Send connection request
  async sendConnectionRequest(recipientId, message = '') {
    const URL = 'http://localhost:3000/api/v1'
    const response = await fetch(`${URL}/connections`, {
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

  // Get user's connections
  async getMyConnections() {
    const URL = 'http://localhost:3000/api/v1'
    const response = await fetch(`${URL}/connections/my-connections`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch connections');
    }
    return response.json();
  },

  // Get pending connection requests
  async getPendingRequests() {
    const URL = 'http://localhost:3000/api/v1'
    const response = await fetch(`${URL}/connections/requests`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch requests');
    }
    return response.json();
  },

  // Respond to connection request - FIXED
  async respondToRequest(requestId, status, message = '') {
    const URL = 'http://localhost:3000/api/v1'
    
    // Validate status before sending
    const validStatuses = ['accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be 'accepted' or 'rejected'`);
    }

    const requestBody = {
      status: status,
      ...(message && { message: message })
    };

    console.log('Sending request to:', `${URL}/connections/${requestId}/respond`);
    console.log('Request body:', requestBody);

    const response = await fetch(`${URL}/connections/${requestId}/respond`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Backend error response:', error);
      throw new Error(error.message || error.error || 'Failed to respond to request');
    }
    return response.json();
  },

  // Remove connection
  async removeConnection(connectionId) {
    const URL = 'http://localhost:3000/api/v1'
    const response = await fetch(`${URL}/connections/${connectionId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to remove connection');
    }
    return response.json();
  },

  // Get connection statistics
  async getConnectionStats() {
    const URL = 'http://localhost:3000/api/v1'

    const response = await fetch(`${URL}/connections/stats`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch stats');
    }
    return response.json();
  },

  // Get current user ID (you might need to implement this based on your auth system)
  getCurrentUserId() {
    // This should return the current user's ID from your auth state/token
    // For now, returning a placeholder - implement based on your auth system
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id || payload.userId || payload.user_id;
      } catch (e) {
        console.error('Error parsing token:', e);
        return null;
      }
    }
    return null;
  }
};


// // API Service Functions - Optimized
// export const apiService = {
//   baseURL: 'http://localhost:3000/api/v1',
//   requestTimeout: 5000, // 5 second timeout
  
//   getAuthHeaders: () => ({
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${localStorage.getItem('token')}`
//   }),

//   // Helper function to create fetch with timeout
//   fetchWithTimeout: async (url, options = {}) => {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), apiService.requestTimeout);
    
//     try {
//       const response = await fetch(url, {
//         ...options,
//         signal: controller.signal
//       });
//       clearTimeout(timeoutId);
//       return response;
//     } catch (error) {
//       clearTimeout(timeoutId);
//       if (error.name === 'AbortError') {
//         throw new Error('Request timeout - Server took too long to respond');
//       }
//       throw error;
//     }
//   },

//   // Get all professionals for networking - OPTIMIZED
//   async getProfessionals(params = {}) {
//     const URL = 'http://localhost:3000/api/v1';
    
//     // Limit the parameters to reduce query complexity
//     const optimizedParams = {
//       search: params.search || '',
//       role: params.role || 'all',
//       limit: Math.min(params.limit || 20, 20), // Cap at 20 for performance
//       page: params.page || 1
//     };
    
//     // Remove empty parameters
//     Object.keys(optimizedParams).forEach(key => {
//       if (!optimizedParams[key] || optimizedParams[key] === 'all') {
//         delete optimizedParams[key];
//       }
//     });
    
//     const queryParams = new URLSearchParams(optimizedParams).toString();
    
//     try {
//       const response = await this.fetchWithTimeout(
//         `${URL}/connections/professionals?${queryParams}`, 
//         {
//           headers: this.getAuthHeaders(),
//           // Add cache headers for static-ish data
//           cache: 'default'
//         }
//       );
      
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({ message: 'Network error' }));
//         throw new Error(error.message || `Server error: ${response.status}`);
//       }
      
//       return response.json();
//     } catch (error) {
//       console.error('Error fetching professionals:', error);
//       throw new Error(error.message || 'Failed to fetch professionals');
//     }
//   },

//   // Send connection request - OPTIMIZED
//   async sendConnectionRequest(recipientId, message = '') {
//     const URL = 'http://localhost:3000/api/v1';
    
//     if (!recipientId) {
//       throw new Error('Recipient ID is required');
//     }
    
//     try {
//       const response = await this.fetchWithTimeout(`${URL}/connections`, {
//         method: 'POST',
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify({
//           requester_id: this.getCurrentUserId(),
//           recipient_id: recipientId,
//           message: message || 'I would like to connect with you for professional networking.'
//         })
//       });
      
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({ message: 'Network error' }));
//         throw new Error(error.message || `Server error: ${response.status}`);
//       }
      
//       return response.json();
//     } catch (error) {
//       console.error('Error sending connection request:', error);
//       throw new Error(error.message || 'Failed to send connection request');
//     }
//   },

//   // Get user's connections - OPTIMIZED  
//   async getMyConnections() {
//     const URL = 'http://localhost:3000/api/v1';
    
//     try {
//       const response = await this.fetchWithTimeout(`${URL}/connections/my-connections`, {
//         headers: this.getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({ message: 'Network error' }));
//         throw new Error(error.message || `Server error: ${response.status}`);
//       }
      
//       return response.json();
//     } catch (error) {
//       console.error('Error fetching connections:', error);
//       throw new Error(error.message || 'Failed to fetch connections');
//     }
//   },

//   // Get pending connection requests - OPTIMIZED
//   async getPendingRequests() {
//     const URL = 'http://localhost:3000/api/v1';
    
//     try {
//       const response = await this.fetchWithTimeout(`${URL}/connections/requests`, {
//         headers: this.getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({ message: 'Network error' }));
//         throw new Error(error.message || `Server error: ${response.status}`);
//       }
      
//       return response.json();
//     } catch (error) {
//       console.error('Error fetching requests:', error);
//       throw new Error(error.message || 'Failed to fetch requests');
//     }
//   },

//   // Respond to connection request - OPTIMIZED
//   async respondToRequest(requestId, status, message = '') {
//     const URL = 'http://localhost:3000/api/v1';
    
//     // Validate inputs immediately
//     if (!requestId) {
//       throw new Error('Request ID is required');
//     }
    
//     const validStatuses = ['accepted', 'rejected'];
//     if (!validStatuses.includes(status)) {
//       throw new Error(`Invalid status: ${status}. Must be 'accepted' or 'rejected'`);
//     }

//     const requestBody = {
//       status: status,
//       ...(message && { message: message })
//     };

//     try {
//       const response = await this.fetchWithTimeout(`${URL}/connections/${requestId}/respond`, {
//         method: 'PUT',
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify(requestBody)
//       });

//       if (!response.ok) {
//         const error = await response.json().catch(() => ({ message: 'Network error' }));
//         throw new Error(error.message || error.error || `Server error: ${response.status}`);
//       }
      
//       return response.json();
//     } catch (error) {
//       console.error('Error responding to request:', error);
//       throw new Error(error.message || 'Failed to respond to request');
//     }
//   },

//   // Remove connection - OPTIMIZED
//   async removeConnection(connectionId) {
//     const URL = 'http://localhost:3000/api/v1';
    
//     if (!connectionId) {
//       throw new Error('Connection ID is required');
//     }
    
//     try {
//       const response = await this.fetchWithTimeout(`${URL}/connections/${connectionId}`, {
//         method: 'DELETE',
//         headers: this.getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({ message: 'Network error' }));
//         throw new Error(error.message || `Server error: ${response.status}`);
//       }
      
//       return response.json();
//     } catch (error) {
//       console.error('Error removing connection:', error);
//       throw new Error(error.message || 'Failed to remove connection');
//     }
//   },

//   // Get connection statistics - OPTIMIZED
//   async getConnectionStats() {
//     const URL = 'http://localhost:3000/api/v1';

//     try {
//       const response = await this.fetchWithTimeout(`${URL}/connections/stats`, {
//         headers: this.getAuthHeaders()
//       });
      
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({ message: 'Network error' }));
//         throw new Error(error.message || `Server error: ${response.status}`);
//       }
      
//       return response.json();
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       throw new Error(error.message || 'Failed to fetch stats');
//     }
//   },

//   // Get current user ID - OPTIMIZED with better error handling
//   getCurrentUserId() {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }
      
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       const userId = payload.id || payload.userId || payload.user_id;
      
//       if (!userId) {
//         throw new Error('User ID not found in token');
//       }
      
//       return userId;
//     } catch (error) {
//       console.error('Error parsing token:', error);
//       // Redirect to login or handle authentication error
//       return null;
//     }
//   },

//   // Batch API calls for initial data loading - NEW
//   async loadInitialData(searchParams = {}) {
//     try {
//       // Load all required data in parallel
//       const [professionalsData, connectionsData, requestsData, statsData] = await Promise.all([
//         this.getProfessionals(searchParams).catch(err => {
//           console.error('Failed to load professionals:', err);
//           return { professionals: [], totalPages: 1 };
//         }),
//         this.getMyConnections().catch(err => {
//           console.error('Failed to load connections:', err);
//           return [];
//         }),
//         this.getPendingRequests().catch(err => {
//           console.error('Failed to load requests:', err);
//           return [];
//         }),
//         this.getConnectionStats().catch(err => {
//           console.error('Failed to load stats:', err);
//           return { totalConnections: 0, pendingRequests: 0, sentRequests: 0 };
//         })
//       ]);

//       return {
//         professionals: professionalsData,
//         connections: connectionsData,
//         requests: requestsData,
//         stats: statsData
//       };
//     } catch (error) {
//       console.error('Error loading initial data:', error);
//       throw new Error('Failed to load dashboard data');
//     }
//   }
// };