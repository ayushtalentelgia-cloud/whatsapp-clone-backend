const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
//const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
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

// =========================================
// LOAD ENV
// =========================================

dotenv.config();

// =========================================
// CONNECT DATABASE
// =========================================

connectDB();

// =========================================
// CLOUDINARY
// =========================================

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    api_key: process.env.CLOUDINARY_API_KEY,

    api_secret: process.env.CLOUDINARY_API_SECRET,

});

// =========================================
// EXPRESS
// =========================================

const app = express();

// =========================================
// RATE LIMITER
// =========================================

const limiter = rateLimit({

    windowMs: 15 * 60 * 1000,

    max: 10000,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

        success: false,

        message: "Too many requests. Please try again later."

    }

});

// =========================================
// SECURITY
// =========================================

app.use(
    helmet({

        contentSecurityPolicy: {

            directives: {

                defaultSrc: ["'self'"],

                imgSrc: [

                    "'self'",

                    "data:",

                    "https://res.cloudinary.com",

                    "https://ui-avatars.com"

                ],

                scriptSrc: [

                    "'self'",

                    "'unsafe-inline'",

                    "https://cdn.jsdelivr.net"

                ],

                styleSrc: [

                    "'self'",

                    "'unsafe-inline'",

                    "https://cdnjs.cloudflare.com"

                ],

                fontSrc: [

                    "'self'",

                    "https://cdnjs.cloudflare.com"

                ],

                connectSrc: [

                    "'self'",

                    "ws:",

                    "wss:",

                    "https://whatsapp-clone-backend-b5o7.onrender.com"

                ]

            }

        }

    })
);

app.use(cors({

    origin: true,

    credentials: true,

}));
///app.use(limiter);

///app.use(mongoSanitize());

app.use(hpp());

// =========================================
// BODY PARSER
// =========================================

app.use(express.json());

app.use(express.urlencoded({

    extended: true

}));

app.use(express.static("public"));

// =========================================
// ROOT
// =========================================

app.get("/", (req, res) => {

    res.send("✅ WhatsApp Clone Backend is Running 🚀");

});

// =========================================
// HTTP SERVER
// =========================================

const server = http.createServer(app);

// =========================================
// SOCKET
// =========================================

const io = new Server(server, {

    cors: {

        origin: true,

        credentials: true,

        methods: ["GET", "POST"],

    },

});

setIO(io);

socketHandler(io);

// =========================================
// ROUTES
// =========================================

app.use("/api/users", userRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

// =========================================
// START SERVER
// =========================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});