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
  const [dateString, setDateString] = useState('');
  const [pendingOAs, setPendingOAs] = useState(1);
  const userName = 'Anubhab';

  useEffect(() => {
    const now = new Date();
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
    <div className="dashboard-container dashboard-home-page">
      {/* ── Banner Hero Card ── */}
      <section className="dashboard-home-hero">
        <span className="dashboard-home-pill"><i />Welcome back, {userName}</span>
        <h1>Crack top tech offers with <span>AI coaching</span> and a live study hub</h1>
        <p className="dashboard-home-lead">The all-in-one placement prep platform. Track DSA progress, run mock interviews with Gemini AI, join live study rooms, and build a verified developer portfolio.</p>
        <div className="dashboard-home-actions">
          <Link href="/prep" className="dashboard-home-button primary">Start preparing free <span aria-hidden="true">→</span></Link>
          <Link href="/workspace" className="dashboard-home-button">▶ Instant live demo</Link>
        </div>
        <div className="dashboard-home-stats">
          <div><b>15,000+</b><span>Problems solved</span></div>
          <div><b>94%</b><span>Interview pass rate</span></div>
          <div><b>21 days</b><span>Average prep streak</span></div>
          <div><b>50+</b><span>Campus placement hubs</span></div>
        </div>
      </section>

      <div className="dashboard-home-section-heading">
        <div>
          <span className="dashboard-home-eyebrow">Your workspace</span>
          <h2>Your preparation dashboard</h2>
          <p>{dateString || 'Today'} · 3 pending problems and {pendingOAs} upcoming assessment{pendingOAs === 1 ? '' : 's'}.</p>
        </div>
        <Link href="/workspace" className="dashboard-home-button small" id="btn-daily-challenge">Daily challenge <span aria-hidden="true">→</span></Link>
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

