const mongoose = require("mongoose");

// =========================================
// CHAT SCHEMA
// =========================================

const chatSchema = new mongoose.Schema(

    {

        // Chat Name
        chatName: {

            type: String,

            trim: true,

            default: "Private Chat",

        },

        // Group or Private
        isGroupChat: {

            type: Boolean,

            default: false,

        },

        // Users
        users: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User",

            },

        ],

        // Latest Message
        latestMessage: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Message",

        },

        // Group Admin
        groupAdmin: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null,

        },

        // Group Icon
        groupIcon: {

            type: String,

            default: "",

        },

        // Group Description
        description: {

            type: String,

            default: "",

        },

        // Unread Count
        unreadCount: {

            type: Number,

            default: 0,

        },

        // Mute Chat
        isMuted: {

            type: Boolean,

            default: false,

        },

        // Archive Chat
        isArchived: {

            type: Boolean,

            default: false,

        },

        // Pin Chat
        isPinned: {

            type: Boolean,

            default: false,

        }

    },

    {

        timestamps: true,

    }

);

// =========================================
// EXPORT
// =========================================

module.exports = mongoose.model("Chat", chatSchema);