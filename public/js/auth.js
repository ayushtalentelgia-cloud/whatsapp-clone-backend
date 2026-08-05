// =========================================
// WhatsApp Clone - Auth JS
// =========================================

const API_BASE = "https://whatsapp-clone-backend-b5o7.onrender.com/api/users";

// =========================================
// SIGNUP
// =========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("signupPhone").value.trim();
        const password = document.getElementById("signupPassword").value;

        try {

            const res = await fetch(`${API_BASE}/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password
                })

            });

            const data = await res.json();

            if (data.success) {

                alert("✅ Account Created Successfully");

                // Signup ke baad login page par bhejo
                window.location.href = "/index.html";

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

                alert("✅ Login Successful");

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