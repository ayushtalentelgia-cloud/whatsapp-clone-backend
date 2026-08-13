// =========================================
// API CONFIG
// =========================================

const API_URL =
   "https://whatsapp-clone-backend-b5o7.onrender.com/api";

const SOCKET_URL =
    "https://whatsapp-clone-backend-b5o7.onrender.com";

    // =========================================
// API CONFIG
// =========================================

// const API_URL =
//     "http://localhost:5000/api";

// const SOCKET_URL =
//     "http://localhost:5000";

// =========================================
// AUTH
// =========================================

const token =
    localStorage.getItem("token");

const currentUser =
    JSON.parse(
        localStorage.getItem("user")
    );

if (!token || !currentUser) {

    window.location.href =
        "/index.html";

}

// =========================================
// SOCKET
// =========================================

const socket =
    io(SOCKET_URL);

socket.emit(
    "setup",
    currentUser
);

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

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "/index.html";

        }
    );

}

// =========================================
// SIDEBAR MENU
// =========================================

if (
    menuBtn &&
    menuDropdown
) {

    menuBtn.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            menuDropdown.classList.toggle(
                "show"
            );

        }
    );

    document.addEventListener(
        "click",
        () => {

            menuDropdown.classList.remove(
                "show"
            );

        }
    );

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
    document.getElementById(
        "emojiContainer"
    );

const emojiPicker =
    document.querySelector(
        "emoji-picker"
    );

// =========================================
// ATTACHMENT
// =========================================

const attachmentBtn =
    document.getElementById(
        "attachmentBtn"
    );

const fileInput =
    document.getElementById(
        "fileInput"
    );

// =========================================
// PROFILE
// =========================================

const myProfilePic =
    document.getElementById(
        "myProfilePic"
    );

const myName =
    document.getElementById("myName");

const myAbout =
    document.getElementById(
        "myAbout"
    );    

const profilePreview =
    document.getElementById(
        "profilePreview"
    );

const profilePicInput =
    document.getElementById(
        "profilePicInput"
    );

const profileName =
    document.getElementById(
        "profileName"
    );

const profilePhone =
    document.getElementById(
        "profilePhone"
    );

const profileEmail =
    document.getElementById(
        "profileEmail"
    );

// =========================================
// BUTTONS
// =========================================

const profileBtn =
    document.getElementById(
        "profileBtn"
    );

const backBtn =
    document.getElementById(
        "backBtn"
    );

// =========================================
// CONTACT
// =========================================

const addContactBtn =
    document.getElementById(
        "addContactBtn"
    );

const contactModal =
    document.getElementById(
        "contactModal"
    );

const saveContactBtn =
    document.getElementById(
        "saveContactBtn"
    );

const closeContactBtn =
    document.getElementById(
        "closeContactBtn"
    );

// =========================================
// PROFILE MODAL
// =========================================

const profileModal =
    document.getElementById(
        "profileModal"
    );

const closeProfileBtn =
    document.getElementById(
        "closeProfileBtn"
    );

const changePhotoBtn =
    document.getElementById(
        "changePhotoBtn"
    );

// =========================================
// PROFILE IMAGE VIEWER
// =========================================

let imageViewer = null;

let imageViewerImg = null;

let closeImageViewerBtn = null;


// =========================================
// CREATE PROFILE IMAGE VIEWER
// =========================================

function createImageViewer() {

    // Already created
    if (
        document.getElementById(
            "imageViewer"
        )
    ) {

        imageViewer =
            document.getElementById(
                "imageViewer"
            );

        imageViewerImg =
            document.getElementById(
                "imageViewerImg"
            );

        closeImageViewerBtn =
            document.getElementById(
                "closeImageViewer"
            );

        return;

    }

    // =====================================
    // CREATE VIEWER
    // =====================================

    imageViewer =
        document.createElement("div");

    imageViewer.id =
        "imageViewer";

    imageViewer.innerHTML = `

        <button
            type="button"
            id="closeImageViewer"
            aria-label="Close image"
        >
            ×
        </button>

        <img
            id="imageViewerImg"
            src=""
            alt="Profile Image"
        >

    `;

    document.body.appendChild(
        imageViewer
    );

    imageViewerImg =
        document.getElementById(
            "imageViewerImg"
        );

    closeImageViewerBtn =
        document.getElementById(
            "closeImageViewer"
        );

    // =====================================
    // VIEWER CSS
    // =====================================

    const style =
        document.createElement("style");

    style.id =
        "profileImageViewerStyles";

    style.innerHTML = `

        #imageViewer {

            position: fixed;

            inset: 0;

            display: none;

            align-items: center;

            justify-content: center;

            background:
                rgba(0, 0, 0, 0.88);

            z-index: 999999;

            padding: 20px;

        }

        #imageViewer.active {

            display: flex;

        }

        #imageViewerImg {

            width: min(420px, 85vw);

            height: min(420px, 85vw);

            max-width: 90vw;

            max-height: 85vh;

            object-fit: cover;

            object-position: center;

            border-radius: 50%;

            border: 4px solid #ffffff;

            box-shadow:
                0 20px 60px
                rgba(0, 0, 0, 0.55);

            background: #000;

        }

        #closeImageViewer {

            position: absolute;

            top: 20px;

            right: 24px;

            width: 46px;

            height: 46px;

            border: none;

            border-radius: 50%;

            background:
                rgba(255,255,255,.15);

            color: #ffffff;

            font-size: 30px;

            line-height: 46px;

            text-align: center;

            cursor: pointer;

            z-index: 1000000;

        }

        #closeImageViewer:hover {

            background: #ffffff;

            color: #000000;

        }

        .profile-pic,
        .chat-avatar,
        .chat-avatar img {

            cursor: pointer;

        }

    `;

    document.head.appendChild(
        style
    );

    // =====================================
    // CLOSE BUTTON
    // =====================================

    closeImageViewerBtn.onclick =
        closeProfileImage;

    // =====================================
    // BACKGROUND CLICK
    // =====================================

    imageViewer.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                imageViewer
            ) {

                closeProfileImage();

            }

        }
    );

}


// =========================================
// OPEN PROFILE IMAGE
// =========================================

