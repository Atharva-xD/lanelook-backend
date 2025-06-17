import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Restoring user from storage:', parsedUser);
        setUser(parsedUser);
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('AuthContext login called with:', JSON.stringify(userData, null, 2));
    if (!userData || !userData.token) {
      console.error('Invalid user data received:', userData);
      return;
    }

    // Ensure all required fields are present
    const userToStore = {
      _id: userData._id,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      token: userData.token
    };

    console.log('Storing user data:', JSON.stringify(userToStore, null, 2));
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('token', userData.token);
    // Set default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    console.log('Logging out user:', user);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 