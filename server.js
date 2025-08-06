const WebSocket = require("ws");
const axios = require("axios");

const wss = new WebSocket.Server({ port: process.env.PORT || 10000 });

const MATCH_ID = "894933367"; // Default match ID
const API_URL = `http://165.232.181.130:4040/api-v3/TzLWM23fPgqZe/${MATCH_ID}`;
const PUSH_INTERVAL = 3000; // 3 seconds

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);
  ws.on("close", () => {
    clients = clients.filter((c) => c !== ws);
  });
});

async function fetchAndBroadcastOdds() {
  try {
    const res = await axios.get(API_URL);
    const markets = res.data?.data?.data || [];

    const html = generateHTML(markets); // You’ll write this part manually or load template

    const payload = JSON.stringify({
      match_id: MATCH_ID,
      markets_html: html,
    });

    clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    });
  } catch (err) {
    console.error("Fetch error:", err.message);
  }
}

setInterval(fetchAndBroadcastOdds, PUSH_INTERVAL);
