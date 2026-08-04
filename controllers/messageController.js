const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { getIO } = require("../socket/socketManager");

// ================= SEND MESSAGE =================

const sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;

        if (!content || !chatId) {
            return res.status(400).json({
                success: false,
                message: "Content and Chat ID are required",
            });
        }

        let message = await Message.create({
            sender: req.user.id,
            content,
            chat: chatId,
        });

        message = await Message.findById(message._id)
            .populate("sender", "-password")
            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "-password",
                },
            });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message._id,
        });

        const io = getIO();

        // Emit only inside the chat room
        io.to(chatId).emit("message received", message);

        console.log("📩 Real-Time Message Sent");

        return res.status(201).json({
            success: true,
            message,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= GET ALL MESSAGES =================

const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            chat: req.params.chatId,
        })
            .populate("sender", "-password")
            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "-password",
                },
            })
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            messages,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ================= Mark Message As Delivered =================

const markMessageAsDelivered = async (req, res) => {

    try {

        const { messageId } = req.params;

        let message = await Message.findByIdAndUpdate(

            messageId,

            {
                delivered: true,
                deliveredAt: new Date(),
            },

            {
                new: true,
            }

        )
            .populate("sender", "-password")
            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "-password",
                },
            });

        if (!message) {

            return res.status(404).json({
                success: false,
                message: "Message not found",
            });

        }

        const io = getIO();

        // Sirf sender ko notify karo
        io.to(message.sender._id.toString()).emit("message delivered", message);

        console.log("✅ Message Delivered Event Sent");

        res.status(200).json({

            success: true,
            message: "Message marked as delivered",
            data: message,

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message,

        });

    }

};
// ================= MARK MESSAGE AS SEEN (REST fallback) =================
// Used when opening a chat with older unseen messages.
// Real-time "seen" during an active chat goes through the socket event instead.

const markMessageAsSeen = async (req, res) => {
    try {
        const { messageId } = req.params;

        let message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }

        if (!message.seen) {
            message.seen = true;
            message.seenBy = req.user.id;
            message.seenAt = new Date();

            await message.save();
        }

        message = await Message.findById(message._id)
            .populate("sender", "-password")
            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "-password",
                },
            });

        const io = getIO();

        io.to(message.sender._id.toString()).emit("message seen", message);

        console.log("👀 Message Seen (REST)");

        return res.status(200).json({
            success: true,
            data: message,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    sendMessage,
    allMessages,
    markMessageAsSeen,
};