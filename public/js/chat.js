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

    console.log("USER =>", user);

    if (user._id === currentUser._id) return;

    const avatar = user.name.charAt(0).toUpperCase();

    const div = document.createElement("div");

    div.className = "chat-item";

            div.innerHTML = `

                <div class="chat-avatar">

                    ${avatar}

                </div>

                <div class="chat-details">

                    <div class="chat-details-top">

                        <h4>${user.name}</h4>

                    </div>

                    <div class="chat-message">

                        ${user.phone}

                    </div>

                </div>

                <div class="chat-right">

                    <div class="online-dot"></div>

                </div>

            `;

            div.onclick = (event) => {

                document.querySelectorAll(".chat-item").forEach(item => {
                    item.classList.remove("active");
                });

                div.classList.add("active");

                createOrOpenChat(user, event);

            };

            chatList.appendChild(div);

        });

    }

    catch (err) {

        console.log("Load Users Error :", err);

    }

}

// ================= CREATE OR OPEN CHAT =================

async function createOrOpenChat(user, event) {

    console.log("Clicked User :", user);

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

        console.log("Response :", data);

        if (!data.success) {
            alert(data.message);
            return;
        }

        // Highlight selected chat
        document.querySelectorAll(".chat-item").forEach(item => {
            item.classList.remove("active");
        });

        if (event) {
            event.currentTarget.classList.add("active");
        }

        console.log("Opening Chat...");

        openChat(data.chat);

    }

    catch (err) {

        console.log(err);

    }

}

// ================= Open Chat =================

async function openChat(chat) {

    console.log("OPEN CHAT =>", chat);

    selectedChat = chat;

    selectedUser = chat.users.find(
        user => user._id !== currentUser._id
    );

    if (!selectedUser) {

        console.log("Other User Not Found");

        return;

    }

    document.getElementById("chatName").innerHTML =
        selectedUser.name;

    document.getElementById("userAvatar").innerHTML =
        selectedUser.name.charAt(0).toUpperCase();

    document.getElementById("onlineStatus").innerHTML =
        "Offline";

    console.log("Joining Chat :", chat._id);

    socket.emit("join chat", chat._id);

    await loadMessages(chat._id);

    console.log("Chat Opened Successfully");

}

// ================= Load Messages =================

async function loadMessages(chatId) {

    try {

        const res = await fetch(API_URL + "/message/" + chatId, {

            headers: {

                Authorization: "Bearer " + token

            }

        });

        const data = await res.json();

        const messages = document.getElementById("messages");

        messages.innerHTML = "";

        data.messages.forEach(message => {

            addMessage(message);

        });

    } catch (err) {

        console.log(err);

    }

}

// ================= ADD MESSAGE =================

function addMessage(message) {

    const messages = document.getElementById("messages");

    const div = document.createElement("div");

    div.className = "message";

    if (message.sender._id === currentUser._id) {

        div.classList.add("sent");

    } else {

        div.classList.add("received");

    }

    const time = new Date(

        message.createdAt || Date.now()

    ).toLocaleTimeString([], {

        hour: "2-digit",

        minute: "2-digit"

    });

    div.innerHTML = `

        <div class="message-text">

            ${message.content}

        </div>

        <span class="message-time">

            ${time}

            ${message.sender._id === currentUser._id ? "✓✓" : ""}

        </span>

    `;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;

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

        addMessage(data.message);

        input.value = "";

    } catch (err) {

        console.log(err);

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

// ================= Socket =================

socket.on("message received", message => {

    if (
        selectedChat &&
        selectedChat._id === message.chat._id
    ) {

        addMessage(message);

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

loadUsers();