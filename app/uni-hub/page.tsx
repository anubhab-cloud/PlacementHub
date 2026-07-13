'use client';
import { useState, useEffect } from 'react';

type DocumentItem = {
  id:        string;
  title:     string;
  type:      'Note' | 'PYQ' | 'Syllabus';
  subjectId: string;
  year?:     string;
  author:    string;
  content?:  string;
  fileSize?: string;
};

const INITIAL_SUBJECTS = [
  { id: 'ds',   icon: '📐', name: 'Data Structures',       semester: 3, code: 'CS301', desc: 'Arrays, Linked Lists, Trees, Graphs & Recursion' },
  { id: 'dbms', icon: '🗃', name: 'Database Systems',       semester: 5, code: 'CS502', desc: 'Relational Model, ER Diagrams, SQL, Normalization & Transactions' },
  { id: 'os',   icon: '🖥', name: 'Operating Systems',       semester: 5, code: 'CS501', desc: 'Process Scheduling, Deadlocks, Memory & File Systems' },
  { id: 'cn',   icon: '🌐', name: 'Computer Networks',      semester: 6, code: 'CS601', desc: 'OSI Model, TCP/IP, Routing Protocols & Network Security' },
  { id: 'algo', icon: '📊', name: 'Algorithms',              semester: 4, code: 'CS401', desc: 'Divide & Conquer, Dynamic Programming, Greedy & Graph Traversal' },
  { id: 'toc',  icon: '🧮', name: 'Theory of Computation', semester: 6, code: 'CS602', desc: 'Automata Theory, Context-Free Grammars & Turing Machines' },
];

const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id:        'd1',
    title:     'Binary Search Trees & AVL Balancing Notes',
    type:      'Note',
    subjectId: 'ds',
    author:    'Prof. Sharma (CSE Dept)',
    fileSize:  '2.4 MB',
    content:   `DATA STRUCTURES — BINARY SEARCH TREES (BST)

1. Properties of BST:
   - For any node N, key(left_child) < key(N) < key(right_child).
   - Inorder traversal yields elements in strictly ascending sorted order.
   - Time Complexity:
     * Search/Insert/Delete (Balanced): O(log N)
     * Search/Insert/Delete (Skewed): O(N)

2. AVL Tree Self-Balancing:
   - Balance Factor = Height(Left Subtree) - Height(Right Subtree)
   - Admissible balance factor values: {-1, 0, +1}
   - Rotations: LL, RR, LR, RL.`,
  },
  {
    id:        'd2',
    title:     '2023 End-Semester Data Structures Question Paper',
    type:      'PYQ',
    subjectId: 'ds',
    year:      '2023',
    author:    'Examination Board',
    fileSize:  '1.8 MB',
    content:   `UNIVERSITY END-SEMESTER EXAMINATION 2023
Subject: Data Structures (CS301) | Time: 3 Hours | Max Marks: 100

SECTION A (Short Answer - 5 x 4 = 20 Marks)
Q1. Define a circular queue and derive its full condition.
Q2. Differentiate between BFS and DFS algorithm complexities.
Q3. Explain height-balanced AVL tree with a suitable diagram.
Q4. Trace QuickSort on array: [38, 27, 43, 3, 9, 82, 10].

SECTION B (Long Answer - 4 x 20 = 80 Marks)
Q5. (a) Implement Dijkstra's Single Source Shortest Path Algorithm.
    (b) Analyze the amortized complexity of Union-Find disjoint sets.`,
  },
  {
    id:        'd3',
    title:     'CPU Scheduling & Concurrency Control Comprehensive Notes',
    type:      'Note',
    subjectId: 'os',
    author:    'Dr. Mukherjee',
    fileSize:  '3.1 MB',
    content:   `OPERATING SYSTEMS — PROCESS MANAGEMENT & CPU SCHEDULING

1. Process States:
   New -> Ready -> Running -> Waiting -> Terminated

2. Scheduling Criteria:
   - CPU Utilization: Maximize
   - Throughput: Maximize processes completed per unit time
   - Turnaround Time: Submission to Completion
   - Waiting Time: Total spent in ready queue
   - Response Time: Submission to first response

3. Deadlock Necessary Conditions (Coffman Conditions):
   1. Mutual Exclusion
   2. Hold and Wait
   3. No Preemption
   4. Circular Wait`,
  },
  {
    id:        'd4',
    title:     '2022 DBMS Mid-Semester PYQ with Detailed Solutions',
    type:      'PYQ',
    subjectId: 'dbms',
    year:      '2022',
    author:    'Student Academic Cell',
    fileSize:  '2.1 MB',
    content:   `DATABASE MANAGEMENT SYSTEMS — MID-SEM 2022 WITH SOLUTIONS

Q1. Convert ER diagram of University Portal into relational schema.
Solution:
   Student(RollNo PK, Name, DeptId FK)
   Department(DeptId PK, DeptName)
   Course(CourseId PK, CourseTitle, Credits)

Q2. Prove that 3NF is stricter than 2NF.
Solution:
   2NF requires no partial dependencies (non-prime dependent on subset of candidate key).
   3NF requires no transitive dependencies (X -> Y where neither X is superkey nor Y is prime attribute).`,
  },
  {
    id:        'd5',
    title:     'Computer Networks OSI 7-Layer Protocol Breakdown',
    type:      'Note',
    subjectId: 'cn',
    author:    'Prof. K. Sen',
    fileSize:  '4.2 MB',
    content:   `COMPUTER NETWORKS — OSI & TCP/IP REFERENCE MODELS

1. Application Layer (HTTP, FTP, SMTP, DNS)
2. Presentation Layer (SSL/TLS, ASCII, Encryption)
3. Session Layer (RPC, NetBIOS, Session Checkpoints)
4. Transport Layer (TCP, UDP, Port Numbers, Windowing)
5. Network Layer (IP, ICMP, OSPF, BGP, Routers)
6. Data Link Layer (Ethernet, MAC Addresses, Switches)
7. Physical Layer (Cables, Bits, Modulation, Hubs)`,
  },
];

