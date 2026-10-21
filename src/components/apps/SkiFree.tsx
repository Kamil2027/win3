import React, { useState, useEffect, useRef } from 'react';
import { retroAudio } from '../../services/audio';

type Obstacle = {
  x: number;
  y: number;
  type: 'tree' | 'rock' | 'ramp' | 'yeti';
};

export const SkiFree: React.FC = () => {
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [skierX, setSkierX] = useState(150);
  const [isCrashed, setIsCrashed] = useState(false);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([
    { x: 80, y: 150, type: 'tree' },
    { x: 220, y: 220, type: 'rock' },
    { x: 140, y: 320, type: 'tree' },
    { x: 190, y: 450, type: 'ramp' },
  ]);

  const requestRef = useRef<number | null>(null);

  // Steer
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isCrashed) return;
    if (e.key === 'ArrowLeft') setSkierX((x) => Math.max(20, x - 18));
    if (e.key === 'ArrowRight') setSkierX((x) => Math.min(280, x + 18));
    if (e.key === 'ArrowUp') setSpeed(1);
    if (e.key === 'ArrowDown' || e.key === 'f') setSpeed(4);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCrashed]);

  // Main game loop
  useEffect(() => {
    if (isCrashed) return;

    const interval = setInterval(() => {
      setDistance((d) => d + speed * 2);
      setScore((s) => s + speed);

      // Move obstacles upwards relative to skier
      setObstacles((prev) => {
        const next = prev
          .map((obs) => ({ ...obs, y: obs.y - speed * 4 }))
          .filter((obs) => obs.y > -40);

        // Spawn new obstacles below screen
        if (Math.random() < 0.3) {
          const types: ('tree' | 'rock' | 'ramp')[] = ['tree', 'rock', 'ramp'];
          const type = types[Math.floor(Math.random() * types.length)];
          next.push({
            x: 20 + Math.random() * 260,
            y: 350 + Math.random() * 80,
            type,
          });
        }

        // Check Yeti spawn after 1000m
        if (distance > 1000 && !next.some((o) => o.type === 'yeti')) {
          next.push({
            x: skierX,
            y: 400,
            type: 'yeti',
          });
        }

        // Collision detection
        for (const obs of next) {
          if (Math.abs(obs.x - skierX) < 18 && Math.abs(obs.y - 70) < 16) {
            if (obs.type === 'ramp') {
              // Jump!
              retroAudio.playMineClick();
              setScore((s) => s + 50);
            } else {
              // Crash!
              retroAudio.playExplosion();
              setIsCrashed(true);
            }
          }
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isCrashed, speed, distance, skierX]);

  const restartGame = () => {
    setIsCrashed(false);
    setDistance(0);
    setScore(0);
    setSpeed(2);
    setSkierX(150);
    setObstacles([
      { x: 80, y: 150, type: 'tree' },
      { x: 220, y: 220, type: 'rock' },
      { x: 140, y: 320, type: 'tree' },
      { x: 190, y: 450, type: 'ramp' },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-white select-none font-sans text-xs">
      {/* Top HUD */}
      <div className="bg-[#c0c0c0] border-b border-[#808080] p-1 flex justify-between items-center text-[11px]">
        <div className="flex gap-3">
          <span className="font-bold">Dist: {distance}m</span>
          <span className="font-bold text-blue-900">Score: {score}</span>
        </div>
        <button
          type="button"
          onClick={restartGame}
          className="win3-button px-2 py-0.5"
        >
          Reset
        </button>
      </div>

      {/* Slope viewport */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {/* Skier at y=70 */}
        <div
          className="absolute z-20 text-2xl transition-all duration-75"
          style={{ left: `${skierX}px`, top: '70px', transform: 'translate(-50%, -50%)' }}
        >
          {isCrashed ? '💥' : '⛷️'}
        </div>

        {/* Obstacles */}
        {obstacles.map((obs, idx) => (
          <div
            key={idx}
            className="absolute text-xl"
            style={{ left: `${obs.x}px`, top: `${obs.y}px`, transform: 'translate(-50%, -50%)' }}
          >
            {obs.type === 'tree' && '🌲'}
            {obs.type === 'rock' && '🪨'}
            {obs.type === 'ramp' && '📐'}
            {obs.type === 'yeti' && '👹'}
          </div>
        ))}

        {/* Crash modal */}
        {isCrashed && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
            <div className="bg-[#c0c0c0] win3-box-raised p-3 text-center border border-black">
              <div className="font-bold text-sm text-red-700 mb-1">WIPEOUT!</div>
              <div className="text-xs mb-2">Distance: {distance}m &middot; Score: {score}</div>
              <button
                type="button"
                onClick={restartGame}
                className="win3-button px-3 py-1 font-bold"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls helper */}
      <div className="bg-[#c0c0c0] border-t border-[#808080] p-1 text-[10px] text-gray-700 flex justify-between">
        <span>Steer: ← / → keys or buttons</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setSkierX((x) => Math.max(20, x - 25))}
            className="win3-button px-2"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => setSkierX((x) => Math.min(280, x + 25))}
            className="win3-button px-2"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};
