'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES, TOPICS, QUESTIONS, COMPANIES } from '@/lib/content';
import { getOverallStats, getCategoryProgress, getCompanyReadiness, getProgressStore, isQuestionSolved, toggleQuestionSolved } from '@/lib/progress';

export default function ProgressAnalyticsPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setRefreshTrigger((prev) => prev + 1);
    window.addEventListener('progress_updated', handleUpdate);
    return () => window.removeEventListener('progress_updated', handleUpdate);
  }, []);

  const overall = getOverallStats();
  const store = getProgressStore();

  const targetCompanies = COMPANIES.filter((c) => store.targetCompanyIds.includes(c.id));
  const bookmarkedQuestions = QUESTIONS.filter((q) => store.bookmarkedQuestionIds.includes(q.id));

  const handleToggleSolved = (qId: string) => {
    toggleQuestionSolved(qId);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="dashboard-container">
      {/* Hero Banner */}
      <div className="dashboard-hero-card">
        <div className="hero-content-group">
          <div className="hero-pill-tag">
            <span className="live-sync-dot" /> Real-time Performance Tracking
          </div>
          <h1 className="hero-title">Progress & Placement Analytics</h1>
          <p className="hero-subtitle">
            Track your mastery across CS subjects, target company readiness scores, and bookmarked questions.
          </p>

          <div style={{ display: 'flex', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
            <div className="dashboard-widget-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '180px' }}>
              <div style={{ fontSize: '28px' }}>🎯</div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Overall Solved</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-1)' }}>
                  {overall.totalSolved} / {overall.totalQuestions}
                </div>
              </div>
            </div>

            <div className="dashboard-widget-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '180px' }}>
              <div style={{ fontSize: '28px' }}>⚡</div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Completion Rate</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent)' }}>
                  {overall.overallPercentage}%
                </div>
              </div>
            </div>

            <div className="dashboard-widget-card" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '180px' }}>
              <div style={{ fontSize: '28px' }}>🔥</div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>Daily Prep Streak</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#f0a500' }}>
                  {overall.streakDays} Days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Row: Subject Breakdown + Target Companies */}
      <div className="dashboard-row-grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px', margin: '24px 0' }}>
        {/* Subject Breakdown */}
        <div className="dashboard-widget-card">
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>
            📊 Mastery by CS Subject Domain
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {CATEGORIES.map((cat) => {
              const stats = getCategoryProgress(cat.id);
              return (
                <div key={cat.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                      <div>
                        <strong style={{ fontSize: '14px', color: 'var(--text-1)' }}>{cat.name}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{stats.topicsCompleted}/{stats.totalTopics} topics completed</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: cat.color }}>
                      {stats.percentage}%
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${stats.percentage}%`, height: '100%', background: cat.color, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Target Companies Readiness */}
        <div className="dashboard-widget-card">
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>
            ⭐ Target Company Readiness
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {targetCompanies.length === 0 ? (
              <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>No target companies pinned yet. Visit Company Directory to add targets.</p>
            ) : (
              targetCompanies.map((company) => {
                const readiness = getCompanyReadiness(company);
                return (
                  <div key={company.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{company.logo}</span>
                        <div>
                          <strong style={{ fontSize: '14px', color: 'var(--text-1)' }}>{company.name}</strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{company.category}</div>
                        </div>
                      </div>
                      <Link href={`/companies/${company.id}`} style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}>
                        Kit →
                      </Link>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>
                      <span>Readiness Score</span>
                      <strong style={{ color: 'var(--text-1)' }}>{readiness}%</strong>
                    </div>

                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${readiness}%`,
                        height: '100%',
                        background: readiness > 70 ? 'var(--green)' : readiness > 40 ? 'var(--accent)' : 'var(--amber)',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bookmarked Questions */}
      <div className="dashboard-widget-card">
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>
          📌 Bookmarked Question Vault ({bookmarkedQuestions.length})
        </h3>

        {bookmarkedQuestions.length === 0 ? (
          <p style={{ color: 'var(--text-3)', fontSize: '13px' }}>No bookmarked questions yet. Bookmark difficult problems while studying to review them here.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {bookmarkedQuestions.map((q) => {
              const solved = isQuestionSolved(q.id);
              return (
                <div key={q.id} style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={solved}
                      onChange={() => handleToggleSolved(q.id)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--green)' }}
                    />
                    <div>
                      <strong style={{ fontSize: '14px', color: solved ? 'var(--text-3)' : 'var(--text-1)', textDecoration: solved ? 'line-through' : 'none' }}>
                        {q.title}
                      </strong>
                      <span className={`pill-${q.difficulty.toLowerCase()}`} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', marginLeft: '8px' }}>
                        {q.difficulty}
                      </span>
                    </div>
                  </div>

                  <Link href={`/workspace?problem=${encodeURIComponent(q.title)}`} className="btn btn-ghost" style={{ fontSize: '12px', padding: '4px 10px' }}>
                    Open in Workspace →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
