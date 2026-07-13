'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Simple 3D Interactive Card Canvas using Vanilla Canvas / 3D Projection for maximum stability
function Interactive3DProjectDeck({ accentColor }: { accentColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);

  const projects = [
    { title: 'ArmedaSona', desc: 'AI-Powered Diagnostic Platform', tech: ['React', 'Node.js', 'PyTorch'] },
    { title: 'Spam Detector', desc: 'NLP Email & Message Classifier', tech: ['Python', 'scikit-learn', 'FastAPI'] },
    { title: 'IoT Sensor Hub', desc: 'Real-time Telemetry Dashboard', tech: ['C++', 'MQTT', 'WebAssembly'] },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotY(x * 25);
    setRotX(-y * 25);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        padding: '20px 0',
        cursor: 'grab',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: 'transform 0.15s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {projects.map((p, i) => (
          <div
            key={p.title}
            style={{
              background: 'rgba(20, 20, 20, 0.85)',
              borderRadius: '24px',
              border: `1px solid ${accentColor}40`,
              padding: '24px',
              boxShadow: `0 20px 40px rgba(0,0,0,0.6), 0 0 30px ${accentColor}15`,
              transform: `translateZ(${ (i + 1) * 20 }px)`,
              backdropFilter: 'blur(12px)',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontSize: '10px', color: accentColor, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Project 0{i + 1}
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{p.title}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '16px' }}>{p.desc}</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {p.tech.map(t => (
                <span key={t} style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30`, fontWeight: 600 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PublicPortfolioPage({ params }: { params: { username: string } }) {
  const username = params?.username || 'anubhab';
  const [theme, setTheme] = useState<'cyberpunk' | 'stark' | 'corporate'>('cyberpunk');

  const themes = {
    cyberpunk: { name: 'Cyberpunk Neon', bg: '#000000', accent: '#00d4ff', cardBg: '#0f0f0f', text: '#f0f4ff' },
    stark: { name: 'Minimal Stark', bg: '#050505', accent: '#ffffff', cardBg: '#111111', text: '#ffffff' },
    corporate: { name: 'Corporate Clean', bg: '#040814', accent: '#7c3aed', cardBg: '#0a0f24', text: '#e8f0fe' },
  };

  const current = themes[theme];

  return (
    <div style={{ minHeight: '100vh', background: current.bg, color: current.text, padding: '40px 24px', fontFamily: "'Space Grotesk', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Top bar with Theme Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: current.accent, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Back to PlacementHub
          </Link>

          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(Object.keys(themes) as Array<keyof typeof themes>).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '100px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: theme === t ? current.accent : 'transparent',
                  color: theme === t ? '#000' : 'var(--text-2)',
                  transition: 'all 0.2s ease',
                }}
              >
                {themes[t].name}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <div style={{
          background: current.cardBg,
          borderRadius: '32px',
          padding: '40px',
          border: `1px solid ${current.accent}30`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${current.accent}15`,
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${current.accent}, #7c3aed)`,
              display: 'flex', alignItems: 'center', justifyCenter: 'center',
              fontSize: '28px', fontWeight: 800, color: '#white',
              boxShadow: `0 0 30px ${current.accent}50`,
              flexShrink: 0,
            }}>
              AC
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, margin: 0 }}>Anubhab Chakraborty</h1>
                <span style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '100px', background: `${current.accent}20`, color: current.accent, border: `1px solid ${current.accent}40`, fontWeight: 700 }}>
                  Verified Candidate ✓
                </span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-2)', marginTop: '6px' }}>
                Computer Science & Engineering Student · DSA & Full-Stack Developer
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: '100px', background: current.accent, color: '#000', fontWeight: 700, fontSize: '12px', textDecoration: 'none' }}>
                GitHub Profile ↗
              </a>
              <button style={{ padding: '10px 20px', borderRadius: '100px', background: 'transparent', border: `1px solid ${current.accent}50`, color: current.accent, fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                Download Resume PDF ↓
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'DSA Problems Solved', val: '245 / 300' },
            { label: 'GitHub Auto-Commits', val: '85 Solutions' },
            { label: 'Current Streak', val: '21 Days 🔥' },
            { label: 'Top Accuracy Area', val: 'Dynamic Programming' },
          ].map(s => (
            <div key={s.label} style={{ background: current.cardBg, borderRadius: '24px', padding: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: current.accent, marginBottom: '4px' }}>{s.val}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* 3D Project Deck Header */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>3D Interactive Project Deck</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-2)' }}>Move your cursor over the deck to rotate the architecture cards in real-time 3D space.</p>
        </div>

        <Interactive3DProjectDeck accentColor={current.accent} />

      </div>
    </div>
  );
}
