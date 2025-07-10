
// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';
const API_ENDPOINTS = {
  connections: `${API_BASE_URL}/connections`,
  allConnections: `${API_BASE_URL}/connections/all`,
  connectionById: (id) => `${API_BASE_URL}/connections/${id}`,
  users: `${API_BASE_URL}/users`,
  auth: `${API_BASE_URL}/auth/login`,
  refresh: `${API_BASE_URL}/auth/refresh`
};

// Connection statuses
export const CONNECTION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  BLOCKED: 'blocked'
};

// Enhanced API Service with comprehensive auth handling
export const apiService = {
  // Enhanced token retrieval with debugging
  getAuthToken: () => {
    console.log('🔍 Searching for authentication token...');
    
    if (typeof window !== 'undefined') {
      const tokenKeys = ['authToken', 'token', 'accessToken', 'jwt', 'bearerToken', 'access_token'];
      
      for (const key of tokenKeys) {
        const storedToken = localStorage.getItem(key);
        if (storedToken) {
          console.log(`✅ Found token in localStorage with key: ${key}`);
          console.log(`📄 Token preview: ${storedToken.substring(0, 20)}...`);
          
          // Check if token looks valid (basic validation)
          try {
            const tokenParts = storedToken.split('.');
            if (tokenParts.length === 3) {
              // JWT token structure
              const payload = JSON.parse(atob(tokenParts[1]));
              console.log('🔍 Token payload:', payload);
              
              // Check expiration
              if (payload.exp) {
                const currentTime = Math.floor(Date.now() / 1000);
                const isExpired = payload.exp < currentTime;
                console.log(`⏰ Token expires at: ${new Date(payload.exp * 1000)}`);
                console.log(`⏰ Current time: ${new Date()}`);
                console.log(`${isExpired ? '❌' : '✅'} Token expired: ${isExpired}`);
                
                if (isExpired) {
                  console.log('🗑️ Removing expired token from localStorage');
                  localStorage.removeItem(key);
                  continue;
                }
              }
            }
          } catch (e) {
            console.log('⚠️ Token is not a valid JWT, but will try to use it anyway');
          }
          
          return storedToken;
        }
      }
      
      console.log('❌ No authentication token found in localStorage');
      console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
    }
    
    return null;
  },

  // Enhanced headers with debugging
  getHeaders: () => {
    const token = apiService.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Added Authorization header to request');
    } else {
      console.log('⚠️ No token available - making request without Authorization header');
    }
    
    console.log('📋 Request headers:', headers);
    return headers;
  },

  // Enhanced error handling
  handleApiError: async (response, operation = 'API call') => {
    console.log(`❌ ${operation} failed with status: ${response.status}`);
    
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        console.log('📄 Error response data:', errorData);
        errorMessage += ` - ${JSON.stringify(errorData)}`;
        
        // Handle specific auth errors
        if (response.status === 401) {
          console.log('🔐 Authentication error detected');
          if (errorData.error && errorData.error.includes('expired')) {
            console.log('⏰ Token expired - clearing localStorage');
            apiService.clearAuthTokens();
          }
        }
      } else {
        const errorText = await response.text();
        console.log('📄 Error response text:', errorText);
        errorMessage += ` - ${errorText}`;
      }
    } catch (e) {
      console.log('⚠️ Could not parse error response:', e);
    }
    
    throw new Error(errorMessage);
  },

  // Clear all possible auth tokens
  clearAuthTokens: () => {
    console.log('🗑️ Clearing all authentication tokens...');
    const tokenKeys = ['authToken', 'token', 'accessToken', 'jwt', 'bearerToken', 'access_token'];
    
    tokenKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`🗑️ Removing token: ${key}`);
        localStorage.removeItem(key);
      }
    });
  },

  // Test API connection
  testConnection: async () => {
    console.log('🔍 Testing API connection...');
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(`📡 API connection test: ${response.status}`);
      return response.ok;
    } catch (error) {
      console.log('❌ API connection failed:', error);
      return false;
    }
  },

  // Enhanced fetch with retry logic
  fetchWithRetry: async (url, options, retries = 1) => {
    console.log(`📡 Making request to: ${url}`);
    console.log(`⚙️ Request options:`, options);
    
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, options);
        console.log(`📡 Response status: ${response.status}`);
        
        if (!response.ok) {
          await apiService.handleApiError(response, `Request to ${url}`);
        }
        
        return response;
      } catch (error) {
        console.log(`❌ Request attempt ${i + 1} failed:`, error);
        
        if (i === retries) {
          throw error;
        }
        
        console.log(`🔄 Retrying in 1 second... (${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  },

  fetchConnections: async () => {
    console.log('📊 Fetching connections...');
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.allConnections, 
        {
          method: 'GET',
          headers: apiService.getHeaders()
        }
      );
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.log('⚠️ Server returned non-JSON response:', responseText);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('✅ Connections fetched successfully:', data);
      
      // Transform the data to match your component's expected format
      const transformedData = await Promise.all(data.map(async (connection) => {
        console.log(`🔄 Processing connection ${connection.id}...`);
        
        // Fetch requester information
        let requesterInfo = { name: 'Unknown User', email: 'N/A' };
        if (connection.requester_id) {
          try {
            const userResponse = await apiService.fetchWithRetry(
              `${API_ENDPOINTS.users}/${connection.requester_id}`, 
              {
                headers: apiService.getHeaders()
              }
            );
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              requesterInfo = {
                name: userData.firstName + ' ' + userData.lastName || userData.lastName || 'Unknown User',
                email: userData.email || 'N/A'
              };
              console.log(`✅ Requester info fetched for user ${connection.requester_id}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to fetch requester info for user_id: ${connection.requester_id}`, error);
          }
        }

        // Fetch recipient information
        let recipientInfo = { name: 'Unknown User', email: 'N/A' };
        if (connection.recipient_id) {
          try {
            const userResponse = await apiService.fetchWithRetry(
              `${API_ENDPOINTS.users}/${connection.recipient_id}`, 
              {
                headers: apiService.getHeaders()
              }
            );
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              recipientInfo = {
                name: userData.firstName + ' ' + userData.lastName || userData.lastName || 'Unknown User',
                email: userData.email || 'N/A'
              };
              console.log(`✅ Recipient info fetched for user ${connection.recipient_id}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to fetch recipient info for user_id: ${connection.recipient_id}`, error);
          }
        }

        return {
          ...connection,
          requester_info: requesterInfo,
          recipient_info: recipientInfo,
          created_at: connection.created_at || new Date().toISOString()
        };
      }));
      
      console.log('✅ Data transformation completed');
      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching connections:', error);
      throw error;
    }
  },

  deleteConnection: async (id) => {
    console.log(`🗑️ Deleting connection: ${id}`);
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.connectionById(id), 
        {
          method: 'DELETE',
          headers: apiService.getHeaders()
        }
      );
      
      console.log('✅ Connection deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting connection:', error);
      throw error;
    }
  }
};