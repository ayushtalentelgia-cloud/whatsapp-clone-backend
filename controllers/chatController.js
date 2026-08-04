const Chat = require("../models/Chat");
const User = require("../models/User");

// ================= Create or Access One-to-One Chat =================

const accessChat = async (req, res) => {
    try {

        console.log("========== ACCESS CHAT ==========");
        console.log("BODY =>", req.body);
        console.log("USER =>", req.user);

        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Receiver phone number is required",
            });
        }

        // Find receiver by phone number
        const receiver = await User.findOne({ phone });

        console.log("RECEIVER =>", receiver);

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found",
            });
        }

        if (receiver._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot chat with yourself",
            });
        }

        console.log("Finding Existing Chat...");

        let chat = await Chat.findOne({
            isGroupChat: false,
            users: {
                $all: [req.user.id, receiver._id],
            },
        })
            .populate("users", "-password")
            .populate("latestMessage");

        console.log("Existing Chat =>", chat);

        if (chat) {
            return res.status(200).json({
                success: true,
                chat,
            });
        }

        console.log("Creating New Chat...");

        chat = await Chat.create({
            chatName: receiver.name,
            isGroupChat: false,
            users: [req.user.id, receiver._id],
        });

        chat = await Chat.findById(chat._id)
            .populate("users", "-password");

        console.log("Chat Created =>", chat);

        res.status(201).json({
            success: true,
            message: "Chat Created Successfully",
            chat,
        });

    } catch (error) {

        console.log("CHAT ERROR =>", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ================= Fetch All Chats =================

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
            .populate("latestMessage")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: chats.length,
            chats,
        });

    } catch (error) {

        console.log("FETCH CHAT ERROR =>", error);

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