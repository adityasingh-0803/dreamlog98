import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WindowData {
  id: string;
  title: string;
  component: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowContextType {
  openWindows: WindowData[];
  activeWindow: string | null;
  openWindow: (window: WindowData) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
};

export const WindowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openWindows, setOpenWindows] = useState<WindowData[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const openWindow = (window: WindowData) => {
    setOpenWindows(prev => {
      const existing = prev.find(w => w.id === window.id);
      if (existing) {
        return prev;
      }
      return [...prev, window];
    });
    setActiveWindow(window.id);
  };

  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id));
    setActiveWindow(prev => prev === id ? null : prev);
  };

  const focusWindow = (id: string) => {
    setActiveWindow(id);
  };

  return (
    <WindowContext.Provider value={{
      openWindows,
      activeWindow,
      openWindow,
      closeWindow,
      focusWindow
    }}>
      {children}
    </WindowContext.Provider>
  );
};