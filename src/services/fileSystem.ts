import { VirtualFile } from '../types/win3';

export const initialFileSystem: VirtualFile[] = [
  {
    name: 'WINDOWS',
    extension: '',
    size: 0,
    date: '04-06-92',
    time: '3:10a',
    content: '',
    isDir: true,
    children: [
      {
        name: 'WIN',
        extension: 'COM',
        size: 4256,
        date: '04-06-92',
        time: '3:10a',
        content: 'Binary executable for Windows 3.1 Kernel Loader',
      },
      {
        name: 'PROGMAN',
        extension: 'EXE',
        size: 115344,
        date: '04-06-92',
        time: '3:10a',
        content: 'Program Manager 3.10 executable',
      },
      {
        name: 'WINFILE',
        extension: 'EXE',
        size: 146864,
        date: '04-06-92',
        time: '3:10a',
        content: 'File Manager executable',
      },
      {
        name: 'CONTROL',
        extension: 'EXE',
        size: 15872,
        date: '04-06-92',
        time: '3:10a',
        content: 'Control Panel executable',
      },
      {
        name: 'NOTEPAD',
        extension: 'EXE',
        size: 32736,
        date: '04-06-92',
        time: '3:10a',
        content: 'Notepad text editor',
      },
      {
        name: 'PBRUSH',
        extension: 'EXE',
        size: 183248,
        date: '04-06-92',
        time: '3:10a',
        content: 'Paintbrush graphic editor',
      },
      {
        name: 'CALC',
        extension: 'EXE',
        size: 43072,
        date: '04-06-92',
        time: '3:10a',
        content: 'Calculator executable',
      },
      {
        name: 'CLOCK',
        extension: 'EXE',
        size: 16416,
        date: '04-06-92',
        time: '3:10a',
        content: 'Analog and digital desktop clock',
      },
      {
        name: 'WINMINE',
        extension: 'EXE',
        size: 27952,
        date: '04-06-92',
        time: '3:10a',
        content: 'Minesweeper puzzle game',
      },
      {
        name: 'SOL',
        extension: 'EXE',
        size: 180688,
        date: '04-06-92',
        time: '3:10a',
        content: 'Klondike Solitaire card game',
      },
      {
        name: 'MPLAYER',
        extension: 'EXE',
        size: 33312,
        date: '04-06-92',
        time: '3:10a',
        content: 'Media Player (WAV/MIDI)',
      },
      {
        name: 'SYSTEM',
        extension: 'INI',
        size: 1840,
        date: '04-06-92',
        time: '3:10a',
        content: `[boot]
shell=progman.exe
mouse.drv=mouse.drv
network.drv=
language.dll=
sound.drv=mmsound.drv
comm.drv=comm.drv
keyboard.drv=keyboard.drv
system.drv=system.drv
386grabber=vga.3gr
oemfonts.fon=vgaoem.fon
286grabber=vgacolor.2gr
fixedfon.fon=vgafix.fon
fonts.fon=vgasys.fon
display.drv=vga.drv

[386Enh]
mouse=*vmd
network=*dosnet
ebios=*ebios
woafont=dosapp.fon
device=vshare.386
device=*vpicd
device=*vtd
device=*vdmad
device=*vsd
MinSPs=4
PageBuffers=32
ConservativeSwapfileUsage=1
`,
      },
      {
        name: 'WIN',
        extension: 'INI',
        size: 4620,
        date: '04-06-92',
        time: '3:10a',
        content: `[windows]
spooler=yes
load=
run=
Beep=yes
NullPort=None
BorderWidth=3
CursorBlinkRate=530
DoubleClickSpeed=452
Programs=com exe bat pif

[Desktop]
Pattern=(None)
Wallpaper=(None)
GridGranularity=0
IconSpacing=75
TileWallpaper=0

[Extensions]
cal=calendar.exe ^.cal
crd=cardfile.exe ^.crd
trm=terminal.exe ^.trm
txt=notepad.exe ^.txt
ini=notepad.exe ^.ini
bmp=pbrush.exe ^.bmp
mid=mplayer.exe ^.mid
`,
      },
      {
        name: 'README',
        extension: 'TXT',
        size: 1824,
        date: '04-06-92',
        time: '3:10a',
        content: `=====================================================
WELCOME TO MICROSOFT WINDOWS 3.1
=====================================================

This release of Microsoft Windows 3.1 represents a
major enhancement in personal computing.

Features in Windows 3.1:
* TrueType scalable font technology built directly into Windows.
* Drag and drop file management between Program Manager and File Manager.
* Multimedia audio support (MIDI, WAV sounds, Media Player).
* 386 Enhanced Mode virtual memory and multitasking.
* Minesweeper and Solitaire entertainment games.
* Object Linking and Embedding (OLE) integration.

TIPS FOR GETTING STARTED:
1. Double-click any icon to launch its application.
2. Minimize windows to reduce clutter on your desktop.
3. Use the Control Panel to customize your desktop colors
   (try "Hot Dog Stand" or "Ocean"!).
4. Click the PC Case power switch outside the monitor to shut down or restart!
`,
      },
      {
        name: 'CANYON',
        extension: 'MID',
        size: 33887,
        date: '04-06-92',
        time: '3:10a',
        content: 'Standard MIDI file: Canyon.mid (Music by George Stone)',
      },
      {
        name: 'TADA',
        extension: 'WAV',
        size: 27804,
        date: '04-06-92',
        time: '3:10a',
        content: 'Windows 3.1 Startup Chime (PCM audio)',
      },
      {
        name: 'CHIMES',
        extension: 'WAV',
        size: 15920,
        date: '04-06-92',
        time: '3:10a',
        content: 'Windows 3.1 Shutdown Chime (PCM audio)',
      },
      {
        name: 'DING',
        extension: 'WAV',
        size: 11598,
        date: '04-06-92',
        time: '3:10a',
        content: 'Windows 3.1 Alert Ding (PCM audio)',
      },
    ],
  },
  {
    name: 'DOS',
    extension: '',
    size: 0,
    date: '05-31-94',
    time: '6:22a',
    content: '',
    isDir: true,
    children: [
      { name: 'COMMAND', extension: 'COM', size: 54619, date: '05-31-94', time: '6:22a', content: 'MS-DOS command interpreter' },
      { name: 'FORMAT', extension: 'COM', size: 22774, date: '05-31-94', time: '6:22a', content: 'Format disk utility' },
      { name: 'MEM', extension: 'EXE', size: 32150, date: '05-31-94', time: '6:22a', content: 'Display memory usage' },
      { name: 'SMARTDRV', extension: 'EXE', size: 45145, date: '05-31-94', time: '6:22a', content: 'Disk caching utility' },
      { name: 'HIMEM', extension: 'SYS', size: 14280, date: '05-31-94', time: '6:22a', content: 'XMS Memory Manager' },
    ],
  },
  {
    name: 'GAMES',
    extension: '',
    size: 0,
    date: '04-06-92',
    time: '3:10a',
    content: '',
    isDir: true,
    children: [
      { name: 'SKI', extension: 'EXE', size: 68400, date: '08-12-91', time: '1:00p', content: 'SkiFree by Chris Pirih (1991)' },
      { name: 'WINMINE', extension: 'EXE', size: 27952, date: '04-06-92', time: '3:10a', content: 'Minesweeper' },
      { name: 'SOL', extension: 'EXE', size: 180688, date: '04-06-92', time: '3:10a', content: 'Solitaire' },
    ],
  },
  {
    name: 'AUTOEXEC',
    extension: 'BAT',
    size: 248,
    date: '04-06-92',
    time: '3:10a',
    content: `@ECHO OFF
PROMPT $P$G
PATH C:\\WINDOWS;C:\\DOS;C:\\GAMES
SET TEMP=C:\\WINDOWS\\TEMP
C:\\DOS\\SMARTDRV.EXE
C:\\WINDOWS\\WIN.COM
`,
  },
  {
    name: 'CONFIG',
    extension: 'SYS',
    size: 194,
    date: '04-06-92',
    time: '3:10a',
    content: `DEVICE=C:\\DOS\\HIMEM.SYS
DOS=HIGH,UMB
FILES=40
BUFFERS=30
STACKS=9,256
`,
  },
];

