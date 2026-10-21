import React, { useEffect, useState, useRef } from 'react';
import { retroAudio } from '../../services/audio';

interface DOSBootProps {
  onBootToWindows: () => void;
  triggerHddLed: (active: boolean) => void;
}

export const DOSBoot: React.FC<DOSBootProps> = ({ onBootToWindows, triggerHddLed }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  // Store callbacks in refs to prevent timer cancellation when parent re-renders
  const onBootRef = useRef(onBootToWindows);
  onBootRef.current = onBootToWindows;

  const triggerHddRef = useRef(triggerHddLed);
  triggerHddRef.current = triggerHddLed;

  const hasAdvanced = useRef(false);

  const advanceToWindows = () => {
    if (hasAdvanced.current) return;
    hasAdvanced.current = true;
    onBootRef.current();
  };

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 350);
    return () => clearInterval(cursorInterval);
  }, []);

  // Keyboard and click listener to skip or advance immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        advanceToWindows();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main DOS boot sequence - runs once
  useEffect(() => {
    const sequence: { delay: number; text: string; hdd?: boolean }[] = [
      { delay: 150, text: 'Starting MS-DOS 6.22...' },
      { delay: 450, text: 'HIMEM: DOS XMS Driver, Version 3.09 - 07/24/92' },
      { delay: 800, text: 'C:\\> C:\\DOS\\SMARTDRV.EXE /X' },
      { delay: 1100, text: 'C:\\> PROMPT $P$G' },
      { delay: 1400, text: 'C:\\> PATH C:\\WINDOWS;C:\\DOS;C:\\GAMES' },
      { delay: 1750, text: 'C:\\> win', hdd: true },
      { delay: 2400, text: 'Starting Windows...' },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    sequence.forEach((step) => {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, step.text]);
        if (step.hdd) {
          triggerHddRef.current(true);
          retroAudio.playHddCrunch(250);
          setTimeout(() => triggerHddRef.current(false), 250);
        }
      }, step.delay);
      timeouts.push(t);
    });

    // Automatically transition to Windows loading bootsplash
    const finalTimer = setTimeout(() => {
      advanceToWindows();
    }, 3200);
    timeouts.push(finalTimer);

    return () => {
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <div
      onClick={advanceToWindows}
      className="w-full h-full bg-black text-white font-dos text-2xl p-8 flex flex-col justify-between select-none leading-relaxed cursor-pointer"
      title="Click or press ENTER to continue"
    >
      <div className="space-y-1">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={
              line === 'Starting Windows...'
                ? 'font-bold text-white text-3xl tracking-wide pt-4'
                : 'text-gray-200'
            }
          >
            {line}
          </div>
        ))}
        <div className="inline-block text-white">
          {showCursor ? '_' : ' '}
        </div>
      </div>

      {/* Helper skip prompt at bottom */}
      <div className="text-gray-600 text-sm font-sans flex justify-between items-center border-t border-gray-900 pt-2">
        <span>MS-DOS 6.22 Boot Process</span>
        <span className="text-gray-400 animate-pulse text-xs">
          Press ENTER or Click anywhere to continue &rarr;
        </span>
      </div>
    </div>
  );
};