export default function UniHubPage() {
  const [selectedSem, setSelectedSem]       = useState<string>('All');
  const [selectedType, setSelectedType]     = useState<string>('All');
  const [searchQuery, setSearchQuery]       = useState<string>('');
  const [documents, setDocuments]           = useState<DocumentItem[]>(DEFAULT_DOCUMENTS);
  const [activeSubject, setActiveSubject]   = useState<typeof INITIAL_SUBJECTS[0] | null>(null);
  const [previewDoc, setPreviewDoc]         = useState<DocumentItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states
  const [upTitle, setUpTitle]     = useState('');
  const [upSubject, setUpSubject] = useState(INITIAL_SUBJECTS[0].id);
  const [upType, setUpType]       = useState<'Note' | 'PYQ' | 'Syllabus'>('Note');
  const [upAuthor, setUpAuthor]   = useState('');
  const [upContent, setUpContent] = useState('');

  // Load saved custom docs from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('placementhub_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDocuments([...DEFAULT_DOCUMENTS, ...parsed]);
      }
    } catch { /* fallback */ }
  }, []);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upTitle.trim()) return;

    const newDoc: DocumentItem = {
      id:        `custom_${Date.now()}`,
      title:     upTitle,
      type:      upType,
      subjectId: upSubject,
      author:    upAuthor || 'Student User',
      fileSize:  '1.5 MB',
      content:   upContent || `# ${upTitle}\n\nUploaded notes content for revision.`,
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);

    // Save custom ones to localStorage
    try {
      const customOnly = updated.filter(d => d.id.startsWith('custom_'));
      localStorage.setItem('placementhub_notes', JSON.stringify(customOnly));
    } catch { /* storage full fallback */ }

    setShowUploadModal(false);
    setUpTitle('');
    setUpAuthor('');
    setUpContent('');
    alert(`✅ "${upTitle}" has been added to your Notes library!`);
  };

  const downloadDoc = (doc: DocumentItem) => {
    const blob = new Blob([doc.content || doc.title], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredSubjects = INITIAL_SUBJECTS.filter(s => {
    const matchSem = selectedSem === 'All' || s.semester.toString() === selectedSem;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSem && matchSearch;
  });

  const getSubjectDocs = (subjectId: string) => {
    return documents.filter(d => {
      const matchSub = d.subjectId === subjectId;
      const matchType = selectedType === 'All' || d.type === selectedType;
      return matchSub && matchType;
    });
  };

  return (
    <div>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="page-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">🎓 University Portal</h1>
          <p className="page-subtitle">Curated course notes, exam PYQs & syllabi archive</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '100px', padding: '6px 14px', width: '220px',
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search notes or codes..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '12px', width: '100%' }}
            />
          </div>

          {/* Semester dropdown */}
          <select
            value={selectedSem}
            onChange={e => setSelectedSem(e.target.value)}
            style={{
              background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-1)', padding: '8px 14px', borderRadius: '100px', fontSize: '12px',
              outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="All">All Semesters</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
          </select>

          <button className="btn btn-violet" onClick={() => setShowUploadModal(true)}>
            ⬆ Upload Study Material
          </button>
        </div>
      </div>

      {/* ── Type Filter Pills ───────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'Note', 'PYQ', 'Syllabus'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '6px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: 700,
              cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              background: selectedType === type ? 'var(--violet)' : 'var(--black-2)',
              color: selectedType === type ? '#fff' : 'var(--text-3)',
              boxShadow: selectedType === type ? 'var(--glow-violet)' : 'none',
            }}
          >
            {type === 'All' ? '📁 All Types' : type === 'Note' ? '📝 Lecture Notes' : type === 'PYQ' ? '📜 PYQs & Exam Papers' : '📋 Syllabi'}
          </button>
        ))}
      </div>

      {/* ── Subject Cards Grid ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredSubjects.map(s => {
          const docs = getSubjectDocs(s.id);
          return (
            <div className="card" key={s.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ fontSize: '32px' }}>{s.icon}</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="pill pill-cyan" style={{ fontSize: '9px' }}>{s.code}</span>
                  <span className="pill pill-violet" style={{ fontSize: '9px' }}>Sem {s.semester}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px', color: '#fff' }}>{s.name}</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-2)', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>{s.desc}</p>

              <div style={{ background: 'var(--black-3)', borderRadius: 'var(--r-md)', padding: '10px 12px', marginBottom: '14px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                  Available Files ({docs.length})
                </div>
                {docs.length === 0 ? (
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', fontStyle: 'italic' }}>No matching files</div>
                ) : (
                  docs.slice(0, 2).map(d => (
                    <div
                      key={d.id}
                      onClick={() => setPreviewDoc(d)}
                      style={{
                        fontSize: '11px', color: 'var(--cyan)', cursor: 'pointer',
                        padding: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <span>{d.type === 'PYQ' ? '📜' : '📝'}</span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>View →</span>
                    </div>
                  ))
                )}
              </div>

              <button
                className="btn btn-outline-violet btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setActiveSubject(s)}
              >
                Explore All {docs.length} Resources →
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Subject Document List Modal ──────────────────────────── */}
      {activeSubject && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setActiveSubject(null)}>
          <div className="modal-box" style={{ width: '580px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ marginBottom: '10px' }}>
              <span className="modal-title">{activeSubject.icon} {activeSubject.name} — Library</span>
              <button className="modal-close" onClick={() => setActiveSubject(null)}>✕</button>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '14px' }}>
              Code: <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{activeSubject.code}</span> · Semester {activeSubject.semester}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
              {getSubjectDocs(activeSubject.id).map(d => (
                <div
                  key={d.id}
                  style={{
                    background: 'var(--black-3)', padding: '14px', borderRadius: 'var(--r-md)',
                    border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px',
                  }}
                >
                  <div style={{ fontSize: '24px' }}>{d.type === 'PYQ' ? '📜' : '📝'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {d.title}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>
                      Author: {d.author} {d.fileSize ? `· ${d.fileSize}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn btn-outline-cyan btn-xs"
                      onClick={() => setPreviewDoc(d)}
                    >
                      Preview 👁
                    </button>
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => downloadDoc(d)}
                    >
                      Download ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Document Reader / Preview Modal ────────────────────── */}
      {previewDoc && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPreviewDoc(null)}>
          <div className="modal-box" style={{ width: '640px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ marginBottom: '10px' }}>
              <div>
                <span className="pill pill-violet" style={{ fontSize: '9px', marginBottom: '4px', display: 'inline-block' }}>
                  {previewDoc.type} Document
                </span>
                <div className="modal-title" style={{ fontSize: '16px' }}>{previewDoc.title}</div>
              </div>
              <button className="modal-close" onClick={() => setPreviewDoc(null)}>✕</button>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              Author: {previewDoc.author} · Verified Document Reader
            </div>

            {/* Document Text Body Reader */}
            <div style={{
              flex: 1, overflowY: 'auto', background: '#0a0a0a', padding: '20px',
              borderRadius: 'var(--r-md)', border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: "'JetBrains Mono', Consolas, monospace", fontSize: '12px',
              color: 'var(--green)', lineHeight: 1.7, whiteSpace: 'pre-wrap',
            }}>
              {previewDoc.content || `[DOCUMENT CONTENT READ ERROR]\nRaw PDF file attached for download.`}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Format: UTF-8 Text / PDF Stream</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setPreviewDoc(null)}>Close Reader</button>
                <button className="btn btn-violet btn-sm" onClick={() => downloadDoc(previewDoc)}>Download File ↓</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Upload Document Modal ──────────────────────────────── */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowUploadModal(false)}>
          <div className="modal-box" style={{ width: '480px' }}>
            <div className="modal-header">
              <span className="modal-title">⬆ Upload Study Material</span>
              <button className="modal-close" onClick={() => setShowUploadModal(false)}>✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-2)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2023 OS Mid-Sem Question Paper"
                  value={upTitle}
                  onChange={e => setUpTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-2)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Subject</label>
                  <select
                    value={upSubject}
                    onChange={e => setUpSubject(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', outline: 'none' }}
                  >
                    {INITIAL_SUBJECTS.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (Sem {s.semester})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-2)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Category Type</label>
                  <select
                    value={upType}
                    onChange={e => setUpType(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', outline: 'none' }}
                  >
                    <option value="Note">Lecture Note</option>
                    <option value="PYQ">Previous Year Question (PYQ)</option>
                    <option value="Syllabus">Syllabus</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-2)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Author / Uploader Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anubhab C."
                  value={upAuthor}
                  onChange={e => setUpAuthor(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-2)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Text / Content Snippet</label>
                <textarea
                  rows={4}
                  placeholder="Paste study notes or text content here..."
                  value={upContent}
                  onChange={e => setUpContent(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', outline: 'none', fontFamily: 'monospace' }}
                />
              </div>

              <button type="submit" className="btn btn-violet" style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}>
                Save to Notes Library ✓
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
