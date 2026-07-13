'use client';
import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

/* ── Chess Modal ───────────────────────────────────────────────────────── */
function ChessModal({ onClose }: { onClose: () => void }) {
  const [game, setGame] = useState(new Chess());
  const [boardState, setBoardState] = useState(game.board());
  const [selected, setSelected] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<string[]>([]);
  const [status, setStatus] = useState("Your turn — White");
  const [thinking, setThinking] = useState(false);

  const files = ['a','b','c','d','e','f','g','h'];
  const ranks = [8,7,6,5,4,3,2,1];
  const pieces: Record<string, string> = {
    wK:'♔', wQ:'♕', wR:'♖', wB:'♗', wN:'♘', wP:'♙',
    bK:'♚', bQ:'♛', bR:'♜', bB:'♝', bN:'♞', bP:'♟',
  };

  const updateStatus = (g: Chess) => {
    if (g.isCheckmate()) setStatus(`Checkmate! ${g.turn() === 'w' ? 'Black' : 'White'} wins 🏆`);
    else if (g.isDraw()) setStatus('Draw!');
    else if (g.isCheck()) setStatus(`${g.turn() === 'w' ? 'White' : 'Black'} is in check ⚠`);
    else setStatus(`${g.turn() === 'w' ? 'Your turn — White' : 'AI thinking...'}`);
  };

  const aiMove = useCallback((g: Chess) => {
    setThinking(true);
    setTimeout(() => {
      const moves = g.moves({ verbose: true });
      if (!moves.length) { setThinking(false); return; }
      const captures = moves.filter(m => m.captured);
      const m = captures.length ? captures[Math.floor(Math.random() * captures.length)] : moves[Math.floor(Math.random() * moves.length)];
      g.move(m);
      setGame(g); setBoardState(g.board()); updateStatus(g); setThinking(false);
    }, 600);
  }, []);

  const handleSquare = (sq: string) => {
    if (thinking || game.isGameOver() || game.turn() !== 'w') return;
    if (selected) {
      const copy = new Chess(game.fen());
      const move = copy.move({ from: selected, to: sq, promotion: 'q' });
      if (move) {
        setGame(copy); setBoardState(copy.board());
        setSelected(null); setValidMoves([]); updateStatus(copy);
        if (!copy.isGameOver()) aiMove(copy);
        return;
      }
    }
    const piece = game.get(sq as any);
    if (piece?.color === 'w') {
      setSelected(sq);
      setValidMoves(game.moves({ square: sq as any, verbose: true }).map(m => m.to));
    } else { setSelected(null); setValidMoves([]); }
  };

  const reset = () => {
    const g = new Chess();
    setGame(g); setBoardState(g.board());
    setSelected(null); setValidMoves([]); setStatus("Your turn — White");
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 430 }}>
        <div className="modal-header">
          <span className="modal-title">♟ Chess vs AI</span>
          <button className="modal-close" onClick={onClose} id="btn-chess-close">✕</button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(8,1fr)',
          borderRadius: '16px', overflow: 'hidden',
          border: '1px solid rgba(124,58,237,0.25)',
          boxShadow: '0 0 40px rgba(124,58,237,0.2)',
        }}>
          {ranks.map(rank => files.map(file => {
            const sq = `${file}${rank}`;
            const ci = files.indexOf(file), ri = ranks.indexOf(rank);
            const isLight = (ci + ri) % 2 === 0;
            const piece = boardState[ri][ci];
            const isSel = selected === sq, isValid = validMoves.includes(sq);
            const pk = piece ? `${piece.color}${piece.type.toUpperCase()}` : null;

            let bg = isLight ? '#1a1a2e' : '#0d0d1a';
            if (isSel)   bg = '#3d1f7d';
            else if (isValid) bg = isLight ? '#1e3d5c' : '#162d44';

            return (
              <div key={sq} onClick={() => handleSquare(sq)} style={{
                background: bg, aspectRatio: '1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.1s', position: 'relative',
              }}>
                {isValid && !piece && (
                  <div style={{ width: '32%', height: '32%', borderRadius: '50%', background: 'rgba(0,212,255,0.4)' }} />
                )}
                {isValid && piece && (
                  <div style={{ position: 'absolute', inset: 0, border: '2px solid rgba(0,212,255,0.5)', borderRadius: '2px', boxSizing: 'border-box' }} />
                )}
                {pk && (
                  <span style={{ fontSize: '20px', userSelect: 'none', filter: piece!.color === 'w' ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))' : 'none' }}>
                    {pieces[pk]}
                  </span>
                )}
              </div>
            );
          }))}
        </div>

        <div className="chess-status">{thinking ? '🤔 AI is calculating...' : status}</div>
        <div className="chess-controls">
          <button className="btn-chess" onClick={reset} id="btn-chess-reset">↺ New Game</button>
          <button className="btn-chess btn-chess-primary" onClick={onClose}>Done ✓</button>
        </div>
      </div>
    </div>
  );
}

/* ── Sudoku Modal ──────────────────────────────────────────────────────── */
const PUZZLE = [
  [5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9],
];

