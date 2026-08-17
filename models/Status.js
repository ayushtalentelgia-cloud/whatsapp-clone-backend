const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        mediaUrl: {
            type: String,
            required: true
        },

        mediaType: {
            type: String,
            enum: ["image", "video"],
            required: true
        },

        caption: {
            type: String,
            default: ""
        },

        viewers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        expiresAt: {
            type: Date,
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Status", statusSchema);