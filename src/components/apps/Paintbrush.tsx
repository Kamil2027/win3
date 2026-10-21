import React, { useRef, useState, useEffect } from 'react';
import { retroAudio } from '../../services/audio';

const PALETTE = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#ffff80', '#00ff80', '#80ffff', '#7f7fff', '#ff0080', '#ff8040',
];

export const Paintbrush: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeColor, setActiveColor] = useState('#000000');
  const [tool, setTool] = useState<'pencil' | 'brush' | 'eraser' | 'spray' | 'line' | 'rect' | 'circle'>('pencil');
  const [lineWidth, setLineWidth] = useState(2);
  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const snapshot = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor(e.clientX - rect.left),
      y: Math.floor(e.clientY - rect.top),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    const { x, y } = getCanvasCoords(e);
    startPos.current = { x, y };
    snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : activeColor;
    ctx.fillStyle = tool === 'eraser' ? '#ffffff' : activeColor;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'spray') {
      drawSpray(ctx, x, y);
    }
  };

  const drawSpray = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = activeColor;
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (lineWidth * 4);
      ctx.fillRect(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, 1, 1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'spray') {
      drawSpray(ctx, x, y);
    } else if (snapshot.current) {
      // Shape tools: restore previous state then draw preview
      ctx.putImageData(snapshot.current, 0, 0);
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = lineWidth;

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startPos.current.x, startPos.current.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === 'rect') {
        const w = x - startPos.current.x;
        const h = y - startPos.current.y;
        ctx.strokeRect(startPos.current.x, startPos.current.y, w, h);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(x - startPos.current.x, 2) + Math.pow(y - startPos.current.y, 2)
        );
        ctx.beginPath();
        ctx.arc(startPos.current.x, startPos.current.y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    retroAudio.playSwitchClick('button');
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'DRAWING.BMP';
    link.href = canvas.toDataURL('image/png');
    link.click();
    retroAudio.playSwitchClick('button');
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs select-none">
      {/* Sub Menu / Actions Bar */}
      <div className="flex items-center gap-2 p-1 border-b border-[#808080] bg-[#c0c0c0]">
        <button
          type="button"
          onClick={clearCanvas}
          className="win3-button px-2 py-0.5"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={saveDrawing}
          className="win3-button px-2 py-0.5"
        >
          Save BMP
        </button>
        <span className="text-gray-600 ml-auto">Canvas: 480x320 24-bit</span>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden p-1 gap-1">
        {/* Left Toolbar */}
        <div className="w-16 bg-[#c0c0c0] win3-box-sunken p-1 flex flex-col gap-1 items-center shrink-0">
          <div className="grid grid-cols-2 gap-1 w-full">
            <button
              type="button"
              onClick={() => setTool('pencil')}
              className={`w-6 h-6 win3-button text-xs flex items-center justify-center ${
                tool === 'pencil' ? 'bg-[#e0e0e0] font-bold border-t-[#808080] border-l-[#808080]' : ''
              }`}
              title="Pencil"
            >
              ✏️
            </button>
            <button
              type="button"
              onClick={() => setTool('brush')}
              className={`w-6 h-6 win3-button text-xs flex items-center justify-center ${
                tool === 'brush' ? 'bg-[#e0e0e0] font-bold' : ''
              }`}
              title="Paint Brush"
            >
              🖌️
            </button>
            <button
              type="button"
              onClick={() => setTool('eraser')}
              className={`w-6 h-6 win3-button text-xs flex items-center justify-center ${
                tool === 'eraser' ? 'bg-[#e0e0e0] font-bold' : ''
              }`}
              title="Eraser"
            >
              🧼
            </button>
            <button
              type="button"
              onClick={() => setTool('spray')}
              className={`w-6 h-6 win3-button text-xs flex items-center justify-center ${
                tool === 'spray' ? 'bg-[#e0e0e0] font-bold' : ''
              }`}
              title="Airbrush"
            >
              💨
            </button>
            <button
              type="button"
              onClick={() => setTool('line')}
              className={`w-6 h-6 win3-button text-xs flex items-center justify-center ${
                tool === 'line' ? 'bg-[#e0e0e0] font-bold' : ''
              }`}
              title="Straight Line"
            >
              📏
            </button>
            <button
              type="button"
              onClick={() => setTool('rect')}
              className={`w-6 h-6 win3-button text-xs flex items-center justify-center ${
                tool === 'rect' ? 'bg-[#e0e0e0] font-bold' : ''
              }`}
              title="Box"
            >
              ⬜
            </button>
            <button
              type="button"
              onClick={() => setTool('circle')}
              className={`w-6 h-6 win3-button text-xs flex items-center justify-center ${
                tool === 'circle' ? 'bg-[#e0e0e0] font-bold' : ''
              }`}
              title="Ellipse"
            >
              ⭕
            </button>
          </div>

          <div className="w-full border-t border-[#808080] my-1" />

          {/* Stroke Width Selector */}
          <div className="flex flex-col gap-1 w-full items-center">
            {[1, 2, 4, 8].map((w) => (
              <button
                type="button"
                key={w}
                onClick={() => setLineWidth(w)}
                className={`w-full py-1 flex items-center justify-center win3-button ${
                  lineWidth === w ? 'bg-white' : ''
                }`}
              >
                <div
                  className="bg-black"
                  style={{ width: '80%', height: `${w}px` }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-[#808080] p-2 flex items-center justify-center win3-box-sunken">
          <canvas
            ref={canvasRef}
            width={480}
            height={320}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="bg-white shadow-[2px_2px_0px_#000] cursor-crosshair"
          />
        </div>
      </div>

      {/* Color Palette at Bottom */}
      <div className="p-1 bg-[#c0c0c0] border-t border-[#808080] flex items-center gap-2">
        {/* Active Color Preview Box */}
        <div className="w-8 h-8 win3-box-sunken relative bg-white shrink-0">
          <div
            className="w-5 h-5 absolute top-1 left-1 border border-black"
            style={{ backgroundColor: activeColor }}
          />
        </div>

        {/* 28-color palette swatches */}
        <div className="grid grid-rows-2 grid-flow-col gap-[2px]">
          {PALETTE.map((c, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setActiveColor(c)}
              className="w-4 h-4 border border-black hover:scale-110"
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
