'use client';
import React, { useState, useEffect, useRef } from 'react';
import { RoomMessage, RoomMember } from '@/lib/library/types';

interface HallChatPanelProps {
  messages: RoomMessage[];
  members: RoomMember[];
  onlineCount?: number; // kept for compat but derived from members now
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  onSendMessage: (text: string) => void;
  roomId: string;
}

const AVATAR_COLORS = [
  '#5e43ff', '#10b981', '#f59e0b', '#ec4899', '#38bdf8', '#a78bfa', '#635bff', '#facc15', '#ef4444',
];
function getAvatarColor(avatar: string): string {
  let hash = 0;
  for (let i = 0; i < avatar.length; i++) hash = avatar.charCodeAt(i) + hash * 31;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatTime(isoStr: string): string {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Now';
  }
}

export default function HallChatPanel({
  messages,
  members,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onSendMessage,
  roomId,
}: HallChatPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'people'>('chat');
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div style={{
      width: '280px',
      background: 'rgba(16, 17, 28, 0.75)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 14px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Header Tabs */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px',
        background: 'rgba(0, 0, 0, 0.3)', padding: '3px',
        borderRadius: '10px', marginBottom: '14px',
      }}>
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            padding: '6px', borderRadius: '8px', border: 'none',
            background: activeTab === 'chat' ? '#5e43ff' : 'transparent',
            color: activeTab === 'chat' ? '#ffffff' : '#9a9cb8',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'center',
          }}
        >
          Hall chat
        </button>
        <button
          onClick={() => setActiveTab('people')}
          style={{
            padding: '6px', borderRadius: '8px', border: 'none',
            background: activeTab === 'people' ? '#5e43ff' : 'transparent',
            color: activeTab === 'people' ? '#ffffff' : '#9a9cb8',
            fontSize: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'center',
          }}
        >
          People ({members.length})
        </button>
      </div>

      {activeTab === 'chat' ? (
        <>
          {/* Messages List */}
          <div style={{
            flex: 1, overflowY: 'auto', display: 'flex',
            flexDirection: 'column', gap: '12px', paddingRight: '4px',
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center', color: '#64748b', fontSize: '12px',
                marginTop: '20px', padding: '0 10px',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
                No messages yet. Be the first to say hi!
              </div>
            )}

            {messages.map((m) => {
              const isSelf = m.user_id === currentUserId;
              const color = getAvatarColor(m.user_avatar || 'AC');
              return (
                <div key={m.id} style={{
                  display: 'flex', gap: '8px', alignItems: 'flex-start',
                  flexDirection: isSelf ? 'row-reverse' : 'row',
                }}>
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%', background: color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: '700', color: '#ffffff',
                    flexShrink: 0, marginTop: '2px',
                  }}>
                    {m.user_avatar || 'AC'}
                  </div>
                  <div style={{ maxWidth: '170px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      flexDirection: isSelf ? 'row-reverse' : 'row',
                    }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: isSelf ? '#a78bfa' : '#ffffff' }}>
                        {isSelf ? 'You' : m.user_name.split(' ')[0]}
                      </span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>
                        {formatTime(m.created_at)}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '11px', color: '#cbd5e1', marginTop: '3px',
                      lineHeight: '1.4',
                      background: isSelf ? 'rgba(94, 67, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isSelf ? 'rgba(94, 67, 255, 0.3)' : 'rgba(255,255,255,0.06)'}`,
                      padding: '6px 8px', borderRadius: '8px',
                    }}>
                      {m.message}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Box */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 8px', borderRadius: '10px', marginTop: '10px',
          }}>
            <input
              type="text"
              placeholder="Message the hall..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                outline: 'none', color: '#ffffff', fontSize: '11px',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              style={{
                width: '26px', height: '26px', borderRadius: '8px',
                background: '#5e43ff', border: 'none', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', opacity: inputText.trim() ? 1 : 0.5,
                fontSize: '13px',
              }}
            >
              ➤
            </button>
          </div>
        </>
      ) : (
        /* People Tab — real members list */
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {members.length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '20px' }}>
              No one online yet.
            </div>
          )}
          {members.map((m) => {
            const isSelf = m.user_id === currentUserId;
            const color = getAvatarColor(m.user_avatar || 'AC');
            const startMs = m.study_started_at ? new Date(m.study_started_at).getTime() : Date.now();
            const durationMin = Math.max(0, Math.floor((Date.now() - startMs) / 60000));

            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '6px 8px', borderRadius: '8px',
                background: isSelf ? 'rgba(94, 67, 255, 0.08)' : 'transparent',
                border: isSelf ? '1px solid rgba(94, 67, 255, 0.2)' : '1px solid transparent',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', color: '#ffffff', flexShrink: 0,
                }}>
                  {m.user_avatar || 'AC'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {m.user_name.split(' ')[0]}
                    {isSelf && <span style={{ fontSize: '9px', color: '#a78bfa' }}>· you</span>}
                    {m.hand_raised && <span style={{ fontSize: '11px' }}>✋</span>}
                  </div>
                  <div style={{ fontSize: '10px', color: '#8b8ea9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.topic || 'General Study'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>
                    {durationMin}m
                  </div>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
