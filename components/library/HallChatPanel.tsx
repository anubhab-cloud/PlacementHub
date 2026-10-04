'use client';
import React, { useState, useEffect, useRef } from 'react';
import { RoomMessage } from '@/lib/library/types';
import ActiveChallengesWidget from './ActiveChallengesWidget';

interface HallChatPanelProps {
  messages: RoomMessage[];
  onlineCount: number;
  currentUserId?: string;
  onSendMessage: (text: string) => void;
}

export default function HallChatPanel({
  messages,
  onlineCount,
  currentUserId,
  onSendMessage,
}: HallChatPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'people'>('chat');
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initial seed messages matching reference UI screenshot exactly
  const seedChat = [
    { id: '1', name: 'Riya', time: '5:24 PM', text: 'Starting 2 hours of DP problems. Anyone joining?', avatar: 'RS', color: '#10b981' },
    { id: '2', name: 'Karan', time: '5:25 PM', text: 'Anyone done the Amazon OA? Need tips.', avatar: 'KM', color: '#f59e0b' },
    { id: '3', name: 'Meera', time: '5:28 PM', text: 'Working on system design today 🚀', avatar: 'M', color: '#ec4899' },
    { id: '4', name: 'Arjun', time: '5:30 PM', text: 'Good luck everyone! 💪', avatar: 'AV', color: '#38bdf8' },
    { id: '5', name: 'Sana', time: '5:32 PM', text: 'Taking a short break, back in 5 mins.', avatar: 'SN', color: '#a78bfa' },
    { id: '6', name: 'Dev', time: '5:33 PM', text: 'Anyone up for SQL practice later?', avatar: 'D', color: '#facc15' },
    { id: '7', name: 'Isha', time: '5:34 PM', text: "Let's keep going! ✨", avatar: 'IS', color: '#635bff' },
  ];

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
      backdropFilter: 'blur(12px)'
    }}>
      {/* Top Header Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6px',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '3px',
        borderRadius: '10px',
        marginBottom: '14px'
      }}>
        <button
          onClick={() => setActiveTab('chat')}
          style={{
            padding: '6px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'chat' ? '#5e43ff' : 'transparent',
            color: activeTab === 'chat' ? '#ffffff' : '#9a9cb8',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          Hall chat
        </button>
        <button
          onClick={() => setActiveTab('people')}
          style={{
            padding: '6px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'people' ? '#5e43ff' : 'transparent',
            color: activeTab === 'people' ? '#ffffff' : '#9a9cb8',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          People ({onlineCount})
        </button>
      </div>

      {activeTab === 'chat' ? (
        <>
          {/* Messages List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingRight: '4px'
          }}>
            {seedChat.map((m) => (
              <div key={m.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: m.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#ffffff',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {m.avatar}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
                      {m.name}
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>
                      {m.time}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px', lineHeight: '1.4' }}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}

            {/* User Added Messages */}
            {messages.map((m) => (
              <div key={m.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#635bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#ffffff',
                  flexShrink: 0
                }}>
                  {m.user_avatar || 'AC'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
                      {m.user_name}
                    </span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>
                      Now
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px', lineHeight: '1.4' }}>
                    {m.message}
                  </div>
                </div>
              </div>
            ))}

            <div ref={chatBottomRef} />
          </div>

          {/* Input Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 8px',
            borderRadius: '10px',
            marginTop: '10px'
          }}>
            <input
              type="text"
              placeholder="Message the hall..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '11px'
              }}
            />
            <button style={{ background: 'none', border: 'none', color: '#9a9cb8', cursor: 'pointer', fontSize: '13px' }}>
              😊
            </button>
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                background: '#5e43ff',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: inputText.trim() ? 1 : 0.5
              }}
            >
              ✈️
            </button>
          </div>

          {/* Active Challenges Widget */}
          <ActiveChallengesWidget />
        </>
      ) : (
        /* People Tab List */
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {['Anubhab (You)', 'Riya Sharma', 'Karan Malhotra', 'Meera Deshmukh', 'Arjun Verma', 'Sana Patel', 'Dev Kumar', 'Isha Singh'].map((name, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#ffffff' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
