const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const upload =
    require("../middleware/uploadMiddleware");

const {
    registerUser,

    startRegistration,

    verifyRegistrationOTP,

    loginUser,

    getProfile,

    updateProfile,

    uploadProfilePicture,

    addContact,

    getContacts,

    searchUsers,

    getAllUsers,

    logoutUser,

} = require("../controllers/userController");

// =========================================
// AUTH
// =========================================


// =========================================
// START REGISTRATION
// Send Email OTP
// =========================================

router.post(
    "/register/start",
    startRegistration
);


// =========================================
// VERIFY REGISTRATION OTP
// Create Account
// =========================================

router.post(
    "/register/verify-otp",
    verifyRegistrationOTP
);


// =========================================
// LOGIN
// =========================================

router.post(
    "/login",
    loginUser
);


// =========================================
// LOGOUT
// =========================================

router.post(
    "/logout",
    protect,
    logoutUser
);


// =========================================
// PROFILE
// =========================================


// Get Profile

router.get(
    "/profile",
    protect,
    getProfile
);


// Update Profile

router.put(
    "/profile",
    protect,
    updateProfile
);


// Upload Profile Picture

router.put(
    "/profile-picture",
    protect,
    upload.single("profilePic"),
    uploadProfilePicture
);


// =========================================
// CONTACTS
// =========================================


// Add Contact

router.post(
    "/contact",
    protect,
    addContact
);


// Get Contacts

router.get(
    "/contacts",
    protect,
    getContacts
);


// =========================================
// USERS
// =========================================


// Search Users

router.get(
    "/search",
    protect,
    searchUsers
);


// Get All Users

router.get(
    "/",
    protect,
    getAllUsers
);


// =========================================
// EXPORT ROUTER
// =========================================

module.exports = router;