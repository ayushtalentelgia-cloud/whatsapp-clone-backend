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

        }

    }

    catch (err) {

        console.log(err);

    }

};

// ================= LOAD ALL USERS =================

async function loadUsers() {

    try {

        const res = await fetch(API_URL + "/users", {
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

        data.users.forEach(user => {

            if (user._id === currentUser._id) return;

            const avatar = user.name.charAt(0).toUpperCase();

            const div = document.createElement("div");
            div.className = "chat-item";
            div.dataset.userid = user._id;

            div.innerHTML = `
                <div class="chat-avatar">
                    ${avatar}
                </div>

                <div class="chat-details">
                    <div class="chat-details-top">
                        <h4>${user.name}</h4>
                    </div>

                    <div class="chat-message">
                        ${user.phone || "No Phone"}
                    </div>
                </div>

                <div class="chat-right">
                    <div class="online-dot"></div>
                </div>
            `;

            div.addEventListener("click", async () => {

                document.querySelectorAll(".chat-item").forEach(item => {
                    item.classList.remove("active");
                });

                div.classList.add("active");

                // Move selected chat to top
                chatList.prepend(div);

                await createOrOpenChat(user);

            });

            chatList.appendChild(div);

        });

    } catch (err) {

        console.log("Load Users Error :", err);

    }

}

// ================= LOAD CHATS =================

async function loadChats() {

    try {

        const res = await fetch(API_URL + "/chat", {

            headers: {
                Authorization: "Bearer " + token
            }

        });

        const data = await res.json();

        if (!data.success) {

            console.log(data.message);

            return;

        }

        const chatList = document.getElementById("chatList");

        chatList.innerHTML = "";

        data.chats.forEach(chat => {

            const otherUser = chat.users.find(
                user => user._id !== currentUser._id
            );

            if (!otherUser) return;

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

                        <span>${time}</span>

                    </div>

                    <div class="chat-message">
                        ${lastMessage}
                    </div>

                </div>
            `;

            div.addEventListener("click", async () => {

                document.querySelectorAll(".chat-item").forEach(item => {
                    item.classList.remove("active");
                });

                div.classList.add("active");

                await openChat(chat);

            });

            chatList.appendChild(div);

        });

    } catch (err) {

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
        "Offline";

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

const searchInput = document.getElementById("searchUser");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const users = document.querySelectorAll(".chat-item");

        users.forEach(item => {

            const name = item.querySelector("h4").innerText.toLowerCase();

            if (name.includes(value)) {

                item.style.display = "flex";

            } else {

                item.style.display = "none";

            }

        });

    });

}
// ================= SEARCH USERS =================

const searchUser = document.getElementById("searchUser");

if (searchUser) {

    searchUser.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const chats = document.querySelectorAll(".chat-item");

        chats.forEach(chat => {

            const name = chat.querySelector("h4").innerText.toLowerCase();

            if (name.includes(value)) {

                chat.style.display = "flex";

            } else {

                chat.style.display = "none";

            }

        });

    });

}

// ================= Start =================

loadChats();