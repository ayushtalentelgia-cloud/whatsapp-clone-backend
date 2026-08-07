// =========================================
// API
// =========================================

const API_URL = "https://whatsapp-clone-backend-b5o7.onrender.com/api";

// =========================================
// AUTH
// =========================================

const token = localStorage.getItem("token");

const currentUser = JSON.parse(
    localStorage.getItem("user")
);

if (!token || !currentUser) {

    window.location.href = "/index.html";

}

// =========================================
// SOCKET
// =========================================

const socket = io(
    "https://whatsapp-clone-backend-b5o7.onrender.com"
);

socket.emit("setup", currentUser);

// =========================================
// VARIABLES
// =========================================

let selectedChat = null;

let selectedUser = null;

let typing = false;

let typingTimeout;

// =========================================
// DOM ELEMENTS
// =========================================

// Sidebar

const myProfilePic = document.getElementById("myProfilePic");

const myName = document.getElementById("myName");

const chatList = document.getElementById("chatList");

const searchUser = document.getElementById("searchUser");

// Chat Header

const userAvatar = document.getElementById("userAvatar");

const chatName = document.getElementById("chatName");

const onlineStatus = document.getElementById("onlineStatus");

// Messages

const messages = document.getElementById("messages");

const typingIndicator =
    document.getElementById("typingIndicator");

// Input

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

// Buttons

const profileBtn =
    document.getElementById("profileBtn");

const addContactBtn =
    document.getElementById("addContactBtn");

const menuBtn =
    document.getElementById("menuBtn");

const backBtn =
    document.getElementById("backBtn");

// Contact Modal

const contactModal =
    document.getElementById("contactModal");

const contactName =
    document.getElementById("contactName");

const contactPhone =
    document.getElementById("contactPhone");

const saveContactBtn =
    document.getElementById("saveContactBtn");

const closeContactBtn =
    document.getElementById("closeContactBtn");

// Profile Modal

const profileModal =
    document.getElementById("profileModal");

const profilePreview =
    document.getElementById("profilePreview");

const profilePicInput =
    document.getElementById("profilePicInput");

const changePhotoBtn =
    document.getElementById("changePhotoBtn");

const profileName =
    document.getElementById("profileName");

const profilePhone =
    document.getElementById("profilePhone");

const profileEmail =
    document.getElementById("profileEmail");

const closeProfileBtn =
    document.getElementById("closeProfileBtn");

// Menu

const menuDropdown =
    document.getElementById("menuDropdown");

const logoutBtn =
    document.getElementById("logoutBtn");

// Message Menu

const messageContextMenu =
    document.getElementById("messageContextMenu");

const editMessageBtn =
    document.getElementById("editMessageBtn");

const deleteMessageBtn =
    document.getElementById("deleteMessageBtn");

// =========================================
// LOAD USER
// =========================================

function loadCurrentUser() {

    myName.innerText = currentUser.name;

    profileName.innerText = currentUser.name;

    profilePhone.innerText = currentUser.phone;

    profileEmail.innerText = currentUser.email;

    if (currentUser.profilePic) {

        myProfilePic.src = currentUser.profilePic;

        profilePreview.src = currentUser.profilePic;

    }

}

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

        chatList.innerHTML = "";

        data.chats.forEach(chat => {

            const otherUser = chat.users.find(

                user => user._id !== currentUser._id

            );

            if (!otherUser) return;

            const div = document.createElement("div");

            div.className = "chat-item";

            div.innerHTML = `

                <div class="chat-avatar">

                    ${otherUser.profilePic

                        ? `<img src="${otherUser.profilePic}">`

                        : otherUser.name.charAt(0).toUpperCase()
                    }

                </div>

                <div class="chat-details">

                    <div class="chat-details-top">

                        <h4>${otherUser.name}</h4>

                        <span>

                            ${chat.updatedAt
                                ? new Date(chat.updatedAt).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit"
                                  })
                                : ""
                            }

                        </span>

                    </div>

                    <div class="chat-message">

                        ${chat.latestMessage

                            ? chat.latestMessage.content

                            : "Start Conversation"

                        }

                    </div>

                </div>

            `;

            div.onclick = () => {

                document
                    .querySelectorAll(".chat-item")
                    .forEach(item => item.classList.remove("active"));

                div.classList.add("active");

                openChat(chat);

            };

            chatList.appendChild(div);

        });

    }

    catch (err) {

        console.log(err);

    }

}

// =========================================
// SEARCH
// =========================================

