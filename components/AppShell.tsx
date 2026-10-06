'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import FloatingChatbot from '@/components/FloatingChatbot';
import LandingPage from '@/components/LandingPage';
import SiteFooter from '@/components/SiteFooter';
import LoginModal from '@/components/LoginModal';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    setMounted(true);
    setIsDarkTheme(window.localStorage.getItem('placementhub-theme') !== 'light');
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((current) => {
      const nextIsDark = !current;
      window.localStorage.setItem('placementhub-theme', nextIsDark ? 'dark' : 'light');
      return nextIsDark;
    });
  };

  const themeClass = isDarkTheme ? 'dark-theme' : 'light-theme';

  const isHomePage = pathname === '/';

  // If user is on the root home page "/" and is not logged in after mounting, show Landing Page
  if (mounted && isHomePage && !isLoggedIn) {
    return (
      <div className={`playful-landing-theme ${themeClass}`} suppressHydrationWarning>
        <LandingPage isDarkTheme={isDarkTheme} onToggleTheme={toggleTheme} />
        <SiteFooter />
        <LoginModal />
      </div>
    );
  }

  return (
    <div className={`playful-theme ${themeClass}`} suppressHydrationWarning>
      <div className={`app-shell playful-theme ${themeClass}${pathname.startsWith('/companies') ? ' directory-theme' : ''}`}>
        <Sidebar />
        <div className="main-content">
          <Topbar isDarkTheme={isDarkTheme} onToggleTheme={toggleTheme} />
          <main className="page-content">{children}</main>
          <SiteFooter />
        </div>
      </div>
      <FloatingChatbot />
      <LoginModal />
    </div>
  );
}
