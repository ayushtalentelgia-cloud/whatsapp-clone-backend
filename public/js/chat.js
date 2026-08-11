// =========================================
// API CONFIG
// =========================================

const API_URL = "https://whatsapp-clone-backend-b5o7.onrender.com/api";
const SOCKET_URL = "https://whatsapp-clone-backend-b5o7.onrender.com";

// =========================================
// AUTH
// =========================================

const token = localStorage.getItem("token");
const currentUser = JSON.parse(localStorage.getItem("user"));

if (!token || !currentUser) {

    window.location.href = "/index.html";

}

// =========================================
// SOCKET
// =========================================

const socket = io(SOCKET_URL);

socket.emit("setup", currentUser);

// =========================================
// GLOBAL VARIABLES
// =========================================

let selectedChat = null;
let selectedUser = null;

let typing = false;
let typingTimeout = null;

// =========================================
// DOM ELEMENTS
// =========================================

// Sidebar

const chatList =
document.getElementById("chatList");

const searchUser =
document.getElementById("searchUser");

const logoutBtn =
document.getElementById("logoutBtn");

const menuBtn =
document.getElementById("menuBtn");

const menuDropdown =
document.getElementById("menuDropdown");

// =========================================
// LOGOUT
// =========================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href = "/index.html";

    });

}

// =========================================
// SIDEBAR MENU
// =========================================

if (menuBtn && menuDropdown) {

    menuBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        menuDropdown.classList.toggle("show");

    });

    document.addEventListener("click", () => {

        menuDropdown.classList.remove("show");

    });

}

// =========================================
// CHAT
// =========================================

const chatName =
document.getElementById("chatName");

const onlineStatus =
document.getElementById("onlineStatus");

const userAvatar =
document.getElementById("userAvatar");

const messages =
document.getElementById("messages");

const messageInput =
document.getElementById("messageInput");

const sendBtn =
document.getElementById("sendBtn");

// =========================================
// EMOJI
// =========================================

const emojiBtn =
document.getElementById("emojiBtn");

const emojiContainer =
document.getElementById("emojiContainer");

const emojiPicker =
document.querySelector("emoji-picker");

// =========================================
// ATTACHMENT
// =========================================

const attachmentBtn =
document.getElementById("attachmentBtn");

const fileInput =
document.getElementById("fileInput");

// =========================================
// PROFILE
// =========================================

const myProfilePic =
document.getElementById("myProfilePic");

const myName =
document.getElementById("myName");

const profilePreview =
document.getElementById("profilePreview");

const profilePicInput =
document.getElementById("profilePicInput");

const profileName =
document.getElementById("profileName");

const profilePhone =
document.getElementById("profilePhone");

const profileEmail =
document.getElementById("profileEmail");

// =========================================
// BUTTONS
// =========================================

const profileBtn =
document.getElementById("profileBtn");

//const logoutBtn =
//document.getElementById("logoutBtn");

const backBtn =
document.getElementById("backBtn");

// Contact

const addContactBtn =
document.getElementById("addContactBtn");

const contactModal =
document.getElementById("contactModal");

const saveContactBtn =
document.getElementById("saveContactBtn");

const closeContactBtn =
document.getElementById("closeContactBtn");

// Profile Modal

const profileModal =
document.getElementById("profileModal");

const closeProfileBtn =
document.getElementById("closeProfileBtn");

const changePhotoBtn =
document.getElementById("changePhotoBtn");

// =========================================
// LOAD CURRENT USER
// =========================================

