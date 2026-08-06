const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    getAllUsers,
    addContact,
    getContacts,
} = require("../controllers/userController");

// ================= AUTH =================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// ================= PROFILE =================

// Get Logged In User Profile
router.get("/profile", protect, getProfile);

// ================= USERS =================

// Get All Users
router.get("/", protect, getAllUsers);

// ================= CONTACTS =================

// Add Contact
router.post("/contact", protect, addContact);

// Get My Contacts
router.get("/contacts", protect, getContacts);

module.exports = router;