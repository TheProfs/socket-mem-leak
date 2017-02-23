const express = require('express');
const Io = require('socket.io');
const http = require('http');
const payload = require('./10mb-sample.json');
const colors = require('colors');


const PORT = process.env.PORT || 3000;
const WS_ONLY = process.env.WS_ONLY || false;

const app = express().get('/', sendHome);

const server = http.Server(app);
const io = Io(server);

if (WS_ONLY) io.set('transports', ['websocket']);

io.on('connection', (socket) => {
  console.log('new connection'.green);
  socket.on('requestPayload', () => {
    console.log('emitting 10 MB payload'.blue);
    socket.emit('payload', payload);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${ PORT }, using ${WS_ONLY ? "WebSocket only": "default Transport"}`);
});

function sendHome(req, res, next) {
  let socketStr = WS_ONLY ? `var socket = io({transports: ['websocket']});` : `var socket = io();`;
  res.send(`
    <!doctype html>
    <html>
    <body>
      <script src="/socket.io/socket.io.js"></script>
      <script>
        ${ socketStr }
        console.log('connecting...');
        socket.on('connect', function() {
          console.log('connected, requesting payload');
          socket.emit('requestPayload');
        });
        socket.on('payload', function(payload) {
          console.log('received payload');
        });
      </script>
    </body>
    </html>`);
}

// Metrics

setInterval(() => {
  const used = (process.memoryUsage().heapUsed / 1000 / 1000).toFixed(2); // bytes to MB's
  console.info(`Used heap size ${used} MB`.magenta);
}, 2000);
