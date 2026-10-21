import React, { useEffect, useState, useRef } from 'react';
import { retroAudio } from '../../services/audio';

interface WindowsLoadingScreenProps {
  onLoadingComplete: () => void;
  triggerHddLed: (active: boolean) => void;
}

const driverStages = [
  'Starting Microsoft Windows 3.1...',
  'Loading KRNL386.EXE (386 Enhanced Mode)...',
  'Initializing GDI.EXE and USER.EXE...',
  'Loading VGA.DRV (640x480 16 Colors)...',
  'Initializing MMSOUND.DRV (Sound Blaster Pro)...',
  'Loading TrueType Font Rasterizer...',
  'Initializing Program Manager Shell...',
];

export const WindowsLoadingScreen: React.FC<WindowsLoadingScreenProps> = ({
  onLoadingComplete,
  triggerHddLed,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(driverStages[0]);

  const onCompleteRef = useRef(onLoadingComplete);
  onCompleteRef.current = onLoadingComplete;

  const triggerHddRef = useRef(triggerHddLed);
  triggerHddRef.current = triggerHddLed;

  const hasCompleted = useRef(false);

  const finishLoading = () => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    triggerHddRef.current(false);
    retroAudio.playWindowsStartup();
    onCompleteRef.current();
  };

  // Keyboard shortcut to skip loading
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        finishLoading();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 3;
      setProgress(Math.min(100, current));

      // Flash hard drive LED periodically and play subtle crunch
      if (current % 18 === 0) {
        triggerHddRef.current(true);
        retroAudio.playHddCrunch(120);
        setTimeout(() => triggerHddRef.current(false), 100);
      }

      // Update driver message
      const stageIdx = Math.min(
        Math.floor((current / 100) * driverStages.length),
        driverStages.length - 1
      );
      setStatusText(driverStages[stageIdx]);

      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          finishLoading();
        }, 400);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Number of blocks in retro progress bar
  const totalBlocks = 24;
  const filledBlocks = Math.round((progress / 100) * totalBlocks);

  return (
    <div
      onClick={finishLoading}
      className="w-full h-full bg-[#000000] text-white flex flex-col items-center justify-between p-8 select-none font-sans cursor-pointer"
      title="Click or press ENTER to skip straight to Desktop"
    >
      {/* Top spacing */}
      <div className="h-4" />

      {/* Center Windows 3.1 Bootsplash Logo */}
      <div className="flex flex-col items-center max-w-xl text-center">
        {/* Pixel Art Windows 3.1 Flag Logo */}
        <div className="relative mb-6 transform scale-110">
          <div className="w-36 h-28 relative mx-auto">
            {/* The 4-quadrant Windows Flag with 3D shadow tail */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-2 transform -skew-y-6 rotate-2 filter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]">
              {/* Red quadrant */}
              <div className="bg-[#e74c3c] border-2 border-t-[#ff7675] border-l-[#ff7675] border-b-[#c0392b] border-r-[#c0392b] flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-white/20 to-black/20" />
              </div>
              {/* Green quadrant */}
              <div className="bg-[#2ecc71] border-2 border-t-[#55efc4] border-l-[#55efc4] border-b-[#27ae60] border-r-[#27ae60] flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-white/20 to-black/20" />
              </div>
              {/* Blue quadrant */}
              <div className="bg-[#0984e3] border-2 border-t-[#74b9ff] border-l-[#74b9ff] border-b-[#005ea6] border-r-[#005ea6] flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-white/20 to-black/20" />
              </div>
              {/* Yellow quadrant */}
              <div className="bg-[#f1c40f] border-2 border-t-[#ffeaa7] border-l-[#ffeaa7] border-b-[#f39c12] border-r-[#f39c12] flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-white/20 to-black/20" />
              </div>
            </div>

            {/* Flying trailing tail dots / cubes */}
            <div className="absolute -left-6 top-8 flex flex-col gap-1.5 opacity-80">
              <div className="w-2.5 h-2.5 bg-[#e74c3c] border border-black transform -skew-y-6" />
              <div className="w-2 h-2 bg-[#0984e3] border border-black transform -skew-y-6 ml-1" />
            </div>
            <div className="absolute -left-3 top-2 flex flex-col gap-1 opacity-70">
              <div className="w-2 h-2 bg-[#f1c40f] border border-black transform -skew-y-6" />
            </div>
          </div>
        </div>

        {/* Windows 3.1 Title Typography */}
        <h1 className="text-3xl font-serif font-black tracking-widest uppercase text-white drop-shadow-[2px_2px_0px_#333]">
          Microsoft Windows
        </h1>
        <div className="text-sm font-semibold tracking-wider text-gray-300 mt-1 uppercase">
          Operating System, Version 3.1
        </div>
        <div className="text-xs text-gray-400 mt-2 font-mono">
          Copyright &copy; Microsoft Corporation 1985-1992. All rights reserved.
        </div>

        {/* Vintage Sunken Progress Bar */}
        <div className="mt-8 w-80">
          <div className="w-full bg-[#1e2022] p-1 border-t-2 border-l-2 border-b-2 border-r-2 border-t-[#555] border-l-[#555] border-b-[#eee] border-r-[#eee] shadow-inner">
            <div className="h-5 flex gap-0.5 bg-black p-0.5">
              {Array.from({ length: totalBlocks }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-full transition-colors ${
                    i < filledBlocks
                      ? 'bg-[#0000aa] border-t border-l border-[#5555ff] border-r border-b border-[#000055]'
                      : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Loading status & percentage */}
          <div className="mt-3 flex justify-between items-center text-xs font-mono text-gray-300">
            <span className="truncate max-w-[210px] text-left">{statusText}</span>
            <span className="font-bold text-yellow-400 tabular-nums">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom helper note */}
      <div className="text-xs text-gray-500 font-mono text-center flex justify-between w-full max-w-md border-t border-gray-900 pt-2">
        <span>Windows 386 Enhanced Mode</span>
        <span className="text-gray-400">Click or press ENTER to skip &rarr;</span>
      </div>
    </div>
  );
};
