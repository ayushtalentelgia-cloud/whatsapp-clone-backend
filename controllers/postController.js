const Post = require("../models/Post");

// =========================================
// CREATE POST
// =========================================

const createPost = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Post media is required"
            });

        }


        const mediaType =
            req.file.mimetype.startsWith("video/")
                ? "video"
                : "image";


        const post =
            await Post.create({

                user:
                    req.user._id,

                mediaUrl:
                    req.file.path,

                mediaType,

                caption:
                    req.body.caption || ""

            });


        const populatedPost =
            await Post.findById(
                post._id
            )
            .populate(
                "user",
                "name profilePic"
            );


        res.status(201).json({

            success: true,

            post:
                populatedPost

        });

    }
    catch (error) {

        console.log(
            "Create Post Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to create post"

        });

    }

};


// =========================================
// GET POSTS
// =========================================

const getPosts = async (
    req,
    res
) => {

    try {

        const posts =
            await Post.find()

            .populate(
                "user",
                "name profilePic"
            )

            .populate(
                "likes",
                "name profilePic"
            )

            .populate(
                "comments.user",
                "name profilePic"
            )

            .sort({
                createdAt: -1
            });


        res.json({

            success: true,

            posts

        });

    }
    catch (error) {

        console.log(
            "Get Posts Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to get posts"

        });

    }

};


// =========================================
// LIKE / UNLIKE POST
// =========================================

const toggleLike = async (
    req,
    res
) => {

    try {

        const post =
            await Post.findById(
                req.params.postId
            );


        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "Post not found"

            });

        }


        const userId =
            req.user._id.toString();


        const alreadyLiked =
            post.likes.some(
                id =>
                    id.toString() ===
                    userId
            );


        if (alreadyLiked) {

            post.likes =
                post.likes.filter(
                    id =>
                        id.toString() !==
                        userId
                );

        }
        else {

            post.likes.push(
                req.user._id
            );

        }


        await post.save();


        res.json({

            success: true,

            liked:
                !alreadyLiked,

            likeCount:
                post.likes.length

        });

    }
    catch (error) {

        console.log(
            "Toggle Like Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to update like"

        });

    }

};


// =========================================
// ADD COMMENT
// =========================================

const addComment = async (
    req,
    res
) => {

    try {

        const text =
            req.body.text?.trim();


        if (!text) {

            return res.status(400).json({

                success: false,

                message:
                    "Comment cannot be empty"

            });

        }


        const post =
            await Post.findById(
                req.params.postId
            );


        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "Post not found"

            });

        }


        post.comments.push({

            user:
                req.user._id,

            text

        });


        await post.save();


        const updatedPost =
            await Post.findById(
                post._id
            )

            .populate(
                "comments.user",
                "name profilePic"
            );


        res.status(201).json({

            success: true,

            comment:
                updatedPost.comments[
                    updatedPost.comments.length - 1
                ]

        });

    }
    catch (error) {

        console.log(
            "Add Comment Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to add comment"

        });

    }

};


// =========================================
// DELETE POST
// =========================================

const deletePost = async (
    req,
    res
) => {

    try {

        const post =
            await Post.findById(
                req.params.postId
            );


        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "Post not found"

            });

        }


        if (
            post.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can only delete your own post"

            });

        }


        await Post.findByIdAndDelete(
            post._id
        );


        res.json({

            success: true,

            message:
                "Post deleted successfully"

        });

    }
    catch (error) {

        console.log(
            "Delete Post Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to delete post"

        });

    }

};


module.exports = {

    createPost,

    getPosts,

    toggleLike,

    addComment,

    deletePost

};