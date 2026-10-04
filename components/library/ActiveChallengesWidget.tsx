'use client';
import React, { useState, useEffect } from 'react';

const CHALLENGE_KEY = 'placementhub_vlib_challenge';

interface ChallengeData {
  joined: boolean;
  joinedAt: string | null;
  totalHours: number; // tracked from study sessions
}

export default function ActiveChallengesWidget() {
  const [challenge, setChallenge] = useState<ChallengeData>({
    joined: false,
    joinedAt: null,
    totalHours: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(CHALLENGE_KEY);
    if (raw) {
      try { setChallenge(JSON.parse(raw)); } catch {}
    }
    // Compute total hours from study session history
    const historyRaw = localStorage.getItem('placementhub_vlib_sessions');
    if (historyRaw) {
      try {
        const sessions = JSON.parse(historyRaw);
        const total = sessions.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0);
        setChallenge((prev) => ({ ...prev, totalHours: Math.floor(total / 3600) }));
      } catch {}
    }
  }, []);

  const toggleJoin = () => {
    const updated: ChallengeData = {
      joined: !challenge.joined,
      joinedAt: !challenge.joined ? new Date().toISOString() : null,
      totalHours: challenge.totalHours,
    };
    setChallenge(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CHALLENGE_KEY, JSON.stringify(updated));
    }
  };

  // Day of challenge
  const dayOfChallenge = challenge.joinedAt
    ? Math.min(30, Math.max(1, Math.floor((Date.now() - new Date(challenge.joinedAt).getTime()) / 86400000) + 1))
    : 0;

  const progressPct = Math.min(100, Math.round((challenge.totalHours / 100) * 100));

  return (
    <div style={{
      background: 'rgba(20, 21, 38, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px', padding: '14px 16px', marginTop: '14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>Active challenges</span>
        <span style={{ fontSize: '10px', color: '#635bff', cursor: 'pointer' }}>View all</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
        }}>
          🔥
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
            100 Hour Study Challenge
          </div>
          <div style={{ fontSize: '10px', color: '#8b8ea9' }}>
            {challenge.joined ? `Day ${dayOfChallenge} of 30` : 'Join to start tracking'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: '#f59e0b', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '9px', color: '#8b8ea9', marginTop: '3px' }}>
          {challenge.totalHours}/100 hrs
        </div>
      </div>

      <button
        onClick={toggleJoin}
        style={{
          width: '100%', padding: '8px', borderRadius: '8px',
          background: challenge.joined ? 'rgba(99, 91, 255, 0.2)' : '#5e43ff',
          border: challenge.joined ? '1px solid var(--accent)' : 'none',
          color: '#ffffff', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
        }}
      >
        {challenge.joined ? '✓ Challenge active' : 'Join challenge'}
      </button>
    </div>
  );
}
