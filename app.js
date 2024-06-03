const WebSocket = require('ws');
const axios = require('axios');

const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    console.log(`Received message: ${message}`);

    try {
      const data = JSON.parse(message);
      const { apiKey, functionType, symbol, interval } = data;

      // Construct the Alpha Vantage API URL
      const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`;

      // Make the API request
      const response = await axios.get(url);

      // Send the API response back to the client
      ws.send(JSON.stringify(response.data));
    } catch (error) {
      console.error('Error making API request:', error);
      ws.send(JSON.stringify({ error: 'Error making API request' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log(`WebSocket server is listening on ws://localhost:${port}`);
