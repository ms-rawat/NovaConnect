// server/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoute");
const socketHandler = require('./socket/socketHandler');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const httpServer = createServer(app); // Create HTTP server for Socket.io

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://novaconnect-tau.vercel.app"], // Your Vite Client URL
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies

// Socket.io Setup
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://novaconnect-tau.vercel.app/"],
    methods: ["GET", "POST"]
  }
});

// Socket.io Handler
socketHandler(io);

app.get('/', (req, res) => {
  res.send('NovaConnect API is running...');
});
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/friend-requests", require("./routes/friendRequestRoutes"));
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});