function loadCurrentUser() {

    myName.innerText = currentUser.name;

    if (profileName) {

        profileName.innerText = currentUser.name;

    }

    if (profilePhone) {

        profilePhone.innerText = currentUser.phone;

    }

    if (profileEmail) {

        profileEmail.innerText = currentUser.email;

    }

    const image =

        currentUser.profilePic &&
        currentUser.profilePic.trim() !== ""

            ? currentUser.profilePic

            : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=38BDF8&color=ffffff`;

    myProfilePic.src = image;

    myProfilePic.onerror = () => {

        myProfilePic.src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=38BDF8&color=ffffff`;

    };

    if (profilePreview) {

        profilePreview.src = image;

        profilePreview.onerror = () => {

            profilePreview.src =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=38BDF8&color=ffffff`;

        };

    }

}

// =========================================
// SOCKET EVENTS
// =========================================

socket.on("connected",()=>{

    console.log("✅ Socket Connected");

});

socket.on("user online",(user)=>{

    if(

        selectedUser &&

        selectedUser._id===user._id

    ){

        onlineStatus.innerText="Online";

        onlineStatus.className="online";

    }

});

socket.on("user offline",(user)=>{

    if(

        selectedUser &&

        selectedUser._id===user._id

    ){

        onlineStatus.innerText="Offline";

        onlineStatus.className="offline";

    }

});

// =========================================
// START
// =========================================

loadCurrentUser();
// =========================================
// LOAD CHATS
// =========================================

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

        renderChats(data.chats);

    }

    catch (err) {

        console.log("Load Chat Error :", err);

    }

}

// =========================================
// RENDER CHAT LIST
// =========================================

function renderChats(chats) {

    chatList.innerHTML = "";

    if (chats.length === 0) {

        chatList.innerHTML = `
            <div class="empty-chat-list">
                No Chats Found
            </div>
        `;

        return;

    }

    chats.forEach(chat => {

        const otherUser = chat.users.find(

            user => user._id !== currentUser._id

        );

        if (!otherUser) return;

        const profilePic = otherUser.profilePic
            ?
            `<img src="${otherUser.profilePic}" class="avatar-img">`
            :
            otherUser.name.charAt(0).toUpperCase();

        const lastMessage =

            chat.latestMessage

            ?

            chat.latestMessage.content

            :

            "Start Conversation";

        const time = chat.updatedAt

            ?

            new Date(chat.updatedAt)

            .toLocaleTimeString([], {

                hour: "2-digit",

                minute: "2-digit"

            })

            :

            "";

        const div = document.createElement("div");

        div.className = "chat-item";

        div.innerHTML = `

            <div class="chat-avatar">

                ${profilePic}

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

        div.addEventListener("click", () => {

            document.querySelectorAll(".chat-item")

            .forEach(item => item.classList.remove("active"));

            div.classList.add("active");

            openChat(chat);

        });

        chatList.appendChild(div);

    });

}

// =========================================
// SEARCH CHAT
// =========================================

searchUser.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    document.querySelectorAll(".chat-item")

    .forEach(chat => {

        const name = chat

        .querySelector("h4")

        .innerText

        .toLowerCase();

        chat.style.display =

            name.includes(value)

            ?

            "flex"

            :

            "none";

    });

});

// =========================================
// REFRESH CHAT LIST
// =========================================

function refreshChats() {

    loadChats();

}

// =========================================
// INITIAL CHAT LOAD
// =========================================

loadChats();
// =========================================
// OPEN CHAT
// =========================================

async function openChat(chat) {

    selectedChat = chat;

    selectedUser = chat.users.find(

        user => user._id !== currentUser._id

    );

    socket.emit("join chat", chat._id);

    chatName.innerText = selectedUser.name;

    onlineStatus.innerText = "Offline";

    onlineStatus.className = "offline";

    // Header Profile Picture

    if (selectedUser.profilePic) {

        userAvatar.innerHTML = `

            <img
                src="${selectedUser.profilePic}"
                class="avatar-img"
            >

        `;

    } else {

        userAvatar.innerHTML =
            selectedUser.name.charAt(0).toUpperCase();

    }

    await loadMessages(chat._id);

    // Mobile View

    if (window.innerWidth <= 900) {

        document.querySelector(".sidebar")
            .classList.add("hide");

        document.querySelector(".chat-section")
            .classList.add("active");

    }

}

// =========================================
// LOAD MESSAGES
// =========================================

async function loadMessages(chatId) {

    try {

        const res = await fetch(

            API_URL + "/message/" + chatId,

            {

                headers: {

                    Authorization:
                        "Bearer " + token

                }

            }

        );

        const data = await res.json();

        if (!data.success) {

            console.log(data.message);

            return;

        }

        messages.innerHTML = "";

        data.messages.forEach(message => {

            renderMessage(message);

        });

        scrollBottom();

    }

    catch (err) {

        console.log(err);

    }

}

// =========================================
// RENDER MESSAGE
// =========================================

function renderMessage(message) {

    const div = document.createElement("div");

    div.id = "msg-" + message._id;

    div.className =
        message.sender._id === currentUser._id
        ?
        "message sent"
        :
        "message received";

    const time =
        new Date(message.createdAt)
        .toLocaleTimeString([], {

            hour: "2-digit",

            minute: "2-digit"

        });

    div.innerHTML = `

        <div class="message-text">

            ${message.content}

        </div>

        <span class="message-time">

            ${time}

        </span>

    `;

    messages.appendChild(div);

}