function SudokuModal({ onClose }: { onClose: () => void }) {
  const [board, setBoard] = useState(PUZZLE.map(r => [...r]));
  const [sel, setSel] = useState<[number,number]|null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const isGiven = (r: number, c: number) => PUZZLE[r][c] !== 0;

  const setCell = (r: number, c: number, val: number) => {
    if (isGiven(r, c)) return;
    const b = board.map(row => [...row]);
    b[r][c] = val;
    setBoard(b);
    const errs = new Set<string>();
    b.forEach((row, ri) => row.forEach((cell, ci) => {
      if (!cell) return;
      if (row.filter(v => v === cell).length > 1) errs.add(`${ri}-${ci}`);
      if (b.map(rr => rr[ci]).filter(v => v === cell).length > 1) errs.add(`${ri}-${ci}`);
    }));
    setErrors(errs);
  };

  const handleKey = (e: React.KeyboardEvent, r: number, c: number) => {
    if (e.key >= '1' && e.key <= '9') setCell(r, c, +e.key);
    else if (e.key === 'Backspace' || e.key === 'Delete') setCell(r, c, 0);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 380 }}>
        <div className="modal-header">
          <span className="modal-title">🔢 Sudoku</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(9,1fr)',
          borderRadius: '14px', overflow: 'hidden',
          border: '2px solid rgba(0,212,255,0.2)',
          boxShadow: '0 0 30px rgba(0,212,255,0.1)',
        }}>
          {board.map((row, ri) => row.map((cell, ci) => {
            const key = `${ri}-${ci}`;
            const isSel = sel?.[0] === ri && sel?.[1] === ci;
            const isErr = errors.has(key);
            const given = isGiven(ri, ci);

            let bg = 'var(--black-2)';
            if (isSel)  bg = 'rgba(0,212,255,0.15)';
            else if (isErr) bg = 'rgba(255,77,109,0.15)';
            else if (given) bg = 'rgba(124,58,237,0.06)';

            const bR = (ci + 1) % 3 === 0 && ci !== 8 ? '2px solid rgba(0,212,255,0.2)' : '1px solid rgba(255,255,255,0.04)';
            const bB = (ri + 1) % 3 === 0 && ri !== 8 ? '2px solid rgba(0,212,255,0.2)' : '1px solid rgba(255,255,255,0.04)';

            return (
              <div key={key} tabIndex={0} onClick={() => setSel([ri, ci])} onKeyDown={e => handleKey(e, ri, ci)}
                style={{
                  background: bg, aspectRatio: '1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: given ? 700 : 500,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: given ? 'var(--cyan)' : isErr ? 'var(--red)' : 'var(--text-1)',
                  cursor: given ? 'default' : 'pointer',
                  borderRight: bR, borderBottom: bB, outline: 'none',
                  transition: 'background 0.1s',
                }}
              >{cell !== 0 ? cell : ''}</div>
            );
          }))}
        </div>

        <div className="chess-status">Click a cell → press 1-9 · Backspace to clear</div>
        <div className="chess-controls">
          <button className="btn-chess" onClick={() => { setBoard(PUZZLE.map(r => [...r])); setErrors(new Set()); }}>↺ Reset</button>
          <button className="btn-chess btn-chess-primary" onClick={onClose}>Done ✓</button>
        </div>
      </div>
    </div>
  );
}

/* ── Brain Warmup Widget ───────────────────────────────────────────────── */
const games = [
  { id: 'chess',   icon: '♟', bg: 'rgba(124,58,237,0.15)',  label: 'Chess',   sub: 'vs AI · Active', btnTxt: 'Play',     primary: true },
  { id: 'sudoku',  icon: '🔢', bg: 'rgba(0,212,255,0.1)',   label: 'Sudoku',  sub: 'Easy Level',     btnTxt: 'Start',    primary: false },
  { id: 'puzzles', icon: '🧩', bg: 'rgba(0,229,160,0.1)',   label: 'Puzzles', sub: '5 remaining',    btnTxt: 'View All', primary: false, viewAll: true },
];

export default function BrainWarmupWidget() {
  const [modal, setModal] = useState<'chess'|'sudoku'|null>(null);

  return (
    <>
      <div className="card warmup-widget">
        <div className="card-header">
          <span className="card-label"><span className="lbl-icon">🧠</span> Brain Warmup</span>
          <button className="card-menu">···</button>
        </div>
        <div className="card-body">
          {games.map(g => (
            <div className="game-row" key={g.id}>
              <div className="game-icon-wrap" style={{ background: g.bg }}>{g.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="game-name">{g.label}</div>
                <div className="game-sub">{g.sub}</div>
              </div>
              {g.viewAll ? (
                <button id={`btn-${g.id}`} className="btn btn-ghost btn-sm">{g.btnTxt}</button>
              ) : g.primary ? (
                <button id={`btn-${g.id}`} className="btn btn-violet btn-sm" onClick={() => setModal(g.id as 'chess'|'sudoku')}>{g.btnTxt}</button>
              ) : (
                <button id={`btn-${g.id}`} className="btn btn-outline-cyan btn-sm" onClick={() => setModal(g.id as 'chess'|'sudoku')}>{g.btnTxt}</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {modal === 'chess'  && <ChessModal  onClose={() => setModal(null)} />}
      {modal === 'sudoku' && <SudokuModal onClose={() => setModal(null)} />}
    </>
  );
}
