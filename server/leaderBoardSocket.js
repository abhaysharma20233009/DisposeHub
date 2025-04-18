const mongoose = require('mongoose');
const User = require('./models/userModel'); // Assuming you saved the model as 'User.js'

const initLeaderboardSocket = (io) => {
    io.on('connection', async (socket) => {
      console.log('New client connected');
  
      try {
        // Use async/await to retrieve top 10 users
        const users = await User.find().sort({ points: -1 }).limit(10);
        console.log(users);
        socket.emit('leaderboard', users); // Send top 10 users
      } catch (err) {
        console.error(err);
      }
  
      // Handle points update and broadcast leaderboard update
      socket.on('updatePoints', async (userId, points) => {
        try {
          const user = await User.findById(userId);
          if (user) {
            user.points += points;
            await user.save();
  
            // Broadcast updated leaderboard to all connected clients
            const updatedLeaderboard = await User.find().sort({ points: -1 }).limit(10);
            io.emit('leaderboard', updatedLeaderboard);
          }
        } catch (err) {
          console.error(err);
        }
      });
  
      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  };
  
module.exports = initLeaderboardSocket;
