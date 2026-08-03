const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
} = require("../controllers/userController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get Logged In User Profile
router.get("/profile", protect, getProfile);

// Get All Users
router.get("/", protect, getAllUsers);

module.exports = router;