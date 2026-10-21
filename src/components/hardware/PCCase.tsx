import React from 'react';
import { BootStage } from '../../types/win3';
import { availableFloppies } from '../../services/fileSystem';
import { retroAudio } from '../../services/audio';

interface PCCaseProps {
  bootStage: BootStage;
  onPowerToggle: () => void;
  onReset: () => void;
  turbo: boolean;
  onToggleTurbo: () => void;
  hddLed: boolean;
  floppyLed: boolean;
  insertedFloppyId: string | null;
  onInsertFloppy: (id: string | null) => void;
}

export const PCCase: React.FC<PCCaseProps> = ({
  bootStage,
  onPowerToggle,
  onReset,
  turbo,
  onToggleTurbo,
  hddLed,
  floppyLed,
  insertedFloppyId,
  onInsertFloppy,
}) => {
  const isPoweredOn = bootStage !== 'OFF';

  const handleFloppyEject = () => {
    retroAudio.playFloppySeek();
    onInsertFloppy(null);
  };

  const handleFloppySelect = (id: string) => {
    retroAudio.playFloppySeek();
    if (insertedFloppyId === id) {
      onInsertFloppy(null);
    } else {
      onInsertFloppy(id);
    }
  };

  return (
    <div className="w-full bg-[#ded6c3] border-4 border-t-[#eee8db] border-l-[#eee8db] border-b-[#9e9684] border-r-[#9e9684] p-4 shadow-2xl rounded-sm select-none relative font-sans text-gray-800">
      {/* Front Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left: Vintage Badges & Vent Slits */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-[#242526] text-white px-2 py-1 text-xs font-mono font-bold tracking-widest border border-gray-600 rounded-sm">
              DX2-66
            </div>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-gray-800">
                PENTACLASSIC 486
              </div>
              <div className="text-[10px] text-gray-600">32-Bit VESA Local Bus</div>
            </div>
          </div>

          {/* Vent Slits for authentic 90s aesthetic */}
          <div className="space-y-1 py-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-1 bg-[#b5ad9b] border-b border-[#eee8db] rounded-full"
              />
            ))}
          </div>

          <div className="text-[10px] text-gray-500 font-mono">
            ENERGY STAR &bull; FCC CLASS B &bull; 1992
          </div>
        </div>

        {/* Center: 3.5" Floppy Disk Drive A: */}
        <div className="lg:col-span-4 bg-[#cfc7b4] border-2 border-t-[#9e9684] border-l-[#9e9684] border-b-[#eee8db] border-r-[#eee8db] p-2.5 rounded-sm">
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 mb-1">
            <span>FLOPPY DISK DRIVE A:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-gray-500">1.44MB</span>
              {/* Floppy activity LED */}
              <div
                className={`w-2.5 h-2.5 rounded-full border border-black/40 transition-colors ${
                  floppyLed || insertedFloppyId
                    ? 'bg-green-500 shadow-[0_0_6px_#22c55e]'
                    : 'bg-green-950'
                }`}
                title="Floppy Drive Activity"
              />
            </div>
          </div>

          {/* Drive Slot */}
          <div className="h-6 bg-[#1a1b1c] border-2 border-black flex items-center justify-between px-2 relative">
            <div className="h-1.5 bg-[#111] flex-1 rounded-sm overflow-hidden flex items-center">
              {insertedFloppyId ? (
                <div className="w-full h-full bg-blue-700 border-t border-blue-400 text-[8px] text-white px-2 truncate">
                  DISK INSERTED: {availableFloppies.find((f) => f.id === insertedFloppyId)?.label}
                </div>
              ) : (
                <div className="w-full text-center text-[8px] text-gray-600 font-mono">
                  [ DRIVE EMPTY ]
                </div>
              )}
            </div>

            {/* Eject button */}
            <button
              type="button"
              onClick={handleFloppyEject}
              disabled={!insertedFloppyId}
              className="ml-2 win3-button px-2 py-0.5 text-[10px] font-bold bg-[#ded6c3] disabled:opacity-40"
              title="Eject Floppy"
            >
              ⏏ Eject
            </button>
          </div>

          {/* Quick Floppy Selector Tray */}
          <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pt-1">
            <span className="text-[10px] text-gray-600 font-bold shrink-0">Disks:</span>
            {availableFloppies.map((disk) => {
              const isInserted = insertedFloppyId === disk.id;
              return (
                <button
                  type="button"
                  key={disk.id}
                  onClick={() => handleFloppySelect(disk.id)}
                  className={`text-[9px] px-2 py-0.5 font-bold rounded-sm border shrink-0 transition-transform ${
                    isInserted
                      ? 'bg-green-700 text-white border-green-900 ring-2 ring-yellow-400 scale-105'
                      : `${disk.color} text-white border-black/50 hover:opacity-90`
                  }`}
                  title={`Insert/Eject ${disk.label}`}
                >
                  {isInserted ? `✓ ${disk.label}` : `💾 ${disk.label}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Master Physical Control Panel with POWER, RESET, TURBO & LEDs */}
        <div className="lg:col-span-5 bg-[#cfc7b4] border-2 border-t-[#eee8db] border-l-[#eee8db] border-b-[#9e9684] border-r-[#9e9684] p-3 rounded-sm flex items-center justify-between gap-3">
          {/* Turbo 7-Segment LED Display */}
          <div className="flex flex-col items-center">
            <div className="text-[10px] font-bold text-gray-700 mb-0.5">TURBO MHz</div>
            <div className="bg-black px-2.5 py-1 border-2 border-gray-700 rounded-sm">
              <span
                className={`font-mono text-xl font-bold tracking-widest ${
                  isPoweredOn
                    ? turbo
                      ? 'text-green-500 shadow-[0_0_8px_#22c55e]'
                      : 'text-amber-500'
                    : 'text-green-950 opacity-40'
                }`}
              >
                {isPoweredOn ? (turbo ? '66' : '33') : '--'}
              </span>
            </div>
            <button
              type="button"
              onClick={onToggleTurbo}
              className={`mt-1 text-[9px] px-2 py-0.5 win3-button font-bold ${
                turbo ? 'bg-[#eee8db] font-extrabold' : ''
              }`}
            >
              TURBO
            </button>
          </div>

          {/* Activity Status LEDs */}
          <div className="flex flex-col gap-2">
            {/* Power LED */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-3 h-3 rounded-full border border-black/60 transition-colors ${
                  isPoweredOn
                    ? 'bg-green-500 shadow-[0_0_8px_#22c55e]'
                    : 'bg-green-950'
                }`}
              />
              <span className="text-[10px] font-bold text-gray-700">POWER</span>
            </div>

            {/* HDD Activity LED */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-3 h-3 rounded-full border border-black/60 transition-colors ${
                  hddLed
                    ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                    : 'bg-amber-950'
                }`}
              />
              <span className="text-[10px] font-bold text-gray-700">HDD READ</span>
            </div>
          </div>

          {/* Tactile Reset Button */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onReset}
              className="w-8 h-8 rounded-full win3-button bg-[#ded6c3] active:translate-y-0.5 flex items-center justify-center font-bold text-xs text-gray-800"
              title="Reset PC"
            >
              ↺
            </button>
            <span className="text-[10px] font-bold text-gray-700 mt-1">RESET</span>
          </div>

          {/* Big Tactile Red/Black Rocker POWER SWITCH (Outside Screen as required!) */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onPowerToggle}
              className={`w-14 h-16 rounded border-2 border-black flex flex-col justify-between p-1 transition-all shadow-md active:scale-95 ${
                isPoweredOn
                  ? 'bg-gradient-to-b from-red-600 to-red-800 text-white ring-2 ring-red-400'
                  : 'bg-gradient-to-b from-gray-700 to-gray-900 text-gray-300'
              }`}
              title={isPoweredOn ? 'Click to Power OFF' : 'Click to Boot Up Windows 3.1 PC'}
            >
              <div
                className={`text-center font-mono text-[10px] font-bold py-0.5 rounded ${
                  isPoweredOn ? 'bg-red-950 text-white' : 'text-gray-400'
                }`}
              >
                {isPoweredOn ? '● ON' : '○ OFF'}
              </div>
              <div className="text-center font-sans font-black text-xs tracking-wider">
                POWER
              </div>
              <div className="text-[9px] text-center font-mono opacity-80">
                [ I / O ]
              </div>
            </button>
            <span className="text-[10px] font-bold text-red-900 mt-1">MAIN SWITCH</span>
          </div>
        </div>
      </div>
    </div>
  );
};
