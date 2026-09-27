'use client';
import { useState, useEffect } from 'react';
import PrepSummaryWidget from '@/components/widgets/PrepSummaryWidget';
import BrainWarmupWidget from '@/components/widgets/BrainWarmupWidget';
import AIInsightsWidget from '@/components/widgets/AIInsightsWidget';
import UpcomingEventsWidget from '@/components/widgets/UpcomingEventsWidget';
import PortfolioPreviewWidget from '@/components/widgets/PortfolioPreviewWidget';
import RecentVideosWidget from '@/components/widgets/RecentVideosWidget';
import GitHubSyncBanner from '@/components/widgets/GitHubSyncBanner';

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('Good morning');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
    setDateStr(new Intl.DateTimeFormat('en-IN', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()));
  }, []);

  return (
    <div>
      {/* ── Sub-header ─────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting}, <span className="glow-text-violet">Anubhab</span> 👋
          </h1>
          <p className="page-subtitle">{dateStr} · 3 pending problems · 1 upcoming OA</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost" id="btn-daily-challenge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Daily Challenge
          </button>
          <button className="btn btn-violet" id="btn-start-session">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Start Session
          </button>
        </div>
      </div>

      {/* ── GitHub Banner ──────────────────────────────────────────── */}
      <GitHubSyncBanner />

      {/* ── Widget Grid ────────────────────────────────────────────── */}
      <div className="dashboard-grid">
        <PrepSummaryWidget />
        <BrainWarmupWidget />
        <AIInsightsWidget />
        <UpcomingEventsWidget />
        <PortfolioPreviewWidget />
        <RecentVideosWidget />
      </div>
    </div>
  );
}
