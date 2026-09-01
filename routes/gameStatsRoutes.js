const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    getGameStats,
    updateGameStats
} =
    require("../controllers/gameStatsController");

// =========================================
// GET GAME STATS
// =========================================

router.get(
    "/",
    protect,
    getGameStats
);

// =========================================
// UPDATE GAME STATS
// =========================================

router.post(
    "/",
    protect,
    updateGameStats
);

module.exports = router;
