'use client';
import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

type Message = { role: 'user' | 'assistant'; text: string; loading?: boolean };

const QUICK_PROMPTS = [
  'Analyze my DSA weak areas',
  'Give me a study plan for Amazon',
  'Explain Dynamic Programming simply',
  'Top 10 graph problems to practice',
  'What is the time complexity of quicksort?',
  'How to prepare OS for interviews?',
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hi Anubhab! I'm your AI performance analyst. I can analyze your coding patterns, create personalized study plans, and help you crack interviews. How can I help today?" },
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', text };
    const loadingMsg: Message = { role: 'assistant', text: '', loading: true };
    setMessages(m => [...m, userMsg, loadingMsg]);
    setInput('');
    setLoading(true);

    try {
      const statsRes = await fetch('/api/stats');
      const stats    = await statsRes.json();

      const res = await fetch('/api/ai/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text, stats }),
      });
      const data = await res.json();

      setMessages(m => [
        ...m.slice(0, -1),
        { role: 'assistant', text: data.reply ?? data.error ?? 'Could not get response.' },
      ]);
    } catch (e: any) {
      setMessages(m => [
        ...m.slice(0, -1),
        { role: 'assistant', text: `Error: ${e.message}. Make sure GEMINI_API_KEY is set in .env.local.` },
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-h) - 48px)' }}>
      <div className="page-header" style={{ flexShrink: 0 }}>
        <div>
          <h1 className="page-title">🤖 AI Assistant</h1>
          <p className="page-subtitle">Powered by Gemini 1.5 Flash · Your personal coding coach</p>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '8px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'assistant' && (
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, marginRight: '8px',
                background: 'linear-gradient(135deg,#7c3aed,#c026d3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
              }}>🤖</div>
            )}
            <div style={{
              maxWidth: '72%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? 'rgba(124,58,237,0.2)' : 'var(--black-2)',
              border: `1px solid ${m.role === 'user' ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
              fontSize: '13px', lineHeight: 1.65, color: 'var(--text-1)',
            }}>
              {m.loading ? (
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0,1,2].map(d => (
                    <div key={d} style={{
                      width: '6px', height: '6px', borderRadius: '50%', background: 'var(--violet-bright)',
                      animation: `bounce 1.2s ease-in-out ${d * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              ) : (
                m.role === 'assistant' && <div style={{ fontSize: '9px', color: 'var(--violet-bright)', fontWeight: 700, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Gemini</div>
              )}
              {!m.loading && <span style={{ whiteSpace: 'pre-wrap' }}>{m.text}</span>}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px', flexShrink: 0 }}>
        {QUICK_PROMPTS.map(p => (
          <button key={p} onClick={() => send(p)} disabled={loading} style={{
            padding: '5px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 600,
            background: 'var(--violet-soft)', border: '1px solid rgba(124,58,237,0.3)',
            color: 'var(--violet-bright)', cursor: loading ? 'default' : 'pointer',
          }}>{p}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
        <input
          id="ai-chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          placeholder="Ask anything about DSA, interviews, system design..."
          disabled={loading}
          style={{
            flex: 1, padding: '13px 18px', borderRadius: '100px', fontSize: '13px',
            background: 'var(--black-2)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-1)', outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(124,58,237,0.5)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
        />
        <button className="btn btn-violet" id="btn-ai-send" onClick={() => send(input)} disabled={loading}>
          {loading ? '...' : 'Send →'}
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%,60%,100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
