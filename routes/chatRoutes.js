const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  accessChat,
  fetchChats,
  deleteChat,
} = require("../controllers/chatController");

// Create or Access Chat
router.post("/", protect, accessChat);

// Get All Chats
router.get("/", protect, fetchChats);

// Delete Chat For Current User
router.delete(
  "/:chatId",
  protect,
  deleteChat
);

module.exports = router;