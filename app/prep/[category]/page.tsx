'use client';
import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, TOPICS, QUESTIONS } from '@/lib/content';
import { getCategoryProgress, isQuestionSolved } from '@/lib/progress';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.category;

  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) {
    notFound();
  }

  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const topics = TOPICS.filter((t) => t.categoryId === categoryId);
  const categoryStats = getCategoryProgress(categoryId);

  const filteredTopics = topics.filter((t) => {
    const matchesLevel = selectedLevel === 'All' || t.level === selectedLevel;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.keyPoints.some((kp) => kp.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="dashboard-container">
      {/* Back Link */}
      <div style={{ marginBottom: '16px' }}>
        <Link href="/prep" style={{ color: 'var(--text-3)', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to All Subjects
        </Link>
      </div>

      {/* Category Header Card */}
      <div className="dashboard-hero-card" style={{ borderLeft: `4px solid ${category.color}` }}>
        <div className="hero-content-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '32px' }}>{category.icon}</span>
            <div>
              <h1 className="hero-title">{category.name}</h1>
              <span style={{ fontSize: '12px', color: category.color, fontWeight: '600' }}>{category.tagline}</span>
            </div>
          </div>
          <p className="hero-subtitle" style={{ maxWidth: '700px' }}>
            {category.description}
          </p>

          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Topics Completed: </span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-1)' }}>{categoryStats.topicsCompleted} / {categoryStats.totalTopics}</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Questions Solved: </span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-1)' }}>{categoryStats.solved} / {categoryStats.total}</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderRadius: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Mastery: </span>
              <span style={{ fontSize: '14px', fontWeight: '700', color: category.color }}>{categoryStats.percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 16px 0', gap: '16px', flexWrap: 'wrap' }}>
        {/* Level Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`btn ${selectedLevel === lvl ? 'btn-violet' : 'btn-ghost'}`}
              style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '20px' }}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="topbar-search-pill" style={{ width: '260px', margin: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search topic in category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Topics List Grid */}
      <div className="dashboard-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filteredTopics.map((topic) => {
          const topicQs = QUESTIONS.filter((q) => q.topicIds.includes(topic.id));
          const solvedQs = topicQs.filter((q) => isQuestionSolved(q.id));
          const pct = topicQs.length > 0 ? Math.round((solvedQs.length / topicQs.length) * 100) : 0;

          return (
            <div key={topic.id} className="dashboard-widget-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '4px' }}>{topic.name}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`pill-${topic.level.toLowerCase()}`} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px' }}>
                        {topic.level}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: topic.importance === 'Critical' ? 'rgba(240, 68, 56, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                        color: topic.importance === 'Critical' ? '#f04438' : 'var(--text-3)',
                        fontWeight: '600'
                      }}>
                        {topic.importance} Priority
                      </span>
                    </div>
                  </div>

                  <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: '600' }}>
                    {solvedQs.length}/{topicQs.length} Qs
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.5', marginBottom: '16px' }}>
                  {topic.description}
                </p>

                {/* Progress */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? 'var(--green)' : 'var(--accent)', transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                {/* Subtopics snippet */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: '600', marginBottom: '6px' }}>Subtopics covered:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {topic.subtopics.map((sub, idx) => (
                      <span key={idx} style={{ fontSize: '11px', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', color: 'var(--text-3)' }}>
                        • {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/prep/${categoryId}/${topic.id}`}
                className="btn btn-ghost"
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Open Topic Mastery Page →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