function openProfileImage(
    imageSrc
) {

    if (!imageSrc) return;

    if (!imageViewer) {

        createImageViewer();

    }

    imageViewerImg.src =
        imageSrc;

    imageViewer.classList.add(
        "active"
    );

}


// =========================================
// CLOSE PROFILE IMAGE
// =========================================

function closeProfileImage() {

    if (!imageViewer) return;

    imageViewer.classList.remove(
        "active"
    );

    if (imageViewerImg) {

        imageViewerImg.src = "";

    }

}


// =========================================
// ESC KEY CLOSE
// =========================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape"
        ) {

            closeProfileImage();

        }

    }
);

// =========================================
// GET USER PROFILE IMAGE
// =========================================

function getUserProfileImage(
    user
) {

    if (
        user &&
        user.profilePic &&
        user.profilePic.trim() !== ""
    ) {

        return user.profilePic;

    }

    return `
        https://ui-avatars.com/api/
        ?name=${encodeURIComponent(
            user?.name || "User"
        )}
        &background=38BDF8
        &color=ffffff
    `.replace(/\s/g, "");

}

// =========================================
// LOAD CURRENT USER
// =========================================

function loadCurrentUser() {

    if (myName) {

        myName.innerText =
            currentUser.name;

    }

    if (myAbout) {

    myAbout.innerText =
        currentUser.about ||
        "Welcome";

}

    if (profileName) {

        profileName.innerText =
            currentUser.name;

    }

    if (profilePhone) {

        profilePhone.innerText =
            currentUser.phone;

    }

    if (profileEmail) {

        profileEmail.innerText =
            currentUser.email;

    }

    const image =
        getUserProfileImage(
            currentUser
        );

    if (myProfilePic) {

        myProfilePic.src =
            image;

        myProfilePic.onerror =
            () => {

                myProfilePic.src =
                    getUserProfileImage(
                        {
                            name:
                                currentUser.name
                        }
                    );

            };

// =========================================
// EDIT ABOUT
// =========================================

const aboutModal =
    document.getElementById("aboutModal");

const aboutInput =
    document.getElementById("aboutInput");

const saveAboutBtn =
    document.getElementById("saveAboutBtn");

const closeAboutBtn =
    document.getElementById("closeAboutBtn");


// =========================================
// OPEN ABOUT MODAL
// =========================================

if (myAbout) {

    myAbout.addEventListener(
        "click",
        () => {

            if (!aboutModal) return;

            aboutInput.value =
                currentUser.about ||
                "";

            aboutModal.classList.add(
                "active"
            );

            aboutInput.focus();

        }
    );

}


// =========================================
// CLOSE ABOUT MODAL
// =========================================

if (closeAboutBtn) {

    closeAboutBtn.addEventListener(
        "click",
        () => {

            aboutModal.classList.remove(
                "active"
            );

        }
    );

}


// =========================================
// SAVE ABOUT
// =========================================

if (saveAboutBtn) {

    saveAboutBtn.addEventListener(
        "click",
        async () => {

            const about =
                aboutInput.value.trim();

            if (!about) {

                alert(
                    "Please enter something."
                );

                return;

            }

            try {

                saveAboutBtn.disabled =
                    true;

                const response =
                    await fetch(
                        API_URL +
                        "/users/profile",
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    "Bearer " +
                                    token

                            },

                            body:
                                JSON.stringify({
                                    about
                                })

                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to update About."
                    );

                }


                // =================================
                // UPDATE UI
                // =================================

                myAbout.innerText =
                    data.user.about;


                // =================================
                // UPDATE CURRENT USER
                // =================================

                currentUser.about =
                    data.user.about;


                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        currentUser
                    )
                );


                // =================================
                // CLOSE MODAL
                // =================================

                aboutModal.classList.remove(
                    "active"
                );

            }

            catch (error) {

                console.error(
                    "About Update Error:",
                    error
                );

                alert(
                    error.message
                );

            }

            finally {

                saveAboutBtn.disabled =
                    false;

            }

        }
    );

}            

        // =================================
        // OPEN MY PROFILE IMAGE
        // =================================

        myProfilePic.onclick =
            (event) => {

                event.stopPropagation();

                openProfileImage(
                    myProfilePic.src
                );

            };

    }

    if (profilePreview) {

        profilePreview.src =
            image;

        profilePreview.onerror =
            () => {

                profilePreview.src =
                    getUserProfileImage(
                        {
                            name:
                                currentUser.name
                        }
                    );

            };

    }

}

// =========================================
// SOCKET EVENTS
// =========================================

socket.on(
    "connected",
    () => {

        console.log(
            "✅ Socket Connected"
        );

    }
);

socket.on(
    "user online",
    (user) => {

        if (

            selectedUser &&

            selectedUser._id ===
                user._id

        ) {

            onlineStatus.innerText =
                "Online";

            onlineStatus.className =
                "online";

        }

    }
);

socket.on(
    "user offline",
    (user) => {

        if (

            selectedUser &&

            selectedUser._id ===
                user._id

        ) {

            onlineStatus.innerText =
                "Offline";

            onlineStatus.className =
                "offline";

        }

    }
);

// =========================================
// START
// =========================================

createImageViewer();

loadCurrentUser();

// =========================================
// LOAD CHATS
// =========================================

async function loadChats() {

    try {

        const res =
            await fetch(
                API_URL + "/chat",
                {

                    headers: {

                        Authorization:
                            "Bearer " + token

                    }

                }
            );

        const data =
            await res.json();

        if (!data.success) {

            console.log(
                data.message
            );

            return;

        }

        renderChats(
            data.chats
        );

    }

    catch (err) {

        console.log(
            "Load Chat Error :",
            err
        );

    }

}

// =========================================
// RENDER CHAT LIST
// =========================================

