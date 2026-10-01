'use client';
import { useState, useEffect, useRef } from 'react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Msg = { id: number; user: string; avatar: string; color: string; text: string; time: string; isMe: boolean; };
type Resource = { id: number; title: string; type: 'PDF'|'Video'|'Link'|'Note'|'Book'; tag: string; author: string; pages?: string; };

/* ─── Static Data ────────────────────────────────────────────────────────── */
const ROOMS = [
  { id: 'dsa',       name: 'DSA Grind',         subject: 'Arrays, DP & Graphs',  color: '#7C3AED', users: 8  },
  { id: 'sysdesign', name: 'System Design',      subject: 'Distributed Systems',  color: '#10B981', users: 5  },
  { id: 'cp',        name: 'CP Contest Prep',    subject: 'Competitive Coding',   color: '#F59E0B', users: 3  },
  { id: 'interview', name: 'Interview Prep',     subject: 'Behavioral + Tech',    color: '#38BDF8', users: 12 },
];

const RESOURCE_TAGS = ['All', 'DSA', 'System Design', 'CP', 'Interview', 'Books'];

const RESOURCES: Resource[] = [
  { id: 1, title: 'CLRS — Introduction to Algorithms',   type: 'Book',  tag: 'DSA',           author: 'Cormen et al.', pages: '1312' },
  { id: 2, title: "Striver's A2Z DSA Sheet",             type: 'Link',  tag: 'DSA',           author: 'Striver'                     },
  { id: 3, title: 'System Design Interview Vol. 1',      type: 'Book',  tag: 'System Design', author: 'Alex Xu',       pages: '309'  },
  { id: 4, title: 'CP Handbook — Antti Laaksonen',       type: 'PDF',   tag: 'CP',            author: 'Laaksonen',     pages: '296'  },
  { id: 5, title: 'Gaurav Sen — System Design Series',   type: 'Video', tag: 'System Design', author: 'Gaurav Sen'                  },
  { id: 6, title: 'NeetCode 150 Patterns',               type: 'Link',  tag: 'DSA',           author: 'NeetCode'                    },
  { id: 7, title: 'Behavioral Interview Prep Guide',     type: 'Note',  tag: 'Interview',     author: 'PlacementHub'                },
  { id: 8, title: 'Graph Algorithms Cheatsheet',         type: 'PDF',   tag: 'DSA',           author: 'Community',     pages: '12'   },
  { id: 9, title: 'Operating Systems: Three Easy Pieces',type: 'Book',  tag: 'Books',         author: 'Arpaci-Dusseau',pages: '714'  },
  { id:10, title: 'LLD Interview Patterns',              type: 'Note',  tag: 'Interview',     author: 'PlacementHub'                },
];

