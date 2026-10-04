'use client';
import React from 'react';
import { Room } from '@/lib/library/types';

interface LibraryHeaderProps {
  currentRoom: Room | null;
  onlineCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  user: { name: string; avatar: string } | null;
}

export default function LibraryHeader({
  currentRoom,
  onlineCount,
  searchQuery,
  setSearchQuery,
  user,
}: LibraryHeaderProps) {
  return (
    <div style={{
      height: '56px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(18, 19, 26, 0.4)',
      flexShrink: 0
    }}>
      {/* Left: Breadcrumbs & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>Library</span>
        <span style={{ fontSize: '13px', color: 'var(--text-3)' }}>/</span>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-1)' }}>
          {currentRoom ? currentRoom.name : 'Community Hall'}
        </span>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 10px',
          borderRadius: '12px',
          background: 'rgba(62, 207, 142, 0.1)',
          border: '1px solid rgba(62, 207, 142, 0.2)',
          fontSize: '11px',
          color: 'var(--green)',
          fontWeight: '600'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)' }} />
          ● {currentRoom?.active_students_count || onlineCount} studying
        </div>
      </div>

      {/* Center: Search */}
      <div className="topbar-search-pill" style={{ width: '260px', margin: 0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search rooms, topics, peers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right: User Avatar & Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          fontSize: '11px',
          padding: '4px 10px',
          background: 'rgba(240, 165, 0, 0.15)',
          color: '#f0a500',
          borderRadius: '6px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          🔥 5 Day Streak
        </div>

        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '700',
          color: '#fff'
        }}>
          {user?.avatar || 'AC'}
        </div>
      </div>
    </div>
  );
}
