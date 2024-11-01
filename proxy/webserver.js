const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const port = 3000;

// WebSocket setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Listen for Discord webhooks on /webhook
app.post('/webhook', express.json(), (req, res) => {
  const fileLink = req.body.file_link; // Modify based on your webhook payload
  if (fileLink) {
    // Send the file link to all connected WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ fileLink }));
      }
    });
    res.status(200).send('Link sent to WebSocket clients.');
  } else {
    res.status(400).send('No file link in the payload.');
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