const TYPE_META: Record<string, { bg: string; color: string }> = {
  PDF:   { bg: 'rgba(239, 68, 68, 0.1)',  color: '#EF4444' },
  Video: { bg: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' },
  Link:  { bg: 'rgba(56, 189, 248, 0.1)', color: '#38BDF8' },
  Note:  { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981' },
  Book:  { bg: 'rgba(124, 58, 237, 0.15)',color: '#A78BFA' },
};

const BOT_POOL = [
  { user: 'Riya S.',  avatar: 'RS', color: '#10B981', texts: [
    'Just solved Longest Consecutive Sequence using hash set — O(n)! 🔥',
    "Does anyone know the trick for Kruskal's vs Prim's here?",
    'Tip: always draw the recursion tree before coding DP. Saves so much time.',
  ]},
  { user: 'Karan M.', avatar: 'KM', color: '#F59E0B', texts: [
    "Striver's A2Z Day 14 done! Graphs are finally clicking 🎉",
    'For interval scheduling — always sort by end time, not start!',
    'Mock interview in 20 min. Feeling nervous but ready 🤞',
  ]},
  { user: 'Priya D.', avatar: 'PD', color: '#38BDF8', texts: [
    'Shared sliding window notes in Resources tab — check it out!',
    'Binary lifting for LCA just blew my mind 🤯',
    'Anyone tried the new Amazon OA problem set? It is rough.',
  ]},
  { user: 'Ankit R.', avatar: 'AR', color: '#A78BFA', texts: [
    'Codeforces Div 3 — 5/7 done! Graphs problem got me 😅',
    'Backtracking + pruning = secret weapon for N-Queens style problems',
    'Got the Google intern offer!! This room helped so much 🎉🎉',
  ]},
];

const SEED_MSGS: Msg[] = [
  { id:1, user:'Riya S.',  avatar:'RS', color:'#10B981', text:'Hey everyone! Starting with Two Sum approach today 🎯',         time:'10:58', isMe:false },
  { id:2, user:'Karan M.', avatar:'KM', color:'#F59E0B', text:"Let's go! HashMap approach gives O(n). Beats brute force easily", time:'10:59', isMe:false },
  { id:3, user:'You',      avatar:'AC', color:'#7C3AED', text:'Just finished 3 medium DP problems — feeling unstoppable 💪',    time:'11:00', isMe:true  },
  { id:4, user:'Priya D.', avatar:'PD', color:'#38BDF8', text:'Can someone share the sliding window notes? Still confused on it', time:'11:01', isMe:false },
];

const INIT_NOTES = `# Sliding Window — Shared Notes\n\n## Core Idea\nMaintain a window [l, r] and expand/contract based on the constraint.\n\n## Template (Python)\n\`\`\`python\nl = 0\nfor r in range(n):\n    # expand: add nums[r] to window\n    while window_is_invalid():\n        # shrink: remove nums[l]\n        l += 1\n    ans = max(ans, r - l + 1)\n\`\`\`\n\n## Key Problems\n- Longest Substring Without Repeating Characters (LC 3)\n- Minimum Window Substring (LC 76)\n- Max Sum Subarray of Size K\n- Permutation in String (LC 567)\n\n## Edge Cases\n- Empty string/array\n- All unique vs all duplicate elements\n- Window size equals array size\n\n---\n*Last edited by Priya D. · collaborative editing enabled*`;

const nowStr = () => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

export default function LibraryPage() {
  const [activeRoom, setActiveRoom]   = useState('dsa');
  const [activeTab, setActiveTab]     = useState<'chat'|'notes'|'timer'>('chat');
  const [messages, setMessages]       = useState<Msg[]>(SEED_MSGS);
  const [input, setInput]             = useState('');
  const [typingUser, setTypingUser]   = useState<string|null>(null);
  const [filterTag, setFilterTag]     = useState('All');
  const [searchQ, setSearchQ]         = useState('');
  const [saved, setSaved]             = useState<Set<number>>(new Set([3, 6]));
  const [notes, setNotes]             = useState(INIT_NOTES);
  const [timerLeft, setTimerLeft]     = useState(25 * 60);
  const [timerRunning, setTimerRun]   = useState(false);
  const [timerMode, setTimerMode]     = useState<'work'|'break'>('work');
  const [sessions, setSessions]       = useState(3);
  const [onlineCount, setOnlineCount] = useState(8);

  const chatRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const room     = ROOMS.find(r => r.id === activeRoom) ?? ROOMS[0];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, typingUser]);

  useEffect(() => {
    const id = setInterval(() => {
      const bot  = BOT_POOL[Math.floor(Math.random() * BOT_POOL.length)];
      const text = bot.texts[Math.floor(Math.random() * bot.texts.length)];
      setTypingUser(bot.user);
      const tid = setTimeout(() => {
        setTypingUser(null);
        setMessages(prev => [...prev, { id: Date.now(), ...bot, text, time: nowStr(), isMe: false }]);
      }, 2300);
      return () => clearTimeout(tid);
    }, 11000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setOnlineCount(n => Math.max(5, Math.min(18, n + (Math.random() > 0.5 ? 1 : -1)))), 13000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerLeft(t => {
        if (t <= 1) {
          setTimerRun(false);
          const next = timerMode === 'work' ? 'break' : 'work';
          if (timerMode === 'work') setSessions(s => s + 1);
          setTimerMode(next);
          return next === 'work' ? 25 * 60 : 5 * 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerMode]);

  const sendMsg = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), user:'You', avatar:'AC', color:'#7C3AED', text: input.trim(), time: nowStr(), isMe: true }]);
    setInput('');
    inputRef.current?.focus();
  };

  const toggleSave = (id: number) => setSaved(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const filteredRes = RESOURCES.filter(r =>
    (filterTag === 'All' || r.tag === filterTag) &&
    (!searchQ || r.title.toLowerCase().includes(searchQ.toLowerCase()))
  );

  const totalSecs   = timerMode === 'work' ? 25 * 60 : 5 * 60;
  const circumf     = 2 * Math.PI * 54;
  const dashOffset  = circumf * (1 - timerLeft / totalSecs);
  const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="dashboard-container" style={{ paddingBottom: '30px' }}>
      {/* ── Banner Hero Card ── */}
      <div className="dashboard-hero-card" style={{ marginBottom: '20px' }}>
        <div>
          <h1 className="hero-title">
            📚 Digital Library & Study Rooms
            <span style={{ marginLeft: 10, fontSize: 11, fontWeight: 600, color: '#10B981',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              padding: '2px 10px', borderRadius: 100, verticalAlign: 'middle' }}>
              ● {onlineCount} online
            </span>
          </h1>
          <p className="hero-subtitle">{ROOMS.length} active rooms · Collaborative study platform · Live peer chat</p>
        </div>
      </div>

      {/* ── 3-Column Layout ── */}
      <div className="dashboard-row-grid" style={{ gridTemplateColumns: '220px 1fr 260px', alignItems: 'start' }}>

        {/* ── LEFT: Rooms ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '4px 2px', marginBottom: 2 }}>
            Study Rooms
          </div>

          {ROOMS.map(r => (
            <button key={r.id} id={`btn-room-${r.id}`} onClick={() => setActiveRoom(r.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: '8px', width: '100%', textAlign: 'left', cursor: 'pointer',
                background: activeRoom === r.id ? '#12131A' : 'transparent',
                border: activeRoom === r.id ? '1px solid #7C3AED' : '1px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0, boxShadow: `0 0 6px ${r.color}80` }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.subject}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, flexShrink: 0, padding: '1px 6px', borderRadius: 100,
                color: activeRoom === r.id ? r.color : '#6B7280',
                background: activeRoom === r.id ? `${r.color}18` : 'transparent',
              }}>
                {activeRoom === r.id ? onlineCount : r.users}
              </span>
            </button>
          ))}

          {/* My Stats mini-card */}
          <div className="dashboard-widget-card" style={{ marginTop: 12, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>My Stats</div>
            {[
              { label: 'Hours Today', value: '3.5h',          color: '#38BDF8' },
              { label: 'Sessions',    value: `${sessions}`,   color: '#F59E0B' },
              { label: 'Saved',       value: `${saved.size}`, color: '#10B981' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: '#9CA3AF' }}>{s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTER: Study Room ── */}
        <div className="dashboard-widget-card" style={{ padding: 0, overflow: 'hidden' }}>

          {/* Room header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 12, background: '#1A1C28' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: room.color, boxShadow: `0 0 10px ${room.color}` }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{room.name}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>{room.subject}</div>
            </div>
            {/* Online avatars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {BOT_POOL.map((b, i) => (
                <div key={b.avatar} style={{ width: 24, height: 24, borderRadius: '50%', background: b.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: 'white',
                  marginLeft: i > 0 ? -6 : 0, border: '2px solid #12131A', flexShrink: 0,
                }}>{b.avatar}</div>
              ))}
              <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 8 }}>+{Math.max(0, onlineCount - 4)} online</span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', background: '#12131A' }}>
            {(['chat','notes','timer'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '10px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                color: activeTab === tab ? '#A78BFA' : '#9CA3AF',
                borderBottom: activeTab === tab ? '2px solid #7C3AED' : '2px solid transparent',
                background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                transition: 'color 0.15s',
              }}>
                {tab === 'chat' ? '💬 Live Chat' : tab === 'notes' ? '📝 Shared Notes' : '⏱ Focus Timer'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>

            {/* ── CHAT ── */}
            {activeTab === 'chat' && <>
              <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.map(m => (
                  <div key={m.id} style={{ display: 'flex', gap: 8, flexDirection: m.isMe ? 'row-reverse' : 'row' }}>
                    {!m.isMe && (
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: m.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: 'white', flexShrink: 0 }}>{m.avatar}</div>
                    )}
                    <div style={{ maxWidth: '72%' }}>
                      {!m.isMe && <div style={{ fontSize: 10, color: '#6B7280', marginBottom: 3, fontWeight: 600 }}>{m.user} · {m.time}</div>}
                      <div style={{
                        padding: '8px 12px', fontSize: 12, lineHeight: 1.55, color: '#fff',
                        borderRadius: m.isMe ? '12px 12px 2px 12px' : '2px 12px 12px 12px',
                        background: m.isMe ? 'rgba(124,58,237,0.2)' : '#1A1C28',
                        border: m.isMe ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      }}>{m.text}</div>
                      {m.isMe && <div style={{ fontSize: 9, color: '#6B7280', marginTop: 3, textAlign: 'right' }}>{m.time}</div>}
                    </div>
                  </div>
                ))}
                {typingUser && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#9CA3AF', fontWeight: 600 }}>
                      {typingUser.split(' ').map(w=>w[0]).join('')}
                    </div>
                    <div style={{ padding: '8px 12px', background: '#1A1C28', borderRadius: '2px 12px 12px 12px', display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0,1,2].map(i => (
                        <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#9CA3AF' }}/>
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: '#6B7280' }}>{typingUser} is typing...</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, background: '#12131A' }}>
                <input ref={inputRef} id="chat-input" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()} placeholder="Message the room..."
                  style={{ flex: 1, padding: '8px 12px', fontSize: 12, background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', outline: 'none', color: '#fff', borderRadius: '6px' }}
                />
                <button id="btn-send-chat" onClick={sendMsg} disabled={!input.trim()} className="warmup-btn-purple" style={{ flexShrink: 0, padding: '6px 14px' }}>
                  Send
                </button>
              </div>
            </>}

            {/* ── NOTES ── */}
            {activeTab === 'notes' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 10, background: '#12131A' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>
                    Shared · last edited by <span style={{ color: '#A78BFA', fontWeight: 600 }}>Priya D.</span> · 3 min ago
                  </span>
                  <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 100, fontWeight: 600,
                    background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
                    ● Live
                  </span>
                </div>
                <textarea id="shared-notes" value={notes} onChange={e => setNotes(e.target.value)}
                  style={{ flex: 1, padding: '12px 14px', fontSize: 11, lineHeight: 1.8,
                    background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', outline: 'none',
                    fontFamily: "'JetBrains Mono', monospace", resize: 'none' }}
                  placeholder="Start collaborating..."
                />
              </div>
            )}

            {/* ── TIMER ── */}
            {activeTab === 'timer' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, background: '#12131A' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['work','break'] as const).map(m => (
                    <button key={m} id={`btn-timer-mode-${m}`}
                      onClick={() => { if(!timerRunning){ setTimerMode(m); setTimerLeft(m==='work'?25*60:5*60); }}}
                      style={{
                        padding: '4px 16px', borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        background: timerMode === m ? (m === 'work' ? 'rgba(124,58,237,0.2)' : 'rgba(16,185,129,0.2)') : '#1A1C28',
                        color: timerMode === m ? (m === 'work' ? '#A78BFA' : '#10B981') : '#9CA3AF',
                        border: timerMode === m ? (m === 'work' ? '1px solid #7C3AED' : '1px solid #10B981') : '1px solid rgba(255,255,255,0.06)',
                      }}>
                      {m === 'work' ? '🎯 Focus' : '☕ Break'}
                    </button>
                  ))}
                </div>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="70" cy="70" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
                    <circle cx="70" cy="70" r="50" fill="none"
                      stroke={timerMode === 'work' ? '#7C3AED' : '#10B981'}
                      strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={circumf} strokeDashoffset={dashOffset}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'JetBrains Mono',monospace" }}>
                      {fmt(timerLeft)}
                    </div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                      {timerMode === 'work' ? 'Focus Time' : 'Break Time'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button id="btn-timer-toggle" onClick={() => setTimerRun(r => !r)}
                    className="warmup-btn-purple" style={{ minWidth: 100, justifyContent: 'center' }}>
                    {timerRunning ? '⏸ Pause' : '▶ Start Focus'}
                  </button>
                  <button id="btn-timer-reset"
                    onClick={() => { setTimerRun(false); setTimerLeft(timerMode === 'work' ? 25 * 60 : 5 * 60); }}
                    className="warmup-btn-dark">
                    ↺ Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Resources ── */}
        <div className="dashboard-widget-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="widget-header" style={{ marginBottom: 10 }}>
            <span className="widget-title" style={{ fontSize: 13 }}>Resource Library</span>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>{saved.size} saved</span>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#1A1C28', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: '6px', marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: '#9CA3AF' }}>🔍</span>
            <input id="resource-search" value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search..." style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 11, flex: 1 }}/>
          </div>

          {/* Tag filters */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
            {RESOURCE_TAGS.map(tag => (
              <button key={tag} id={`btn-filter-${tag.toLowerCase().replace(' ','-')}`} onClick={() => setFilterTag(tag)} style={{
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 100, cursor: 'pointer', border: 'none', transition: 'all 0.12s',
                background: filterTag === tag ? '#7C3AED' : '#1A1C28',
                color: filterTag === tag ? '#fff' : '#9CA3AF',
              }}>{tag}</button>
            ))}
          </div>

          {/* Resource cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto' }}>
            {filteredRes.map(r => (
              <div key={r.id} style={{ padding: '8px 10px', background: '#1A1C28', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 100, ...TYPE_META[r.type] }}>{r.type}</span>
                  <button id={`btn-save-${r.id}`} onClick={() => toggleSave(r.id)}
                    style={{ color: saved.has(r.id) ? '#F59E0B' : '#6B7280', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>
                    {saved.has(r.id) ? '★' : '☆'}
                  </button>
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', lineHeight: 1.4, marginBottom: 2 }}>{r.title}</div>
                <div style={{ fontSize: 10, color: '#6B7280' }}>{r.author}{r.pages ? ` · ${r.pages}p` : ''}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

