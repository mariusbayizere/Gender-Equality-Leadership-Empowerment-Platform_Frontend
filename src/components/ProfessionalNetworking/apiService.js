

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