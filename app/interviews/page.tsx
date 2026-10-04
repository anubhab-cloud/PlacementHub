'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function InterviewsPage() {
  const [expandedHrId, setExpandedHrId] = useState<string | null>(null);

  const hrQuestions = [
    {
      id: 'hr-1',
      question: 'Tell me about yourself / Introduce yourself.',
      category: 'General',
      framework: 'Present → Past → Future (90 seconds rule)',
      sampleAnswer: 'I am a final-year CS undergraduate passionate about backend development and algorithmic problem solving. Over the last year, I built PlacementHub (a full-stack interview prep platform) and solved 300+ DSA problems. I am looking for a Software Engineering role where I can build scalable systems.',
      keyTips: ['Keep it under 2 minutes', 'Focus 70% on technical skills & projects', 'Conclude with why you want this specific role'],
    },
    {
      id: 'hr-2',
      question: 'Describe a challenging technical problem you solved using the STAR method.',
      category: 'Behavioral',
      framework: 'STAR Method (Situation, Task, Action, Result)',
      sampleAnswer: 'Situation: During my internship, our database queries were taking 4 seconds. Task: Optimize query latency without changing database schema. Action: Added composite B+ Tree indexing and implemented Redis caching for hot keys. Result: Reduced query latency by 85% down to 300ms.',
      keyTips: ['Quantify results with metrics/percentages', 'Emphasize YOUR specific action', 'Explain the technical trade-offs considered'],
    },
    {
      id: 'hr-3',
      question: 'Why do you want to join our company?',
      category: 'Company Fit',
      framework: 'Company Mission + Technical Stack Match + Career Alignment',
      sampleAnswer: 'I have been following your engineering blog on how your team scaled microservices for high throughput. My background in distributed systems and SQL query optimization aligns directly with your current infrastructure goals.',
      keyTips: ['Mention recent engineering blog posts or features', 'Align your personal tech stack with theirs', 'Avoid generic answers like "It is a big company"'],
    },
    {
      id: 'hr-4',
      question: 'What are your strengths and weaknesses?',
      category: 'Self Awareness',
      framework: 'Real Technical Strength + Genuine Weakness with Active Remediation',
      sampleAnswer: 'Strength: Strong algorithmic debugging skills and clean code practices. Weakness: I used to spend too much time perfecting UI before validating core backend APIs, but now I use API-first design principles.',
      keyTips: ['Never say "I am a perfectionist"', 'Show proactive steps you are taking to fix your weakness'],
    },
  ];

  const technicalChecklists = [
    { title: 'Project Explanation Guide', items: ['Architecture overview', 'Database schema decisions', 'Trade-offs made', 'How to handle 10x traffic scalability'] },
    { title: 'System Design Checklist', items: ['Functional vs Non-functional requirements', 'Capacity estimation (QPS, storage)', 'API contract design', 'Database selection (SQL vs NoSQL)'] },
    { title: 'DSA Live Coding Checklist', items: ['Clarify edge cases before typing', 'Explain brute force first O(N²)', 'Propose optimal approach O(N log N) before coding', 'Dry run with sample test cases'] },
  ];

  return (
    <div className="dashboard-container">
      {/* Hero Header */}
      <div className="dashboard-hero-card">
        <div className="hero-content-group">
          <div className="hero-pill-tag">
            <span className="live-sync-dot" /> HR & Technical Rounds
          </div>
          <h1 className="hero-title">Interview Preparation Center</h1>
          <p className="hero-subtitle">
            Master behavioral HR questions using the STAR framework and prepare structured answers for technical discussion rounds.
          </p>

          <div style={{ marginTop: '18px' }}>
            <Link href="/ai?mode=mock_interview" className="btn btn-violet" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              🤖 Launch Gemini AI Mock Interviewer →
            </Link>
          </div>
        </div>
      </div>

      {/* STAR Method Guide Banner */}
      <div className="dashboard-widget-card" style={{ margin: '24px 0', borderLeft: '4px solid var(--accent)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '8px' }}>
          ⭐ The STAR Response Method Framework
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
          {[
            { step: 'S — Situation', desc: 'Set the scene and context of the technical challenge or project.' },
            { step: 'T — Task', desc: 'Describe your exact responsibility and what needed to be solved.' },
            { step: 'A — Action', desc: 'Detail the steps you took, tools used, and technical logic applied.' },
            { step: 'R — Result', desc: 'Quantify the outcome with metrics (% speedup, users impacted).' },
          ].map((s, idx) => (
            <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px' }}>
              <strong style={{ color: 'var(--accent)', fontSize: '13px' }}>{s.step}</strong>
              <p style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '4px' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HR Questions Section */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>
          💬 Frequently Asked HR & Behavioral Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {hrQuestions.map((q) => {
            const isExpanded = expandedHrId === q.id;
            return (
              <div key={q.id} className="dashboard-widget-card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '600', textTransform: 'uppercase' }}>
                      {q.category}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-1)', marginTop: '4px' }}>
                      {q.question}
                    </h3>
                  </div>

                  <button
                    onClick={() => setExpandedHrId(isExpanded ? null : q.id)}
                    className="btn btn-ghost"
                    style={{ padding: '6px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
                  >
                    {isExpanded ? 'Hide Strategy' : 'View Strategy & Answer'}
                  </button>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ background: 'rgba(99, 91, 255, 0.1)', padding: '12px 16px', borderRadius: '6px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '700' }}>📐 Structure Blueprint:</span>
                      <p style={{ fontSize: '13px', color: 'var(--text-1)', fontWeight: '600', marginTop: '2px' }}>{q.framework}</p>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: '700', textTransform: 'uppercase' }}>💡 Model Answer Example</span>
                      <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px', lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px' }}>
                        "{q.sampleAnswer}"
                      </p>
                    </div>

                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--amber)', fontWeight: '700', textTransform: 'uppercase' }}>⚠️ Crucial Interview Tips</span>
                      <ul style={{ paddingLeft: '20px', fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>
                        {q.keyTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Round Checklists */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '16px' }}>
          🧠 Technical Round Execution Playbooks
        </h2>

        <div className="dashboard-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {technicalChecklists.map((chk, idx) => (
            <div key={idx} className="dashboard-widget-card">
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-1)', marginBottom: '12px' }}>
                {chk.title}
              </h3>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-2)', lineHeight: '1.7' }}>
                {chk.items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
