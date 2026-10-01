'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Insights = {
  weakness:    string;
  strengths:   string[];
  recommended: string;
  dailyGoal:   number;
  tip:         string;
  demo?:       boolean;
};

export default function AIInsightsWidget() {
  const [data, setData] = useState<Insights | null>(null);

  useEffect(() => {
    fetch('/api/ai/insights', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      .then(res => res.json())
      .then(d => setData(d))
      .catch(() => {
        setData({
          weakness:    'Graph algorithms (DFS/BFS)',
          strengths:   ['Dynamic programming', 'arrays'],
          recommended: 'Today: Solve 3 medium DFS problems. Practice recursive DFS with memoization.',
          dailyGoal:   70,
          tip:         'Focus on recursive DFS with memoization.',
          demo:        true,
        });
      });
  }, []);

  const weakness = data?.weakness || 'Graph algorithms (DFS/BFS)';
  const strengths = data?.strengths ? data.strengths.join(', ') : 'Dynamic programming, arrays';
  const taskText = data?.recommended ? (data.recommended.startsWith('Today:') ? data.recommended : `Today: ${data.recommended}`) : 'Today: Solve 3 medium DFS problems. Practice recursive DFS with memoization.';
  const goalPct = data?.dailyGoal ?? 70;

  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="widget-icon-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <span className="widget-title">AI insights</span>
        <span className="demo-pill-badge">Demo</span>
      </div>

      <div className="ai-insights-body">
        <div className="ai-stat-row">
          <span className="ai-label">Weak:</span>
          <span className="ai-val-text">{weakness}</span>
        </div>

        <div className="ai-stat-row">
          <span className="ai-label">Strong:</span>
          <span className="ai-val-text">{strengths}</span>
        </div>

        {/* Dotted Box Task */}
        <div className="ai-dotted-task-box">
          {taskText}
        </div>

        {/* Daily Goal Bar */}
        <div className="ai-daily-goal-section">
          <div className="goal-label-row">
            <span>Daily goal</span>
            <span className="goal-pct">{goalPct}%</span>
          </div>
          <div className="goal-track">
            <div className="goal-fill-bar" style={{ width: `${goalPct}%` }} />
          </div>
        </div>

        {/* Bottom Practice Now Button */}
        <Link href="/workspace" className="ai-practice-now-btn">
          Practice now
        </Link>
      </div>
    </div>
  );
}
