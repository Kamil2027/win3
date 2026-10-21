import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { retroAudio } from '../../services/audio';

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestion: boolean;
  neighborMines: number;
};

export const Minesweeper: React.FC = () => {
  const [rows] = useState(9);
  const [cols] = useState(9);
  const [minesCount] = useState(10);
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [faceState, setFaceState] = useState<'normal' | 'worried' | 'dead' | 'cool'>('normal');
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [, startTransition] = useTransition();

  // Initialize board
  const initGame = useCallback(() => {
    const newGrid: CellState[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: CellState[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          isQuestion: false,
          neighborMines: 0,
        });
      }
      newGrid.push(row);
    }

    // Place mines randomly
    let placed = 0;
    while (placed < minesCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newGrid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
              count++;
            }
          }
        }
        newGrid[r][c].neighborMines = count;
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setGameWon(false);
    setFaceState('normal');
    setTime(0);
    setTimerActive(false);
  }, [rows, cols, minesCount]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer tick
  useEffect(() => {
    if (!timerActive || gameOver || gameWon) return;
    const interval = setInterval(() => {
      setTime((t) => Math.min(999, t + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, gameOver, gameWon]);

  // Recursive flood reveal
  const revealCell = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    if (!timerActive) setTimerActive(true);

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    if (newGrid[r][c].isMine) {
      // Hit a mine!
      retroAudio.playExplosion();
      setGameOver(true);
      setFaceState('dead');
      setTimerActive(false);
      // Reveal all mines
      for (let ro = 0; ro < rows; ro++) {
        for (let co = 0; co < cols; co++) {
          if (newGrid[ro][co].isMine) {
            newGrid[ro][co].isRevealed = true;
          }
        }
      }
      setGrid(newGrid);
      return;
    }

    retroAudio.playMineClick();

    const flood = (ro: number, co: number) => {
      if (ro < 0 || ro >= rows || co < 0 || co >= cols) return;
      const cell = newGrid[ro][co];
      if (cell.isRevealed || cell.isFlagged || cell.isMine) return;
      cell.isRevealed = true;

      if (cell.neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) flood(ro + dr, co + dc);
          }
        }
      }
    };

    flood(r, c);

    // Check victory
    let unrevealedSafeCells = 0;
    for (let ro = 0; ro < rows; ro++) {
      for (let co = 0; co < cols; co++) {
        if (!newGrid[ro][co].isMine && !newGrid[ro][co].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }

    if (unrevealedSafeCells === 0) {
      setGameWon(true);
      setFaceState('cool');
      setTimerActive(false);
      retroAudio.playDing();
    }

    startTransition(() => {
      setGrid(newGrid);
    });
  };

  // Toggle flag / question mark on right click
  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || gameWon || grid[r][c].isRevealed) return;

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newGrid[r][c];

    if (!cell.isFlagged && !cell.isQuestion) {
      cell.isFlagged = true;
      retroAudio.playMineClick();
    } else if (cell.isFlagged) {
      cell.isFlagged = false;
      cell.isQuestion = true;
    } else {
      cell.isQuestion = false;
    }

    setGrid(newGrid);
  };

  // Count flags
  const flagsUsed = grid.reduce(
    (acc, row) => acc + row.reduce((rAcc, cell) => rAcc + (cell.isFlagged ? 1 : 0), 0),
    0
  );
  const remainingMines = Math.max(0, minesCount - flagsUsed);

  // Number color mapping in authentic Windows 3.1
  const numberColors: Record<number, string> = {
    1: 'text-blue-700 font-bold',
    2: 'text-emerald-700 font-bold',
    3: 'text-red-700 font-bold',
    4: 'text-indigo-900 font-bold',
    5: 'text-amber-800 font-bold',
    6: 'text-cyan-800 font-bold',
    7: 'text-black font-bold',
    8: 'text-gray-600 font-bold',
  };

  return (
    <div className="p-3 bg-[#c0c0c0] flex flex-col items-center justify-center select-none font-sans h-full">
      {/* Top Header Box (Scoreboard with LED counters and Smiley button) */}
      <div className="w-[220px] p-1.5 win3-box-sunken bg-[#c0c0c0] flex items-center justify-between mb-3">
        {/* Remaining Mines LED */}
        <div className="bg-black text-red-600 font-mono text-2xl font-bold px-1.5 py-0.5 tracking-widest border border-gray-600">
          {String(remainingMines).padStart(3, '0')}
        </div>

        {/* Smiley Reset Button */}
        <button
          type="button"
          onClick={() => {
            retroAudio.playSwitchClick('button');
            initGame();
          }}
          className="w-7 h-7 win3-button flex items-center justify-center text-base font-bold bg-[#ffff00] border-2"
          title="Reset Game"
        >
          {faceState === 'normal' && '🙂'}
          {faceState === 'worried' && '😮'}
          {faceState === 'dead' && '😵'}
          {faceState === 'cool' && '😎'}
        </button>

        {/* Elapsed Time LED */}
        <div className="bg-black text-red-600 font-mono text-2xl font-bold px-1.5 py-0.5 tracking-widest border border-gray-600">
          {String(time).padStart(3, '0')}
        </div>
      </div>

      {/* Grid container */}
      <div className="win3-box-sunken p-1 bg-[#808080]">
        <div
          className="grid gap-[1px] bg-[#808080]"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          onMouseLeave={() => !gameOver && !gameWon && setFaceState('normal')}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                onMouseDown={(e) => {
                  if (e.button === 0 && !cell.isRevealed && !gameOver && !gameWon) {
                    setFaceState('worried');
                  }
                }}
                onMouseUp={() => {
                  if (!gameOver && !gameWon) setFaceState('normal');
                }}
                onClick={() => revealCell(r, c)}
                onContextMenu={(e) => handleRightClick(e, r, c)}
                className={`w-6 h-6 flex items-center justify-center text-xs cursor-pointer select-none ${
                  cell.isRevealed
                    ? 'bg-[#c0c0c0] border border-[#7b7b7b]'
                    : 'win3-button bg-[#c0c0c0]'
                }`}
              >
                {cell.isRevealed ? (
                  cell.isMine ? (
                    <span className="text-black font-black">💣</span>
                  ) : cell.neighborMines > 0 ? (
                    <span className={numberColors[cell.neighborMines]}>
                      {cell.neighborMines}
                    </span>
                  ) : null
                ) : cell.isFlagged ? (
                  <span className="text-red-600 font-bold text-sm">🚩</span>
                ) : cell.isQuestion ? (
                  <span className="text-blue-800 font-bold">?</span>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
