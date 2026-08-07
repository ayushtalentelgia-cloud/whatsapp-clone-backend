const mongoose = require("mongoose");

// =========================================
// MESSAGE SCHEMA
// =========================================

const messageSchema = new mongoose.Schema(

    {

        // Sender
        sender: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true,

        },

        // Chat
        chat: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Chat",

            required: true,

        },

        // Text Message
        content: {

            type: String,

            default: "",

            trim: true,

        },

        // Message Type
        type: {

            type: String,

            enum: [

                "text",

                "image",

                "video",

                "audio",

                "file"

            ],

            default: "text",

        },

        // File URL
        fileUrl: {

            type: String,

            default: "",

        },

        // File Name
        fileName: {

            type: String,

            default: "",

        },

        // Reply Message
        replyTo: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Message",

            default: null,

        },

        // Forwarded
        forwarded: {

            type: Boolean,

            default: false,

        },

        // Delivered
        delivered: {

            type: Boolean,

            default: false,

        },

        deliveredAt: {

            type: Date,

            default: null,

        },

        // Seen
        seen: {

            type: Boolean,

            default: false,

        },

        seenBy: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            default: null,

        },

        seenAt: {

            type: Date,

            default: null,

        },

        // Edited
        edited: {

            type: Boolean,

            default: false,

        },

        editedAt: {

            type: Date,

            default: null,

        },

        // Deleted
        deleted: {

            type: Boolean,

            default: false,

        },

        deletedAt: {

            type: Date,

            default: null,

        }

    },

    {

        timestamps: true,

    }

);

// =========================================
// EXPORT
// =========================================

module.exports = mongoose.model("Message", messageSchema);