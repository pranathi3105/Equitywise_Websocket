const WebSocket = require('ws');
const axios = require('axios');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    console.log(`Received message: ${message}`);

    try {
      const data = JSON.parse(message);
      const { apiKey, functionType, symbol, outputSize,interval } = data;

      // Construct the Alpha Vantage API URL
      const url = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&outpitsize=${outputSize}&interval=${interval}&apikey=${apiKey}`;


      console.log(url);
      // Make the API request
      const response = await axios.get(url);
      console.log("resrponse: ",response);
      // Send the API response back to the client
      ws.send(JSON.stringify(response.data));
    } catch (error) {
      console.log("catch error: ",error.message);
      console.error('Error making API request:', error);
      ws.send(JSON.stringify({ error: 'Error making API request' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

