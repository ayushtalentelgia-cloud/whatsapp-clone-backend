const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
{
    chatName: {
        type: String,
        default: "sender",
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
        default: null,
    },

    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    // Latest activity time
    lastActivity: {
        type: Date,
        default: Date.now,
    }

},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Chat", chatSchema);