const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Simulated Hardware State (Memory Database for Edge Node)
const hardwareState = new Map();

io.on('connection', (socket) => {
  console.log(`[Aura Edge] Client connected: ${socket.id}`);

  // Send current state to newly connected client
  socket.emit('edge:sync', Array.from(hardwareState.entries()));

  // Listen for commands from the frontend
  socket.on('device:command', (data) => {
    console.log(`[Aura Edge] Command received for ${data.id}:`, data.command);
    
    // Simulate Hardware Latency (20ms to 100ms)
    setTimeout(() => {
      // 1. Update Hardware State locally
      let currentState = hardwareState.get(data.id) || { isOn: false };
      
      if (data.command === 'toggle') {
        currentState.isOn = !currentState.isOn;
      } else if (data.command === 'on') {
        currentState.isOn = true;
      } else if (data.command === 'off') {
        currentState.isOn = false;
      }
      
      hardwareState.set(data.id, currentState);

      // 2. Broadcast the confirmed state change to ALL clients
      console.log(`[Aura Edge] Broadcasting state change for ${data.id}:`, currentState);
      io.emit('device:state_changed', { id: data.id, state: currentState });

    }, Math.random() * 80 + 20); 
  });

  socket.on('disconnect', () => {
    console.log(`[Aura Edge] Client disconnected: ${socket.id}`);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Aura Edge Node (IoT Bridge) is ONLINE`);
  console.log(` Listening on ws://localhost:${PORT}`);
  console.log(`=========================================`);
});
