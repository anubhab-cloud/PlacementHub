'use client';
import { useEffect, useRef, useState } from 'react';

const diffs = [
  { label: 'Easy',   solved: 90,  total: 100, color: '#00e5a0' },
  { label: 'Medium', solved: 110, total: 140, color: '#ffb347' },
  { label: 'Hard',   solved: 45,  total: 60,  color: '#ff4d6d' },
];

function DonutChart() {
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

    const cx = size / 2, cy = size / 2, r = 46, lw = 12;
    const total = 300, solved = 245;
    const startTime = performance.now();
    const dur = 1400;

    function draw(now: number) {
      const p = Math.min((now - startTime) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      ctx!.clearRect(0, 0, size, size);

      // Track ring
      ctx!.beginPath();
      ctx!.arc(cx, cy, r, 0, Math.PI * 2);
      ctx!.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx!.lineWidth = lw;
      ctx!.stroke();

      // Segments
      const segs = [
        { pct: 90 / total, color: '#00e5a0', glow: 'rgba(0,229,160,0.6)' },
        { pct: 110 / total, color: '#ffb347', glow: 'rgba(255,179,71,0.5)' },
        { pct: 45 / total, color: '#ff4d6d', glow: 'rgba(255,77,109,0.5)' },
      ];
      const gap = 0.05;
      let angle = -Math.PI / 2;
      segs.forEach(s => {
        const sweep = s.pct * Math.PI * 2 * ease;
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, angle + gap, angle + sweep - gap);
        ctx!.strokeStyle = s.color;
        ctx!.lineWidth = lw;
        ctx!.lineCap = 'round';
        ctx!.shadowColor = s.glow;
        ctx!.shadowBlur = 12;
        ctx!.stroke();
        ctx!.shadowBlur = 0;
        angle += sweep;
      });

      setCount(Math.round(solved * ease));
      if (p < 1) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }, []);

  return (
    <div className="donut-wrapper" style={{ width: 120, height: 120, flexShrink: 0 }}>
      <canvas ref={ref} />
      <div className="donut-center">
        <span className="donut-count glow-text-violet">{count}</span>
        <span className="donut-total">/300</span>
      </div>
    </div>
  );
}

export default function PrepSummaryWidget() {
  return (
    <div className="card prep-widget">
      <div className="card-header">
        <span className="card-label">
          <span className="lbl-icon">📊</span> Prep Summary
        </span>
        <button className="card-menu" id="btn-prep-menu">···</button>
      </div>
      <div className="card-body">
        <div className="prep-inner">
          <DonutChart />

          <div className="prep-meta" style={{ flex: 1 }}>
            {diffs.map(d => (
              <div className="diff-row" key={d.label}>
                <div className="diff-dot" style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }} />
                <span className="diff-label">{d.label}</span>
                <div className="diff-bar">
                  <div className="diff-fill" style={{ width: `${(d.solved / d.total) * 100}%`, background: d.color }} />
                </div>
                <span className="diff-frac">{d.solved}/{d.total}</span>
              </div>
            ))}

            <div className="prep-pills">
              <span className="pill pill-green">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub ✓
              </span>
              <span className="pill pill-amber">🔥 21 Days</span>
              <span className="pill pill-violet">⬆ 85 Pushes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
