const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Socket
const socketHandler = require("./socket/socket");
const { setIO } = require("./socket/socketManager");

// Load Environment Variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Root Route (Health Check)
app.get("/", (req, res) => {
    res.send("✅ WhatsApp Clone Backend is Running 🚀");
});

// Create HTTP Server
const server = http.createServer(app);

// Create Socket.IO Server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Save io globally
setIO(io);

// Initialize Socket Events
socketHandler(io);

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});