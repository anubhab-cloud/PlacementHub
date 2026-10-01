'use client';

import { useState, useEffect } from 'react';

/* ── COMPANY TRACKS ───────────────────────────────────────────────────────── */
const COMPANY_TRACKS = [
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '📦',
    difficulty: 'Hard',
    color: '#ff9900',
    rounds: ['Online Assessment (OA)', 'Technical Round 1 (DSA & LP)', 'Technical Round 2 (System Design)', 'Bar Raiser Round'],
    focusTopics: ['Binary Trees & Graphs', 'Dynamic Programming', 'Leadership Principles', 'System Design & OOD'],
    readiness: 78,
  },
  {
    id: 'google',
    name: 'Google',
    logo: '🔍',
    difficulty: 'Hard',
    color: '#4285f4',
    rounds: ['Screening Round', 'Coding Round 1 (Advanced Algo)', 'Coding Round 2 (Graph/DP)', 'Googliness & Behavioral'],
    focusTopics: ['Graph Theory & Shortest Path', 'Advanced DP & Memoization', 'Tries & Segment Trees', 'Time Complexity Analysis'],
    readiness: 65,
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '🪟',
    difficulty: 'Medium-Hard',
    color: '#00a4ef',
    rounds: ['Online Coding Test', 'Technical Round 1 (Data Structures)', 'Technical Round 2 (System Design & OS)', 'AA / Managerial Round'],
    focusTopics: ['Arrays & Strings', 'Linked Lists & Trees', 'OS Process & Thread Scheduling', 'DBMS Indexing & Transactions'],
    readiness: 82,
  },
  {
    id: 'tcs',
    name: 'TCS Digital / Prime',
    logo: '🏢',
    difficulty: 'Medium',
    color: '#10B981',
    rounds: ['NQT Aptitude & Coding Test', 'Technical Interview', 'HR & Managerial Round'],
    focusTopics: ['Quantitative Aptitude & Reasoning', 'C++ / Java Core OOP', 'Basic Data Structures', 'SQL Queries'],
    readiness: 91,
  },
];

/* ── CS CORE SUBJECTS WITH REVISION CHEAT SHEETS ────────────────────────────── */
type SubjectItem = {
  id: string;
  icon: string;
  name: string;
  code: string;
  qCount: number;
  doneCount: number;
  color: string;
  cheatSheet: {
    summary: string;
    keyConcepts: { title: string; desc: string }[];
    topQuestions: { q: string; a: string }[];
  };
};

