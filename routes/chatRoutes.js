const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  accessChat,
  fetchChats,
} = require("../controllers/chatController");

// Create or Access Chat
router.post("/", protect, accessChat);

// Get All Chats
router.get("/", protect, fetchChats);

module.exports = router;