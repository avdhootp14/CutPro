"use client";
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt?: string;
  shopName?: string;
  shopLogo?: string;
  country?: string;
  state?: string;
  district?: string;
  city?: string;
  address?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Setup Axios defaults
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  
  // Dynamic fallback for local network testing (e.g. mobile devices)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    apiUrl = `http://${window.location.hostname}:5000/api/v1`;
  }
  
  axios.defaults.baseURL = apiUrl;
  axios.defaults.withCredentials = true;

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/auth/current-user');
        setUser(res.data?.data || res.data?.user || res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await axios.post('/auth/login', { email, password });
    const userData = res.data?.data?.user || res.data?.user || res.data;
    setUser(userData);
    return userData;
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post('/auth/logout');
    } catch { /* ignore */ }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
