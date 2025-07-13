import React, { useState, useEffect } from 'react';
import Taskbar from './Taskbar';
import DesktopIcons from './DesktopIcons';
import WindowManager from './WindowManager';
import BootScreen from './BootScreen';
import { useGlitch } from '../../hooks/useGlitch';

const Desktop: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const { glitchActive, triggerGlitch } = useGlitch();

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 3000);

    return () => clearTimeout(bootTimer);
  }, []);

  if (isBooting) {
    return <BootScreen />;
  }

  return (
    <div className={`min-h-screen bg-teal-600 relative overflow-hidden ${glitchActive ? 'animate-glitch' : ''}`}>
      {/* Desktop Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700">
        <div className="absolute inset-0 opacity-10 bg-repeat" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }}
        />
      </div>

      {/* Desktop Icons */}
      <DesktopIcons />

      {/* Window Manager */}
      <WindowManager />

      {/* Taskbar */}
      <Taskbar />

      {/* Glitch Effects */}
      {glitchActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full bg-red-500 opacity-20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-mono animate-bounce">
            DREAM.EXE HAS ENCOUNTERED AN ERROR
          </div>
        </div>
      )}
    </div>
  );
};

export default Desktop;