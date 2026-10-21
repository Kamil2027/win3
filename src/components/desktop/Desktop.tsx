import React, { useState, useEffect } from 'react';
import { AppId, ColorTheme, WallpaperPattern, WindowState } from '../../types/win3';
import { WindowFrame } from './WindowFrame';
import { ProgramManager } from './ProgramManager';
import { Minesweeper } from '../apps/Minesweeper';
import { Solitaire } from '../apps/Solitaire';
import { Paintbrush } from '../apps/Paintbrush';
import { Calculator } from '../apps/Calculator';
import { Notepad } from '../apps/Notepad';
import { Clock } from '../apps/Clock';
import { FileManager } from '../apps/FileManager';
import { ControlPanel } from '../apps/ControlPanel';
import { DOSPrompt } from '../apps/DOSPrompt';
import { MediaPlayer } from '../apps/MediaPlayer';
import { SkiFree } from '../apps/SkiFree';
import { retroAudio } from '../../services/audio';

interface DesktopProps {
  theme: ColorTheme;
  wallpaper: WallpaperPattern;
  onSelectTheme: (theme: ColorTheme) => void;
  onSelectWallpaper: (pattern: WallpaperPattern) => void;
  onExitToDOS: () => void;
  insertedFloppyId: string | null;
}

export const Desktop: React.FC<DesktopProps> = ({
  theme,
  wallpaper,
  onSelectTheme,
  onSelectWallpaper,
  onExitToDOS,
  insertedFloppyId,
}) => {
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'progman',
      title: 'Program Manager',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      x: 35,
      y: 20,
      width: 580,
      height: 380,
      icon: '🪟',
    },
    {
      id: 'winfile',
      title: 'File Manager',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 11,
      x: 60,
      y: 40,
      width: 540,
      height: 350,
      icon: '📁',
    },
    {
      id: 'winmine',
      title: 'Minesweeper',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 12,
      x: 180,
      y: 60,
      width: 260,
      height: 340,
      icon: '💣',
    },
    {
      id: 'sol',
      title: 'Solitaire',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 13,
      x: 90,
      y: 30,
      width: 520,
      height: 400,
      icon: '🃏',
    },
    {
      id: 'pbrush',
      title: 'Paintbrush - (Untitled)',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 14,
      x: 80,
      y: 35,
      width: 580,
      height: 410,
      icon: '🖌️',
    },
    {
      id: 'calc',
      title: 'Calculator',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 15,
      x: 200,
      y: 80,
      width: 250,
      height: 270,
      icon: '🧮',
    },
    {
      id: 'notepad',
      title: 'Notepad - README.TXT',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 16,
      x: 100,
      y: 50,
      width: 480,
      height: 360,
      icon: '📝',
    },
    {
      id: 'clock',
      title: 'Clock',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 17,
      x: 220,
      y: 60,
      width: 240,
      height: 260,
      icon: '🕒',
    },
    {
      id: 'control',
      title: 'Control Panel',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 18,
      x: 120,
      y: 45,
      width: 460,
      height: 360,
      icon: '🎨',
    },
    {
      id: 'dospr',
      title: 'MS-DOS Prompt',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 19,
      x: 70,
      y: 40,
      width: 540,
      height: 360,
      icon: '📟',
    },
    {
      id: 'mplayer',
      title: 'Media Player - CANYON.MID',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 20,
      x: 150,
      y: 90,
      width: 360,
      height: 180,
      icon: '🎵',
    },
    {
      id: 'ski',
      title: 'SkiFree',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 21,
      x: 160,
      y: 50,
      width: 330,
      height: 400,
      icon: '⛷️',
    },
    {
      id: 'readme',
      title: 'Notepad - README.TXT',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 22,
      x: 110,
      y: 50,
      width: 480,
      height: 360,
      icon: '📖',
    },
  ]);

  const [activeWindowId, setActiveWindowId] = useState<AppId>('progman');
  const [topZ, setTopZ] = useState(30);
  const [clockTime, setClockTime] = useState(new Date());

  // Real-time system clock in taskbar
  useEffect(() => {
    const timer = setInterval(() => setClockTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const bringToFront = (id: AppId) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w))
    );
  };

  const openApp = (id: AppId) => {
    retroAudio.playHddCrunch(200);
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZ }
          : w
      )
    );
  };

  const closeWindow = (id: AppId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
    // Focus next available window
    const openWins = windows.filter((w) => w.id !== id && w.isOpen && !w.isMinimized);
    if (openWins.length > 0) {
      const topOpen = openWins.sort((a, b) => b.zIndex - a.zIndex)[0];
      setActiveWindowId(topOpen.id);
    }
  };

  const minimizeWindow = (id: AppId) => {
    retroAudio.playSwitchClick('button');
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const maximizeWindow = (id: AppId) => {
    retroAudio.playSwitchClick('button');
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const updatePosition = (id: AppId, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, x, y } : w))
    );
  };

  // Essential desktop icons for direct access (as requested)
  const desktopIcons = [
    { id: 'progman' as AppId, title: 'Program Manager', icon: '🪟' },
    { id: 'winfile' as AppId, title: 'File Manager', icon: '📁' },
    { id: 'control' as AppId, title: 'Control Panel', icon: '🎨' },
    { id: 'winmine' as AppId, title: 'Minesweeper', icon: '💣' },
    { id: 'notepad' as AppId, title: 'Notepad', icon: '📝' },
    { id: 'clock' as AppId, title: 'Clock', icon: '🕒' },
  ];

  // Wallpaper pattern class
  const getPatternClass = () => {
    switch (wallpaper) {
      case 'argyle':
        return 'bg-pattern-argyle';
      case 'boxes':
        return 'bg-pattern-boxes';
      case 'castle':
        return 'bg-pattern-castle';
      case 'chess':
        return 'bg-pattern-chess';
      case 'thatched':
        return 'bg-pattern-thatched';
      default:
        return '';
    }
  };

  return (
    <div
      style={{ backgroundColor: theme.desktopBg }}
      className={`w-full h-full relative overflow-hidden flex flex-col justify-between select-none ${getPatternClass()}`}
    >
      {/* Desktop Workspace (contains floating windows and desktop icons) */}
      <div className="flex-1 relative overflow-hidden">
        {/* Desktop Icons column along the left */}
        <div className="absolute top-4 left-3 flex flex-col gap-5 z-0">
          {desktopIcons.map((item) => (
            <div
              key={item.id}
              onDoubleClick={() => openApp(item.id)}
              onClick={() => retroAudio.playMineClick()}
              className="flex flex-col items-center justify-center w-20 cursor-pointer group text-center"
            >
              <div className="text-3xl mb-1 filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[11px] font-bold text-white bg-black/60 px-1 rounded-sm leading-tight group-hover:bg-[#000080] border border-transparent group-hover:border-white/50">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* Windows Rendering */}
        {windows.map((win) => {
          if (!win.isOpen) return null;
          const isActive = activeWindowId === win.id && !win.isMinimized;

          return (
            <WindowFrame
              key={win.id}
              window={win}
              isActive={isActive}
              theme={theme}
              onFocus={() => bringToFront(win.id)}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onMaximize={() => maximizeWindow(win.id)}
              onUpdatePosition={(x, y) => updatePosition(win.id, x, y)}
            >
              {win.id === 'progman' && (
                <ProgramManager
                  onOpenApp={openApp}
                  onExitWindows={onExitToDOS}
                  theme={theme}
                />
              )}
              {win.id === 'winfile' && (
                <FileManager
                  onOpenFile={(appId) => openApp(appId)}
                  insertedFloppyId={insertedFloppyId}
                />
              )}
              {win.id === 'winmine' && <Minesweeper />}
              {win.id === 'sol' && <Solitaire />}
              {win.id === 'pbrush' && <Paintbrush />}
              {win.id === 'calc' && <Calculator />}
              {win.id === 'notepad' && <Notepad />}
              {win.id === 'readme' && <Notepad initialFileName="README.TXT" />}
              {win.id === 'clock' && <Clock />}
              {win.id === 'control' && (
                <ControlPanel
                  currentThemeId={theme.id}
                  onSelectTheme={(tId) => onSelectTheme({ ...theme, id: tId })}
                  currentWallpaper={wallpaper}
                  onSelectWallpaper={onSelectWallpaper}
                />
              )}
              {win.id === 'dospr' && <DOSPrompt onClose={() => closeWindow('dospr')} />}
              {win.id === 'mplayer' && <MediaPlayer />}
              {win.id === 'ski' && <SkiFree />}
            </WindowFrame>
          );
        })}
      </div>

      {/* Taskbar & System Clock Bar (as explicitly requested: "Ensure the taskbar and a system clock are visible") */}
      <div className="h-7 bg-[#c0c0c0] win3-box-raised px-1 py-0.5 flex items-center justify-between shrink-0 z-40 text-black border-t-2 border-white text-xs">
        {/* Left: Quick Start / Program Manager anchor */}
        <div className="flex items-center gap-1 overflow-x-auto flex-1">
          <button
            type="button"
            onClick={() => {
              retroAudio.playSwitchClick('button');
              openApp('progman');
            }}
            className="win3-button px-2.5 py-1 font-bold flex items-center gap-1.5 shrink-0 bg-[#c0c0c0] active:win3-box-sunken"
          >
            <span className="text-sm">🪟</span>
            <span className="font-bold">Windows 3.1</span>
          </button>

          <div className="h-4 w-[1px] bg-gray-400 mx-1 shrink-0" />

          {/* Running Tasks list on taskbar */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {windows
              .filter((w) => w.isOpen)
              .map((w) => {
                const isActive = activeWindowId === w.id && !w.isMinimized;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      retroAudio.playSwitchClick('button');
                      if (w.isMinimized) {
                        bringToFront(w.id);
                      } else if (isActive) {
                        minimizeWindow(w.id);
                      } else {
                        bringToFront(w.id);
                      }
                    }}
                    className={`px-2 py-0.5 text-[11px] truncate max-w-[130px] flex items-center gap-1 shrink-0 ${
                      isActive
                        ? 'win3-box-sunken bg-white font-bold'
                        : 'win3-button bg-[#c0c0c0]'
                    }`}
                    title={w.title}
                  >
                    <span>{w.icon || '🪟'}</span>
                    <span className="truncate">{w.title}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right: Notification Tray & System Clock (as required) */}
        <div className="win3-box-sunken px-2 py-0.5 bg-[#dcdcdc] flex items-center gap-2 shrink-0 font-mono text-[11px] font-bold text-gray-900 ml-2">
          <span
            title="Audio Synthesizer Ready"
            className="cursor-pointer"
            onClick={() => retroAudio.playDing()}
          >
            🔊
          </span>
          <span className="tabular-nums">
            {clockTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
