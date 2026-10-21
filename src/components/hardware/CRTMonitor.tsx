import React, { useState } from 'react';
import { BootStage } from '../../types/win3';
import { retroAudio } from '../../services/audio';

interface CRTMonitorProps {
  bootStage: BootStage;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  children: React.ReactNode;
}

export const CRTMonitor: React.FC<CRTMonitorProps> = ({
  bootStage,
  scanlinesEnabled,
  onToggleScanlines,
  children,
}) => {
  const [isDegaussing, setIsDegaussing] = useState(false);
  const isPoweredOn = bootStage !== 'OFF';

  const handleDegauss = () => {
    if (!isPoweredOn || isDegaussing) return;
    setIsDegaussing(true);
    retroAudio.playDegauss();
    setTimeout(() => {
      setIsDegaussing(false);
    }, 1300);
  };

  return (
    <div className="w-full bg-[#ded6c3] border-8 border-t-[#eee8db] border-l-[#eee8db] border-b-[#9e9684] border-r-[#9e9684] rounded-2xl p-4 sm:p-6 shadow-2xl relative select-none">
      {/* Top Monitor Bezel Badge */}
      <div className="flex justify-between items-center px-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#756f62] border border-[#eee8db]" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#5c5547] uppercase">
            MULTISYNC 4FG
          </span>
        </div>
        <div className="text-[10px] text-[#756f62] font-mono">
          DIGITAL CONTROL &bull; LOW RADIATION
        </div>
      </div>

      {/* Curved CRT Display Frame */}
      <div className="relative bg-[#16171a] p-3 rounded-xl border-4 border-[#333] shadow-inner">
        {/* Screen Aperture / Glass Box */}
        <div
          className={`relative w-full aspect-[4/3] max-h-[620px] rounded-lg overflow-hidden bg-black flex flex-col ${
            isDegaussing ? 'degauss-active' : ''
          }`}
        >
          {/* Active Screen Content */}
          {isPoweredOn ? (
            <div className="w-full h-full relative z-10 crt-power-on">
              {children}
            </div>
          ) : (
            /* Powered Off Screen */
            <div className="w-full h-full bg-[#0a0c0e] flex flex-col items-center justify-center relative p-6 text-center">
              <div className="w-16 h-16 rounded-full border border-gray-800/40 bg-radial from-gray-700/20 to-transparent flex items-center justify-center mb-4">
                <span className="text-3xl opacity-30">⏻</span>
              </div>
              <h2 className="text-gray-500 font-sans text-lg font-bold">PC is Powered Off</h2>
              <p className="text-gray-600 text-xs mt-1 max-w-sm">
                Press the big red <strong className="text-red-400">POWER</strong> switch on the computer case below to boot into Windows 3.1.
              </p>
            </div>
          )}

          {/* CRT Scanline Layer */}
          {scanlinesEnabled && isPoweredOn && (
            <div className="absolute inset-0 crt-scanlines z-30 pointer-events-none opacity-70" />
          )}

          {/* CRT Vignette / Screen Curvature Shadow */}
          <div className="absolute inset-0 crt-vignette z-30 pointer-events-none" />

          {/* Glass Reflection */}
          <div className="absolute inset-0 crt-glass-reflection z-30 pointer-events-none" />
        </div>
      </div>

      {/* Bottom Monitor Hardware Bezel Controls */}
      <div className="mt-3 flex items-center justify-between px-2 pt-1 border-t border-[#b8b09d]">
        {/* Left: Monitor Power LED */}
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full border border-black/50 transition-colors ${
              isPoweredOn
                ? 'bg-green-500 shadow-[0_0_8px_#22c55e]'
                : 'bg-green-950'
            }`}
          />
          <span className="text-[10px] font-bold text-gray-700">CRT POWER</span>
        </div>

        {/* Center: Degauss & Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Degauss Button */}
          <button
            type="button"
            onClick={handleDegauss}
            disabled={!isPoweredOn}
            className="win3-button px-2.5 py-1 text-[10px] font-bold bg-[#ded6c3] flex items-center gap-1 disabled:opacity-40"
            title="Degauss CRT Monitor (Electric Demagnetizer)"
          >
            <span>🧲</span>
            <span>DEGAUSS</span>
          </button>

          {/* Scanlines Toggle */}
          <button
            type="button"
            onClick={onToggleScanlines}
            className={`win3-button px-2.5 py-1 text-[10px] font-bold bg-[#ded6c3] flex items-center gap-1 ${
              scanlinesEnabled ? 'win3-box-sunken bg-white' : ''
            }`}
            title="Toggle CRT Scanline Shader"
          >
            <span>📺</span>
            <span>Scanlines: {scanlinesEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Right: CRT adjustment dials */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-[#3b3a36] border border-[#6b685e] flex items-center justify-center cursor-pointer shadow-sm">
              <div className="w-0.5 h-3 bg-gray-400 rotate-45" />
            </div>
            <span className="text-[8px] text-gray-600 font-mono mt-0.5">BRIGHT</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-[#3b3a36] border border-[#6b685e] flex items-center justify-center cursor-pointer shadow-sm">
              <div className="w-0.5 h-3 bg-gray-400 -rotate-12" />
            </div>
            <span className="text-[8px] text-gray-600 font-mono mt-0.5">CONTRAST</span>
          </div>
        </div>
      </div>
    </div>
  );
};
