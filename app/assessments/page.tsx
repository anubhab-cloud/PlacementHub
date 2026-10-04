'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AssessmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'product' | 'service' | 'speed'>('all');

  const assessments = [
    {
      id: 'test-product-dsa',
      title: 'Product Company DSA Screening',
      category: 'product',
      duration: '90 Mins',
      totalQuestions: 3,
      difficulty: 'Hard',
      topics: ['Arrays', 'Graphs', 'Dynamic Programming'],
      description: 'Standard 3-problem online coding assessment modeled after Amazon, Google, and Microsoft online tests.',
      color: '#635bff',
    },
    {
      id: 'test-service-aptitude',
      title: 'Service Company Round 1 Screening',
      category: 'service',
      duration: '60 Mins',
      totalQuestions: 45,
      difficulty: 'Medium',
      topics: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability'],
      description: 'Timed speed test simulating TCS NQT, Infosys InfyTQ, and Wipro NLTH round 1 exams.',
      color: '#38bdf8',
    },
    {
      id: 'test-cs-core-speed',
      title: 'CS Core Knowledge Speed Drill',
      category: 'speed',
      duration: '30 Mins',
      totalQuestions: 30,
      difficulty: 'Medium',
      topics: ['DBMS', 'Operating Systems', 'Computer Networks', 'OOP'],
      description: 'Fast-paced MCQ drill testing foundational CS concepts required for technical interview rounds.',
      color: '#a78bfa',
    },
    {
      id: 'test-sql-mastery',
      title: 'SQL & Database Design Test',
      category: 'product',
      duration: '45 Mins',
      totalQuestions: 5,
      difficulty: 'Medium-Hard',
      topics: ['Joins', 'CTEs', 'Window Functions', 'Subqueries'],
      description: 'Hands-on query writing test covering Nth highest salary, gaps & islands, and aggregation queries.',
      color: '#10b981',
    },
  ];

  const filtered = assessments.filter((a) => selectedCategory === 'all' || a.category === selectedCategory);

  return (
    <div className="dashboard-container">
      {/* Hero Header */}
      <div className="dashboard-hero-card">
        <div className="hero-content-group">
          <div className="hero-pill-tag">
            <span className="live-sync-dot" /> Timed Exam Conditions
          </div>
          <h1 className="hero-title">Mock Assessments & Speed Drills</h1>
          <p className="hero-subtitle">
            Simulate real company online screening tests under timed constraints. 
            Evaluate your speed, accuracy, and problem-solving stamina before actual placement drives.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', margin: '24px 0 16px 0', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Assessments' },
          { id: 'product', label: '🚀 Product Coding Tests' },
          { id: 'service', label: '🏢 Service Aptitude Exams' },
          { id: 'speed', label: '⚡ CS Speed Drills' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`btn ${selectedCategory === tab.id ? 'btn-violet' : 'btn-ghost'}`}
            style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '20px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assessment Cards Grid */}
      <div className="dashboard-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {filtered.map((test) => (
          <div key={test.id} className="dashboard-widget-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `4px solid ${test.color}` }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)' }}>{test.title}</h3>
                <span className={`pill-${test.difficulty.toLowerCase().split('-')[0]}`} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px' }}>
                  {test.difficulty}
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.5', marginBottom: '16px' }}>
                {test.description}
              </p>

              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '6px' }}>
                <div>⏱️ <strong>{test.duration}</strong></div>
                <div>📝 <strong>{test.totalQuestions} Questions</strong></div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: '600', marginBottom: '6px' }}>Topics Tested:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {test.topics.map((t, idx) => (
                    <span key={idx} style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', color: 'var(--text-2)' }}>
                      • {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href={`/workspace?test=${encodeURIComponent(test.title)}`}
              className="btn btn-violet"
              style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
            >
              Start Timed Test →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
