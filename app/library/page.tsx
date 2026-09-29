'use client';
import { useState, useEffect, useRef } from 'react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Msg = { id: number; user: string; avatar: string; color: string; text: string; time: string; isMe: boolean; };
type Resource = { id: number; title: string; type: 'PDF'|'Video'|'Link'|'Note'|'Book'; tag: string; author: string; pages?: string; };

/* ─── Static Data ────────────────────────────────────────────────────────── */
const ROOMS = [
  { id: 'dsa',       name: 'DSA Grind',         subject: 'Arrays, DP & Graphs',  color: '#635bff', users: 8  },
  { id: 'sysdesign', name: 'System Design',      subject: 'Distributed Systems',  color: '#3ecf8e', users: 5  },
  { id: 'cp',        name: 'CP Contest Prep',    subject: 'Competitive Coding',   color: '#f0a500', users: 3  },
  { id: 'interview', name: 'Interview Prep',     subject: 'Behavioral + Tech',    color: '#38bdf8', users: 12 },
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
  PDF:   { bg: 'rgba(240,68,56,0.1)',  color: '#f04438' },
  Video: { bg: 'rgba(240,165,0,0.1)', color: '#f0a500' },
  Link:  { bg: 'rgba(56,189,248,0.1)',color: '#38bdf8' },
  Note:  { bg: 'rgba(62,207,142,0.1)',color: '#3ecf8e' },
  Book:  { bg: 'rgba(99,91,255,0.1)', color: '#8b85ff' },
};

const BOT_POOL = [
  { user: 'Riya S.',  avatar: 'RS', color: '#3ecf8e', texts: [
    'Just solved Longest Consecutive Sequence using hash set — O(n)! 🔥',
    "Does anyone know the trick for Kruskal's vs Prim's here?",
    'Tip: always draw the recursion tree before coding DP. Saves so much time.',
  ]},
  { user: 'Karan M.', avatar: 'KM', color: '#f0a500', texts: [
    "Striver's A2Z Day 14 done! Graphs are finally clicking 🎉",
    'For interval scheduling — always sort by end time, not start!',
    'Mock interview in 20 min. Feeling nervous but ready 🤞',
  ]},
  { user: 'Priya D.', avatar: 'PD', color: '#38bdf8', texts: [
    'Shared sliding window notes in Resources tab — check it out!',
    'Binary lifting for LCA just blew my mind 🤯',
    'Anyone tried the new Amazon OA problem set? It is rough.',
  ]},
  { user: 'Ankit R.', avatar: 'AR', color: '#8b85ff', texts: [
    'Codeforces Div 3 — 5/7 done! Graphs problem got me 😅',
    'Backtracking + pruning = secret weapon for N-Queens style problems',
    'Got the Google intern offer!! This room helped so much 🎉🎉',
  ]},
];

const SEED_MSGS: Msg[] = [
  { id:1, user:'Riya S.',  avatar:'RS', color:'#3ecf8e', text:'Hey everyone! Starting with Two Sum approach today 🎯',         time:'10:58', isMe:false },
  { id:2, user:'Karan M.', avatar:'KM', color:'#f0a500', text:"Let's go! HashMap approach gives O(n). Beats brute force easily", time:'10:59', isMe:false },
  { id:3, user:'You',      avatar:'AC', color:'#635bff', text:'Just finished 3 medium DP problems — feeling unstoppable 💪',    time:'11:00', isMe:true  },
  { id:4, user:'Priya D.', avatar:'PD', color:'#38bdf8', text:'Can someone share the sliding window notes? Still confused on it', time:'11:01', isMe:false },
];

const INIT_NOTES = `# Sliding Window — Shared Notes

## Core Idea
Maintain a window [l, r] and expand/contract based on the constraint.

## Template (Python)
\`\`\`python
l = 0
for r in range(n):
    # expand: add nums[r] to window
    while window_is_invalid():
        # shrink: remove nums[l]
        l += 1
    ans = max(ans, r - l + 1)
\`\`\`

## Key Problems
- Longest Substring Without Repeating Characters (LC 3)
- Minimum Window Substring (LC 76)
- Max Sum Subarray of Size K
- Permutation in String (LC 567)

## Edge Cases
- Empty string/array
- All unique vs all duplicate elements
- Window size equals array size

---
*Last edited by Priya D. · collaborative editing enabled*`;

