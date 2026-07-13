'use client';
import { useState, useEffect } from 'react';

type Insights = {
  weakness:    string;
  strengths:   string[];
  recommended: string;
  dailyGoal:   number;
  tip:         string;
  demo?:       boolean;
  error?:      string;
};

export default function AIInsightsWidget() {
  const [data, setData]       = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [goalAnim, setGoalAnim] = useState(0);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      // 1. Get user stats
      const statsRes = await fetch('/api/stats');
      const stats = await statsRes.json();

      // 2. Call Gemini
      const res  = await fetch('/api/ai/insights', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ stats }),
      });
      const json: Insights = await res.json();
      setData(json);
      setTimeout(() => setGoalAnim(json.dailyGoal), 200);
    } catch {
      setData({
        weakness:    'Graph DFS/BFS',
        strengths:   ['Arrays', 'DP'],
        recommended: '3 Medium DFS Problems',
        dailyGoal:   70,
        tip:         'Practice recursive DFS with visited sets.',
        demo:        true,
      });
      setTimeout(() => setGoalAnim(70), 200);
    }
    setLoading(false);
  };

  useEffect(() => { fetchInsights(); }, []);

  const activity = [
    { tag: 'DP',    pct: 82, ok: true },
    { tag: 'Trees', pct: 91, ok: true },
    { tag: 'Graphs',pct: data ? Math.max(30, 100 - data.dailyGoal) : 48, ok: false },
    { tag: 'Sort',  pct: 95, ok: true },
  ];

  return (
    <div className="card ai-widget">
      <div className="card-header">
        <span className="card-label"><span className="lbl-icon">🤖</span> AI Insights</span>
        <button className="card-menu" id="btn-ai-refresh" onClick={fetchInsights} title="Refresh from Gemini">
          {loading ? <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>↻</span> : '↻'}
        </button>
      </div>
      <div className="card-body">

        {/* Live badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '12px' }}>
          <div className="ai-pulse" />
          <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 600 }}>
            {data?.demo ? 'Demo Mode · Add GEMINI_API_KEY' : 'Gemini 1.5 Flash · Live'}
          </span>
          {data?.demo && (
            <span style={{ fontSize: '9px', color: 'var(--amber)', marginLeft: 'auto', padding: '1px 6px', background: 'rgba(255,179,71,0.1)', borderRadius: '100px', border: '1px solid rgba(255,179,71,0.25)' }}>demo</span>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[90, 70, 100].map((w, i) => (
              <div key={i} style={{ height: '12px', borderRadius: '6px', background: 'var(--black-3)', width: `${w}%`, animation: 'pulse-load 1.5s ease infinite' }} />
            ))}
          </div>
        ) : data ? (
          <>
            <div className="ai-row">
              <span className="ai-key">⚠ Weak:</span>
              <span className="ai-val warn">{data.weakness}</span>
            </div>
            <div className="ai-row">
              <span className="ai-key">✓ Strong:</span>
              <span className="ai-val ok">{data.strengths.slice(0,2).join(', ')}</span>
            </div>
            <div className="ai-row" style={{ flexDirection: 'column', gap: '2px' }}>
              <span className="ai-key">📌 Today:</span>
              <span className="ai-val" style={{ fontSize: '11px', paddingLeft: '2px' }}>{data.recommended}</span>
            </div>
            {data.tip && (
              <div style={{
                marginTop: '8px', padding: '8px 10px', borderRadius: 'var(--r-sm)',
                background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
                fontSize: '10px', color: 'var(--text-2)', lineHeight: 1.5,
              }}>
                💡 {data.tip}
              </div>
            )}
          </>
        ) : null}

        {/* Mini accuracy bars */}
        <div style={{ display: 'flex', gap: '5px', marginTop: '12px', alignItems: 'flex-end', height: '36px' }}>
          {activity.map(a => (
            <div key={a.tag} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', height: '100%' }}>
              <div style={{ flex: 1, width: '100%', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{
                  height: `${a.pct}%`, width: '100%',
                  background: a.ok ? 'linear-gradient(to top,#00e5a0,#00d4ff)' : 'linear-gradient(to top,#ff4d6d,#ffb347)',
                  borderRadius: '4px 4px 0 0',
                  boxShadow: a.ok ? '0 0 8px rgba(0,229,160,0.4)' : '0 0 8px rgba(255,77,109,0.4)',
                }} />
              </div>
              <div style={{ fontSize: '8px', color: 'var(--text-3)' }}>{a.tag}</div>
            </div>
          ))}
        </div>

        {/* Daily goal bar */}
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-3)', marginBottom: '5px' }}>
            <span>Daily Goal</span>
            <span style={{ color: 'var(--violet-bright)', fontWeight: 700 }}>{goalAnim}%</span>
          </div>
          <div className="goal-bar">
            <div className="goal-fill" style={{ width: `${goalAnim}%` }} />
          </div>
        </div>

        <a href="/workspace" className="btn btn-outline-violet btn-sm" id="btn-practice-now"
          style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '12px', textDecoration: 'none' }}>
          🎯 Practice Now →
        </a>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-load { 0%,100% { opacity:0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </div>
  );
}
