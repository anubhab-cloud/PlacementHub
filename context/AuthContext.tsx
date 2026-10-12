'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  name: string;
  email: string;
  avatar: string;
  role?: string;
  targetCompany?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isModalOpen: boolean;
  modalMode: 'login' | 'signup';
  login: (email: string, name?: string) => void;
  loginWithProvider: (provider: 'google' | 'github', customName?: string, customEmail?: string) => void;
  logout: () => void;
  openLoginModal: (mode?: 'login' | 'signup') => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function formatNameFromEmail(email: string): string {
  if (!email) return 'Student';
  const prefix = email.split('@')[0] || 'Student';
  const parts = prefix.split(/[._\-+]+/).filter(Boolean);
  if (parts.length === 0) return 'Student';
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'ST';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Check localStorage for saved session
    const savedUser = localStorage.getItem('placementhub_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.name && parsed.email) {
          setUser(parsed);
          setIsLoggedIn(true);
          return;
        }
      } catch (e) {
        setUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  const login = (email: string, name?: string) => {
    const cleanEmail = (email || '').trim();
    let accounts: Record<string, { name: string; email: string }> = {};
    try {
      const stored = localStorage.getItem('placementhub_accounts');
      if (stored) accounts = JSON.parse(stored);
    } catch (e) {}

    let userName = name?.trim();
    if (userName) {
      // Save to registered accounts cache
      accounts[cleanEmail.toLowerCase()] = { name: userName, email: cleanEmail };
      try {
        localStorage.setItem('placementhub_accounts', JSON.stringify(accounts));
      } catch (e) {}
    } else {
      if (accounts[cleanEmail.toLowerCase()]?.name) {
        userName = accounts[cleanEmail.toLowerCase()].name;
      } else {
        userName = formatNameFromEmail(cleanEmail);
      }
    }

    const initials = getInitials(userName);

    const newUser: User = {
      name: userName,
      email: cleanEmail,
      avatar: initials,
      role: 'SDE Aspirant',
      targetCompany: 'Google / Meta',
    };

    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('placementhub_user', JSON.stringify(newUser));
    setIsModalOpen(false);
  };

  const loginWithProvider = (provider: 'google' | 'github', customName?: string, customEmail?: string) => {
    let name = customName?.trim();
    let email = customEmail?.trim();

    if (!name && !email) {
      if (provider === 'google') {
        name = 'Google Student';
        email = 'student@google.com';
      } else {
        name = 'GitHub Developer';
        email = 'developer@github.com';
      }
    } else if (!name && email) {
      name = formatNameFromEmail(email);
    } else if (name && !email) {
      email = `${name.toLowerCase().replace(/\s+/g, '')}@${provider}.com`;
    }

    login(email || `${provider}-user@nexusprep.io`, name);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('placementhub_user');
  };

  const openLoginModal = (mode: 'login' | 'signup' = 'login') => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isModalOpen,
        modalMode,
        login,
        loginWithProvider,
        logout,
        openLoginModal,
        closeLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