// Pre-defined floppy disk packages you can insert into Drive A:
export const availableFloppies = [
  {
    id: 'win-setup-1',
    label: 'Windows 3.1',
    subtitle: 'Disk 1 (Setup)',
    color: 'bg-blue-700',
    files: [
      { name: 'SETUP.EXE', size: 442110, content: 'Microsoft Windows 3.1 Setup Program' },
      { name: 'SETUP.INF', size: 65420, content: 'Setup configuration script' },
      { name: 'WIN.CNF', size: 4096, content: 'Windows system configuration' },
    ],
  },
  {
    id: 'games-disk',
    label: 'Classic Games',
    subtitle: 'Shareware Pack',
    color: 'bg-red-700',
    files: [
      { name: 'KEEN4.EXE', size: 720000, content: 'Commander Keen: Secret of the Oracle' },
      { name: 'DOOM1.EXE', size: 1440000, content: 'DOOM Shareware Episode 1: Knee-Deep in the Dead' },
      { name: 'ORDER.TXT', size: 3410, content: 'Apogee Software Order Form' },
    ],
  },
  {
    id: 'dos-tools',
    label: 'MS-DOS 6.22',
    subtitle: 'Supplemental',
    color: 'bg-emerald-800',
    files: [
      { name: 'SCANDISK.EXE', size: 133266, content: 'MS-DOS ScanDisk utility' },
      { name: 'DEFRAG.EXE', size: 75230, content: 'Microsoft Defragmenter' },
      { name: 'EDIT.COM', size: 413, content: 'MS-DOS Text Editor' },
    ],
  },
  {
    id: 'word-demo',
    label: 'Word for Win',
    subtitle: 'Version 2.0 Demo',
    color: 'bg-amber-800',
    files: [
      { name: 'WINWORD.EXE', size: 1240000, content: 'Microsoft Word for Windows 2.0c' },
      { name: 'SAMPLE.DOC', size: 28410, content: 'Quarterly Sales Report 1992' },
    ],
  },
];