const nowStr = () => new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

/* ─── Component ──────────────────────────────────────────────────────────── */
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

  /* Auto-scroll chat */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, typingUser]);

  /* Simulated live messages */
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

  /* Online count fluctuation */
  useEffect(() => {
    const id = setInterval(() => setOnlineCount(n => Math.max(5, Math.min(18, n + (Math.random() > 0.5 ? 1 : -1)))), 13000);
    return () => clearInterval(id);
  }, []);

  /* Pomodoro */
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
    setMessages(prev => [...prev, { id: Date.now(), user:'You', avatar:'AC', color:'#635bff', text: input.trim(), time: nowStr(), isMe: true }]);
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

  const C = { input: { background:'var(--bg-card-2)', border:'1px solid var(--border)', outline:'none', color:'var(--text-1)', borderRadius:'var(--r-md)' } };

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Digital Library
            <span style={{ marginLeft:10, fontSize:11, fontWeight:500, color:'#3ecf8e',
              background:'rgba(62,207,142,0.08)', border:'1px solid rgba(62,207,142,0.2)',
              padding:'2px 9px', borderRadius:100, verticalAlign:'middle' }}>
              ● {onlineCount} online
            </span>
          </h1>
          <p className="page-subtitle">{ROOMS.length} active rooms · Collaborative study platform · Live chat</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn btn-ghost" id="btn-browse-resources">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Browse
          </button>
          <button className="btn btn-violet" id="btn-create-room">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Room
          </button>
        </div>
      </div>

      {/* ── 3-Column Layout ──────────────────────────────────────── */}
      <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>

        {/* ── LEFT: Rooms ──────────────────────────────────────── */}
        <div style={{ width:210, flexShrink:0, display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ fontSize:10, fontWeight:600, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.8px', padding:'4px 2px', marginBottom:2 }}>
            Study Rooms
          </div>

          {ROOMS.map(r => (
            <button key={r.id} id={`btn-room-${r.id}`} onClick={() => setActiveRoom(r.id)}
              style={{
                display:'flex', alignItems:'center', gap:10, padding:'10px 12px',
                borderRadius:'var(--r-md)', width:'100%', textAlign:'left', cursor:'pointer',
                background: activeRoom === r.id ? 'var(--bg-card)' : 'transparent',
                border: activeRoom === r.id ? '1px solid var(--border-md)' : '1px solid transparent',
                transition:'all 0.15s', boxShadow: activeRoom === r.id ? 'var(--shadow-sm)' : 'none',
              }}
              onMouseEnter={e => { if (activeRoom!==r.id) e.currentTarget.style.background='var(--bg-hover)'; }}
              onMouseLeave={e => { if (activeRoom!==r.id) e.currentTarget.style.background='transparent'; }}
            >
              <div style={{ width:8, height:8, borderRadius:'50%', background:r.color, flexShrink:0, boxShadow:`0 0 6px ${r.color}80` }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:600, color:'var(--text-1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.name}</div>
                <div style={{ fontSize:10, color:'var(--text-3)', marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.subject}</div>
              </div>
              <span style={{ fontSize:9, fontWeight:700, flexShrink:0, padding:'1px 6px', borderRadius:100,
                color: activeRoom===r.id ? r.color : 'var(--text-3)',
                background: activeRoom===r.id ? `${r.color}18` : 'transparent',
              }}>
                {activeRoom===r.id ? onlineCount : r.users}
              </span>
            </button>
          ))}

          {/* My Stats mini-card */}
          <div style={{ marginTop:14, padding:'12px 14px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'var(--r-md)' }}>
            <div style={{ fontSize:10, fontWeight:600, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:10 }}>My Stats</div>
            {[
              { label:'Hours Today', value:'3.5h',          color:'var(--accent-2)' },
              { label:'Sessions',    value:`${sessions}`,   color:'var(--amber)'    },
              { label:'Saved',       value:`${saved.size}`, color:'var(--green)'    },
            ].map(s => (
              <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                <span style={{ fontSize:11, color:'var(--text-3)' }}>{s.label}</span>
                <span style={{ fontSize:13, fontWeight:800, color:s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTER: Study Room ───────────────────────────────── */}
        <div style={{ flex:1, minWidth:0 }}>
          <div className="card" style={{ overflow:'hidden' }}>

            {/* Room header */}
            <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background:room.color, boxShadow:`0 0 10px ${room.color}` }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--text-1)' }}>{room.name}</div>
                <div style={{ fontSize:10, color:'var(--text-3)' }}>{room.subject}</div>
              </div>
              {/* Online avatars */}
              <div style={{ display:'flex', alignItems:'center', gap:0 }}>
                {BOT_POOL.map((b,i) => (
                  <div key={b.avatar} style={{ width:24, height:24, borderRadius:'50%', background:b.color,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:8, fontWeight:700, color:'white',
                    marginLeft: i>0 ? -6 : 0, border:'2px solid var(--bg-card)', flexShrink:0,
                  }}>{b.avatar}</div>
                ))}
                <span style={{ fontSize:10, color:'var(--text-3)', marginLeft:8 }}>+{Math.max(0, onlineCount-4)} online</span>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:'flex', borderBottom:'1px solid var(--border)', padding:'0 16px' }}>
              {(['chat','notes','timer'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding:'9px 14px', fontSize:12, fontWeight:500, cursor:'pointer',
                  color: activeTab===tab ? 'var(--accent-2)' : 'var(--text-3)',
                  borderBottom: activeTab===tab ? '2px solid var(--accent)' : '2px solid transparent',
                  background:'none', transition:'color 0.15s', marginBottom:-1,
                }}>
                  {tab==='chat' ? '💬 Chat' : tab==='notes' ? '📝 Shared Notes' : '⏱ Focus Timer'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ height:430, display:'flex', flexDirection:'column' }}>

              {/* ── CHAT ── */}
              {activeTab==='chat' && <>
                <div ref={chatRef} style={{ flex:1, overflowY:'auto', padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
                  {messages.map(m => (
                    <div key={m.id} style={{ display:'flex', gap:8, flexDirection: m.isMe ? 'row-reverse' : 'row' }}>
                      {!m.isMe && (
                        <div style={{ width:28, height:28, borderRadius:'50%', background:m.color,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:9, fontWeight:700, color:'white', flexShrink:0 }}>{m.avatar}</div>
                      )}
                      <div style={{ maxWidth:'72%' }}>
                        {!m.isMe && <div style={{ fontSize:10, color:'var(--text-3)', marginBottom:3, fontWeight:600 }}>{m.user} · {m.time}</div>}
                        <div style={{
                          padding:'8px 12px', fontSize:12, lineHeight:1.55, color:'var(--text-1)',
                          borderRadius: m.isMe ? '12px 12px 2px 12px' : '2px 12px 12px 12px',
                          background: m.isMe ? 'rgba(99,91,255,0.12)' : 'var(--bg-card-2)',
                          border: m.isMe ? '1px solid rgba(99,91,255,0.25)' : '1px solid var(--border)',
                        }}>{m.text}</div>
                        {m.isMe && <div style={{ fontSize:9, color:'var(--text-3)', marginTop:3, textAlign:'right' }}>{m.time}</div>}
                      </div>
                    </div>
                  ))}
                  {/* Typing indicator */}
                  {typingUser && (
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--bg-card-2)', border:'1px solid var(--border)',
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'var(--text-3)', fontWeight:600 }}>
                        {typingUser.split(' ').map(w=>w[0]).join('')}
                      </div>
                      <div style={{ padding:'8px 12px', background:'var(--bg-card-2)', border:'1px solid var(--border)', borderRadius:'2px 12px 12px 12px', display:'flex', gap:4, alignItems:'center' }}>
                        {[0,1,2].map(i => (
                          <div key={i} style={{ width:5, height:5, borderRadius:'50%', background:'var(--text-3)', animation:`dotBounce 1.2s ease infinite ${i*0.2}s` }}/>
                        ))}
                      </div>
                      <span style={{ fontSize:10, color:'var(--text-3)' }}>{typingUser} is typing...</span>
                    </div>
                  )}
                </div>
                <div style={{ padding:'10px 16px', borderTop:'1px solid var(--border)', display:'flex', gap:8 }}>
                  <input ref={inputRef} id="chat-input" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && sendMsg()} placeholder="Message the room... (Enter to send)"
                    style={{ ...C.input, flex:1, padding:'8px 12px', fontSize:12 }}
                    onFocus={e => e.currentTarget.style.borderColor='rgba(99,91,255,0.4)'}
                    onBlur={e  => e.currentTarget.style.borderColor='var(--border)'}
                  />
                  <button id="btn-send-chat" onClick={sendMsg} disabled={!input.trim()} className="btn btn-violet btn-sm" style={{ flexShrink:0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send
                  </button>
                </div>
              </>}

              {/* ── NOTES ── */}
              {activeTab==='notes' && (
                <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'12px 16px', gap:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:10, color:'var(--text-3)' }}>
                      Shared · last edited by <span style={{ color:'var(--accent-2)', fontWeight:600 }}>Priya D.</span> · 3 min ago
                    </span>
                    <span style={{ fontSize:9, padding:'2px 8px', borderRadius:100, fontWeight:600,
                      background:'rgba(62,207,142,0.08)', color:'var(--green)', border:'1px solid rgba(62,207,142,0.2)' }}>
                      ● Live
                    </span>
                  </div>
                  <textarea id="shared-notes" value={notes} onChange={e => setNotes(e.target.value)}
                    style={{ ...C.input, flex:1, padding:'12px 14px', fontSize:11, lineHeight:1.8,
                      fontFamily:"'JetBrains Mono', monospace", resize:'none' }}
                    onFocus={e => e.currentTarget.style.borderColor='rgba(99,91,255,0.4)'}
                    onBlur={e  => e.currentTarget.style.borderColor='var(--border)'}
                    placeholder="Start collaborating..."
                  />
                </div>
              )}

              {/* ── TIMER ── */}
              {activeTab==='timer' && (
                <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18, padding:24 }}>
                  {/* Mode pills */}
                  <div style={{ display:'flex', gap:6 }}>
                    {(['work','break'] as const).map(m => (
                      <button key={m} id={`btn-timer-mode-${m}`}
                        onClick={() => { if(!timerRunning){ setTimerMode(m); setTimerLeft(m==='work'?25*60:5*60); }}}
                        style={{
                          padding:'4px 16px', borderRadius:100, fontSize:11, fontWeight:600, cursor:'pointer',
                          background: timerMode===m ? (m==='work'?'rgba(99,91,255,0.12)':'rgba(62,207,142,0.1)') : 'transparent',
                          color: timerMode===m ? (m==='work'?'var(--accent-2)':'var(--green)') : 'var(--text-3)',
                          border: timerMode===m ? (m==='work'?'1px solid rgba(99,91,255,0.3)':'1px solid rgba(62,207,142,0.3)') : '1px solid var(--border)',
                        }}>
                        {m==='work' ? '🎯 Focus' : '☕ Break'}
                      </button>
                    ))}
                  </div>

                  {/* SVG circle timer */}
                  <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="148" height="148" style={{ transform:'rotate(-90deg)' }}>
                      <circle cx="74" cy="74" r="54" fill="none" stroke="var(--border)" strokeWidth="9"/>
                      <circle cx="74" cy="74" r="54" fill="none"
                        stroke={timerMode==='work' ? 'var(--accent)' : 'var(--green)'}
                        strokeWidth="9" strokeLinecap="round"
                        strokeDasharray={circumf} strokeDashoffset={dashOffset}
                        style={{ transition:'stroke-dashoffset 1s linear',
                          filter:`drop-shadow(0 0 8px ${timerMode==='work'?'rgba(99,91,255,0.7)':'rgba(62,207,142,0.7)'})` }}
                      />
                    </svg>
                    <div style={{ position:'absolute', textAlign:'center' }}>
                      <div style={{ fontSize:30, fontWeight:900, color:'var(--text-1)', fontFamily:"'JetBrains Mono',monospace", lineHeight:1 }}>
                        {fmt(timerLeft)}
                      </div>
                      <div style={{ fontSize:10, color:'var(--text-3)', marginTop:4 }}>
                        {timerMode==='work' ? 'Focus Time' : 'Break Time'}
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div style={{ display:'flex', gap:8 }}>
                    <button id="btn-timer-toggle" onClick={() => setTimerRun(r=>!r)}
                      className={`btn ${timerRunning?'btn-ghost':'btn-violet'}`} style={{ minWidth:110, justifyContent:'center' }}>
                      {timerRunning ? '⏸ Pause' : '▶ Start Focus'}
                    </button>
                    <button id="btn-timer-reset"
                      onClick={() => { setTimerRun(false); setTimerLeft(timerMode==='work'?25*60:5*60); }}
                      className="btn btn-ghost">
                      ↺ Reset
                    </button>
                  </div>

                  {/* Session dots */}
                  <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                    {Array.from({ length: Math.min(sessions,8) }).map((_,i) => (
                      <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'var(--amber)', boxShadow:'0 0 5px rgba(240,165,0,0.6)' }}/>
                    ))}
                    <span style={{ fontSize:10, color:'var(--text-3)', marginLeft:4 }}>{sessions} sessions today</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Resources ──────────────────────────────────── */}
        <div style={{ width:260, flexShrink:0 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
                Resource Library
              </span>
              <span style={{ fontSize:10, color:'var(--text-3)' }}>{saved.size} saved</span>
            </div>
            <div className="card-body">
              {/* Search */}
              <div style={{ display:'flex', alignItems:'center', gap:7, ...C.input, padding:'7px 10px', marginBottom:10 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input id="resource-search" value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search resources..." style={{ background:'none', border:'none', outline:'none', color:'var(--text-1)', fontSize:11, flex:1 }}/>
              </div>

              {/* Tag filters */}
              <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
                {RESOURCE_TAGS.map(tag => (
                  <button key={tag} id={`btn-filter-${tag.toLowerCase().replace(' ','-')}`} onClick={() => setFilterTag(tag)} style={{
                    fontSize:9, fontWeight:600, padding:'2px 8px', borderRadius:100, cursor:'pointer', transition:'all 0.12s',
                    background: filterTag===tag ? 'var(--accent-soft)' : 'transparent',
                    color: filterTag===tag ? 'var(--accent-2)' : 'var(--text-3)',
                    border: filterTag===tag ? '1px solid var(--border-accent)' : '1px solid var(--border)',
                  }}>{tag}</button>
                ))}
              </div>

              {/* Resource cards */}
              <div style={{ display:'flex', flexDirection:'column', gap:8, maxHeight:380, overflowY:'auto' }}>
                {filteredRes.map(r => (
                  <div key={r.id} style={{ padding:'10px 12px', background:'var(--bg-card-2)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', transition:'border-color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='var(--border-md)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                      <span style={{ fontSize:9, fontWeight:700, padding:'1px 7px', borderRadius:100, ...TYPE_META[r.type] }}>{r.type}</span>
                      <button id={`btn-save-${r.id}`} onClick={() => toggleSave(r.id)} title={saved.has(r.id)?'Unsave':'Save'}
                        style={{ color: saved.has(r.id) ? 'var(--amber)' : 'var(--text-3)', fontSize:14, background:'none', border:'none', cursor:'pointer', lineHeight:1, transition:'color 0.15s' }}>
                        {saved.has(r.id) ? '★' : '☆'}
                      </button>
                    </div>
                    <div style={{ fontSize:11, fontWeight:600, color:'var(--text-1)', lineHeight:1.4, marginBottom:3 }}>{r.title}</div>
                    <div style={{ fontSize:10, color:'var(--text-3)' }}>{r.author}{r.pages ? ` · ${r.pages}p` : ''}</div>
                  </div>
                ))}
                {filteredRes.length===0 && (
                  <div style={{ textAlign:'center', padding:'24px 0', color:'var(--text-3)', fontSize:12 }}>No resources found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dotBounce {
          0%,60%,100% { transform:translateY(0); }
          30%          { transform:translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
