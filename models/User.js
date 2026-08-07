// =========================================
// PROFILE MODAL
// =========================================

profileBtn.onclick = () => {

    profileModal.classList.add("active");

};

closeProfileBtn.onclick = () => {

    profileModal.classList.remove("active");

};

changePhotoBtn.onclick = () => {

    profilePicInput.click();

};

// =========================================
// CONTACT MODAL
// =========================================

addContactBtn.onclick = () => {

    contactModal.classList.add("active");

};

closeContactBtn.onclick = () => {

    contactModal.classList.remove("active");

};

// =========================================
// SAVE CONTACT
// =========================================

saveContactBtn.onclick = async () => {

    const name = contactName.value.trim();

    const phone = contactPhone.value.trim();

    if (!name || !phone) {

        alert("Please enter Name & Phone");

        return;

    }

    try {

        const res = await fetch(

            API_URL + "/users/contact",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: "Bearer " + token

                },

                body: JSON.stringify({

                    name,

                    phone

                })

            }

        );

        const data = await res.json();

        alert(data.message);

        if (data.success) {

            contactModal.classList.remove("active");

            contactName.value = "";

            contactPhone.value = "";

            loadChats();

        }

    }

    catch (err) {

        console.log(err);

    }

};

// =========================================
// MENU
// =========================================

menuBtn.onclick = () => {

    menuDropdown.classList.toggle("active");

};

window.addEventListener("click", (e) => {

    if (

        !menuBtn.contains(e.target) &&

        !menuDropdown.contains(e.target)

    ) {

        menuDropdown.classList.remove("active");

    }

});

// =========================================
// LOGOUT
// =========================================

logoutBtn.onclick = () => {

    if (!confirm("Logout?")) return;

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    location.href = "/index.html";

};

// =========================================
// MESSAGE STATUS
// =========================================

socket.on("message delivered", () => {

    if (selectedChat) {

        loadMessages(selectedChat._id);

    }

});

socket.on("message seen", () => {

    if (selectedChat) {

        loadMessages(selectedChat._id);

    }

});

// =========================================
// PROFILE UPLOAD
// =========================================

profilePicInput.onchange = async function () {

    const file = this.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("profilePic", file);

    try {

        const res = await fetch(

            API_URL + "/users/profile-picture",

            {

                method: "PUT",

                headers: {

                    Authorization: "Bearer " + token

                },

                body: formData

            }

        );

        const data = await res.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        currentUser.profilePic = data.user.profilePic;

        localStorage.setItem(

            "user",

            JSON.stringify(currentUser)

        );

        myProfilePic.src = data.user.profilePic;

        profilePreview.src = data.user.profilePic;

        loadChats();

        alert("Profile Updated");

    }

    catch (err) {

        console.log(err);

    }

};

// =========================================
// INITIAL LOAD
// =========================================

window.onload = () => {

    loadCurrentUser();

    loadChats();

};

// =========================================
// SOCKET CONNECT
// =========================================

socket.on("connected", () => {

    console.log("Socket Connected");

});