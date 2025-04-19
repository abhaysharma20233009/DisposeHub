import mongoose from 'mongoose';
import User from './models/userModel.js'; // Ensure file extension is included
import Notification from './models/notificationModel.js'
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

   
       // Fetch Unread Notifications
          socket.on("fetchNotifications", async ({firebaseUID}) => {
            try {
              console.log("firebaseUID"+firebaseUID);
              const user=await User.findOne({firebaseUID});
              
              const notifications = await Notification.find({
                receiver: user._id,
                isRead: false,
              });
              console.log(user+"usersssssss"+notifications);
              socket.emit("allNotifications", notifications);
            } catch (error) {
              console.error("Error fetching notifications:", error);
            }
          });
      
     // Mark Notifications as Read
        socket.on("markNotificationsAsRead", async ({firebaseUID}) => {
          try {
            console.log("firebaseUID"+firebaseUID);
              const user=await User.findOne({firebaseUID});
            await Notification.updateMany(
              { receiver: user._id, isRead: false },
              { isRead: true }
            );
            socket.emit("notificationsMarkedAsRead");
          } catch (error) {
            console.error("Error marking notifications as read:", error);
          }
        });
    

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};

export default initLeaderboardSocket;
