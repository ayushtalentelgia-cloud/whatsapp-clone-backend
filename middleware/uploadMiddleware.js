const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// =========================================
// CLOUDINARY STORAGE
// =========================================

const storage = new CloudinaryStorage({

    cloudinary,

    params: async (req, file) => {

        let folder = "VibeChat";

        let resource_type = "auto";

        return {

            folder,

            resource_type,

            public_id: Date.now() + "-" + file.originalname,

        };

    }

});

// =========================================
// MULTER
// =========================================

const upload = multer({

    storage,

    limits: {

        fileSize: 20 * 1024 * 1024

    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [

            "image/",

            "video/",

            "audio/",

            "application/pdf",

            "application/msword",

            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            "application/vnd.ms-excel",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

            "application/zip",

            "application/x-zip-compressed"

        ];

        const allowed = allowedTypes.some(type =>

            file.mimetype.startsWith(type) ||

            file.mimetype === type

        );

        if (allowed) {

            cb(null, true);

        } else {

            cb(new Error("Unsupported file type."), false);

        }

    }

});

module.exports = upload;