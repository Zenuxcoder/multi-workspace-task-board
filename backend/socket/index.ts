import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server;

export function setupSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO(): Server {
  return io;
}
