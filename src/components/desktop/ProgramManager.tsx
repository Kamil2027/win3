import React, { useState } from 'react';
import { AppId, ColorTheme } from '../../types/win3';
import { retroAudio } from '../../services/audio';

interface ProgramManagerProps {
  onOpenApp: (appId: AppId) => void;
  onExitWindows: () => void;
  theme: ColorTheme;
}

type GroupId = 'main' | 'accessories' | 'games' | 'applications';

interface GroupInfo {
  id: GroupId;
  name: string;
  isMinimized: boolean;
  isOpen: boolean;
  items: {
    id: AppId;
    name: string;
    icon: string;
  }[];
}

export const ProgramManager: React.FC<ProgramManagerProps> = ({
  onOpenApp,
  onExitWindows,
  theme,
}) => {
  const [activeGroup, setActiveGroup] = useState<GroupId>('main');
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showWindowMenu, setShowWindowMenu] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showRunDialog, setShowRunDialog] = useState(false);
  const [runCommandText, setRunCommandText] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Group windows inside Program Manager
  const [groups, setGroups] = useState<GroupInfo[]>([
    {
      id: 'main',
      name: 'Main',
      isMinimized: false,
      isOpen: true,
      items: [
        { id: 'winfile', name: 'File Manager', icon: '📁' },
        { id: 'control', name: 'Control Panel', icon: '🎨' },
        { id: 'dospr', name: 'MS-DOS Prompt', icon: '📟' },
        { id: 'readme', name: 'Read Me', icon: '📖' },
      ],
    },
    {
      id: 'accessories',
      name: 'Accessories',
      isMinimized: false,
      isOpen: true,
      items: [
        { id: 'notepad', name: 'Notepad', icon: '📝' },
        { id: 'pbrush', name: 'Paintbrush', icon: '🖌️' },
        { id: 'calc', name: 'Calculator', icon: '🧮' },
        { id: 'clock', name: 'Clock', icon: '🕒' },
        { id: 'mplayer', name: 'Media Player', icon: '🎵' },
      ],
    },
    {
      id: 'games',
      name: 'Games',
      isMinimized: false,
      isOpen: true,
      items: [
        { id: 'winmine', name: 'Minesweeper', icon: '💣' },
        { id: 'sol', name: 'Solitaire', icon: '🃏' },
        { id: 'ski', name: 'SkiFree', icon: '⛷️' },
      ],
    },
    {
      id: 'applications',
      name: 'Applications',
      isMinimized: true,
      isOpen: true,
      items: [
        { id: 'dospr', name: 'QBasic', icon: '💾' },
        { id: 'readme', name: 'Word Demo', icon: '📄' },
      ],
    },
  ]);

  const toggleGroupMinimize = (groupId: GroupId) => {
    retroAudio.playSwitchClick('button');
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, isMinimized: !g.isMinimized } : g))
    );
  };

  const handleLaunchApp = (appId: AppId) => {
    retroAudio.playHddCrunch(180);
    onOpenApp(appId);
  };

  const handleRunSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRunDialog(false);
    const cmd = runCommandText.trim().toLowerCase();
    if (cmd.includes('mine') || cmd.includes('winmine')) handleLaunchApp('winmine');
    else if (cmd.includes('sol')) handleLaunchApp('sol');
    else if (cmd.includes('paint') || cmd.includes('pbrush')) handleLaunchApp('pbrush');
    else if (cmd.includes('calc')) handleLaunchApp('calc');
    else if (cmd.includes('note') || cmd.includes('notepad')) handleLaunchApp('notepad');
    else if (cmd.includes('clock')) handleLaunchApp('clock');
    else if (cmd.includes('file') || cmd.includes('winfile')) handleLaunchApp('winfile');
    else if (cmd.includes('control')) handleLaunchApp('control');
    else if (cmd.includes('mplayer')) handleLaunchApp('mplayer');
    else if (cmd.includes('ski')) handleLaunchApp('ski');
    else if (cmd.includes('cmd') || cmd.includes('dos') || cmd.includes('command')) handleLaunchApp('dospr');
    else {
      retroAudio.playDing();
    }
    setRunCommandText('');
  };

  return (
    <div className="flex flex-col h-full bg-white select-none font-sans text-xs relative overflow-hidden">
      {/* Top Menu Bar */}
      <div className="bg-[#c0c0c0] border-b border-[#808080] px-1 py-0.5 flex gap-3 text-[11px] relative shrink-0">
        {/* File Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowFileMenu(!showFileMenu);
              setShowHelpMenu(false);
              setShowWindowMenu(false);
            }}
            className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5"
          >
            <u>F</u>ile
          </button>
          {showFileMenu && (
            <div className="absolute left-0 top-5 w-44 bg-[#c0c0c0] win3-box-raised py-1 z-40 shadow-md">
              <button
                type="button"
                onClick={() => {
                  setShowRunDialog(true);
                  setShowFileMenu(false);
                }}
                className="w-full text-left px-3 py-0.5 hover:bg-[#000080] hover:text-white"
              >
                <u>R</u>un...
              </button>
              <div className="border-t border-[#808080] my-1" />
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(true);
                  setShowFileMenu(false);
                }}
                className="w-full text-left px-3 py-0.5 hover:bg-[#000080] hover:text-white font-bold"
              >
                E<u>x</u>it Windows...
              </button>
            </div>
          )}
        </div>

        {/* Options Menu */}
        <button
          type="button"
          onClick={() => retroAudio.playSwitchClick('button')}
          className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5"
        >
          <u>O</u>ptions
        </button>

        {/* Window Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowWindowMenu(!showWindowMenu);
              setShowFileMenu(false);
              setShowHelpMenu(false);
            }}
            className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5"
          >
            <u>W</u>indow
          </button>
          {showWindowMenu && (
            <div className="absolute left-0 top-5 w-36 bg-[#c0c0c0] win3-box-raised py-1 z-40 shadow-md">
              {groups.map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() => {
                    setActiveGroup(g.id);
                    setGroups((prev) =>
                      prev.map((item) => (item.id === g.id ? { ...item, isMinimized: false } : item))
                    );
                    setShowWindowMenu(false);
                  }}
                  className="w-full text-left px-3 py-0.5 hover:bg-[#000080] hover:text-white flex justify-between"
                >
                  <span>{g.name}</span>
                  {activeGroup === g.id && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowHelpMenu(!showHelpMenu);
              setShowFileMenu(false);
              setShowWindowMenu(false);
            }}
            className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5"
          >
            <u>H</u>elp
          </button>
          {showHelpMenu && (
            <div className="absolute left-0 top-5 w-48 bg-[#c0c0c0] win3-box-raised py-1 z-40 shadow-md">
              <button
                type="button"
                onClick={() => {
                  setShowAboutDialog(true);
                  setShowHelpMenu(false);
                  retroAudio.playSwitchClick('button');
                }}
                className="w-full text-left px-3 py-0.5 hover:bg-[#000080] hover:text-white font-bold"
              >
                <u>A</u>bout Program Manager...
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Program Manager Workspace (MDI Child container) */}
      <div className="flex-1 bg-white p-2 relative overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
          {groups
            .filter((g) => !g.isMinimized)
            .map((group) => {
              const isGroupActive = activeGroup === group.id;
              return (
                <div
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`win3-box-sunken p-1 bg-[#c0c0c0] flex flex-col min-h-[160px] ${
                    isGroupActive ? 'ring-1 ring-black' : ''
                  }`}
                >
                  {/* Sub-window title */}
                  <div
                    style={{
                      backgroundColor: isGroupActive ? theme.activeTitleBg : theme.inactiveTitleBg,
                      color: isGroupActive ? theme.activeTitleText : theme.inactiveTitleText,
                    }}
                    className="px-2 py-0.5 flex justify-between items-center text-[11px] font-bold"
                  >
                    <span>{group.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGroupMinimize(group.id);
                      }}
                      className="win3-title-btn w-4 h-4 text-[8px]"
                      title="Minimize Group"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Program Icons Grid */}
                  <div className="flex-1 bg-white p-2 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto">
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        onDoubleClick={() => handleLaunchApp(item.id)}
                        onClick={() => retroAudio.playMineClick()}
                        className="flex flex-col items-center justify-center p-1.5 cursor-pointer hover:bg-[#000080]/10 rounded group select-none text-center"
                      >
                        <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <span className="text-[11px] font-medium text-black leading-tight group-hover:bg-[#000080] group-hover:text-white px-1">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Minimized Group Icons Dox at Bottom */}
        <div className="absolute bottom-2 left-2 flex gap-4 z-20">
          {groups
            .filter((g) => g.isMinimized)
            .map((group) => (
              <div
                key={group.id}
                onDoubleClick={() => toggleGroupMinimize(group.id)}
                onClick={() => retroAudio.playSwitchClick('button')}
                className="flex flex-col items-center cursor-pointer p-1 bg-white/70 hover:bg-white win3-box-raised border border-black/50"
              >
                <div className="text-2xl">📦</div>
                <span className="text-[10px] font-bold text-black px-1">{group.name}</span>
              </div>
            ))}
        </div>
      </div>

      {/* About Program Manager Dialog Modal */}
      {showAboutDialog && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="w-80 bg-[#c0c0c0] win3-box-raised p-4 border border-black text-black">
            <div className="flex items-start gap-3 border-b border-gray-400 pb-3 mb-3">
              <div className="text-4xl">🪟</div>
              <div>
                <h3 className="font-bold text-sm">Microsoft Windows</h3>
                <p className="text-[11px] text-gray-700">Version 3.10 (386 Enhanced Mode)</p>
                <p className="text-[10px] text-gray-600 mt-1">
                  Copyright &copy; 1985-1992 Microsoft Corp.
                </p>
              </div>
            </div>

            <div className="space-y-1 text-[11px] bg-white win3-box-sunken p-2 font-mono mb-3">
              <div>Memory: 12,756 KB Free</div>
              <div>System Resources: 84% Free</div>
              <div>Display: 640x480 16 Colors</div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowAboutDialog(false)}
                className="win3-button px-6 py-1 font-bold"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Run Dialog Modal */}
      {showRunDialog && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleRunSubmit}
            className="w-80 bg-[#c0c0c0] win3-box-raised p-4 border border-black text-black"
          >
            <div className="font-bold text-sm mb-2">Run Application</div>
            <div className="text-xs mb-2">
              Type the name of a program, folder, or document to open:
            </div>
            <input
              type="text"
              value={runCommandText}
              onChange={(e) => setRunCommandText(e.target.value)}
              placeholder="e.g. WINMINE, SOL, NOTEPAD, CALC"
              className="w-full win3-box-sunken p-1 text-xs font-mono mb-4 bg-white outline-none"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="win3-button px-4 py-1 font-bold"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setShowRunDialog(false)}
                className="win3-button px-4 py-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exit Windows Confirmation Modal */}
      {showExitConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-80 bg-[#c0c0c0] win3-box-raised p-4 border border-black text-black">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">⚠️</div>
              <div>
                <h3 className="font-bold text-sm">Exit Windows</h3>
                <p className="text-xs text-gray-800">This will end your Windows session.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  retroAudio.playWindowsShutdown();
                  onExitWindows();
                }}
                className="win3-button px-4 py-1 font-bold"
              >
                OK
              </button>
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="win3-button px-4 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
