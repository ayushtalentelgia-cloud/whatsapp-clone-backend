const express = require("express");
const router = express.Router();
const multer = require("multer");

const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    getAllUsers,
    addContact,
    getContacts,
    uploadProfilePicture,
} = require("../controllers/userController");

// ================= MULTER =================

const storage = multer.memoryStorage();

const upload = multer({
    storage,
});

// ================= AUTH =================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ================= PROFILE =================

// Get Logged In User Profile
router.get("/profile", protect, getProfile);

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

// ================= USERS =================

// Get All Users
router.get("/", protect, getAllUsers);

// ================= CONTACTS =================

// Add Contact
router.post("/contact", protect, addContact);

// Get My Contacts
router.get("/contacts", protect, getContacts);

module.exports = router;