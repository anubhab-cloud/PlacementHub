'use client';
import { useState, useEffect } from 'react';

type DocumentItem = {
  id:          string;
  title:       string;
  type:        'Note' | 'PYQ' | 'Syllabus';
  subjectId:   string;
  subjectCode?: string;
  year?:       string;
  author:      string;
  content?:    string;
  fileSize?:   string;
};

const ALL_SUBJECTS = [
  // Sem 1 & 2
  { id: 'mat11', icon: '🔢', name: 'Transform Calculus & Linear Algebra', semester: 1, code: '21MAT11', desc: 'Matrices, Vector Calculus, Laplace Transforms & Fourier Series' },
  { id: 'phy12', icon: '⚛️', name: 'Engineering Physics',                semester: 1, code: '21PHY12', desc: 'Modern Physics, Quantum Mechanics, Lasers & Optical Fibers' },
  { id: 'cpl15', icon: '💻', name: 'C Programming for Problem Solving',   semester: 1, code: '21CPL15', desc: 'Variables, Conditionals, Loops, Arrays, Functions & Pointers' },
  { id: 'mat21', icon: '📐', name: 'Advanced Calculus & Numerical Methods', semester: 2, code: '21MAT21', desc: 'Differential Equations, Interpolation & Numerical Integration' },
  { id: 'che22', icon: '🧪', name: 'Engineering Chemistry',              semester: 2, code: '21CHE22', desc: 'Electrochemistry, Corrosion Control, Polymers & Nanomaterials' },

  // Sem 3
  { id: '21cs32', icon: '🧱', name: 'Data Structures and Applications',   semester: 3, code: '21CS32', desc: 'Stack, Queue, Linked Lists, Trees, Graphs & Hashing' },
  { id: '21cs33', icon: '⚡', name: 'Digital Design & Computer Org.',     semester: 3, code: '21CS33', desc: 'Logic Gates, Combinational Circuits, CPU Architecture & Memory' },
  { id: '21cs34', icon: '☕', name: 'Object Oriented Programming (C++)',  semester: 3, code: '21CS34', desc: 'Classes, Objects, Inheritance, Polymorphism, Templates & STL' },
  { id: '21mat31', icon: '🧮', name: 'Discrete Mathematical Structures',  semester: 3, code: '21MAT31', desc: 'Set Theory, Relations, Graph Theory & Algebraic Structures' },

  // Sem 4
  { id: '21cs42', icon: '📊', name: 'Design and Analysis of Algorithms',  semester: 4, code: '21CS42', desc: 'Divide & Conquer, Dynamic Programming, Greedy & NP-Completeness' },
  { id: '21cs43', icon: '🤖', name: 'Microcontrollers & Embedded Systems', semester: 4, code: '21CS43', desc: 'ARM Cortex Architecture, Assembly Language & Interfacing' },
  { id: '21cs44', icon: '🖥', name: 'Operating Systems',                  semester: 4, code: '21CS44', desc: 'Processes, CPU Scheduling, Deadlocks, Paging & File Systems' },
  { id: '21cs45', icon: '🛠', name: 'Software Engineering',              semester: 4, code: '21CS45', desc: 'SDLC Agile Models, Requirements, UML & Software Testing' },

  // Sem 5
  { id: '21cs51', icon: '🔣', name: 'Automata Theory and Computability',   semester: 5, code: '21CS51', desc: 'DFA, NFA, Context-Free Grammars, Pushdown Automata & Turing Machines' },
  { id: '21cs52', icon: '🌐', name: 'Computer Networks and Security',     semester: 5, code: '21CS52', desc: 'OSI Model, TCP/UDP, IP Subnetting, Routing Protocols & RSA' },
  { id: '21cs53', icon: '🗃', name: 'Database Management System',        semester: 5, code: '21CS53', desc: 'ER Modeling, SQL, Normalization (1NF-BCNF) & Transactions' },
  { id: '21cs54', icon: '🧠', name: 'Artificial Intelligence & ML',       semester: 5, code: '21CS54', desc: 'Heuristic Search, Decision Trees, Neural Networks & SVM' },

  // Sem 6
  { id: '21cs61', icon: '⚙️', name: 'System Software & Compilers',        semester: 6, code: '21CS61', desc: 'Assemblers, Lexical Analysis, Parsing (LL/LR) & Code Generation' },
  { id: '21cs62', icon: '🎨', name: 'Computer Graphics & Visualization',   semester: 6, code: '21CS62', desc: 'OpenGL, 2D/3D Transformations, Clipping & Lighting' },
  { id: '21cs63', icon: '🌐', name: 'Web Technology & Applications',      semester: 6, code: '21CS63', desc: 'HTML5, CSS3, JavaScript, PHP, MySQL & REST APIs' },
  { id: '21cs64', icon: '📈', name: 'Data Science & Analytics',           semester: 6, code: '21CS64', desc: 'Pandas, NumPy, Exploratory Data Analysis & Predictive Modeling' },

  // Sem 7
  { id: '21cs71', icon: '☁️', name: 'Cloud Computing and Services',       semester: 7, code: '21CS71', desc: 'Virtualization, AWS, Azure, IaaS, PaaS, SaaS & Serverless' },
  { id: '21cs72', icon: '🗄️', name: 'Big Data Analytics',                 semester: 7, code: '21CS72', desc: 'Hadoop, MapReduce, HDFS, Spark & NoSQL Databases' },
  { id: '21cs73', icon: '🔒', name: 'Information & Network Security',     semester: 7, code: '21CS73', desc: 'Cryptography, Firewalls, IPSec, Digital Signatures & Ethical Hacking' },

  // Sem 8
  { id: '21cs81', icon: '📡', name: 'Internet of Things & Cyber Security', semester: 8, code: '21CS82', desc: 'IoT Sensors, MQTT, Raspberry Pi & Cyber Threat Intelligence' },
];

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id:        'd1',
    title:     'VTU 2023 End-Sem Data Structures (21CS32) Question Paper & Solutions',
    type:      'PYQ',
    subjectId: '21cs32',
    subjectCode: '21CS32',
    year:      '2023',
    author:    'VTU Examination Board (VTU Circle Scrape)',
    fileSize:  '2.4 MB',
    content:   `VISVESVARAYA TECHNOLOGICAL UNIVERSITY (VTU)\n3rd Semester B.E. Examination — Jan/Feb 2023\nCourse: Data Structures and Applications (21CS32)\nTime: 3 Hours | Max Marks: 100\n\nMODULE 1\n1.a) Explain dynamic memory allocation functions (malloc, calloc, realloc, free) with C syntax. (6 Marks)\n1.b) Write an algorithm to evaluate a Postfix expression using Stack. Trace for: 6 2 3 + * 5 - (8 Marks)\n1.c) Describe sparse matrix representation using tri-tuple form. (6 Marks)\n\nMODULE 2\n2.a) Develop C routines to implement Queue using Singly Linked List. (10 Marks)\n2.b) Demonstrate polynomial addition using Circular Singly Linked List with head node. (10 Marks)\n\nMODULE 3\n3.a) Define Binary Tree. Prove that a binary tree of height h has maximum (2^h - 1) nodes. (6 Marks)\n3.b) Construct BST for: 50, 30, 70, 20, 40, 60, 80 and show node deletion for 30 and 50. (14 Marks)\n\nMODULE 4\n4.a) Explain Graph representation methods: Adjacency Matrix and Adjacency List. (8 Marks)\n4.b) Write DFS algorithm. Find topological ordering for a Given DAG. (12 Marks)\n\nMODULE 5\n5.a) Explain Hash collision resolution using Open Addressing with Quadratic Probing. (10 Marks)\n5.b) Describe B-Tree insertion step-by-step for keys: 10, 20, 30, 40, 50 (Order m=3). (10 Marks)`,
  },
  {
    id:        'd2',
    title:     'DBMS (21CS53) 5-Module VTU Comprehensive Revision Notes',
    type:      'Note',
    subjectId: '21cs53',
    subjectCode: '21CS53',
    author:    'Prof. K. Sharma (VTU Code Archives)',
    fileSize:  '3.8 MB',
    content:   `DATABASE MANAGEMENT SYSTEMS (21CS53) — 5-MODULE VTU NOTES\n\nMODULE 1: ER Modeling & Architecture\n- 3-Schema Architecture: Physical, Logical, View\n- ER Diagram elements: Entities, Relationships, Attributes, Cardinalities\n\nMODULE 2: Relational Algebra & SQL\n- Operators: Select, Project, Join, Union, Intersection\n- Complex SQL: Group By, Having, Subqueries, Joins\n\nMODULE 3: Normalization\n- 1NF: Atomic values\n- 2NF: No partial functional dependency\n- 3NF: No transitive dependency\n- BCNF: X->Y implies X is superkey\n\nMODULE 4: Transactions & Concurrency\n- ACID properties: Atomicity, Consistency, Isolation, Durability\n- 2-Phase Locking (2PL) and Deadlock Handling\n\nMODULE 5: Indexing\n- B-Trees and B+ Trees indexing structures`,
  },
  {
    id:        'd3',
    title:     'Operating Systems (21CS44) 2023 End-Sem Solved PYQ',
    type:      'PYQ',
    subjectId: '21cs44',
    subjectCode: '21CS44',
    year:      '2023',
    author:    'VTU Resource Portal',
    fileSize:  '2.1 MB',
    content:   `VTU END-SEM SOLVED QUESTION PAPER — OPERATING SYSTEMS (21CS44)\n\nQ1. Consider 4 processes with Arrival Time 0:\n   P1 (BT=6), P2 (BT=8), P3 (BT=7), P4 (BT=3).\n   Calculate Average Waiting Time for Round Robin (Quantum = 2).\n\nSolution:\n   Gantt Chart: P1[0-2] -> P2[2-4] -> P3[4-6] -> P4[6-8] -> P1[8-10] -> P2[10-12] -> P3[12-14] -> P4[14-15] -> P1[15-17] -> P2[17-19] -> P2[19-21] -> P3[21-24]\n   Avg Waiting Time = 11.25 ms.\n\nQ2. Explain Banker's Safety Algorithm with matrices Need = Max - Allocation.`,
  },
  {
    id:        'd4',
    title:     'Computer Networks (21CS52) RSA & IP Subnetting Formula Sheet',
    type:      'Note',
    subjectId: '21cs52',
    subjectCode: '21CS52',
    author:    'VTU Circle Network Cell',
    fileSize:  '1.9 MB',
    content:   `COMPUTER NETWORKS & SECURITY (21CS52) — FORMULAS & SOLUTIONS\n\n1. RSA Encryption Steps:\n   - Select primes p and q. Calculate n = p*q.\n   - Calculate totient phi(n) = (p-1)*(q-1).\n   - Choose e such that gcd(e, phi(n)) = 1.\n   - Calculate d = e^-1 mod phi(n).\n   - Cipher C = M^e mod n, Decipher M = C^d mod n.\n\n2. IP Subnetting Formula:\n   - Subnet Mask /26 = 255.255.255.192 (Block size = 64)\n   - Host range: 1 to 62 per subnet.`,
  }
];

