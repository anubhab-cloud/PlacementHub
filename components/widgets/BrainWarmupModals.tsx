'use client';
import { useState, useCallback } from 'react';
import { Chess } from 'chess.js';

export function ChessModal({ onClose }: { onClose: () => void }) {
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

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 430 }}>
        <div className="modal-header">
          <span className="modal-title">♟ Chess vs AI</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(124,58,237,0.25)' }}>
          {ranks.map(rank => files.map(file => {
            const sq = `${file}${rank}`;
            const ci = files.indexOf(file), ri = ranks.indexOf(rank);
            const isLight = (ci + ri) % 2 === 0;
            const piece = boardState[ri][ci];
            const isSel = selected === sq, isValid = validMoves.includes(sq);
            const pk = piece ? `${piece.color}${piece.type.toUpperCase()}` : null;
            let bg = isLight ? '#1a1a2e' : '#0d0d1a';
            if (isSel) bg = '#3d1f7d';
            else if (isValid) bg = isLight ? '#1e3d5c' : '#162d44';

            return (
              <div key={sq} onClick={() => handleSquare(sq)} style={{ background: bg, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {pk && <span style={{ fontSize: '20px' }}>{pieces[pk]}</span>}
              </div>
            );
          }))}
        </div>
        <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '12px', color: 'var(--text-2)' }}>{thinking ? '🤔 AI thinking...' : status}</div>
      </div>
    </div>
  );
}

const PUZZLE = [
  [5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9],
];

export function SudokuModal({ onClose }: { onClose: () => void }) {
  const [board] = useState(PUZZLE);
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ width: 380 }}>
        <div className="modal-header">
          <span className="modal-title">🔢 Sudoku</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9,1fr)', gap: '1px', background: '#333' }}>
          {board.map((row, ri) => row.map((cell, ci) => (
            <div key={`${ri}-${ci}`} style={{ background: '#111', padding: '10px', textAlign: 'center', color: '#fff' }}>
              {cell || ''}
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}
