const Chat = require("../models/Chat");
const User = require("../models/User");

// ================= Create or Access Chat =================

const accessChat = async (req, res) => {
    try {

        const { userId, phone } = req.body;

        let receiver = null;

        // ---------- Find by userId ----------
        if (userId) {

            receiver = await User.findById(userId);

        }

        // ---------- Find by phone ----------
        else if (phone) {

            receiver = await User.findOne({ phone });

        }

        else {

            return res.status(400).json({
                success: false,
                message: "User ID or Phone is required",
            });

        }

        if (!receiver) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });

        }

        if (receiver._id.toString() === req.user.id) {

            return res.status(400).json({
                success: false,
                message: "You cannot chat with yourself",
            });

        }

        // Existing Chat

        let chat = await Chat.findOne({

            isGroupChat: false,

            users: {
                $all: [req.user.id, receiver._id],
            },

        })

            .populate("users", "-password")
            .populate("latestMessage");

        if (chat) {

            return res.status(200).json({
                success: true,
                chat,
            });

        }

        // Create New Chat

        chat = await Chat.create({

            chatName: receiver.name,

            isGroupChat: false,

            users: [req.user.id, receiver._id],

        });

        chat = await Chat.findById(chat._id)

            .populate("users", "-password");

        res.status(201).json({

            success: true,

            message: "Chat Created Successfully",

            chat,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ================= Fetch Chats =================

const fetchChats = async (req, res) => {

    try {

        const chats = await Chat.find({

            users: {

                $elemMatch: {

                    $eq: req.user.id,

                },

            },

        })

            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate({
                path: "latestMessage",
                populate: {
                    path: "sender",
                    select: "name email phone",
                },
            })
            .sort({ updatedAt: -1 });

        res.status(200).json({

            success: true,

            count: chats.length,

            chats,

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

module.exports = {

    accessChat,

    fetchChats,

};