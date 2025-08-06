// server.js
const WebSocket = require('ws');
const http = require('http');

const port = process.env.PORT || 4041;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('🔌 New client connected');

  ws.send(JSON.stringify({ msg: 'Welcome to WebSocket server!' }));

  ws.on('message', (message) => {
    console.log('Received:', message.toString());

    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('❌ Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`✅ WebSocket server running on port ${port}`);
});