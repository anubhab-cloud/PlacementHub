'use client';
import { useState, useEffect } from 'react';
import PrepSummaryWidget from '@/components/widgets/PrepSummaryWidget';
import BrainWarmupWidget from '@/components/widgets/BrainWarmupWidget';
import AIInsightsWidget from '@/components/widgets/AIInsightsWidget';
import GitHubSyncBanner from '@/components/widgets/GitHubSyncBanner';
import UpcomingEventsWidget from '@/components/widgets/UpcomingEventsWidget';
import PortfolioPreviewWidget from '@/components/widgets/PortfolioPreviewWidget';
import RecentVideosWidget from '@/components/widgets/RecentVideosWidget';
import ContributionGraphWidget from '@/components/widgets/ContributionGraphWidget';
import Link from 'next/link';

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('Good morning');
  const [dateString, setDateString] = useState('');
  const [pendingOAs, setPendingOAs] = useState(1);
  const userName = 'Anubhab';

  useEffect(() => {
    const now = new Date();
    const h = now.getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');

    const formattedDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    setDateString(formattedDate);

    // Count pending OAs from localStorage events if present
    const savedEvents = localStorage.getItem('nexusprep_events');
    if (savedEvents) {
      try {
        const events = JSON.parse(savedEvents);
        const oas = events.filter((e: any) => e.type === 'OA' || e.type === 'Interview').length;
        setPendingOAs(oas);
      } catch (e) {}
    }
  }, []);

  return (
    <div className="dashboard-container">
      {/* ── Banner Hero Card ── */}
      <div className="dashboard-hero-card">
        <div>
          <h1 className="hero-title">{greeting}, {userName}</h1>
          <p className="hero-subtitle">
            {dateString ? dateString : 'Today'}. 3 pending problems and {pendingOAs} upcoming assessment{pendingOAs === 1 ? '' : 's'}.
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/workspace" className="btn-hero-dark" id="btn-daily-challenge" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Daily challenge
          </Link>
          <Link href="/workspace" className="btn-hero-purple" id="btn-start-session" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Start session
          </Link>
        </div>
      </div>

      {/* ── GitHub Sync Bar ── */}
      <GitHubSyncBanner />

      {/* ── Row 1 Widgets ── */}
      <div className="dashboard-row-grid">
        <PrepSummaryWidget />
        <BrainWarmupWidget />
        <AIInsightsWidget />
      </div>

      {/* ── Row 2 Widgets ── */}
      <div className="dashboard-row-grid" style={{ marginTop: '14px' }}>
        <UpcomingEventsWidget />
        <PortfolioPreviewWidget />
        <RecentVideosWidget />
      </div>

      {/* ── Row 3 Widget: Daily Streak Contribution Graph ── */}
      <div style={{ marginTop: '14px' }}>
        <ContributionGraphWidget />
      </div>
    </div>
  );
}

