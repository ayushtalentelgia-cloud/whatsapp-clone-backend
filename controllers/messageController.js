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
           .populate("sender", "name email phone profilePic")
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

        // Send message to everyone in chat
        io.to(chatId).emit("message received", message);

        console.log("📩 Message Sent");

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
           .populate("sender", "name email phone profilePic")
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

// ================= MARK MESSAGE DELIVERED =================

const markMessageAsDelivered = async (req, res) => {

    try {

        const { messageId } = req.params;

        let message = await Message.findById(messageId);

        if (!message) {

            return res.status(404).json({
                success: false,
                message: "Message not found",
            });

        }

        if (!message.delivered) {

            message.delivered = true;
            message.deliveredAt = new Date();

            await message.save();

        }

        message = await Message.findById(message._id)
            .populate("sender", "name email phone profilePic")
            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "-password",
                },
            });

        const io = getIO();

        io.to(message.sender._id.toString()).emit(
            "message delivered",
            message
        );

        console.log("✅ Message Delivered");

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

// ================= MARK MESSAGE SEEN =================

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
            .populate("sender", "name email phone profilePic")
            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "-password",
                },
            });

        const io = getIO();

        io.to(message.sender._id.toString()).emit(
            "message seen",
            message
        );

        console.log("👀 Message Seen");

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
// ================= EDIT MESSAGE =================

const editMessage = async (req, res) => {

    try {

        const { messageId } = req.params;
        const { content } = req.body;

        let message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        if (message.sender.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not allowed"
            });
        }

        const diff = Date.now() - new Date(message.createdAt).getTime();

        if (diff > 5 * 60 * 1000) {
            return res.status(400).json({
                success: false,
                message: "Edit time expired"
            });
        }

        message.content = content;
        message.edited = true;
        message.editedAt = new Date();

        await message.save();

        message = await Message.findById(message._id)
            .populate("sender", "name email phone profilePic")
            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "-password",
                },
            });

        getIO().to(message.chat._id.toString()).emit("message edited", message);

        return res.json({
            success: true,
            message
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};


// ================= DELETE MESSAGE =================

const deleteMessage = async (req, res) => {

    try {

        const { messageId } = req.params;

        let message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        if (message.sender.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not allowed"
            });
        }

        const diff = Date.now() - new Date(message.createdAt).getTime();

        if (diff > 5 * 60 * 1000) {
            return res.status(400).json({
                success: false,
                message: "Delete time expired"
            });
        }

        message.deleted = true;
        message.deletedAt = new Date();
        message.content = "This message was deleted";

        await message.save();

        message = await Message.findById(message._id)
           .populate("sender", "name email phone profilePic")
            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "-password",
                },
            });

        getIO().to(message.chat._id.toString()).emit("message deleted", message);

        return res.json({
            success: true,
            message
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    sendMessage,
    allMessages,
    markMessageAsDelivered,
    markMessageAsSeen,
    editMessage,
    deleteMessage,
};