searchUser.addEventListener("input", function () {

    const value = this.value.trim().toLowerCase();

    document.querySelectorAll(".chat-item").forEach(chat => {

        const name = chat.querySelector("h4")
            .innerText
            .toLowerCase();

        chat.style.display =

            name.includes(value)

            ? "flex"

            : "none";

    });

});

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

    if (selectedUser.profilePic) {

        userAvatar.innerHTML =

            `<img src="${selectedUser.profilePic}">`;

    }

    else {

        userAvatar.innerHTML =

            selectedUser.name.charAt(0).toUpperCase();

    }

    onlineStatus.innerText = "Offline";

    onlineStatus.className = "offline";

    if (window.innerWidth < 900) {

        document
            .querySelector(".sidebar")
            .classList.add("hide");

        document
            .querySelector(".chat-section")
            .classList.add("active");

    }

    await loadMessages(chat._id);

}

// =========================================
// MOBILE BACK
// =========================================

backBtn.onclick = () => {

    document
        .querySelector(".sidebar")
        .classList.remove("hide");

    document
        .querySelector(".chat-section")
        .classList.remove("active");

};

// =========================================
// SOCKET ONLINE
// =========================================

socket.on("user online", user => {

    if (

        selectedUser &&

        selectedUser._id === user._id

    ) {

        onlineStatus.innerText = "Online";

        onlineStatus.className = "online";

    }

});

// =========================================
// SOCKET OFFLINE
// =========================================

socket.on("user offline", user => {

    if (

        selectedUser &&

        selectedUser._id === user._id

    ) {

        onlineStatus.innerText = "Offline";

        onlineStatus.className = "offline";

    }

});
// =========================================
// LOAD MESSAGES
// =========================================

async function loadMessages(chatId){

    try{

        const res = await fetch(

            API_URL + "/message/" + chatId,

            {

                headers:{

                    Authorization:"Bearer " + token

                }

            }

        );

        const data = await res.json();

        if(!data.success){

            console.log(data.message);

            return;

        }

        messages.innerHTML = "";

        if(data.messages.length===0){

            messages.innerHTML=`

            <div class="empty-chat">

                <i class="fas fa-comments"></i>

                <h2>No Messages Yet</h2>

                <p>Start your conversation.</p>

            </div>

            `;

            return;

        }

        data.messages.forEach(message=>{

            addMessage(message);

        });

        messages.scrollTop=messages.scrollHeight;

    }

    catch(err){

        console.log(err);

    }

}

// =========================================
// ADD MESSAGE
// =========================================

function addMessage(message){

    const already=document.getElementById(

        "msg-"+message._id

    );

    if(already) return;

    const div=document.createElement("div");

    div.id="msg-"+message._id;

    div.className=

        "message "+

        (

            message.sender._id===currentUser._id

            ?

            "sent"

            :

            "received"

        );

    const time=new Date(

        message.createdAt

    ).toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });

    div.innerHTML=`

        <div class="message-text">

            ${message.content}

        </div>

        <span class="message-time">

            ${time}

        </span>

    `;

    messages.appendChild(div);

    messages.scrollTop=messages.scrollHeight;

}

// =========================================
// SEND MESSAGE
// =========================================

async function sendMessage(){

    const content=messageInput.value.trim();

    if(!content || !selectedChat) return;

    try{

        const res=await fetch(

            API_URL+"/message",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:"Bearer "+token

                },

                body:JSON.stringify({

                    content,

                    chatId:selectedChat._id

                })

            }

        );

        const data=await res.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        messageInput.value="";

        socket.emit(

            "stop typing",

            selectedChat._id

        );

        addMessage(data.message);

        loadChats();

    }

    catch(err){

        console.log(err);

    }

}

// =========================================
// SEND BUTTON
// =========================================

sendBtn.onclick=sendMessage;

// =========================================
// ENTER KEY
// =========================================

messageInput.addEventListener(

    "keypress",

    e=>{

        if(e.key==="Enter"){

            sendMessage();

        }

    }

);

// =========================================
// SOCKET RECEIVE
// =========================================

socket.off("message received");

socket.on(

    "message received",

    message=>{

        if(

            selectedChat &&

            selectedChat._id===message.chat._id

        ){

            addMessage(message);

        }

        loadChats();

    }

);

// =========================================
// TYPING
// =========================================

messageInput.addEventListener(

    "input",

    ()=>{

        if(!selectedChat) return;

        if(!typing){

            typing=true;

            socket.emit(

                "typing",

                selectedChat._id

            );

        }

        clearTimeout(typingTimeout);

        typingTimeout=setTimeout(()=>{

            socket.emit(

                "stop typing",

                selectedChat._id

            );

            typing=false;

        },1500);

    }

);

// =========================================
// SHOW TYPING
// =========================================

socket.on(

    "typing",

    ()=>{

        typingIndicator.style.display="block";

    }

);

socket.on(

    "stop typing",

    ()=>{

        typingIndicator.style.display="none";

    }

);
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