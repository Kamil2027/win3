import React, { useState } from 'react';
import { ColorThemeId, WallpaperPattern } from '../../types/win3';
import { colorThemes } from '../../services/themes';
import { retroAudio } from '../../services/audio';

interface ControlPanelProps {
  currentThemeId: ColorThemeId;
  onSelectTheme: (themeId: ColorThemeId) => void;
  currentWallpaper: WallpaperPattern;
  onSelectWallpaper: (pattern: WallpaperPattern) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentThemeId,
  onSelectTheme,
  currentWallpaper,
  onSelectWallpaper,
}) => {
  const [activeTab, setActiveTab] = useState<'icons' | 'color' | 'desktop' | 'sound'>('icons');

  const cpanelIcons = [
    { id: 'color', label: 'Color', icon: '🎨', desc: 'Adjust Windows color schemes' },
    { id: 'desktop', label: 'Desktop', icon: '🖼️', desc: 'Pattern and wallpaper settings' },
    { id: 'sound', label: 'Sound', icon: '🔊', desc: 'Audio events and system beeps' },
    { id: 'datetime', label: 'Date/Time', icon: '📅', desc: 'Set system clock & calendar' },
    { id: 'ports', label: 'Ports', icon: '🔌', desc: 'COM1, COM2, LPT1 ports' },
    { id: 'drivers', label: 'Drivers', icon: '💾', desc: 'Sound Blaster & VGA drivers' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs select-none">
      {/* Sub header navigation if in sub-dialog */}
      {activeTab !== 'icons' && (
        <div className="flex items-center gap-2 p-1 bg-[#c0c0c0] border-b border-[#808080]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('icons');
              retroAudio.playSwitchClick('button');
            }}
            className="win3-button px-2 py-0.5"
          >
            &lt; Back to Control Panel
          </button>
          <span className="font-bold text-gray-700 capitalize">{activeTab} Settings</span>
        </div>
      )}

      {/* Main icons view */}
      {activeTab === 'icons' && (
        <div className="p-4 grid grid-cols-3 gap-4 overflow-y-auto">
          {cpanelIcons.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                retroAudio.playSwitchClick('button');
                if (item.id === 'color') setActiveTab('color');
                else if (item.id === 'desktop') setActiveTab('desktop');
                else if (item.id === 'sound') setActiveTab('sound');
                else retroAudio.playDing();
              }}
              className="flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-gray-300 rounded border border-transparent hover:border-black/20"
            >
              <div className="text-3xl mb-1">{item.icon}</div>
              <div className="font-bold text-center text-black">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Color Schemes Dialog */}
      {activeTab === 'color' && (
        <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
          <div>
            <label className="font-bold text-black block mb-1">Color Schemes:</label>
            <select
              value={currentThemeId}
              onChange={(e) => {
                retroAudio.playSwitchClick('button');
                onSelectTheme(e.target.value as ColorThemeId);
              }}
              className="win3-box-sunken bg-white text-black p-1 w-full font-sans text-xs outline-none"
            >
              {Object.values(colorThemes).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Theme preview box */}
          <div className="win3-box-sunken p-2 bg-[#808080] flex-1 flex flex-col justify-center items-center">
            <div
              style={{
                backgroundColor: colorThemes[currentThemeId]?.desktopBg || '#008080',
              }}
              className="w-full h-36 p-2 flex flex-col justify-center items-center border border-black shadow-inner relative"
            >
              {/* Mini simulated window */}
              <div className="w-48 bg-[#c0c0c0] win3-box-raised border border-black text-[10px]">
                <div
                  style={{
                    backgroundColor: colorThemes[currentThemeId]?.activeTitleBg,
                    color: colorThemes[currentThemeId]?.activeTitleText,
                  }}
                  className="px-1 py-0.5 font-bold flex justify-between items-center"
                >
                  <span>Active Window</span>
                  <span>▲</span>
                </div>
                <div
                  style={{
                    backgroundColor: colorThemes[currentThemeId]?.windowBg,
                    color: colorThemes[currentThemeId]?.windowText,
                  }}
                  className="p-2 border border-[#808080] m-1"
                >
                  Window Text Content
                  <div className="mt-1 flex gap-1">
                    <button
                      type="button"
                      style={{
                        backgroundColor: colorThemes[currentThemeId]?.buttonFace,
                        color: colorThemes[currentThemeId]?.buttonText,
                      }}
                      className="win3-button px-2 py-0.5 text-[9px]"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Wallpaper Dialog */}
      {activeTab === 'desktop' && (
        <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
          <div>
            <label className="font-bold text-black block mb-1">Pattern / Wallpaper:</label>
            <div className="grid grid-cols-2 gap-2">
              {(['teal', 'argyle', 'boxes', 'castle', 'chess', 'thatched'] as WallpaperPattern[]).map(
                (pat) => (
                  <button
                    type="button"
                    key={pat}
                    onClick={() => {
                      retroAudio.playSwitchClick('button');
                      onSelectWallpaper(pat);
                    }}
                    className={`p-2 win3-button flex items-center justify-between capitalize ${
                      currentWallpaper === pat ? 'bg-white font-bold win3-box-sunken' : ''
                    }`}
                  >
                    <span>{pat === 'teal' ? '(None / Solid)' : pat}</span>
                    {currentWallpaper === pat && <span>✓</span>}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mt-2 text-gray-700 text-[11px] win3-box-sunken p-2 bg-[#e0e0e0]">
            Tip: Windows 3.1 tiled bitmap patterns create the iconic 1990s retro desktop aesthetic!
          </div>
        </div>
      )}

      {/* Sound Settings Dialog */}
      {activeTab === 'sound' && (
        <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto">
          <label className="font-bold text-black block">Sound Events (Audio Test):</label>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => retroAudio.playWindowsStartup()}
              className="w-full win3-button py-1 px-3 text-left flex justify-between"
            >
              <span>Windows Start (Tada.wav)</span>
              <span>▶ Play</span>
            </button>
            <button
              type="button"
              onClick={() => retroAudio.playWindowsShutdown()}
              className="w-full win3-button py-1 px-3 text-left flex justify-between"
            >
              <span>Windows Exit (Chimes.wav)</span>
              <span>▶ Play</span>
            </button>
            <button
              type="button"
              onClick={() => retroAudio.playDing()}
              className="w-full win3-button py-1 px-3 text-left flex justify-between"
            >
              <span>Asterisk / Alert (Ding.wav)</span>
              <span>▶ Play</span>
            </button>
            <button
              type="button"
              onClick={() => retroAudio.playFloppySeek()}
              className="w-full win3-button py-1 px-3 text-left flex justify-between"
            >
              <span>Floppy Drive Step &amp; Seek</span>
              <span>▶ Play</span>
            </button>
            <button
              type="button"
              onClick={() => retroAudio.playHddCrunch(300)}
              className="w-full win3-button py-1 px-3 text-left flex justify-between"
            >
              <span>Hard Disk Head Seek</span>
              <span>▶ Play</span>
            </button>
            <button
              type="button"
              onClick={() => retroAudio.playDegauss()}
              className="w-full win3-button py-1 px-3 text-left flex justify-between"
            >
              <span>CRT Monitor Degauss Coil</span>
              <span>▶ Play</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
