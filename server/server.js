import http from "http";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import connectDB from "./config/db.js";
import initLeaderboardSocket from "./leaderBoardSocket.js";
import initSocket from "./mapSocket.js";
import app from "./index.js";

dotenv.config({ path: "./.env" });

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

/* ================= SOCKET AUTH MIDDLEWARE ================= */
io.use((socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) return next(new Error("AUTH_REQUIRED"));

    const token = cookie.parse(cookies).jwt;
    if (!token) return next(new Error("TOKEN_MISSING"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("INVALID_TOKEN"));
  }
});



/* ================= DATABASE ================= */
connectDB();

/* ================= SOCKET LOGIC ================= */
initSocket(io);
initLeaderboardSocket(io);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
