'use client';
import React from 'react';

interface VirtualLibSidebarPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onlineCount: number;
}

export default function VirtualLibSidebarPanel({
  activeTab,
  setActiveTab,
  onlineCount,
}: VirtualLibSidebarPanelProps) {
  const navItems = [
    { id: 'community', label: 'Community Hall', icon: '👥' },
    { id: 'private', label: 'Private Rooms', icon: '🔒' },
    { id: 'live-coding', label: 'Live Coding', icon: '💻' },
    { id: 'my-rooms', label: 'My Rooms', icon: '📌' },
    { id: 'analytics', label: 'Study Analytics', icon: '📊' },
    { id: 'buddy', label: 'Study Buddy', icon: '👤' },
    { id: 'focus-tools', label: 'Focus Tools', icon: '⏱️' },
  ];

  const subjects = [
    { name: 'DSA', count: 72, color: '#38bdf8' },
    { name: 'CS Fundamentals', count: 48, color: '#635bff' },
    { name: 'Coding', count: 39, color: '#f59e0b' },
    { name: 'Placement', count: 34, color: '#a78bfa' },
    { name: 'University', count: 28, color: '#facc15' },
    { name: 'System Design', count: 15, color: '#ec4899' },
    { name: 'Others', count: 10, color: '#94a3b8' },
  ];

  return (
    <div style={{
      width: '230px',
      background: 'rgba(16, 17, 28, 0.75)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '18px 14px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      flexShrink: 0,
      backdropFilter: 'blur(12px)'
    }}>
      {/* Top Nav List */}
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'rgba(107, 82, 255, 0.22)' : 'transparent',
                  color: isActive ? '#ffffff' : '#9a9cb8',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom "Live Now" Breakdown Card */}
      <div style={{
        background: 'rgba(24, 25, 45, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981', fontWeight: '600', marginBottom: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          Live now
        </div>

        <div style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>
          {onlineCount}
        </div>
        <div style={{ fontSize: '11px', color: '#8b8ea9', marginBottom: '12px' }}>
          students studying
        </div>

        {/* Subject Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {subjects.map((sub) => (
            <div key={sub.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sub.color }} />
                <span style={{ color: '#cbd5e1' }}>{sub.name}</span>
              </div>
              <span style={{ color: '#8b8ea9', fontWeight: '600' }}>{sub.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
