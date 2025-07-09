const API_BASE_URL = 'http://localhost:3000/api/v1';
const API_ENDPOINTS = {
  progress: `${API_BASE_URL}/progress_tracking`,
  progressById: (id) => `${API_BASE_URL}/progress_tracking/${id}`,
  users: `${API_BASE_URL}/users`,
  courses: `${API_BASE_URL}/training_courses`,
  auth: `${API_BASE_URL}/auth/login`,
  refresh: `${API_BASE_URL}/auth/refresh`
};

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

  fetchProgressEntries: async () => {
    console.log('📊 Fetching progress entries...');
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.progress, 
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
      console.log('✅ Progress entries fetched successfully:', data);
      
      // Transform the data to match your component's expected format
      const transformedData = await Promise.all(data.map(async (entry) => {
        console.log(`🔄 Processing entry ${entry.id}...`);
        
        // Fetch user information
        let userInfo = { name: 'Unknown User', email: 'N/A' };
        if (entry.user_id) {
          try {
            const userResponse = await apiService.fetchWithRetry(
              `${API_ENDPOINTS.users}/${entry.user_id}`, 
              {
                headers: apiService.getHeaders()
              }
            );
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              userInfo = {
                name: userData.firstName +' '+ userData.lastName  || userData.lastName || 'Unknown User',
                email: userData.email || 'N/A'
              };
              console.log(`✅ User info fetched for user ${entry.user_id}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to fetch user info for user_id: ${entry.user_id}`, error);
          }
        }

        // Fetch course information
        let courseInfo = { title: 'Unknown Course', type: 'N/A' };
        if (entry.training_course_id) {
          try {
            const courseResponse = await apiService.fetchWithRetry(
              `${API_ENDPOINTS.courses}/${entry.training_course_id}`, 
              {
                headers: apiService.getHeaders()
              }
            );
            
            if (courseResponse.ok) {
              const courseData = await courseResponse.json();
              courseInfo = {
                title: courseData.title || courseData.instructor_name || 'Unknown Course',
                type: courseData.course_type || courseData.category || 'N/A'
              };
              console.log(`✅ Course info fetched for course ${entry.training_course_id}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to fetch course info for training_course_id: ${entry.training_course_id}`, error);
          }
        }

        return {
          ...entry,
          user_info: userInfo,
          course_info: courseInfo
        };
      }));
      
      console.log('✅ Data transformation completed');
      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching progress entries:', error);
      throw error;
    }
  },

  deleteProgressEntry: async (id) => {
    console.log(`🗑️ Deleting progress entry: ${id}`);
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.progressById(id), 
        {
          method: 'DELETE',
          headers: apiService.getHeaders()
        }
      );
      
      console.log('✅ Progress entry deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting progress entry:', error);
      throw error;
    }
  },

  createProgressEntry: async (progressData) => {
    console.log('➕ Creating progress entry:', progressData);
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.progress, 
        {
          method: 'POST',
          headers: apiService.getHeaders(),
          body: JSON.stringify(progressData)
        }
      );
      
      const result = await response.json();
      console.log('✅ Progress entry created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating progress entry:', error);
      throw error;
    }
  },

  updateProgressEntry: async (id, progressData) => {
    console.log(`📝 Updating progress entry ${id}:`, progressData);
    
    try {
      const response = await apiService.fetchWithRetry(
        API_ENDPOINTS.progressById(id), 
        {
          method: 'PUT',
          headers: apiService.getHeaders(),
          body: JSON.stringify(progressData)
        }
      );
      
      const result = await response.json();
      console.log('✅ Progress entry updated successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error updating progress entry:', error);
      throw error;
    }
  }
};
