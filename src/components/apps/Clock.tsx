import React, { useState, useEffect } from 'react';
import { retroAudio } from '../../services/audio';

export const Clock: React.FC = () => {
  const [mode, setMode] = useState<'analog' | 'digital'>('analog');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hrAngle = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="flex flex-col h-full bg-[#ffffff] font-sans text-xs select-none">
      {/* Settings Bar */}
      <div className="bg-[#c0c0c0] border-b border-[#808080] px-2 py-0.5 flex gap-2 text-[11px]">
        <button
          type="button"
          onClick={() => {
            setMode('analog');
            retroAudio.playSwitchClick('button');
          }}
          className={`px-1.5 py-0.5 ${mode === 'analog' ? 'font-bold bg-white win3-box-sunken' : 'hover:bg-[#000080] hover:text-white'}`}
        >
          Analog
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('digital');
            retroAudio.playSwitchClick('button');
          }}
          className={`px-1.5 py-0.5 ${mode === 'digital' ? 'font-bold bg-white win3-box-sunken' : 'hover:bg-[#000080] hover:text-white'}`}
        >
          Digital
        </button>
      </div>

      {/* Clock Face Display */}
      <div className="flex-1 flex items-center justify-center p-3 bg-white">
        {mode === 'analog' ? (
          <div className="relative w-44 h-44 rounded-full border-4 border-black bg-white flex items-center justify-center shadow-md">
            {/* Hour tick marks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = i * 30;
              return (
                <div
                  key={i}
                  className="absolute w-1 bg-black"
                  style={{
                    height: i % 3 === 0 ? '10px' : '6px',
                    top: '4px',
                    transformOrigin: '50% 84px',
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              );
            })}

            {/* Hour hand */}
            <div
              className="absolute w-1.5 bg-black rounded-sm"
              style={{
                height: '42px',
                bottom: '50%',
                transformOrigin: 'bottom center',
                transform: `rotate(${hrAngle}deg)`,
              }}
            />

            {/* Minute hand */}
            <div
              className="absolute w-1 bg-black rounded-sm"
              style={{
                height: '62px',
                bottom: '50%',
                transformOrigin: 'bottom center',
                transform: `rotate(${minAngle}deg)`,
              }}
            />

            {/* Second hand */}
            <div
              className="absolute w-0.5 bg-red-600"
              style={{
                height: '68px',
                bottom: '50%',
                transformOrigin: 'bottom center',
                transform: `rotate(${secAngle}deg)`,
              }}
            />

            {/* Center pin */}
            <div className="w-2.5 h-2.5 bg-black rounded-full z-10" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="font-dos text-4xl text-black bg-[#f0f0f0] px-4 py-2 border-2 border-black tracking-widest tabular-nums">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-gray-600 mt-2 font-mono text-sm">
              {time.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
