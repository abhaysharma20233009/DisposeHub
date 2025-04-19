import mongoose from 'mongoose';
import User from './models/userModel.js'; // Ensure file extension is included

const initLeaderboardSocket = (io) => {
  io.on('connection', async (socket) => {
    console.log('New client connected');

    try {
      // Send top 10 users
      const users = await User.find().sort({ points: -1 }).limit(10);
      //console.log(users);
      socket.emit('leaderboard', users);
    } catch (err) {
      console.error(err);
    }

    socket.on('updatePoints', async (userId, points) => {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.points += points;
          await user.save();

          const updatedLeaderboard = await User.find().sort({ points: -1 }).limit(10);
          io.emit('leaderboard', updatedLeaderboard);
        }
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export default initLeaderboardSocket;
