import { useState, useEffect } from 'react';

export const useGlitch = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  const triggerGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 2000);
  };

  useEffect(() => {
    // Random glitch effects
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        triggerGlitch();
      }
    }, 30000);

    return () => clearInterval(glitchInterval);
  }, []);

  return { glitchActive, triggerGlitch };
};