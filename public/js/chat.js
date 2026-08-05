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

// ================= Load Chats =================

async function loadChats() {

    try {

        const res = await fetch(API_URL + "/chat", {
            headers: {
                Authorization: "Bearer " + token
            }
        });

        const data = await res.json();

        const chatList = document.getElementById("chatList");

        chatList.innerHTML = "";

        data.chats.forEach(chat => {

            const otherUser = chat.users.find(
                user => user._id !== currentUser._id
            );

            const lastMessage = chat.latestMessage
                ? chat.latestMessage.content
                : "Start Conversation";

            const avatar = otherUser.name.charAt(0).toUpperCase();

            const div = document.createElement("div");

            div.className = "chat-item";

            div.innerHTML = `
                <div class="chat-avatar">
                    ${avatar}
                </div>

                <div class="chat-details">
                    <h4>${otherUser.name}</h4>
                    <p>${lastMessage}</p>
                </div>
            `;

            div.onclick = () => openChat(chat);

            chatList.appendChild(div);

        });

    } catch (err) {
        console.log(err);
    }
}

// ================= Create Chat =================

document.getElementById("createChatBtn").onclick = async () => {

    const phone = document.getElementById("searchPhone").value.trim();

    if (!phone) {
        alert("Enter Phone Number");
        return;
    }

    try {

        const res = await fetch(API_URL + "/chat", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",
                Authorization: "Bearer " + token

            },

            body: JSON.stringify({ phone })

        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message);
            return;
        }

        document.getElementById("searchPhone").value = "";

        await loadChats();

        openChat(data.chat);

    } catch (err) {

        console.log(err);

    }

};

// ================= Open Chat =================

async function openChat(chat) {

    selectedChat = chat;

    selectedUser = chat.users.find(
        user => user._id !== currentUser._id
    );

    document.getElementById("chatName").innerHTML =
        selectedUser.name;

    document.getElementById("userAvatar").innerHTML =
        selectedUser.name.charAt(0).toUpperCase();

    document.getElementById("onlineStatus").innerHTML =
        "Offline";

    socket.emit("join chat", chat._id);

    loadMessages(chat._id);

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

// ================= Add Message =================

function addMessage(message) {

    const div = document.createElement("div");

    div.className = "message";

    if (message.sender._id === currentUser._id) {

        div.classList.add("sent");

    } else {

        div.classList.add("received");

    }

    div.innerHTML = `
        <div>${message.content}</div>
    `;

    const messages = document.getElementById("messages");

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

// ================= Enter Key =================

document.getElementById("messageInput").addEventListener("keypress", function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});

// ================= Typing =================

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

// ================= Start =================

loadChats();