// =========================================
// SCROLL TO BOTTOM
// =========================================

function scrollBottom() {

    messages.scrollTop =
        messages.scrollHeight;

}

// =========================================
// MOBILE BACK BUTTON
// =========================================

if (backBtn) {

    backBtn.onclick = () => {

        document.querySelector(".sidebar")
            .classList.remove("hide");

        document.querySelector(".chat-section")
            .classList.remove("active");

    };

}

// =========================================
// SOCKET RECEIVE MESSAGE
// =========================================

socket.off("message received");

socket.on("message received", (message) => {

    if (

        selectedChat &&

        selectedChat._id === message.chat._id

    ) {

        renderMessage(message);

        scrollBottom();

    }

    refreshChats();

});
// =========================================
// SEND MESSAGE
// =========================================

async function sendMessage() {

    if (!selectedChat) {

        alert("Select a chat first");

        return;

    }

    const content = messageInput.value.trim();

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

            alert(data.message);

            return;

        }

        messageInput.value = "";

        renderMessage(data.message);

        scrollBottom();

        refreshChats();

    }

    catch (err) {

        console.log(err);

    }

}

// =========================================
// SEND BUTTON
// =========================================

sendBtn.addEventListener("click", sendMessage);

// =========================================
// ENTER TO SEND
// =========================================

messageInput.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        sendMessage();

    }

});

// =========================================
// TYPING
// =========================================

messageInput.addEventListener("input", () => {

    if (!selectedChat) return;

    if (!typing) {

        typing = true;

        socket.emit("typing", selectedChat._id);

    }

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {

        socket.emit("stop typing", selectedChat._id);

        typing = false;

    }, 1500);

});

// =========================================
// SHOW TYPING
// =========================================

socket.on("typing", () => {

    const indicator = document.getElementById("typingIndicator");

    if (indicator) {

        indicator.style.display = "block";

        indicator.innerText = "Typing...";

    }

});

// =========================================
// STOP TYPING
// =========================================

socket.on("stop typing", () => {

    const indicator = document.getElementById("typingIndicator");

    if (indicator) {

        indicator.style.display = "none";

    }

});

// =========================================
// MESSAGE DELIVERED
// =========================================

socket.on("message delivered", () => {

    if (selectedChat) {

        loadMessages(selectedChat._id);

    }

});

// =========================================
// MESSAGE SEEN
// =========================================

socket.on("message seen", () => {

    if (selectedChat) {

        loadMessages(selectedChat._id);

    }

});

// =========================================
// AUTO MARK SEEN
// =========================================

async function markMessagesSeen(messageId) {

    try {

        await fetch(API_URL + "/message/seen/" + messageId, {

            method: "PUT",

            headers: {

                Authorization: "Bearer " + token

            }

        });

    }

    catch (err) {

        console.log(err);

    }

}
// =========================================
// MESSAGE MENU
// =========================================

let selectedMessageId = null;

messages.addEventListener("contextmenu", function (e) {

    const bubble = e.target.closest(".message.sent");

    if (!bubble) return;

    e.preventDefault();

    selectedMessageId = bubble.id.replace("msg-", "");

    const menu = document.getElementById("messageContextMenu");

    menu.style.display = "block";

    menu.style.left = e.pageX + "px";

    menu.style.top = e.pageY + "px";

});

// =========================================
// HIDE MENU
// =========================================

document.addEventListener("click", () => {

    const menu = document.getElementById("messageContextMenu");

    if (menu) {

        menu.style.display = "none";

    }

});

// =========================================
// EDIT MESSAGE
// =========================================

const editBtn = document.getElementById("editMessageBtn");

if (editBtn) {

    editBtn.addEventListener("click", async () => {

        if (!selectedMessageId) return;

        const bubble = document.querySelector(

            "#msg-" + selectedMessageId + " .message-text"

        );

        if (!bubble) return;

        const oldText = bubble.innerText;

        const newText = prompt(

            "Edit Message",

            oldText

        );

        if (!newText) return;

        try {

            const res = await fetch(

                API_URL + "/message/edit/" + selectedMessageId,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization: "Bearer " + token

                    },

                    body: JSON.stringify({

                        content: newText

                    })

                }

            );

            const data = await res.json();

            if (!data.success) {

                alert(data.message);

                return;

            }

        }

        catch (err) {

            console.log(err);

        }

    });

}

