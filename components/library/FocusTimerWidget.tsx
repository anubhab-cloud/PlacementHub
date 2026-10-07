'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { startStudySession, endStudySession } from '@/lib/library/room-engine';

interface FocusTimerWidgetProps {
  userId?: string;
  roomId?: string;
  roomName?: string;
  topic?: string;
}

const POMODORO_WORK = 25 * 60;   // 25 min
const POMODORO_BREAK = 5 * 60;   // 5 min

export default function FocusTimerWidget({
  userId = 'anon',
  roomId = 'community-hall-1',
  roomName = 'Community Study Hall',
  topic = 'General Study',
}: FocusTimerWidgetProps) {
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_WORK);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  // Timer countdown
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setIsRunning(false);
          setIsBreak((b) => !b);
          return isBreak ? POMODORO_WORK : POMODORO_BREAK;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isBreak]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Ring progress (0–1)
  const total = isBreak ? POMODORO_BREAK : POMODORO_WORK;
  const progress = 1 - secondsLeft / total;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const handleStartStop = useCallback(() => {
    if (!sessionActive) {
      startStudySession(roomId, roomName, userId, topic);
      setSessionActive(true);
    }
    setIsRunning((r) => !r);
  }, [sessionActive, roomId, roomName, userId, topic]);

  const handleEndSession = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(POMODORO_WORK);
    setIsBreak(false);
    setSessionActive(false);
    endStudySession();
  }, []);

  return (
    <div style={{
      background: 'rgba(20, 21, 38, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px', padding: '16px 18px',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', height: '100%',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>Focus session</span>
        <span style={{
          fontSize: '11px', padding: '2px 8px', borderRadius: '12px',
          background: isBreak ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 91, 255, 0.15)',
          color: isBreak ? '#10b981' : '#a78bfa', fontWeight: '600',
        }}>
          {isBreak ? '☕ Break' : '🎯 Focus 25'}
        </span>
      </div>

      {/* SVG Ring Timer */}
      <div style={{ textAlign: 'center', margin: '14px 0', position: 'relative' }}>
        <svg width="110" height="110" style={{ display: 'block', margin: '0 auto' }}>
          {/* Background ring */}
          <circle cx="55" cy="55" r={radius} fill="none" stroke="rgba(99,91,255,0.15)" strokeWidth="6" />
          {/* Progress ring */}
          <circle
            cx="55" cy="55" r={radius}
            fill="none"
            stroke={isBreak ? '#10b981' : '#635bff'}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '55px 55px', transition: 'stroke-dashoffset 1s linear' }}
          />
          {/* Center text */}
          <text x="55" y="51" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="800" fontFamily="monospace">
            {timeStr}
          </text>
          <text x="55" y="65" textAnchor="middle" fill="#8b8ea9" fontSize="9">
            {isBreak ? 'Break time' : 'Focus time'}
          </text>
        </svg>

        {sessionActive && (
          <div style={{ fontSize: '11px', color: '#9a9cb8', marginTop: '4px' }}>
            🎯 {topic}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={handleStartStop}
          style={{
            flex: 1, padding: '8px', borderRadius: '8px',
            background: isRunning ? 'rgba(99, 91, 255, 0.3)' : '#5e43ff',
            border: isRunning ? '1px solid rgba(99, 91, 255, 0.5)' : 'none',
            color: '#ffffff', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          {isRunning ? '⏸ Pause' : sessionActive ? '▶ Resume' : '▶ Start'}
        </button>
        <button
          onClick={handleEndSession}
          disabled={!sessionActive}
          style={{
            flex: 1, padding: '8px', borderRadius: '8px',
            background: 'rgba(217, 56, 72, 0.3)',
            border: '1px solid rgba(217, 56, 72, 0.5)',
            color: '#f87171', fontSize: '12px', fontWeight: '600',
            cursor: sessionActive ? 'pointer' : 'not-allowed', opacity: sessionActive ? 1 : 0.5,
          }}
        >
          End session
        </button>
      </div>

      <div style={{ fontSize: '10px', color: '#8b8ea9', textAlign: 'center' }}>
        Timer runs in this tab. Pause it any time.
      </div>
    </div>
  );
}
