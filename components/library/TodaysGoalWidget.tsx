'use client';
import React, { useState } from 'react';

export default function TodaysGoalWidget() {
  const [goals, setGoals] = useState([
    { id: 1, text: 'Solve 3 DSA problems', count: '2/3', done: true },
    { id: 2, text: 'Study DBMS normalization', count: '1/1', done: true },
    { id: 3, text: 'Read OS scheduling notes', count: '0/1', done: false },
    { id: 4, text: 'Revise SQL joins', count: '0/1', done: false },
    { id: 5, text: 'Attend group session', count: '0/1', done: false },
  ]);

  const toggleGoal = (id: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const completedCount = goals.filter((g) => g.done).length;
  const pct = Math.round((completedCount / goals.length) * 100);

  return (
    <div style={{
      background: 'rgba(20, 21, 38, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px',
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>Today's goal</span>
        <span style={{ fontSize: '11px', color: '#635bff', cursor: 'pointer', fontWeight: '600' }}>Edit</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {goals.map((g) => (
          <div
            key={g.id}
            onClick={() => toggleGoal(g.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: g.done ? '#ffffff' : '#9a9cb8',
              cursor: 'pointer',
              padding: '2px 0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '14px',
                height: '14px',
                borderRadius: '4px',
                background: g.done ? '#5e43ff' : 'transparent',
                border: `1px solid ${g.done ? '#5e43ff' : 'rgba(255,255,255,0.2)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                color: '#fff'
              }}>
                {g.done && '✓'}
              </span>
              <span style={{ textDecoration: g.done ? 'none' : 'none' }}>{g.text}</span>
            </div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>{g.count}</span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: '14px' }}>
        <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: '#5e43ff', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px', color: '#8b8ea9', marginTop: '4px' }}>
          {pct}% complete
        </div>
      </div>
    </div>
  );
}
