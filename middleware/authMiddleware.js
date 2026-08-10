const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =========================================
// PROTECT MIDDLEWARE
// =========================================

const protect = async (req, res, next) => {

    try {

        let token;

        // Check Authorization Header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            token = req.headers.authorization.split(" ")[1];

        }

        // No Token
        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Access Denied. No token provided."
            });

        }

        // Verify Token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find User
        const user = await User.findById(decoded.id)
            .select("-password");

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User not found."
            });

        }

        // Attach User to Request
        req.user = user;

        next();

    }

    catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
        });

    }

};

// =========================================
// OPTIONAL AUTH
// =========================================

const optionalProtect = async (req, res, next) => {

    try {

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            const token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(decoded.id)
                .select("-password");

            if (user) {

                req.user = user;

            }

        }

        next();

    }

    catch (error) {

        next();

    }

};

// =========================================
// EXPORTS
// =========================================

module.exports = protect;
module.exports.optionalProtect = optionalProtect;