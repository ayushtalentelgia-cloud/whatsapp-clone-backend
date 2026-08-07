// =========================================
// API URL
// =========================================

const API_URL = "https://whatsapp-clone-backend-b5o7.onrender.com/api";

// =========================================
// LOGIN CHECK
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
// GLOBAL VARIABLES
// =========================================

let selectedChat = null;
let selectedUser = null;

let typing = false;
let typingTimeout;

// =========================================
// ELEMENTS
// =========================================

const chatList = document.getElementById("chatList");

const messages = document.getElementById("messages");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const searchUser =
    document.getElementById("searchUser");

const logoutBtn =
    document.getElementById("logoutBtn");

const chatName =
    document.getElementById("chatName");

const onlineStatus =
    document.getElementById("onlineStatus");

const userAvatar =
    document.getElementById("userAvatar");

// =========================================
// PROFILE
// =========================================

const myProfilePic =
    document.getElementById("myProfilePic");

const profilePicInput =
    document.getElementById("profilePicInput");

const profilePreview =
    document.getElementById("profilePreview");

const myName =
    document.getElementById("myName");

// =========================================
// SHOW USER INFO
// =========================================

myName.innerText = currentUser.name;

if (currentUser.profilePic) {

    myProfilePic.src = currentUser.profilePic;

    if (profilePreview) {

        profilePreview.src =
            currentUser.profilePic;

    }

}
else{

    myProfilePic.src =
`https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=38BDF8&color=fff`;

}

// =========================================
// SOCKET CONNECTED
// =========================================

socket.on("connected", () => {

    console.log("Socket Connected");

});

// =========================================
// ONLINE USER
// =========================================

socket.on("user online", (user) => {

    if (
        selectedUser &&
        selectedUser._id === user._id
    ) {

        onlineStatus.innerText = "Online";

        onlineStatus.className = "online";

    }

});

// =========================================
// OFFLINE USER
// =========================================

socket.on("user offline", (user) => {

    if (
        selectedUser &&
        selectedUser._id === user._id
    ) {

        onlineStatus.innerText = "Offline";

        onlineStatus.className = "offline";

    }

});
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

        console.log(err);

    }

}

// =========================================
// RENDER CHATS
// =========================================

