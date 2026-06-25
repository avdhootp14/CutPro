import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

console.log("RAZORPAY_KEY_ID =", process.env.RAZORPAY_KEY_ID);
console.log(
  "RAZORPAY_KEY_SECRET =",
  process.env.RAZORPAY_KEY_SECRET
);

import app from "./app.js";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL 
      ? process.env.CLIENT_URL.split(',') 
      : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000", "http://192.168.1.3:3000"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  },
});

// Attach io to Express app so controllers can use it
app.set("io", io);

io.on("connection", (socket) => {
  console.log("⚡ A client connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("❌ A client disconnected:", socket.id);
  });
});

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
