'use client';
import React, { useMemo } from 'react';
import { RoomMember } from '@/lib/library/types';

interface VirtualLibHeroProps {
  studentsCount: number;
  activeRoomsCount: number;
  members: RoomMember[];
}

export default function VirtualLibHero({
  studentsCount,
  activeRoomsCount,
  members,
}: VirtualLibHeroProps) {
  // Compute total focus minutes from real member study start times
  const totalFocusMinutes = useMemo(() => {
    const now = Date.now();
    return members.reduce((sum, m) => {
      const start = m.study_started_at ? new Date(m.study_started_at).getTime() : now;
      return sum + Math.max(0, Math.floor((now - start) / 60000));
    }, 0);
  }, [members]);

  const focusTimeDisplay = useMemo(() => {
    if (totalFocusMinutes >= 60) {
      return `${(totalFocusMinutes / 60).toFixed(1)}h`;
    }
    return `${totalFocusMinutes}m`;
  }, [totalFocusMinutes]);

  // Random rotating motivational quote
  const quotes = [
    { text: 'Good environment today. Let\'s be productive together! ✨', author: 'PlacementHub' },
    { text: 'Consistency beats motivation. Show up every day. 🔥', author: 'Community' },
    { text: 'Every problem you solve brings you one step closer. 💡', author: 'Community' },
    { text: 'Silent library, focused minds, massive results. 🎯', author: 'PlacementHub' },
  ];
  const quote = useMemo(() => quotes[Math.floor(Date.now() / 3600000) % quotes.length], []);

  return (
    <div style={{
      position: 'relative',
      borderRadius: '16px',
      padding: '24px 28px',
      background: 'linear-gradient(135deg, rgba(30, 24, 68, 0.85) 0%, rgba(18, 16, 42, 0.95) 100%)',
      border: '1px solid rgba(107, 82, 255, 0.25)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap',
    }}>
      {/* Ambient Glow */}
      <div style={{
        position: 'absolute', top: '-40px', left: '20%',
        width: '300px', height: '150px',
        background: 'rgba(107, 82, 255, 0.2)',
        filter: 'blur(70px)', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: '300px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          Virtual <span style={{ color: '#a78bfa' }}>library</span>
        </h1>
        <p style={{ fontSize: '14px', color: '#a0a3c4', marginBottom: '20px' }}>
          Study together, stay consistent, achieve more.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Students Online */}
          <StatCard icon="👥" color="#a78bfa" value={studentsCount} label="students studying" />
          {/* Active Rooms */}
          <StatCard icon="🎯" color="#635bff" value={activeRoomsCount} label="active rooms" />
          {/* Focus Time */}
          <StatCard icon="⏱️" color="#38bdf8" value={focusTimeDisplay} label="focus time today" />
          {/* Members with Camera On */}
          <StatCard
            icon="📊"
            color="#10b981"
            value={members.filter((m) => m.camera_on).length || '-'}
            label="cameras on"
          />
        </div>
      </div>

      {/* Quote Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px', padding: '16px 20px',
        maxWidth: '280px', backdropFilter: 'blur(8px)',
      }}>
        <div style={{ fontSize: '13px', color: '#e2e8f0', fontStyle: 'italic', lineHeight: '1.5' }}>
          "{quote.text}"
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%', background: '#a78bfa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: '700', color: '#fff',
          }}>
            {quote.author.slice(0, 2).toUpperCase()}
          </div>
          <span style={{ fontSize: '11px', color: '#8b8ea9' }}>{quote.author}</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, color, value, label }: { icon: string; color: string; value: string | number; label: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '8px 14px', borderRadius: '10px',
    }}>
      <div style={{ fontSize: '20px', color }}>{icon}</div>
      <div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', lineHeight: '1.2' }}>
          {value}
        </div>
        <div style={{ fontSize: '11px', color: '#8b8ea9' }}>{label}</div>
      </div>
    </div>
  );
}