const CS_SUBJECTS: SubjectItem[] = [
  {
    id: 'os',
    icon: '🖥',
    name: 'Operating Systems',
    code: 'CS501',
    qCount: 120,
    doneCount: 88,
    color: '#38BDF8',
    cheatSheet: {
      summary: 'Manages computer hardware, processes, memory allocation, storage, and synchronization.',
      keyConcepts: [
        { title: 'Process vs Thread', desc: 'Process is an executing program instance with its own memory space. Thread is a lightweight execution segment sharing process memory.' },
        { title: 'Deadlock Conditions (Coffman)', desc: '1. Mutual Exclusion  2. Hold and Wait  3. No Preemption  4. Circular Wait.' },
        { title: 'Virtual Memory & Paging', desc: 'Translates virtual addresses to physical frame addresses using Page Tables and TLB (Translation Lookaside Buffer).' },
        { title: 'CPU Scheduling Algorithms', desc: 'FCFS, SJF (Optimal average waiting time), Round Robin (Time Quantum), Priority Scheduling.' },
      ],
      topQuestions: [
        { q: 'What is thrashing in OS?', a: 'High paging activity where the system spends more time swapping pages in/out than executing processes.' },
        { q: 'What is a semaphore vs mutex?', a: 'Mutex is a locking mechanism (ownership by 1 thread). Semaphore is a signaling mechanism (counter allowing N threads).' },
      ],
    },
  },
  {
    id: 'dbms',
    icon: '🗃',
    name: 'DBMS & SQL',
    code: 'CS502',
    qCount: 95,
    doneCount: 74,
    color: '#A78BFA',
    cheatSheet: {
      summary: 'Data models, relational algebra, SQL optimization, ACID guarantees, and database indexing.',
      keyConcepts: [
        { title: 'ACID Properties', desc: 'Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (persisted commits).' },
        { title: 'Normal Forms (1NF → BCNF)', desc: '1NF: Atomic values. 2NF: No partial dependency. 3NF: No transitive dependency. BCNF: Every determinant is a candidate key.' },
        { title: 'B+ Tree Indexing', desc: 'Balanced multi-way search trees used in DB indexing. All data pointers reside in leaf nodes connected via linked list.' },
      ],
      topQuestions: [
        { q: 'What is the difference between WHERE and HAVING in SQL?', a: 'WHERE filters rows before aggregation; HAVING filters aggregated groups after GROUP BY.' },
        { q: 'What is a candidate key vs primary key?', a: 'Candidate Key is any minimal column set uniquely identifying a row. Primary Key is the chosen candidate key.' },
      ],
    },
  },
  {
    id: 'cn',
    icon: '🌐',
    name: 'Computer Networks',
    code: 'CS601',
    qCount: 85,
    doneCount: 52,
    color: '#10B981',
    cheatSheet: {
      summary: 'Data communication, OSI 7-layer architecture, TCP/IP protocols, routing algorithms, and sockets.',
      keyConcepts: [
        { title: 'OSI 7 Layers', desc: 'Application, Presentation, Session, Transport, Network, Data Link, Physical.' },
        { title: 'TCP vs UDP', desc: 'TCP: Connection-oriented, reliable, flow-controlled, ordered. UDP: Connectionless, fast, unreliable streaming.' },
        { title: 'TCP 3-Way Handshake', desc: 'Client sends SYN → Server responds SYN-ACK → Client sends ACK.' },
      ],
      topQuestions: [
        { q: 'What happens when you type google.com into your browser?', a: 'DNS resolution → TCP Handshake → TLS Negotiation → HTTP GET request → Web Server response → DOM rendering.' },
        { q: 'What is Subnetting & CIDR?', a: 'Dividing an IP network into smaller subnetworks to optimize IP address allocation and routing efficiency.' },
      ],
    },
  },
  {
    id: 'oop',
    icon: '⚙',
    name: 'OOP & Concepts',
    code: 'CS402',
    qCount: 70,
    doneCount: 65,
    color: '#F59E0B',
    cheatSheet: {
      summary: 'Object-Oriented Programming paradigms: Encapsulation, Abstraction, Inheritance, and Polymorphism.',
      keyConcepts: [
        { title: 'Encapsulation & Abstraction', desc: 'Encapsulation binds data and methods together (access control). Abstraction hides implementation details.' },
        { title: 'Polymorphism', desc: 'Compile-time (Method Overloading) vs Run-time (Method Overriding using Virtual functions/interfaces).' },
        { title: 'Virtual Functions & VTABLE', desc: 'C++ uses a Virtual Table (vtable) and vptr to perform dynamic dispatch at runtime.' },
      ],
      topQuestions: [
        { q: 'What is the difference between Abstract Class and Interface?', a: 'Abstract Class can contain implemented methods and state; Interface defines only method contracts (until default methods).' },
      ],
    },
  },
  {
    id: 'sd',
    icon: '🔐',
    name: 'System Design',
    code: 'CS701',
    qCount: 45,
    doneCount: 22,
    color: '#EF4444',
    cheatSheet: {
      summary: 'Scalability patterns, load balancing, caching strategies, rate limiting, and microservices.',
      keyConcepts: [
        { title: 'CAP Theorem', desc: 'A distributed system can guarantee at most two of Consistency, Availability, and Partition Tolerance.' },
        { title: 'Load Balancing & Caching', desc: 'Round-Robin, Least Connections, Consistent Hashing. Redis / Memcached for in-memory caching.' },
        { title: 'Database Sharding & Replication', desc: 'Horizontal partitioning (sharding) for scale; Master-Slave replication for read availability.' },
      ],
      topQuestions: [
        { q: 'How to design a URL Shortener like Bitly?', a: 'Base62 encoding of auto-incrementing ID or MD5 hash prefix, Redis cache for hot URLs, SQL DB for persistent mapping.' },
      ],
    },
  },
  {
    id: 'apt',
    icon: '🧮',
    name: 'Aptitude & Reasoning',
    code: 'APT101',
    qCount: 110,
    doneCount: 92,
    color: '#06B6D4',
    cheatSheet: {
      summary: 'Quantitative aptitude, logical reasoning, data interpretation, and speed math shortcuts.',
      keyConcepts: [
        { title: 'Time, Speed & Distance', desc: 'Speed = Distance / Time. Average Speed = 2xy / (x + y) for equal distances.' },
        { title: 'Permutations & Combinations', desc: 'nPr = n! / (n-r)!.  nCr = n! / [r! (n-r)!].' },
        { title: 'Probability Basics', desc: 'P(A) = Favorable Outcomes / Total Outcomes. P(A or B) = P(A) + P(B) - P(A and B).' },
      ],
      topQuestions: [
        { q: 'Two trains moving in opposite directions at 60 km/h and 40 km/h. Relative speed?', a: 'Relative Speed = 60 + 40 = 100 km/h.' },
      ],
    },
  },
];

