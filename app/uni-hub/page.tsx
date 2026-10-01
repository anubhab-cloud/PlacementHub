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
    content:   `DATA STRUCTURES — BINARY SEARCH TREES (BST)\n\n1. Properties of BST:\n   - For any node N, key(left_child) < key(N) < key(right_child).\n   - Inorder traversal yields elements in strictly ascending sorted order.\n   - Time Complexity:\n     * Search/Insert/Delete (Balanced): O(log N)\n     * Search/Insert/Delete (Skewed): O(N)\n\n2. AVL Tree Self-Balancing:\n   - Balance Factor = Height(Left Subtree) - Height(Right Subtree)\n   - Admissible balance factor values: {-1, 0, +1}\n   - Rotations: LL, RR, LR, RL.`,
  },
  {
    id:        'd2',
    title:     '2023 End-Semester Data Structures Question Paper',
    type:      'PYQ',
    subjectId: 'ds',
    year:      '2023',
    author:    'Examination Board',
    fileSize:  '1.8 MB',
    content:   `UNIVERSITY END-SEMESTER EXAMINATION 2023\nSubject: Data Structures (CS301) | Time: 3 Hours | Max Marks: 100\n\nSECTION A (Short Answer - 5 x 4 = 20 Marks)\nQ1. Define a circular queue and derive its full condition.\nQ2. Differentiate between BFS and DFS algorithm complexities.\nQ3. Explain height-balanced AVL tree with a suitable diagram.\nQ4. Trace QuickSort on array: [38, 27, 43, 3, 9, 82, 10].\n\nSECTION B (Long Answer - 4 x 20 = 80 Marks)\nQ5. (a) Implement Dijkstra's Single Source Shortest Path Algorithm.\n    (b) Analyze the amortized complexity of Union-Find disjoint sets.`,
  },
  {
    id:        'd3',
    title:     'CPU Scheduling & Concurrency Control Comprehensive Notes',
    type:      'Note',
    subjectId: 'os',
    author:    'Dr. Mukherjee',
    fileSize:  '3.1 MB',
    content:   `OPERATING SYSTEMS — PROCESS MANAGEMENT & CPU SCHEDULING\n\n1. Process States:\n   New -> Ready -> Running -> Waiting -> Terminated\n\n2. Scheduling Criteria:\n   - CPU Utilization: Maximize\n   - Throughput: Maximize processes completed per unit time\n   - Turnaround Time: Submission to Completion\n   - Waiting Time: Total spent in ready queue\n   - Response Time: Submission to first response\n\n3. Deadlock Necessary Conditions (Coffman Conditions):\n   1. Mutual Exclusion\n   2. Hold and Wait\n   3. No Preemption\n   4. Circular Wait`,
  },
  {
    id:        'd4',
    title:     '2022 DBMS Mid-Semester PYQ with Detailed Solutions',
    type:      'PYQ',
    subjectId: 'dbms',
    year:      '2022',
    author:    'Student Academic Cell',
    fileSize:  '2.1 MB',
    content:   `DATABASE MANAGEMENT SYSTEMS — MID-SEM 2022 WITH SOLUTIONS\n\nQ1. Convert ER diagram of University Portal into relational schema.\nSolution:\n   Student(RollNo PK, Name, DeptId FK)\n   Department(DeptId PK, DeptName)\n   Course(CourseId PK, CourseTitle, Credits)\n\nQ2. Prove that 3NF is stricter than 2NF.\nSolution:\n   2NF requires no partial dependencies (non-prime dependent on subset of candidate key).\n   3NF requires no transitive dependencies (X -> Y where neither X is superkey nor Y is prime attribute).`,
  },
  {
    id:        'd5',
    title:     'Computer Networks OSI 7-Layer Protocol Breakdown',
    type:      'Note',
    subjectId: 'cn',
    author:    'Prof. K. Sen',
    fileSize:  '4.2 MB',
    content:   `COMPUTER NETWORKS — OSI & TCP/IP REFERENCE MODELS\n\n1. Application Layer (HTTP, FTP, SMTP, DNS)\n2. Presentation Layer (SSL/TLS, ASCII, Encryption)\n3. Session Layer (RPC, NetBIOS, Session Checkpoints)\n4. Transport Layer (TCP, UDP, Port Numbers, Windowing)\n5. Network Layer (IP, ICMP, OSPF, BGP, Routers)\n6. Data Link Layer (Ethernet, MAC Addresses, Switches)\n7. Physical Layer (Cables, Bits, Modulation, Hubs)`,
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
    } catch {}
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

    try {
      const customOnly = updated.filter(d => d.id.startsWith('custom_'));
      localStorage.setItem('placementhub_notes', JSON.stringify(customOnly));
    } catch {}

    setShowUploadModal(false);
    setUpTitle('');
    setUpAuthor('');
    setUpContent('');
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
    <div className="dashboard-container" style={{ paddingBottom: '30px' }}>
      {/* ── Banner Hero Card ── */}
      <div className="dashboard-hero-card" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="hero-title">🎓 University Portal</h1>
          <p className="hero-subtitle">Curated course notes, end-sem PYQs & official syllabi archive.</p>
        </div>
        <div className="hero-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '6px 12px', width: '200px',
          }}>
            <span style={{ fontSize: '13px', color: '#9CA3AF' }}>🔍</span>
            <input
              type="text"
              placeholder="Search subject..."
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
              background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff', padding: '7px 12px', borderRadius: '8px', fontSize: '12px',
              outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="All">All Semesters</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
          </select>

          <button className="warmup-btn-purple" onClick={() => setShowUploadModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>⬆ Upload Note</span>
          </button>
        </div>
      </div>

      {/* ── Type Filter Pills ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'Note', 'PYQ', 'Syllabus'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              background: selectedType === type ? '#7C3AED' : '#12131A',
              color: selectedType === type ? '#fff' : '#9CA3AF',
              boxShadow: selectedType === type ? '0 0 14px rgba(124,58,237,0.4)' : 'none',
              border: selectedType === type ? '1px solid #7C3AED' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {type === 'All' ? '📁 All Types' : type === 'Note' ? '📝 Lecture Notes' : type === 'PYQ' ? '📜 PYQs & Papers' : '📋 Syllabi'}
          </button>
        ))}
      </div>

      {/* ── Subject Cards Grid ── */}
      <div className="dashboard-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filteredSubjects.map(s => {
          const docs = getSubjectDocs(s.id);
          return (
            <div className="dashboard-widget-card" key={s.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="widget-header" style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '24px', marginRight: '6px' }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <span className="widget-title" style={{ fontSize: '15px' }}>{s.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="prep-tag-pill" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8', borderColor: 'rgba(56, 189, 248, 0.2)' }}>{s.code}</span>
                  <span className="prep-tag-pill">Sem {s.semester}</span>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>{s.desc}</p>

              <div style={{ background: '#1A1C28', borderRadius: '8px', padding: '10px 12px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                  Available Files ({docs.length})
                </div>
                {docs.length === 0 ? (
                  <div style={{ fontSize: '11px', color: '#6B7280', fontStyle: 'italic' }}>No matching files</div>
                ) : (
                  docs.slice(0, 2).map(d => (
                    <div
                      key={d.id}
                      onClick={() => setPreviewDoc(d)}
                      style={{
                        fontSize: '11px', color: '#A78BFA', cursor: 'pointer',
                        padding: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <span>{d.type === 'PYQ' ? '📜' : '📝'}</span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</span>
                      <span style={{ fontSize: '10px', color: '#6B7280' }}>View →</span>
                    </div>
                  ))
                )}
              </div>

              <button
                className="warmup-btn-dark"
                style={{ width: '100%', justifyContent: 'center', fontSize: '12px', padding: '8px' }}
                onClick={() => setActiveSubject(s)}
              >
                Explore All {docs.length} Resources →
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Subject Document List Modal ── */}
      {activeSubject && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="dashboard-widget-card" style={{ width: '560px', maxHeight: '85vh', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="widget-title" style={{ fontSize: '16px' }}>{activeSubject.icon} {activeSubject.name} Resources</span>
              <button className="warmup-btn-dark" onClick={() => setActiveSubject(null)} style={{ padding: '2px 8px' }}>✕</button>
            </div>

            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '14px' }}>
              Subject Code: <span style={{ color: '#38BDF8', fontWeight: 600 }}>{activeSubject.code}</span> · Semester {activeSubject.semester}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
              {getSubjectDocs(activeSubject.id).map(d => (
                <div
                  key={d.id}
                  style={{
                    background: '#1A1C28', padding: '12px 14px', borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px',
                  }}
                >
                  <div style={{ fontSize: '22px' }}>{d.type === 'PYQ' ? '📜' : '📝'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {d.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>
                      Author: {d.author} {d.fileSize ? `· ${d.fileSize}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="warmup-btn-dark" onClick={() => setPreviewDoc(d)} style={{ fontSize: '11px', padding: '4px 8px' }}>Preview 👁</button>
                    <button className="warmup-btn-purple" onClick={() => downloadDoc(d)} style={{ fontSize: '11px', padding: '4px 8px' }}>Download ↓</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Document Reader / Preview Modal ── */}
      {previewDoc && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="dashboard-widget-card" style={{ width: '640px', maxHeight: '85vh', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <span className="prep-tag-pill" style={{ marginBottom: '4px', display: 'inline-block' }}>{previewDoc.type} Document</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>{previewDoc.title}</div>
              </div>
              <button className="warmup-btn-dark" onClick={() => setPreviewDoc(null)} style={{ padding: '2px 8px' }}>✕</button>
            </div>

            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              Author: {previewDoc.author} · PlacementHub Verified Document Reader
            </div>

            {/* Document Text Reader */}
            <div style={{
              flex: 1, overflowY: 'auto', background: '#090A0F', padding: '16px',
              borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: "'JetBrains Mono', Consolas, monospace", fontSize: '12px',
              color: '#10B981', lineHeight: 1.7, whiteSpace: 'pre-wrap',
            }}>
              {previewDoc.content || `[DOCUMENT CONTENT READ ERROR]\nRaw PDF file attached for download.`}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#6B7280' }}>Format: UTF-8 Text / PDF Stream</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="warmup-btn-dark" onClick={() => setPreviewDoc(null)}>Close Reader</button>
                <button className="warmup-btn-purple" onClick={() => downloadDoc(previewDoc)}>Download File ↓</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Upload Document Modal ── */}
      {showUploadModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleUploadSubmit} className="dashboard-widget-card" style={{ width: '480px', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="widget-title" style={{ fontSize: '16px' }}>⬆ Upload Study Material</span>
              <button type="button" className="warmup-btn-dark" onClick={() => setShowUploadModal(false)} style={{ padding: '2px 8px' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2023 OS Mid-Sem Question Paper"
                  value={upTitle}
                  onChange={e => setUpTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Subject</label>
                  <select
                    value={upSubject}
                    onChange={e => setUpSubject(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                  >
                    {INITIAL_SUBJECTS.map(s => (
                      <option key={s.id} value={s.id}>{s.name} (Sem {s.semester})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Category Type</label>
                  <select
                    value={upType}
                    onChange={e => setUpType(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                  >
                    <option value="Note">Lecture Note</option>
                    <option value="PYQ">Previous Year Question (PYQ)</option>
                    <option value="Syllabus">Syllabus</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Author / Uploader Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anubhab C."
                  value={upAuthor}
                  onChange={e => setUpAuthor(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Text / Content Snippet</label>
                <textarea
                  rows={4}
                  placeholder="Paste study notes or text content here..."
                  value={upContent}
                  onChange={e => setUpContent(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button type="button" className="warmup-btn-dark" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="warmup-btn-purple">Save to Notes Library ✓</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

