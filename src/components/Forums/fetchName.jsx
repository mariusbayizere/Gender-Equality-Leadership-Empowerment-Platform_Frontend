import React, { useState, useEffect } from 'react';



 export const fetchUsersByIds = async (userIds) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      
      // Method 1: Try bulk fetch if your API supports it
      const bulkResponse = await fetch('http://localhost:3000/api/v1/users/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ userIds })
      });

      if (bulkResponse.ok) {
        const userData = await bulkResponse.json();
        return userData;
      }

      // Method 2: If bulk fetch fails, try individual requests
      console.log('Bulk fetch failed, trying individual requests...');
      const userPromises = userIds.map(async (userId) => {
        try {
          const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` })
            }
          });
          
          if (response.ok) {
            const user = await response.json();
            return user;
          }
          return null;
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
          return null;
        }
      });

      const users = await Promise.all(userPromises);
      return users.filter(user => user !== null);

    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Method 3: Try alternative endpoint structure
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:3000/api/v1/users', {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });

        if (response.ok) {
          const allUsers = await response.json();
          // Filter to only return users with matching IDs
          const usersArray = Array.isArray(allUsers) ? allUsers : (allUsers.users || allUsers.data || []);
          return usersArray.filter(user => userIds.includes(user.id || user.user_id || user.userId));
        }
      } catch (fallbackError) {
        console.error('Fallback user fetch failed:', fallbackError);
      }
      
      return [];
    }
  };



// Replace your existing fetchForums function with this:
 export  const fetchForums = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/api/v1/forums', {
        headers: { 
          'Content-Type': 'application/json', 
          ...(token && { Authorization: `Bearer ${token}` }) 
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch forum posts');
      
      const data = await res.json();
      const forumsArray = Array.isArray(data) ? data : (data.forums || data.data || []);
      setForums(forumsArray);
      
      // Extract unique user IDs from forums
      const userIds = [];
      forumsArray.forEach(forum => {
        const userId = forum.user_id || forum.userId || forum.author_id;
        if (userId && !userIds.includes(userId)) {
          userIds.push(userId);
        }
      });
      
      console.log('Extracted user IDs:', userIds);
      
      // Fetch user data for all unique IDs
      if (userIds.length > 0) {
        try {
          const userData = await fetchUsersByIds(userIds);
          console.log('Raw user data response:', userData);
          
          // Handle different response formats
          let userArray = [];
          if (Array.isArray(userData)) {
            userArray = userData;
          } else if (userData && typeof userData === 'object') {
            userArray = userData.users || userData.data || Object.values(userData);
          }
          
          console.log('Processed user array:', userArray);
          setUsersData(userArray);
          
          if (userArray.length === 0) {
            console.warn('No user data was loaded. Check your API endpoints.');
          }
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
          setUsersData([]);
        }
      } else {
        console.warn('No user IDs found in forums data');
        setUsersData([]);
      }
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError(err.message || 'Failed to load forum posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchForums(); 
  }, []);

  // Enhanced getUserName function with better debugging
 export  const getUserName = (userId) => {
    console.log("Looking for user with ID:", userId);
    console.log("Available users data:", usersData);
    console.log("Users data length:", usersData.length);
    
    if (!userId) {
      console.log("No user ID provided");
      return 'Unknown User';
    }
    
    if (!Array.isArray(usersData)) {
      console.error("usersData is not an array:", usersData);
      return 'Unknown User';
    }
    
    if (usersData.length === 0) {
      console.warn("usersData array is empty");
      return 'Loading...';
    }
    
    // Log the structure of the first user for debugging
    if (usersData.length > 0) {
      console.log("First user structure:", usersData[0]);
    }
    
    const user = usersData.find(user => {
      // Try different possible ID formats
      const matches = user.id === userId || 
                     user.user_id === userId || 
                     user.userId === userId ||
                     user._id === userId;
      
      if (matches) {
        console.log("Found matching user:", user);
      }
      return matches;
    });
    
    console.log("Found user:", user);
    
    if (user) {
      // Try different possible name formats
      const firstName = user.firstName || user.first_name || user.fname || '';
      const lastName = user.lastName || user.last_name || user.lname || '';
      const fullName = user.name || user.fullName || user.full_name || '';
      const username = user.username || user.userName || '';
      const email = user.email || '';
      
      console.log("User name fields:", { firstName, lastName, fullName, username, email });
      
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      } else if (firstName) {
        return firstName;
      } else if (fullName) {
        return fullName;
      } else if (username) {
        return username;
      } else if (email) {
        return email.split('@')[0]; // Use email prefix if no name
      }
    }
    
    return 'Unknown User';
  };