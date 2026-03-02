const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.FRONTEND_URL,
    credentials: true
  }
});

io.on('connection', (socket) => {
  socket.on('join:org', (orgId) => socket.join(`org:${orgId}`));
  socket.on('join:user', (userId) => socket.join(`user:${userId}`));
});

app.set('io', io);

server.listen(env.PORT, () => {
  logger.info(`DealFlow API listening on port ${env.PORT}`);
});
