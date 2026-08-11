// =========================================
// WhatsApp Clone - Auth JS
// =========================================

const API_BASE = "https://whatsapp-clone-backend-b5o7.onrender.com/api/users";


// =========================================
 //API CONFIG - LOCAL
// =========================================

///const API_BASE =
  /// "http://localhost:5000/api/users";
// =========================================
// SIGNUP
// =========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        // =========================================
        // GET FORM VALUES
        // =========================================

        const name =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const phone =
            document.getElementById("signupPhone").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        // =========================================
        // BASIC VALIDATION
        // =========================================

        if (!name || !email || !phone || !password) {

            alert("Please fill all fields.");

            return;

        }

        // =========================================
        // CREATE OTP MODAL
        // =========================================

        let otpModal =
            document.getElementById("otpModal");

        if (!otpModal) {

            otpModal =
                document.createElement("div");

            otpModal.id = "otpModal";

            otpModal.innerHTML = `

                <div class="otp-overlay">

                    <div class="otp-box">

                        <button
                            type="button"
                            id="closeOtpModal"
                            class="otp-close"
                        >
                            ×
                        </button>

                        <h2>Email Verification</h2>

                        <p id="otpMessage">
                            Sending verification code...
                        </p>

                        <input
                            type="text"
                            id="otpInput"
                            maxlength="6"
                            inputmode="numeric"
                            placeholder="Enter 6-digit code"
                            disabled
                        >

                        <button
                            type="button"
                            id="verifyOtpBtn"
                            disabled
                        >
                            Verify Code
                        </button>

                        <div
                            id="otpLoading"
                            class="otp-loading"
                        >
                            Please wait...
                        </div>

                    </div>

                </div>

            `;

            document.body.appendChild(otpModal);

            // =====================================
            // MODAL STYLES
            // =====================================

            const style =
                document.createElement("style");

            style.innerHTML = `

                .otp-overlay {

                    position: fixed;
                    inset: 0;

                    background: rgba(0, 0, 0, 0.65);

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    z-index: 99999;

                }

                .otp-box {

                    position: relative;

                    width: 360px;
                    max-width: 90%;

                    background: white;

                    padding: 30px;

                    border-radius: 16px;

                    box-shadow:
                        0 20px 60px
                        rgba(0, 0, 0, 0.3);

                    text-align: center;

                }

                .otp-box h2 {

                    margin-top: 0;

                    color: #111827;

                }

                .otp-box p {

                    color: #64748b;

                    font-size: 14px;

                    margin-bottom: 20px;

                }

                .otp-box input {

                    width: 100%;

                    box-sizing: border-box;

                    padding: 13px;

                    border: 1px solid #d1d5db;

                    border-radius: 8px;

                    font-size: 18px;

                    text-align: center;

                    letter-spacing: 5px;

                    margin-bottom: 15px;

                }

                .otp-box input:focus {

                    outline: none;

                    border-color: #6366f1;

                }

                .otp-box button {

                    width: 100%;

                    padding: 13px;

                    border: none;

                    border-radius: 8px;

                    background: #222;

                    color: white;

                    font-size: 15px;

                    cursor: pointer;

                }

                .otp-box button:disabled {

                    opacity: 0.5;

                    cursor: not-allowed;

                }

                .otp-close {

                    position: absolute !important;

                    top: 10px;

                    right: 10px;

                    width: 32px !important;

                    height: 32px;

                    padding: 0 !important;

                    border-radius: 50% !important;

                    background: #eee !important;

                    color: #333 !important;

                    font-size: 22px !important;

                }

                .otp-loading {

                    margin-top: 12px;

                    font-size: 13px;

                    color: #64748b;

                }

            `;

            document.head.appendChild(style);

        }

        // =========================================
        // SHOW OTP MODAL IMMEDIATELY
        // =========================================

        otpModal.style.display = "block";

        const otpMessage =
            document.getElementById("otpMessage");

        const otpInput =
            document.getElementById("otpInput");

        const verifyOtpBtn =
            document.getElementById("verifyOtpBtn");

        const otpLoading =
            document.getElementById("otpLoading");

        const closeOtpModal =
            document.getElementById("closeOtpModal");

        otpMessage.textContent =
            "Sending verification code...";

        otpInput.value = "";

        otpInput.disabled = true;

        verifyOtpBtn.disabled = true;

        otpLoading.style.display = "block";

        // =========================================
        // CLOSE MODAL
        // =========================================

        closeOtpModal.onclick = () => {

            otpModal.style.display = "none";

        };

        let registrationId = null;

        // =========================================
        // START REGISTRATION
        // =========================================

        try {

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

            // =====================================
            // REGISTRATION FAILED
            // =====================================

            if (!data.success) {

                otpModal.style.display = "none";

                alert(data.message);

                return;

            }

            // =====================================
            // REGISTRATION SUCCESS
            // =====================================

            registrationId =
                data.registrationId;

            otpMessage.textContent =
                "Verification code sent to your email.";

            otpInput.disabled = false;

            verifyOtpBtn.disabled = false;

            otpLoading.style.display = "none";

            otpInput.focus();

        }

        catch (err) {

            console.error(
                "Signup Error:",
                err
            );

            otpModal.style.display = "none";

            alert(
                "Server Error. Please try again."
            );

            return;

        }

        // =========================================
        // VERIFY OTP
        // =========================================

        verifyOtpBtn.onclick = async () => {

            const otp =
                otpInput.value.trim();

            // =====================================
            // OTP VALIDATION
            // =====================================

            if (!otp) {

                alert(
                    "Please enter the verification code."
                );

                return;

            }

            if (!/^\d{6}$/.test(otp)) {

                alert(
                    "Please enter a valid 6-digit code."
                );

                return;

            }

            // =====================================
            // DISABLE BUTTON
            // =====================================

            verifyOtpBtn.disabled = true;

            verifyOtpBtn.textContent =
                "Verifying...";

            otpLoading.style.display =
                "block";

            otpLoading.textContent =
                "Verifying your code...";

            try {

                // =================================
                // VERIFY OTP API
                // =================================

                const verifyRes =
                    await fetch(
                        `${API_BASE}/register/verify-otp`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                registrationId:
                                    registrationId,

                                otp: otp

                            })

                        }
                    );

                const verifyData =
                    await verifyRes.json();

                // =================================
                // VERIFICATION FAILED
                // =================================

                if (!verifyData.success) {

                    alert(
                        verifyData.message
                    );

                    verifyOtpBtn.disabled =
                        false;

                    verifyOtpBtn.textContent =
                        "Verify Code";

                    otpLoading.style.display =
                        "none";

                    return;

                }

                // =================================
                // ACCOUNT CREATED
                // =================================

                otpMessage.textContent =
                    "Account created successfully!";

                otpLoading.textContent =
                    "Redirecting...";

                // =================================
                // SAVE LOGIN DATA
                // =================================

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

                // =================================
                // TOAST
                // =================================

                if (
                    typeof showToast ===
                    "function"
                ) {

                    showToast(
                        "Account Created Successfully"
                    );

                }

                // =================================
                // REDIRECT
                // =================================

                setTimeout(() => {

                    window.location.href =
                        "/chat.html";

                }, 500);

            }

            catch (err) {

                console.error(
                    "OTP Verification Error:",
                    err
                );

                alert(
                    "Server Error. Please try again."
                );

                verifyOtpBtn.disabled =
                    false;

                verifyOtpBtn.textContent =
                    "Verify Code";

                otpLoading.style.display =
                    "none";

            }

        };

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