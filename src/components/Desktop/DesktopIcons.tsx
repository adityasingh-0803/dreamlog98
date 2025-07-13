import React from 'react';
import { useWindowContext } from '../../context/WindowContext';
import { 
  FileText, 
  Paintbrush, 
  Mail, 
  Terminal, 
  HardDrive, 
  Trash2,
  Moon,
  Eye
} from 'lucide-react';

const DesktopIcons: React.FC = () => {
  const { openWindow } = useWindowContext();

  const icons = [
    {
      id: 'notepad',
      name: 'Dream Journal',
      icon: FileText,
      position: { x: 20, y: 20 },
      app: 'notepad'
    },
    {
      id: 'paint',
      name: 'Dream Canvas',
      icon: Paintbrush,
      position: { x: 20, y: 120 },
      app: 'paint'
    },
    {
      id: 'outlook',
      name: 'Dream Mail',
      icon: Mail,
      position: { x: 20, y: 220 },
      app: 'outlook'
    },
    {
      id: 'cmd',
      name: 'Dream Terminal',
      icon: Terminal,
      position: { x: 20, y: 320 },
      app: 'cmd'
    },
    {
      id: 'mycomputer',
      name: 'My Dreams',
      icon: HardDrive,
      position: { x: 20, y: 420 },
      app: 'mycomputer'
    },
    {
      id: 'recycle',
      name: 'Forgotten Dreams',
      icon: Trash2,
      position: { x: 20, y: 520 },
      app: 'recycle'
    },
    {
      id: 'lucid',
      name: 'Lucid Mode',
      icon: Eye,
      position: { x: 120, y: 20 },
      app: 'lucid'
    },
    {
      id: 'nightmare',
      name: 'Shadow Work',
      icon: Moon,
      position: { x: 120, y: 120 },
      app: 'nightmare'
    }
  ];

  const handleDoubleClick = (app: string, name: string) => {
    openWindow({
      id: app,
      title: name,
      component: app,
      position: { x: 100, y: 100 },
      size: { width: 600, height: 400 }
    });
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {icons.map((icon) => {
        const IconComponent = icon.icon;
        return (
          <div
            key={icon.id}
            className="absolute pointer-events-auto cursor-pointer group"
            style={{ left: icon.position.x, top: icon.position.y }}
            onDoubleClick={() => handleDoubleClick(icon.app, icon.name)}
          >
            <div className="flex flex-col items-center gap-1 p-2 rounded hover:bg-blue-500 hover:bg-opacity-20 transition-colors">
              <div className="w-12 h-12 bg-gray-300 border-2 border-gray-200 border-r-gray-500 border-b-gray-500 flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-gray-700" />
              </div>
              <div className="text-white text-xs font-semibold text-center max-w-16 break-words drop-shadow-lg">
                {icon.name}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DesktopIcons;