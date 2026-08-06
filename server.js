const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const cloudinary = require("cloudinary").v2;

// Routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Socket
const socketHandler = require("./socket/socket");
const { setIO } = require("./socket/socketManager");

// Load Environment Variables
dotenv.config();

// ================= CONNECT DATABASE =================

connectDB();

// ================= CLOUDINARY =================

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    api_key: process.env.CLOUDINARY_API_KEY,

    api_secret: process.env.CLOUDINARY_API_SECRET,

});

// ================= EXPRESS =================

const app = express();

// Middleware

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// ================= ROOT =================

app.get("/", (req, res) => {

    res.send("✅ WhatsApp Clone Backend is Running 🚀");

});

// ================= HTTP SERVER =================

const server = http.createServer(app);

// ================= SOCKET =================

const io = new Server(server, {

    cors: {

        origin: "*",

        methods: ["GET", "POST"],

    },

});

setIO(io);

socketHandler(io);

// ================= ROUTES =================

app.use("/api/users", userRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});