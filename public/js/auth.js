// =========================================
// VibeChat - Auth JS
// =========================================

const API_BASE =
    "https://vibechat-backend-i6xa.onrender.com/api/users";


// =========================================
// SIGNUP
// =========================================

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            // =========================================
            // GET FORM VALUES
            // =========================================

            const name =
                document
                    .getElementById("signupName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim();

            const phone =
                document
                    .getElementById("signupPhone")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("signupPassword")
                    .value;


            // =========================================
            // BASIC VALIDATION
            // =========================================

            if (
                !name ||
                !email ||
                !phone ||
                !password
            ) {

                showToast(
                    "Please fill all fields.",
                    "error"
                );

                return;

            }


            // =========================================
            // DISABLE SIGNUP BUTTON
            // =========================================

            const signupBtn =
                signupForm.querySelector(
                    'button[type="submit"]'
                );


            if (signupBtn) {

                signupBtn.disabled =
                    true;

                signupBtn.textContent =
                    "Creating Account...";

            }


            // =========================================
            // CREATE ACCOUNT
            // OTP TEMPORARILY DISABLED
            // =========================================

            try {

                const res =
                    await fetch(
                        `${API_BASE}/register`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    name,
                                    email,
                                    phone,
                                    password

                                })

                        }
                    );


                const data =
                    await res.json();


                // =========================================
                // REGISTRATION FAILED
                // =========================================

                if (
                    !res.ok ||
                    !data.success
                ) {

                    showToast(
                        data.message ||
                        "Unable to create account.",
                        "error"
                    );


                    if (signupBtn) {

                        signupBtn.disabled =
                            false;

                        signupBtn.textContent =
                            "Create Account";

                    }

                    return;

                }


                // =========================================
                // SAVE LOGIN DATA
                // =========================================

                if (data.token) {

                    localStorage.setItem(
                        "token",
                        data.token
                    );

                }


                if (data.user) {

                    localStorage.setItem(
                        "user",
                        JSON.stringify(
                            data.user
                        )
                    );

                }


                // =========================================
                // SUCCESS TOAST
                // =========================================

                showToast(
                    "Account Created Successfully"
                );


                // =========================================
                // REDIRECT
                // =========================================

                setTimeout(
                    () => {

                        window.location.href =
                            "/chat.html";

                    },
                    700
                );

            }


            catch (err) {

                console.error(
                    "Signup Error:",
                    err
                );


                showToast(
                    "Server Error. Please try again.",
                    "error"
                );


                if (signupBtn) {

                    signupBtn.disabled =
                        false;

                    signupBtn.textContent =
                        "Create Account";

                }

            }

        }
    );

}


// =========================================
// LOGIN
// =========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const loginValue =
                document
                    .getElementById("loginPhone")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const body = {

                password

            };


            if (
                loginValue.includes("@")
            ) {

                body.email =
                    loginValue;

            }

            else {

                body.phone =
                    loginValue;

            }


            try {

                const res =
                    await fetch(
                        `${API_BASE}/login`,
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    body
                                )

                        }
                    );


                const data =
                    await res.json();


                if (
                    data.success
                ) {

                    localStorage.setItem(
                        "token",
                        data.token
                    );


                    localStorage.setItem(
                        "user",
                        JSON.stringify(
                            data.user
                        )
                    );


                    showToast(
                        "Login Successful"
                    );


                    window.location.href =
                        "/chat.html";

                }

                else {

                    showToast(
                        data.message,
                        "error"
                    );

                }

            }


            catch (err) {

                console.error(
                    "Login Error:",
                    err
                );


                showToast(
                    "Server Error",
                    "error"
                );

            }

        }
    );

}


// =========================================
// VIBECHAT TOAST
// =========================================

function showToast(
    message,
    type = "success"
) {

    const oldToast =
        document.getElementById(
            "vibeToast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.id =
        "vibeToast";


    toast.className =
        `vibe-toast ${type}`;


    toast.innerText =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "hide"
            );


            setTimeout(
                () => {

                    toast.remove();

                },
                300
            );

        },
        2500
    );

}