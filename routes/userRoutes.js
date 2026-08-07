const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {

    registerUser,

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

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", protect, logoutUser);

// =========================================
// PROFILE
// =========================================

// Get Profile
router.get("/profile", protect, getProfile);

// Update Profile
router.put("/profile", protect, updateProfile);

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
router.post("/contact", protect, addContact);

// Get Contacts
router.get("/contacts", protect, getContacts);

// =========================================
// USERS
// =========================================

// Search Users
router.get("/search", protect, searchUsers);

// Get All Users
router.get("/", protect, getAllUsers);

module.exports = router;