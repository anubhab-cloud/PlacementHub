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
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greeting}, <span className="glow-text-violet">Anubhab</span> 👋
          </h1>
          <p className="page-subtitle">{dateStr} · 3 pending problems · 1 upcoming OA</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-violet" id="btn-start-session">⚡ Start Session</button>
          <button className="btn btn-outline-violet" id="btn-daily-challenge">🎯 Daily Challenge</button>
        </div>
      </div>

      {/* ── GitHub Banner ────────────────────────────────────────── */}
      <GitHubSyncBanner />

      {/* ── Widget Grid ──────────────────────────────────────────── */}
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
