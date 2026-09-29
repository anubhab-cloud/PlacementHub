'use client';

import React from 'react';
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

  // If user is on the root home page "/" and is not logged in, show the public Landing Page
  const isHomePage = pathname === '/';
  const showLanding = isHomePage && !isLoggedIn;

  if (showLanding) {
    return (
      <>
        <LandingPage />
        <LoginModal />
      </>
    );
  }

  return (
    <>
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <Topbar />
          <main className="page-content">{children}</main>
        </div>
      </div>
      <FloatingChatbot />
      <LoginModal />
    </>
  );
}
