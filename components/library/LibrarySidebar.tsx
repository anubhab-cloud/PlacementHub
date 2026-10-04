'use client';
import React from 'react';

interface LibrarySidebarProps {
  activeTab: 'community' | 'my-rooms' | 'discover' | 'history';
  setActiveTab: (tab: 'community' | 'my-rooms' | 'discover' | 'history') => void;
  onOpenCreateModal: () => void;
}

export default function LibrarySidebar({ activeTab, setActiveTab, onOpenCreateModal }: LibrarySidebarProps) {
  const navItems: { id: 'community' | 'my-rooms' | 'discover' | 'history'; label: string; icon: string; badge?: string }[] = [
    { id: 'community', label: 'Community Hall', icon: '🏛️', badge: 'Public' },
    { id: 'my-rooms', label: 'My Rooms', icon: '🔒' },
    { id: 'discover', label: 'Discover Rooms', icon: '🌐', badge: 'New' },
    { id: 'history', label: 'Study History', icon: '📜' },
  ];

  return (
    <div style={{
      width: '240px',
      background: 'rgba(18, 19, 26, 0.6)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '20px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      flexShrink: 0
    }}>
      <div>
        <div style={{
          fontSize: '11px',
          fontWeight: '700',
          color: 'var(--text-3)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '14px',
          paddingLeft: '8px'
        }}>
          Virtual Campus Navigation
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'rgba(99, 91, 255, 0.18)' : 'transparent',
                  color: isActive ? 'var(--text-1)' : 'var(--text-2)',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontWeight: '600'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Private Room CTA */}
      <div>
        <button
          onClick={onOpenCreateModal}
          className="btn btn-violet"
          style={{
            width: '100%',
            justifyContent: 'center',
            fontSize: '13px',
            padding: '10px',
            borderRadius: '8px'
          }}
        >
          ➕ Create Study Room
        </button>

        <div style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '11px',
          color: 'var(--text-3)',
          lineHeight: '1.4'
        }}>
          💡 <strong>Study Philosophy</strong>
          <p style={{ marginTop: '4px' }}>Quiet presence, social accountability, zero noise.</p>
        </div>
      </div>
    </div>
  );
}
