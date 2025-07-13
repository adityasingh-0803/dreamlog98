import React, { useState, useEffect } from 'react';

const BootScreen: React.FC = () => {
  const [bootText, setBootText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const bootSequence = [
    'Starting DreamLog 98...',
    'Loading dream analysis modules...',
    'Initializing subconscious interface...',
    'Connecting to the collective unconscious...',
    'Ready to explore your dreams.'
  ];

  useEffect(() => {
    let textIndex = 0;
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (textIndex < bootSequence.length) {
        if (charIndex < bootSequence[textIndex].length) {
          setBootText(prev => prev + bootSequence[textIndex][charIndex]);
          charIndex++;
        } else {
          setBootText(prev => prev + '\n');
          textIndex++;
          charIndex = 0;
        }
      } else {
        clearInterval(typeInterval);
      }
    }, 50);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typeInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-mono">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4 text-cyan-400">DreamLog 98</div>
        <div className="text-lg text-gray-300">A Journey Into Your Subconscious</div>
      </div>
      
      <div className="w-96 h-64 bg-gray-900 border-2 border-gray-600 p-4 rounded">
        <pre className="text-sm text-green-400 whitespace-pre-wrap">
          {bootText}
          {showCursor && <span className="bg-green-400 text-black">█</span>}
        </pre>
      </div>
    </div>
  );
};

export default BootScreen;