'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Topbar() {
  const [query, setQuery] = useState('');
  const pathname = usePathname();
  const { user, isLoggedIn, logout, openLoginModal } = useAuth();

  const getTitle = () => {
    switch (pathname) {
      case '/workspace': return 'Code Workspace';
      case '/uni-hub':   return 'Uni Hub';
      case '/placement': return 'Placement';
      case '/portfolio': return 'Portfolio';
      case '/library':   return 'Library';
      case '/settings':  return 'Settings';
      case '/ai':        return 'AI Assistant';
      default:           return 'Dashboard';
    }
  };

  return (
    <header className="topbar-container">
      {/* Window Top Title Strip */}
      <div className="topbar-window-frame">
        <div className="window-frame-left">
          <span className="window-frame-title">PlacementHub Dashboard</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div className="window-frame-right">
          <button className="frame-btn-chat">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Chat
          </button>
          <button className="frame-btn-icon" title="Expand">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
          <button className="frame-btn-icon" title="Search">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <button className="frame-btn-icon frame-close-btn" title="Close">
            ✕
          </button>
        </div>
      </div>

      {/* Main Topbar Row */}
      <div className="topbar-main">
        <div className="topbar-title-section">
          <h1 className="topbar-page-title">{getTitle()}</h1>
          <div className="live-sync-pill">
            <span className="live-sync-dot" />
            Live sync
          </div>
        </div>

        {/* Center Search Input */}
        <div className="topbar-search-bar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search topics, notes, companies"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Right GitHub Synced Badge & User Profile */}
        <div className="topbar-actions-right">
          <div className="github-synced-pill">
            GitHub synced
          </div>
        </div>
      </div>
    </header>
  );
}
