'use client';
import React from 'react';
import { Room } from '@/lib/library/types';

interface RecommendedRoomsWidgetProps {
  rooms: Room[];
}

const ROOM_TYPE_ICONS: Record<string, string> = {
  community: '🏛️',
  private: '📖',
  coding: '💻',
  interview: '🎤',
};

const ROOM_TYPE_COLORS: Record<string, string> = {
  community: '#10b981',
  private: '#38bdf8',
  coding: '#f59e0b',
  interview: '#a78bfa',
};

export default function RecommendedRoomsWidget({ rooms }: RecommendedRoomsWidgetProps) {
  // Show only the non-community rooms (community hall is the main area)
  const recommendedRooms = rooms.filter((r) => r.id !== 'community-hall-1').slice(0, 4);

  if (recommendedRooms.length === 0) {
    return (
      <div style={{
        background: 'rgba(20, 21, 38, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px', padding: '14px 18px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
          Recommended rooms
        </div>
        <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', padding: '12px 0' }}>
          No other rooms active right now. Create one! 🚀
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(20, 21, 38, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px', padding: '14px 18px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
          Recommended rooms
        </span>
        <span style={{ fontSize: '11px', color: '#635bff', cursor: 'pointer', fontWeight: '600' }}>
          View all
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {recommendedRooms.map((r) => {
          const color = ROOM_TYPE_COLORS[r.type] || '#635bff';
          const icon = ROOM_TYPE_ICONS[r.type] || '📖';
          const topics = Object.keys(r.topic_distribution || {});

          return (
            <div
              key={r.id}
              style={{
                padding: '10px 12px', borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex', alignItems: 'center', gap: '10px',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: `${color}20`, border: `1px solid ${color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px', flexShrink: 0,
              }}>
                {icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.name}
                </div>
                <div style={{ fontSize: '10px', color: '#8b8ea9', marginTop: '2px' }}>
                  {r.active_students_count} studying
                </div>
                <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                  {topics.slice(0, 2).map((t) => (
                    <span key={t} style={{
                      fontSize: '9px', padding: '1px 4px',
                      background: 'rgba(255,255,255,0.06)', borderRadius: '3px', color: '#9a9cb8',
                    }}>
                      {t}
                    </span>
                  ))}
                  {r.privacy === 'private' && (
                    <span style={{
                      fontSize: '9px', padding: '1px 4px',
                      background: 'rgba(245, 158, 11, 0.1)', borderRadius: '3px', color: '#f59e0b',
                    }}>
                      Private
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
