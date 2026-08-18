const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const upload =
    require("../middleware/uploadMiddleware");

const {
    createPost,
    getPosts,
    toggleLike,
    addComment,
    deletePost
} = require("../controllers/postController");


// =========================================
// CREATE POST
// =========================================

router.post(
    "/",
    protect,
    upload.single("post"),
    createPost
);


// =========================================
// GET ALL POSTS
// =========================================

router.get(
    "/",
    protect,
    getPosts
);


// =========================================
// LIKE / UNLIKE POST
// =========================================

router.put(
    "/like/:postId",
    protect,
    toggleLike
);


// =========================================
// ADD COMMENT
// =========================================

router.post(
    "/comment/:postId",
    protect,
    addComment
);


// =========================================
// DELETE POST
// =========================================

router.delete(
    "/:postId",
    protect,
    deletePost
);


// =========================================
// EXPORT
// =========================================

module.exports = router;