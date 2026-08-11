// =========================================
// EMAIL SERVICE
// =========================================

const nodemailer = require("nodemailer");

// =========================================
// EMAIL TRANSPORTER
// =========================================

const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT),

    secure: false,

    auth: {

        user: process.env.SMTP_USER,

        pass: process.env.SMTP_PASS,

    },

});


// =========================================
// SEND EMAIL OTP
// =========================================

const sendEmailOTP = async (email, otp) => {

    try {

        await transporter.sendMail({

            from: `"VibeChat" <${process.env.SMTP_USER}>`,

            to: email,

            subject: "VibeChat Verification Code",

            text:
                `Your VibeChat verification code is ${otp}. ` +
                `This code will expire in 5 minutes.`,

            html: `

                <div
                    style="
                        font-family: Arial, sans-serif;
                        max-width: 500px;
                        margin: auto;
                        padding: 20px;
                    "
                >

                    <h2>VibeChat</h2>

                    <p>
                        Your verification code is:
                    </p>

                    <h1
                        style="
                            letter-spacing: 5px;
                        "
                    >
                        ${otp}
                    </h1>

                    <p>
                        This code will expire in
                        <strong>5 minutes</strong>.
                    </p>

                    <p>
                        If you did not request this code,
                        please ignore this email.
                    </p>

                </div>

            `,

        });

        console.log(
            `📧 Email OTP sent successfully to ${email}`
        );

        return true;

    }

    catch (error) {

        console.error(
            "Email OTP Error:",
            error
        );

        return false;

    }

};


// =========================================
// EXPORT
// =========================================

module.exports = {

    sendEmailOTP,

};