import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User, LoginData, RegisterData, AuthResponse } from '../types';
import { API_URL } from '../config';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCompany: boolean;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    setError(null);
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('Login failed. Please try again.');
      }
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    setError(null);
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else {
        setError('Registration failed. Please try again.');
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isCompany = user?.role === 'company';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isCompany,
        loading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};