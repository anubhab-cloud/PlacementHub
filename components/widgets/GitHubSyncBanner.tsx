'use client';
import { useState } from 'react';

export default function GitHubSyncBanner() {
  const [dismissed, setDismissed]   = useState(false);
  const [state, setState]           = useState<'idle'|'syncing'|'done'|'error'>('idle');
  const [resultMsg, setResultMsg]   = useState('');
  const [resultUrl, setResultUrl]   = useState('');

  if (dismissed) return null;

  const handleSync = async () => {
    setState('syncing');
    try {
      const res = await fetch('/api/github/push', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code:         '// Sample push from PlacementHub\n#include <bits/stdc++.h>\nusing namespace std;\nint main() { cout << "Hello World"; }',
          language:     'cpp',
          problemTitle: 'Linked List Reversal',
          topic:        'Linked Lists',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setState('done');
        setResultMsg(data.message);
        setResultUrl(data.url ?? '');
        setTimeout(() => setDismissed(true), 4000);
      } else {
        setState('error');
        setResultMsg(data.error ?? 'Push failed');
      }
    } catch (e: any) {
      setState('error');
      setResultMsg(e.message);
    }
  };

  if (state === 'done') {
    return (
      <div className="gh-banner" style={{ background: 'rgba(0,229,160,0.07)', borderColor: 'rgba(0,229,160,0.25)' }}>
        <span>✅</span>
        <span style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 600 }}>{resultMsg}</span>
        {resultUrl && (
          <a href={resultUrl} target="_blank" rel="noopener" style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--cyan)' }}>
            View on GitHub →
          </a>
        )}
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="gh-banner" style={{ background: 'rgba(255,77,109,0.06)', borderColor: 'rgba(255,77,109,0.2)' }}>
        <span>❌</span>
        <span style={{ fontSize: '12px', color: 'var(--red)', flex: 1 }}>{resultMsg}</span>
        <button onClick={() => setState('idle')} style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}>↺ Retry</button>
        <button onClick={() => setDismissed(true)} style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>
    );
  }

  return (
    <div className="gh-banner">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--green)">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '12px', color: 'var(--text-1)', fontWeight: 600 }}>GitHub Sync · </span>
        <span style={{ fontSize: '12px', color: 'var(--text-2)' }}>
          Last: <code style={{ fontFamily: 'monospace', color: 'var(--cyan)', fontSize: '11px' }}>linked-list-reversal.cpp</code>
          {!process.env.GITHUB_TOKEN && <span style={{ color: 'var(--amber)', fontSize: '10px', marginLeft: '8px' }}>⚠ Add GITHUB_TOKEN to .env.local</span>}
        </span>
      </div>
      <button
        id="btn-github-push-now"
        onClick={handleSync}
        disabled={state === 'syncing'}
        className="btn btn-ghost btn-sm"
        style={{ borderRadius: '100px', borderColor: 'rgba(0,229,160,0.3)', color: 'var(--green)' }}
      >
        {state === 'syncing'
          ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>↻</span> Pushing...</>
          : '↑ Push Now'}
      </button>
      <button onClick={() => setDismissed(true)} style={{ color: 'var(--text-3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>✕</button>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
