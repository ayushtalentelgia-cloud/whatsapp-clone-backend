const Message = require("../models/Message");

const onlineUsers = {};

const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("🟢 Socket Connected :", socket.id);

        // ================= SETUP =================

        socket.on("setup", (userData) => {
            socket.join(userData._id);

            onlineUsers[userData._id] = socket.id;

            console.log("✅ User Setup :", userData.name);

            socket.emit("connected");

            io.emit("user online", userData);
        });

        // ================= JOIN CHAT =================

        socket.on("join chat", (chatId) => {
            socket.join(chatId);

            console.log("📥 Joined Chat :", chatId);
        });

        // ================= TYPING =================

        socket.on("typing", (chatId) => {
            socket.to(chatId).emit("typing");
        });

        socket.on("stop typing", (chatId) => {
            socket.to(chatId).emit("stop typing");
        });

        // ================= MESSAGE DELIVERED =================

        socket.on("message delivered", async ({ messageId }) => {
            try {
                let message = await Message.findById(messageId)
                    .populate("sender", "-password")
                    .populate({
                        path: "chat",
                        populate: {
                            path: "users",
                            select: "-password",
                        },
                    });

                if (!message) return;

                if (!message.delivered) {
                    message.delivered = true;
                    message.deliveredAt = new Date();

                    await message.save();
                }

                io.to(message.sender._id.toString()).emit(
                    "message delivered",
                    message
                );

                console.log("✅ Delivered :", message._id);
            } catch (error) {
                console.log(error.message);
            }
        });

        // ================= MESSAGE SEEN =================

        socket.on("message seen", async ({ messageId, userId }) => {
            try {
                let message = await Message.findById(messageId)
                    .populate("sender", "-password")
                    .populate({
                        path: "chat",
                        populate: {
                            path: "users",
                            select: "-password",
                        },
                    });

                if (!message) return;

                if (!message.seen) {
                    message.seen = true;
                    message.seenBy = userId;
                    message.seenAt = new Date();

                    await message.save();
                }

                io.to(message.sender._id.toString()).emit(
                    "message seen",
                    message
                );

                console.log("👀 Seen :", message._id);
            } catch (error) {
                console.log(error.message);
            }
        });

        // ================= DISCONNECT =================

        socket.on("disconnect", () => {
            console.log("🔴 Socket Disconnected :", socket.id);

            let disconnectedUser = null;

            for (const userId in onlineUsers) {
                if (onlineUsers[userId] === socket.id) {
                    disconnectedUser = userId;

                    delete onlineUsers[userId];

                    break;
                }
            }

            if (disconnectedUser) {
                io.emit("user offline", {
                    _id: disconnectedUser,
                });
            }
        });
    });
};

module.exports = socketHandler;