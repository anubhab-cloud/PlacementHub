'use client';
import { useEffect, useRef, useState } from 'react';

type DiffStat = {
  label: string;
  solved: number;
  total: number;
};

type StatsData = {
  easy_solved: number;
  easy_total: number;
  medium_solved: number;
  medium_total: number;
  hard_solved: number;
  hard_total: number;
  streak: number;
  github_pushes: number;
  is_connected?: boolean;
};

function DonutChart({ solved, total }: { solved: number; total: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 120;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, r = 44, lw = 12;
    const safeTotal = total > 0 ? total : 300;
    const startTime = performance.now();
    const dur = 800;

    function draw(now: number) {
      const p = Math.min((now - startTime) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      ctx!.clearRect(0, 0, size, size);

      // Track ring
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx!.lineWidth = lw;
      ctx!.stroke();

      // Main vibrant purple arc
      const sweep = Math.min(solved / safeTotal, 1) * Math.PI * 2 * ease;
      if (sweep > 0) {
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + sweep);
        ctx!.strokeStyle = '#7C3AED';
        ctx!.lineWidth = lw;
        ctx!.lineCap = 'round';
        ctx!.shadowColor = 'rgba(124, 58, 237, 0.5)';
        ctx!.shadowBlur = 10;
        ctx!.stroke();
        ctx!.shadowBlur = 0;
      }

      setCount(Math.round(solved * ease));
      if (p < 1) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }, [solved, total]);

  return (
    <div className="donut-container">
      <canvas ref={ref} />
      <div className="donut-center-text">
        <span className="donut-val">{count}</span>
        <span className="donut-sub">of {total}</span>
      </div>
    </div>
  );
}

export default function PrepSummaryWidget() {
  const [stats, setStats] = useState<StatsData>({
    easy_solved: 90,
    easy_total: 100,
    medium_solved: 110,
    medium_total: 140,
    hard_solved: 45,
    hard_total: 60,
    streak: 21,
    github_pushes: 85,
    is_connected: true,
  });

  const [loading, setLoading] = useState(false);
  const [syncUsername, setSyncUsername] = useState('');
  const [showSyncModal, setShowSyncModal] = useState(false);

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('nexusprep_stats');
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {}
    }

    // Fetch live stats from API
    fetch('/api/stats')
      .then(res => res.json())
      .then(d => {
        if (d && !d.error) {
          setStats(prev => {
            const updated = { ...prev, ...d };
            localStorage.setItem('nexusprep_stats', JSON.stringify(updated));
            return updated;
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSyncLeetCode = async () => {
    if (!syncUsername.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/leetcode/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: syncUsername }),
      });
      const data = await res.json();
      if (data.solved) {
        const updated: StatsData = {
          ...stats,
          easy_solved: data.solved.easy,
          medium_solved: data.solved.medium,
          hard_solved: data.solved.hard,
          is_connected: true,
        };
        setStats(updated);
        localStorage.setItem('nexusprep_stats', JSON.stringify(updated));
        setShowSyncModal(false);
      } else {
        alert(data.error || 'Failed to sync LeetCode profile');
      }
    } catch (e) {
      alert('Error connecting to LeetCode API');
    } finally {
      setLoading(false);
    }
  };

  const diffs: DiffStat[] = [
    { label: 'Easy',   solved: stats.easy_solved,   total: stats.easy_total },
    { label: 'Medium', solved: stats.medium_solved, total: stats.medium_total },
    { label: 'Hard',   solved: stats.hard_solved,   total: stats.hard_total },
  ];

  const totalSolved = stats.easy_solved + stats.medium_solved + stats.hard_solved;
  const totalQuestions = stats.easy_total + stats.medium_total + stats.hard_total;

  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="widget-icon-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </div>
        <span className="widget-title">Prep summary</span>
        <button 
          className="widget-add-btn" 
          onClick={() => setShowSyncModal(true)}
          style={{ fontSize: '11px', padding: '2px 8px' }}
        >
          Sync LC
        </button>
      </div>

      <div className="prep-summary-top-row">
        <DonutChart solved={totalSolved} total={totalQuestions} />
        <div className="diff-rows-container">
          {diffs.map((d) => (
            <div key={d.label} className="diff-item">
              <div className="diff-header-row">
                <span className="diff-name">{d.label}</span>
                <span className="diff-count">{d.solved}/{d.total}</span>
              </div>
              <div className="diff-progress-track">
                <div className="diff-progress-fill" style={{ width: `${Math.min((d.solved / (d.total || 1)) * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pill tags row at bottom */}
      <div className="prep-bottom-pills-row">
        <span className="prep-tag-pill">{stats.is_connected ? 'GitHub connected' : 'GitHub sync'}</span>
        <span className="prep-tag-pill">{stats.streak}-day streak</span>
        <span className="prep-tag-pill">{stats.github_pushes} pushes</span>
      </div>

      {/* LeetCode Sync Modal */}
      {showSyncModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="dashboard-widget-card" style={{ width: '320px', padding: '20px', background: '#12131A', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#fff' }}>Sync LeetCode Handle</h3>
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '14px' }}>Enter your public LeetCode username to fetch real solved stats.</p>
            <input 
              type="text" 
              placeholder="e.g. leetcode_user" 
              value={syncUsername}
              onChange={(e) => setSyncUsername(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px', marginBottom: '14px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="warmup-btn-dark" onClick={() => setShowSyncModal(false)}>Cancel</button>
              <button className="warmup-btn-purple" onClick={handleSyncLeetCode} disabled={loading}>
                {loading ? 'Syncing...' : 'Fetch Stats'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

