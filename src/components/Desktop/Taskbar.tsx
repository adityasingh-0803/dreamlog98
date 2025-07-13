import React from 'react';
import { useWindowContext } from '../../context/WindowContext';
import { useState } from 'react';

const Taskbar: React.FC = () => {
  const { openWindows, activeWindow, focusWindow } = useWindowContext();
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTime = () => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleStartClick = () => {
    setShowStartMenu(!showStartMenu);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-gray-400 border-t-2 border-gray-200 flex items-center px-2 shadow-inner z-50">
      {/* Start Button */}
      <div className="relative">
        <button 
          onClick={handleStartClick}
          className={`h-8 px-3 border-2 flex items-center gap-2 font-bold text-sm ${
            showStartMenu 
              ? 'bg-gray-200 border-gray-500 border-r-gray-200 border-b-gray-200 border-l-gray-500 border-t-gray-500'
              : 'bg-gray-300 border-gray-200 border-r-gray-500 border-b-gray-500 hover:bg-gray-200'
          }`}
        >
          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          </div>
          Start
        </button>
        
        {/* Start Menu */}
        {showStartMenu && (
          <div className="absolute bottom-full left-0 w-48 bg-gray-200 border-2 border-gray-200 border-r-gray-500 border-b-gray-500 shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-2 text-sm font-bold">
              DreamLog 98
            </div>
            <div className="p-1">
              <div className="hover:bg-blue-500 hover:text-white px-2 py-1 text-sm cursor-pointer flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 border border-gray-700"></div>
                Programs
              </div>
              <div className="hover:bg-blue-500 hover:text-white px-2 py-1 text-sm cursor-pointer flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 border border-gray-700"></div>
                Documents
              </div>
              <div className="hover:bg-blue-500 hover:text-white px-2 py-1 text-sm cursor-pointer flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 border border-gray-700"></div>
                Settings
              </div>
              <div className="hover:bg-blue-500 hover:text-white px-2 py-1 text-sm cursor-pointer flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 border border-gray-700"></div>
                Find
              </div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-2 py-1 text-sm cursor-pointer flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-600 border border-gray-700"></div>
                Run...
              </div>
              <div className="border-t border-gray-400 my-1"></div>
              <div className="hover:bg-blue-500 hover:text-white px-2 py-1 text-sm cursor-pointer flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 border border-gray-700"></div>
                Shut Down...
              </div>
            </div>
          </div>
        )}
        </div>

      {/* Window Buttons */}
      <div className="flex-1 flex items-center gap-1 mx-2">
        {openWindows.map((window) => (
          <button
            key={window.id}
            onClick={() => focusWindow(window.id)}
            className={`h-8 px-3 border-2 text-sm font-semibold ${
              activeWindow === window.id
                ? 'bg-gray-200 border-gray-500 border-r-gray-200 border-b-gray-200 border-l-gray-500 border-t-gray-500'
                : 'bg-gray-300 border-gray-200 border-r-gray-500 border-b-gray-500 hover:bg-gray-200'
            }`}
          >
            {window.title}
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 bg-yellow-400 border border-gray-500 flex items-center justify-center cursor-pointer hover:bg-yellow-300" title="Dream Activity Monitor">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <div className="h-6 w-6 bg-blue-400 border border-gray-500 flex items-center justify-center cursor-pointer hover:bg-blue-300" title="Network Connection">
          <div className="w-3 h-2 bg-white"></div>
        </div>
        <div className="h-6 w-6 bg-green-400 border border-gray-500 flex items-center justify-center cursor-pointer hover:bg-green-300" title="Volume">
          <div className="w-2 h-3 bg-white"></div>
        </div>
        <div className="text-sm font-semibold border-l-2 border-gray-500 pl-2">
          {getCurrentTime()}
        </div>
      </div>
    </div>
  );

  // Close start menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowStartMenu(false);
      }
    };

    if (showStartMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showStartMenu]);
};

export default Taskbar;