import React from 'react';
import { useWindowContext } from '../../context/WindowContext';
import Window from '../Window/Window';

const WindowManager: React.FC = () => {
  const { openWindows } = useWindowContext();

  return (
    <div className="absolute inset-0 pointer-events-none">
      {openWindows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          component={window.component}
          initialPosition={window.position}
          initialSize={window.size}
        />
      ))}
    </div>
  );
};

export default WindowManager;