function renderChats(chats) {

    chatList.innerHTML = "";

    chats.forEach(chat => {

        const otherUser = chat.users.find(

            u => u._id !== currentUser._id

        );

        if (!otherUser) return;

        const lastMessage =

            chat.latestMessage?.content ||

            "Start Conversation";

        const time =

            chat.updatedAt ?

            new Date(chat.updatedAt)

            .toLocaleTimeString([],{

                hour:"2-digit",

                minute:"2-digit"

            })

            : "";

        const profile = otherUser.profilePic ?

        `<img
            src="${otherUser.profilePic}"
            class="avatar-img"
        >`

        :

        otherUser.name.charAt(0).toUpperCase();

        const div = document.createElement("div");

        div.className = "chat-item";

        div.innerHTML = `

            <div class="chat-avatar">

                ${profile}

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

        div.onclick = () => {

            document
            .querySelectorAll(".chat-item")
            .forEach(c=>c.classList.remove("active"));

            div.classList.add("active");

            openChat(chat);

        };

        chatList.appendChild(div);

    });

}

// =========================================
// SEARCH CONTACT
// =========================================

searchUser.addEventListener("keyup", function(){

    const value = this.value.toLowerCase();

    document

    .querySelectorAll(".chat-item")

    .forEach(chat=>{

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
// MOBILE
// =========================================

function openMobileChat(){

    if(window.innerWidth<=900){

        document

        .querySelector(".sidebar")

        .classList.add("hide");

        document

        .querySelector(".chat-section")

        .classList.add("active");

    }

}

function closeMobileChat(){

    if(window.innerWidth<=900){

        document

        .querySelector(".sidebar")

        .classList.remove("hide");

        document

        .querySelector(".chat-section")

        .classList.remove("active");

    }

}

// =========================================
// START
// =========================================

loadChats();
// =========================================
// OPEN CHAT
// =========================================

async function openChat(chat){

    selectedChat = chat;

    selectedUser = chat.users.find(

        user => user._id !== currentUser._id

    );

    socket.emit("join chat", chat._id);

    chatName.innerText = selectedUser.name;

    if(selectedUser.profilePic){

        userAvatar.innerHTML = `

            <img

                src="${selectedUser.profilePic}"

                class="chat-profile-pic"

            >

        `;

    }

    else{

        userAvatar.innerHTML =

            selectedUser.name.charAt(0).toUpperCase();

    }

    onlineStatus.innerText = "Offline";

    onlineStatus.className = "offline";

    openMobileChat();

    await loadMessages(chat._id);

}

// =========================================
// LOAD MESSAGES
// =========================================

async function loadMessages(chatId){

    try{

        const res = await fetch(

            API_URL + "/message/" + chatId,

            {

                headers:{

                    Authorization:

                    "Bearer " + token

                }

            }

        );

        const data = await res.json();

        if(!data.success){

            console.log(data);

            return;

        }

        messages.innerHTML = "";

        data.messages.forEach(message=>{

            addMessage(message);

        });

        messages.scrollTop =

        messages.scrollHeight;

    }

    catch(err){

        console.log(err);

    }

}

// =========================================
// ADD MESSAGE
// =========================================

function addMessage(message){

    if(

        document.getElementById(

            "msg-"+message._id

        )

    ){

        return;

    }

    const div = document.createElement("div");

    div.id = "msg-"+message._id;

    div.className = "message";

    if(

        message.sender._id===currentUser._id

    ){

        div.classList.add("sent");

    }

    else{

        div.classList.add("received");

    }

    const time = new Date(

        message.createdAt

    ).toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

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

    messages.scrollTop =

    messages.scrollHeight;

}

// =========================================
// SOCKET RECEIVE
// =========================================

socket.off("message received");

socket.on(

    "message received",

    message=>{

        if(

            selectedChat &&

            selectedChat._id===

            message.chat._id

        ){

            addMessage(message);

        }

        loadChats();

    }

);

// =========================================
// SOCKET EDIT
// =========================================

socket.off("message edited");

socket.on(

    "message edited",

    ()=>{

        if(selectedChat){

            loadMessages(

                selectedChat._id

            );

        }

    }

);

// =========================================
// SOCKET DELETE
// =========================================

socket.off("message deleted");

socket.on(

    "message deleted",

    ()=>{

        if(selectedChat){

            loadMessages(

                selectedChat._id

            );

        }

    }

);
// =========================================
// SEND MESSAGE
// =========================================

async function sendMessage(){

    const text = messageInput.value.trim();

    if(!text || !selectedChat) return;

    socket.emit("stop typing", selectedChat._id);

    try{

        const res = await fetch(

            API_URL + "/message",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:"Bearer "+token

                },

                body:JSON.stringify({

                    content:text,

                    chatId:selectedChat._id

                })

            }

        );

        const data = await res.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        messageInput.value="";

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
// ENTER TO SEND
// =========================================

messageInput.addEventListener(

    "keypress",

    function(e){

        if(e.key==="Enter"){

            sendMessage();

        }

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

        onlineStatus.innerHTML=

        "Typing...";

    }

);

// =========================================
// STOP TYPING
// =========================================

socket.on(

    "stop typing",

    ()=>{

        onlineStatus.innerHTML=

        "Online";

    }

);

// =========================================
// MESSAGE DELIVERED
// =========================================

socket.on(

    "message delivered",

    ()=>{

        if(selectedChat){

            loadMessages(selectedChat._id);

        }

    }

);

// =========================================
// MESSAGE SEEN
// =========================================

socket.on(

    "message seen",

    ()=>{

        if(selectedChat){

            loadMessages(selectedChat._id);

        }

    }

);
// =========================================
// MESSAGE MENU
// =========================================

document.addEventListener("click", function(e){

    document.querySelectorAll(".message-menu").forEach(menu=>{

        menu.style.display="none";

    });

});

// =========================================
// TOGGLE MENU
// =========================================

function toggleMessageMenu(id){

    document.querySelectorAll(".message-menu").forEach(menu=>{

        if(menu.id!==`menu-${id}`){

            menu.style.display="none";

        }

    });

    const menu=document.getElementById(`menu-${id}`);

    if(!menu) return;

    menu.style.display=

    menu.style.display==="block"

    ?

    "none"

    :

    "block";

}

// =========================================
// EDIT MESSAGE
// =========================================

async function editMessage(id){

    const old=document

    .querySelector(`#msg-${id} .message-text`)

    .innerText;

    const text=prompt(

        "Edit Message",

        old

    );

    if(!text) return;

    try{

        const res=await fetch(

            API_URL+"/message/edit/"+id,

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:"Bearer "+token

                },

                body:JSON.stringify({

                    content:text

                })

            }

        );

        const data=await res.json();

        alert(data.message);

    }

    catch(err){

        console.log(err);

    }

}

