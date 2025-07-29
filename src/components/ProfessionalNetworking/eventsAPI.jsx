
// API service for events
export const eventsAPI = {
  baseURL: 'http://localhost:3000/api/v1/events',
  
  // Get authentication token from localStorage or context
  getAuthToken: () => {
    return localStorage.getItem('authToken') || '';
  },
  
  // Get all events
  getAllEvents: async () => {
    try {
      const response = await fetch(`${eventsAPI.baseURL}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },
  
  // Register for an event
  registerForEvent: async (eventId) => {
    try {
      const token = eventsAPI.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${eventsAPI.baseURL}/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  },
  
  // Unregister from an event
  unregisterFromEvent: async (eventId) => {
    try {
      const token = eventsAPI.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${eventsAPI.baseURL}/${eventId}/unregister`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error unregistering from event:', error);
      throw error;
    }
  },
  
  // Search events
  searchEvents: async (query) => {
    try {
      const response = await fetch(`${eventsAPI.baseURL}/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  },
  
  // Create new event (admin only)
  createEvent: async (eventData) => {
    try {
      const response = await fetch(`${eventsAPI.baseURL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${eventsAPI.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Get current user info from token
  getCurrentUser: async () => {
    try {
      const token = eventsAPI.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${eventsAPI.baseURL.replace('/events', '/users/me')}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
};