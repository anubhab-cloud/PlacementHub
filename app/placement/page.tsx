'use client';
import { useState, useEffect } from 'react';

const topics = [
  { icon: '🖥', name: 'Operating Systems', q: 120, done: 45 },
  { icon: '🗃', name: 'DBMS', q: 95, done: 62 },
  { icon: '🌐', name: 'Computer Networks', q: 80, done: 30 },
  { icon: '⚙', name: 'OOP Concepts', q: 60, done: 55 },
  { icon: '🔐', name: 'System Design', q: 40, done: 15 },
];

const flashcards = [
  { q: 'What is a deadlock?', a: 'A situation where two or more processes are blocked forever, waiting for each other to release resources.' },
  { q: 'What is ACID in DBMS?', a: 'Atomicity, Consistency, Isolation, Durability — properties that guarantee database transactions are processed reliably.' },
  { q: 'What is TCP vs UDP?', a: 'TCP is connection-oriented, reliable, ordered. UDP is connectionless, faster but unreliable. Use TCP for data integrity, UDP for speed.' },
  { q: 'What is Virtual Memory?', a: 'A storage allocation scheme in which secondary memory can be addressed as though it were part of main memory.' },
];

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: 'Which CPU scheduling algorithm gives minimum average waiting time?',
    options: ['First Come First Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin', 'Priority Scheduling'],
    correct: 1,
    subject: 'Operating Systems',
  },
  {
    id: 2,
    question: 'Which normal form eliminates partial dependency in a database table?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correct: 1,
    subject: 'DBMS',
  },
  {
    id: 3,
    question: 'At which OSI layer does the IP protocol operate?',
    options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Application Layer'],
    correct: 1,
    subject: 'Computer Networks',
  },
  {
    id: 4,
    question: 'Which feature of OOP allows one interface to be used for a general class of actions?',
    options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
    correct: 2,
    subject: 'OOP',
  },
];

function QuizModal({ onClose }: { onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setIsSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, timeLeft]);

  const handleSelect = (optionIdx: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    MOCK_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correct) score++;
    });
    return score;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = MOCK_QUESTIONS[currentIdx];
  const score = calculateScore();

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: '550px' }}>
        <div className="modal-header">
          <span className="modal-title">⏱ Timed Mock Quiz — CS Core</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {!isSubmitted ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'var(--black-3)', padding: '8px 14px', borderRadius: '100px' }}>
              <span style={{ fontSize: '11px', color: 'var(--violet-bright)', fontWeight: 700 }}>
                Question {currentIdx + 1} of {MOCK_QUESTIONS.length}
              </span>
              <span style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: timeLeft < 30 ? 'var(--red)' : 'var(--cyan)', fontWeight: 700 }}>
                ⏳ {formatTime(timeLeft)}
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '6px' }}>{currentQ.subject}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>{currentQ.question}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {currentQ.options.map((opt, oIdx) => {
                const selected = answers[currentIdx] === oIdx;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(oIdx)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--r-md)',
                      textAlign: 'left',
                      fontSize: '13px',
                      cursor: 'pointer',
                      background: selected ? 'var(--violet-soft)' : 'var(--black-3)',
                      border: `1px solid ${selected ? 'var(--violet-bright)' : 'rgba(255,255,255,0.06)'}`,
                      color: selected ? 'var(--violet-bright)' : 'var(--text-1)',
                      fontWeight: selected ? 600 : 400,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {String.fromCharCode(65 + oIdx)}. {opt}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
              >
                ← Prev
              </button>
              {currentIdx < MOCK_QUESTIONS.length - 1 ? (
                <button className="btn btn-violet btn-sm" onClick={() => setCurrentIdx(i => i + 1)}>
                  Next →
                </button>
              ) : (
                <button className="btn btn-violet btn-sm" onClick={() => setIsSubmitted(true)}>
                  Submit Test ✓
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Assessment Completed!</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-2)', marginBottom: '20px' }}>
              You scored <span style={{ color: 'var(--green)', fontWeight: 700 }}>{score} / {MOCK_QUESTIONS.length}</span> ({((score / MOCK_QUESTIONS.length) * 100).toFixed(0)}%)
            </p>

            <div style={{ background: 'var(--black-3)', borderRadius: 'var(--r-md)', padding: '16px', textAlign: 'left', marginBottom: '20px' }}>
              {MOCK_QUESTIONS.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: '10px', borderBottom: idx !== MOCK_QUESTIONS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingBottom: '8px' }}>
                  <div style={{ fontSize: '11px', color: answers[idx] === q.correct ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                    {answers[idx] === q.correct ? '✓ Correct' : '✕ Incorrect'} — Q{idx + 1}: {q.question}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>
                    Correct Answer: {q.options[q.correct]}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-violet" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Close & Update Analytics
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlacementPage() {
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const next = () => { setCardIdx((i) => (i + 1) % flashcards.length); setFlipped(false); };
  const prev = () => { setCardIdx((i) => (i - 1 + flashcards.length) % flashcards.length); setFlipped(false); };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">💼 Placement Arena</h1>
          <p className="page-subtitle">CS Core Concepts · Interactive Flashcards · Timed Assessments</p>
        </div>
        <button className="btn btn-violet" id="btn-start-quiz" onClick={() => setShowQuiz(true)}>
          ⏱ Start Mock Quiz
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {/* Flashcard Section */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="card-label" style={{ marginBottom: '14px' }}>
            <span className="lbl-icon">🃏</span> Interview Flashcards
          </div>
          <div
            id="flashcard"
            onClick={() => setFlipped(f => !f)}
            style={{
              background: flipped ? 'rgba(0, 229, 160, 0.06)' : 'rgba(124, 58, 237, 0.06)',
              border: `1px solid ${flipped ? 'rgba(0, 229, 160, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
              borderRadius: '20px', padding: '28px', cursor: 'pointer',
              minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', transition: 'all 0.3s ease',
            }}
          >
            <div>
              <div style={{ fontSize: '10px', color: flipped ? 'var(--green)' : 'var(--violet-bright)', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>
                {flipped ? '✓ ANSWER' : '❓ QUESTION (Click to flip)'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.6 }}>
                {flipped ? flashcards[cardIdx].a : flashcards[cardIdx].q}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'center' }}>
            <button id="btn-prev-card" onClick={prev} className="btn btn-ghost btn-sm">← Prev</button>
            <span style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: 'var(--text-3)' }}>{cardIdx + 1} / {flashcards.length}</span>
            <button id="btn-next-card" onClick={next} className="btn btn-ghost btn-sm">Next →</button>
          </div>
        </div>

        {/* Topics Progress */}
        <div className="card" style={{ padding: '20px' }}>
          <div className="card-label" style={{ marginBottom: '14px' }}>
            <span className="lbl-icon">📚</span> CS Core Progress
          </div>
          {topics.map(t => (
            <div key={t.name} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-1)' }}>{t.icon} {t.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>{t.done}/{t.q}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${(t.done / t.q) * 100}%`, height: '100%', borderRadius: '100px',
                  background: t.done / t.q > 0.7 ? 'var(--green)' : t.done / t.q > 0.4 ? 'var(--amber)' : 'var(--violet)',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} />}
    </div>
  );
}
