'use client';
import React from 'react';
import { RoomMember } from '@/lib/library/types';

interface RoomParticipantGridProps {
  members: RoomMember[];
  currentUserId?: string;
  isCameraOnLocal: boolean;
  isMicOnLocal: boolean;
}

export default function RoomParticipantGrid({
  members,
  currentUserId,
  isCameraOnLocal,
  isMicOnLocal,
}: RoomParticipantGridProps) {
  // Render up to 24 visible participant cards cleanly
  const visibleMembers = members.slice(0, 24);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '14px',
      padding: '20px',
      overflowY: 'auto',
      flex: 1
    }}>
      {visibleMembers.map((m) => {
        const isSelf = m.user_id === currentUserId;
        const cameraState = isSelf ? isCameraOnLocal : m.camera_on;
        const micState = isSelf ? isMicOnLocal : m.mic_on;

        // Calculate study duration string
        const startedTime = new Date(m.study_started_at || Date.now()).getTime();
        const minsStudied = Math.max(1, Math.round((Date.now() - startedTime) / (1000 * 60)));

        return (
          <div
            key={m.id}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              height: '160px',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Upper Area: Video Stream or Clean Avatar Fallback */}
            <div style={{
              flex: 1,
              background: cameraState ? 'rgba(99, 91, 255, 0.12)' : 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {cameraState ? (
                // Video Stream Placeholder / Live camera feed
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, rgba(99,91,255,0.2) 0%, transparent 70%)'
                  }} />
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#fff',
                    boxShadow: '0 0 16px rgba(99,91,255,0.4)',
                    zIndex: 2
                  }}>
                    {m.user_avatar}
                  </div>
                  <span style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(62, 207, 142, 0.2)',
                    color: 'var(--green)',
                    fontWeight: '600'
                  }}>
                    📷 CAM ON
                  </span>
                </div>
              ) : (
                // Clean Avatar Fallback State (NOT an empty black box)
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'var(--text-2)'
                }}>
                  {m.user_avatar}
                </div>
              )}

              {/* Status Icons Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '6px',
                right: '6px',
                display: 'flex',
                gap: '4px'
              }}>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  background: micState ? 'rgba(62,207,142,0.2)' : 'rgba(0,0,0,0.5)',
                  color: micState ? 'var(--green)' : 'var(--text-3)'
                }}>
                  {micState ? '🎙️' : '🔇'}
                </span>
                {m.hand_raised && (
                  <span style={{ fontSize: '11px', padding: '2px 4px', borderRadius: '4px', background: 'rgba(240, 165, 0, 0.2)' }}>
                    ✋
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div style={{
              padding: '8px 10px',
              background: 'rgba(18, 19, 26, 0.7)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)' }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.user_name} {isSelf && '(You)'}
                </span>
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-3)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {m.topic} • <strong style={{ color: 'var(--accent)' }}>{minsStudied} min</strong>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
