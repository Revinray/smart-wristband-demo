// frontend/src/App.js

import React from 'react';
import MainApp from './components/MainApp';
import './App.css';
import { SocketProvider } from './SocketContext';

function App() {
  return (
    <SocketProvider>
      <MainApp />
    </SocketProvider>
  );
}

export default App;