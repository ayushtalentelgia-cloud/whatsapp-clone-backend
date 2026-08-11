// =========================================
// WhatsApp Clone - Auth JS
// =========================================

const API_BASE = "https://whatsapp-clone-backend-b5o7.onrender.com/api/users";


// =========================================
// API CONFIG - LOCAL
// =========================================

//const API_BASE =
  //  "http://localhost:5000/api/users";
// =========================================
// SIGNUP
// =========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const phone =
            document.getElementById("signupPhone").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        try {

            // =========================================
            // START REGISTRATION
            // =========================================

            const res = await fetch(
                `${API_BASE}/register/start`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        name,

                        email,

                        phone,

                        password

                    })

                }
            );

            const data = await res.json();

            // =========================================
            // START REGISTRATION FAILED
            // =========================================

            if (!data.success) {

                alert(data.message);

                return;

            }

            // =========================================
            // ASK FOR OTP
            // =========================================

            const otp = prompt(
                "Enter the 6-digit verification code sent to your email:"
            );

            if (!otp) {

                alert(
                    "Verification code is required."
                );

                return;

            }

            // =========================================
            // VERIFY OTP
            // =========================================

            const verifyRes = await fetch(
                `${API_BASE}/register/verify-otp`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        registrationId:
                            data.registrationId,

                        otp: otp.trim()

                    })

                }
            );

            const verifyData =
                await verifyRes.json();

            // =========================================
            // VERIFICATION FAILED
            // =========================================

            if (!verifyData.success) {

                alert(
                    verifyData.message
                );

                return;

            }

            // =========================================
            // ACCOUNT CREATED
            // =========================================

           showToast("Account Created Successfully");

            // =========================================
            // SAVE LOGIN DATA
            // =========================================

            localStorage.setItem(
                "token",
                verifyData.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    verifyData.user
                )
            );

            // =========================================
            // GO TO CHAT
            // =========================================

            window.location.href =
                "/chat.html";

        }

        catch (err) {

            console.error(
                "Signup Error:",
                err
            );

            alert(
                "Server Error. Please try again."
            );

        }

    });

}

// =========================================
// LOGIN
// =========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const loginValue = document.getElementById("loginPhone").value.trim();
        const password = document.getElementById("loginPassword").value;

        const body = {
            password
        };

        if (loginValue.includes("@")) {
            body.email = loginValue;
        } else {
            body.phone = loginValue;
        }

        try {

            const res = await fetch(`${API_BASE}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(body)

            });

            const data = await res.json();

            if (data.success) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                showToast("Login Successful");

                // Login ke baad direct WhatsApp UI
                window.location.href = "/chat.html";

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.error(err);

            alert("Server Error");

        }

    });

}

// =========================================
// VIBECHAT TOAST
// =========================================

function showToast(message, type = "success") {

    const oldToast =
        document.getElementById("vibeToast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast =
        document.createElement("div");

    toast.id = "vibeToast";

    toast.className =
        `vibe-toast ${type}`;

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("hide");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2500);
}