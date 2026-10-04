'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES, TOPICS, QUESTIONS } from '@/lib/content';
import { getCategoryProgress, getOverallStats } from '@/lib/progress';

export default function PlacementPrepPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [progressTrigger, setProgressTrigger] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setProgressTrigger((prev) => prev + 1);
    window.addEventListener('progress_updated', handleUpdate);
    return () => window.removeEventListener('progress_updated', handleUpdate);
  }, []);

  const overall = getOverallStats();

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Hero Card */}
      <div className="dashboard-hero-card">
        <div className="hero-content-group">
          <div className="hero-pill-tag">
            <span className="live-sync-dot" /> Structured Placement Roadmap
          </div>
          <h1 className="hero-title">Placement Prep by Domain</h1>
          <p className="hero-subtitle">
            Master CS concepts systematically before applying to companies. 
            Choose a subject to access topic breakdowns, theory, PYQs, and interactive quizzes.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
            <div className="dashboard-widget-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '180px' }}>
              <div style={{ fontSize: '24px' }}>🎯</div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Overall Prep Completed</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)' }}>
                  {overall.overallPercentage}% <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 'normal' }}>({overall.totalSolved}/{overall.totalQuestions} solved)</span>
                </div>
              </div>
            </div>

            <div className="dashboard-widget-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '180px' }}>
              <div style={{ fontSize: '24px' }}>🔥</div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Daily Prep Streak</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#f0a500' }}>
                  {overall.streakDays} Days Active
                </div>
              </div>
            </div>

            <div className="dashboard-widget-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '180px' }}>
              <div style={{ fontSize: '24px' }}>📚</div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Subject Domains</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>
                  5 Core Subjects
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 16px 0', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-1)' }}>Subjects & Learning Tracks</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-3)' }}>Select a domain to begin step-by-step topic mastery</p>
        </div>

        <div className="topbar-search-pill" style={{ width: '280px', margin: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search subject or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="dashboard-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredCategories.map((cat) => {
          const stats = getCategoryProgress(cat.id);
          const categoryTopics = TOPICS.filter((t) => t.categoryId === cat.id);

          return (
            <div key={cat.id} className="dashboard-widget-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px'
                    }}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)' }}>{cat.name}</h3>
                      <span style={{ fontSize: '11px', color: cat.color, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {cat.tagline}
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.5', marginBottom: '20px' }}>
                  {cat.description}
                </p>

                {/* Progress bar */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'var(--text-3)' }}>
                    <span>Mastery Progress</span>
                    <span style={{ color: 'var(--text-1)', fontWeight: '600' }}>{stats.percentage}% ({stats.solved}/{stats.total} Qs)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${stats.percentage}%`, height: '100%', background: cat.color, transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                {/* Topics snippet */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '8px' }}>
                    Included Topics ({categoryTopics.length}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {categoryTopics.slice(0, 5).map((topic) => (
                      <span key={topic.id} style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '4px',
                        color: 'var(--text-2)'
                      }}>
                        {topic.name}
                      </span>
                    ))}
                    {categoryTopics.length > 5 && (
                      <span style={{ fontSize: '11px', padding: '3px 8px', color: 'var(--text-3)' }}>
                        +{categoryTopics.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link href={`/prep/${cat.id}`} className="btn btn-violet" style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                Explore {cat.shortName} Modules →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
