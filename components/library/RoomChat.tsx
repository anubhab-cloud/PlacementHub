'use client';
import React, { useState, useEffect, useRef } from 'react';
import { RoomMessage } from '@/lib/library/types';

interface RoomChatProps {
  messages: RoomMessage[];
  onlineCount: number;
  currentUserId?: string;
  onSendMessage: (text: string) => void;
}

export default function RoomChat({
  messages,
  onlineCount,
  currentUserId,
  onSendMessage,
}: RoomChatProps) {
  const [inputText, setInputText] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // Simulate subtle peer typing indicators periodically
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.6) {
        const pool = ['Riya S.', 'Karan M.', 'Priya D.'];
        const chosen = pool[Math.floor(Math.random() * pool.length)];
        setTypingUser(chosen);
        setTimeout(() => setTypingUser(null), 2500);
      }
    }, 14000);
    return () => clearInterval(timer);
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div style={{
      width: '280px',
      background: 'rgba(18, 19, 26, 0.6)',
      borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.01)'
      }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-1)' }}>
            💬 Room Chat
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>
            ● {onlineCount} online
          </span>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-3)', fontSize: '12px' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👋</div>
            You're the first one here. Say hello to your study peers!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.user_id === currentUserId || msg.is_me;
            const timeFormatted = new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexDirection: isMe ? 'row-reverse' : 'row',
                  alignItems: 'flex-start'
                }}
              >
                {!isMe && (
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: '700',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    {msg.user_avatar || 'AC'}
                  </div>
                )}

                <div style={{ maxWidth: '78%' }}>
                  {!isMe && (
                    <div style={{ fontSize: '10px', color: 'var(--text-3)', marginBottom: '2px', fontWeight: '600' }}>
                      {msg.user_name} • <span style={{ fontWeight: 'normal' }}>{timeFormatted}</span>
                    </div>
                  )}

                  <div style={{
                    padding: '8px 12px',
                    borderRadius: isMe ? '12px 12px 2px 12px' : '2px 12px 12px 12px',
                    background: isMe ? 'rgba(99, 91, 255, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isMe ? 'rgba(99, 91, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                    color: 'var(--text-1)',
                    fontSize: '12px',
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}>
                    {msg.message}
                  </div>

                  {isMe && (
                    <div style={{ fontSize: '9px', color: 'var(--text-3)', marginTop: '2px', textAlign: 'right' }}>
                      {timeFormatted}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {typingUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>
            <span style={{ fontSize: '10px' }}>💬</span>
            <em>{typingUser} is typing...</em>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(18, 19, 26, 0.9)',
        display: 'flex',
        gap: '8px'
      }}>
        <input
          type="text"
          placeholder="Write a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-1)',
            fontSize: '12px',
            outline: 'none'
          }}
        />

        <button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className="btn btn-violet"
          style={{ padding: '6px 12px', fontSize: '12px', opacity: inputText.trim() ? 1 : 0.5 }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
