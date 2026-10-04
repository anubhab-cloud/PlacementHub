'use client';
import React, { useState } from 'react';

interface StudyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetGoal: (topic: string, goalText: string, targetMinutes: number) => void;
}

export default function StudyGoalModal({
  isOpen,
  onClose,
  onSetGoal,
}: StudyGoalModalProps) {
  const [topic, setTopic] = useState('Data Structures & Algorithms');
  const [goalText, setGoalText] = useState('');
  const [targetMinutes, setTargetMinutes] = useState(45);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetGoal(topic, goalText.trim() || 'Productive Study Sprint', targetMinutes);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-box" style={{ width: '460px', background: 'rgba(18, 19, 26, 0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-1)' }}>
            🎯 Set Today's Study Goal
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-3)', fontSize: '20px', cursor: 'pointer' }}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>
              Study Subject / Topic
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-1)',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="Data Structures & Algorithms">Data Structures & Algorithms (DSA)</option>
              <option value="DBMS & SQL">DBMS & SQL Querying</option>
              <option value="Operating Systems">Operating Systems & System Concepts</option>
              <option value="System Design">System Design & Architecture</option>
              <option value="Quantitative Aptitude">Quantitative Aptitude & Reasoning</option>
              <option value="Coding Workspace">Coding Practice (LeetCode / HackerRank)</option>
              <option value="Company Interview Prep">Company Interview Preparation</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-2)', display: 'block', marginBottom: '6px' }}>
              Specific Session Objective
            </label>
            <input
              type="text"
              placeholder="e.g. Solve 3 Dynamic Programming problems"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--text-1)',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-2)', marginBottom: '6px' }}>
              <span>Target Focus Duration</span>
              <strong>{targetMinutes} Minutes</strong>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={targetMinutes}
              onChange={(e) => setTargetMinutes(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>
              Skip Goal
            </button>
            <button type="submit" className="btn btn-violet" style={{ padding: '8px 20px', fontSize: '13px' }}>
              Start Focused Session →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
