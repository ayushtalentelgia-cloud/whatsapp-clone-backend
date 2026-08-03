const express = require("express");

const router = express.Router();

const {
    sendMessage,
    allMessages,
    markMessageAsSeen,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

// ================= Send Message =================
router.post("/", protect, sendMessage);

// ================= Get All Messages =================
router.get("/:chatId", protect, allMessages);

// ================= Mark Message As Seen (REST fallback) =================
router.put("/seen/:messageId", protect, markMessageAsSeen);

module.exports = router;