import React, { useEffect, useState, useRef } from 'react';
import { retroAudio } from '../../services/audio';

interface BIOSPostProps {
  turbo: boolean;
  onPostComplete: () => void;
  triggerHddLed: (active: boolean) => void;
}

export const BIOSPost: React.FC<BIOSPostProps> = ({ turbo, onPostComplete, triggerHddLed }) => {
  const [memoryKb, setMemoryKb] = useState<number>(640);
  const [phase, setPhase] = useState<number>(0);

  const onPostRef = useRef(onPostComplete);
  onPostRef.current = onPostComplete;

  const triggerHddRef = useRef(triggerHddLed);
  triggerHddRef.current = triggerHddLed;

  const hasCompleted = useRef(false);

  const completePost = () => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    onPostRef.current();
  };

  // Keyboard shortcut to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape' || e.key === 'Delete') {
        completePost();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Memory test count
    const speed = turbo ? 30 : 60;
    const targetMem = 16384;
    let currentMem = 640;

    const memInterval = setInterval(() => {
      currentMem += 512;
      if (currentMem >= targetMem) {
        currentMem = targetMem;
        setMemoryKb(targetMem);
        clearInterval(memInterval);
        setPhase(1);
        retroAudio.playBiosBeep(896, 0.15);

        // Phase 1: Drive detect
        triggerHddRef.current(true);
        retroAudio.playFloppySeek();

        setTimeout(() => {
          triggerHddRef.current(false);
          setPhase(2);

          // Phase 2: Complete and move to DOS
          setTimeout(() => {
            completePost();
          }, 800);
        }, 700);
      } else {
        setMemoryKb(currentMem);
      }
    }, speed);

    return () => clearInterval(memInterval);
  }, [turbo]);

  return (
    <div
      onClick={completePost}
      className="w-full h-full bg-black text-gray-200 font-dos text-xl p-8 flex flex-col justify-between select-none cursor-pointer"
      title="Click or press SPACE/ENTER to skip BIOS"
    >
      <div className="space-y-3">
        {/* American Megatrends Header */}
        <div className="flex items-start justify-between border-b border-gray-600 pb-2">
          <div>
            <div className="text-yellow-400 font-bold text-2xl tracking-wider">
              AMIBIOS (C) 1992 American Megatrends Inc.
            </div>
            <div className="text-gray-400 text-lg">
              486DX2-66 ROM BIOS PLUS Version 1.10 A04
            </div>
          </div>
          <div className="text-right text-sm text-gray-400">
            <div>AMI HI-FLEX BIOS</div>
            <div className="text-green-400">STATUS: {turbo ? 'TURBO 66MHz' : 'NORMAL 33MHz'}</div>
          </div>
        </div>

        {/* System Specs & RAM count */}
        <div className="mt-4 space-y-1">
          <div className="text-gray-300">
            Processor: Intel 80486DX2, {turbo ? '66 MHz' : '33 MHz'}
          </div>
          <div className="text-cyan-400 flex items-center gap-2">
            <span>Memory Test:</span>
            <span className="font-bold text-white text-2xl tabular-nums">{memoryKb} KB</span>
            {memoryKb >= 16384 ? (
              <span className="text-green-400 font-bold ml-2">OK</span>
            ) : (
              <span className="text-yellow-400 animate-pulse ml-2">Testing...</span>
            )}
          </div>
        </div>

        {/* Drive Info */}
        {phase >= 1 && (
          <div className="mt-4 pt-2 border-t border-gray-700 text-gray-300 space-y-1">
            <div className="text-yellow-300">Detecting IDE Drives...</div>
            <div className="pl-4">
              Pri. Master Disk: <span className="text-white">QUANTUM PRODRIVE 540MB</span> (LBA Mode, PIO 4)
            </div>
            <div className="pl-4">
              Pri. Slave Disk : <span className="text-gray-500">None</span>
            </div>
            <div className="pl-4">
              Floppy Drive A  : <span className="text-white">1.44 MB 3.5&quot;</span>
            </div>
            <div className="pl-4 text-green-400">
              Drive Detection Complete. System Cache Enabled.
            </div>
          </div>
        )}

        {phase >= 2 && (
          <div className="text-green-400 mt-4 text-lg">
            Booting from Hard Disk C:...
          </div>
        )}
      </div>

      {/* Footer Key Prompt */}
      <div className="flex justify-between text-base text-gray-400 border-t border-gray-800 pt-2">
        <div>Press <span className="text-yellow-300 font-bold">DEL</span> or click to skip to DOS</div>
        <div className="text-gray-500">08/11/92-80486-SIS-471-2C4I9000-00</div>
      </div>
    </div>
  );
};
