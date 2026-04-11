import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getToken = () => localStorage.getItem('flora_token');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('flora_user');
      const token = getToken();
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error("Auth initialization failed:", err);
      localStorage.removeItem('flora_user');
      localStorage.removeItem('flora_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password) => {
    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) return { success: true, needsVerification: true };
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Connection failure' };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('flora_user', JSON.stringify(data.user));
        localStorage.setItem('flora_token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Connection failure' };
    }
  };

  const updateProfile = async (name, email) => {
    try {
      const res = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('flora_user', JSON.stringify(data));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch(API_ENDPOINTS.PASSWORD, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      return { success: res.ok, error: data.error };
    } catch {
      return { success: false, error: 'Failed to update password' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      return { success: res.ok, error: data.error };
    } catch {
      return { success: false, error: 'Reset failed. Connection error' };
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const res = await fetch(API_ENDPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('flora_user', JSON.stringify(data.user));
        localStorage.setItem('flora_token', data.token);
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      return { success: false, error: 'Verification failed. Connection error' };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await res.json();
      return { success: res.ok, error: data.error };
    } catch {
      return { success: false, error: 'Reset failed. Connection error' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('flora_user');
    localStorage.removeItem('flora_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, changePassword, forgotPassword, verifyEmail, resetPassword, loading, setLoading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
