import http from 'http';
import { Server } from 'socket.io';
import app from './src/app';
import dotenv from 'dotenv';

dotenv.config();

const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5000;


io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  // console.log('rooms:', socket.adapter.rooms);

  socket.emit("message",(socket.id));

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log('Server running on http://localhost:3000');
});