function renderChats(chats) {

    chatList.innerHTML = "";

    if (
        chats.length === 0
    ) {

        chatList.innerHTML = `
            <div class="empty-chat-list">
                No Chats Found
            </div>
        `;

        return;

    }


    chats.forEach(
        chat => {

            const otherUser =
                chat.users.find(
                    user =>
                        user._id !==
                        currentUser._id
                );

            if (!otherUser) return;


            // =====================================
            // PROFILE IMAGE
            // =====================================

            const profilePic =
                otherUser.profilePic

                ?

                `<img
                    src="${otherUser.profilePic}"
                    class="avatar-img"
                    alt="${otherUser.name}"
                >`

                :

                otherUser.name
                    .charAt(0)
                    .toUpperCase();


            // =====================================
            // LAST MESSAGE
            // =====================================

            const lastMessage =
                chat.latestMessage
                    ?
                    chat.latestMessage.content
                    :
                    "Start Conversation";


            // =====================================
            // TIME
            // =====================================

            const time =
                chat.updatedAt
                    ?
                    new Date(
                        chat.updatedAt
                    ).toLocaleTimeString(
                        [],
                        {
                            hour:
                                "2-digit",

                            minute:
                                "2-digit"
                        }
                    )
                    :
                    "";


            // =====================================
            // UNREAD COUNT
            // =====================================

            const unreadData =
                chat.unreadCounts?.find(
                    item =>
                        item.user?.toString() ===
                        currentUser._id.toString()
                );


            const unreadCount =
                unreadData?.count || 0;


            // =====================================
            // CREATE CHAT ITEM
            // =====================================

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "chat-item";


            // =====================================
            // CHAT HTML
            // =====================================

            div.innerHTML = `

                <div class="chat-avatar">

                    ${profilePic}

                </div>


                <div class="chat-details">

                    <div class="chat-details-top">

                        <h4>
                            ${otherUser.name}
                        </h4>

                        <span>
                            ${time}
                        </span>

                    </div>


                    <div class="chat-message">

                        ${lastMessage}

                    </div>

                </div>


                ${
                    unreadCount > 0
                        ?
                        `
                        <div
                            class="unread-indicator"
                            title="${unreadCount} unread message${unreadCount > 1 ? "s" : ""}"
                        >

                            ${
                                unreadCount > 99
                                    ?
                                    "99+"
                                    :
                                    unreadCount
                            }

                        </div>
                        `
                        :
                        ""
                }

            `;


            // =====================================
            // CHAT ITEM CLICK
            // =====================================

            div.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".chat-item"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    div.classList.add(
                        "active"
                    );


                    openChat(
                        chat
                    );

                }
            );


            // =====================================
            // ADD CHAT TO LIST
            // =====================================

            chatList.appendChild(
                div
            );

        }
    );



            // =================================
            // CHAT ITEM CLICK
            // =================================

            div.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".chat-item"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );

                    div.classList.add(
                        "active"
                    );

                    openChat(chat);

                }
            );

            // =================================
            // CHAT LIST IMAGE CLICK
            // =================================

            const chatAvatar =
                div.querySelector(
                    ".chat-avatar"
                );

            if (chatAvatar) {

                chatAvatar.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();

                        openProfileImage(
                            getUserProfileImage(
                                otherUser
                            )
                        );

                    }
                );

            }

            chatList.appendChild(
                div
            );
        }

// =========================================
// SEARCH CHAT
// =========================================

if (searchUser) {

    searchUser.addEventListener(
        "keyup",
        function () {

            const value =
                this.value
                    .toLowerCase();

            document
                .querySelectorAll(
                    ".chat-item"
                )
                .forEach(
                    chat => {

                        const name =
                            chat
                                .querySelector(
                                    "h4"
                                )
                                .innerText
                                .toLowerCase();

                        chat.style.display =
                            name.includes(
                                value
                            )
                                ?
                                "flex"
                                :
                                "none";

                    }
                );

        }
    );

}

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

    selectedChat =
        chat;

    selectedUser =
        chat.users.find(
            user =>
                user._id !==
                currentUser._id
        );

    socket.emit(
        "join chat",
        chat._id
    );

    chatName.innerText =
        selectedUser.name;

    onlineStatus.innerText =
        "Offline";

    onlineStatus.className =
        "offline";

    // =====================================
    // HEADER PROFILE IMAGE
    // =====================================

    const selectedUserImage =
        getUserProfileImage(
            selectedUser
        );

    userAvatar.innerHTML = `

        <img
            src="${selectedUserImage}"
            class="avatar-img"
            alt="${selectedUser.name}"
        >

    `;

    // =====================================
    // OPEN OTHER USER IMAGE
    // =====================================

    userAvatar.onclick =
        (event) => {

            event.stopPropagation();

            openProfileImage(
                selectedUserImage
            );

        };

    // =====================================
    // LOAD MESSAGES
    // =====================================

    await loadMessages(
        chat._id
    );
// =====================================
// MARK UNREAD MESSAGES AS SEEN
// =====================================

try {

    const messagesRes =
        await fetch(
            API_URL +
            "/message/" +
            chat._id,
            {

                headers: {

                    Authorization:
                        "Bearer " +
                        token

                }

            }
        );

    const messagesData =
        await messagesRes.json();

    if (
        messagesData.success &&
        messagesData.messages
    ) {

        const unreadMessages =
            messagesData.messages.filter(
                message =>
                    message.sender &&
                    message.sender._id.toString() !==
                        currentUser._id.toString() &&
                    !message.seen
            );

        for (
            const message of unreadMessages
        ) {

            await markMessagesSeen(
                message._id
            );

        }

    }

}
catch (error) {

    console.error(
        "Mark unread messages seen error:",
        error
    );

}
    // =====================================
    // MOBILE VIEW
    // =====================================

    if (
        window.innerWidth <= 900
    ) {

        document
            .querySelector(
                ".sidebar"
            )
            .classList.add(
                "hide"
            );

        document
            .querySelector(
                ".chat-section"
            )
            .classList.add(
                "active"
            );

    }

}

// =========================================
// LOAD MESSAGES
// =========================================

async function loadMessages(
    chatId
) {

    try {

        const res =
            await fetch(
                API_URL +
                "/message/" +
                chatId,
                {

                    headers: {

                        Authorization:
                            "Bearer " +
                            token

                    }

                }
            );

        const data =
            await res.json();

        if (!data.success) {

            console.log(
                data.message
            );

            return;

        }

        messages.innerHTML =
            "";

        data.messages.forEach(
            message => {

                renderMessage(
                    message
                );

            }
        );

        scrollBottom();

    }

    catch (err) {

        console.log(err);

    }

}

