'use client';
import { useEffect, useRef, useState } from 'react';

const diffs = [
  { label: 'Easy',   solved: 90,  total: 100, color: '#3ecf8e' },
  { label: 'Medium', solved: 110, total: 140, color: '#f0a500' },
  { label: 'Hard',   solved: 45,  total: 60,  color: '#f04438' },
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
        { pct: 90 / total, color: '#3ecf8e', glow: 'rgba(62,207,142,0.4)' },
        { pct: 110 / total, color: '#f0a500', glow: 'rgba(240,165,0,0.35)' },
        { pct: 45 / total, color: '#f04438', glow: 'rgba(240,68,56,0.35)' },
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          Prep Summary
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
              <span className="pill pill-green">GitHub ✓</span>
              <span className="pill pill-amber">🔥 21 Days</span>
              <span className="pill pill-violet">↑ 85 Pushes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
