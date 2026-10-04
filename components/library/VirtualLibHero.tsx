'use client';
import React from 'react';

interface VirtualLibHeroProps {
  studentsCount: number;
  activeRoomsCount: number;
  totalHoursToday: string;
  weeklySessionsCount: string;
}

export default function VirtualLibHero({
  studentsCount,
  activeRoomsCount,
  totalHoursToday,
  weeklySessionsCount,
}: VirtualLibHeroProps) {
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
      flexWrap: 'wrap'
    }}>
      {/* Ambient Glow Background Effect */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        left: '20%',
        width: '300px',
        height: '150px',
        background: 'rgba(107, 82, 255, 0.2)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, flex: 1, minWidth: '300px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '4px' }}>
          Virtual <span style={{ color: '#a78bfa' }}>library</span>
        </h1>
        <p style={{ fontSize: '14px', color: '#a0a3c4', marginBottom: '20px' }}>
          Study together, stay consistent, achieve more.
        </p>

        {/* 4 Metric Stats Cards */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Metric 1 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 14px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '20px', color: '#a78bfa' }}>👥</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', lineHeight: '1.2' }}>
                {studentsCount}
              </div>
              <div style={{ fontSize: '11px', color: '#8b8ea9' }}>students studying</div>
            </div>
          </div>

          {/* Metric 2 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 14px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '20px', color: '#635bff' }}>🎯</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', lineHeight: '1.2' }}>
                {activeRoomsCount}
              </div>
              <div style={{ fontSize: '11px', color: '#8b8ea9' }}>active rooms</div>
            </div>
          </div>

          {/* Metric 3 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 14px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '20px', color: '#38bdf8' }}>⏱️</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', lineHeight: '1.2' }}>
                {totalHoursToday}
              </div>
              <div style={{ fontSize: '11px', color: '#8b8ea9' }}>focus time today</div>
            </div>
          </div>

          {/* Metric 4 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '8px 14px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '20px', color: '#10b981' }}>📊</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', lineHeight: '1.2' }}>
                {weeklySessionsCount}
              </div>
              <div style={{ fontSize: '11px', color: '#8b8ea9' }}>study sessions this week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Inspirational Quote Card on Right */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '16px 20px',
        maxWidth: '280px',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{ fontSize: '13px', color: '#e2e8f0', fontStyle: 'italic', lineHeight: '1.5' }}>
          "Good environment today. Let's be productive together! ✨"
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#a78bfa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: '700',
            color: '#fff'
          }}>
            RS
          </div>
          <span style={{ fontSize: '11px', color: '#8b8ea9' }}>Riya • 2h ago</span>
        </div>
      </div>
    </div>
  );
}