// =========================================
// GET MESSAGE STATUS
// =========================================

function getMessageStatus(message) {

    // Received message par ticks nahi
    if (
        !message ||
        !message.sender ||
        message.sender._id.toString() !==
        currentUser._id.toString()
    ) {

        return "";

    }

    // Seen = Blue Double Tick
    if (message.seen) {

        return `
            <span
                class="message-status seen"
                title="Seen"
            >
                ✓✓
            </span>
        `;

    }

    // Delivered = Double Tick
    if (message.delivered) {

        return `
            <span
                class="message-status delivered"
                title="Delivered"
            >
                ✓✓
            </span>
        `;

    }

    // Sent = Single Tick
    return `
        <span
            class="message-status sent"
            title="Sent"
        >
            ✓
        </span>
    `;

}


// =========================================
// RENDER MESSAGE
// =========================================

function renderMessage(message) {

    if (
        !message ||
        !message._id
    ) {

        return;

    }


    // =====================================
    // PREVENT DUPLICATE MESSAGE
    // =====================================

    const existingMessage =
        document.getElementById(
            "msg-" +
            message._id
        );


    if (existingMessage) {

        return;

    }


    // =====================================
    // CREATE MESSAGE
    // =====================================

    const div =
        document.createElement(
            "div"
        );


    div.id =
        "msg-" +
        message._id;


    const isSent =
        message.sender &&
        message.sender._id.toString() ===
        currentUser._id.toString();


    div.className =
        isSent
            ?
            "message sent"
            :
            "message received";


    // =====================================
    // TIME
    // =====================================

    const time =
        new Date(
            message.createdAt
        ).toLocaleTimeString(
            [],
            {

                hour:
                    "2-digit",

                minute:
                    "2-digit"

            }
        );


    // =====================================
    // STATUS
    // =====================================

    const status =
        getMessageStatus(
            message
        );


    // =====================================
    // MESSAGE HTML
    // =====================================

    div.innerHTML = `

        <div class="message-text">

            ${message.content}

        </div>

        <div class="message-meta">

            <span class="message-time">

                ${time}

            </span>

            ${status}

        </div>

    `;


    messages.appendChild(
        div
    );

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

    backBtn.onclick =
        () => {

            document
                .querySelector(
                    ".sidebar"
                )
                .classList.remove(
                    "hide"
                );

            document
                .querySelector(
                    ".chat-section"
                )
                .classList.remove(
                    "active"
                );

        };

}

// =========================================
// SOCKET RECEIVE MESSAGE
// =========================================

socket.off(
    "message received"
);

socket.on(
    "message received",
    (message) => {

        // =====================================
        // CHECK MESSAGE
        // =====================================

        if (!message || !message._id) {

            return;

        }


        // =====================================
        // MARK RECEIVED MESSAGE AS DELIVERED
        // =====================================

        if (
            message.sender &&
            message.sender._id.toString() !==
                currentUser._id.toString()
        ) {

            markMessageDelivered(
                message._id
            );

        }


        // =====================================
        // SHOW MESSAGE IN OPEN CHAT
        // =====================================

        if (
            selectedChat &&
            message.chat
        ) {

            const messageChatId =
                message.chat._id.toString();

            const selectedChatId =
                selectedChat._id.toString();


            if (
                selectedChatId ===
                messageChatId
            ) {

                renderMessage(
                    message
                );

                scrollBottom();

            }

        }

        // =====================================
// MARK MESSAGE AS SEEN
// =====================================

if (
    selectedChat &&
    message.sender &&
    message.sender._id.toString() !==
        currentUser._id.toString() &&
    message.chat &&
    selectedChat._id.toString() ===
        message.chat._id.toString()
) {

    markMessagesSeen(
        message._id
    );

}


        // =====================================
        // REFRESH CHAT LIST
        // =====================================

        refreshChats();

    }
);

// =========================================
// SEND MESSAGE
// =========================================

async function sendMessage() {

    if (!selectedChat) {

        alert(
            "Select a chat first"
        );

        return;

    }

    const content =
        messageInput.value.trim();

    if (!content) return;

    socket.emit(
        "stop typing",
        selectedChat._id
    );

    try {

        const res =
            await fetch(
                API_URL + "/message",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " +
                            token

                    },

                    body:
                        JSON.stringify(
                            {

                                content:
                                    content,

                                chatId:
                                    selectedChat._id

                            }
                        )

                }
            );

        const data =
            await res.json();

        if (!data.success) {

            alert(
                data.message
            );

            return;

        }

        messageInput.value =
            "";

        renderMessage(
            data.message
        );

        scrollBottom();

        refreshChats();

    }

    catch (err) {

        console.error(
            "Send message error:",
            err
        );

    }

}

// =========================================
// SEND BUTTON
// =========================================

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        sendMessage
    );

}

// =========================================
// ENTER TO SEND
// =========================================

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        function (e) {

            if (
                e.key === "Enter"
            ) {

                e.preventDefault();

                sendMessage();

            }

        }
    );

}

// =========================================
// TYPING
// =========================================

if (messageInput) {

    messageInput.addEventListener(
        "input",
        () => {

            if (!selectedChat)
                return;

            if (!typing) {

                typing = true;

                socket.emit(
                    "typing",
                    selectedChat._id
                );

            }

            clearTimeout(
                typingTimeout
            );

            typingTimeout =
                setTimeout(
                    () => {

                        socket.emit(
                            "stop typing",
                            selectedChat._id
                        );

                        typing = false;

                    },
                    1500
                );

        }
    );

}

// =========================================
// SHOW TYPING
// =========================================

socket.on(
    "typing",
    () => {

        const indicator =
            document.getElementById(
                "typingIndicator"
            );

        if (indicator) {

            indicator.style.display =
                "block";

            indicator.innerText =
                "Typing...";

        }

    }
);

// =========================================
// STOP TYPING
// =========================================

socket.on(
    "stop typing",
    () => {

        const indicator =
            document.getElementById(
                "typingIndicator"
            );

        if (indicator) {

            indicator.style.display =
                "none";

        }

    }
);

