'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const themes = [
  { id: 'cyberpunk', label: 'Cyberpunk Neon', desc: 'Glowing cyan and electric gradients', accent: '#06b6d4' },
  { id: 'stark', label: 'Minimal Stark', desc: 'Clean black & white minimal', accent: '#ffffff' },
  { id: 'corporate', label: 'Corporate Clean', desc: 'Professional blue corporate', accent: '#3b82f6' },
];

const INITIAL_PROJECTS = [
  { name: 'ArmedaSona', desc: 'AI-Powered Diagnostic Platform', tech: ['React', 'Node.js', 'PyTorch'] },
  { name: 'Spam Detector', desc: 'NLP Email & Message Classifier', tech: ['Python', 'scikit-learn', 'FastAPI'] },
  { name: 'IoT Sensor Hub', desc: 'Real-time Telemetry Dashboard', tech: ['C++', 'MQTT', 'WebAssembly'] },
];

export default function PortfolioPage() {
  const [theme, setTheme]       = useState('cyberpunk');
  const [name, setName]         = useState('Anubhab Chakraborty');
  const [username, setUsername] = useState('anubhab');
  const [bio, setBio]           = useState('Computer Science Student · Full-stack developer passionate about DSA, AI & System Architecture.');
  const [copied, setCopied]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [origin, setOrigin]     = useState('http://localhost:3000');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
      try {
        const savedData = localStorage.getItem('placementhub_portfolio');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed.name) setName(parsed.name);
          if (parsed.username) setUsername(parsed.username);
          if (parsed.bio) setBio(parsed.bio);
          if (parsed.theme) setTheme(parsed.theme);
        }
      } catch { /* fallback */ }
    }
  }, []);

  const tc: Record<string, { bg: string; accent: string; border: string; text: string }> = {
    cyberpunk: { bg: 'linear-gradient(135deg,#050a14,#0a1530)', accent: '#06b6d4', border: '#06b6d440', text: '#e0f7ff' },
    stark: { bg: 'linear-gradient(135deg,#111,#222)', accent: '#ffffff', border: '#ffffff30', text: '#ffffff' },
    corporate: { bg: 'linear-gradient(135deg,#0a0e1a,#0d1225)', accent: '#3b82f6', border: '#3b82f640', text: '#e8f0fe' },
  };
  const c = tc[theme] || tc.cyberpunk;

  const publicUrl = `${origin}/student/${username.toLowerCase().replace(/\s+/g, '-')}`;

  const handleSave = () => {
    const portfolioObj = { name, username, bio, theme };
    try {
      localStorage.setItem('placementhub_portfolio', JSON.stringify(portfolioObj));
    } catch { /* fallback */ }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${name}'s Portfolio`, url: publicUrl }).catch(() => {});
    } else {
      window.open(publicUrl, '_blank');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '20px' }}>
      {/* Config Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="page-title">🌐 Portfolio Builder</h1>
            <p className="page-subtitle">Customizable recruiter-facing portfolio page</p>
          </div>
        </div>

        {/* Theme Picker */}
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>
            Choose Theme Preset
          </div>
          {themes.map(t => (
            <div
              key={t.id}
              id={`theme-option-${t.id}`}
              onClick={() => setTheme(t.id)}
              style={{
                padding: '10px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer', marginBottom: '8px',
                border: `1px solid ${theme === t.id ? t.accent : 'rgba(255,255,255,0.06)'}`,
                background: theme === t.id ? `${t.accent}15` : 'var(--black-3)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: theme === t.id ? t.accent : 'var(--text-1)' }}>{t.label}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Profile Details Form */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Profile Configuration
          </div>

          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>Full Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%', marginTop: '4px', padding: '8px 12px',
                background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--r-md)', color: '#fff', fontSize: '12px', outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>Public Handle / Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              style={{
                width: '100%', marginTop: '4px', padding: '8px 12px',
                background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--r-md)', color: 'var(--cyan)', fontSize: '12px', outline: 'none',
                fontFamily: 'monospace',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>Bio / Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              style={{
                width: '100%', marginTop: '4px', padding: '8px 12px',
                background: 'var(--black-3)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--r-md)', color: '#fff', fontSize: '12px', outline: 'none',
                resize: 'none', lineHeight: 1.5,
              }}
            />
          </div>

          <button
            className="btn btn-violet"
            id="btn-save-portfolio"
            onClick={handleSave}
            style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
          >
            {saved ? '✓ Portfolio Preferences Saved!' : '💾 Save & Generate URL'}
          </button>
        </div>
      </div>

      {/* Live Preview Area */}
      <div>
        <div style={{
          borderRadius: '24px', overflow: 'hidden',
          border: `1px solid ${c.border}`,
          background: c.bg, minHeight: '520px',
          transition: 'all 0.4s ease',
          boxShadow: `0 0 40px ${c.accent}20`,
        }}>
          {/* Header */}
          <div style={{ padding: '32px 32px 20px', borderBottom: `1px solid ${c.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${c.accent}, #7c3aed)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: 800, color: '#fff',
                boxShadow: `0 0 20px ${c.accent}40`, flexShrink: 0,
              }}>
                {name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AC'}
              </div>

              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: c.text, margin: 0 }}>{name}</h2>
                <p style={{ fontSize: '12px', color: `${c.text}80`, margin: '4px 0 0' }}>Computer Science Student · CSE 2025</p>
              </div>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <a href="https://github.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '8px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: 700,
                    background: `${c.accent}20`, border: `1px solid ${c.accent}40`,
                    color: c.accent, cursor: 'pointer',
                  }}>GitHub ↗</button>
                </a>
                <Link href={publicUrl} target="_blank" style={{ textDecoration: 'none' }}>
                  <button style={{
                    padding: '8px 14px', borderRadius: '100px', fontSize: '11px', fontWeight: 700,
                    background: c.accent, border: 'none', color: '#000', cursor: 'pointer',
                  }}>Public View 👁</button>
                </Link>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: `${c.text}90`, lineHeight: 1.6 }}>{bio}</p>
          </div>

          {/* Projects Section */}
          <div style={{ padding: '24px 32px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: c.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
              Featured Projects
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {INITIAL_PROJECTS.map(p => (
                <div key={p.name} style={{
                  padding: '16px', borderRadius: '16px',
                  background: `${c.accent}08`, border: `1px solid ${c.accent}30`,
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: c.text, marginBottom: '6px' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: `${c.text}70`, marginBottom: '12px', lineHeight: 1.5 }}>{p.desc}</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {p.tech.map(t => (
                      <span key={t} style={{ fontSize: '9px', padding: '3px 8px', borderRadius: '100px', background: `${c.accent}20`, color: c.accent, border: `1px solid ${c.accent}30`, fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DSA & Placement Stats Row */}
          <div style={{ padding: '18px 32px', background: `${c.accent}05`, borderTop: `1px solid ${c.border}`, display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            {[
              ['245', 'DSA Solved'],
              ['21 Days', 'Current Streak'],
              ['85', 'GitHub Solutions'],
              ['3', 'Full Stack Apps'],
            ].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: c.accent }}>{v}</div>
                <div style={{ fontSize: '10px', color: `${c.text}70` }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Share URL Bar */}
        <div style={{
          marginTop: '12px', padding: '12px 16px',
          background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--cyan)', fontFamily: 'monospace', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            🔗 {publicUrl}
          </span>
          <button
            id="btn-copy-url"
            onClick={handleCopyUrl}
            style={{
              fontSize: '11px', padding: '6px 12px', borderRadius: '100px',
              background: copied ? 'rgba(0,229,160,0.15)' : 'rgba(0,212,255,0.15)',
              border: `1px solid ${copied ? 'rgba(0,229,160,0.3)' : 'rgba(0,212,255,0.3)'}`,
              color: copied ? 'var(--green)' : 'var(--cyan)', cursor: 'pointer', fontWeight: 600,
            }}
          >
            {copied ? '✓ Copied!' : 'Copy URL'}
          </button>
          <button
            id="btn-share-portfolio"
            onClick={handleShare}
            style={{
              fontSize: '11px', padding: '6px 14px', borderRadius: '100px',
              background: 'var(--violet)', border: 'none', color: '#fff',
              cursor: 'pointer', fontWeight: 700,
            }}
          >
            Share Portfolio ↗
          </button>
        </div>
      </div>
    </div>
  );
}
