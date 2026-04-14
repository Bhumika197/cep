import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Start with no user
  const [loading, setLoading] = useState(false);

  const login = async (userData) => {
    try {
      // Call working server API
      const response = await axios.post('http://localhost:5002/api/auth/login', {
        phoneNumber: userData.phoneNumber,
        name: userData.name
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      if (response.data.success) {
        setCurrentUser({
          ...response.data.data.user,
          isNewUser: response.data.data.isNewUser,
          message: response.data.data.message
        });
        return response.data.data;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Auth API Error:', error);
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK_ERROR') {
        throw new Error('Network error - Please check if server is running');
      }
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
