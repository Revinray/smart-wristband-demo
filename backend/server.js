// backend/server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory storage for paired devices
let pairedDevices = {};

// In-memory storage for user profiles and sound settings
let userProfiles = {};

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
  
    // Handle pairing from Wristband
    socket.on('pair_device', (data) => {
      const { deviceId, userId } = data;
      pairedDevices[deviceId] = socket.id;
  
      // Initialize user profile if it doesn't exist
      if (!userProfiles[userId]) {
        userProfiles[userId] = {
          sounds: [],
          emergencyAlerts: [],
          deviceId: deviceId // Track device ID within user profile
        };
      }
  
      console.log(`Device ${deviceId} paired with user ${userId}`);
      socket.emit('pair_success', { message: 'Pairing successful.' });
    });
  
    // Handle sound profile updates from Smartphone App
    socket.on('update_sounds', (data) => {
      const { userId, sounds } = data;
      if (userProfiles[userId]) {
        userProfiles[userId].sounds = sounds;
        console.log(`Updated sounds for user ${userId}:`, sounds);
        socket.emit('update_sounds_success', { message: 'Sounds updated successfully.' });
      } else {
        console.log(`User ${userId} not found.`);
        socket.emit('error', { message: 'User not found.' });
      }
    });
  
    // Handle emergency alert updates from Smartphone App
    socket.on('update_emergencies', (data) => {
      const { userId, emergencyAlerts } = data;
      if (userProfiles[userId]) {
        userProfiles[userId].emergencyAlerts = emergencyAlerts;
        console.log(`Updated emergency alerts for user ${userId}:`, emergencyAlerts);
        socket.emit('update_emergencies_success', { message: 'Emergency alerts updated successfully.' });
      } else {
        console.log(`User ${userId} not found.`);
        socket.emit('error', { message: 'User not found.' });
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      // Optionally handle cleanup if needed
      // e.g., Remove device from pairedDevices
      for (const [deviceId, sockId] of Object.entries(pairedDevices)) {
        if (sockId === socket.id) {
          delete pairedDevices[deviceId];
          console.log(`Device ${deviceId} disconnected and removed from paired devices.`);
          break;
        }
      }
    });
  });
  
  // Simulate sound detection
  const soundOptions = [
    { name: 'Doorbell', isEmergency: false },
    { name: 'Phone Ring', isEmergency: false },
    { name: 'Alarm', isEmergency: true },
    { name: 'Baby Crying', isEmergency: true },
    { name: 'Oven Timer', isEmergency: false }
  ];
  
  const directionOptions = ['North', 'South', 'East', 'West', 'Northeast', 'Northwest', 'Southeast', 'Southwest'];
  
  setInterval(() => {
    const sound = soundOptions[Math.floor(Math.random() * soundOptions.length)];
    const direction = directionOptions[Math.floor(Math.random() * directionOptions.length)];
    const timestamp = new Date().toLocaleString();
  
    const alert = {
      soundName: sound.name,
      isEmergency: sound.isEmergency,
      timestamp,
      direction
    };
  
    console.log(`Detected sound: ${sound.name} at ${timestamp} from ${direction}`);
  
    // Emit alert to relevant paired devices
    for (const [deviceId, socketId] of Object.entries(pairedDevices)) {
      const user = Object.values(userProfiles).find(profile => profile.deviceId === deviceId);
      if (user) {
        io.to(socketId).emit('alert', alert);
        console.log(`Alert emitted to device ${deviceId}:`, alert);
      }
    }
  }, 15000); // Every 15 seconds
  
  const PORT = process.env.PORT || 4000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));