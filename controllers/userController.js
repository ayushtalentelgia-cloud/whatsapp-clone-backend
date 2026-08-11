const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PendingRegistration = require("../models/PendingRegistration");

const {
    sendEmailOTP
} = require("../services/emailService");

// =========================================
// GENERATE OTP
// =========================================

const generateOTP = () => {

    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();

};

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
// START REGISTRATION
// =========================================

const startRegistration = async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            password,
        } = req.body;

        // =========================================
        // REQUIRED FIELDS
        // =========================================

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

        // =========================================
        // NAME VALIDATION
        // =========================================

        if (name.trim().length < 3) {

            return res.status(400).json({

                success: false,

                message:
                    "Name must be at least 3 characters."

            });

        }

        // =========================================
        // PHONE VALIDATION
        // =========================================

        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(phone)) {

            return res.status(400).json({

                success: false,

                message: "Invalid Phone Number."

            });

        }

        // =========================================
        // EMAIL VALIDATION
        // =========================================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({

                success: false,

                message: "Invalid Email."

            });

        }

        // =========================================
        // PASSWORD VALIDATION
        // =========================================

        if (password.length < 8) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 8 characters."

            });

        }

        // =========================================
        // NORMALIZE DATA
        // =========================================

        const cleanName = name.trim();

        const cleanEmail =
            email.trim().toLowerCase();

        const cleanPhone =
            phone.trim();

        // =========================================
        // CHECK EXISTING USER
        // =========================================

        const existingUser = await User.findOne({

            $or: [

                {
                    email: cleanEmail
                },

                {
                    phone: cleanPhone
                }

            ]

        });

        if (existingUser) {

            return res.status(400).json({

                success: false,

                message:
                    "Email or Phone already exists."

            });

        }

        // =========================================
        // GENERATE OTPs
        // =========================================

        const emailOTP = generateOTP();

        const phoneOTP = generateOTP();

        // =========================================
        // HASH PASSWORD
        // =========================================

        const passwordHash =
            await bcrypt.hash(
                password,
                12
            );

        // =========================================
        // HASH OTPs
        // =========================================

        const emailOtpHash =
            await bcrypt.hash(
                emailOTP,
                10
            );

        const phoneOtpHash =
            await bcrypt.hash(
                phoneOTP,
                10
            );

        // =========================================
        // OTP EXPIRY
        // 5 MINUTES
        // =========================================

        const otpExpiresAt =
            new Date(
                Date.now() +
                5 * 60 * 1000
            );

        // =========================================
        // REMOVE OLD PENDING REGISTRATION
        // =========================================

        await PendingRegistration.deleteMany({

            $or: [

                {
                    email: cleanEmail
                },

                {
                    phone: cleanPhone
                }

            ]

        });

        // =========================================
        // CREATE PENDING REGISTRATION
        // =========================================

        const pendingRegistration =
            await PendingRegistration.create({

                name: cleanName,

                email: cleanEmail,

                phone: cleanPhone,

                passwordHash,

                emailOtpHash,

                phoneOtpHash,

                otpExpiresAt,

                otpAttempts: 0,

            });

        // =========================================
        // SEND EMAIL OTP
        // =========================================

        await sendEmailOTP(
            cleanEmail,
            emailOTP
        );

        console.log(
            "📧 Email OTP sent successfully."
        );

        // =========================================
        // DEVELOPMENT ONLY
        // =========================================

        console.log(
            "📧 Email OTP:",
            emailOTP
        );

        console.log(
            "📱 Phone OTP:",
            phoneOTP
        );

        // =========================================
        // RESPONSE
        // =========================================

        return res.status(200).json({

            success: true,

            message:
                "Verification code sent successfully.",

            registrationId:
                pendingRegistration._id,

        });

    }

    // =========================================
    // CATCH ERROR
    // =========================================

    catch (error) {

        console.error(
            "Start Registration Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to start registration."

        });

    }

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

        // =========================================
        // VALIDATIONS
        // =========================================

        if (name.trim().length < 3) {

            return res.status(400).json({

                success: false,

                message: "Name must be at least 3 characters."

            });

        }

        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(phone)) {

            return res.status(400).json({

                success: false,

                message: "Invalid Phone Number."

            });

        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({

                success: false,

                message: "Invalid Email."

            });

        }

        if (password.length < 8) {

            return res.status(400).json({

                success: false,

                message: "Password must be at least 8 characters."

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

            12

        );

        const user = await User.create({

            name: name.trim(),

            phone,

            email: email.toLowerCase(),

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

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

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

    return res.status(401).json({

        success: false,

        message: "Invalid Email/Phone or Password."

    });

}

        const match = await bcrypt.compare(

            password,

            user.password

        );

        if (!match) {

    return res.status(401).json({

        success: false,

        message: "Invalid Email/Phone or Password."

    });

}
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

        // =========================================
        // NAME VALIDATION
        // =========================================

        if (name) {

            if (name.trim().length < 3) {

                return res.status(400).json({

                    success: false,

                    message: "Name must be at least 3 characters."

                });

            }

            user.name = name.trim();

        }

        // =========================================
        // ABOUT
        // =========================================

        if (about) {

            user.about = about.trim();

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

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

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
        console.log("Cloudinary URL:", req.file.path);

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
// VERIFY REGISTRATION OTP
// =========================================

const verifyRegistrationOTP = async (req, res) => {

    try {

        const {
            registrationId,
            otp,
        } = req.body;

        // =========================================
        // REQUIRED FIELDS
        // =========================================

        if (!registrationId || !otp) {

            return res.status(400).json({

                success: false,

                message:
                    "Registration ID and OTP are required."

            });

        }

        // =========================================
        // OTP FORMAT
        // =========================================

        if (!/^\d{6}$/.test(otp)) {

            return res.status(400).json({

                success: false,

                message:
                    "OTP must be a 6-digit code."

            });

        }

        // =========================================
        // FIND PENDING REGISTRATION
        // =========================================

        const pendingRegistration =
            await PendingRegistration.findById(
                registrationId
            );

        if (!pendingRegistration) {

            return res.status(404).json({

                success: false,

                message:
                    "Registration request not found or expired."

            });

        }

        // =========================================
        // CHECK OTP EXPIRY
        // =========================================

        if (
            new Date() >
            pendingRegistration.otpExpiresAt
        ) {

            await PendingRegistration.findByIdAndDelete(
                registrationId
            );

            return res.status(400).json({

                success: false,

                message:
                    "OTP has expired. Please register again."

            });

        }

        // =========================================
        // CHECK OTP ATTEMPTS
        // =========================================

        if (
            pendingRegistration.otpAttempts >= 5
        ) {

            await PendingRegistration.findByIdAndDelete(
                registrationId
            );

            return res.status(429).json({

                success: false,

                message:
                    "Too many incorrect OTP attempts. Please register again."

            });

        }

        // =========================================
        // VERIFY EMAIL OTP
        // =========================================

        const emailOtpMatch =
            await bcrypt.compare(
                otp,
                pendingRegistration.emailOtpHash
            );

        // =========================================
        // VERIFY PHONE OTP
        // =========================================

        const phoneOtpMatch =
            await bcrypt.compare(
                otp,
                pendingRegistration.phoneOtpHash
            );

        // =========================================
        // EMAIL OR PHONE OTP
        // ANY ONE CORRECT = VALID
        // =========================================

        if (!emailOtpMatch && !phoneOtpMatch) {

            pendingRegistration.otpAttempts += 1;

            await pendingRegistration.save();

            return res.status(400).json({

                success: false,

                message:
                    "Invalid verification code."

            });

        }

        // =========================================
        // CHECK USER AGAIN
        // =========================================

        const existingUser =
            await User.findOne({

                $or: [

                    {
                        email:
                            pendingRegistration.email
                    },

                    {
                        phone:
                            pendingRegistration.phone
                    }

                ]

            });

        if (existingUser) {

            await PendingRegistration.findByIdAndDelete(
                registrationId
            );

            return res.status(400).json({

                success: false,

                message:
                    "Email or Phone already exists."

            });

        }

        // =========================================
        // CREATE USER
        // =========================================

        const user = await User.create({

            name:
                pendingRegistration.name,

            phone:
                pendingRegistration.phone,

            email:
                pendingRegistration.email,

            password:
                pendingRegistration.passwordHash,

        });

        // =========================================
        // GET USER WITHOUT PASSWORD
        // =========================================

        const userData =
            await User.findById(user._id)
                .select("-password");

        // =========================================
        // DELETE PENDING REGISTRATION
        // =========================================

        await PendingRegistration.findByIdAndDelete(
            registrationId
        );

        // =========================================
        // SUCCESS
        // =========================================

        return res.status(201).json({

            success: true,

            message:
                "Account Created Successfully.",

            token:
                generateToken(user._id),

            user:
                userData,

        });

    }

    catch (error) {

        console.error(
            "Verify Registration OTP Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Internal Server Error"

        });

    }

};


// =========================================
// EXPORTS
// =========================================

module.exports = {

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

};