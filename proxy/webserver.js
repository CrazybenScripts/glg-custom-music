const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { Client, GatewayIntentBits } = require('discord.js');
const app = express();
const port = 3000;

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Discord bot setup
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const discordToken = 'https://discord.com/api/webhooks/1301742245153865758/6VAeeIm0bS6jntOjD_-z2XDFoKytM_rsXiElrUZReHuRRDSeJW1ibcM02QxGDEw77WEn'; // Replace with your bot's token
const channelId = '1301742222844100729'; // Replace with the ID of the channel you want to monitor

// WebSocket broadcast function
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Discord bot message listener
bot.on('messageCreate', (message) => {
  if (message.channel.id === channelId && message.attachments.size > 0) {
    const fileLink = message.attachments.first().url;
    broadcast({ fileLink });
  }
});

// Login to Discord
bot.login(discordToken);

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
