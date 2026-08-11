const mongoose = require("mongoose");

// =========================================
// PENDING REGISTRATION SCHEMA
// =========================================

const pendingRegistrationSchema = new mongoose.Schema(

    {

        // =========================================
        // USER DETAILS
        // =========================================

        name: {

            type: String,

            required: true,

            trim: true,

        },

        email: {

            type: String,

            required: true,

            lowercase: true,

            trim: true,

        },

        phone: {

            type: String,

            required: true,

            trim: true,

        },

        passwordHash: {

            type: String,

            required: true,

        },

        // =========================================
        // EMAIL OTP
        // =========================================

        emailOtpHash: {

            type: String,

            required: true,

        },

        // =========================================
        // PHONE OTP
        // =========================================

        phoneOtpHash: {

            type: String,

            required: true,

        },

        // =========================================
        // OTP EXPIRY
        // =========================================

        otpExpiresAt: {

            type: Date,

            required: true,

        },

        // =========================================
        // OTP ATTEMPTS
        // =========================================

        otpAttempts: {

            type: Number,

            default: 0,

        },

    },

    {

        timestamps: true,

    }

);

// =========================================
// AUTOMATIC CLEANUP
// =========================================

pendingRegistrationSchema.index(

    { otpExpiresAt: 1 },

    { expireAfterSeconds: 0 }

);

module.exports = mongoose.model(

    "PendingRegistration",

    pendingRegistrationSchema

);