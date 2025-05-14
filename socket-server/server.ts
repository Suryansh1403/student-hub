import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // frontend URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Join room (e.g., contest or 1v1)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`👥 ${socket.id} joined room: ${roomId}`);
  });

  // Real-time code sharing
  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('receive-code', code);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

httpServer.listen(4000, () => {
  console.log('🚀 Socket server listening on http://localhost:4000');
});
