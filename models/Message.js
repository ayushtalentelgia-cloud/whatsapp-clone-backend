const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    content: {
      type: String,
      trim: true,
      default: "",
    },

    delivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

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

    // ===== NEW FIELDS =====

    edited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    deleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);