// frontend/src/socket.js

import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  autoConnect: false, // Prevents the socket from connecting immediately
});

export default socket;