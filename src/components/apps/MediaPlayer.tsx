import React, { useState, useEffect, useRef } from 'react';
import { retroAudio } from '../../services/audio';

// Authentic notes sequence for famous Windows MIDI melodies (Canyon.mid theme)
const CANYON_NOTES = [
  { f: 261.63, d: 0.25 }, // C4
  { f: 329.63, d: 0.25 }, // E4
  { f: 392.00, d: 0.25 }, // G4
  { f: 523.25, d: 0.5 },  // C5
  { f: 493.88, d: 0.25 }, // B4
  { f: 392.00, d: 0.25 }, // G4
  { f: 440.00, d: 0.75 }, // A4
  { f: 349.23, d: 0.25 }, // F4
  { f: 392.00, d: 0.25 }, // G4
  { f: 440.00, d: 0.25 }, // A4
  { f: 523.25, d: 0.5 },  // C5
  { f: 392.00, d: 0.25 }, // G4
  { f: 329.63, d: 0.75 }, // E4
];

export const MediaPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFile, setCurrentFile] = useState('CANYON.MID');
  const [progress, setProgress] = useState(0);
  const noteIndex = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        const note = CANYON_NOTES[noteIndex.current];
        retroAudio.playMidiNote(note.f, note.d);

        noteIndex.current = (noteIndex.current + 1) % CANYON_NOTES.length;
        setProgress((prev) => (prev >= 100 ? 0 : prev + 3));
      }, 350);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handlePlay = () => {
    retroAudio.playSwitchClick('button');
    setIsPlaying(true);
  };

  const handlePause = () => {
    retroAudio.playSwitchClick('button');
    setIsPlaying(false);
  };

  const handleStop = () => {
    retroAudio.playSwitchClick('button');
    setIsPlaying(false);
    setProgress(0);
    noteIndex.current = 0;
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs select-none p-2 justify-between">
      {/* File info banner */}
      <div className="win3-box-sunken p-1.5 bg-white text-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🎵</span>
          <span className="font-bold">{currentFile}</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">MIDI Sequencer (MCI)</span>
      </div>

      {/* Progress track slider */}
      <div className="my-2">
        <div className="flex justify-between text-[10px] text-gray-700 mb-1 font-mono">
          <span>00:{String(Math.floor(progress * 0.6)).padStart(2, '0')}</span>
          <span>01:00</span>
        </div>
        <div className="w-full h-4 win3-box-sunken bg-[#808080] relative cursor-pointer">
          <div
            className="h-full bg-[#000080]"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-0 w-3 h-4 win3-box-raised bg-[#c0c0c0] -ml-1.5"
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls: Play, Pause, Stop, Eject */}
      <div className="flex items-center justify-center gap-2 pt-1 border-t border-[#808080]">
        <button
          type="button"
          onClick={handlePlay}
          disabled={isPlaying}
          className={`win3-button px-3 py-1 font-bold flex items-center gap-1 ${
            isPlaying ? 'bg-[#e0e0e0]' : ''
          }`}
          title="Play"
        >
          <span>▶</span>
          <span>Play</span>
        </button>

        <button
          type="button"
          onClick={handlePause}
          disabled={!isPlaying}
          className="win3-button px-3 py-1 font-bold flex items-center gap-1"
          title="Pause"
        >
          <span>⏸</span>
          <span>Pause</span>
        </button>

        <button
          type="button"
          onClick={handleStop}
          className="win3-button px-3 py-1 font-bold flex items-center gap-1"
          title="Stop"
        >
          <span>⏹</span>
          <span>Stop</span>
        </button>

        <select
          value={currentFile}
          onChange={(e) => {
            handleStop();
            setCurrentFile(e.target.value);
          }}
          className="win3-box-sunken bg-white p-1 text-[11px] font-sans ml-2"
        >
          <option value="CANYON.MID">CANYON.MID</option>
          <option value="PASSPORT.MID">PASSPORT.MID</option>
          <option value="BACH_INV.MID">BACH_INV.MID</option>
        </select>
      </div>
    </div>
  );
};
