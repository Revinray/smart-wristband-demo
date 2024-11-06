// frontend/src/SocketContext.js

import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Create separate socket instances
export const WristbandSocket = io('http://localhost:4000', {
  autoConnect: false,
});

export const SmartphoneSocket = io('http://localhost:4000', {
  autoConnect: false,
});

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [paired, setPaired] = useState(false);

  useEffect(() => {
    // Connect both sockets
    WristbandSocket.connect();
    SmartphoneSocket.connect();

    // Handle connection events for Wristband
    WristbandSocket.on('connect', () => {
      console.log('Wristband Socket connected:', WristbandSocket.id);
    });

    WristbandSocket.on('disconnect', (reason) => {
      console.log('Wristband Socket disconnected:', reason);
      setPaired(false);
    });

    // Handle connection events for Smartphone App
    SmartphoneSocket.on('connect', () => {
      console.log('Smartphone Socket connected:', SmartphoneSocket.id);
    });

    SmartphoneSocket.on('disconnect', (reason) => {
      console.log('Smartphone Socket disconnected:', reason);
      setPaired(false);
    });

    // Cleanup on unmount
    return () => {
      WristbandSocket.disconnect();
      SmartphoneSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        WristbandSocket,
        SmartphoneSocket,
        paired,
        setPaired,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};