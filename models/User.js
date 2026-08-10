const mongoose = require("mongoose");

// =========================================
// CONTACT SCHEMA
// =========================================

const contactSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },

    phone: {
        type: String,
        required: true,
        trim: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

});

// =========================================
// USER SCHEMA
// =========================================

const userSchema = new mongoose.Schema(

    {

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        profilePic: {
            type: String,
            default: "",
        },

        about: {
            type: String,
            default: "Hey there! I am using WhatsApp Clone.",
        },

        contacts: [contactSchema],

        isOnline: {
            type: Boolean,
            default: false,
        },

        lastSeen: {
            type: Date,
            default: Date.now,
        },

    },

    {

        timestamps: true,

    }

);

// =========================================
// EXPORT
// =========================================

module.exports = mongoose.model("User", userSchema);