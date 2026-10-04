'use client';
import React, { useState, useMemo } from 'react';
import { RoomMember } from '@/lib/library/types';

interface VirtualLibGridProps {
  members: RoomMember[];
  currentUserId?: string;
  isJoined: boolean;
  onLeaveHall: () => void;
  onJoinHall: () => void;
}

// Avatar color palette — deterministic per avatar initials
const AVATAR_COLORS = [
  '#5e43ff', '#10b981', '#f59e0b', '#ec4899', '#38bdf8', '#a78bfa', '#635bff', '#facc15', '#ef4444',
];
function getAvatarColor(avatar: string): string {
  let hash = 0;
  for (let i = 0; i < avatar.length; i++) hash = avatar.charCodeAt(i) + hash * 31;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const FILTER_OPTIONS = [
  { id: 'All', label: 'All' },
  { id: 'DSA', label: 'DSA' },
  { id: 'CS', label: 'CS Fundamentals' },
  { id: 'Coding', label: 'Coding' },
  { id: 'Placement', label: 'Placement' },
  { id: 'SQL', label: 'SQL' },
];

export default function VirtualLibGrid({
  members,
  currentUserId,
  isJoined,
  onLeaveHall,
  onJoinHall,
}: VirtualLibGridProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter members by topic keyword
  const filteredMembers = useMemo(() => {
    if (activeFilter === 'All') return members;
    return members.filter((m) =>
      m.topic?.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [members, activeFilter]);

  // Show at most 8 slots in the grid (like a virtual study hall)
  const displayMembers = filteredMembers.slice(0, 8);
  const emptySlots = Math.max(0, 8 - displayMembers.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>
            Community hall
          </h2>
          <p style={{ fontSize: '13px', color: '#9a9cb8' }}>
            A quiet space to study together. Cameras optional, no voice.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Layout toggle (cosmetic) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '4px 8px', borderRadius: '6px',
            fontSize: '11px', color: '#9a9cb8',
          }}>
            <span>Camera view:</span>
            <span style={{ color: '#fff', cursor: 'pointer' }}>🔲</span>
            <span style={{ color: '#fff', cursor: 'pointer' }}>☰</span>
          </div>

          {/* Live count */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 12px', borderRadius: '6px',
            fontSize: '12px', color: '#ffffff', fontWeight: '600',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            {members.length} online
          </div>

          {isJoined ? (
            <button
              onClick={onLeaveHall}
              style={{
                padding: '6px 14px', borderRadius: '6px',
                background: 'rgba(217, 56, 72, 0.25)',
                border: '1px solid rgba(217, 56, 72, 0.5)',
                color: '#f87171', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              Leave hall
            </button>
          ) : (
            <button
              onClick={onJoinHall}
              style={{
                padding: '6px 14px', borderRadius: '6px',
                background: '#5e43ff',
                border: 'none',
                color: '#ffffff', fontSize: '12px', fontWeight: '600',
                cursor: 'pointer', transition: 'all 0.15s ease',
                boxShadow: '0 4px 14px rgba(94, 67, 255, 0.4)',
              }}
            >
              Join hall ✦
            </button>
          )}
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {FILTER_OPTIONS.map((f) => {
          const isActive = activeFilter === f.id;
          const count = f.id === 'All'
            ? members.length
            : members.filter((m) => m.topic?.toLowerCase().includes(f.id.toLowerCase())).length;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                padding: '5px 14px', borderRadius: '16px', border: 'none',
                background: isActive ? '#5e43ff' : 'rgba(255, 255, 255, 0.06)',
                color: isActive ? '#ffffff' : '#9a9cb8',
                fontSize: '12px', fontWeight: isActive ? '600' : 'normal',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* 8-Slot Participant Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {displayMembers.map((m) => {
          const isSelf = m.user_id === currentUserId;
          const avatarColor = getAvatarColor(m.user_avatar || 'AC');
          // Compute time in session
          const startMs = m.study_started_at ? new Date(m.study_started_at).getTime() : Date.now();
          const durationMin = Math.max(0, Math.floor((Date.now() - startMs) / 60000));
          const durationStr = durationMin >= 60
            ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`
            : `${durationMin}m`;

          return (
            <div
              key={m.id}
              style={{
                height: '140px', borderRadius: '12px',
                background: '#161729',
                border: isSelf
                  ? '1px solid rgba(94, 67, 255, 0.6)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden', position: 'relative',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isSelf ? '0 0 20px rgba(94, 67, 255, 0.25)' : '0 4px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Avatar Center */}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `radial-gradient(circle at center, ${avatarColor}22 0%, #161729 100%)`,
              }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '50%',
                  background: avatarColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: '700', color: '#ffffff',
                  boxShadow: `0 0 16px ${avatarColor}60`,
                }}>
                  {m.user_avatar || 'AC'}
                </div>
              </div>

              {/* Top Bar */}
              <div style={{
                position: 'relative', zIndex: 2, padding: '8px 10px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {isSelf ? (
                  <span style={{
                    fontSize: '10px', padding: '2px 8px', borderRadius: '12px',
                    background: 'rgba(94, 67, 255, 0.85)', color: '#ffffff', fontWeight: '600',
                    backdropFilter: 'blur(4px)',
                  }}>
                    👋 You
                  </span>
                ) : <div />}

                {/* Duration badge */}
                <span style={{
                  fontSize: '9px', padding: '1px 6px', borderRadius: '8px',
                  background: 'rgba(0,0,0,0.5)', color: '#94a3b8',
                }}>
                  {durationStr}
                </span>
              </div>

              {/* Bottom Overlay */}
              <div style={{
                position: 'relative', zIndex: 2, padding: '8px 10px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
                      {m.user_name.split(' ')[0]}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '2px', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.topic || 'General Study'}
                  </div>
                </div>

                {/* Mic indicator */}
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: m.mic_on ? 'rgba(16, 185, 129, 0.8)' : 'rgba(217, 56, 72, 0.8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: '#ffffff',
                }}>
                  {m.mic_on ? '🎙️' : '🔇'}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty slots for visual grid fill */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            style={{
              height: '140px', borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(255, 255, 255, 0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '20px', opacity: 0.2 }}>+</span>
          </div>
        ))}
      </div>

      {/* Show more if > 8 members */}
      {filteredMembers.length > 8 && (
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#635bff', cursor: 'pointer' }}>
          +{filteredMembers.length - 8} more studying in this room
        </div>
      )}
    </div>
  );
}
