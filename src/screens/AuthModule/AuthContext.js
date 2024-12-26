import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMethod } from '../../helpers'; // Adjust the import path as needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      console.log('Token found in storage:', token);
      if (token) {
        await fetchUserDetails(token);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDetails = async (token) => {
    try {
      const response = await getMethod({
        url: 'customers/secure/profile',
        token: token
      });

      console.log('User details response:', response);

      if (response.success && response.data && response.data.customer) {
        setUser(response.data.customer);
        setIsLoggedIn(true);
        console.log('User details fetched and set successfully');
      } else {
        console.error('Failed to fetch user details:', response.error || 'Unknown error');
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const login = async (userData) => {
    try {
      if (!userData || !userData.token) {
        console.error('Login failed: No token provided');
        throw new Error('No token provided');
      }
      await AsyncStorage.setItem('@token', userData.token);
      await AsyncStorage.setItem('@user', JSON.stringify(userData.user));
      setIsLoggedIn(true);
      setUser(userData.user);
      console.log('Login successful, isLoggedIn set to true');
      console.log('User data set:', userData.user);
      
      // Fetch user details immediately after login
      await fetchUserDetails(userData.token);
    } catch (error) {
      console.error('Error during login:', error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@token');
      setIsLoggedIn(false);
      setUser(null);
      console.log('Logout successful, isLoggedIn set to false');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  console.log('Current user state:', user);
  console.log('Current isLoggedIn state:', isLoggedIn);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isLoggedIn, checkUserSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
