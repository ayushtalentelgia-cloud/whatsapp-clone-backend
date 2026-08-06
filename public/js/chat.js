// ============================================
// WhatsApp Clone Chat JS
// ============================================

const API_URL = "https://whatsapp-clone-backend-b5o7.onrender.com/api";

const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("user"));

if (!token) {
    window.location.href = "/index.html";
}

const socket = io("https://whatsapp-clone-backend-b5o7.onrender.com");

socket.emit("setup", currentUser);

let selectedChat = null;
let selectedUser = null;
let typing = false;
let typingTimeout;

// ================= PROFILE PICTURE =================

const myProfilePic = document.getElementById("myProfilePic");

const profilePreview = document.getElementById("profilePreview");

const profilePicInput = document.getElementById("profilePicInput");

// Show Saved Profile Picture

if (currentUser.profilePic) {

    if (myProfilePic) {

        myProfilePic.src = currentUser.profilePic;

    }

    if (profilePreview) {

        profilePreview.src = currentUser.profilePic;

    }

}

// Upload Profile Picture

if (profilePicInput) {

    profilePicInput.onchange = async function () {

        const file = this.files[0];

        if (!file) return;

        const formData = new FormData();

        formData.append("profilePic", file);

        try {

            const res = await fetch(API_URL + "/users/profile-picture", {

                method: "PUT",

                headers: {

                    Authorization: "Bearer " + token

                },

                body: formData

            });

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

            if (myProfilePic) {

                myProfilePic.src = data.user.profilePic;

            }

            if (profilePreview) {

                profilePreview.src = data.user.profilePic;

            }

            alert("Profile Picture Updated Successfully");

        }

        catch (err) {

            console.log(err);

        }

    };

}

// ================= Logout =================

document.getElementById("logoutBtn").onclick = () => {
    localStorage.clear();
    window.location.href = "/index.html";
};

// ================= CONTACT MODAL =================

const addContactBtn = document.getElementById("addContactBtn");

const contactModal = document.getElementById("contactModal");

const closeContactBtn = document.getElementById("closeContactBtn");

const saveContactBtn = document.getElementById("saveContactBtn");

// Open Popup

addContactBtn.onclick = () => {

    contactModal.style.display = "flex";

};

// Close Popup

closeContactBtn.onclick = () => {

    contactModal.style.display = "none";

};

// Close on Background Click

contactModal.onclick = (e) => {

    if (e.target === contactModal) {

        contactModal.style.display = "none";

    }

};

// Save Contact

saveContactBtn.onclick = async () => {

    const name = document.getElementById("contactName").value.trim();

    const phone = document.getElementById("contactPhone").value.trim();

    if (!name || !phone) {

        alert("Please enter Name and Phone");

        return;

    }

    try {

        const res = await fetch(API_URL + "/users/contact", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: "Bearer " + token

            },

            body: JSON.stringify({

                name,

                phone

            })

        });

        const data = await res.json();

        alert(data.message);

        if (data.success) {

    contactModal.style.display = "none";

    document.getElementById("contactName").value = "";

    document.getElementById("contactPhone").value = "";

    // Refresh Contact List
    await loadUsers();

}

    }

    catch (err) {

        console.log(err);

    }

};

// ================= LOAD MY CONTACTS =================

async function loadUsers() {

    try {

        const res = await fetch(API_URL + "/users/contacts", {

            headers: {

                Authorization: "Bearer " + token

            }

        });

        const data = await res.json();

        if (!data.success) {

            console.log(data);

            return;

        }

        const chatList = document.getElementById("chatList");

        chatList.innerHTML = "";

        data.contacts.forEach(contact => {

            const avatar = contact.name.charAt(0).toUpperCase();

            const div = document.createElement("div");

            div.className = "chat-item";

            div.innerHTML = `

                <div class="chat-avatar">

                    ${avatar}

                </div>

                <div class="chat-details">

                    <div class="chat-details-top">

                        <h4>${contact.name}</h4>

                    </div>

                    <div class="chat-message">

                        ${contact.phone}

                    </div>

                </div>

                <div class="chat-right">

                    <div class="online-dot"></div>

                </div>

            `;

            div.onclick = async () => {

                document.querySelectorAll(".chat-item").forEach(item => {

                    item.classList.remove("active");

                });

                div.classList.add("active");

                await createOrOpenChat({

                    _id: contact.user._id,

                    name: contact.name,

                    phone: contact.phone

                });

            };

            chatList.appendChild(div);

        });

    }

    catch (err) {

        console.log("Load Contacts Error :", err);

    }

}

