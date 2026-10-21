import React, { useState } from 'react';
import { retroAudio } from '../../services/audio';

interface DOSExitedProps {
  onRestartWindows: () => void;
}

export const DOSExited: React.FC<DOSExitedProps> = ({ onRestartWindows }) => {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    retroAudio.playMineClick();
    const cmd = inputVal.trim().toLowerCase();
    if (cmd === 'win' || cmd === 'win.com') {
      onRestartWindows();
    } else {
      retroAudio.playDing();
      setInputVal('');
    }
  };

  return (
    <div className="w-full h-full bg-black text-gray-200 font-dos text-xl p-8 flex flex-col justify-between select-none">
      <div className="space-y-2">
        <div className="text-gray-400">Microsoft(R) MS-DOS(R) Version 6.22</div>
        <div className="text-gray-400">Windows session terminated.</div>
        <div className="text-yellow-400 pt-2">
          It is now safe to turn off your computer using the POWER switch below,
          or type <span className="text-white font-bold">WIN</span> to restart Microsoft Windows 3.1.
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-4">
          <span className="text-white">C:\WINDOWS&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="bg-transparent text-white font-dos text-xl outline-none border-none p-0 flex-1"
            autoFocus
            placeholder="Type 'win' and press Enter"
          />
        </form>
      </div>

      <div className="flex items-center justify-between border-t border-gray-800 pt-2 text-sm text-gray-500">
        <button
          type="button"
          onClick={onRestartWindows}
          className="text-green-400 underline hover:text-green-300 font-sans text-xs"
        >
          [ Click here to quickly run &quot;WIN&quot; and boot Windows ]
        </button>
        <div>Press PC Case POWER switch to shut down</div>
      </div>
    </div>
  );
};
