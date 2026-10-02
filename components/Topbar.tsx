'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Topbar() {
  const [query, setQuery] = useState('');
  const pathname = usePathname();
  const { user } = useAuth();

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
    <header className="topbar-clean-container">
      <div className="topbar-main-row">
        <div className="topbar-title-group">
          <h1 className="topbar-page-title">{getTitle()}</h1>
          <div className="live-sync-pill">
            <span className="live-sync-dot" />
            Live sync
          </div>
        </div>

        {/* Center Search Input */}
        <div className="topbar-search-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search topics, notes, companies"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Right GitHub Synced Badge */}
        <div className="topbar-right-badge">
          GitHub synced
        </div>
      </div>
    </header>
  );
}