// ================= LOAD CHATS =================

async function loadChats() {

    try {

        const [chatRes, contactRes] = await Promise.all([

            fetch(API_URL + "/chat", {
                headers: {
                    Authorization: "Bearer " + token
                }
            }),

            fetch(API_URL + "/users/contacts", {
                headers: {
                    Authorization: "Bearer " + token
                }
            })

        ]);

        const chatData = await chatRes.json();

        const contactData = await contactRes.json();

        if (!chatData.success) {

            console.log(chatData.message);

            return;

        }

        const chatList = document.getElementById("chatList");

        chatList.innerHTML = "";

        const openedUsers = [];

        // ================= RECENT CHATS =================

        chatData.chats.forEach(chat => {

            const otherUser = chat.users.find(
                user => user._id !== currentUser._id
            );

            if (!otherUser) return;

            openedUsers.push(otherUser._id);

            const avatar = otherUser.name.charAt(0).toUpperCase();

            const lastMessage = chat.latestMessage
                ? chat.latestMessage.content
                : "Start Conversation";

            const time = chat.updatedAt
                ? new Date(chat.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
                : "";

            const div = document.createElement("div");

            div.className = "chat-item";

            div.innerHTML = `

                <div class="chat-avatar">

                    ${avatar}

                </div>

                <div class="chat-details">

                    <div class="chat-details-top">

                        <h4>${otherUser.name}</h4>

                        <span class="chat-time">${time}</span>

                    </div>

                    <div class="chat-message">

                        ${lastMessage}

                    </div>

                </div>

            `;

            div.onclick = async () => {

                document.querySelectorAll(".chat-item").forEach(item => {

                    item.classList.remove("active");

                });

                div.classList.add("active");

                await openChat(chat);

            };

            chatList.appendChild(div);

        });

        // ================= SAVED CONTACTS =================

        if (contactData.success) {

            contactData.contacts.forEach(contact => {

                if (
                    contact.user &&
                    !openedUsers.includes(contact.user._id)
                ) {

                    const avatar = contact.name.charAt(0).toUpperCase();

                    const div = document.createElement("div");

                    div.className = "chat-item";

                    div.innerHTML = `

                        <div class="chat-avatar">

                            ${avatar}

                        </div>

                        <div class="chat-details">

                            <div class="chat-details-top">

                                <h4>${contact.name}</h4>

                            </div>

                            <div class="chat-message">

                                Start Conversation

                            </div>

                        </div>

                    `;

                    div.onclick = async () => {

                        document.querySelectorAll(".chat-item").forEach(item => {

                            item.classList.remove("active");

                        });

                        div.classList.add("active");

                        await createOrOpenChat({

                            _id: contact.user._id,

                            name: contact.name,

                            phone: contact.phone

                        });

                    };

                    chatList.appendChild(div);

                }

            });

        }

    }

    catch (err) {

        console.log("Load Chats Error :", err);

    }

}

// ================= CREATE OR OPEN CHAT =================

async function createOrOpenChat(user) {

    console.log("Clicked User =>", user);

    if (!user || !user.phone) {

        alert("Phone Number Not Found");

        return;

    }

    try {

        const res = await fetch(API_URL + "/chat", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                Authorization: "Bearer " + token

            },

            body: JSON.stringify({

                phone: user.phone

            })

        });

        const data = await res.json();

        console.log("Create Chat Response =>", data);

        if (!data.success) {

            alert(data.message);

            return;

        }

        // Open Chat
        openChat(data.chat);

    }

    catch (err) {

        console.log("Create Chat Error =>", err);

    }

}

// ================= OPEN CHAT =================

