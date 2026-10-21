import React, { useState, useRef, useEffect } from 'react';
import { ColorTheme, WindowState } from '../../types/win3';
import { retroAudio } from '../../services/audio';

interface WindowFrameProps {
  window: WindowState;
  isActive: boolean;
  theme: ColorTheme;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onUpdateSize?: (w: number, h: number) => void;
  children: React.ReactNode;
  menuBar?: React.ReactNode;
  statusBar?: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  isActive,
  theme,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  onUpdateSize,
  children,
  menuBar,
  statusBar,
}) => {
  const [showCtrlMenu, setShowCtrlMenu] = useState(false);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 });

  // Handle window drag
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    onFocus();
    isDragging.current = true;
    dragStartPos.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: win.x,
      winY: win.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = moveEvent.clientX - dragStartPos.current.mouseX;
      const dy = moveEvent.clientY - dragStartPos.current.mouseY;
      onUpdatePosition(
        Math.max(0, dragStartPos.current.winX + dx),
        Math.max(0, dragStartPos.current.winY + dy)
      );
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Close control menu on click outside
  useEffect(() => {
    if (!showCtrlMenu) return;
    const handleOutsideClick = () => setShowCtrlMenu(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showCtrlMenu]);

  if (win.isMinimized || !win.isOpen) {
    return null;
  }

  const titleBg = isActive ? theme.activeTitleBg : theme.inactiveTitleBg;
  const titleText = isActive ? theme.activeTitleText : theme.inactiveTitleText;

  const style: React.CSSProperties = win.isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: win.zIndex,
      }
    : {
        position: 'absolute',
        top: win.y,
        left: win.x,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  return (
    <div
      style={style}
      onMouseDown={onFocus}
      className="win3-window bg-[#c0c0c0] flex flex-col select-none text-xs font-sans shadow-[3px_3px_0px_rgba(0,0,0,0.5)] border-2 border-t-white border-l-white border-b-black border-r-black"
    >
      {/* 3D Inner Bevel container */}
      <div className="p-[2px] bg-[#c0c0c0] flex flex-col flex-1 overflow-hidden">
        {/* Title Bar */}
        <div
          onMouseDown={handleTitleMouseDown}
          onDoubleClick={onMaximize}
          style={{ backgroundColor: titleBg, color: titleText }}
          className="h-[22px] flex items-center justify-between px-1 cursor-default shrink-0"
        >
          {/* Left: Control Menu Box */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCtrlMenu((prev) => !prev);
              }}
              className="win3-ctrl-box"
              title="Control Menu"
            >
              <div className="win3-ctrl-bar" />
            </button>

            {/* Dropdown Control Menu */}
            {showCtrlMenu && (
              <div
                className="absolute left-0 top-6 w-36 bg-[#c0c0c0] win3-box-raised py-1 z-50 text-black shadow-md font-sans text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  disabled={!win.isMaximized}
                  onClick={() => {
                    onMaximize();
                    setShowCtrlMenu(false);
                  }}
                  className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black flex justify-between"
                >
                  <span><u>R</u>estore</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onMinimize();
                    setShowCtrlMenu(false);
                  }}
                  className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between"
                >
                  <span><u>M</u>inimize</span>
                </button>
                <button
                  type="button"
                  disabled={win.isMaximized}
                  onClick={() => {
                    onMaximize();
                    setShowCtrlMenu(false);
                  }}
                  className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-black flex justify-between"
                >
                  <span>Ma<u>x</u>imize</span>
                </button>
                <div className="border-t border-[#808080] border-b border-white my-1" />
                <button
                  type="button"
                  onClick={() => {
                    retroAudio.playSwitchClick('button');
                    onClose();
                    setShowCtrlMenu(false);
                  }}
                  className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex justify-between"
                >
                  <span><u>C</u>lose</span>
                  <span className="text-[10px] text-gray-500">Alt+F4</span>
                </button>
              </div>
            )}
          </div>

          {/* Window Title */}
          <div className="font-bold tracking-wide px-2 truncate flex-1 text-center select-none text-[12px]">
            {win.title}
          </div>

          {/* Right: Minimize & Maximize/Restore buttons */}
          <div className="flex items-center gap-[2px]">
            {/* Minimize button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="win3-title-btn"
              title="Minimize"
            >
              ▼
            </button>

            {/* Maximize / Restore button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMaximize();
              }}
              className="win3-title-btn"
              title={win.isMaximized ? 'Restore' : 'Maximize'}
            >
              {win.isMaximized ? '▲▼' : '▲'}
            </button>
          </div>
        </div>

        {/* Optional Menu Bar */}
        {menuBar && (
          <div className="bg-[#c0c0c0] border-b border-[#808080] px-1 py-0.5 shrink-0 flex items-center text-[11px]">
            {menuBar}
          </div>
        )}

        {/* Window Client Body with Sunken 3D border */}
        <div className="flex-1 bg-white win3-box-sunken overflow-hidden flex flex-col relative text-black">
          {children}
        </div>

        {/* Optional Status Bar */}
        {statusBar && (
          <div className="mt-0.5 win3-box-sunken px-2 py-0.5 bg-[#c0c0c0] text-[10px] text-gray-800 shrink-0 flex items-center justify-between">
            {statusBar}
          </div>
        )}
      </div>
    </div>
  );
};
