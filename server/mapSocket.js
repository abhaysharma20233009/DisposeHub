let users = {};
let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io; // 🔑 save reference

  io.on("connection", (socket) => {
    console.log("🔌 New user connected:", socket.id);

    socket.on("location", (data) => {
      users[socket.userId] = data;
      io.emit("users-locations", users);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      delete users[socket.id];
      io.emit("users-locations", users);
    });
  });
};

// ✅ emit bin thrown from anywhere
export const emitBinThrown = (id) => {
  if (ioInstance) {
    ioInstance.emit("bin-thrown", { id });
  }
};

export default initSocket;