'use client';
import React from 'react';

interface RoomControlsProps {
  isCameraOn: boolean;
  isMicOn: boolean;
  isHandRaised: boolean;
  isFocusMode: boolean;
  voiceAllowed: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onToggleHand: () => void;
  onToggleFocusMode: () => void;
  onLeaveRoom: () => void;
}

export default function RoomControls({
  isCameraOn,
  isMicOn,
  isHandRaised,
  isFocusMode,
  voiceAllowed,
  onToggleCamera,
  onToggleMic,
  onToggleHand,
  onToggleFocusMode,
  onLeaveRoom,
}: RoomControlsProps) {
  return (
    <div style={{
      height: '64px',
      background: 'rgba(18, 19, 26, 0.85)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }}>
      {/* Left Info */}
      <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>
        Session Status: <strong style={{ color: 'var(--green)' }}>● Active Study Sprint</strong>
      </div>

      {/* Center Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Camera Toggle */}
        <button
          onClick={onToggleCamera}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: isCameraOn ? 'rgba(62, 207, 142, 0.18)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${isCameraOn ? 'rgba(62, 207, 142, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
            color: isCameraOn ? 'var(--green)' : 'var(--text-3)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isCameraOn ? '📷 Camera ON' : '📷 Camera OFF'}
        </button>

        {/* Mic Toggle */}
        <button
          onClick={onToggleMic}
          disabled={!voiceAllowed}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: isMicOn ? 'rgba(62, 207, 142, 0.18)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${isMicOn ? 'rgba(62, 207, 142, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
            color: isMicOn ? 'var(--green)' : 'var(--text-3)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: voiceAllowed ? 'pointer' : 'not-allowed',
            opacity: voiceAllowed ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title={voiceAllowed ? 'Toggle Microphone' : 'Voice is disabled by default in Community Hall'}
        >
          {isMicOn ? '🎙️ Mic ON' : '🔇 Mic OFF'}
        </button>

        {/* Ask to Talk / Hand Raise */}
        <button
          onClick={onToggleHand}
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: isHandRaised ? 'rgba(240, 165, 0, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${isHandRaised ? 'rgba(240, 165, 0, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
            color: isHandRaised ? '#f0a500' : 'var(--text-3)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isHandRaised ? '✋ Hand Raised' : '✋ Ask to Talk'}
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onToggleFocusMode}
          className={`btn ${isFocusMode ? 'btn-violet' : 'btn-ghost'}`}
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
        </button>

        <button
          onClick={onLeaveRoom}
          className="btn btn-ghost"
          style={{ padding: '6px 12px', fontSize: '12px', color: '#f04438', border: '1px solid rgba(240,68,56,0.3)' }}
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
