'use client';
import React from 'react';
import { Room } from '@/lib/library/types';

interface RoomHeaderProps {
  room: Room;
  isJoined: boolean;
  isFocusMode: boolean;
  onToggleJoin: () => void;
  onToggleFocusMode: () => void;
}

export default function RoomHeader({
  room,
  isJoined,
  isFocusMode,
  onToggleJoin,
  onToggleFocusMode,
}: RoomHeaderProps) {
  return (
    <div style={{
      padding: '20px 24px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-1)' }}>
            {room.name}
          </h1>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(99, 91, 255, 0.15)',
            color: 'var(--accent)',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            {room.type} Room
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-3)', marginTop: '4px' }}>
          "{room.description || 'Study together without the noise.'}"
        </p>

        {/* Topic Distribution Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: '600' }}>
            Current topics:
          </span>
          {Object.entries(room.topic_distribution || {}).map(([topic, count]) => (
            <span
              key={topic}
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-2)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <strong>{topic}</strong>
              <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onToggleFocusMode}
          className={`btn ${isFocusMode ? 'btn-violet' : 'btn-ghost'}`}
          style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
        >
          {isFocusMode ? '🧘 Exit Focus Mode' : '🔍 Focus Mode'}
        </button>

        <button
          onClick={onToggleJoin}
          className={`btn ${isJoined ? 'btn-ghost' : 'btn-violet'}`}
          style={{
            padding: '8px 18px',
            fontSize: '13px',
            borderRadius: '8px',
            border: isJoined ? '1px solid rgba(240, 68, 56, 0.4)' : 'none',
            color: isJoined ? '#f04438' : '#fff'
          }}
        >
          {isJoined ? '🚪 Leave Study Session' : '⚡ Join Study Session'}
        </button>
      </div>
    </div>
  );
}