// =========================================
// DELETE MESSAGE
// =========================================

const deleteBtn = document.getElementById("deleteMessageBtn");

if (deleteBtn) {

    deleteBtn.addEventListener("click", async () => {

        if (!selectedMessageId) return;

        if (!confirm("Delete this message?")) return;

        try {

            const res = await fetch(

                API_URL + "/message/delete/" + selectedMessageId,

                {

                    method: "PUT",

                    headers: {

                        Authorization: "Bearer " + token

                    }

                }

            );

            const data = await res.json();

            if (!data.success) {

                alert(data.message);

                return;

            }

        }

        catch (err) {

            console.log(err);

        }

    });

}

// =========================================
// SOCKET MESSAGE EDITED
// =========================================

socket.off("message edited");

socket.on("message edited", (message) => {

    const div = document.getElementById(

        "msg-" + message._id

    );

    if (!div) return;

    div.querySelector(".message-text").innerHTML =

        message.content +

        ' <small style="opacity:.6">(edited)</small>';

});

// =========================================
// SOCKET MESSAGE DELETED
// =========================================

socket.off("message deleted");

socket.on("message deleted", (message) => {

    const div = document.getElementById(

        "msg-" + message._id

    );

    if (!div) return;

    div.querySelector(".message-text").innerHTML =

        "<i>This message was deleted</i>";

});
// =========================================
// ADD CONTACT
// =========================================

if (addContactBtn) {

    addContactBtn.addEventListener("click", () => {

        contactModal.classList.add("active");

    });

}

if (closeContactBtn) {

    closeContactBtn.addEventListener("click", () => {

        contactModal.classList.remove("active");

    });

}

if (saveContactBtn) {

    saveContactBtn.addEventListener("click", async () => {

        const name = document
            .getElementById("contactName")
            .value
            .trim();

        const phone = document
            .getElementById("contactPhone")
            .value
            .trim();

        if (!name || !phone) {

            alert("Enter Name & Phone");

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

                contactModal.classList.remove("active");

                document.getElementById("contactName").value = "";

                document.getElementById("contactPhone").value = "";

                loadChats();

            }

        }

        catch (err) {

            console.log(err);

        }

    });

}

// =========================================
// PROFILE MODAL
// =========================================

if (profileBtn) {

    profileBtn.onclick = () => {

        profileModal.classList.add("active");

    };

}

if (closeProfileBtn) {

    closeProfileBtn.onclick = () => {

        profileModal.classList.remove("active");

    };

}

// =========================================
// PROFILE PICTURE
// =========================================

if (changePhotoBtn) {

    changePhotoBtn.onclick = () => {

        profilePicInput.click();

    };

}

if (profilePicInput) {

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

            loadCurrentUser();

            loadChats();

            alert("Profile Updated");

        }

        catch (err) {

            console.log(err);

        }

    };

}

// =========================================
// LOGOUT
// =========================================

if (logoutBtn) {

    logoutBtn.onclick = () => {

        if (!confirm("Logout?")) return;

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href = "/index.html";

    };

}

// =========================================
// CLOSE MODAL
// =========================================

window.addEventListener("click", (e) => {

    if (e.target === contactModal) {

        contactModal.classList.remove("active");

    }

    if (e.target === profileModal) {

        profileModal.classList.remove("active");

    }

});

// =========================================
// PAGE LOAD
// =========================================

window.addEventListener("load", () => {

    loadCurrentUser();

    loadChats();

});

// =========================================
// SOCKET RECONNECT
// =========================================

socket.on("connect", () => {

    socket.emit("setup", currentUser);

});
// =========================================
// EMOJI PICKER
// =========================================

// Open Emoji Picker

emojiBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    emojiContainer.classList.toggle("active");

});

// Select Emoji

emojiPicker.addEventListener("emoji-click", (event) => {

    messageInput.value += event.detail.unicode;

    messageInput.focus();

});

// Close Picker Outside

document.addEventListener("click", (e) => {

    if (

        !emojiContainer.contains(e.target) &&

        !emojiBtn.contains(e.target)

    ) {

        emojiContainer.classList.remove("active");

    }

});
// =========================================
// ATTACHMENT
// =========================================

// Open File Picker

attachmentBtn.addEventListener("click", () => {

    fileInput.click();

});