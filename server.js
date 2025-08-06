// server.js
const WebSocket = require('ws');
const http = require('http');

// Create HTTP server (needed for WebSocket upgrade)
const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Example: push odds data every 5 seconds
setInterval(() => {
  const oddsUpdate = {
    type: "odds_update",
    matchId: 894933367,
    market: "MATCH_ODDS",
    runners: [
      { name: "Team A", back: 1.91, lay: 2.00 },
      { name: "Team B", back: 1.92, lay: 2.02 },
      { name: "Draw", back: 3.5, lay: 3.7 }
    ],
    timestamp: new Date().toISOString()
  };

  const message = JSON.stringify(oddsUpdate);

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}, 5000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
