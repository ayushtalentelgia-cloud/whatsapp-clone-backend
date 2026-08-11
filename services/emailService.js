// =========================================
// EMAIL SERVICE
// =========================================

const nodemailer = require("nodemailer");

// =========================================
// EMAIL TRANSPORTER
// =========================================

const transporter = nodemailer.createTransport({

    pool: true,

    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT),

    secure: false,

    auth: {

        user: process.env.SMTP_USER,

        pass: process.env.SMTP_PASS,

    },

    maxConnections: 5,

    maxMessages: 100,

    connectionTimeout: 10000,

    greetingTimeout: 10000,

    socketTimeout: 15000,

});

// =========================================
// SEND EMAIL OTP
// =========================================

const sendEmailOTP = async (email, otp) => {

    const startTime = Date.now();

    try {

        console.log(
            `📧 Sending OTP to ${email}...`
        );

        await transporter.sendMail({

            from:
                `"VibeChat" <${process.env.SMTP_USER}>`,

            to: email,

            subject:
                "VibeChat Verification Code",

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

        const timeTaken =
            Date.now() - startTime;

        console.log(
            `✅ OTP email sent successfully to ${email}`
        );

        console.log(
            `⏱️ Email sending time: ${timeTaken} ms`
        );

        return true;

    }

    catch (error) {

        const timeTaken =
            Date.now() - startTime;

        console.error(
            `❌ Email OTP Error after ${timeTaken} ms:`,
            error
        );

        return false;

    }

};

// =========================================
// VERIFY SMTP CONNECTION
// =========================================

transporter.verify((error) => {

    if (error) {

        console.error(
            "❌ SMTP Connection Error:",
            error
        );

    } else {

        console.log(
            "✅ SMTP server is ready."
        );

    }

});

// =========================================
// EXPORT
// =========================================

module.exports = {

    sendEmailOTP,

};