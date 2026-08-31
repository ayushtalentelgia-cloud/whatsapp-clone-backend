const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {

    sendMessage,
    allMessages,
    markMessageAsDelivered,
    markMessageAsSeen,
    editMessage,
    deleteMessage,
    reactToMessage,

} = require("../controllers/messageController");

// =========================================
// SEND MESSAGE
// =========================================

router.post(

    "/",

    protect,

    upload.single("file"),

    sendMessage

);

// =========================================
// GET ALL MESSAGES
// =========================================

router.get("/:chatId", protect, allMessages);

// =========================================
// MARK DELIVERED
// =========================================

router.put(

    "/delivered/:messageId",

    protect,

    markMessageAsDelivered

);

// =========================================
// MARK SEEN
// =========================================

router.put(

    "/seen/:messageId",

    protect,

    markMessageAsSeen

);

// =========================================
// EDIT MESSAGE
// =========================================

router.put(

    "/edit/:messageId",

    protect,

    editMessage

);

// =========================================
// DELETE MESSAGE
// =========================================

router.put(

    "/delete/:messageId",

    protect,

    deleteMessage

);


// =========================================
// REACT TO MESSAGE
// =========================================

router.put(

    "/react/:messageId",

    protect,

    reactToMessage

);

module.exports = router;