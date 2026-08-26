const mongoose = require("mongoose");

// =========================================
// CHAT SCHEMA
// =========================================

const chatSchema = new mongoose.Schema(

    {

        chatName: {

            type: String,

            trim: true,

            default: "Private Chat",

        },

        isGroupChat: {

            type: Boolean,

            default: false,

        },

        users: [

            {

                type: mongoose.Schema.Types.ObjectId,

                ref: "User",

            },

        ],

        latestMessage: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Message",

        },

        groupAdmin: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null,

        },

        groupIcon: {

            type: String,

            default: "",

        },

        description: {

            type: String,

            default: "",

        },

        // =========================================
        // OLD UNREAD COUNT
        // =========================================

        unreadCount: {

            type: Number,

            default: 0,

        },

        // =========================================
        // PER USER UNREAD COUNT
        // =========================================

        unreadCounts: [

            {

                user: {

                    type:
                        mongoose.Schema.Types.ObjectId,

                    ref: "User",

                },

                count: {

                    type: Number,

                    default: 0,

                },

            }

        ],

        isMuted: {

            type: Boolean,

            default: false,

        },

        isArchived: {

            type: Boolean,

            default: false,

        },

        isPinned: {

            type: Boolean,

            default: false,

        },

        // =========================================
        // PER USER DELETED CHAT
        // =========================================

        deletedFor: [

            {

                user: {

                    type:
                        mongoose.Schema.Types.ObjectId,

                    ref: "User"

                },

                deletedAt: {

                    type: Date,

                    default: Date.now

                }

            }

        ]

    },

    {

        timestamps: true,

    }

);

// =========================================
// EXPORT
// =========================================

module.exports =
    mongoose.model(
        "Chat",
        chatSchema
    );