// =========================================
// DELETE MESSAGE
// =========================================

async function deleteMessage(id){

    if(

        !confirm(

            "Delete this message?"

        )

    ) return;

    try{

        const res=await fetch(

            API_URL+"/message/delete/"+id,

            {

                method:"PUT",

                headers:{

                    Authorization:"Bearer "+token

                }

            }

        );

        const data=await res.json();

        alert(data.message);

    }

    catch(err){

        console.log(err);

    }

}

// =========================================
// UPDATE MESSAGE
// =========================================

function updateMessage(message){

    const div=document.getElementById(

        "msg-"+message._id

    );

    if(!div) return;

    const text=

    div.querySelector(".message-text");

    if(text){

        text.innerHTML=

        message.content+

        (

            message.edited

            ?

            ` <span class="edited-label">(edited)</span>`

            :

            ""

        );

    }

}

// =========================================
// UPDATE DELETE
// =========================================

function updateDeletedMessage(message){

    const div=document.getElementById(

        "msg-"+message._id

    );

    if(!div) return;

    div.querySelector(

        ".message-text"

    ).innerHTML=

    "<i>This message was deleted</i>";

    const menu=

    div.querySelector(".message-options");

    if(menu){

        menu.remove();

    }

}

// =========================================
// SOCKET EDIT
// =========================================

socket.off("message edited");

socket.on(

    "message edited",

    message=>{

        updateMessage(message);

    }

);

// =========================================
// SOCKET DELETE
// =========================================

socket.off("message deleted");

socket.on(

    "message deleted",

    message=>{

        updateDeletedMessage(message);

    }

);
// =========================================
// CONTACT MODAL
// =========================================

const addContactBtn = document.getElementById("addContactBtn");
const contactModal = document.getElementById("contactModal");
const closeContactBtn = document.getElementById("closeContactBtn");
const saveContactBtn = document.getElementById("saveContactBtn");

if(addContactBtn){

    addContactBtn.onclick=()=>{

        contactModal.style.display="flex";

    };

}

if(closeContactBtn){

    closeContactBtn.onclick=()=>{

        contactModal.style.display="none";

    };

}

window.onclick=(e)=>{

    if(e.target===contactModal){

        contactModal.style.display="none";

    }

};

// =========================================
// SAVE CONTACT
// =========================================

if(saveContactBtn){

saveContactBtn.onclick=async()=>{

    const name=document

    .getElementById("contactName")

    .value.trim();

    const phone=document

    .getElementById("contactPhone")

    .value.trim();

    if(!name||!phone){

        alert("Enter Name & Phone");

        return;

    }

    try{

        const res=await fetch(

            API_URL+"/users/contact",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:"Bearer "+token

                },

                body:JSON.stringify({

                    name,

                    phone

                })

            }

        );

        const data=await res.json();

        alert(data.message);

        if(data.success){

            contactModal.style.display="none";

            document

            .getElementById("contactName")

            .value="";

            document

            .getElementById("contactPhone")

            .value="";

            loadChats();

        }

    }

    catch(err){

        console.log(err);

    }

};

}

// =========================================
// PROFILE PICTURE
// =========================================

if(profilePicInput){

profilePicInput.onchange=async function(){

    const file=this.files[0];

    if(!file) return;

    const formData=new FormData();

    formData.append(

        "profilePic",

        file

    );

    try{

        const res=await fetch(

            API_URL+"/users/profile-picture",

            {

                method:"PUT",

                headers:{

                    Authorization:"Bearer "+token

                },

                body:formData

            }

        );

        const data=await res.json();

        if(!data.success){

            alert(data.message);

            return;

        }

        currentUser.profilePic=data.user.profilePic;

        localStorage.setItem(

            "user",

            JSON.stringify(currentUser)

        );

        myProfilePic.src=data.user.profilePic;

        if(profilePreview){

            profilePreview.src=data.user.profilePic;

        }

        alert("Profile Updated");

        loadChats();

    }

    catch(err){

        console.log(err);

    }

};

}

// =========================================
// LOGOUT
// =========================================

logoutBtn.onclick=()=>{

    if(confirm("Logout?")){

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        location.href="/index.html";

    }

};

// =========================================
// MOBILE BACK
// =========================================

const backBtn=document.getElementById("backBtn");

if(backBtn){

    backBtn.onclick=closeMobileChat;

}

// =========================================
// INITIAL LOAD
// =========================================

window.onload=()=>{

    loadChats();

};