// =========================================
// MESSAGE DELIVERED
// =========================================

socket.on(
    "message delivered",
    () => {

        if (selectedChat) {

            loadMessages(
                selectedChat._id
            );

        }

    }
);

// =========================================
// MESSAGE SEEN
// =========================================

socket.on(
    "message seen",
    () => {

        if (selectedChat) {

            loadMessages(
                selectedChat._id
            );

        }

    }
);

// =========================================
// MARK MESSAGE DELIVERED
// =========================================

async function markMessageDelivered(
    messageId
) {

    if (!messageId) {

        return;

    }

    try {

        await fetch(
            API_URL +
            "/message/delivered/" +
            messageId,
            {

                method: "PUT",

                headers: {

                    Authorization:
                        "Bearer " +
                        token

                }

            }
        );

    }

    catch (error) {

        console.log(
            "Delivered Error:",
            error
        );

    }

}
// =========================================
// AUTO MARK SEEN
// =========================================

async function markMessagesSeen(
    messageId
) {

    try {

        await fetch(
            API_URL +
            "/message/seen/" +
            messageId,
            {

                method: "PUT",

                headers: {

                    Authorization:
                        "Bearer " +
                        token

                }

            }
        );

    }

    catch (err) {

        console.log(err);

    }

}

// =========================================
// MESSAGE MENU
// =========================================

let selectedMessageId =
    null;

messages.addEventListener(
    "contextmenu",
    function (e) {

        const bubble =
            e.target.closest(
                ".message.sent"
            );

        if (!bubble) return;

        e.preventDefault();

        selectedMessageId =
            bubble.id.replace(
                "msg-",
                ""
            );

        const menu =
            document.getElementById(
                "messageContextMenu"
            );

        if (!menu) return;

        menu.style.display =
            "block";

        menu.style.left =
            e.pageX + "px";

        menu.style.top =
            e.pageY + "px";

    }
);

// =========================================
// HIDE MENU
// =========================================

document.addEventListener(
    "click",
    () => {

        const menu =
            document.getElementById(
                "messageContextMenu"
            );

        if (menu) {

            menu.style.display =
                "none";

        }

    }
);

// =========================================
// EDIT MESSAGE
// =========================================

const editBtn =
    document.getElementById(
        "editMessageBtn"
    );

if (editBtn) {

    editBtn.addEventListener(
        "click",
        async () => {

            if (
                !selectedMessageId
            )
                return;

            const bubble =
                document.querySelector(
                    "#msg-" +
                    selectedMessageId +
                    " .message-text"
                );

            if (!bubble) return;

            const oldText =
                bubble.innerText;

            const newText =
                prompt(
                    "Edit Message",
                    oldText
                );

            if (!newText) return;

            try {

                const res =
                    await fetch(
                        API_URL +
                        "/message/edit/" +
                        selectedMessageId,
                        {

                            method:
                                "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    "Bearer " +
                                    token

                            },

                            body:
                                JSON.stringify(
                                    {

                                        content:
                                            newText

                                    }
                                )

                        }
                    );

                const data =
                    await res.json();

                if (
                    !data.success
                ) {

                    alert(
                        data.message
                    );

                    return;

                }

            }

            catch (err) {

                console.log(err);

            }

        }
    );

}

// =========================================
// DELETE MESSAGE
// =========================================

const deleteBtn =
    document.getElementById(
        "deleteMessageBtn"
    );

if (deleteBtn) {

    deleteBtn.addEventListener(
        "click",
        async () => {

            if (
                !selectedMessageId
            )
                return;

            if (
                !confirm(
                    "Delete this message?"
                )
            )
                return;

            try {

                const res =
                    await fetch(
                        API_URL +
                        "/message/delete/" +
                        selectedMessageId,
                        {

                            method:
                                "PUT",

                            headers: {

                                Authorization:
                                    "Bearer " +
                                    token

                            }

                        }
                    );

                const data =
                    await res.json();

                if (
                    !data.success
                ) {

                    alert(
                        data.message
                    );

                    return;

                }

            }

            catch (err) {

                console.log(err);

            }

        }
    );

}

// =========================================
// SOCKET MESSAGE EDITED
// =========================================

socket.off(
    "message edited"
);

socket.on(
    "message edited",
    (message) => {

        const div =
            document.getElementById(
                "msg-" +
                message._id
            );

        if (!div) return;

        const messageText =
            div.querySelector(
                ".message-text"
            );

        if (messageText) {

            messageText.innerHTML =
                message.content +
                ' <small style="opacity:.6">(edited)</small>';

        }

    }
);

// =========================================
// SOCKET MESSAGE DELETED
// =========================================

socket.off(
    "message deleted"
);

socket.on(
    "message deleted",
    (message) => {

        const div =
            document.getElementById(
                "msg-" +
                message._id
            );

        if (!div) return;

        const messageText =
            div.querySelector(
                ".message-text"
            );

        if (messageText) {

            messageText.innerHTML =
                "<i>This message was deleted</i>";

        }

    }
);

// =========================================
// ADD CONTACT
// =========================================

if (addContactBtn) {

    addContactBtn.addEventListener(
        "click",
        () => {

            contactModal.classList.add(
                "active"
            );

        }
    );

}

if (closeContactBtn) {

    closeContactBtn.addEventListener(
        "click",
        () => {

            contactModal.classList.remove(
                "active"
            );

        }
    );

}

if (saveContactBtn) {

    saveContactBtn.addEventListener(
        "click",
        async () => {

            const name =
                document
                    .getElementById(
                        "contactName"
                    )
                    .value
                    .trim();

            const phone =
                document
                    .getElementById(
                        "contactPhone"
                    )
                    .value
                    .trim();

            if (
                !name ||
                !phone
            ) {

                alert(
                    "Enter Name & Phone"
                );

                return;

            }

            try {

                const res =
                    await fetch(
                        API_URL +
                        "/users/contact",
                        {

                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    "Bearer " +
                                    token

                            },

                            body:
                                JSON.stringify(
                                    {

                                        name,
                                        phone

                                    }
                                )

                        }
                    );

                const data =
                    await res.json();

                alert(
                    data.message
                );

                if (data.success) {

                    contactModal.classList.remove(
                        "active"
                    );

                    document
                        .getElementById(
                            "contactName"
                        )
                        .value = "";

                    document
                        .getElementById(
                            "contactPhone"
                        )
                        .value = "";

                    loadChats();

                }

            }

            catch (err) {

                console.log(err);

            }

        }
    );

}

