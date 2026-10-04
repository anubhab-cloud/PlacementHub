'use client';
import React, { useMemo } from 'react';
import { RoomMember } from '@/lib/library/types';

interface VirtualLibSidebarPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  members: RoomMember[];
}

const navItems = [
  { id: 'community',   label: 'Community Hall',  icon: '👥' },
  { id: 'private',     label: 'Private Rooms',   icon: '🔒' },
  { id: 'live-coding', label: 'Live Coding',     icon: '💻' },
  { id: 'my-rooms',    label: 'My Rooms',        icon: '📌' },
  { id: 'analytics',   label: 'Study Analytics', icon: '📊' },
  { id: 'buddy',       label: 'Study Buddy',     icon: '👤' },
  { id: 'focus-tools', label: 'Focus Tools',     icon: '⏱️' },
];

const SUBJECT_KEYWORDS: { name: string; keywords: string[]; color: string }[] = [
  { name: 'DSA',           keywords: ['dsa', 'data structure', 'algorithm', 'graph', 'tree', 'dp', 'dynamic', 'sort'],       color: '#38bdf8' },
  { name: 'CS Fundamentals', keywords: ['os', 'operating', 'dbms', 'database', 'network', 'cn', 'computer'],                color: '#635bff' },
  { name: 'Coding',        keywords: ['coding', 'code', 'leetcode', 'competitive', 'c++', 'java', 'python'],                color: '#f59e0b' },
  { name: 'Placement',     keywords: ['placement', 'aptitude', 'hr', 'interview', 'resume', 'company'],                     color: '#a78bfa' },
  { name: 'SQL',           keywords: ['sql', 'query', 'mysql', 'postgresql', 'normalization'],                               color: '#facc15' },
  { name: 'System Design', keywords: ['system design', 'lld', 'hld', 'architecture', 'microservice', 'scale'],              color: '#ec4899' },
  { name: 'Others',        keywords: [],                                                                                      color: '#94a3b8' },
];

function classifyMember(topic: string): string {
  const lower = topic.toLowerCase();
  for (const s of SUBJECT_KEYWORDS.slice(0, -1)) {
    if (s.keywords.some((k) => lower.includes(k))) return s.name;
  }
  return 'Others';
}

export default function VirtualLibSidebarPanel({
  activeTab,
  setActiveTab,
  members,
}: VirtualLibSidebarPanelProps) {
  // Compute subject counts from real members
  const subjectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach((m) => {
      const subject = classifyMember(m.topic || '');
      counts[subject] = (counts[subject] || 0) + 1;
    });
    return counts;
  }, [members]);

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
      backdropFilter: 'blur(12px)',
    }}>
      {/* Top Nav List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '8px', border: 'none',
                background: isActive ? 'rgba(107, 82, 255, 0.22)' : 'transparent',
                color: isActive ? '#ffffff' : '#9a9cb8',
                fontSize: '13px', fontWeight: isActive ? '600' : '500',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom "Live Now" Breakdown Card — real member counts */}
      <div style={{
        background: 'rgba(24, 25, 45, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px', padding: '14px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', color: '#10b981', fontWeight: '600', marginBottom: '4px',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          Live now
        </div>

        <div style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>
          {members.length}
        </div>
        <div style={{ fontSize: '11px', color: '#8b8ea9', marginBottom: '12px' }}>
          students studying
        </div>

        {/* Subject Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {SUBJECT_KEYWORDS.map((sub) => {
            const count = subjectCounts[sub.name] || 0;
            return (
              <div key={sub.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sub.color }} />
                  <span style={{ color: '#cbd5e1' }}>{sub.name}</span>
                </div>
                <span style={{ color: '#8b8ea9', fontWeight: '600' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
