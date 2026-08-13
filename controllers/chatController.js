const Chat = require("../models/Chat");
const User = require("../models/User");

// =========================================
// ACCESS CHAT
// =========================================

const accessChat = async (req, res) => {

    try {

        const { userId, phone } = req.body;

        let receiver = null;

        // Find by User ID
        if (userId) {

            receiver = await User.findById(userId);

        }

        // Find by Phone
        else if (phone) {

            receiver = await User.findOne({

                phone

            });

        }

        else {

            return res.status(400).json({

                success: false,

                message: "User ID or Phone is required."

            });

        }

        if (!receiver) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        if (

            receiver._id.toString() ===

            req.user._id.toString()

        ) {

            return res.status(400).json({

                success: false,

                message: "You cannot chat with yourself."

            });

        }

        // Existing Chat
        let chat = await Chat.findOne({

            isGroupChat: false,

            users: {

                $all: [

                    req.user._id,

                    receiver._id

                ]

            }

        })

        .populate("users", "-password")

        .populate({
    path: "latestMessage",
    populate: {
        path: "sender",
        select: "name phone email profilePic"
    }
});

        if (chat) {

            return res.status(200).json({

                success: true,

                chat

            });

        }

        // Create New Chat
        chat = await Chat.create({

            chatName: receiver.name,

            isGroupChat: false,

            users: [

                req.user._id,

                receiver._id

            ]

        });

        chat = await Chat.findById(chat._id)

            .populate("users", "-password");

        return res.status(201).json({

            success: true,

            message: "Chat Created Successfully.",

            chat

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =========================================
// FETCH CHATS
// =========================================

const fetchChats = async (req, res) => {

    try {

        const chats = await Chat.find({

            users: {

                $elemMatch: {

                    $eq: req.user._id

                }

            },

        })

        .populate("users", "-password")

        .populate("groupAdmin", "-password")

        .populate({

            path: "latestMessage",

            populate: {

                path: "sender",

                select: "name phone email profilePic"

            }

        })

        .sort({

            isPinned: -1,

            updatedAt: -1

        });
// console.log(
//     "CHAT UNREAD DATA:",
//     chats.map(
//         chat => ({
//             id: chat._id,
//             unreadCounts:
//                 chat.unreadCounts
//         })
//     )
// );
        return res.status(200).json({

            success: true,

            count: chats.length,

            chats

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// =========================================
// CREATE GROUP CHAT
// =========================================

const createGroupChat = async (req, res) => {

    try {

        const {

            chatName,

            users,

            description,

        } = req.body;

        if (!chatName || !users) {

            return res.status(400).json({

                success: false,

                message: "Group name and users are required."

            });

        }

        let groupUsers = users;

        // If users comes as stringified JSON
        if (typeof users === "string") {

            groupUsers = JSON.parse(users);

        }

        if (groupUsers.length < 2) {

            return res.status(400).json({

                success: false,

                message: "A group must have at least 3 members."

            });

        }

        groupUsers.push(req.user._id);

        let groupChat = await Chat.create({

            chatName,

            isGroupChat: true,

            users: groupUsers,

            groupAdmin: req.user._id,

            description: description || "",

        });

        groupChat = await Chat.findById(groupChat._id)

            .populate("users", "-password")

            .populate("groupAdmin", "-password");

        return res.status(201).json({

            success: true,

            message: "Group Created Successfully.",

            chat: groupChat,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// RENAME GROUP
// =========================================

const renameGroup = async (req, res) => {

    try {

        const {

            chatId,

            chatName,

        } = req.body;

        if (!chatId || !chatName) {

            return res.status(400).json({

                success: false,

                message: "Chat ID and New Name are required."

            });

        }

        let chat = await Chat.findById(chatId);

        if (!chat) {

            return res.status(404).json({

                success: false,

                message: "Group not found."

            });

        }

        if (

            !chat.groupAdmin ||

            chat.groupAdmin.toString() !== req.user._id.toString()

        ) {

            return res.status(403).json({

                success: false,

                message: "Only Group Admin can rename the group."

            });

        }

        chat.chatName = chatName;

        await chat.save();

        chat = await Chat.findById(chat._id)

            .populate("users", "-password")

            .populate("groupAdmin", "-password");

        return res.status(200).json({

            success: true,

            message: "Group Renamed Successfully.",

            chat,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// =========================================
// ADD TO GROUP
// =========================================

const addToGroup = async (req, res) => {

    try {

        const { chatId, userId } = req.body;

        if (!chatId || !userId) {

            return res.status(400).json({

                success: false,

                message: "Chat ID and User ID are required."

            });

        }

        let chat = await Chat.findById(chatId);

        if (!chat) {

            return res.status(404).json({

                success: false,

                message: "Group not found."

            });

        }

        if (

            chat.groupAdmin.toString() !==

            req.user._id.toString()

        ) {

            return res.status(403).json({

                success: false,

                message: "Only Group Admin can add members."

            });

        }

        if (

            chat.users.includes(userId)

        ) {

            return res.status(400).json({

                success: false,

                message: "User already exists in group."

            });

        }

        chat.users.push(userId);

        await chat.save();

        chat = await Chat.findById(chat._id)

            .populate("users", "-password")

            .populate("groupAdmin", "-password");

        return res.status(200).json({

            success: true,

            message: "Member Added Successfully.",

            chat,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// REMOVE FROM GROUP
// =========================================

const removeFromGroup = async (req, res) => {

    try {

        const { chatId, userId } = req.body;

        if (!chatId || !userId) {

            return res.status(400).json({

                success: false,

                message: "Chat ID and User ID are required."

            });

        }

        let chat = await Chat.findById(chatId);

        if (!chat) {

            return res.status(404).json({

                success: false,

                message: "Group not found."

            });

        }

        if (

            chat.groupAdmin.toString() !==

            req.user._id.toString()

        ) {

            return res.status(403).json({

                success: false,

                message: "Only Group Admin can remove members."

            });

        }

        chat.users = chat.users.filter(

            member =>

                member.toString() !== userId

        );

        await chat.save();

        chat = await Chat.findById(chat._id)

            .populate("users", "-password")

            .populate("groupAdmin", "-password");

        return res.status(200).json({

            success: true,

            message: "Member Removed Successfully.",

            chat,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// LEAVE GROUP
// =========================================

const leaveGroup = async (req, res) => {

    try {

        const { chatId } = req.body;

        let chat = await Chat.findById(chatId);

        if (!chat) {

            return res.status(404).json({

                success: false,

                message: "Group not found."

            });

        }

        chat.users = chat.users.filter(

            member =>

                member.toString() !==

                req.user._id.toString()

        );

        // If Admin leaves, make next member admin
        if (

            chat.groupAdmin &&

            chat.groupAdmin.toString() ===

            req.user._id.toString()

        ) {

            if (chat.users.length > 0) {

                chat.groupAdmin = chat.users[0];

            }

            else {

                await Chat.findByIdAndDelete(chatId);

                return res.status(200).json({

                    success: true,

                    message: "Group Deleted."

                });

            }

        }

        await chat.save();

        chat = await Chat.findById(chat._id)

            .populate("users", "-password")

            .populate("groupAdmin", "-password");

        return res.status(200).json({

            success: true,

            message: "You Left the Group.",

            chat,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// =========================================
// PIN CHAT
// =========================================

const pinChat = async (req, res) => {

    try {

        const { chatId } = req.body;

        let chat = await Chat.findById(chatId);

        if (!chat) {

            return res.status(404).json({

                success: false,

                message: "Chat not found."

            });

        }

        chat.isPinned = !chat.isPinned;

        await chat.save();

        return res.status(200).json({

            success: true,

            message: chat.isPinned
                ? "Chat Pinned Successfully."
                : "Chat Unpinned Successfully.",

            chat,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// MUTE CHAT
// =========================================

const muteChat = async (req, res) => {

    try {

        const { chatId } = req.body;

        let chat = await Chat.findById(chatId);

        if (!chat) {

            return res.status(404).json({

                success: false,

                message: "Chat not found."

            });

        }

        chat.isMuted = !chat.isMuted;

        await chat.save();

        return res.status(200).json({

            success: true,

            message: chat.isMuted
                ? "Chat Muted Successfully."
                : "Chat Unmuted Successfully.",

            chat,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// ARCHIVE CHAT
// =========================================

const archiveChat = async (req, res) => {

    try {

        const { chatId } = req.body;

        let chat = await Chat.findById(chatId);

        if (!chat) {

            return res.status(404).json({

                success: false,

                message: "Chat not found."

            });

        }

        chat.isArchived = !chat.isArchived;

        await chat.save();

        return res.status(200).json({

            success: true,

            message: chat.isArchived
                ? "Chat Archived Successfully."
                : "Chat Restored Successfully.",

            chat,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// EXPORTS
// =========================================

module.exports = {

    accessChat,

    fetchChats,

    createGroupChat,

    renameGroup,

    addToGroup,

    removeFromGroup,

    leaveGroup,

    pinChat,

    muteChat,

    archiveChat,

};