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
  loginWithProvider: (provider: 'google' | 'github') => void;
  logout: () => void;
  openLoginModal: (mode?: 'login' | 'signup') => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
        setUser(parsed);
        setIsLoggedIn(true);
      } catch (e) {
        // Fallback default user
        setUser({ name: 'Anubhab C.', email: 'anubhab@nexusprep.io', avatar: 'AC' });
        setIsLoggedIn(true);
      }
    } else {
      // Default to logged in as Anubhab for instant preview, but allow user to log out / in
      setUser({ name: 'Anubhab C.', email: 'anubhab@nexusprep.io', avatar: 'AC' });
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string, name?: string) => {
    const userName = name || email.split('@')[0] || 'Anubhab C.';
    const initials = userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AC';

    const newUser: User = {
      name: userName,
      email: email || 'anubhab@nexusprep.io',
      avatar: initials,
      role: 'SDE Aspirant',
      targetCompany: 'Google / Meta',
    };

    setUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('placementhub_user', JSON.stringify(newUser));
    setIsModalOpen(false);
  };

  const loginWithProvider = (provider: 'google' | 'github') => {
    const name = provider === 'google' ? 'Anubhab Chakraborty' : 'anubhab-cloud';
    const email = provider === 'google' ? 'anubhab.chakraborty@gmail.com' : 'anubhab.github@dev.io';
    login(email, name);
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
