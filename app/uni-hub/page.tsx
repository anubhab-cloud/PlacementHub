'use client';
import { useState } from 'react';

const INITIAL_SUBJECTS = [
  { id: 'ds', icon: '📐', name: 'Data Structures', semester: 3, files: 12, code: 'CS301' },
  { id: 'dbms', icon: '🗃', name: 'Database Systems', semester: 5, files: 8, code: 'CS502' },
  { id: 'os', icon: '🖥', name: 'Operating Systems', semester: 5, files: 15, code: 'CS501' },
  { id: 'cn', icon: '🌐', name: 'Computer Networks', semester: 6, files: 10, code: 'CS601' },
  { id: 'algo', icon: '📊', name: 'Algorithms', semester: 4, files: 9, code: 'CS401' },
  { id: 'toc', icon: '🧮', name: 'Theory of Computation', semester: 6, files: 7, code: 'CS602' },
];

const SAMPLE_FILES: Record<string, Array<{ id: string; title: string; type: 'Note' | 'PYQ' | 'Syllabus'; year?: string; author: string }>> = {
  ds: [
    { id: 'f1', title: 'Trees & Binary Search Trees Lecture Notes', type: 'Note', author: 'Prof. Sharma' },
    { id: 'f2', title: '2023 End-Sem Previous Year Question Paper', type: 'PYQ', year: '2023', author: 'Academic Dept' },
    { id: 'f3', title: 'Graph Algorithms Quick Revision Sheet', type: 'Note', author: 'Anubhab C.' },
  ],
  os: [
    { id: 'f4', title: 'CPU Scheduling & Memory Management Notes', type: 'Note', author: 'Dr. Mukherjee' },
    { id: 'f5', title: '2022 Mid-Sem PYQ with Answer Keys', type: 'PYQ', year: '2022', author: 'Student Council' },
  ],
};

export default function UniHubPage() {
  const [selectedSem, setSelectedSem] = useState<string>('All');
  const [activeSubject, setActiveSubject] = useState<typeof INITIAL_SUBJECTS[0] | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('Data Structures');

  const filteredSubjects = selectedSem === 'All'
    ? INITIAL_SUBJECTS
    : INITIAL_SUBJECTS.filter(s => s.semester.toString() === selectedSem);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle) return;
    alert(`Successfully uploaded "${uploadTitle}" for ${uploadSubject}!`);
    setShowUploadModal(false);
    setUploadTitle('');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🎓 University Portal</h1>
          <p className="page-subtitle">Curated study materials, lecture notes & PYQs by semester</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredSubjects.map(s => (
          <div className="card" key={s.id} style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ fontSize: '32px' }}>{s.icon}</div>
              <span className="pill pill-violet" style={{ fontSize: '10px' }}>Sem {s.semester}</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--cyan)', fontWeight: 700, marginBottom: '2px' }}>{s.code}</div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{s.name}</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '16px' }}>{s.files} Verified Documents Available</p>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-outline-cyan btn-sm"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setActiveSubject(s)}
              >
                View Documents ↗
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Drawer Modal */}
      {activeSubject && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setActiveSubject(null)}>
          <div className="modal-box" style={{ width: '550px' }}>
            <div className="modal-header">
              <span className="modal-title">{activeSubject.icon} {activeSubject.name} — Resources</span>
              <button className="modal-close" onClick={() => setActiveSubject(null)}>✕</button>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--text-2)' }}>
              Course Code: <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{activeSubject.code}</span> · Semester {activeSubject.semester}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {(SAMPLE_FILES[activeSubject.id] || [
                { id: 'def1', title: `${activeSubject.name} Complete Module Notes`, type: 'Note', author: 'Faculty Dept' },
                { id: 'def2', title: '2023 University Examination Paper (PYQ)', type: 'PYQ', year: '2023', author: 'Examinations Cell' },
              ]).map(f => (
                <div key={f.id} style={{ background: 'var(--black-3)', padding: '12px 16px', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '2px' }}>{f.title}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>Uploaded by {f.author} {f.year ? `· ${f.year}` : ''}</div>
                  </div>
                  <span className={`pill ${f.type === 'PYQ' ? 'pill-amber' : 'pill-green'}`} style={{ fontSize: '9px' }}>
                    {f.type}
                  </span>
                </div>
              ))}
            </div>

            <button className="btn btn-violet" onClick={() => setActiveSubject(null)} style={{ width: '100%', justifyContent: 'center' }}>
              Close Resources
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowUploadModal(false)}>
          <div className="modal-box" style={{ width: '450px' }}>
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
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-2)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Subject</label>
                <select
                  value={uploadSubject}
                  onChange={e => setUploadSubject(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '12px', outline: 'none' }}
                >
                  {INITIAL_SUBJECTS.map(s => (
                    <option key={s.id} value={s.name}>{s.name} (Sem {s.semester})</option>
                  ))}
                </select>
              </div>

              <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 'var(--r-md)', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>📁</div>
                <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>Click to select PDF or image files</div>
                <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px' }}>Max file size: 25MB</div>
              </div>

              <button type="submit" className="btn btn-violet" style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}>
                Submit Material for Approval
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
