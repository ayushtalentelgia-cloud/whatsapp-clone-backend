const mongoose = require("mongoose");

// =========================================
// COMMENT SCHEMA
// =========================================

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        text: {
            type: String,
            required: true,
            trim: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);


// =========================================
// POST SCHEMA
// =========================================

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // =====================================
        // MEDIA
        // =====================================

        mediaUrl: {
            type: String,
            required: true
        },

        mediaType: {
            type: String,
            enum: [
                "image",
                "video"
            ],
            required: true
        },


        // =====================================
        // CAPTION
        // =====================================

        caption: {
            type: String,
            default: "",
            trim: true,
            maxlength: 2000
        },


        // =====================================
        // LIKES
        // =====================================

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],


        // =====================================
        // COMMENTS
        // =====================================

        comments: [
            commentSchema
        ]

    },
    {
        timestamps: true
    }
);


module.exports =
    mongoose.model(
        "Post",
        postSchema
    );