// =========================================
// PROFILE MODAL
// =========================================

if (profileBtn) {

    profileBtn.onclick =
        () => {

            profileModal.classList.add(
                "active"
            );

        };

}

if (closeProfileBtn) {

    closeProfileBtn.onclick =
        () => {

            profileModal.classList.remove(
                "active"
            );

        };

}

// =========================================
// PROFILE PICTURE UPDATE
// =========================================

if (changePhotoBtn) {

    changePhotoBtn.onclick =
        () => {

            profilePicInput.click();

        };

}

if (profilePicInput) {

    profilePicInput.onchange =
        async function () {

            const file =
                this.files[0];

            if (!file) return;

            const formData =
                new FormData();

            formData.append(
                "profilePic",
                file
            );

            try {

                const res =
                    await fetch(
                        API_URL +
                        "/users/profile-picture",
                        {

                            method:
                                "PUT",

                            headers: {

                                Authorization:
                                    "Bearer " +
                                    token

                            },

                            body:
                                formData

                        }
                    );

                const data =
                    await res.json();

                if (
                    !data.success
                ) {

                    alert(
                        data.message
                    );

                    return;

                }

                currentUser.profilePic =
                    data.user.profilePic;

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        currentUser
                    )
                );

                loadCurrentUser();

                loadChats();

                alert(
                    "Profile Updated"
                );

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

    logoutBtn.onclick =
        () => {

            if (
                !confirm(
                    "Logout?"
                )
            )
                return;

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "/index.html";

        };

}

// =========================================
// CLOSE MODAL
// =========================================

window.addEventListener(
    "click",
    (e) => {

        if (
            e.target ===
            contactModal
        ) {

            contactModal.classList.remove(
                "active"
            );

        }

        if (
            e.target ===
            profileModal
        ) {

            profileModal.classList.remove(
                "active"
            );

        }

    }
);

// =========================================
// PAGE LOAD
// =========================================

window.addEventListener(
    "load",
    () => {

        loadCurrentUser();

        loadChats();

    }
);

// =========================================
// SOCKET RECONNECT
// =========================================

socket.on(
    "connect",
    () => {

        socket.emit(
            "setup",
            currentUser
        );

    }
);

// =========================================
// EMOJI PICKER
// =========================================

if (
    emojiBtn &&
    emojiContainer &&
    emojiPicker
) {

    emojiBtn.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            emojiContainer.classList.toggle(
                "active"
            );

        }
    );

    emojiPicker.addEventListener(
        "emoji-click",
        (event) => {

            messageInput.value +=
                event.detail.unicode;

            messageInput.focus();

        }
    );

    document.addEventListener(
        "click",
        (e) => {

            if (

                !emojiContainer.contains(
                    e.target
                ) &&

                !emojiBtn.contains(
                    e.target
                )

            ) {

                emojiContainer.classList.remove(
                    "active"
                );

            }

        }
    );

}

// =========================================
// ATTACHMENT
// =========================================

if (
    attachmentBtn &&
    fileInput
) {

    attachmentBtn.addEventListener(
        "click",
        () => {

            fileInput.click();

        }
    );

}
// =========================================
// VOICE CALL - WEBRTC
// =========================================

const voiceCallBtn =
    document.getElementById("voiceCallBtn");

const incomingCallModal =
    document.getElementById("incomingCallModal");

const incomingCallAvatar =
    document.getElementById("incomingCallAvatar");

const incomingCallName =
    document.getElementById("incomingCallName");

const acceptCallBtn =
    document.getElementById("acceptCallBtn");

const rejectCallBtn =
    document.getElementById("rejectCallBtn");

const activeCallModal =
    document.getElementById("activeCallModal");

const activeCallAvatar =
    document.getElementById("activeCallAvatar");

const activeCallName =
    document.getElementById("activeCallName");

const activeCallStatus =
    document.getElementById("activeCallStatus");

const muteCallBtn =
    document.getElementById("muteCallBtn");

const endCallBtn =
    document.getElementById("endCallBtn");

const remoteAudio =
    document.getElementById("remoteAudio");


// =========================================
// CALL VARIABLES
// =========================================

let peerConnection = null;

let localStream = null;

let remoteUserId = null;

let incomingOffer = null;

let isMuted = false;


// =========================================
// WEBRTC CONFIG
// =========================================

const rtcConfiguration = {

    iceServers: [

        {
            urls:
                "stun:stun.l.google.com:19302"
        }

    ]

};


// =========================================
// CREATE PEER CONNECTION
// =========================================

function createPeerConnection() {

    if (peerConnection) {

        peerConnection.close();

    }

    peerConnection =
        new RTCPeerConnection(
            rtcConfiguration
        );


    // =====================================
    // REMOTE AUDIO
    // =====================================

    peerConnection.ontrack =
        (event) => {

            if (
                remoteAudio &&
                event.streams &&
                event.streams[0]
            ) {

                remoteAudio.srcObject =
                    event.streams[0];

                remoteAudio
                    .play()
                    .catch(() => {});

            }

        };


    // =====================================
    // ICE CANDIDATE
    // =====================================

    peerConnection.onicecandidate =
        (event) => {

            if (
                event.candidate &&
                remoteUserId
            ) {

                socket.emit(
                    "call:ice-candidate",
                    {

                        to:
                            remoteUserId,

                        candidate:
                            event.candidate

                    }
                );

            }

        };


    // =====================================
    // CONNECTION STATE
    // =====================================

    peerConnection.onconnectionstatechange =
        () => {

            if (!peerConnection) {
                return;
            }

            const state =
                peerConnection
                    .connectionState;

            console.log(
                "📞 Call connection:",
                state
            );


            if (
                state ===
                "connected"
            ) {

                if (
                    activeCallStatus
                ) {

                    activeCallStatus.innerText =
                        "Connected";

                }

            }


            if (
                state ===
                "disconnected" ||
                state ===
                "failed" ||
                state ===
                "closed"
            ) {

                cleanupCall();

            }

        };


    return peerConnection;

}


