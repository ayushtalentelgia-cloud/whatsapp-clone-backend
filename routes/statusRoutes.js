const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const upload =
    require("../middleware/uploadMiddleware");

const {
    createStatus,
    getStatuses,
    markStatusViewed
} = require("../controllers/statusController");


// =========================================
// CREATE STATUS
// =========================================

router.post(
    "/",
    protect,
    upload.single("status"),
    createStatus
);


// =========================================
// GET ACTIVE STATUSES
// =========================================

router.get(
    "/",
    protect,
    getStatuses
);


// =========================================
// MARK STATUS AS VIEWED
// =========================================

router.put(
    "/view/:statusId",
    protect,
    markStatusViewed
);


module.exports = router;