/* ── INTERVIEW FLASHCARDS BANK ────────────────────────────────────────────── */
const FLASHCARDS = [
  { subjectId: 'os', q: 'What is a deadlock and what are its 4 necessary conditions?', a: 'Deadlock occurs when processes are blocked waiting for resources held by each other. Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.' },
  { subjectId: 'os', q: 'What is the difference between a process and a thread?', a: 'A process is an independent program execution with its own memory space. A thread is a lightweight execution unit inside a process sharing memory.' },
  { subjectId: 'dbms', q: 'What are ACID properties in DBMS?', a: 'Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (committed data stays permanent).' },
  { subjectId: 'dbms', q: 'What is 3NF vs BCNF in database normalization?', a: '3NF eliminates transitive dependencies. BCNF (stricter 3NF) requires every functional dependency X -> Y to have X as a super key.' },
  { subjectId: 'cn', q: 'What is the difference between TCP and UDP?', a: 'TCP is connection-oriented, reliable, and ordered. UDP is connectionless, fast, and unreliable (used in streaming and gaming).' },
  { subjectId: 'cn', q: 'What happens during a TCP 3-Way Handshake?', a: '1. Client sends SYN. 2. Server responds with SYN-ACK. 3. Client acknowledges with ACK. Connection is established.' },
  { subjectId: 'oop', q: 'Explain Runtime Polymorphism with an example.', a: 'Method Overriding allows a derived class to provide a specific implementation of a method declared in a base class (invoked via virtual function/vtable at runtime).' },
  { subjectId: 'sd', q: 'What is CAP Theorem in Distributed Systems?', a: 'In a distributed data store, you can only provide 2 of 3 guarantees: Consistency, Availability, and Partition Tolerance.' },
  { subjectId: 'apt', q: 'Formula for Average Speed when covering equal distance at speeds x and y?', a: 'Average Speed = (2 * x * y) / (x + y).' },
];

/* ── MULTI-SUBJECT TIMED QUIZ QUESTION BANK ──────────────────────────────── */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    subject: 'Operating Systems',
    question: 'Which CPU scheduling algorithm guarantees the minimum average waiting time for a given set of processes?',
    options: ['First Come First Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin Scheduling', 'Priority Scheduling'],
    correct: 1,
    explanation: 'Shortest Job First (SJF) is mathematically optimal because executing shorter tasks first minimizes the total accumulated waiting time.',
  },
  {
    id: 2,
    subject: 'DBMS',
    question: 'Which normal form eliminates partial dependencies where a non-key attribute depends on a proper subset of a candidate key?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correct: 1,
    explanation: '2NF requires the relation to be in 1NF and guarantees that every non-prime attribute is fully functionally dependent on primary key.',
  },
  {
    id: 3,
    subject: 'Computer Networks',
    question: 'At which layer of the OSI model does the Internet Protocol (IP) operate?',
    options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
    correct: 1,
    explanation: 'The IP protocol operates at Layer 3 (Network Layer) and handles packet routing and logical IP addressing.',
  },
  {
    id: 4,
    subject: 'OOP',
    question: 'Which object-oriented programming mechanism allows a single interface to represent different underlying data types?',
    options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
    correct: 2,
    explanation: 'Polymorphism ("many forms") enables a method or interface to behave differently based on the calling object.',
  },
  {
    id: 5,
    subject: 'System Design',
    question: 'Which algorithm is widely used in distributed caching to minimize key re-mapping when nodes are added or removed?',
    options: ['Round Robin Hashing', 'Consistent Hashing', 'MD5 Hashing', 'Linear Probing'],
    correct: 1,
    explanation: 'Consistent Hashing maps both keys and servers to a virtual ring, ensuring only K/n keys need re-location when a node changes.',
  },
  {
    id: 6,
    subject: 'Aptitude',
    question: 'A train 150m long crosses a telegraph pole in 9 seconds. What is the speed of the train in km/h?',
    options: ['50 km/h', '60 km/h', '72 km/h', '80 km/h'],
    correct: 1,
    explanation: 'Speed = Distance / Time = 150 / 9 = 50/3 m/s. In km/h: (50/3) * (18/5) = 60 km/h.',
  },
];

