const express = require('express');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const server = http.createServer(app);
const socketIo = require('socket.io');
dotenv.config({ path: './config.env' });
const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // your frontend URL
      methods: ["GET", "POST"],
    },
  });
  
const initLeaderboardSocket = require('./leaderBoardSocket'); // Import the new file
const DB = process.env.DATABASE_URL.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    
  
  })
  .then(() => {
    // console.log(con.connections);s
    console.log('DB connection successful');
  });

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

initLeaderboardSocket(io);