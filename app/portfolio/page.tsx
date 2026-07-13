'use client';
import { useState } from 'react';

const themes = [
  { id: 'cyberpunk', label: 'Cyberpunk Neon', desc: 'Glowing cyan and electric gradients', accent: '#06b6d4' },
  { id: 'stark', label: 'Minimal Stark', desc: 'Clean black & white minimal', accent: '#f0f4ff' },
  { id: 'corporate', label: 'Corporate Clean', desc: 'Professional blue corporate', accent: '#3b82f6' },
];

const projects = [
  { name: 'ArmedaSona', desc: 'Amazon, Spam Detector', tech: ['React', 'Node', 'ML'] },
  { name: 'Spam Detector', desc: 'NLP-based email classifier', tech: ['Python', 'sklearn'] },
  { name: 'IoT Sensor Hub', desc: 'Real-time sensor dashboard', tech: ['Arduino', 'MQTT', 'Vue'] },
];

export default function PortfolioPage() {
  const [theme, setTheme] = useState('cyberpunk');
  const [name, setName] = useState('Anubhab C.');
  const [bio, setBio] = useState('Full-stack developer passionate about DSA and system design.');

  const tc: Record<string, { bg: string; accent: string; border: string; text: string }> = {
    cyberpunk: { bg: 'linear-gradient(135deg,#050a14,#0a1530)', accent: '#06b6d4', border: '#06b6d440', text: '#e0f7ff' },
    stark: { bg: 'linear-gradient(135deg,#111,#222)', accent: '#ffffff', border: '#ffffff30', text: '#ffffff' },
    corporate: { bg: 'linear-gradient(135deg,#0a0e1a,#0d1225)', accent: '#3b82f6', border: '#3b82f640', text: '#e8f0fe' },
  };
  const c = tc[theme];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '16px' }}>
      {/* Config Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title">🌐 Portfolio</h1>
            <p className="page-subtitle">Your public recruiter-facing page</p>
          </div>
        </div>

        <div className="widget" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
            Theme
          </div>
          {themes.map(t => (
            <div
              key={t.id}
              id={`theme-option-${t.id}`}
              onClick={() => setTheme(t.id)}
              style={{
                padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '6px',
                border: `1px solid ${theme === t.id ? t.accent : 'var(--border-subtle)'}`,
                background: theme === t.id ? `${t.accent}15` : 'transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: theme === t.id ? t.accent : 'var(--text-primary)' }}>{t.label}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        <div className="widget" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
            Profile
          </div>
          {[['Name', name, setName], ['Bio', bio, setBio]].map(([label, val, setter]) => (
            <div key={label as string} style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{label as string}</label>
              <input
                value={val as string}
                onChange={e => (setter as (v: string) => void)(e.target.value)}
                style={{
                  width: '100%', marginTop: '4px', padding: '7px 10px',
                  background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
                  borderRadius: '6px', color: 'var(--text-primary)', fontSize: '12px', outline: 'none',
                }}
              />
            </div>
          ))}
          <button className="btn-primary" id="btn-save-portfolio" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
            💾 Save & Generate URL
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <div style={{
          borderRadius: '12px', overflow: 'hidden',
          border: `1px solid ${c.border}`,
          background: c.bg, minHeight: '500px',
          transition: 'all 0.4s ease',
          boxShadow: `0 0 40px ${c.accent}20`,
        }}>
          {/* Header */}
          <div style={{ padding: '32px 32px 20px', borderBottom: `1px solid ${c.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `linear-gradient(135deg, ${c.accent}, ${c.accent}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 800, color: '#000' }}>AC</div>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: c.text, margin: 0 }}>{name}</h2>
                <p style={{ fontSize: '13px', color: `${c.text}80`, margin: '2px 0 0' }}>Full-Stack Developer · CSE 2025</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                {['GitHub', 'LinkedIn', 'Resume'].map(l => (
                  <button key={l} style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                    background: `${c.accent}20`, border: `1px solid ${c.accent}40`,
                    color: c.accent, cursor: 'pointer',
                  }}>{l}</button>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: `${c.text}90`, lineHeight: 1.6 }}>{bio}</p>
          </div>

          {/* Projects */}
          <div style={{ padding: '20px 32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: c.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>Projects</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              {projects.map(p => (
                <div key={p.name} style={{
                  padding: '14px', borderRadius: '10px',
                  background: `${c.accent}08`, border: `1px solid ${c.accent}30`,
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: c.text, marginBottom: '4px' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: `${c.text}60`, marginBottom: '10px' }}>{p.desc}</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {p.tech.map(t => (
                      <span key={t} style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '3px', background: `${c.accent}20`, color: c.accent, border: `1px solid ${c.accent}30` }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DSA Stats */}
          <div style={{ padding: '16px 32px', background: `${c.accent}05`, borderTop: `1px solid ${c.border}`, display: 'flex', gap: '24px' }}>
            {[['245', 'Solved'], ['21 Days', 'Streak'], ['85', 'GH Commits'], ['3', 'Projects']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: c.accent }}>{v}</div>
                <div style={{ fontSize: '10px', color: `${c.text}60` }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>🔗 platform.com/student/anubhab</span>
          <button id="btn-copy-url" style={{ marginLeft: 'auto', fontSize: '11px', padding: '4px 10px', borderRadius: '5px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: 'var(--accent-blue-bright)', cursor: 'pointer' }}>Copy URL</button>
          <button id="btn-share-portfolio" style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '5px', background: 'var(--accent-blue)', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 700 }}>Share ↗</button>
        </div>
      </div>
    </div>
  );
}
