import React from 'react';
import Desktop from './components/Desktop/Desktop';
import { WindowProvider } from './context/WindowContext';
import { DreamProvider } from './context/DreamContext';

function App() {
  return (
    <WindowProvider>
      <DreamProvider>
        <Desktop />
      </DreamProvider>
    </WindowProvider>
  );
}

export default App;