import React, { useState } from 'react';
import { initialFileSystem, availableFloppies } from '../../services/fileSystem';
import { VirtualFile, AppId } from '../../types/win3';
import { retroAudio } from '../../services/audio';

interface FileManagerProps {
  onOpenFile: (appId: AppId, fileName?: string, content?: string) => void;
  insertedFloppyId: string | null;
}

export const FileManager: React.FC<FileManagerProps> = ({ onOpenFile, insertedFloppyId }) => {
  const [activeDrive, setActiveDrive] = useState<'C' | 'A'>('C');
  const [selectedDir, setSelectedDir] = useState<string>('WINDOWS');
  const [selectedFile, setSelectedFile] = useState<VirtualFile | null>(null);

  // Current folder files
  let currentFiles: VirtualFile[] = [];

  if (activeDrive === 'C') {
    if (selectedDir === 'C') {
      currentFiles = initialFileSystem;
    } else {
      const folder = initialFileSystem.find((f) => f.name === selectedDir && f.isDir);
      currentFiles = folder?.children || [];
    }
  } else {
    // Drive A: floppy
    const floppy = availableFloppies.find((f) => f.id === insertedFloppyId);
    if (floppy) {
      currentFiles = floppy.files.map((file) => {
        const parts = file.name.split('.');
        return {
          name: parts[0],
          extension: parts[1] || '',
          size: file.size,
          date: '04-06-92',
          time: '3:10a',
          content: file.content,
        };
      });
    } else {
      currentFiles = [];
    }
  }

  const handleDriveChange = (drive: 'C' | 'A') => {
    retroAudio.playSwitchClick('button');
    if (drive === 'A') {
      retroAudio.playFloppySeek();
    } else {
      retroAudio.playHddCrunch(150);
    }
    setActiveDrive(drive);
    setSelectedFile(null);
  };

  const handleItemDoubleClick = (file: VirtualFile) => {
    retroAudio.playHddCrunch(200);

    if (file.isDir) {
      setSelectedDir(file.name);
      return;
    }

    const ext = file.extension.toUpperCase();
    const fullName = `${file.name}.${file.extension}`;

    if (ext === 'EXE' || ext === 'COM') {
      if (file.name === 'WINMINE') onOpenFile('winmine');
      else if (file.name === 'SOL') onOpenFile('sol');
      else if (file.name === 'PBRUSH') onOpenFile('pbrush');
      else if (file.name === 'CALC') onOpenFile('calc');
      else if (file.name === 'NOTEPAD') onOpenFile('notepad');
      else if (file.name === 'CLOCK') onOpenFile('clock');
      else if (file.name === 'CONTROL') onOpenFile('control');
      else if (file.name === 'MPLAYER') onOpenFile('mplayer');
      else if (file.name === 'SKI') onOpenFile('ski');
      else if (file.name === 'COMMAND') onOpenFile('dospr');
      else {
        onOpenFile('notepad', fullName, file.content);
      }
    } else if (ext === 'TXT' || ext === 'INI' || ext === 'BAT' || ext === 'SYS') {
      onOpenFile('notepad', fullName, file.content);
    } else if (ext === 'BMP') {
      onOpenFile('pbrush');
    } else if (ext === 'MID' || ext === 'WAV') {
      onOpenFile('mplayer');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs select-none">
      {/* Drive Bar */}
      <div className="flex items-center gap-2 p-1 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="font-bold text-gray-700">Drives:</span>
        <button
          type="button"
          onClick={() => handleDriveChange('A')}
          className={`px-2 py-0.5 win3-button flex items-center gap-1 ${
            activeDrive === 'A' ? 'bg-white font-bold win3-box-sunken' : ''
          }`}
        >
          <span>💾</span>
          <span>[-a-]</span>
        </button>
        <button
          type="button"
          onClick={() => handleDriveChange('C')}
          className={`px-2 py-0.5 win3-button flex items-center gap-1 ${
            activeDrive === 'C' ? 'bg-white font-bold win3-box-sunken' : ''
          }`}
        >
          <span>💽</span>
          <span>[-c-]</span>
        </button>
        <span className="text-gray-600 ml-4 font-mono">
          {activeDrive === 'C' ? `C:\\${selectedDir === 'C' ? '' : selectedDir}` : 'A:\\ (Floppy Drive)'}
        </span>
      </div>

      {/* Split Directory Tree & File List */}
      <div className="flex flex-1 overflow-hidden p-1 gap-1">
        {/* Left Pane: Directory Tree */}
        <div className="w-40 bg-white win3-box-sunken p-1 overflow-y-auto">
          <div className="font-bold text-blue-900 mb-1 flex items-center gap-1">
            <span>📁</span>
            <span>{activeDrive}:\\</span>
          </div>
          {activeDrive === 'C' ? (
            <div className="pl-4 space-y-1">
              <div
                onClick={() => {
                  setSelectedDir('C');
                  retroAudio.playMineClick();
                }}
                className={`cursor-pointer px-1 flex items-center gap-1 ${
                  selectedDir === 'C' ? 'bg-[#000080] text-white' : 'hover:bg-gray-200'
                }`}
              >
                <span>📂</span>
                <span>[.. Root]</span>
              </div>
              {initialFileSystem
                .filter((f) => f.isDir)
                .map((dir) => (
                  <div
                    key={dir.name}
                    onClick={() => {
                      setSelectedDir(dir.name);
                      retroAudio.playMineClick();
                    }}
                    className={`cursor-pointer px-1 flex items-center gap-1 ${
                      selectedDir === dir.name ? 'bg-[#000080] text-white' : 'hover:bg-gray-200'
                    }`}
                  >
                    <span>📁</span>
                    <span>{dir.name}</span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="pl-4 text-gray-500 italic">
              {insertedFloppyId ? 'Floppy Root Directory' : 'No Disk in Drive A:'}
            </div>
          )}
        </div>

        {/* Right Pane: Files Table */}
        <div className="flex-1 bg-white win3-box-sunken overflow-y-auto p-1 font-mono text-xs">
          {currentFiles.length === 0 ? (
            <div className="p-4 text-center text-gray-500 italic font-sans">
              {activeDrive === 'A' && !insertedFloppyId
                ? 'Insert a floppy disk from the PC chassis to view Drive A:'
                : 'No files found in directory.'}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-400 text-gray-600 font-sans text-[11px]">
                  <th className="p-1">Name</th>
                  <th className="p-1 text-right">Size</th>
                  <th className="p-1 text-right">Date</th>
                  <th className="p-1 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {currentFiles.map((file) => {
                  const isSelected = selectedFile?.name === file.name;
                  const fullName = file.extension ? `${file.name}.${file.extension}` : file.name;
                  const isExe = file.extension === 'EXE' || file.extension === 'COM';

                  return (
                    <tr
                      key={file.name}
                      onClick={() => setSelectedFile(file)}
                      onDoubleClick={() => handleItemDoubleClick(file)}
                      className={`cursor-pointer ${
                        isSelected
                          ? 'bg-[#000080] text-white'
                          : 'hover:bg-gray-100 text-black'
                      }`}
                    >
                      <td className="p-1 flex items-center gap-1">
                        <span>{file.isDir ? '📁' : isExe ? '⚙️' : '📄'}</span>
                        <span className="font-semibold">{fullName}</span>
                      </td>
                      <td className="p-1 text-right tabular-nums">
                        {file.isDir ? '<DIR>' : `${file.size.toLocaleString()} B`}
                      </td>
                      <td className="p-1 text-right tabular-nums">{file.date}</td>
                      <td className="p-1 text-right tabular-nums">{file.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#c0c0c0] border-t border-[#808080] px-2 py-0.5 text-[10px] text-gray-800 flex justify-between">
        <span>{currentFiles.length} file(s) found</span>
        <span className="font-mono">524,288 KB free &middot; 540,000 KB total</span>
      </div>
    </div>
  );
};
