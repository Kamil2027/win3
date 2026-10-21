import React, { useState, useRef, useEffect } from 'react';
import { initialFileSystem } from '../../services/fileSystem';
import { retroAudio } from '../../services/audio';

interface DOSPromptProps {
  onClose: () => void;
}

export const DOSPrompt: React.FC<DOSPromptProps> = ({ onClose }) => {
  const [history, setHistory] = useState<string[]>([
    'Microsoft(R) MS-DOS(R) Version 6.22',
    '             (C)Copyright Microsoft Corp 1981-1994.',
    '',
    'Type HELP for available commands, or EXIT to return to Windows.',
    '',
  ]);
  const [inputVal, setInputVal] = useState('');
  const [currentPath, setCurrentPath] = useState('C:\\WINDOWS');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    const cmdLower = cmd.toLowerCase();
    const promptLine = `${currentPath}> ${cmd}`;

    retroAudio.playMineClick();

    if (!cmd) {
      setHistory((prev) => [...prev, promptLine]);
      setInputVal('');
      return;
    }

    const parts = cmdLower.split(' ');
    const command = parts[0];
    const arg = parts.slice(1).join(' ');

    let responses: string[] = [];

    switch (command) {
      case 'cls':
        setHistory([]);
        setInputVal('');
        return;

      case 'ver':
        responses = ['MS-DOS Version 6.22'];
        break;

      case 'date':
        responses = [`Current date is: ${new Date().toLocaleDateString()}`];
        break;

      case 'time':
        responses = [`Current time is: ${new Date().toLocaleTimeString()}`];
        break;

      case 'exit':
        onClose();
        return;

      case 'help':
        responses = [
          'Supported MS-DOS Commands:',
          '  DIR [/W]       List files in current directory',
          '  CD <DIR>       Change directory (e.g. CD \\, CD DOS)',
          '  TYPE <FILE>    Display contents of text file',
          '  MEM            Display system memory statistics',
          '  VER            Show MS-DOS version',
          '  DATE / TIME    Show system date and time',
          '  CLS            Clear terminal screen',
          '  EXIT           Exit MS-DOS Prompt and return to Windows',
        ];
        break;

      case 'mem':
        responses = [
          'Memory Type        Total       Used       Free',
          '----------------  ---------  ---------  ---------',
          'Conventional         640K        68K       572K',
          'Upper                 96K        32K        64K',
          'Reserved             384K       384K         0K',
          'Extended (XMS)    15,360K     3,240K    12,120K',
          '----------------  ---------  ---------  ---------',
          'Total memory      16,480K     3,724K    12,756K',
          '',
          'Largest executable program size:       571K (584,704 bytes)',
          'Largest free upper memory block:        64K (65,536 bytes)',
          'MS-DOS is resident in the high memory area.',
        ];
        break;

      case 'dir':
        retroAudio.playHddCrunch(250);
        responses = [
          ' Volume in drive C has no label',
          ' Volume Serial Number is 1F24-4B39',
          ` Directory of ${currentPath}`,
          '',
        ];

        if (currentPath === 'C:\\WINDOWS') {
          const winFolder = initialFileSystem.find((f) => f.name === 'WINDOWS');
          winFolder?.children?.forEach((f) => {
            const ext = (f.extension || '').padEnd(3, ' ');
            const name = f.name.padEnd(8, ' ');
            const size = f.isDir ? '<DIR>     ' : String(f.size).padStart(10, ' ');
            responses.push(`${name} ${ext}  ${size}  ${f.date}  ${f.time}`);
          });
          responses.push('', `        ${winFolder?.children?.length || 0} file(s)   2,185,420 bytes`);
        } else {
          initialFileSystem.forEach((f) => {
            const ext = (f.extension || '').padEnd(3, ' ');
            const name = f.name.padEnd(8, ' ');
            const size = f.isDir ? '<DIR>     ' : String(f.size).padStart(10, ' ');
            responses.push(`${name} ${ext}  ${size}  ${f.date}  ${f.time}`);
          });
          responses.push('', `        ${initialFileSystem.length} file(s)   5,820,128 bytes`);
        }
        responses.push('                   524,288,000 bytes free');
        break;

      case 'cd':
        if (!arg || arg === '\\' || arg === 'c:\\') {
          setCurrentPath('C:\\');
        } else if (arg === 'windows' || arg === 'c:\\windows') {
          setCurrentPath('C:\\WINDOWS');
        } else if (arg === 'dos' || arg === 'c:\\dos') {
          setCurrentPath('C:\\DOS');
        } else if (arg === 'games' || arg === 'c:\\games') {
          setCurrentPath('C:\\GAMES');
        } else if (arg === '..') {
          setCurrentPath('C:\\');
        } else {
          responses = [`Invalid directory: ${arg}`];
        }
        break;

      case 'type':
        if (!arg) {
          responses = ['Required parameter missing: filename'];
        } else if (arg.includes('readme')) {
          responses = [
            'Microsoft Windows 3.1 README.TXT:',
            'Thank you for running Microsoft Windows 3.1.',
            'Enjoy full multitasking, TrueType fonts, and classic games!',
          ];
        } else if (arg.includes('autoexec')) {
          responses = [
            '@ECHO OFF',
            'PROMPT $P$G',
            'PATH C:\\WINDOWS;C:\\DOS;C:\\GAMES',
            'C:\\DOS\\SMARTDRV.EXE',
            'C:\\WINDOWS\\WIN.COM',
          ];
        } else {
          responses = [`File not found - ${arg.toUpperCase()}`];
        }
        break;

      case 'win':
        responses = ['Windows is already running. Type EXIT to return to the desktop.'];
        break;

      case 'format':
        responses = [
          'WARNING, ALL DATA ON NON-REMOVABLE DISK',
          'DRIVE C: WILL BE LOST!',
          'Are you sure? Just kidding, format canceled by safe protection guard.',
        ];
        break;

      default:
        responses = [`Bad command or file name: ${command}`];
        break;
    }

    setHistory((prev) => [...prev, promptLine, ...responses]);
    setInputVal('');
  };

  return (
    <div
      onClick={() => {
        const input = document.getElementById('dos-input');
        input?.focus();
      }}
      className="flex-1 bg-black text-[#55ff55] font-dos text-base p-2 overflow-y-auto flex flex-col justify-between select-text"
    >
      <div>
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap leading-tight">
            {line}
          </div>
        ))}
        {/* Active command line */}
        <form onSubmit={handleCommand} className="flex items-center gap-1 mt-1">
          <span className="text-[#55ff55] whitespace-nowrap">{currentPath}&gt;</span>
          <input
            id="dos-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent text-[#ffffff] font-dos text-base outline-none border-none p-0"
            autoFocus
            spellCheck={false}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