async function openChat(chat) {

    if (!chat) {
        console.log("Chat Not Found");
        return;
    }

    if (!chat.users || chat.users.length === 0) {
        console.log("Users Missing In Chat");
        return;
    }

    selectedChat = chat;

    selectedUser = chat.users.find(
        user => user._id !== currentUser._id
    );

    if (!selectedUser) {
        console.log("Other User Not Found");
        return;
    }

    // ===== Header =====

    document.getElementById("chatName").innerHTML =
        selectedUser.name;

    document.getElementById("userAvatar").innerHTML =
        selectedUser.name.charAt(0).toUpperCase();

    document.getElementById("onlineStatus").innerHTML =
    "🟡 Checking...";

    // ===== Clear Old Messages =====

    const messages = document.getElementById("messages");
    messages.innerHTML = `
        <div id="emptyMessages" class="empty-chat">
            Loading Messages...
        </div>
    `;

    // ===== Join Socket Room =====

    socket.emit("join chat", chat._id);

    // ===== Load Messages =====

    await loadMessages(chat._id);

    // ===== Focus Input (Mobile Friendly) =====

    setTimeout(() => {
        document.getElementById("messageInput").focus();
    }, 200);

    // ===== Move Recent Chat To Top =====

    const chatList = document.getElementById("chatList");

    const active = document.querySelector(".chat-item.active");

    if (active) {
        chatList.prepend(active);
    }

    console.log("Chat Opened Successfully");

}
// ================= Load Messages =================

async function loadMessages(chatId) {

    console.log("Loading Messages For =>", chatId);

    try {

        const res = await fetch(API_URL + "/message/" + chatId, {

            headers: {

                Authorization: "Bearer " + token

            }

        });

        const data = await res.json();

        console.log("Messages Response =>", data);

        const messages = document.getElementById("messages");

        messages.innerHTML = "";

        if (!data.success) {

            console.log("Failed To Load Messages");

            return;

        }

        if (data.messages.length === 0) {

            messages.innerHTML = `
                <div style="
                    color:#888;
                    text-align:center;
                    margin-top:40px;
                    font-size:18px;
                ">
                    No Messages Yet
                </div>
            `;

            return;

        }

        data.messages.forEach(message => {

            addMessage(message);

        });

    }

    catch (err) {

        console.log("Load Messages Error =>", err);

    }

}

// ================= ADD MESSAGE =================

function addMessage(message) {

    if (!message) return;

    const messages = document.getElementById("messages");

    // Remove "No Messages Yet"
    const empty = document.getElementById("emptyMessages");
    if (empty) empty.remove();

    // Prevent duplicate messages
    if (document.getElementById("msg-" + message._id)) {
        return;
    }

    const div = document.createElement("div");

    div.id = "msg-" + message._id;

    div.className = "message";

    const isMine = message.sender._id === currentUser._id;

    if (isMine) {
        div.classList.add("sent");
    } else {
        div.classList.add("received");
    }

    // Can Edit/Delete only within 5 Minutes
    const canEdit =
    isMine &&
    !message.deleted &&
    (Date.now() - new Date(message.createdAt).getTime()) <
    5 * 60 * 1000;

            console.log("isMine =", isMine);
console.log("createdAt =", message.createdAt);
console.log("canEdit =", canEdit);

    const time = new Date(
        message.createdAt || Date.now()
    ).toLocaleTimeString([], {

        hour: "2-digit",
        minute: "2-digit"

    });

    div.innerHTML = `

        ${
            canEdit
                ? `
        <div class="message-options">

            ⋮

            <div class="message-menu">

                <button onclick="editMessage('${message._id}')">
                    ✏ Edit
                </button>

                <button onclick="deleteMessage('${message._id}')">
                    🗑 Delete
                </button>

            </div>

        </div>
        `
                : ""
        }

        <div class="message-text">

            ${message.deleted
    ? "<i>This message was deleted</i>"
    : message.content
}

        </div>

        <span class="message-time">

            ${time}

            ${
                message.edited
                    ? '<span class="edited-label">(edited)</span>'
                    : ""
            }

            ${isMine ? " ✓✓" : ""}

        </span>

    `;

    // Toggle Menu
    const option = div.querySelector(".message-options");

    if (option) {

        option.onclick = function (e) {

            e.stopPropagation();

            const menu = option.querySelector(".message-menu");

            if (menu.style.display === "block") {

                menu.style.display = "none";

            } else {

                menu.style.display = "block";

            }

        };

    }

    messages.appendChild(div);

    messages.scrollTo({

        top: messages.scrollHeight,

        behavior: "smooth"

    });

}

// ================= EDIT MESSAGE =================

async function editMessage(messageId) {

    const newMessage = prompt("Edit your message");

    if (!newMessage) return;

    try {

        const res = await fetch(API_URL + "/message/" + messageId, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: "Bearer " + token

            },

            body: JSON.stringify({

                content: newMessage

            })

        });

        const data = await res.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        loadMessages(selectedChat._id);

    }

    catch (err) {

        console.log(err);

    }

}

