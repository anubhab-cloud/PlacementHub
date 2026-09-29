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
  '💡 Explain Graph BFS vs DFS',
  '📊 How is my DSA streak?',
  '⚡ Quick mock interview tip',
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'agent',
      text: 'Hey Anubhab! 👋 I\'m your **PlacementHub AI Agent**. Ask me anything about your DSA prep, resume tips, or mock interview strategies!',
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
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          stats: {
            easy_solved: 90,
            medium_solved: 110,
            hard_solved: 45,
            streak: 21,
            error_tags: ['Graph DFS', 'BFS'],
            recent_topics: ['Arrays', 'DP', 'Trees'],
            primary_language: 'C++',
          },
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
        text: '⚠️ Network error communicating with AI agent. Please try again.',
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
    // Basic helper to convert linebreaks, bullet points & bold markdown (**text**)
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      // Process bold syntax **bold**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={lineIdx} className="chatbot-bullet-item">
            {formattedParts}
          </li>
        );
      }
      return (
        <p key={lineIdx} className={lineIdx > 0 ? 'mt-1' : ''}>
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
              <div className="chatbot-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                </svg>
                <span className="chatbot-status-dot" />
              </div>
              <div>
                <div className="chatbot-title">PlacementHub Agent</div>
                <div className="chatbot-subtitle">Personal AI Coach • Gemini 1.5</div>
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
                  <div className="chatbot-msg-avatar">AI</div>
                )}
                <div className="chatbot-msg-bubble">
                  <div className="chatbot-msg-content">{formatText(msg.text)}</div>
                  <div className="chatbot-msg-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-msg-row agent-row">
                <div className="chatbot-msg-avatar">AI</div>
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
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
