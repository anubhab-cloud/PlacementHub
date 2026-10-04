'use client';
import React from 'react';

interface QuickActionsWidgetProps {
  onOpenCreateRoom: () => void;
}

export default function QuickActionsWidget({ onOpenCreateRoom }: QuickActionsWidgetProps) {
  const actions = [
    { label: 'Invite a friend', icon: '👤+', onClick: () => alert('Invite link copied to clipboard!') },
    { label: 'Create private room', icon: '➕', onClick: onOpenCreateRoom },
    { label: 'Start live coding', icon: '</>', onClick: () => window.location.href = '/workspace' },
    { label: 'Study with AI', icon: '✨', onClick: () => window.location.href = '/ai' },
  ];

  return (
    <div style={{
      background: 'rgba(20, 21, 38, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px',
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%'
    }}>
      <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '10px' }}>
        Quick actions
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
        {actions.map((act) => (
          <button
            key={act.label}
            onClick={act.onClick}
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '16px', color: '#a78bfa' }}>{act.icon}</span>
            <span style={{ fontSize: '10px', color: '#cbd5e1', textAlign: 'center' }}>{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
