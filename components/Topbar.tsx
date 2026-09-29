'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, { title: string; meta: string }> = {
  '/':          { title: 'Dashboard',       meta: '6 widgets · Updated just now' },
  '/workspace': { title: 'Code Workspace',  meta: '3 active problems' },
  '/uni-hub':   { title: 'Uni Hub',         meta: 'Resources & notes' },
  '/placement': { title: 'Placement',       meta: 'Application tracker' },
  '/portfolio': { title: 'My Portfolio',    meta: 'Live · anubhab.dev' },
  '/settings':  { title: 'Settings',        meta: 'Account & preferences' },
  '/ai':        { title: 'AI Assistant',    meta: 'Gemini 1.5 Flash' },
  '/library':   { title: 'Digital Library', meta: '4 active rooms · Study together' },
};

export default function Topbar() {
  const [query, setQuery] = useState('');
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: 'PlacementHub', meta: '' };

  return (
    <header className="topbar">
      {/* Page title + live badge */}
      <span className="topbar-title">{page.title}</span>
      <div className="topbar-live-badge">
        <span className="topbar-live-dot" />
        Live sync
      </div>

      <span className="topbar-divider" />
      <span className="topbar-meta">{page.meta}</span>

      {/* Search */}
      <div className="topbar-search">
        <svg className="search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          id="topbar-search-input"
          type="text"
          placeholder="Search topics, notes, companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ color: 'var(--text-3)', fontSize: '10px', lineHeight: 1 }}>✕</button>
        )}
        <span className="search-kbd">⌘K</span>
      </div>

      <div className="topbar-actions">
        {/* GitHub synced */}
        <button
          className="topbar-btn"
          id="btn-github-sync"
          title="GitHub Synced"
          style={{ width: 'auto', padding: '0 10px', gap: '5px', fontSize: '11px', fontWeight: 600, color: 'var(--green)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--green)">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Synced
        </button>

        <button className="topbar-btn" id="btn-notifications" title="Notifications">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notification-dot" />
        </button>

        <div className="topbar-user" id="topbar-user-menu">
          <div className="user-avatar">AC</div>
          <div className="user-info">
            <div className="user-name">Anubhab C.</div>
          </div>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </header>
  );
}
