import React, { useRef, useEffect, useState } from 'react';
import { Palette, Eraser, Save, Sparkles, Square, Circle, Minus, Type, Pipette, PaintBucket as Bucket, RotateCcw } from 'lucide-react';
import { geminiService } from '../../services/geminiService';
import { useDreamContext } from '../../context/DreamContext';

const DreamCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'fill' | 'eyedropper'>('brush');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([]);
  const { dreams } = useDreamContext();

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#008000',
    '#000080', '#808000', '#800080', '#008080', '#C0C0C0'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
      }
    }
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setCanvasHistory(prev => [...prev.slice(-9), imageData]); // Keep last 10 states
    }
  };

  const undo = () => {
    if (canvasHistory.length > 1) {
      const newHistory = canvasHistory.slice(0, -1);
      const previousState = newHistory[newHistory.length - 1];
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && previousState) {
        ctx.putImageData(previousState, 0, 0);
        setCanvasHistory(newHistory);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });

    if (currentTool === 'brush' || currentTool === 'eraser') {
      draw(e);
    } else if (currentTool === 'eyedropper') {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b] = imageData.data;
      setCurrentColor(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
      setIsDrawing(false);
    } else if (currentTool === 'fill') {
      floodFill(x, y);
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const draw = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'brush' || currentTool === 'eraser') {
      if (!isDrawing) return;
      
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';

      if (currentTool === 'brush') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
      } else {
        ctx.globalCompositeOperation = 'destination-out';
      }
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const stopDrawing = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    if (currentTool === 'line') {
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    } else if (currentTool === 'rectangle') {
      const width = endX - startPos.x;
      const height = endY - startPos.y;
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.strokeRect(startPos.x, startPos.y, width, height);
    } else if (currentTool === 'circle') {
      const radius = Math.sqrt(Math.pow(endX - startPos.x, 2) + Math.pow(endY - startPos.y, 2));
      ctx.beginPath();
      ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    }

    setIsDrawing(false);
    ctx.beginPath();
    saveToHistory();
  };

  const floodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const targetColor = getPixelColor(data, startX, startY, canvas.width);
    const fillColor = hexToRgb(currentColor);
    
    if (colorsMatch(targetColor, fillColor)) return;
    
    const stack = [[startX, startY]];
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      const currentColor = getPixelColor(data, x, y, canvas.width);
      if (!colorsMatch(currentColor, targetColor)) continue;
      
      setPixelColor(data, x, y, canvas.width, fillColor);
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const getPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
  };

  const setPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number, color: number[]) => {
    const index = (y * width + x) * 4;
    data[index] = color[0];
    data[index + 1] = color[1];
    data[index + 2] = color[2];
    data[index + 3] = 255;
  };

  const hexToRgb = (hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  };

  const colorsMatch = (a: number[], b: number[]): boolean => {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveToHistory();
    }
  };

  const generateDreamImage = async () => {
    setIsGenerating(true);
    
    try {
      // Get the most recent dream for image generation
      const recentDream = dreams[dreams.length - 1];
      let imagePrompt = 'surreal dreamscape with floating elements, ethereal colors, digital art';
      
      if (recentDream) {
        imagePrompt = await geminiService.generateDreamImagePrompt(recentDream.content);
      }
      
      // For now, create a procedural dream image based on the prompt
      // In a real implementation, you would call an image generation API here
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      // Create a dreamy, surreal pattern based on dream themes
      const colors = recentDream?.symbols.includes('water') ? 
        ['#4A90E2', '#7ED3F7', '#B8E6B8'] : 
        ['#FF6B9D', '#4ECDC4', '#45B7D1'];
      
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(0.5, colors[1]);
      gradient.addColorStop(1, colors[2]);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add dream-like elements based on symbols
      const symbolCount = recentDream?.symbols.length || 5;
      for (let i = 0; i < symbolCount * 4; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 30 + 5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
        ctx.fill();
      }
      
      saveToHistory();
      setIsGenerating(false);
    } catch (error) {
      console.error('Dream image generation failed:', error);
      setIsGenerating(false);
    }
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `dream_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Menu Bar */}
      <div className="h-6 bg-gray-200 border-b border-gray-400 flex items-center px-2 text-xs">
        <div className="relative">
          <span 
            className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer"
            onClick={() => setShowFileMenu(!showFileMenu)}
          >
            File
          </span>
          {showFileMenu && (
            <div className="absolute top-full left-0 bg-gray-200 border border-gray-400 shadow-lg z-50 min-w-32">
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={clearCanvas}>New</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Open...</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={saveCanvas}>Save</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Print...</div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <span 
            className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer"
            onClick={() => setShowEditMenu(!showEditMenu)}
          >
            Edit
          </span>
          {showEditMenu && (
            <div className="absolute top-full left-0 bg-gray-200 border border-gray-400 shadow-lg z-50 min-w-32">
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={undo}>Undo</div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Cut</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Copy</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs">Paste</div>
              <div className="hover:bg-blue-500 hover:text-white px-3 py-1 cursor-pointer text-xs" onClick={clearCanvas}>Clear Image</div>
            </div>
          )}
        </div>
        
        <span className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer">View</span>
        <span className="hover:bg-blue-500 hover:text-white px-2 py-1 cursor-pointer">Image</span>
      </div>

      {/* Toolbar */}
      <div className="h-12 bg-gray-200 border-b border-gray-400 flex items-center px-2 gap-2">
        <button
          onClick={() => setCurrentTool('brush')}
          className={`flex items-center gap-1 px-3 py-1 border border-gray-500 text-xs ${
            currentTool === 'brush' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-200'
          }`}
        >
          <Palette className="w-3 h-3" />
          Brush
        </button>
        <button
          onClick={() => setCurrentTool('eraser')}
          className={`flex items-center gap-1 px-3 py-1 border border-gray-500 text-xs ${
            currentTool === 'eraser' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-200'
          }`}
        >
          <Eraser className="w-3 h-3" />
          Eraser
        </button>
        
        <button
          onClick={() => setCurrentTool('line')}
          className={`flex items-center gap-1 px-3 py-1 border border-gray-500 text-xs ${
            currentTool === 'line' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-200'
          }`}
        >
          <Minus className="w-3 h-3" />
          Line
        </button>
        
        <button
          onClick={() => setCurrentTool('rectangle')}
          className={`flex items-center gap-1 px-3 py-1 border border-gray-500 text-xs ${
            currentTool === 'rectangle' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-200'
          }`}
        >
          <Square className="w-3 h-3" />
          Rect
        </button>
        
        <button
          onClick={() => setCurrentTool('circle')}
          className={`flex items-center gap-1 px-3 py-1 border border-gray-500 text-xs ${
            currentTool === 'circle' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-200'
          }`}
        >
          <Circle className="w-3 h-3" />
          Circle
        </button>
        
        <button
          onClick={() => setCurrentTool('fill')}
          className={`flex items-center gap-1 px-3 py-1 border border-gray-500 text-xs ${
            currentTool === 'fill' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-200'
          }`}
        >
          <Bucket className="w-3 h-3" />
          Fill
        </button>
        
        <button
          onClick={() => setCurrentTool('eyedropper')}
          className={`flex items-center gap-1 px-3 py-1 border border-gray-500 text-xs ${
            currentTool === 'eyedropper' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-300 hover:bg-gray-200'
          }`}
        >
          <Pipette className="w-3 h-3" />
          Pick
        </button>
        
        <div className="w-px h-8 bg-gray-400 mx-2"></div>
        
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-20"
        />
        <span className="text-xs">Size: {brushSize}</span>
        
        <div className="w-px h-8 bg-gray-400 mx-2"></div>
        
        <button
          onClick={undo}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs"
        >
          <RotateCcw className="w-3 h-3" />
          Undo
        </button>
        
        <button
          onClick={generateDreamImage}
          disabled={isGenerating}
          className="flex items-center gap-1 px-3 py-1 bg-purple-500 text-white border border-purple-600 hover:bg-purple-400 active:bg-purple-600 text-xs disabled:opacity-50"
        >
          <Sparkles className="w-3 h-3" />
          {isGenerating ? 'Generating...' : 'AI Dream'}
        </button>
        
        <button
          onClick={saveCanvas}
          className="flex items-center gap-1 px-3 py-1 bg-gray-300 border border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-xs"
        >
          <Save className="w-3 h-3" />
          Save
        </button>
      </div>

      {/* Color Palette */}
      <div className="h-10 bg-gray-200 border-b border-gray-400 flex items-center px-2 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => setCurrentColor(color)}
            className={`w-6 h-6 border-2 ${
              currentColor === color ? 'border-black' : 'border-gray-400'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-2 bg-gray-100">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-2 border-gray-500 bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-gray-200 border-t border-gray-400 flex items-center justify-between px-2 text-xs">
        <span>Tool: {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)} | Color: {currentColor} | Size: {brushSize}</span>
        <span>
          {isGenerating && (
            <span className="text-purple-600 animate-pulse">🎨 Generating dream imagery...</span>
          )}
        </span>
      </div>
    </div>
  );

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFileMenu(false);
      setShowEditMenu(false);
      setShowViewMenu(false);
      setShowImageMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
};

export default DreamCanvas;