// =========================================
// GET MICROPHONE
// =========================================

async function getMicrophone() {

    try {

        localStream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    audio: true,

                    video: false

                });

        return true;

    }

    catch (error) {

        console.error(
            "Microphone Error:",
            error
        );

        alert(
            "Microphone permission is required for voice calls."
        );

        return false;

    }

}


// =========================================
// ADD LOCAL AUDIO TRACK
// =========================================

function addLocalTracks() {

    if (
        !peerConnection ||
        !localStream
    ) {

        return;

    }

    localStream
        .getTracks()
        .forEach(
            track => {

                peerConnection.addTrack(
                    track,
                    localStream
                );

            }
        );

}


// =========================================
// SHOW ACTIVE CALL
// =========================================

function showActiveCall(
    user,
    status = "Calling..."
) {

    if (!activeCallModal) {
        return;
    }

    const name =
        user?.name ||
        "User";

    const image =
        getUserProfileImage(
            user || {
                name: "User"
            }
        );


    activeCallName.innerText =
        name;

    activeCallStatus.innerText =
        status;


    if (image) {

        activeCallAvatar.innerHTML = `

            <img
                src="${image}"
                alt="${name}"
            >

        `;

    }


    activeCallModal.classList.add(
        "active"
    );

}


// =========================================
// HIDE INCOMING CALL
// =========================================

function hideIncomingCall() {

    if (
        incomingCallModal
    ) {

        incomingCallModal.classList.remove(
            "active"
        );

    }

}


// =========================================
// SHOW INCOMING CALL
// =========================================

