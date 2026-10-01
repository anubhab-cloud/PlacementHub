'use client';
import { useState } from 'react';
import { ChessModal, SudokuModal } from './BrainWarmupModals';

const games = [
  { id: 'chess',   title: 'Chess',   sub: 'vs AI, game active', btnText: 'Play', primary: true },
  { id: 'sudoku',  title: 'Sudoku',  sub: 'Easy level',         btnText: 'Start', primary: false },
  { id: 'puzzles', title: 'Puzzles', sub: '5 remaining',        btnText: 'View all', primary: false },
];

export default function BrainWarmupWidget() {
  const [modal, setModal] = useState<'chess'|'sudoku'|null>(null);

  return (
    <>
      <div className="dashboard-widget-card">
        <div className="widget-header">
          <div className="widget-icon-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <span className="widget-title">Brain warm-up</span>
        </div>

        <div className="widget-content warmup-body">
          {games.map((g) => (
            <div key={g.id} className="warmup-row-item">
              <div className="warmup-info">
                <div className="warmup-row-title">{g.title}</div>
                <div className="warmup-row-sub">{g.sub}</div>
              </div>
              <button
                className={g.primary ? 'warmup-btn-purple' : 'warmup-btn-dark'}
                onClick={() => (g.id === 'chess' || g.id === 'sudoku') && setModal(g.id as any)}
              >
                {g.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {modal === 'chess' && <ChessModal onClose={() => setModal(null)} />}
      {modal === 'sudoku' && <SudokuModal onClose={() => setModal(null)} />}
    </>
  );
}
