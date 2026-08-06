const express = require("express");

const router = express.Router();

const {
    sendMessage,
    allMessages,
    markMessageAsSeen,
    editMessage,
    deleteMessage,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

// ================= Send Message =================
router.post("/", protect, sendMessage);

// ================= Get All Messages =================
router.get("/:chatId", protect, allMessages);

// ================= Edit Message (5 Minutes) =================
router.put("/:messageId", protect, editMessage);

// ================= Delete Message (5 Minutes) =================
router.delete("/:messageId", protect, deleteMessage);

// ================= Mark Message As Seen =================
router.put("/seen/:messageId", protect, markMessageAsSeen);

module.exports = router;