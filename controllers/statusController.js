const Status = require("../models/Status");

// =========================================
// CREATE STATUS
// =========================================

const createStatus = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "Status media is required"
            });

        }

        const mediaType =
            req.file.mimetype.startsWith("video/")
                ? "video"
                : "image";

        const status = await Status.create({

            user: req.user._id,

            mediaUrl:
                req.file.path,

            mediaType,

            caption:
                req.body.caption || "",

            expiresAt:
                new Date(
                    Date.now() +
                    24 * 60 * 60 * 1000
                )

        });

        res.status(201).json({

            success: true,

            status

        });

    }
    catch (error) {

        console.log(
            "Create Status Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to create status"

        });

    }

};


// =========================================
// GET ACTIVE STATUSES
// =========================================

const getStatuses = async (req, res) => {

    try {

        const statuses =
            await Status.find({

                expiresAt: {
                    $gt: new Date()
                }

            })

            .populate(
                "user",
                "name profilePic"
            )

            .populate(
                "viewers",
                "name profilePic"
            )

            .sort({
                createdAt: -1
            });

        res.json({

            success: true,

            statuses

        });

    }
    catch (error) {

        console.log(
            "Get Status Error:",
            error
        );

        res.status(500).json({

            success: false,

            message: "Failed to get statuses"

        });

    }

};


// =========================================
// MARK STATUS AS VIEWED
// =========================================

const markStatusViewed = async (
    req,
    res
) => {

    try {

        const status =
            await Status.findById(
                req.params.statusId
            );


        if (!status) {

            return res.status(404).json({

                success: false,

                message: "Status not found"

            });

        }


        // =====================================
        // CHECK EXPIRY
        // =====================================

        if (
            status.expiresAt <=
            new Date()
        ) {

            return res.status(410).json({

                success: false,

                message: "Status has expired"

            });

        }


        // =====================================
        // OWNER SHOULD NOT BE A VIEWER
        // =====================================

        if (
            status.user.toString() ===
            req.user._id.toString()
        ) {

            return res.json({

                success: true

            });

        }


        // =====================================
        // ADD VIEWER
        // =====================================

        await Status.findByIdAndUpdate(

            req.params.statusId,

            {
                $addToSet: {
                    viewers: req.user._id
                }
            }

        );


        res.json({

            success: true

        });

    }
    catch (error) {

        console.log(
            "Mark Status Viewed Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to mark status as viewed"

        });

    }

};


// =========================================
// DELETE STATUS
// =========================================

const deleteStatus = async (
    req,
    res
) => {

    try {

        const status =
            await Status.findById(
                req.params.statusId
            );


        // =====================================
        // STATUS NOT FOUND
        // =====================================

        if (!status) {

            return res.status(404).json({

                success: false,

                message: "Status not found"

            });

        }


        // =====================================
        // ONLY OWNER CAN DELETE
        // =====================================

        if (
            status.user.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You can only delete your own status"

            });

        }


        // =====================================
        // DELETE STATUS
        // =====================================

        await Status.findByIdAndDelete(
            req.params.statusId
        );


        res.json({

            success: true,

            message: "Status deleted successfully"

        });

    }
    catch (error) {

        console.log(
            "Delete Status Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to delete status"

        });

    }

};


// =========================================
// EXPORT
// =========================================

module.exports = {

    createStatus,

    getStatuses,

    markStatusViewed,

    deleteStatus

};