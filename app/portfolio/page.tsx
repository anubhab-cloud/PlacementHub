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
      } catch {}
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
    } catch {}
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
    <div className="dashboard-container" style={{ paddingBottom: '30px' }}>
      {/* ── Banner Hero Card ── */}
      <div className="dashboard-hero-card" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="hero-title">🌐 Portfolio Builder</h1>
          <p className="hero-subtitle">Customizable recruiter-facing portfolio page & dynamic link builder.</p>
        </div>
        <div className="hero-actions">
          <button className="btn-hero-purple" onClick={handleSave}>
            {saved ? '✓ Preferences Saved!' : '💾 Save Portfolio'}
          </button>
        </div>
      </div>

      <div className="dashboard-row-grid" style={{ gridTemplateColumns: '340px 1fr', alignItems: 'start' }}>
        {/* Config Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Theme Picker */}
          <div className="dashboard-widget-card">
            <div className="widget-header" style={{ marginBottom: '12px' }}>
              <span className="widget-title" style={{ fontSize: '13px' }}>Choose Theme Preset</span>
            </div>
            {themes.map(t => (
              <div
                key={t.id}
                id={`theme-option-${t.id}`}
                onClick={() => setTheme(t.id)}
                style={{
                  padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px',
                  border: `1px solid ${theme === t.id ? t.accent : 'rgba(255,255,255,0.06)'}`,
                  background: theme === t.id ? `${t.accent}15` : '#1A1C28',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: theme === t.id ? t.accent : '#fff' }}>{t.label}</div>
                <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{t.desc}</div>
              </div>
            ))}
          </div>

          {/* Profile Details Form */}
          <div className="dashboard-widget-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="widget-header" style={{ marginBottom: '4px' }}>
              <span className="widget-title" style={{ fontSize: '13px' }}>Profile Configuration</span>
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px',
                  background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px', color: '#fff', fontSize: '12px', outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Public Handle / Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                style={{
                  width: '100%', padding: '8px 12px',
                  background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px', color: '#38BDF8', fontSize: '12px', outline: 'none',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Bio / Summary</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px',
                  background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px', color: '#fff', fontSize: '12px', outline: 'none',
                  resize: 'none', lineHeight: 1.5,
                }}
              />
            </div>

            <button
              className="warmup-btn-purple"
              id="btn-save-portfolio"
              onClick={handleSave}
              style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
            >
              {saved ? '✓ Preferences Saved!' : '💾 Save & Update URL'}
            </button>
          </div>
        </div>

        {/* Live Preview Area */}
        <div>
          <div style={{
            borderRadius: '16px', overflow: 'hidden',
            border: `1px solid ${c.border}`,
            background: c.bg, minHeight: '480px',
            transition: 'all 0.4s ease',
            boxShadow: `0 0 30px ${c.accent}20`,
          }}>
            {/* Header */}
            <div style={{ padding: '28px 28px 20px', borderBottom: `1px solid ${c.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${c.accent}, #7c3aed)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: 800, color: '#fff',
                  boxShadow: `0 0 20px ${c.accent}40`, flexShrink: 0,
                }}>
                  {name.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AC'}
                </div>

                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: c.text, margin: 0 }}>{name}</h2>
                  <p style={{ fontSize: '12px', color: `${c.text}80`, margin: '4px 0 0' }}>Computer Science Student · CSE 2025</p>
                </div>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <a href="https://github.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                    <button style={{
                      padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: `${c.accent}20`, border: `1px solid ${c.accent}40`,
                      color: c.accent, cursor: 'pointer',
                    }}>GitHub ↗</button>
                  </a>
                  <Link href={publicUrl} target="_blank" style={{ textDecoration: 'none' }}>
                    <button style={{
                      padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                      background: c.accent, border: 'none', color: '#000', cursor: 'pointer',
                    }}>Public View 👁</button>
                  </Link>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: `${c.text}90`, lineHeight: 1.6 }}>{bio}</p>
            </div>

            {/* Projects Section */}
            <div style={{ padding: '20px 28px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: c.accent, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Featured Projects
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {INITIAL_PROJECTS.map(p => (
                  <div key={p.name} style={{
                    padding: '14px', borderRadius: '12px',
                    background: `${c.accent}08`, border: `1px solid ${c.accent}30`,
                    transition: 'all 0.2s ease',
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: c.text, marginBottom: '4px' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: `${c.text}70`, marginBottom: '10px', lineHeight: 1.4 }}>{p.desc}</div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {p.tech.map(t => (
                        <span key={t} style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '10px', background: `${c.accent}20`, color: c.accent, border: `1px solid ${c.accent}30`, fontWeight: 600 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DSA & Placement Stats Row */}
            <div style={{ padding: '16px 28px', background: `${c.accent}05`, borderTop: `1px solid ${c.border}`, display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[
                ['245', 'DSA Solved'],
                ['21 Days', 'Current Streak'],
                ['85', 'GitHub Solutions'],
                ['3', 'Full Stack Apps'],
              ].map(([v, l]) => (
                <div key={l} style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: c.accent }}>{v}</div>
                  <div style={{ fontSize: '10px', color: `${c.text}70` }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Share URL Bar */}
          <div className="dashboard-widget-card" style={{ marginTop: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#38BDF8', fontFamily: 'monospace', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              🔗 {publicUrl}
            </span>
            <button
              id="btn-copy-url"
              onClick={handleCopyUrl}
              className="warmup-btn-dark"
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              {copied ? '✓ Copied!' : 'Copy URL'}
            </button>
            <button
              id="btn-share-portfolio"
              onClick={handleShare}
              className="warmup-btn-purple"
              style={{ fontSize: '11px', padding: '4px 12px' }}
            >
              Share Portfolio ↗
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

