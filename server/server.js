import http from 'http';
import dotenv from 'dotenv';
import { Server as socketIo } from 'socket.io';
import connectDB from './config/db.js';  
import initLeaderboardSocket from './leaderBoardSocket.js';
import initSocket from './mapSocket.js';
import app from './index.js'; 

dotenv.config({ path: './.env' });

const server = http.createServer(app);

const io = new socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
  },
});

connectDB();
initSocket(io);
initLeaderboardSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
