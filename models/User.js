const mongoose = require("mongoose");

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
        default: null,
    }

}, { _id: true });

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true,
        trim: true,
    },

    // Mobile Number
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    profilePic: {
        type: String,
        default: "",
    },

    // ================= CONTACTS =================

    contacts: {
        type: [contactSchema],
        default: [],
    }

},
{
    timestamps: true,
}
);

module.exports = mongoose.model("User", userSchema);