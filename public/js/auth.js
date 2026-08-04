// ================= FORM TOGGLE =================

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

showSignup.addEventListener("click", () => {

    loginForm.style.display = "none";
    signupForm.style.display = "block";

});

showLogin.addEventListener("click", () => {

    signupForm.style.display = "none";
    loginForm.style.display = "block";

});