// ================= DELETE MESSAGE =================

async function deleteMessage(messageId) {

    const ok = confirm("Delete this message?");

    if (!ok) return;

    try {

        const res = await fetch(API_URL + "/message/" + messageId, {

            method: "DELETE",

            headers: {

                Authorization: "Bearer " + token

            }

        });

        const data = await res.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        loadMessages(selectedChat._id);

    }

    catch (err) {

        console.log(err);

    }

}

// ================= Send Message =================

async function sendMessage() {

    if (!selectedChat) {

        alert("Please Select Chat");

        return;

    }

    const input = document.getElementById("messageInput");

    const content = input.value.trim();

    if (!content) return;

    socket.emit("stop typing", selectedChat._id);

    try {

        const res = await fetch(API_URL + "/message", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                Authorization: "Bearer " + token

            },

            body: JSON.stringify({

                content,
                chatId: selectedChat._id

            })

        });

        const data = await res.json();

        if (!data.success) {

            console.log(data.message);

            return;

        }

        // Clear Input Only
        input.value = "";

        input.focus();

        // DON'T call addMessage() here.
        // Message will be added through Socket.IO.

    }

    catch (err) {

        console.log("Send Message Error =>", err);

    }

}

document.getElementById("sendBtn").onclick = sendMessage;


// ================= ENTER KEY =================

document.getElementById("messageInput").addEventListener("keydown", (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();

    }

});


// ================= TYPING =================

document.getElementById("messageInput").addEventListener("input", () => {

    if (!selectedChat) return;

    if (!typing) {

        typing = true;

        socket.emit("typing", selectedChat._id);

    }

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {

        typing = false;

        socket.emit("stop typing", selectedChat._id);

    }, 1500);

});


// ================= SOCKET MESSAGE =================

// Remove old listener (avoids duplicate listeners)
socket.off("message received");

socket.on("message received", (message) => {

    console.log("Socket Message =>", message);

    if (
        selectedChat &&
        selectedChat._id === message.chat._id
    ) {

        addMessage(message);

    }

});
// ================= MESSAGE EDITED =================

socket.on("message edited", (message) => {

    if (
        selectedChat &&
        selectedChat._id === message.chat._id
    ) {

        loadMessages(selectedChat._id);

    }

});

// ================= MESSAGE DELETED =================

socket.on("message deleted", (message) => {

    if (
        selectedChat &&
        selectedChat._id === message.chat._id
    ) {

        loadMessages(selectedChat._id);

    }

});
// ================= Online =================

socket.on("user online", user => {

    if (
        selectedUser &&
        user._id === selectedUser._id
    ) {

        document.getElementById("onlineStatus").innerHTML =
            "🟢 Online";

    }

});

// ================= Offline =================

socket.on("user offline", user => {

    if (
        selectedUser &&
        user._id === selectedUser._id
    ) {

        document.getElementById("onlineStatus").innerHTML =
            "⚫ Offline";

    }

});

// ================= Typing =================

socket.on("typing", () => {

    document.getElementById("onlineStatus").innerHTML =
        "✍ Typing...";

});

socket.on("stop typing", () => {

    if (selectedUser) {

        document.getElementById("onlineStatus").innerHTML =
            "🟢 Online";

    }

});

// ================= Connected =================

socket.on("connected", () => {

    console.log("Socket Connected");

});
// ================= SEARCH USERS =================

// ================= SEARCH CONTACTS =================

const searchUser = document.getElementById("searchUser");

if (searchUser) {

    searchUser.addEventListener("input", function () {

        const value = this.value.trim().toLowerCase();

        const chats = document.querySelectorAll(".chat-item");

        chats.forEach(chat => {

            const name = chat.querySelector("h4")
                ? chat.querySelector("h4").innerText.toLowerCase()
                : "";

            const phone = chat.querySelector(".chat-message")
                ? chat.querySelector(".chat-message").innerText.toLowerCase()
                : "";

            if (
                value === "" ||
                name.includes(value) ||
                phone.includes(value)
            ) {

                chat.style.display = "flex";

            } else {

                chat.style.display = "none";

            }

        });

    });

}

// ================= Start =================

loadChats();