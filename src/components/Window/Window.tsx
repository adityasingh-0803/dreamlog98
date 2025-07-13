import React, { useState, useRef, useEffect } from 'react';
import { useWindowContext } from '../../context/WindowContext';
import { X, Minus, Square } from 'lucide-react';
import DreamJournal from '../Applications/DreamJournal';
import DreamCanvas from '../Applications/DreamCanvas';
import DreamMail from '../Applications/DreamMail';
import DreamTerminal from '../Applications/DreamTerminal';
import MyDreams from '../Applications/MyDreams';
import ForgottenDreams from '../Applications/ForgottenDreams';
import LucidMode from '../Applications/LucidMode';
import ShadowWork from '../Applications/ShadowWork';

interface WindowProps {
  id: string;
  title: string;
  component: string;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
}

const Window: React.FC<WindowProps> = ({ 
  id, 
  title, 
  component, 
  initialPosition, 
  initialSize 
}) => {
  const { closeWindow, focusWindow, activeWindow } = useWindowContext();
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [maximized, setMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState(initialSize);
  const [previousPosition, setPreviousPosition] = useState(initialPosition);
  
  const windowRef = useRef<HTMLDivElement>(null);
  const isActive = activeWindow === id;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    focusWindow(id);
    
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handleMaximize = () => {
    if (maximized) {
      // Restore
      setSize(previousSize);
      setPosition(previousPosition);
      setMaximized(false);
    } else {
      // Maximize
      setPreviousSize(size);
      setPreviousPosition(position);
      setSize({ width: window.innerWidth, height: window.innerHeight - 40 }); // Account for taskbar
      setPosition({ x: 0, y: 0 });
      setMaximized(true);
    }
  };

  const handleDoubleClickTitleBar = () => {
    handleMaximize();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !maximized) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    } else if (isResizing && !maximized) {
      const rect = windowRef.current?.getBoundingClientRect();
      if (rect) {
        setSize({
          width: Math.max(200, e.clientX - rect.left + 10),
          height: Math.max(150, e.clientY - rect.top + 10)
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset]);

  const renderComponent = () => {
    switch (component) {
      case 'notepad':
        return <DreamJournal />;
      case 'paint':
        return <DreamCanvas />;
      case 'outlook':
        return <DreamMail />;
      case 'cmd':
        return <DreamTerminal />;
      case 'mycomputer':
        return <MyDreams />;
      case 'recycle':
        return <ForgottenDreams />;
      case 'lucid':
        return <LucidMode />;
      case 'nightmare':
        return <ShadowWork />;
      default:
        return <div className="p-4">Application not found</div>;
    }
  };

  if (minimized) {
    return null;
  }

  return (
    <div
      ref={windowRef}
      className={`absolute pointer-events-auto bg-gray-300 border-2 border-gray-200 border-r-gray-500 border-b-gray-500 shadow-lg ${
        isActive ? 'z-50' : 'z-10'
      }`}
      style={{
        left: maximized ? 0 : position.x,
        top: maximized ? 0 : position.y,
        width: maximized ? '100vw' : size.width,
        height: maximized ? 'calc(100vh - 40px)' : size.height
      }}
      onClick={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div 
        className={`h-8 flex items-center justify-between px-2 cursor-move ${
          isActive 
            ? 'bg-gradient-to-r from-blue-600 to-blue-500' 
            : 'bg-gradient-to-r from-gray-500 to-gray-400'
        } ${maximized ? 'cursor-default' : 'cursor-move'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClickTitleBar}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 border border-gray-700 flex items-center justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <span className="text-white text-sm font-semibold">{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            className="w-6 h-6 bg-gray-300 border border-gray-500 flex items-center justify-center hover:bg-gray-200 active:bg-gray-400"
            onClick={() => setMinimized(true)}
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            className="w-6 h-6 bg-gray-300 border border-gray-500 flex items-center justify-center hover:bg-gray-200 active:bg-gray-400"
            onClick={handleMaximize}
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            className="w-6 h-6 bg-gray-300 border border-gray-500 flex items-center justify-center hover:bg-gray-200 active:bg-gray-400"
            onClick={() => closeWindow(id)}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white border-2 border-gray-500 border-r-gray-200 border-b-gray-200 h-full overflow-hidden">
        {renderComponent()}
      </div>

      {/* Resize Handle */}
      {!maximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
        >
          <div className="w-full h-full bg-gray-400 opacity-50"></div>
        </div>
      )}
    </div>
  );
};

export default Window;