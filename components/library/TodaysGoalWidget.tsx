'use client';
import React, { useState, useEffect } from 'react';

interface Goal {
  id: string;
  text: string;
  done: boolean;
}

interface TodaysGoalWidgetProps {
  userId: string;
}

const DEFAULT_GOALS: Goal[] = [];

function getStorageKey(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  return `placementhub_goals_${userId}_${today}`;
}

export default function TodaysGoalWidget({ userId }: TodaysGoalWidgetProps) {
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [isEditing, setIsEditing] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      try { setGoals(JSON.parse(raw)); } catch {}
    }
    setLoaded(true);
  }, [userId]);

  // Save to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    if (typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey(userId), JSON.stringify(goals));
    }
  }, [goals, loaded, userId]);

  const toggleGoal = (id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));
  };

  const addGoal = () => {
    if (!newGoalText.trim()) return;
    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      text: newGoalText.trim(),
      done: false,
    };
    setGoals((prev) => [...prev, newGoal]);
    setNewGoalText('');
    setIsEditing(false);
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const completedCount = goals.filter((g) => g.done).length;
  const pct = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div style={{
      background: 'rgba(20, 21, 38, 0.8)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '14px', padding: '16px 18px',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', height: '100%',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>Today's goal</span>
        <button type="button"
          onClick={() => setIsEditing(!isEditing)}
          style={{ fontSize: '11px', color: '#635bff', cursor: 'pointer', fontWeight: '600', border: 0, background: 'transparent' }}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {goals.length === 0 && !isEditing && <p style={{ color: '#9a9cb8', fontSize: '11px', lineHeight: 1.5 }}>No goals yet. Add one small task for this study session.</p>}
        {goals.map((g) => (
          <div
            key={g.id}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: '12px', color: g.done ? '#ffffff' : '#9a9cb8',
              cursor: 'pointer', padding: '2px 0',
            }}
          >
            <button type="button" aria-pressed={g.done}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, border: 0, background: 'transparent', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: 0 }}
              onClick={() => toggleGoal(g.id)}>
              <span style={{
                width: '14px', height: '14px', borderRadius: '4px', flexShrink: 0,
                background: g.done ? '#5e43ff' : 'transparent',
                border: `1px solid ${g.done ? '#5e43ff' : 'rgba(255,255,255,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', color: '#fff',
              }}>
                {g.done && '✓'}
              </span>
              <span style={{ textDecoration: g.done ? 'line-through' : 'none', opacity: g.done ? 0.6 : 1 }}>
                {g.text}
              </span>
            </button>
            {isEditing && (
              <button
                onClick={() => removeGoal(g.id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', padding: '0 4px' }}
              >
                ×
              </button>
            )}
          </div>
        ))}

        {isEditing && (
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <input
              type="text"
              placeholder="Add goal..."
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGoal()}
              style={{
                flex: 1, padding: '4px 8px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff', fontSize: '11px', outline: 'none',
              }}
            />
            <button
              onClick={addGoal}
              style={{
                padding: '4px 8px', borderRadius: '6px',
                background: '#5e43ff', border: 'none',
                color: '#fff', fontSize: '11px', cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ marginTop: '14px' }}>
        <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: '#5e43ff', transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ textAlign: 'right', fontSize: '10px', color: '#8b8ea9', marginTop: '4px' }}>
          {completedCount}/{goals.length} · {pct}% complete
        </div>
      </div>
    </div>
  );
}
