'use client';
import { useState } from 'react';

const themes = [
  { id: 'cyberpunk', label: 'Cyberpunk',  accent: '#00d4ff', grad: 'linear-gradient(135deg,#050a14,#0a1a30)', glow: 'rgba(0,212,255,0.3)' },
  { id: 'stark',     label: 'Stark',      accent: '#ffffff', grad: 'linear-gradient(135deg,#0a0a0a,#1a1a1a)', glow: 'rgba(255,255,255,0.1)' },
  { id: 'neon',      label: 'Neon Violet',accent: '#9d5bf5', grad: 'linear-gradient(135deg,#0a0514,#150830)', glow: 'rgba(124,58,237,0.3)' },
];

const projects = ['ArmedaSona', 'Spam Detect', 'IoT Sensor'];

export default function PortfolioPreviewWidget() {
  const [active, setActive] = useState(themes[0]);

  return (
    <div className="card portfolio-widget">
      <div className="card-header">
        <span className="card-label"><span className="lbl-icon">🗂</span> My Portfolio</span>
        <button className="card-menu" id="btn-portfolio-options">···</button>
      </div>
      <div className="card-body">
        {/* Theme tabs */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '12px', background: 'var(--black-3)', borderRadius: '100px', padding: '3px' }}>
          {themes.map(t => (
            <button
              key={t.id}
              id={`btn-theme-${t.id}`}
              onClick={() => setActive(t)}
              style={{
                flex: 1, padding: '5px 0', borderRadius: '100px',
                fontSize: '9px', fontWeight: 700, cursor: 'pointer',
                border: 'none', transition: 'all 0.25s ease',
                background: active.id === t.id ? active.accent : 'transparent',
                color: active.id === t.id ? '#000' : 'var(--text-3)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Live preview card */}
        <div style={{
          borderRadius: '16px', overflow: 'hidden',
          border: `1px solid ${active.accent}25`,
          background: active.grad,
          boxShadow: `0 0 30px ${active.glow}`,
          transition: 'all 0.4s ease',
        }}>
          <div style={{ padding: '14px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: active.accent, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '2px' }}>
              Dynamic UI Builder
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
              [{active.label} Theme]
            </div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {projects.map(p => (
                <span key={p} style={{
                  fontSize: '9px', padding: '2px 8px', borderRadius: '100px',
                  background: `${active.accent}18`, color: active.accent,
                  border: `1px solid ${active.accent}35`, fontWeight: 600,
                }}>{p}</span>
              ))}
            </div>
          </div>
          <div style={{
            background: 'rgba(0,0,0,0.35)', padding: '8px 14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '10px', color: active.accent, fontWeight: 600 }}>
              🔗 platform.com/anubhab
            </span>
            <button id="btn-portfolio-share" style={{
              fontSize: '9px', padding: '3px 10px', borderRadius: '100px',
              background: active.accent, color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer',
            }}>Share ↗</button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
          {[['245', 'Solved'], ['21d', 'Streak'], ['3', 'Projects']].map(([v, l]) => (
            <div key={l} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: 'var(--black-3)', borderRadius: '12px' }}>
              <div className="stat-num" style={{ fontSize: '16px' }}>{v}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
          <button className="btn btn-outline-violet btn-xs" id="btn-gen-pdf" style={{ alignSelf: 'center', borderRadius: '12px', whiteSpace: 'nowrap' }}>PDF ↓</button>
        </div>
      </div>
    </div>
  );
}
