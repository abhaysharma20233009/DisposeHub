// socket.js
import { Server } from "socket.io"

let users = {};

const initSocket = (io) => {
  
  io.on("connection", (socket) => {
    console.log("🔌 New user connected:", socket.id);

    socket.on("location", (data) => {
      users[socket.id] = data;
      io.emit("users-locations", users);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      delete users[socket.id];
      io.emit("users-locations", users);
    });
  });

  return io;
};

export default initSocket;
