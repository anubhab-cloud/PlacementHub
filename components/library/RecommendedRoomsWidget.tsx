'use client';
import React from 'react';

export default function RecommendedRoomsWidget() {
  const rooms = [
    { title: 'DSA Deep Work', count: '48 studying', tags: ['Silent', 'Focus'], color: '#10b981' },
    { title: 'DBMS Discussion', count: '32 studying', tags: ['Chat', 'Q&A'], color: '#38bdf8' },
    { title: 'Placement Prep', count: '28 studying', tags: ['Silent', 'Goals'], color: '#a78bfa' },
    { title: 'Night Study', count: '18 studying', tags: ['Silent', 'Chill'], color: '#635bff' },
  ];

  return (
    <div style={{
      background: 'rgba(20, 21, 38, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px',
      padding: '14px 18px',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>Recommended rooms</span>
        <span style={{ fontSize: '11px', color: '#635bff', cursor: 'pointer', fontWeight: '600' }}>View all</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {rooms.map((r) => (
          <div
            key={r.title}
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: `${r.color}20`,
              border: `1px solid ${r.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px'
            }}>
              🏛️
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>{r.title}</div>
              <div style={{ fontSize: '10px', color: '#8b8ea9', marginTop: '2px' }}>{r.count}</div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                {r.tags.map((t) => (
                  <span key={t} style={{ fontSize: '9px', padding: '1px 4px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', color: '#9a9cb8' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
