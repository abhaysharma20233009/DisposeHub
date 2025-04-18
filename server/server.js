import http from 'http';
import dotenv from 'dotenv';
import { Server as socketIo } from 'socket.io';
import connectDB from './config/db.js';  // Import the connectDB function
import initLeaderboardSocket from './leaderBoardSocket.js';
import app from './index.js'; // Express app

dotenv.config({ path: './.env' });

// Create HTTP server from the Express app
const server = http.createServer(app);

// Socket.IO setup
const io = new socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend URL in production
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectDB();

// Init leaderboard socket handlers
initLeaderboardSocket(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
