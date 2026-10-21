import { useState, useCallback } from 'react';
import { BootStage, ColorTheme, WallpaperPattern } from './types/win3';
import { colorThemes } from './services/themes';
import { retroAudio } from './services/audio';
import { CRTMonitor } from './components/hardware/CRTMonitor';
import { PCCase } from './components/hardware/PCCase';
import { BIOSPost } from './components/boot/BIOSPost';
import { DOSBoot } from './components/boot/DOSBoot';
import { WindowsLoadingScreen } from './components/boot/WindowsLoadingScreen';
import { DOSExited } from './components/boot/DOSExited';
import { Desktop } from './components/desktop/Desktop';

export default function App() {
  const [bootStage, setBootStage] = useState<BootStage>('OFF');
  const [turbo, setTurbo] = useState(true);
  const [hddLed, setHddLed] = useState(false);
  const [floppyLed, setFloppyLed] = useState(false);
  const [scanlines, setScanlines] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.6);
  const [theme, setTheme] = useState<ColorTheme>(colorThemes.default);
  const [wallpaper, setWallpaper] = useState<WallpaperPattern>('teal');
  const [insertedFloppyId, setInsertedFloppyId] = useState<string | null>(null);
  const [roomLighting, setRoomLighting] = useState<'dark' | 'office'>('dark');

  // Trigger Power Toggle
  const handlePowerToggle = useCallback(() => {
    retroAudio.playSwitchClick('power');
    setBootStage((prev) => {
      if (prev === 'OFF') {
        return 'BIOS_POST';
      } else {
        setHddLed(false);
        setFloppyLed(false);
        return 'OFF';
      }
    });
  }, []);

  // Reset PC (Warm reboot)
  const handleReset = useCallback(() => {
    retroAudio.playSwitchClick('button');
    setBootStage((prev) => (prev !== 'OFF' ? 'BIOS_POST' : 'OFF'));
  }, []);

  // Callbacks for stage transitions
  const handlePostComplete = useCallback(() => setBootStage('DOS_BOOT'), []);
  const handleBootToWindows = useCallback(() => setBootStage('WIN_LOADING'), []);
  const handleLoadingComplete = useCallback(() => setBootStage('DESKTOP'), []);
  const handleExitToDOS = useCallback(() => setBootStage('DOS_EXITED'), []);
  const triggerHdd = useCallback((active: boolean) => setHddLed(active), []);

  // Turbo Toggle
  const handleToggleTurbo = useCallback(() => {
    retroAudio.playSwitchClick('button');
    setTurbo((prev) => !prev);
  }, []);

  // Update volume
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    retroAudio.setVolume(newVol);
    if (!soundEnabled && newVol > 0) {
      setSoundEnabled(true);
      retroAudio.enabled = true;
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    retroAudio.enabled = next;
    if (next) retroAudio.playDing();
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 flex flex-col items-center justify-between p-2 sm:p-4 select-none overflow-y-auto ${
        roomLighting === 'dark'
          ? 'bg-[#101214] text-gray-200'
          : 'bg-[#d8d2c4] text-gray-900'
      }`}
    >
      {/* Top Ambience & Quick Controls Bar */}
      <header className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪟</span>
            <span className="font-bold tracking-wider uppercase font-mono text-sm text-yellow-400">
              Windows 3.1 PC Simulator
            </span>
          </div>
          <span className="hidden sm:inline text-gray-400">&bull;</span>
          <span className="hidden sm:inline text-gray-300">
            Intel 486DX2 66MHz &bull; 16MB RAM &bull; Sound Blaster 16
          </span>
        </div>

        {/* Ambient environment controls */}
        <div className="flex items-center gap-3">
          {/* Sound Mute & Volume */}
          <div className="flex items-center gap-2 bg-black/30 px-2.5 py-1 rounded border border-white/10">
            <button
              type="button"
              onClick={handleToggleSound}
              className="hover:scale-110 transition-transform"
              title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1.5 accent-yellow-400 cursor-pointer"
              title="System Volume"
            />
          </div>

          {/* Room Lighting Toggle */}
          <button
            type="button"
            onClick={() => setRoomLighting(roomLighting === 'dark' ? 'office' : 'dark')}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded border border-white/10 flex items-center gap-1.5 transition-colors"
            title="Toggle Room Lighting"
          >
            <span>{roomLighting === 'dark' ? '🌙 Night Den' : '☀️ Day Office'}</span>
          </button>

          {/* Quick Boot Helper if off */}
          {bootStage === 'OFF' && (
            <button
              type="button"
              onClick={handlePowerToggle}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded shadow flex items-center gap-1.5 animate-pulse"
            >
              <span>⚡ Boot PC</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Workstation: CRT Monitor + Desktop PC Case */}
      <main className="w-full max-w-5xl my-3 flex flex-col gap-4 items-center">
        {/* CRT Monitor Unit */}
        <div className="w-full max-w-4xl">
          <CRTMonitor
            bootStage={bootStage}
            scanlinesEnabled={scanlines}
            onToggleScanlines={() => setScanlines(!scanlines)}
          >
            {/* Screen Content State Machine */}
            {bootStage === 'BIOS_POST' && (
              <BIOSPost
                turbo={turbo}
                onPostComplete={handlePostComplete}
                triggerHddLed={triggerHdd}
              />
            )}

            {bootStage === 'DOS_BOOT' && (
              <DOSBoot
                onBootToWindows={handleBootToWindows}
                triggerHddLed={triggerHdd}
              />
            )}

            {bootStage === 'WIN_LOADING' && (
              <WindowsLoadingScreen
                onLoadingComplete={handleLoadingComplete}
                triggerHddLed={triggerHdd}
              />
            )}

            {bootStage === 'DESKTOP' && (
              <Desktop
                theme={theme}
                wallpaper={wallpaper}
                onSelectTheme={(newTheme) => setTheme(newTheme)}
                onSelectWallpaper={(newPattern) => setWallpaper(newPattern)}
                onExitToDOS={handleExitToDOS}
                insertedFloppyId={insertedFloppyId}
              />
            )}

            {bootStage === 'DOS_EXITED' && (
              <DOSExited
                onRestartWindows={handleBootToWindows}
              />
            )}
          </CRTMonitor>
        </div>

        {/* Physical PC Case (Below screen, containing the virtual Power button outside the screen!) */}
        <div className="w-full max-w-4xl">
          <PCCase
            bootStage={bootStage}
            onPowerToggle={handlePowerToggle}
            onReset={handleReset}
            turbo={turbo}
            onToggleTurbo={handleToggleTurbo}
            hddLed={hddLed}
            floppyLed={floppyLed}
            insertedFloppyId={insertedFloppyId}
            onInsertFloppy={(id) => {
              setInsertedFloppyId(id);
              if (id) {
                setFloppyLed(true);
                setTimeout(() => setFloppyLed(false), 600);
              }
            }}
          />
        </div>
      </main>

      {/* Footer Instructions and Hardware Specifications */}
      <footer className="w-full max-w-5xl text-center text-xs text-gray-500 py-2 border-t border-white/5 flex flex-wrap justify-between items-center gap-2">
        <div>
          Windows 3.1 &bull; Program Manager &bull; File Manager &bull; Minesweeper &bull; Solitaire &bull; Paintbrush &bull; Calculator
        </div>
        <div className="font-mono">
          Current State: <span className="text-yellow-400 font-bold">{bootStage}</span>
        </div>
      </footer>
    </div>
  );
}
