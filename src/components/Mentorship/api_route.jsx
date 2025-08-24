
// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api/v1';
export const API_ENDPOINTS = {
  mentorship: `${API_BASE_URL}/mentorshipsecond`,
  mentorshipById: (id) => `${API_BASE_URL}/mentorshipsecond/${id}`,
  users: `${API_BASE_URL}/users`,
  auth: `${API_BASE_URL}/auth/login`,
  refresh: `${API_BASE_URL}/auth/refresh`
};

// Enhanced API Service functions
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

  fetchMentorshipRelationships: async () => {
    console.log('🤝 Fetching mentorship relationships...');
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.mentorship, 
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
      console.log('✅ Mentorship relationships fetched successfully:', data);
      
      // Transform the data to match your component's expected format
      const transformedData = await Promise.all(data.map(async (relationship) => {
        console.log(`🔄 Processing relationship ${relationship.id}...`);
        
        // Fetch mentor information
        let mentorInfo = { name: 'Unknown Mentor', email: 'N/A', expertise: 'N/A' };
        if (relationship.mentor_id) {
          try {
            const mentorResponse = await apiService.fetchWithRetry(
              `${API_ENDPOINTS.users}/${relationship.mentor_id}`, 
              {
                headers: apiService.getHeaders()
              }
            );
            
            if (mentorResponse.ok) {
              const mentorData = await mentorResponse.json();
              mentorInfo = {
                name: `${mentorData.firstName || ''} ${mentorData.lastName || ''}`.trim() || 'Unknown Mentor',
                email: mentorData.email || 'N/A',
                expertise: mentorData.expertise || mentorData.skills || 'N/A'
              };
              console.log(`✅ Mentor info fetched for mentor ${relationship.mentor_id}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to fetch mentor info for mentor_id: ${relationship.mentor_id}`, error);
          }
        }

        // Fetch mentee information
        let menteeInfo = { name: 'Unknown Mentee', email: 'N/A', level: 'N/A' };
        if (relationship.mentee_id) {
          try {
            const menteeResponse = await apiService.fetchWithRetry(
              `${API_ENDPOINTS.users}/${relationship.mentee_id}`, 
              {
                headers: apiService.getHeaders()
              }
            );
            
            if (menteeResponse.ok) {
              const menteeData = await menteeResponse.json();
              menteeInfo = {
                name: `${menteeData.firstName || ''} ${menteeData.lastName || ''}`.trim() || 'Unknown Mentee',
                email: menteeData.email || 'N/A',
                level: menteeData.level || menteeData.experience_level || 'N/A'
              };
              console.log(`✅ Mentee info fetched for mentee ${relationship.mentee_id}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to fetch mentee info for mentee_id: ${relationship.mentee_id}`, error);
          }
        }

        return {
          ...relationship,
          mentor_info: mentorInfo,
          mentee_info: menteeInfo
        };
      }));
      
      console.log('✅ Data transformation completed');
      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching mentorship relationships:', error);
      throw error;
    }
  },

  deleteMentorshipRelationship: async (id) => {
    console.log(`🗑️ Deleting mentorship relationship: ${id}`);
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.mentorshipById(id), 
        {
          method: 'DELETE',
          headers: apiService.getHeaders()
        }
      );
      
      console.log('✅ Mentorship relationship deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting mentorship relationship:', error);
      throw error;
    }
  },

  createMentorshipRelationship: async (relationshipData) => {
    console.log('➕ Creating mentorship relationship:', relationshipData);
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.mentorship, 
        {
          method: 'POST',
          headers: apiService.getHeaders(),
          body: JSON.stringify(relationshipData)
        }
      );
      
      const result = await response.json();
      console.log('✅ Mentorship relationship created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating mentorship relationship:', error);
      throw error;
    }
  },

  updateMentorshipRelationship: async (id, relationshipData) => {
    console.log(`📝 Updating mentorship relationship ${id}:`, relationshipData);
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.mentorshipById(id), 
        {
          method: 'PUT',
          headers: apiService.getHeaders(),
          body: JSON.stringify(relationshipData)
        }
      );
      
      const result = await response.json();
      console.log('✅ Mentorship relationship updated successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error updating mentorship relationship:', error);
      throw error;
    }
  }
};