export default function UniHubPage() {
  const [selectedSem, setSelectedSem]         = useState<string>('All');
  const [selectedType, setSelectedType]       = useState<string>('All');
  const [searchQuery, setSearchQuery]         = useState<string>('');
  const [documents, setDocuments]             = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [activeSubject, setActiveSubject]     = useState<typeof ALL_SUBJECTS[0] | null>(null);
  const [previewDoc, setPreviewDoc]           = useState<DocumentItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showScrapeModal, setShowScrapeModal] = useState(false);

  // Scraper Form State
  const [scrapeQuery, setScrapeQuery]         = useState('21CS32');
  const [scrapeScheme, setScrapeScheme]       = useState('VTU 2021/2022 Scheme');
  const [scrapeSem, setScrapeSem]             = useState('3');
  const [isScraping, setIsScraping]           = useState(false);
  const [scrapeMessage, setScrapeMessage]     = useState('');

  // Manual Upload State
  const [upTitle, setUpTitle]     = useState('');
  const [upSubject, setUpSubject] = useState(ALL_SUBJECTS[0].id);
  const [upType, setUpType]       = useState<'Note' | 'PYQ' | 'Syllabus'>('Note');
  const [upAuthor, setUpAuthor]   = useState('');
  const [upContent, setUpContent] = useState('');

  // Load saved docs from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('placementhub_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDocuments([...INITIAL_DOCUMENTS, ...parsed]);
      }
    } catch {}
  }, []);

  const saveDocsToLocalStorage = (docs: DocumentItem[]) => {
    try {
      const customOnly = docs.filter(d => d.id.startsWith('custom_') || d.id.startsWith('scraped_'));
      localStorage.setItem('placementhub_notes', JSON.stringify(customOnly));
    } catch {}
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upTitle.trim()) return;

    const targetSub = ALL_SUBJECTS.find(s => s.id === upSubject);

    const newDoc: DocumentItem = {
      id:          `custom_${Date.now()}`,
      title:       upTitle,
      type:        upType,
      subjectId:   upSubject,
      subjectCode: targetSub?.code || 'CS',
      author:      upAuthor || 'Student User',
      fileSize:    '1.5 MB',
      content:     upContent || `# ${upTitle}\n\nUploaded notes content for revision.`,
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    saveDocsToLocalStorage(updated);

    setShowUploadModal(false);
    setUpTitle('');
    setUpAuthor('');
    setUpContent('');
  };

  const handleScrapeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeQuery.trim()) return;

    setIsScraping(true);
    setScrapeMessage('Connecting to web sources (VTU Circle / VTU Code / Resource archives)...');

    try {
      const res = await fetch('/api/uni/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: scrapeQuery.trim(),
          subjectCode: scrapeQuery.trim(),
          semester: scrapeSem,
          scheme: scrapeScheme,
        }),
      });

      const data = await res.json();

      if (data.success && data.documents) {
        // Merge scraped documents without duplicating IDs
        const existingIds = new Set(documents.map(d => d.id));
        const newDocs = data.documents.filter((d: DocumentItem) => !existingIds.has(d.id));

        const updated = [...newDocs, ...documents];
        setDocuments(updated);
        saveDocsToLocalStorage(updated);

        setScrapeMessage(`Success! Scraped & imported ${newDocs.length} documents for ${data.subject?.code || scrapeQuery}.`);
        setTimeout(() => {
          setShowScrapeModal(false);
          setScrapeMessage('');
        }, 1500);
      } else {
        setScrapeMessage(data.error || 'Failed to scrape web data.');
      }
    } catch (err) {
      setScrapeMessage('Network error scraping university data.');
    } finally {
      setIsScraping(false);
    }
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

  const filteredSubjects = ALL_SUBJECTS.filter(s => {
    const matchSem = selectedSem === 'All' || s.semester.toString() === selectedSem;
    const matchSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSem && matchSearch;
  });

  const getSubjectDocs = (subjectId: string, subjectCode: string) => {
    return documents.filter(d => {
      const matchSub = d.subjectId.toLowerCase() === subjectId.toLowerCase() || (d.subjectCode && d.subjectCode.toLowerCase() === subjectCode.toLowerCase());
      const matchType = selectedType === 'All' || d.type === selectedType;
      return matchSub && matchType;
    });
  };

  return (
    <div className="dashboard-container" style={{ paddingBottom: '30px' }}>
      {/* ── Banner Hero Card ── */}
      <div className="dashboard-hero-card" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="hero-title">🎓 VTU & University Portal</h1>
          <p className="hero-subtitle">Official VTU course codes (Sem 1 - Sem 8), 5-module question banks & web-scraped end-sem PYQs.</p>
        </div>
        <div className="hero-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '6px 12px', width: '180px',
          }}>
            <span style={{ fontSize: '13px', color: '#9CA3AF' }}>🔍</span>
            <input
              type="text"
              placeholder="Search code (e.g. 21CS32)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '12px', width: '100%' }}
            />
          </div>

          {/* Web Scraper Action Button */}
          <button className="warmup-btn-purple" onClick={() => setShowScrapeModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>🌐 Scrape Web Data</span>
          </button>

          <button className="warmup-btn-dark" onClick={() => setShowUploadModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span>⬆ Upload Note</span>
          </button>
        </div>
      </div>

      {/* ── Semester Tabs Filter Bar (Sem 1 to Sem 8) ── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', '1', '2', '3', '4', '5', '6', '7', '8'].map(sem => (
          <button
            key={sem}
            onClick={() => setSelectedSem(sem)}
            style={{
              padding: '6px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              background: selectedSem === sem ? '#5544F5' : '#161527',
              color: selectedSem === sem ? '#fff' : 'rgba(255,255,255,0.6)',
              border: selectedSem === sem ? '1px solid #5544F5' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: selectedSem === sem ? '0 0 12px rgba(85,68,245,0.4)' : 'none',
            }}
          >
            {sem === 'All' ? '📚 All Semesters' : `Semester ${sem}`}
          </button>
        ))}
      </div>

      {/* ── Type Filter Pills ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', 'Note', 'PYQ', 'Syllabus'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              padding: '5px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
              background: selectedType === type ? '#22213A' : 'transparent',
              color: selectedType === type ? '#fff' : 'rgba(255,255,255,0.5)',
              border: selectedType === type ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {type === 'All' ? '📁 All Types' : type === 'Note' ? '📝 Lecture Notes' : type === 'PYQ' ? '📜 VTU PYQs' : '📋 Syllabi'}
          </button>
        ))}
      </div>

      {/* ── Subject Cards Grid ── */}
      <div className="dashboard-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filteredSubjects.map(s => {
          const docs = getSubjectDocs(s.id, s.code);
          return (
            <div className="dashboard-widget-card" key={s.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="widget-header" style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '24px', marginRight: '6px' }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <span className="widget-title" style={{ fontSize: '14px' }}>{s.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span className="prep-tag-pill" style={{ background: 'rgba(85, 68, 245, 0.15)', color: '#B8B0FF', borderColor: 'rgba(85, 68, 245, 0.3)' }}>{s.code}</span>
                  <span className="prep-tag-pill">Sem {s.semester}</span>
                </div>
              </div>

              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>{s.desc}</p>

              <div style={{ background: '#1B1A30', borderRadius: '10px', padding: '10px 12px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                  Available VTU Files ({docs.length})
                </div>
                {docs.length === 0 ? (
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                    No matching local files. Click "Scrape Web Data" to fetch!
                  </div>
                ) : (
                  docs.slice(0, 2).map(d => (
                    <div
                      key={d.id}
                      onClick={() => setPreviewDoc(d)}
                      style={{
                        fontSize: '11px', color: '#B8B0FF', cursor: 'pointer',
                        padding: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}
                    >
                      <span>{d.type === 'PYQ' ? '📜' : '📝'}</span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.title}</span>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>View →</span>
                    </div>
                  ))
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="warmup-btn-dark"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '11px', padding: '7px' }}
                  onClick={() => setActiveSubject(s)}
                >
                  Explore ({docs.length}) →
                </button>

                <button
                  className="warmup-btn-purple"
                  style={{ fontSize: '11px', padding: '7px 12px', whiteSpace: 'nowrap' }}
                  onClick={() => {
                    setScrapeQuery(s.code);
                    setScrapeSem(s.semester.toString());
                    setShowScrapeModal(true);
                  }}
                  title="Scrape VTU papers for this subject"
                >
                  🌐 Scrape
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Web Scraper Modal ── */}
      {showScrapeModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleScrapeSubmit} className="dashboard-widget-card" style={{ width: '480px', background: '#161527', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="widget-title" style={{ fontSize: '16px' }}>🌐 Scrape & Import VTU Web Questions</span>
              <button type="button" className="warmup-btn-dark" onClick={() => setShowScrapeModal(false)} style={{ padding: '2px 8px' }}>✕</button>
            </div>

            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px', lineHeight: 1.5 }}>
              Fetch 5-Module VTU questions, model question papers, and solved end-sem PYQs directly from web archives (VTU Circle & VTU Code).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Subject Code / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 21CS32, 21CS53, 21CS44, or Operating Systems"
                  value={scrapeQuery}
                  onChange={e => setScrapeQuery(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1B1A30', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>University Scheme</label>
                  <select
                    value={scrapeScheme}
                    onChange={e => setScrapeScheme(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1B1A30', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                  >
                    <option value="VTU 2021/2022 Scheme">VTU 2021/2022 Scheme</option>
                    <option value="VTU 2018 Scheme">VTU 2018 Scheme</option>
                    <option value="Autonomous University">Autonomous / General</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Semester</label>
                  <select
                    value={scrapeSem}
                    onChange={e => setScrapeSem(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1B1A30', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                  >
                    {[1,2,3,4,5,6,7,8].map(sem => (
                      <option key={sem} value={sem.toString()}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              {scrapeMessage && (
                <div style={{
                  fontSize: '11px', padding: '8px 12px', borderRadius: '6px',
                  background: scrapeMessage.startsWith('Success') ? 'rgba(62, 207, 142, 0.15)' : 'rgba(85, 68, 245, 0.15)',
                  color: scrapeMessage.startsWith('Success') ? '#3ECF8E' : '#B8B0FF',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {scrapeMessage}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" className="warmup-btn-dark" onClick={() => setShowScrapeModal(false)}>Cancel</button>
                <button type="submit" className="warmup-btn-purple" disabled={isScraping}>
                  {isScraping ? 'Scraping Web...' : 'Start Web Scrape & Import ⚡'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Subject Document List Modal ── */}
      {activeSubject && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="dashboard-widget-card" style={{ width: '580px', maxHeight: '85vh', background: '#161527', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="widget-title" style={{ fontSize: '16px' }}>{activeSubject.icon} {activeSubject.name}</span>
              <button className="warmup-btn-dark" onClick={() => setActiveSubject(null)} style={{ padding: '2px 8px' }}>✕</button>
            </div>

            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '14px' }}>
              Subject Code: <span style={{ color: '#B8B0FF', fontWeight: 700 }}>{activeSubject.code}</span> · Semester {activeSubject.semester}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
              {getSubjectDocs(activeSubject.id, activeSubject.code).length === 0 ? (
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '30px 0' }}>
                  No local files found for {activeSubject.code}. Click "Scrape Web Data" below to automatically fetch 5-module questions and end-sem PYQs.
                </div>
              ) : (
                getSubjectDocs(activeSubject.id, activeSubject.code).map(d => (
                  <div
                    key={d.id}
                    style={{
                      background: '#1B1A30', padding: '12px 14px', borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '12px',
                    }}
                  >
                    <div style={{ fontSize: '22px' }}>{d.type === 'PYQ' ? '📜' : '📝'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {d.title}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                        Source: {d.author} {d.fileSize ? `· ${d.fileSize}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="warmup-btn-dark" onClick={() => setPreviewDoc(d)} style={{ fontSize: '11px', padding: '4px 10px' }}>Preview 👁</button>
                      <button className="warmup-btn-purple" onClick={() => downloadDoc(d)} style={{ fontSize: '11px', padding: '4px 10px' }}>Download ↓</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Need more questions?</span>
              <button
                className="warmup-btn-purple"
                onClick={() => {
                  setScrapeQuery(activeSubject.code);
                  setScrapeSem(activeSubject.semester.toString());
                  setActiveSubject(null);
                  setShowScrapeModal(true);
                }}
              >
                🌐 Scrape VTU Data for {activeSubject.code}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Document Reader / Preview Modal ── */}
      {previewDoc && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="dashboard-widget-card" style={{ width: '680px', maxHeight: '85vh', background: '#161527', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <span className="prep-tag-pill" style={{ marginBottom: '4px', display: 'inline-block' }}>{previewDoc.type} Document</span>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{previewDoc.title}</div>
              </div>
              <button className="warmup-btn-dark" onClick={() => setPreviewDoc(null)} style={{ padding: '2px 8px' }}>✕</button>
            </div>

            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              Source: {previewDoc.author} · PlacementHub Verified Document Reader
            </div>

            {/* Document Text Reader */}
            <div style={{
              flex: 1, overflowY: 'auto', background: '#0F0E1C', padding: '18px',
              borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: "'JetBrains Mono', Consolas, monospace", fontSize: '12px',
              color: '#B8B0FF', lineHeight: 1.7, whiteSpace: 'pre-wrap',
            }}>
              {previewDoc.content || `[DOCUMENT CONTENT READ ERROR]\nRaw file stream ready for download.`}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Format: UTF-8 Text / VTU Stream</span>
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
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleUploadSubmit} className="dashboard-widget-card" style={{ width: '480px', background: '#161527', border: '1px solid rgba(255,255,255,0.1)', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="widget-title" style={{ fontSize: '16px' }}>⬆ Upload Custom Material</span>
              <button type="button" className="warmup-btn-dark" onClick={() => setShowUploadModal(false)} style={{ padding: '2px 8px' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2023 OS Mid-Sem Question Paper"
                  value={upTitle}
                  onChange={e => setUpTitle(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1B1A30', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Subject</label>
                  <select
                    value={upSubject}
                    onChange={e => setUpSubject(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1B1A30', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                  >
                    {ALL_SUBJECTS.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Category Type</label>
                  <select
                    value={upType}
                    onChange={e => setUpType(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1B1A30', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                  >
                    <option value="Note">Lecture Note</option>
                    <option value="PYQ">VTU Question Paper (PYQ)</option>
                    <option value="Syllabus">Syllabus</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Author / Source</label>
                <input
                  type="text"
                  placeholder="e.g. Anubhab C."
                  value={upAuthor}
                  onChange={e => setUpAuthor(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1B1A30', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Text / Content Snippet</label>
                <textarea
                  rows={4}
                  placeholder="Paste study notes or question paper text here..."
                  value={upContent}
                  onChange={e => setUpContent(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#1B1A30', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button type="button" className="warmup-btn-dark" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="warmup-btn-purple">Save to University Hub ✓</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
