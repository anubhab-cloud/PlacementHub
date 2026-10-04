'use client';
import React, { useState, useEffect } from 'react';

export default function FocusTimerWidget() {
  const [secondsLeft, setSecondsLeft] = useState(24 * 60 + 36);
  const [isRunning, setIsRunning] = useState(true);
  const [activeSound, setActiveSound] = useState<string | null>('rain');
  const [volume, setVolume] = useState(70);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 25 * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const sounds = [
    { id: 'spotify', label: '🎧' },
    { id: 'rain', label: '🌧️' },
    { id: 'lofi', label: '🎹' },
    { id: 'cafe', label: '☕' },
    { id: 'waves', label: '🌊' },
  ];

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>Focus session</span>
        <span style={{
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '12px',
          background: 'rgba(99, 91, 255, 0.15)',
          color: '#a78bfa',
          fontWeight: '600'
        }}>
          Pomodoro 25/5
        </span>
      </div>

      {/* Ring Timer */}
      <div style={{ textAlign: 'center', margin: '14px 0', position: 'relative' }}>
        <div style={{
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          border: '6px solid rgba(99, 91, 255, 0.2)',
          borderTopColor: '#635bff',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99, 91, 255, 0.3)'
        }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', fontFamily: 'monospace' }}>
            {timeStr}
          </div>
          <div style={{ fontSize: '9px', color: '#8b8ea9', marginTop: '2px' }}>
            Focus time
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#9a9cb8', marginTop: '8px' }}>
          🎯 Goal: 2 hours - DSA
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            background: '#5e43ff',
            border: 'none',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {isRunning ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={() => setSecondsLeft(25 * 60)}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            background: 'rgba(217, 56, 72, 0.3)',
            border: '1px solid rgba(217, 56, 72, 0.5)',
            color: '#f87171',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          End session
        </button>
      </div>

      {/* Ambient Sound Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '6px 10px',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {sounds.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSound(activeSound === s.id ? null : s.id)}
              style={{
                background: activeSound === s.id ? 'rgba(99, 91, 255, 0.4)' : 'transparent',
                border: 'none',
                borderRadius: '4px',
                padding: '2px 4px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ width: '50px', accentColor: '#635bff', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
