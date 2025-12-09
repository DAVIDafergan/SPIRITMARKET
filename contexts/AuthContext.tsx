
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { Api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize: Check if user data exists in local storage (basic persistence)
  // In a real app, you would validate the token with /me endpoint on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch(e) {
            localStorage.removeItem('user_data');
        }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await Api.login(email, password);
      
      // Save Token and User Data
      if (loggedUser.token) {
        localStorage.setItem('auth_token', loggedUser.token);
      }
      localStorage.setItem('user_data', JSON.stringify(loggedUser));
      
      setUser(loggedUser);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await Api.register(userData);
      
      if (newUser.token) {
        localStorage.setItem('auth_token', newUser.token);
      }
      localStorage.setItem('user_data', JSON.stringify(newUser));

      setUser(newUser);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>
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