/* ── REVISION CHEAT SHEET MODAL ───────────────────────────────────────────── */
function CheatSheetModal({ subject, onClose }: { subject: SubjectItem; onClose: () => void }) {
  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="dashboard-widget-card" style={{ width: '600px', maxHeight: '85vh', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>{subject.icon}</span>
            <div>
              <span className="widget-title" style={{ fontSize: '16px' }}>{subject.name} — Cheat Sheet</span>
              <div style={{ fontSize: '11px', color: '#9CA3AF' }}>Code: {subject.code} · Essential Interview Revision</div>
            </div>
          </div>
          <button className="warmup-btn-dark" onClick={onClose} style={{ padding: '2px 8px' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Summary Box */}
          <div style={{ background: '#1A1C28', padding: '12px 14px', borderRadius: '8px', borderLeft: `3px solid ${subject.color}` }}>
            <div style={{ fontSize: '12px', color: '#D1D5DB', lineHeight: 1.6 }}>{subject.cheatSheet.summary}</div>
          </div>

          {/* Key Concepts */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>⚡ Core Principles</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subject.cheatSheet.keyConcepts.map((kc, i) => (
                <div key={i} style={{ background: '#1A1C28', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: subject.color, marginBottom: '4px' }}>{i + 1}. {kc.title}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: 1.5 }}>{kc.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Interview Q&As */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>🎯 Top Interview Questions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subject.cheatSheet.topQuestions.map((tq, i) => (
                <div key={i} style={{ background: 'rgba(124,58,237,0.08)', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Q: {tq.q}</div>
                  <div style={{ fontSize: '11px', color: '#10B981', lineHeight: 1.5 }}>A: {tq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="warmup-btn-purple" onClick={onClose}>Done Revising ✓</button>
        </div>
      </div>
    </div>
  );
}

/* ── TIMED QUIZ ASSESSMENT MODAL ─────────────────────────────────────────── */
function PlacementQuizModal({ onClose }: { onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft]     = useState(180);
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

  const handleSelect = (optIdx: number) => {
    if (isSubmitted) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correct) score++;
    });
    return score;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const score = calculateScore();
  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const finishAssessment = async () => {
    setIsSubmitted(true);
    try {
      await fetch('/api/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'quiz_completed', score, total: QUIZ_QUESTIONS.length }),
      });
    } catch {}
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="dashboard-widget-card" style={{ width: '560px', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span className="widget-title" style={{ fontSize: '16px' }}>⏱ CS Placement Mock Assessment</span>
          <button className="warmup-btn-dark" onClick={onClose} style={{ padding: '2px 8px' }}>✕</button>
        </div>

        {!isSubmitted ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', background: '#1A1C28', padding: '8px 14px', borderRadius: '20px' }}>
              <span style={{ fontSize: '12px', color: '#A78BFA', fontWeight: 600 }}>
                Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
              </span>
              <span style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: timeLeft < 30 ? '#EF4444' : '#38BDF8', fontWeight: 700 }}>
                ⏳ {formatTime(timeLeft)}
              </span>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <span className="prep-tag-pill" style={{ marginBottom: '6px', display: 'inline-block' }}>{currentQ.subject}</span>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>{currentQ.question}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {currentQ.options.map((opt, oIdx) => {
                const selected = answers[currentIdx] === oIdx;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(oIdx)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      textAlign: 'left',
                      fontSize: '12px',
                      cursor: 'pointer',
                      background: selected ? 'rgba(124,58,237,0.2)' : '#1A1C28',
                      border: `1px solid ${selected ? '#7C3AED' : 'rgba(255,255,255,0.06)'}`,
                      color: selected ? '#A78BFA' : '#D1D5DB',
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
                className="warmup-btn-dark"
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
              >
                ← Prev
              </button>
              {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
                <button className="warmup-btn-purple" onClick={() => setCurrentIdx(i => i + 1)}>
                  Next →
                </button>
              ) : (
                <button className="warmup-btn-purple" onClick={finishAssessment}>
                  Submit Test ✓
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎯</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Assessment Completed!</h2>
            <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '16px' }}>
              You scored <span style={{ color: '#10B981', fontWeight: 700 }}>{score} / {QUIZ_QUESTIONS.length}</span> ({((score / QUIZ_QUESTIONS.length) * 100).toFixed(0)}%)
            </p>

            <div style={{ background: '#1A1C28', borderRadius: '8px', padding: '14px', textAlign: 'left', marginBottom: '16px', maxHeight: '220px', overflowY: 'auto' }}>
              {QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.id} style={{ marginBottom: '10px', borderBottom: idx !== QUIZ_QUESTIONS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', paddingBottom: '8px' }}>
                  <div style={{ fontSize: '11px', color: answers[idx] === q.correct ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                    {answers[idx] === q.correct ? '✓ Correct' : '✕ Incorrect'} — Q{idx + 1}: {q.question}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    Correct: <strong style={{ color: '#fff' }}>{q.options[q.correct]}</strong>
                  </div>
                </div>
              ))}
            </div>

            <button className="warmup-btn-purple" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Close & Save Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── MAIN PLACEMENT ARENA PAGE ────────────────────────────────────────────── */
export default function PlacementPage() {
  const [selectedTrack, setSelectedTrack] = useState(COMPANY_TRACKS[0]);
  const [activeSubjectFilter, setActiveSubjectFilter] = useState('All');
  const [cardIdx, setCardIdx]               = useState(0);
  const [flipped, setFlipped]               = useState(false);
  const [showQuiz, setShowQuiz]             = useState(false);
  const [activeCheatSheet, setActiveCheatSheet] = useState<SubjectItem | null>(null);

  const filteredFlashcards = FLASHCARDS.filter(fc => {
    return activeSubjectFilter === 'All' || fc.subjectId === activeSubjectFilter;
  });

  const nextCard = () => {
    if (filteredFlashcards.length === 0) return;
    setCardIdx((i) => (i + 1) % filteredFlashcards.length);
    setFlipped(false);
  };

  const prevCard = () => {
    if (filteredFlashcards.length === 0) return;
    setCardIdx((i) => (i - 1 + filteredFlashcards.length) % filteredFlashcards.length);
    setFlipped(false);
  };

  const currentFlashcard = filteredFlashcards[cardIdx % (filteredFlashcards.length || 1)];

  return (
    <div className="dashboard-container" style={{ paddingBottom: '30px' }}>
      {/* ── Banner Hero Card ── */}
      <div className="dashboard-hero-card" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="hero-title">💼 Placement Arena & Target Hub</h1>
          <p className="hero-subtitle">Company Interview Tracks · CS Core Revision · Timed Mock Assessments</p>
        </div>
        <div className="hero-actions">
          <button className="btn-hero-purple" onClick={() => setShowQuiz(true)}>
            ⏱ Start Timed Placement Quiz
          </button>
        </div>
      </div>

      {/* ── Company Tracks Carousel / Selector ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
          🎯 Target Company Interview Tracks
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {COMPANY_TRACKS.map(track => {
            const isSel = selectedTrack.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                style={{
                  background: '#12131A',
                  border: `1px solid ${isSel ? track.color : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: '12px', padding: '16px', cursor: 'pointer',
                  transition: 'all 0.2s ease', boxShadow: isSel ? `0 0 20px ${track.color}25` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{track.logo}</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{track.name}</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: track.color, background: `${track.color}15`, padding: '2px 8px', borderRadius: '12px', border: `1px solid ${track.color}30` }}>
                    {track.difficulty}
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '8px' }}>
                  Readiness Level: <strong style={{ color: track.color }}>{track.readiness}%</strong>
                </div>

                {/* Progress bar */}
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '100px', height: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${track.readiness}%`, height: '100%', background: track.color, borderRadius: '100px' }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Track Detailed View */}
        <div className="dashboard-widget-card" style={{ marginTop: '14px', borderLeft: `4px solid ${selectedTrack.color}` }}>
          <div className="widget-header" style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '24px', marginRight: '8px' }}>{selectedTrack.logo}</span>
            <div style={{ flex: 1 }}>
              <span className="widget-title" style={{ fontSize: '16px' }}>{selectedTrack.name} Interview Track Overview</span>
            </div>
            <span className="prep-tag-pill">Target Batch 2025</span>
          </div>

          <div className="dashboard-row-grid" style={{ marginTop: '10px' }}>
            {/* Rounds */}
            <div style={{ background: '#1A1C28', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                📋 Interview Rounds Breakdown
              </div>
              {selectedTrack.rounds.map((r, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#D1D5DB', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: selectedTrack.color, fontWeight: 700 }}>R{i+1}:</span> {r}
                </div>
              ))}
            </div>

            {/* Topics */}
            <div style={{ background: '#1A1C28', padding: '14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                🔥 High-Frequency Focus Topics
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {selectedTrack.focusTopics.map(t => (
                  <span key={t} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '12px', background: `${selectedTrack.color}15`, color: selectedTrack.color, border: `1px solid ${selectedTrack.color}30`, fontWeight: 600 }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Split: Flashcards & CS Subject Revision ── */}
      <div className="dashboard-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>

        {/* Left Column: Flashcards Deck */}
        <div className="dashboard-widget-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="widget-header" style={{ marginBottom: '14px' }}>
            <div className="widget-icon-box">🃏</div>
            <span className="widget-title">High-Yield Flashcards</span>
            <select
              value={activeSubjectFilter}
              onChange={e => { setActiveSubjectFilter(e.target.value); setCardIdx(0); setFlipped(false); }}
              style={{ background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', outline: 'none' }}
            >
              <option value="All">All Subjects</option>
              <option value="os">OS</option>
              <option value="dbms">DBMS</option>
              <option value="cn">Networks</option>
              <option value="oop">OOP</option>
              <option value="sd">System Design</option>
              <option value="apt">Aptitude</option>
            </select>
          </div>

          {/* Flashcard Box */}
          {currentFlashcard ? (
            <div
              id="flashcard"
              onClick={() => setFlipped(f => !f)}
              style={{
                flex: 1, minHeight: '160px',
                background: flipped ? 'rgba(16, 185, 129, 0.08)' : 'rgba(124, 58, 237, 0.08)',
                border: `1px solid ${flipped ? 'rgba(16, 185, 129, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
                borderRadius: '12px', padding: '20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', transition: 'all 0.3s ease',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: flipped ? '#10B981' : '#A78BFA', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>
                  {flipped ? '✓ ANSWER' : '❓ QUESTION (Click card to flip)'}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.6 }}>
                  {flipped ? currentFlashcard.a : currentFlashcard.q}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: '#6B7280', fontSize: '12px' }}>No flashcards found for selected subject.</div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', alignItems: 'center' }}>
            <button id="btn-prev-card" onClick={prevCard} className="warmup-btn-dark" style={{ padding: '4px 12px' }}>← Prev</button>
            <span style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#9CA3AF' }}>
              {filteredFlashcards.length > 0 ? (cardIdx % filteredFlashcards.length) + 1 : 0} / {filteredFlashcards.length}
            </span>
            <button id="btn-next-card" onClick={nextCard} className="warmup-btn-dark" style={{ padding: '4px 12px' }}>Next →</button>
          </div>
        </div>

        {/* Right Column: CS Subject Revision Cards */}
        <div className="dashboard-widget-card">
          <div className="widget-header" style={{ marginBottom: '14px' }}>
            <div className="widget-icon-box">📚</div>
            <span className="widget-title">CS Core & Aptitude Progress</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CS_SUBJECTS.map(subj => {
              const pct = Math.round((subj.doneCount / subj.qCount) * 100);
              return (
                <div key={subj.id} style={{ background: '#1A1C28', borderRadius: '8px', padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{subj.icon}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{subj.name}</span>
                    </div>
                    <button
                      className="warmup-btn-dark"
                      style={{ fontSize: '11px', padding: '2px 8px' }}
                      onClick={() => setActiveCheatSheet(subj)}
                    >
                      Revision Notes 📖
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9CA3AF', marginBottom: '5px' }}>
                    <span>Progress: {subj.doneCount} / {subj.qCount} solved</span>
                    <span style={{ color: subj.color, fontWeight: 700 }}>{pct}%</span>
                  </div>

                  {/* Progress bar */}
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '100px', height: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: subj.color, borderRadius: '100px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── Modals ── */}
      {showQuiz && <PlacementQuizModal onClose={() => setShowQuiz(false)} />}
      {activeCheatSheet && <CheatSheetModal subject={activeCheatSheet} onClose={() => setActiveCheatSheet(null)} />}
    </div>
  );
}

