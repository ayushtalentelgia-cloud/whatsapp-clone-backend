const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");

// =========================================
// GENERATE TOKEN
// =========================================

const generateToken = (id) => {

    return jwt.sign(

        { id },

        process.env.JWT_SECRET,

        {

            expiresIn: "7d",

        }

    );

};

// =========================================
// REGISTER USER
// =========================================

const registerUser = async (req, res) => {

    try {

        const {

            name,

            phone,

            email,

            password,

        } = req.body;

        if (

            !name ||

            !phone ||

            !email ||

            !password

        ) {

            return res.status(400).json({

                success: false,

                message: "All fields are required."

            });

        }

        const existingUser = await User.findOne({

            $or: [

                { email },

                { phone }

            ]

        });

        if (existingUser) {

            return res.status(400).json({

                success: false,

                message: "Email or Phone already exists."

            });

        }

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );

        const user = await User.create({

            name,

            phone,

            email,

            password: hashedPassword,

        });

        const userData = await User.findById(user._id)

            .select("-password");

        return res.status(201).json({

            success: true,

            message: "Account Created Successfully.",

            token: generateToken(user._id),

            user: userData,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// LOGIN USER
// =========================================

const loginUser = async (req, res) => {

    try {

        const {

            email,

            phone,

            password,

        } = req.body;

        if (

            (!email && !phone)

            ||

            !password

        ) {

            return res.status(400).json({

                success: false,

                message: "Email/Phone and Password are required."

            });

        }

        let user;

        if (email) {

            user = await User.findOne({

                email

            });

        }

        else {

            user = await User.findOne({

                phone

            });

        }

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        const match = await bcrypt.compare(

            password,

            user.password

        );

        if (!match) {

            return res.status(401).json({

                success: false,

                message: "Invalid Password."

            });

        }

        user.isOnline = true;

        user.lastSeen = new Date();

        await user.save();

        const userData = await User.findById(user._id)

            .select("-password");

        return res.status(200).json({

            success: true,

            message: "Login Successful.",

            token: generateToken(user._id),

            user: userData,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// =========================================
// GET PROFILE
// =========================================

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id)

            .select("-password");

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        return res.status(200).json({

            success: true,

            user,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// UPDATE PROFILE
// =========================================

const updateProfile = async (req, res) => {

    try {

        const {

            name,

            about,

        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        if (name) {

            user.name = name;

        }

        if (about) {

            user.about = about;

        }

        await user.save();

        const updatedUser = await User.findById(user._id)

            .select("-password");

        return res.status(200).json({

            success: true,

            message: "Profile Updated Successfully.",

            user: updatedUser,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// UPLOAD PROFILE PICTURE
// =========================================

const uploadProfilePicture = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Please select an image."

            });

        }

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        // Cloudinary URL
        user.profilePic = req.file.path;

        await user.save();

        const updatedUser = await User.findById(user._id)

            .select("-password");

        return res.status(200).json({

            success: true,

            message: "Profile Picture Updated.",

            user: updatedUser,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// =========================================
// ADD CONTACT
// =========================================

const addContact = async (req, res) => {

    try {

        const { name, phone } = req.body;

        if (!name || !phone) {

            return res.status(400).json({

                success: false,

                message: "Name and Phone are required."

            });

        }

        const contactUser = await User.findOne({

            phone

        });

        if (!contactUser) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        if (contactUser._id.toString() === req.user._id.toString()) {

            return res.status(400).json({

                success: false,

                message: "You cannot add yourself."

            });

        }

        const user = await User.findById(req.user._id);

        const alreadyExists = user.contacts.find(

            contact => contact.phone === phone

        );

        if (alreadyExists) {

            return res.status(400).json({

                success: false,

                message: "Contact already exists."

            });

        }

        user.contacts.push({

            name,

            phone,

            user: contactUser._id,

        });

        await user.save();

        return res.status(201).json({

            success: true,

            message: "Contact Added Successfully.",

            contacts: user.contacts,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// GET CONTACTS
// =========================================

const getContacts = async (req, res) => {

    try {

        const user = await User.findById(req.user._id)

            .populate(

                "contacts.user",

                "-password"

            );

        return res.status(200).json({

            success: true,

            count: user.contacts.length,

            contacts: user.contacts,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// SEARCH USERS
// =========================================

const searchUsers = async (req, res) => {

    try {

        const keyword = req.query.search;

        if (!keyword) {

            return res.status(400).json({

                success: false,

                message: "Search keyword is required."

            });

        }

        const users = await User.find({

            $and: [

                {

                    _id: {

                        $ne: req.user._id

                    }

                },

                {

                    $or: [

                        {

                            name: {

                                $regex: keyword,

                                $options: "i"

                            }

                        },

                        {

                            phone: {

                                $regex: keyword,

                                $options: "i"

                            }

                        },

                        {

                            email: {

                                $regex: keyword,

                                $options: "i"

                            }

                        }

                    ]

                }

            ]

        }).select("-password");

        return res.status(200).json({

            success: true,

            count: users.length,

            users,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// =========================================
// GET ALL USERS
// =========================================

const getAllUsers = async (req, res) => {

    try {

        const users = await User.find({

            _id: {

                $ne: req.user._id

            }

        }).select("-password");

        return res.status(200).json({

            success: true,

            count: users.length,

            users,

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// LOGOUT USER
// =========================================

const logoutUser = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

        if (user) {

            user.isOnline = false;

            user.lastSeen = new Date();

            await user.save();

        }

        return res.status(200).json({

            success: true,

            message: "Logout Successful."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// =========================================
// EXPORTS
// =========================================

module.exports = {

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

};