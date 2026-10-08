import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`);
      setUser(res.data);
    } catch (error) {
      console.error('Failed to fetch user profile');
      logout();
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, { email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, { name, email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
  };

  const updateProfile = async (userData) => {
    const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, userData);
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const sendOtp = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/send-otp`, { email, password });
    if (res.data.requireOtp === false && res.data.token) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data);
    }
    return res.data;
  };

  const verifyOtp = async (email, password, otp) => {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`, { email, password, otp });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, sendOtp, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
};
