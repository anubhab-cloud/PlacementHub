'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  '🎯 What should I study today?',
  '😴 Tired after coding? Study break tip',
  '💡 Explain Graph BFS vs DFS',
  '⚡ Quick mock interview tip',
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'Hey Anubhab! 👋 I\'m your **PlacementHub AI Buddy**! Don\'t fall asleep on your keyboard like me — ask me anything about DSA, resume tips, or mock interviews!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      // Get real user stats from localStorage if available
      let userStats = {
        easy_solved: 90,
        medium_solved: 110,
        hard_solved: 45,
        streak: 21,
        error_tags: ['Graph DFS', 'BFS'],
        recent_topics: ['Arrays', 'DP', 'Trees'],
        primary_language: 'C++',
      };

      const saved = localStorage.getItem('nexusprep_stats');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          userStats = { ...userStats, ...parsed };
        } catch (e) {}
      }

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          stats: userStats,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || "Sorry, I couldn't process that request right now.";

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentMsg]);
      if (!isOpen) {
        setUnreadCount((count) => count + 1);
      }
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: '⚡ I\'m processing offline mode! Ask me about study plans, graph BFS/DFS, DP strategies, or interview tips.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      if (!line.trim()) return <div key={lineIdx} style={{ height: '6px' }} />;

      // Process inline formatting (bold **text** and code `code`)
      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ color: '#fff', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={pIdx}
              style={{
                background: 'rgba(124, 58, 237, 0.15)',
                color: '#A78BFA',
                padding: '1px 5px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '11px',
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });

      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+\./.test(line.trim());

      if (isBullet) {
        return (
          <div key={lineIdx} className="chatbot-bullet-item" style={{ display: 'flex', gap: '6px', margin: '3px 0' }}>
            <span style={{ color: '#A78BFA' }}>•</span>
            <div style={{ flex: 1 }}>{formattedParts}</div>
          </div>
        );
      }

      return (
        <p key={lineIdx} style={{ margin: '2px 0' }}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div className="floating-chatbot-container">
      {/* ── Chat Window ── */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-img-wrap">
                <img src="/chatbot-avatar.png" alt="AI Mascot" className="chatbot-header-avatar-img" />
                <span className="chatbot-status-dot" />
              </div>
              <div>
                <div className="chatbot-title">PlacementHub AI Buddy</div>
                <div className="chatbot-subtitle">Personal Prep Coach • Gemini 1.5</div>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button
                className="chatbot-icon-btn"
                title="Clear Chat"
                onClick={() => setMessages([messages[0]])}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
              <button
                className="chatbot-icon-btn"
                title="Minimize"
                onClick={() => setIsOpen(false)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="chatbot-prompts">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                className="chatbot-prompt-chip"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-msg-row ${msg.sender === 'user' ? 'user-row' : 'agent-row'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="chatbot-msg-avatar-img-wrap">
                    <img src="/chatbot-avatar.png" alt="AI Avatar" className="chatbot-msg-avatar-img" />
                  </div>
                )}
                <div className="chatbot-msg-bubble">
                  <div className="chatbot-msg-content">{formatText(msg.text)}</div>
                  <div className="chatbot-msg-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-msg-row agent-row">
                <div className="chatbot-msg-avatar-img-wrap">
                  <img src="/chatbot-avatar.png" alt="AI Avatar" className="chatbot-msg-avatar-img" />
                </div>
                <div className="chatbot-msg-bubble typing-bubble">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Ask your AI agent..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="chatbot-input"
            />
            <button
              className="chatbot-send-btn"
              disabled={!input.trim() || isTyping}
              onClick={() => handleSend()}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Trigger Button ── */}
      <button
        className={`floating-chatbot-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Agent Chat"
      >
        {!isOpen ? (
          <>
            <img src="/chatbot-avatar.png" alt="AI Mascot" className="chatbot-trigger-avatar-img" />
            <span className="trigger-pulse-glow" />
            {unreadCount > 0 && <span className="trigger-badge">{unreadCount}</span>}
          </>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        )}
      </button>
    </div>
  );
}