function showIncomingCall(
    callerName,
    callerId
) {

    // =========================================
    // SET REMOTE USER
    // =========================================

    remoteUserId =
        callerId;


    // =========================================
    // SET CALLER NAME
    // =========================================

    if (incomingCallName) {

        incomingCallName.innerText =
            callerName ||
            "User";

    }


    // =========================================
    // SET CALLER AVATAR
    // =========================================

    if (incomingCallAvatar) {

        const image =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                callerName || "User"
            )}&background=38BDF8&color=ffffff`;


        incomingCallAvatar.innerHTML = `

            <img
                src="${image}"
                alt="${callerName || "User"}"
            >

        `;

    }


    // =========================================
    // SHOW INCOMING CALL MODAL
    // =========================================

    if (incomingCallModal) {

        incomingCallModal.classList.add(
            "active"
        );

        console.log(
            "📞 Incoming Call Modal Shown"
        );

    }

    else {

        console.error(
            "❌ incomingCallModal not found"
        );

    }

}


// =========================================
// START VOICE CALL
// =========================================

async function startVoiceCall() {

    // =========================================
    // CHECK SELECTED CHAT
    // =========================================

    if (!selectedChat) {

        alert(
            "Select a contact first."
        );

        return;

    }


    // =========================================
    // FIND RECEIVER
    // =========================================

    const receiver =
        selectedChat.users.find(
            user =>
                user._id.toString() !==
                currentUser._id.toString()
        );


    if (!receiver) {

        alert(
            "Unable to find contact."
        );

        return;

    }


    // =========================================
    // CHECK ACTIVE CALL
    // =========================================

    if (peerConnection) {

        alert(
            "A call is already active."
        );

        return;

    }


    // =========================================
    // SET REMOTE USER
    // =========================================

    remoteUserId =
        receiver._id;


    // =========================================
    // GET MICROPHONE
    // =========================================

    const microphoneReady =
        await getMicrophone();


    if (!microphoneReady) {

        return;

    }


    // =========================================
    // CREATE PEER CONNECTION
    // =========================================

    createPeerConnection();

    addLocalTracks();


    // =========================================
    // SHOW CALL UI
    // =========================================

    showActiveCall(
        receiver,
        "Calling..."
    );


    // =========================================
    // SOCKET DEBUG
    // =========================================

    console.log(
        "📡 SOCKET STATUS:",
        socket.connected
    );

    console.log(
        "📡 SOCKET ID:",
        socket.id
    );

    console.log(
        "📡 CALL DATA:",
        {
            to:
                receiver._id,

            from:
                currentUser._id,

            callerName:
                currentUser.name
        }
    );


    // =========================================
    // SEND CALL SIGNAL
    // =========================================

    socket.emit(
        "call:user",
        {
            to:
                receiver._id,

            from:
                currentUser._id,

            callerName:
                currentUser.name
        }
    );


    // =========================================
    // LOG
    // =========================================

    console.log(
        "📞 Calling:",
        receiver.name
    );

}


// =========================================
// INCOMING CALL
// =========================================

socket.on(
    "call:incoming",
    async (data) => {

        console.log(
            "📲 call:incoming received:",
            data
        );


        if (!data) {

            console.error(
                "❌ Incoming call data missing"
            );

            return;

        }


        // =========================================
        // SET REMOTE USER
        // =========================================

        remoteUserId =
            data.from;


        // =========================================
        // SHOW INCOMING CALL
        // =========================================

        showIncomingCall(
            data.callerName,
            data.from
        );


        // =========================================
        // LOG
        // =========================================

        console.log(
            "📞 Incoming call from:",
            data.callerName
        );

    }
);


// =========================================
// ACCEPT CALL
// =========================================

if (acceptCallBtn) {

    acceptCallBtn.addEventListener(
        "click",
        async () => {

            if (!remoteUserId) {

                return;

            }


            hideIncomingCall();


            const microphoneReady =
                await getMicrophone();

            if (!microphoneReady) {

                socket.emit(
                    "call:rejected",
                    {

                        to:
                            remoteUserId,

                        from:
                            currentUser._id

                    }
                );

                return;

            }


            createPeerConnection();

            addLocalTracks();


            showActiveCall(
                {
                    name:
                        incomingCallName
                            ?.innerText ||
                        "User"
                },
                "Connecting..."
            );


            socket.emit(
                "call:accepted",
                {

                    to:
                        remoteUserId,

                    from:
                        currentUser._id

                }
            );

        }
    );

}


// =========================================
// REJECT CALL
// =========================================

if (rejectCallBtn) {

    rejectCallBtn.addEventListener(
        "click",
        () => {

            if (remoteUserId) {

                socket.emit(
                    "call:rejected",
                    {

                        to:
                            remoteUserId,

                        from:
                            currentUser._id

                    }
                );

            }


            hideIncomingCall();

            remoteUserId =
                null;

            incomingOffer =
                null;

        }
    );

}


// =========================================
// CALL ACCEPTED BY RECEIVER
// =========================================

socket.on(
    "call:accepted",
    async () => {

        if (
            !peerConnection ||
            !remoteUserId
        ) {

            return;

        }


        try {

            activeCallStatus.innerText =
                "Connecting...";


            const offer =
                await peerConnection
                    .createOffer();


            await peerConnection
                .setLocalDescription(
                    offer
                );


            socket.emit(
                "call:offer",
                {

                    to:
                        remoteUserId,

                    offer:
                        offer

                }
            );

        }

        catch (error) {

            console.error(
                "Call Offer Error:",
                error
            );

            cleanupCall();

        }

    }
);


// =========================================
// RECEIVE OFFER
// =========================================

socket.on(
    "call:offer",
    async (data) => {

        if (!data || !data.offer) {

            return;

        }


        try {

            if (
                !peerConnection
            ) {

                createPeerConnection();

            }


            if (!localStream) {

                const microphoneReady =
                    await getMicrophone();

                if (!microphoneReady) {

                    return;

                }

                addLocalTracks();

            }


            await peerConnection
                .setRemoteDescription(
                    new RTCSessionDescription(
                        data.offer
                    )
                );


            const answer =
                await peerConnection
                    .createAnswer();


            await peerConnection
                .setLocalDescription(
                    answer
                );


            socket.emit(
                "call:answer",
                {

                    to:
                        data.from,

                    answer:
                        answer

                }
            );


            if (
                activeCallStatus
            ) {

                activeCallStatus.innerText =
                    "Connecting...";

            }

        }

        catch (error) {

            console.error(
                "Call Answer Error:",
                error
            );

            cleanupCall();

        }

    }
);


// =========================================
// RECEIVE ANSWER
// =========================================

socket.on(
    "call:answer",
    async (data) => {

        if (
            !peerConnection ||
            !data ||
            !data.answer
        ) {

            return;

        }


        try {

            await peerConnection
                .setRemoteDescription(
                    new RTCSessionDescription(
                        data.answer
                    )
                );

        }

        catch (error) {

            console.error(
                "Remote Answer Error:",
                error
            );

        }

    }
);


// =========================================
// RECEIVE ICE CANDIDATE
// =========================================

socket.on(
    "call:ice-candidate",
    async (data) => {

        if (
            !peerConnection ||
            !data ||
            !data.candidate
        ) {

            return;

        }


        try {

            await peerConnection
                .addIceCandidate(
                    new RTCIceCandidate(
                        data.candidate
                    )
                );

        }

        catch (error) {

            console.error(
                "ICE Candidate Error:",
                error
            );

        }

    }
);


// =========================================
// CALL REJECTED
// =========================================

socket.on(
    "call:rejected",
    () => {

        cleanupCall();

    }
);


// =========================================
// END CALL
// =========================================

if (endCallBtn) {

    endCallBtn.addEventListener(
        "click",
        () => {

            if (remoteUserId) {

                socket.emit(
                    "call:ended",
                    {

                        to:
                            remoteUserId,

                        from:
                            currentUser._id

                    }
                );

            }


            cleanupCall();

        }
    );

}


// =========================================
// CALL ENDED
// =========================================

socket.on(
    "call:ended",
    () => {

        cleanupCall();

    }
);


// =========================================
// MUTE / UNMUTE
// =========================================

if (muteCallBtn) {

    muteCallBtn.addEventListener(
        "click",
        () => {

            if (!localStream) {
                return;
            }


            const audioTracks =
                localStream.getAudioTracks();


            if (
                audioTracks.length === 0
            ) {

                return;

            }


            isMuted =
                !isMuted;


            audioTracks.forEach(
                track => {

                    track.enabled =
                        !isMuted;

                }
            );


            if (isMuted) {

                muteCallBtn.innerHTML =
                    '<i class="fas fa-microphone-slash"></i>';

                muteCallBtn.title =
                    "Unmute";

            }

            else {

                muteCallBtn.innerHTML =
                    '<i class="fas fa-microphone"></i>';

                muteCallBtn.title =
                    "Mute";

            }

        }
    );

}


// =========================================
// CLEANUP CALL
// =========================================

function cleanupCall() {

    // =====================================
    // STOP LOCAL AUDIO
    // =====================================

    if (localStream) {

        localStream
            .getTracks()
            .forEach(
                track => {

                    track.stop();

                }
            );

        localStream =
            null;

    }


    // =====================================
    // CLOSE PEER CONNECTION
    // =====================================

    if (peerConnection) {

        peerConnection.close();

        peerConnection =
            null;

    }


    // =====================================
    // CLEAR REMOTE AUDIO
    // =====================================

    if (remoteAudio) {

        remoteAudio.srcObject =
            null;

    }


    // =====================================
    // HIDE MODALS
    // =====================================

    if (
        incomingCallModal
    ) {

        incomingCallModal.classList.remove(
            "active"
        );

    }


    if (
        activeCallModal
    ) {

        activeCallModal.classList.remove(
            "active"
        );

    }


    // =====================================
    // RESET VARIABLES
    // =====================================

    remoteUserId =
        null;

    incomingOffer =
        null;

    isMuted =
        false;


    if (muteCallBtn) {

        muteCallBtn.innerHTML =
            '<i class="fas fa-microphone"></i>';

        muteCallBtn.title =
            "Mute";

    }

    console.log(
        "📴 Voice call cleaned up"
    );

}


// =========================================
// VOICE CALL BUTTON
// =========================================

if (voiceCallBtn) {

    voiceCallBtn.addEventListener(
        "click",
        startVoiceCall
    );

}