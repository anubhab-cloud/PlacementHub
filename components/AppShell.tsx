'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import FloatingChatbot from '@/components/FloatingChatbot';
import LandingPage from '@/components/LandingPage';
import LoginModal from '@/components/LoginModal';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHomePage = pathname === '/';

  // If user is on the root home page "/" and is not logged in after mounting, show Landing Page
  if (mounted && isHomePage && !isLoggedIn) {
    return (
      <div suppressHydrationWarning>
        <LandingPage />
        <LoginModal />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning>
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <main className="page-content">{children}</main>
        </div>
      </div>
      <FloatingChatbot />
      <LoginModal />
    </div>
  );
}
