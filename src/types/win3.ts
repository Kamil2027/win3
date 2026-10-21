/**
 * Types for Windows 3.1 PC Simulator
 */

export type BootStage =
  | 'OFF'
  | 'BIOS_POST'
  | 'DOS_BOOT'
  | 'WIN_LOADING'
  | 'DESKTOP'
  | 'DOS_EXITED';

export type AppId =
  | 'progman'
  | 'winmine'
  | 'sol'
  | 'pbrush'
  | 'calc'
  | 'notepad'
  | 'clock'
  | 'winfile'
  | 'control'
  | 'dospr'
  | 'mplayer'
  | 'ski'
  | 'readme';

export interface WindowState {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  icon?: string;
}

export type ColorThemeId =
  | 'default'
  | 'hotdog'
  | 'ocean'
  | 'desert'
  | 'emerald'
  | 'bordeaux'
  | 'monochrome';

export interface ColorTheme {
  id: ColorThemeId;
  name: string;
  desktopBg: string;
  windowBg: string;
  windowText: string;
  activeTitleBg: string;
  activeTitleText: string;
  inactiveTitleBg: string;
  inactiveTitleText: string;
  buttonFace: string;
  buttonText: string;
  highlightBg: string;
  highlightText: string;
}

export type WallpaperPattern = 'teal' | 'argyle' | 'boxes' | 'castle' | 'chess' | 'thatched';

export interface FloppyDisk {
  id: string;
  label: string;
  subtitle: string;
  color: string;
  files: { name: string; size: number; content: string }[];
}

export interface VirtualFile {
  name: string;
  extension: string;
  size: number;
  date: string;
  time: string;
  content: string;
  isDir?: boolean;
  children?: VirtualFile[];
}
