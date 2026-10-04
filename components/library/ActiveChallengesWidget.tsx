'use client';
import React, { useState } from 'react';

export default function ActiveChallengesWidget() {
  const [isJoined, setIsJoined] = useState(true);

  return (
    <div style={{
      background: 'rgba(20, 21, 38, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px',
      padding: '14px 16px',
      marginTop: '14px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>Active challenges</span>
        <span style={{ fontSize: '10px', color: '#635bff', cursor: 'pointer' }}>View all</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px'
        }}>
          🔥
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
            100 Hour Study Challenge
          </div>
          <div style={{ fontSize: '10px', color: '#8b8ea9' }}>
            Day 5 of 30
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '42%', height: '100%', background: '#f59e0b' }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '9px', color: '#8b8ea9', marginTop: '3px' }}>
          42/100 hrs
        </div>
      </div>

      <button
        onClick={() => setIsJoined(!isJoined)}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '8px',
          background: isJoined ? 'rgba(99, 91, 255, 0.2)' : '#5e43ff',
          border: `1px solid ${isJoined ? 'var(--accent)' : 'none'}`,
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        {isJoined ? 'Challenge active' : 'Join challenge'}
      </button>
    </div>
  );
}
