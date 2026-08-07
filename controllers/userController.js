const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// ================= Register User =================

const registerUser = async (req, res) => {

    try {

        const { name, phone, email, password } = req.body;

        if (!name || !phone || !email || !password) {

            return res.status(400).json({

                success: false,
                message: "All fields are required",

            });

        }

        const existingUser = await User.findOne({

            $or: [{ email }, { phone }],

        });

        if (existingUser) {

            return res.status(400).json({

                success: false,
                message: "Email or Phone already registered",

            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({

            name,
            phone,
            email,
            password: hashedPassword,

        });

        const userData = await User.findById(user._id).select("-password");

        return res.status(201).json({

            success: true,
            message: "User Registered Successfully",
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

// ================= Login User =================

const loginUser = async (req, res) => {

    try {

        const { email, phone, password } = req.body;

        if ((!email && !phone) || !password) {

            return res.status(400).json({

                success: false,
                message: "Email or Phone and Password are required",

            });

        }

        let user;

        if (email) {

            user = await User.findOne({ email });

        }

        else {

            user = await User.findOne({ phone });

        }

        if (!user) {

            return res.status(404).json({

                success: false,
                message: "User not found",

            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(400).json({

                success: false,
                message: "Invalid Password",

            });

        }

        const token = jwt.sign(

            {

                id: user._id,

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d",

            }

        );

        const userData = await User.findById(user._id).select("-password");

        return res.status(200).json({

            success: true,
            message: "Login Successful",
            token,
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

// ================= Get Profile =================

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

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

// ================= Get All Users =================

const getAllUsers = async (req, res) => {

    try {

        const users = await User.find().select("-password");

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

// ================= UPLOAD PROFILE PICTURE =================

const uploadProfilePicture = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,
                message: "Please select an image."

            });

        }

        const uploadStream = cloudinary.uploader.upload_stream(

            {

                folder: "whatsapp-clone/profile-pictures",

            },

            async (error, result) => {

                if (error) {

                    return res.status(500).json({

                        success: false,
                        message: error.message,

                    });

                }

                const user = await User.findByIdAndUpdate(

                    req.user.id,

                    {

                        profilePic: result.secure_url,

                    },

                    {

                        new: true,

                    }

                ).select("-password");

                return res.status(200).json({

                    success: true,

                    message: "Profile picture updated successfully.",

                    user,

                });

            }

        );

        streamifier

            .createReadStream(req.file.buffer)

            .pipe(uploadStream);

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
// ================= UPDATE PROFILE =================

const updateProfile = async (req, res) => {

    try {

        const {

            name,
            username,
            about

        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        if (name) {

            user.name = name;

        }

        if (username) {

            user.username = username;

        }

        if (about) {

            user.about = about;

        }

        await user.save();

        const updatedUser = await User.findById(user._id)
            .select("-password");

        return res.status(200).json({

            success: true,

            message: "Profile Updated Successfully",

            user: updatedUser

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ================= ADD CONTACT =================

const addContact = async (req, res) => {

    try {

        const { name, phone } = req.body;

        if (!name || !phone) {

            return res.status(400).json({
                success: false,
                message: "Name and Phone are required",
            });

        }

        const contactUser = await User.findOne({ phone });

        if (!contactUser) {

            return res.status(404).json({
                success: false,
                message: "This phone number is not registered",
            });

        }

        const user = await User.findById(req.user.id);

        const alreadyExists = user.contacts.find(
            contact => contact.phone === phone
        );

        if (alreadyExists) {

            return res.status(400).json({
                success: false,
                message: "Contact already exists",
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
            message: "Contact Added Successfully",
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

// ================= GET CONTACTS =================

const getContacts = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .populate("contacts.user", "-password");

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

// ================= MODULE EXPORTS =================

module.exports = {

    registerUser,

    loginUser,

    getProfile,

    updateProfile,

    getAllUsers,

    uploadProfilePicture,

    addContact,

    getContacts,

};