'use client';
import React, { useState } from 'react';
import { RoomMember } from '@/lib/library/types';

interface VirtualLibGridProps {
  members: RoomMember[];
  currentUserId?: string;
  isJoined: boolean;
  onLeaveHall: () => void;
}

export default function VirtualLibGrid({
  members,
  currentUserId,
  isJoined,
  onLeaveHall,
}: VirtualLibGridProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    { id: 'All', label: 'All (246)' },
    { id: 'DSA', label: 'DSA (72)' },
    { id: 'CS', label: 'CS Fundamentals (48)' },
    { id: 'Coding', label: 'Coding (39)' },
    { id: 'Placement', label: 'Placement (34)' },
    { id: 'University', label: 'University (28)' },
  ];

  // 8 Participant Cards matching reference screenshot
  const participants = [
    {
      id: 'p1',
      name: 'Anubhab',
      topic: 'DSA • Graphs',
      isSelf: true,
      hasVideo: true,
      avatar: 'AC',
      videoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p2',
      name: 'Riya',
      topic: 'DP Problems',
      isSelf: false,
      hasVideo: true,
      avatar: 'RS',
      videoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p3',
      name: 'Karan',
      topic: 'DBMS • Normalization',
      isSelf: false,
      hasVideo: false,
      hasBgImage: true,
      avatar: 'KM',
      bgUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p4',
      name: 'Meera',
      topic: 'System Design',
      isSelf: false,
      hasVideo: false,
      hasBgImage: false,
      avatar: 'M',
    },
    {
      id: 'p5',
      name: 'Arjun',
      topic: 'OS • Scheduling',
      isSelf: false,
      hasVideo: true,
      avatar: 'AV',
      videoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p6',
      name: 'Sana',
      topic: 'Web Development',
      isSelf: false,
      hasVideo: true,
      avatar: 'SN',
      videoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: 'p7',
      name: 'Dev',
      topic: 'Aptitude',
      isSelf: false,
      hasVideo: false,
      hasBgImage: false,
      avatar: 'D',
    },
    {
      id: 'p8',
      name: 'Isha',
      topic: 'SQL Practice',
      isSelf: false,
      hasVideo: false,
      hasBgImage: true,
      avatar: 'IS',
      bgUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header bar of Community Hall */}
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#9a9cb8'
          }}>
            <span>Camera view:</span>
            <span style={{ color: '#fff', cursor: 'pointer' }}>🔲</span>
            <span style={{ color: '#fff', cursor: 'pointer' }}>☰</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#ffffff',
            fontWeight: '600'
          }}>
            👥 246
          </div>

          <button
            onClick={onLeaveHall}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              background: 'rgba(217, 56, 72, 0.25)',
              border: '1px solid rgba(217, 56, 72, 0.5)',
              color: '#f87171',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Leave hall
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              style={{
                padding: '5px 14px',
                borderRadius: '16px',
                border: 'none',
                background: isActive ? '#5e43ff' : 'rgba(255, 255, 255, 0.06)',
                color: isActive ? '#ffffff' : '#9a9cb8',
                fontSize: '12px',
                fontWeight: isActive ? '600' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          );
        })}
        <button style={{
          padding: '5px 12px',
          borderRadius: '16px',
          border: 'none',
          background: 'rgba(255, 255, 255, 0.06)',
          color: '#9a9cb8',
          fontSize: '12px',
          cursor: 'pointer'
        }}>
          More ⌄
        </button>
      </div>

      {/* 8 Participant Cards Grid (2 rows x 4 columns) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        {participants.map((p) => (
          <div
            key={p.id}
            style={{
              height: '140px',
              borderRadius: '12px',
              background: '#161729',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Background Content */}
            {p.hasVideo ? (
              <img
                src={p.videoUrl}
                alt={p.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.85)'
                }}
              />
            ) : p.hasBgImage ? (
              <img
                src={p.bgUrl}
                alt={p.name}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.6)'
                }}
              />
            ) : (
              // Initial circle fallback
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, #242646 0%, #161729 100%)'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#5e43ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#ffffff',
                  boxShadow: '0 0 16px rgba(94, 67, 255, 0.4)'
                }}>
                  {p.avatar}
                </div>
              </div>
            )}

            {/* Top Bar inside Card */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '8px 10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {p.isSelf ? (
                <span style={{
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(94, 67, 255, 0.85)',
                  color: '#ffffff',
                  fontWeight: '600',
                  backdropFilter: 'blur(4px)'
                }}>
                  👍 You
                </span>
              ) : <div />}

              <span style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer'
              }}>
                ⋮
              </span>
            </div>

            {/* Bottom Overlay Label inside Card */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: '8px 10px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
                    {p.name}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '2px' }}>
                  {p.topic}
                </div>
              </div>

              {/* Muted Mic Icon */}
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(217, 56, 72, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#ffffff'
              }}>
                🎙️
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
