const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const port = 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Example endpoint for testing
app.get('/', (req, res) => {
    res.send('WebSocket server is running');
});

// Start the server
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
