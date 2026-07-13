'use client';
import { useState, useEffect } from 'react';

type IntegrationStatus = {
  judge0:  boolean;
  gemini:  boolean;
  github:  boolean;
  supabase: boolean;
};

export default function SettingsPage() {
  const [status, setStatus] = useState<IntegrationStatus>({ judge0: false, gemini: false, github: false, supabase: false });
  const [checking, setChecking] = useState(true);
  const [saved, setSaved] = useState(false);

  // Check which integrations are configured
  useEffect(() => {
    const check = async () => {
      try {
        const res  = await fetch('/api/health');
        const data = await res.json();
        setStatus(data);
      } catch {
        // health check not implemented yet, show all as pending
      }
      setChecking(false);
    };
    check();
  }, []);

  const integrations = [
    {
      icon: '⚙',
      title: 'Judge0 Code Compiler',
      desc: 'Real code execution for C++, Java, Python, JavaScript',
      key: 'judge0' as keyof IntegrationStatus,
      steps: ['Go to rapidapi.com/judge0-official/api/judge0-ce', 'Subscribe to the free plan', 'Copy your X-RapidAPI-Key', 'Add to .env.local as JUDGE0_API_KEY'],
      color: 'var(--cyan)',
      link: 'https://rapidapi.com/judge0-official/api/judge0-ce',
    },
    {
      icon: '🤖',
      title: 'Gemini AI (Google)',
      desc: 'AI performance analysis, coaching, and chat',
      key: 'gemini' as keyof IntegrationStatus,
      steps: ['Go to aistudio.google.com/app/apikey', 'Click "Create API Key"', 'Copy the key', 'Add to .env.local as GEMINI_API_KEY'],
      color: 'var(--violet-bright)',
      link: 'https://aistudio.google.com/app/apikey',
    },
    {
      icon: '🐙',
      title: 'GitHub Auto-Push',
      desc: 'Automatically commit solved problems to your GitHub repo',
      key: 'github' as keyof IntegrationStatus,
      steps: ['Go to github.com/settings/tokens', 'Click "Generate new token (classic)"', 'Enable repo scope', 'Add to .env.local as GITHUB_TOKEN + GITHUB_USERNAME'],
      color: 'var(--green)',
      link: 'https://github.com/settings/tokens',
    },
    {
      icon: '🗄',
      title: 'Supabase Database',
      desc: 'Persistent storage for problems, submissions, events',
      key: 'supabase' as keyof IntegrationStatus,
      steps: ['Go to supabase.com and create a project', 'Go to Project Settings → API', 'Copy Project URL and anon key', 'Add to .env.local as NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY'],
      color: 'var(--amber)',
      link: 'https://supabase.com',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙ Settings</h1>
          <p className="page-subtitle">Connect your services to unlock full functionality</p>
        </div>
      </div>

      {/* .env.local quick guide */}
      <div style={{
        marginBottom: '20px', padding: '16px 20px',
        background: 'rgba(124,58,237,0.06)', borderRadius: 'var(--r-lg)',
        border: '1px solid rgba(124,58,237,0.2)',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-1)' }}>
          📋 Setup Instructions
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.7 }}>
          1. Open <code style={{ color: 'var(--cyan)', fontFamily: 'monospace', background: 'rgba(0,212,255,0.1)', padding: '1px 6px', borderRadius: '4px' }}>.env.local</code> in your project root<br />
          2. Fill in the API keys for each service below<br />
          3. <strong>Restart the dev server</strong> after adding keys: <code style={{ color: 'var(--green)', fontFamily: 'monospace', background: 'rgba(0,229,160,0.1)', padding: '1px 6px', borderRadius: '4px' }}>npm run dev</code><br />
          4. Each feature below will work immediately after restart
        </div>
      </div>

      {/* Integration cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {integrations.map(item => (
          <div key={item.key} className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: 'var(--r-md)', flexShrink: 0,
                background: `${item.color}15`, border: `1px solid ${item.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
              }}>{item.icon}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{item.title}</span>
                  {checking ? (
                    <span style={{ fontSize: '10px', color: 'var(--text-3)', padding: '2px 8px', background: 'rgba(255,255,255,0.04)', borderRadius: '100px' }}>checking...</span>
                  ) : status[item.key] ? (
                    <span style={{ fontSize: '10px', color: 'var(--green)', padding: '2px 8px', background: 'rgba(0,229,160,0.1)', borderRadius: '100px', border: '1px solid rgba(0,229,160,0.25)' }}>✅ Connected</span>
                  ) : (
                    <span style={{ fontSize: '10px', color: 'var(--amber)', padding: '2px 8px', background: 'rgba(255,179,71,0.1)', borderRadius: '100px', border: '1px solid rgba(255,179,71,0.25)' }}>⚠ Not configured</span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: '12px' }}>{item.desc}</p>

                {/* Setup steps */}
                <div style={{ background: 'var(--black-3)', borderRadius: 'var(--r-md)', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Setup Steps
                  </div>
                  {item.steps.map((step, si) => (
                    <div key={si} style={{ display: 'flex', gap: '8px', marginBottom: '5px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '10px', color: item.color, fontWeight: 700, flexShrink: 0 }}>{si + 1}.</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-2)', lineHeight: 1.5 }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="noopener"
                style={{
                  padding: '8px 16px', borderRadius: 'var(--r-pill)',
                  fontSize: '11px', fontWeight: 700, flexShrink: 0,
                  background: `${item.color}15`, border: `1px solid ${item.color}35`,
                  color: item.color, textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                Get Key →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* .env.local template */}
      <div className="card" style={{ marginTop: '16px', padding: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
          📄 .env.local Template
        </div>
        <pre style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: '12px',
          color: 'var(--text-2)', background: 'var(--black-3)',
          padding: '16px', borderRadius: 'var(--r-md)',
          overflow: 'auto', lineHeight: 1.7,
          border: '1px solid rgba(255,255,255,0.04)',
        }}>{`# Judge0 Code Compiler
JUDGE0_API_KEY=your_rapidapi_key_here
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# GitHub Integration
GITHUB_TOKEN=ghp_your_token_here
GITHUB_USERNAME=your_github_username

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here`}</pre>
        <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-3)' }}>
          ⚡ After editing .env.local, restart the server with <code style={{ color: 'var(--green)', fontFamily: 'monospace' }}>npm run dev</code>
        </div>
      </div>
    </div>
  );
}
