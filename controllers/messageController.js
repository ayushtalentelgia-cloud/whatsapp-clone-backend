const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { getIO } = require("../socket/socketManager");

// ================= SEND MESSAGE =================

const sendMessage = async (req, res) => {

    try {

        const {
            content,
            chatId,
            replyTo
        } = req.body;

        if (!chatId) {

            return res.status(400).json({

                success: false,

                message: "Chat ID is required."

            });

        }

        // ================= FILE DETAILS =================

        let type = "text";

        let fileUrl = "";

        let fileName = "";

        if (req.file) {

            fileUrl = req.file.path;

            fileName = req.file.originalname;

            if (req.file.mimetype.startsWith("image/")) {

                type = "image";

            }

            else if (req.file.mimetype.startsWith("video/")) {

                type = "video";

            }

            else if (req.file.mimetype.startsWith("audio/")) {

                type = "audio";

            }

            else {

                type = "file";

            }

        }

        // ================= REPLY DEBUG =================

        console.log(
            "🔎 BACKEND REPLY INPUT:",
            {
                replyTo,
                chatId,
                content
            }
        );

        // ================= CREATE MESSAGE =================

        let message = await Message.create({

            sender: req.user._id,

            chat: chatId,

            content: content || "",

            type,

            fileUrl,

            fileName,

            // =============================
            // REPLY MESSAGE
            // =============================

            replyTo:
                replyTo || null,

        });

        console.log(
            "🔎 SAVED MESSAGE REPLY TO:",
            message.replyTo
        );

        // ================= POPULATE =================

        message = await Message.findById(message._id)

            .populate(
                "sender",
                "name email phone profilePic"
            )

            // =====================================
            // POPULATE REPLIED MESSAGE
            // =====================================

            .populate({
                path: "replyTo",
                select:
                    "content type fileUrl fileName deleted createdAt"
            })

            .populate({

                path: "chat",

                populate: {

                    path: "users",

                    select: "-password",

                },

            });

        // ================= UPDATE CHAT =================

const chat = await Chat.findById(chatId);

if (chat) {

    chat.latestMessage =
        message._id;

    // =====================================
    // INCREASE UNREAD COUNT
    // FOR ALL USERS EXCEPT SENDER
    // =====================================

    chat.users.forEach(
        userId => {

            if (
                userId.toString() !==
                req.user._id.toString()
            ) {

                const existing =
                    chat.unreadCounts.find(
                        item =>
                            item.user.toString() ===
                            userId.toString()
                    );

                if (existing) {

                    existing.count += 1;

                }

                else {

                    chat.unreadCounts.push({

                        user:
                            userId,

                        count:
                            1

                    });

                }

            }

        }
    );

    await chat.save();

}
        // ================= SOCKET =================

        const io = getIO();

        io.to(chatId).emit("message received", message);

        console.log("📩 Message Sent");

        return res.status(201).json({

            success: true,

            message,

        });

    }

    catch (error) {

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

            .populate(
                "sender",
                "name email phone profilePic"
            )

            // =====================================
            // POPULATE REPLIED MESSAGE
            // =====================================

            .populate({
                path: "replyTo",
                select:
                    "content type fileUrl fileName deleted createdAt"
            })

            .populate({
                path: "chat",
                populate: {
                    path: "users",
                    select: "-password",
                },
            })

            .sort({
                createdAt: 1
            });

        return res.status(200).json({

            success: true,

            count:
                messages.length,

            messages,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error.message,

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
            message.seenBy = req.user._id;
            message.seenAt = new Date();

            await message.save();

        }
// =========================================
// RESET UNREAD COUNT
// =========================================

const chat = await Chat.findById(
    message.chat
);

if (chat) {

    const unreadEntry =
        chat.unreadCounts.find(
            item =>
                item.user.toString() ===
                req.user._id.toString()
        );

    if (unreadEntry) {

        unreadEntry.count = 0;

        await chat.save();

    }

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


// =========================================
// REACT TO MESSAGE
// =========================================

const reactToMessage = async (req, res) => {

    try {

        const { messageId } = req.params;
        const { emoji } = req.body;

        if (!emoji) {

            return res.status(400).json({

                success: false,

                message: "Emoji is required."

            });

        }

        const message =
            await Message.findById(messageId);

        if (!message) {

            return res.status(404).json({

                success: false,

                message: "Message not found."

            });

        }

        // =====================================
        // FIND USER'S EXISTING REACTION
        // =====================================

        const existingReaction =
            message.reactions.find(
                reaction =>
                    reaction.user.toString() ===
                    req.user._id.toString()
            );

        // =====================================
        // SAME EMOJI = REMOVE
        // =====================================

        if (
            existingReaction &&
            existingReaction.emoji === emoji
        ) {

            message.reactions =
                message.reactions.filter(
                    reaction =>
                        reaction.user.toString() !==
                        req.user._id.toString()
                );

        }

        // =====================================
        // DIFFERENT EMOJI = CHANGE
        // =====================================

        else if (existingReaction) {

            existingReaction.emoji =
                emoji;

        }

        // =====================================
        // NEW REACTION = ADD
        // =====================================

        else {

            message.reactions.push({

                user:
                    req.user._id,

                emoji

            });

        }

        await message.save();

        // =====================================
        // POPULATE REACTION USERS
        // =====================================

        const updatedMessage =
            await Message.findById(message._id)

                .populate(
                    "sender",
                    "name email phone profilePic"
                )

                .populate({

                    path:
                        "reactions.user",

                    select:
                        "name email phone profilePic"

                });

        // =====================================
        // REAL-TIME UPDATE
        // =====================================

        getIO()
            .to(message.chat.toString())
            .emit(
                "message reaction",
                updatedMessage
            );

        return res.status(200).json({

            success: true,

            message:
                updatedMessage

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error.message

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
    reactToMessage,
};