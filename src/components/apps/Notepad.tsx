import React, { useState } from 'react';
import { retroAudio } from '../../services/audio';

interface NotepadProps {
  initialContent?: string;
  initialFileName?: string;
  onSaveFile?: (name: string, content: string) => void;
}

export const Notepad: React.FC<NotepadProps> = ({
  initialContent = `Welcome to Notepad.
Type any notes here.

Press F5 or click Edit -> Time/Date to insert current timestamp.
Click File -> Save to download or store your text.`,
  initialFileName = 'UNTITLED.TXT',
  onSaveFile,
}) => {
  const [content, setContent] = useState(initialContent);
  const [fileName, setFileName] = useState(initialFileName);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);

  const insertTimestamp = () => {
    const now = new Date();
    const timeStr = `${now.toLocaleTimeString()} ${now.toLocaleDateString()}\n`;
    setContent((prev) => prev + '\n' + timeStr);
    retroAudio.playSwitchClick('button');
  };

  const handleSave = () => {
    retroAudio.playHddCrunch(200);
    if (onSaveFile) {
      onSaveFile(fileName, content);
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    setShowFileMenu(false);
  };

  const handleNew = () => {
    setContent('');
    setFileName('UNTITLED.TXT');
    setShowFileMenu(false);
    retroAudio.playSwitchClick('button');
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans text-xs select-none">
      {/* Menu Bar */}
      <div className="bg-[#c0c0c0] border-b border-[#808080] px-1 py-0.5 flex gap-3 text-[11px] relative">
        {/* File Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowFileMenu(!showFileMenu);
              setShowEditMenu(false);
            }}
            className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5"
          >
            <u>F</u>ile
          </button>
          {showFileMenu && (
            <div className="absolute left-0 top-5 w-32 bg-[#c0c0c0] win3-box-raised py-1 z-30 shadow-md">
              <button
                type="button"
                onClick={handleNew}
                className="w-full text-left px-3 py-0.5 hover:bg-[#000080] hover:text-white"
              >
                <u>N</u>ew
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-full text-left px-3 py-0.5 hover:bg-[#000080] hover:text-white"
              >
                <u>S</u>ave
              </button>
              <div className="border-t border-[#808080] my-1" />
              <button
                type="button"
                onClick={() => setShowFileMenu(false)}
                className="w-full text-left px-3 py-0.5 hover:bg-[#000080] hover:text-white"
              >
                E<u>x</u>it
              </button>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowEditMenu(!showEditMenu);
              setShowFileMenu(false);
            }}
            className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5"
          >
            <u>E</u>dit
          </button>
          {showEditMenu && (
            <div className="absolute left-0 top-5 w-36 bg-[#c0c0c0] win3-box-raised py-1 z-30 shadow-md">
              <button
                type="button"
                onClick={() => {
                  insertTimestamp();
                  setShowEditMenu(false);
                }}
                className="w-full text-left px-3 py-0.5 hover:bg-[#000080] hover:text-white flex justify-between"
              >
                <span><u>T</u>ime/Date</span>
                <span className="text-[10px] text-gray-500">F5</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setContent('');
                  setShowEditMenu(false);
                }}
                className="w-full text-left px-3 py-0.5 hover:bg-[#000080] hover:text-white"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editor text area */}
      <div className="flex-1 p-1 bg-white overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full p-2 outline-none resize-none font-mono text-xs leading-relaxed text-black bg-white"
          spellCheck={false}
          placeholder="Type text here..."
        />
      </div>

      {/* Bottom Status strip */}
      <div className="bg-[#c0c0c0] border-t border-[#808080] px-2 py-0.5 text-[10px] text-gray-700 flex justify-between">
        <span>File: {fileName}</span>
        <span>{content.length} characters</span>
      </div>
    </div>
  );
};
