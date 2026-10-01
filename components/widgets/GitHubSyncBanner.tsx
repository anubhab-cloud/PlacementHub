'use client';
import { useState } from 'react';

export default function GitHubSyncBanner() {
  const [state, setState] = useState<'idle'|'syncing'|'done'|'error'>('idle');

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
        setTimeout(() => setState('idle'), 3000);
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  };

  return (
    <div className="github-sync-bar">
      <div className="gh-icon-box">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
        </svg>
      </div>

      <div className="gh-details">
        <span className="gh-title">GitHub sync</span>
        <span className="gh-sub">Last push</span>
        <code className="gh-code-tag">linked-list-reversal.cpp</code>
      </div>

      <button className="gh-push-btn" onClick={handleSync} disabled={state === 'syncing'}>
        {state === 'syncing' ? 'Pushing...' : state === 'done' ? '✓ Pushed' : 'Push now'}
      </button>
    </div>
  );
}
