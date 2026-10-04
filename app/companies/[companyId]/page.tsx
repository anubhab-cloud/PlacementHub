'use client';
import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COMPANIES, COMPANY_QUESTIONS, QUESTIONS, TOPICS } from '@/lib/content';
import { getCompanyReadiness, toggleTargetCompany, isQuestionSolved, toggleQuestionSolved, getProgressStore } from '@/lib/progress';

export default function CompanyDetailPage({ params }: { params: Promise<{ companyId: string }> }) {
  const resolvedParams = use(params);
  const companyId = resolvedParams.companyId;

  const company = COMPANIES.find((c) => c.id === companyId);
  if (!company) {
    notFound();
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'roadmap'>('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const readiness = getCompanyReadiness(company);
  const store = getProgressStore();
  const isTarget = store.targetCompanyIds.includes(company.id);

  // Find all questions associated with this company
  const companyQuestionMappings = COMPANY_QUESTIONS.filter((cq) => cq.companyId === company.id);
  const directQuestionIds = companyQuestionMappings.map((cq) => cq.questionId);
  
  const companyQuestions = QUESTIONS.filter((q) =>
    directQuestionIds.includes(q.id) ||
    q.tags.some((t) => t.toLowerCase() === company.name.toLowerCase()) ||
    company.focusTopics.some((ft) => q.topicIds.includes(ft))
  );

  const handleToggleTarget = () => {
    toggleTargetCompany(company.id);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleToggleSolved = (qId: string) => {
    toggleQuestionSolved(qId);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="dashboard-container">
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-3)' }}>
        <Link href="/companies" style={{ color: 'var(--text-3)', textDecoration: 'none' }}>Company Directory</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-1)', fontWeight: '600' }}>{company.name}</span>
      </div>

      {/* Hero Header */}
      <div className="dashboard-hero-card" style={{ borderLeft: `4px solid ${company.color || 'var(--accent)'}` }}>
        <div className="hero-content-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}>
                {company.logo}
              </div>
              <div>
                <h1 className="hero-title">{company.name} Preparation Kit</h1>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>{company.category}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>•</span>
                  <span style={{ fontSize: '12px', color: 'var(--green)', fontWeight: '600' }}>Avg Package: {company.avgPackage}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleToggleTarget}
              className={`btn ${isTarget ? 'btn-violet' : 'btn-ghost'}`}
              style={{ borderRadius: '20px', padding: '8px 18px', fontSize: '13px' }}
            >
              {isTarget ? '★ Target Company' : '+ Mark as Target'}
            </button>
          </div>

          <p className="hero-subtitle" style={{ maxWidth: '750px', marginTop: '16px' }}>
            {company.overview}
          </p>

          {/* Readiness Score Bar */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px 20px', borderRadius: '10px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-2)' }}>Your Readiness for {company.name}</span>
              <strong style={{ color: 'var(--text-1)' }}>{readiness}% Ready</strong>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${readiness}%`,
                height: '100%',
                background: readiness > 70 ? 'var(--green)' : readiness > 40 ? 'var(--accent)' : 'var(--amber)',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', margin: '24px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px' }}>
        {[
          { id: 'overview', label: '📋 Recruitment Process & Overview' },
          { id: 'questions', label: `❓ Verified Interview PYQs (${companyQuestions.length})` },
          { id: 'roadmap', label: '🚀 Custom Study Roadmap' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`btn ${activeTab === tab.id ? 'btn-violet' : 'btn-ghost'}`}
            style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '8px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Rounds */}
          <div className="dashboard-widget-card">
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>
              🎯 Interview Round Structure
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {company.rounds.map((round, idx) => (
                <div key={idx} style={{
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Round {idx + 1}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-1)' }}>
                    {round}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility & Info */}
          <div className="dashboard-row-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="dashboard-widget-card">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '12px' }}>
                🎓 Eligibility Criteria
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.6' }}>
                {company.eligibility}
              </p>
            </div>

            <div className="dashboard-widget-card">
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '12px' }}>
                🔥 Highest Priority Focus Areas
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {company.focusTopics.map((topic, idx) => (
                  <span key={idx} style={{ fontSize: '12px', padding: '6px 12px', background: 'rgba(99, 91, 255, 0.15)', color: 'var(--accent)', borderRadius: '6px', fontWeight: '600' }}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="dashboard-widget-card">
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '8px' }}>
            ❓ Past Interview Questions for {company.name}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '20px' }}>
            Questions compiled from recent campus placements and off-campus recruitment drives.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {companyQuestions.length === 0 ? (
              <p style={{ color: 'var(--text-3)' }}>No direct questions logged yet for this company.</p>
            ) : (
              companyQuestions.map((q) => {
                const solved = isQuestionSolved(q.id);
                return (
                  <div key={q.id} style={{
                    padding: '16px 20px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${solved ? 'rgba(62, 207, 142, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <input
                        type="checkbox"
                        checked={solved}
                        onChange={() => handleToggleSolved(q.id)}
                        style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer', accentColor: 'var(--green)' }}
                      />
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '600', color: solved ? 'var(--text-3)' : 'var(--text-1)', textDecoration: solved ? 'line-through' : 'none' }}>
                            {q.title}
                          </h4>
                          <span className={`pill-${q.difficulty.toLowerCase()}`} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px' }}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px' }}>
                          {q.description}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/workspace?problem=${encodeURIComponent(q.title)}`}
                      className="btn btn-violet"
                      style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                    >
                      Solve in Workspace →
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="dashboard-widget-card">
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '8px' }}>
            🚀 Step-by-Step Preparation Roadmap for {company.name}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '24px' }}>
            Recommended timeline to get interview-ready for {company.name} in 4 weeks.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { week: 'Week 1', title: 'Core CS Foundations & Aptitude', desc: 'Focus on DBMS Keys, OS Processes, and Quantitative Aptitude speed drills.' },
              { week: 'Week 2', title: 'DSA Priority Topics', desc: `Master ${company.focusTopics.slice(0, 2).join(' and ')} coding patterns and time complexity.` },
              { week: 'Week 3', title: 'Company PYQs & Mock Tests', desc: `Solve all ${companyQuestions.length} past questions and attempt timed mock assessments.` },
              { week: 'Week 4', title: 'HR & Technical Mock Interviews', desc: 'Prepare project explanations, behavioral questions, and system design basics.' },
            ].map((step, idx) => (
              <div key={idx} style={{
                padding: '16px 20px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                gap: '16px',
                alignItems: 'center'
              }}>
                <div style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  background: 'rgba(99, 91, 255, 0.2)',
                  color: 'var(--accent)',
                  fontWeight: '700',
                  fontSize: '13px',
                  whiteSpace: 'nowrap'
                }}>
                  {step.week}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-1)' }}>{step.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '2px' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
