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

const statusBtn =
    document.getElementById("statusBtn");

const statusSection =
    document.getElementById("statusSection");

// =========================================
// POSTS ELEMENTS
// =========================================

const postsBtn =
    document.getElementById("postsBtn");

const postsSection =
    document.getElementById("postsSection");

const createPostBtn =
    document.getElementById("createPostBtn");

const postFileInput =
    document.getElementById("postFileInput");

const myPostList =
    document.getElementById("myPostList");

const publicPostList =
    document.getElementById("publicPostList");

const addStatusBtn =
    document.getElementById("addStatusBtn");

const statusFileInput =
    document.getElementById("statusFileInput");

const statusList =
    document.getElementById("statusList");

const statusViewer =
    document.getElementById("statusViewer");

const closeStatusViewer =
    document.getElementById("closeStatusViewer");

const statusViewerContent =
    document.getElementById("statusViewerContent");

const statusViewerCaption =
    document.getElementById("statusViewerCaption");

const logoutBtn =
    document.getElementById("logoutBtn");

const menuBtn =
    document.getElementById("menuBtn");

const menuDropdown =
    document.getElementById("menuDropdown");

// =========================================
// FILTER BUTTONS
// =========================================

const allChatsBtn =
    document.getElementById("allChatsBtn");

const unreadBtn =
    document.getElementById("unreadBtn");

const groupBtn =
    document.getElementById("groupBtn");


function showChats() {

    if (chatList) {
        chatList.style.display = "block";
    }

    if (statusSection) {
        statusSection.style.display = "none";
    }

    if (postsSection) {
    postsSection.style.display = "none";
}

}


// =========================================
// SHOW STATUS
// =========================================

function showStatus() {

    // Hide chat list
    if (chatList) {

        chatList.style.display =
            "none";

    }


    // Show status section
    if (statusSection) {

        statusSection.style.display =
            "block";

    }


    // Hide posts section
    if (postsSection) {

        postsSection.style.display =
            "none";

    }


    // Load latest statuses
    loadStatuses();

}

// =========================================
// SHOW POSTS
// =========================================

function showPosts() {

    // Hide chat list
    if (chatList) {

        chatList.style.display =
            "none";

    }


    // Hide status section
    if (statusSection) {

        statusSection.style.display =
            "none";

    }


    // Show posts section
    if (postsSection) {

        postsSection.style.display =
            "block";

    }


    // Load posts
    loadPosts();

}

// =========================================
// LOAD POSTS
// =========================================

async function loadPosts() {

    if (
        !myPostList ||
        !publicPostList
    ) {
        return;
    }


    try {

        // =====================================
        // LOADING STATE
        // =====================================

        myPostList.innerHTML = `
            <div class="post-loading">
                Loading posts...
            </div>
        `;

        publicPostList.innerHTML = `
            <div class="post-loading">
                Loading posts...
            </div>
        `;


        // =====================================
        // GET POSTS
        // =====================================

        const response =
            await fetch(
                API_URL + "/posts",
                {

                    headers: {

                        Authorization:
                            "Bearer " + token

                    }

                }
            );


        const data =
            await response.json();


        // =====================================
        // API ERROR
        // =====================================

        if (
            !response.ok ||
            !data.success
        ) {

            myPostList.innerHTML = `
                <div class="post-empty">
                    Unable to load posts
                </div>
            `;

            publicPostList.innerHTML = `
                <div class="post-empty">
                    Unable to load posts
                </div>
            `;

            console.log(
                "Load Posts Error:",
                data.message
            );

            return;

        }


        // =====================================
        // RENDER POSTS
        // =====================================

        renderPosts(
            data.posts || []
        );

    }
    catch (error) {

        console.log(
            "Load Posts Error:",
            error
        );


        myPostList.innerHTML = `
            <div class="post-empty">
                Unable to load posts
            </div>
        `;

        publicPostList.innerHTML = `
            <div class="post-empty">
                Unable to load posts
            </div>
        `;

    }

}

// =========================================
// RENDER POSTS
// =========================================

function renderPosts(posts) {

    if (
        !myPostList ||
        !publicPostList
    ) {
        return;
    }


    myPostList.innerHTML = "";

    publicPostList.innerHTML = "";


    if (
    !posts ||
    posts.length === 0
) {

    myPostList.innerHTML = `
        <div class="post-empty">
            No posts yet
        </div>
    `;

    publicPostList.innerHTML = `
        <div class="post-empty">
            No public posts available
        </div>
    `;

    return;

}


    posts.forEach(
        post => {

            const isMine =
                post.user?._id ===
                currentUser._id;


            const name =
                post.user?.name ||
                "Unknown User";


            const time =
                new Date(
                    post.createdAt
                ).toLocaleString(
                    [],
                    {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );


            // =====================================
            // MEDIA
            // =====================================

            let mediaHTML = "";


            if (
                post.mediaType ===
                "video"
            ) {

                mediaHTML = `
                    <video
                        src="${post.mediaUrl}"
                        class="post-media"
                        controls
                        playsinline
                    ></video>
                `;

            }
            else {

                mediaHTML = `
                    <img
                        src="${post.mediaUrl}"
                        class="post-media"
                        alt="Post"
                    >
                `;

            }


            // =====================================
            // LIKE STATE
            // =====================================

            const liked =
                Array.isArray(post.likes) &&
                post.likes.some(
                    user =>
                        user?._id ===
                        currentUser._id
                );


            const likeCount =
                Array.isArray(post.likes)
                    ? post.likes.length
                    : 0;


            const commentCount =
                Array.isArray(post.comments)
                    ? post.comments.length
                    : 0;


            // =====================================
            // POST ITEM
            // =====================================

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "post-item";


            item.dataset.postId =
                post._id;


            item.innerHTML = `

                <div class="post-header">

                    <div class="post-user">

                        ${
                            post.user?.profilePic
                                ? `
                                    <img
                                        src="${post.user.profilePic}"
                                        class="post-profile-pic"
                                        alt="${name}"
                                    >
                                  `
                                : `
                                    <div class="post-profile-placeholder">
                                        ${name.charAt(0).toUpperCase()}
                                    </div>
                                  `
                        }

                        <div>

                            <div class="post-user-name">
                                ${name}
                            </div>

                            <div class="post-time">
                                ${time}
                            </div>

                        </div>

                    </div>


                    ${
                        isMine
                            ? `
                                <button
                                    class="post-delete-btn"
                                    type="button"
                                    title="Delete post"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                              `
                            : ""
                    }

                </div>


                ${
                    post.caption
                        ? `
                            <div class="post-caption">
                                ${post.caption}
                            </div>
                          `
                        : ""
                }


       <div
    class="post-media-wrapper"
    data-post-id="${post._id}"
>

    ${mediaHTML}

</div>


<!-- =========================================
     COMMENTS
========================================= -->

<div class="post-comments">

    ${
        Array.isArray(post.comments) &&
        post.comments.length > 0

            ? post.comments.map(
                comment => {

                    const commentTime =
                        comment.createdAt
                            ? new Date(
                                comment.createdAt
                            ).toLocaleTimeString(
                                [],
                                {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                }
                            )
                            : "";

                    return `

                        <div class="post-comment">

                            <div class="comment-avatar">

                                ${
                                    comment.user?.profilePic

                                        ? `
                                            <img
                                                src="${comment.user.profilePic}"
                                                alt="Profile"
                                            >
                                          `

                                        : `
                                            <div class="comment-avatar-placeholder">
                                                <i class="fas fa-user"></i>
                                            </div>
                                          `
                                }

                            </div>


                            <div class="comment-content">

                                <div class="comment-line">

                                    <strong class="comment-user">
                                        ${
                                            comment.user?.name ||
                                            "Unknown User"
                                        }
                                    </strong>

                                    <span class="comment-text">
                                        ${
                                            comment.text ||
                                            ""
                                        }
                                    </span>

                                </div>


                                <div class="comment-time">
                                    ${commentTime}
                                </div>

                            </div>

                        </div>

                    `;

                }
            ).join("")

            : ""
    }

</div>


<div class="post-actions">

                    <button
                        class="post-like-btn ${
                            liked
                                ? "liked"
                                : ""
                        }"
                        type="button"
                    >

                        <i class="fas fa-heart"></i>

                        <span>
                            ${likeCount}
                        </span>

                    </button>


                    <button
                        class="post-comment-btn"
                        type="button"
                    >

                        <i class="fas fa-comment"></i>

                        <span>
                            ${commentCount}
                        </span>

                    </button>


                    <button
                        class="post-share-btn"
                        type="button"
                    >

                        <i class="fas fa-share"></i>

                        <span>
                            Share
                        </span>

                    </button>

                </div>

            `;

// =========================================
// OPEN POST MEDIA
// =========================================

const postMedia =
    item.querySelector(
        ".post-media-wrapper"
    );


if (postMedia) {

    postMedia.addEventListener(
        "click",
        (event) => {

            // Button/action par click hone par
            // media viewer open na kare
            if (
                event.target.closest(
                    ".post-actions"
                )
            ) {
                return;
            }


            const media =
                postMedia.querySelector(
                    "img, video"
                );


            if (!media) {
                return;
            }


            // =====================================
            // CREATE MEDIA VIEWER
            // =====================================

            const viewer =
                document.createElement(
                    "div"
                );


            viewer.className =
                "post-media-viewer";


            viewer.innerHTML = `

                <button
                    type="button"
                    class="post-media-close"
                    aria-label="Close"
                >
                    <i class="fas fa-xmark"></i>
                </button>


                <div
                    class="post-media-viewer-content"
                >

                    ${
                        media.tagName.toLowerCase() ===
                        "video"

                            ? `
                                <video
                                    src="${media.src}"
                                    controls
                                    autoplay
                                ></video>
                              `

                            : `
                                <img
                                    src="${media.src}"
                                    alt="Post"
                                >
                              `
                    }

                </div>

            `;


            document.body.appendChild(
                viewer
            );


            // =====================================
            // CLOSE BUTTON
            // =====================================

            const closeBtn =
                viewer.querySelector(
                    ".post-media-close"
                );


            closeBtn.addEventListener(
                "click",
                () => {

                    viewer.remove();

                }
            );


            // =====================================
            // BACKGROUND CLICK
            // =====================================

            viewer.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target ===
                        viewer
                    ) {

                        viewer.remove();

                    }

                }
            );


            // =====================================
            // ESC KEY
            // =====================================

            const escapeHandler =
                (event) => {

                    if (
                        event.key ===
                        "Escape"
                    ) {

                        viewer.remove();

                        document.removeEventListener(
                            "keydown",
                            escapeHandler
                        );

                    }

                };


            document.addEventListener(
                "keydown",
                escapeHandler
            );

        }
    );

}
// =========================================
// SHARE POST
// =========================================

const shareBtn =
    item.querySelector(
        ".post-share-btn"
    );


if (shareBtn) {

    shareBtn.addEventListener(
        "click",
        async () => {

            // =====================================
            // CREATE SHARE MENU
            // =====================================

            const existingMenu =
                document.querySelector(
                    ".post-share-menu"
                );


            if (existingMenu) {

                existingMenu.remove();

                return;

            }


            const shareMenu =
                document.createElement(
                    "div"
                );


            shareMenu.className =
                "post-share-menu";


            shareMenu.innerHTML = `

                <button
                    type="button"
                    class="share-status-option"
                >

                    <i class="fas fa-circle-notch"></i>

                    <span>
                        Share to Status
                    </span>

                </button>


                <button
                    type="button"
                    class="share-chat-option"
                >

                    <i class="fas fa-comment"></i>

                    <span>
                        Share to Chat
                    </span>

                </button>


                <button
                    type="button"
                    class="share-copy-option"
                >

                    <i class="fas fa-link"></i>

                    <span>
                        Copy Link
                    </span>

                </button>


                <button
                    type="button"
                    class="share-system-option"
                >

                    <i class="fas fa-share-nodes"></i>

                    <span>
                        More
                    </span>

                </button>

            `;


            const postActions =
    item.querySelector(
        ".post-actions"
    );


if (postActions) {

    postActions.appendChild(
        shareMenu
    );

}


            // =====================================
            // SHARE TO STATUS
            // =====================================

            const statusOption =
                shareMenu.querySelector(
                    ".share-status-option"
                );


            statusOption.addEventListener(
                "click",
                () => {

                    shareMenu.remove();

                    alert(
                        "Share to Status will be added next."
                    );

                }
            );


            // =====================================
            // SHARE TO CHAT
            // =====================================

            const chatOption =
                shareMenu.querySelector(
                    ".share-chat-option"
                );


            chatOption.addEventListener(
                "click",
                () => {

                    shareMenu.remove();

                    alert(
                        "Share to Chat will be added next."
                    );

                }
            );


            // =====================================
            // COPY LINK
            // =====================================

            const copyOption =
                shareMenu.querySelector(
                    ".share-copy-option"
                );


            copyOption.addEventListener(
                "click",
                async () => {

                    try {

                        await navigator.clipboard.writeText(
                            post.mediaUrl
                        );


                        shareMenu.remove();


                        alert(
                            "Post link copied."
                        );

                    }
                    catch (error) {

                        console.log(
                            "Copy Link Error:",
                            error
                        );

                    }

                }
            );


            // =====================================
            // SYSTEM SHARE
            // =====================================

            const systemOption =
                shareMenu.querySelector(
                    ".share-system-option"
                );


            systemOption.addEventListener(
                "click",
                async () => {

                    try {

                        if (
                            navigator.share
                        ) {

                            await navigator.share({

                                title:
                                    "VibeChat Post",

                                text:
                                    post.caption ||
                                    "Check out this post",

                                url:
                                    post.mediaUrl

                            });

                        }
                        else {

                            alert(
                                "System sharing is not supported on this device."
                            );

                        }

                    }
                    catch (error) {

                        console.log(
                            "Share Error:",
                            error
                        );

                    }


                    shareMenu.remove();

                }
            );

        }
    );

}
// =========================================
// LIKE / UNLIKE POST
// =========================================

const likeBtn =
    item.querySelector(
        ".post-like-btn"
    );


if (likeBtn) {

    likeBtn.addEventListener(
        "click",
        async () => {

            try {

                likeBtn.disabled =
                    true;


                const response =
                    await fetch(
                        API_URL +
                        "/posts/like/" +
                        post._id,
                        {

                            method: "PUT",

                            headers: {

                                Authorization:
                                    "Bearer " +
                                    token

                            }

                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    console.log(
                        "Like Error:",
                        data.message
                    );

                    return;

                }


                // =================================
                // UPDATE LIKE COUNT
                // =================================

                const count =
                    likeBtn.querySelector(
                        "span"
                    );


                if (count) {

                    count.innerText =
                        data.likeCount;

                }


                // =================================
                // UPDATE LIKE STATE
                // =================================

                if (data.liked) {

                    likeBtn.classList.add(
                        "liked"
                    );

                }
                else {

                    likeBtn.classList.remove(
                        "liked"
                    );

                }

            }
            catch (error) {

                console.log(
                    "Like Error:",
                    error
                );

            }
            finally {

                likeBtn.disabled =
                    false;

            }

        }
    );

}
// =========================================
// ADD COMMENT
// =========================================

const commentBtn =
    item.querySelector(
        ".post-comment-btn"
    );


if (commentBtn) {

    commentBtn.addEventListener(
        "click",
        () => {

            // =====================================
            // CHECK IF COMMENT BOX ALREADY EXISTS
            // =====================================

            const existingBox =
                item.querySelector(
                    ".post-comment-box"
                );


            if (existingBox) {

                const existingInput =
                    existingBox.querySelector(
                        ".post-comment-input"
                    );


                if (existingInput) {

                    existingInput.focus();

                }

                return;

            }


            // =====================================
            // CREATE COMMENT BOX
            // =====================================

            const commentBox =
                document.createElement(
                    "div"
                );


            commentBox.className =
                "post-comment-box";


            commentBox.innerHTML = `

                <input
                    type="text"
                    class="post-comment-input"
                    placeholder="Write a comment..."
                    autocomplete="off"
                >

                <button
                    type="button"
                    class="post-comment-send"
                >

                    <i
                        class="fas fa-paper-plane"
                    ></i>

                </button>

            `;


            // =====================================
            // ADD COMMENT BOX TO POST
            // =====================================

            item.appendChild(
                commentBox
            );


            const input =
                commentBox.querySelector(
                    ".post-comment-input"
                );


            const sendBtn =
                commentBox.querySelector(
                    ".post-comment-send"
                );


            // =====================================
            // AUTO FOCUS
            // =====================================

            setTimeout(
                () => {

                    if (input) {

                        input.focus();

                    }

                },
                100
            );


            // =====================================
            // SEND COMMENT FUNCTION
            // =====================================

            const sendComment =
                async () => {

                    const text =
                        input.value.trim();


                    if (!text) {

                        input.focus();

                        return;

                    }


                    try {

                        sendBtn.disabled =
                            true;


                        const response =
                            await fetch(
                                API_URL +
                                "/posts/comment/" +
                                post._id,
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
                                        JSON.stringify({
                                            text:
                                                text
                                        })

                                }
                            );


                        const data =
                            await response.json();


                        if (
                            !response.ok ||
                            !data.success
                        ) {

                            alert(
                                data.message ||
                                "Unable to add comment."
                            );

                            return;

                        }


                        // =================================
                        // UPDATE COMMENT COUNT
                        // =================================

                        const count =
                            commentBtn.querySelector(
                                "span"
                            );


                        if (count) {

                            count.innerText =
                                Number(
                                    count.innerText ||
                                    0
                                ) + 1;

                        }


                        // =================================
                        // REMOVE COMMENT BOX
                        // =================================

                        commentBox.remove();

                    }
                    catch (error) {

                        console.log(
                            "Comment Error:",
                            error
                        );


                        alert(
                            "Unable to add comment."
                        );

                    }
                    finally {

                        sendBtn.disabled =
                            false;

                    }

                };


            // =====================================
            // SEND BUTTON CLICK
            // =====================================

            sendBtn.addEventListener(
                "click",
                sendComment
            );


            // =====================================
            // ENTER KEY
            // =====================================

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        sendComment();

                    }

                }
            );

        }
    );

}

// =========================================
// DELETE POST
// =========================================

const postDeleteBtn =
    item.querySelector(
        ".post-delete-btn"
    );


if (postDeleteBtn) {

    postDeleteBtn.addEventListener(
        "click",
        async (event) => {

            // Prevent post click
            event.stopPropagation();


            // =====================================
            // VIBECHAT CONFIRM MODAL
            // =====================================

            const confirmDelete =
                await showConfirmModal(
                    "Delete Post",
                    "Are you sure you want to delete this post?"
                );


            if (!confirmDelete) {

                return;

            }


            try {

                postDeleteBtn.disabled =
                    true;


                postDeleteBtn.innerHTML =
                    `<i class="fas fa-spinner fa-spin"></i>`;


                // =====================================
                // DELETE POST API
                // =====================================

                const response =
                    await fetch(
                        API_URL +
                        "/posts/" +
                        post._id,
                        {

                            method:
                                "DELETE",

                            headers: {

                                Authorization:
                                    "Bearer " +
                                    token

                            }

                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    alert(
                        data.message ||
                        "Failed to delete post."
                    );

                    return;

                }


                // =====================================
                // REMOVE POST FROM UI
                // =====================================

                item.remove();

            }
            catch (error) {

                console.log(
                    "Delete Post Error:",
                    error
                );


                alert(
                    "Unable to delete post."
                );

            }
            finally {

                postDeleteBtn.disabled =
                    false;

            }

        }
    );

}

// =========================================
// APPEND POST
// =========================================

if (isMine) {

    myPostList.appendChild(
        item
    );

}
else {

    publicPostList.appendChild(
        item
     );

        }

    }
);

}
// =========================================
// VIBECHAT CONFIRM MODAL
// =========================================

function showConfirmModal(
    title,
    message
) {

    return new Promise(
        (resolve) => {

            const modal =
                document.getElementById(
                    "confirmModal"
                );

            const titleElement =
                document.getElementById(
                    "confirmModalTitle"
                );

            const messageElement =
                document.getElementById(
                    "confirmModalMessage"
                );

            const cancelBtn =
                document.getElementById(
                    "confirmModalCancel"
                );

            const confirmBtn =
                document.getElementById(
                    "confirmModalConfirm"
                );


            // =====================================
            // MODAL NOT FOUND
            // =====================================

            if (
                !modal ||
                !titleElement ||
                !messageElement ||
                !cancelBtn ||
                !confirmBtn
            ) {

                console.error(
                    "VibeChat confirm modal not found."
                );

                resolve(false);

                return;

            }


            // =====================================
            // SET TEXT
            // =====================================

            titleElement.innerText =
                title;

            messageElement.innerText =
                message;


            // =====================================
            // SHOW MODAL
            // =====================================

            modal.style.display =
                "flex";


            // =====================================
            // CLOSE FUNCTION
            // =====================================

            const closeModal =
                (result) => {

                    modal.style.display =
                        "none";

                    cancelBtn.onclick =
                        null;

                    confirmBtn.onclick =
                        null;

                    modal.onclick =
                        null;

                    resolve(result);

                };


            // =====================================
            // CANCEL
            // =====================================

            cancelBtn.onclick =
                () => {

                    closeModal(false);

                };


            // =====================================
            // CONFIRM
            // =====================================

            confirmBtn.onclick =
                () => {

                    closeModal(true);

                };


            // =====================================
            // CLICK OUTSIDE
            // =====================================

            modal.onclick =
                (event) => {

                    if (
                        event.target ===
                        modal
                    ) {

                        closeModal(false);

                    }

                };

        }
    );

}


// =========================================
// LOAD STATUSES
// =========================================

async function loadStatuses() {

    if (!statusList) {
        return;
    }

    try {

        const response =
            await fetch(
    API_URL + "/status",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            console.log(
                "Load Status Error:",
                data
            );

            return;
        }
console.log(
    "STATUS DATA:",
    data.statuses
);
        renderStatuses(
            data.statuses || []
        );

    }
    catch (error) {

        console.log(
            "Load Status Error:",
            error
        );

    }

}
// =========================================
// RENDER STATUSES
// =========================================

function renderStatuses(statuses) {

    if (!statusList) {
        return;
    }

    statusList.innerHTML = "";

    if (!statuses || statuses.length === 0) {

        statusList.innerHTML = `
            <div class="status-empty">
                No statuses available
            </div>
        `;

        return;
    }


    // =========================================
    // MY STATUS FIRST
    // =========================================

    const sortedStatuses = [...statuses].sort(
        (a, b) => {

            const aMine =
                a.user?._id === currentUser._id;

            const bMine =
                b.user?._id === currentUser._id;

            if (aMine && !bMine) {
                return -1;
            }

            if (!aMine && bMine) {
                return 1;
            }

            return (
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );

        }
    );


   // =========================================
// RENDER STATUS ITEMS
// =========================================

sortedStatuses.forEach(
    status => {

        const isMine =
            status.user?._id ===
            currentUser._id;


        const name =
            isMine
                ? "My status"
                : (
                    status.user?.name ||
                    "Unknown User"
                );


        // =========================================
        // VIEWER COUNT
        // =========================================

        const viewerCount =
            Array.isArray(status.viewers)
                ? status.viewers.length
                : 0;


        const about =
            isMine
                ? `${viewerCount} view${viewerCount !== 1 ? "s" : ""}`
                : "Tap to view status";


        const time =
            new Date(
                status.createdAt
            ).toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


        const item =
            document.createElement("div");

        item.className =
            "status-item";


        // =========================================
        // STATUS ID
        // =========================================

        item.dataset.statusId =
            status._id;


            // =====================================
            // THUMBNAIL
            // =====================================

            let mediaHTML = "";


            if (
                status.mediaType === "video"
            ) {

                mediaHTML = `
                    <video
                        src="${status.mediaUrl}"
                        class="status-thumbnail"
                        muted
                        playsinline
                        preload="metadata"
                    ></video>

                    <span class="status-video-icon">
                        ▶
                    </span>
                `;

            } else {

                mediaHTML = `
                    <img
                        src="${status.mediaUrl}"
                        class="status-thumbnail"
                        alt="Status"
                    >
                `;

            }


            // =========================================
// STATUS HTML
// =========================================

item.innerHTML = `

    <div class="status-avatar-wrapper">

        ${mediaHTML}

    </div>


    <div class="status-info">

        <div class="status-name">
            ${name}
        </div>

        <div class="status-time">
            ${about}
        </div>

    </div>


    <div class="status-created">
        ${time}
    </div>


    ${
        isMine
            ? `
                <button
                    type="button"
                    class="status-delete-btn"
                    title="Delete status"
                >
                    <i class="fas fa-trash"></i>
                </button>
              `
            : ""
    }

`;
// // =========================================
// // VIBECHAT CONFIRM MODAL
// // =========================================

// function showConfirmModal(
//     title,
//     message
// ) {

//     return new Promise(
//         (resolve) => {

//             const modal =
//                 document.getElementById(
//                     "confirmModal"
//                 );

//             const titleElement =
//                 document.getElementById(
//                     "confirmModalTitle"
//                 );

//             const messageElement =
//                 document.getElementById(
//                     "confirmModalMessage"
//                 );

//             const cancelBtn =
//                 document.getElementById(
//                     "confirmModalCancel"
//                 );

//             const confirmBtn =
//                 document.getElementById(
//                     "confirmModalConfirm"
//                 );


//             // =====================================
//             // MODAL NOT FOUND
//             // =====================================

//             if (
//                 !modal ||
//                 !titleElement ||
//                 !messageElement ||
//                 !cancelBtn ||
//                 !confirmBtn
//             ) {

//                 console.error(
//                     "VibeChat confirm modal not found."
//                 );

//                 resolve(false);

//                 return;

//             }


//             // =====================================
//             // SET TEXT
//             // =====================================

//             titleElement.innerText =
//                 title;

//             messageElement.innerText =
//                 message;


//             // =====================================
//             // SHOW MODAL
//             // =====================================

//             modal.style.display =
//                 "flex";


//             // =====================================
//             // CLOSE FUNCTION
//             // =====================================

//             const closeModal =
//                 (result) => {

//                     modal.style.display =
//                         "none";

//                     cancelBtn.onclick =
//                         null;

//                     confirmBtn.onclick =
//                         null;

//                     modal.onclick =
//                         null;

//                     resolve(result);

//                 };


//             // =====================================
//             // CANCEL
//             // =====================================

//             cancelBtn.onclick =
//                 () => {

//                     closeModal(false);

//                 };


//             // =====================================
//             // DELETE / CONFIRM
//             // =====================================

//             confirmBtn.onclick =
//                 () => {

//                     closeModal(true);

//                 };


//             // =====================================
//             // CLICK OUTSIDE
//             // =====================================

//             modal.onclick =
//                 (event) => {

//                     if (
//                         event.target ===
//                         modal
//                     ) {

//                         closeModal(false);

//                     }

//                 };

//         }
//     );

// }
// =========================================
// DELETE STATUS
// =========================================

if (isMine) {

    const deleteBtn =
        item.querySelector(
            ".status-delete-btn"
        );


    if (deleteBtn) {

        deleteBtn.addEventListener(
            "click",
            async (event) => {

                // Prevent opening status viewer
                event.stopPropagation();


                const confirmDelete =
    await showConfirmModal(
        "Delete Status",
        "Are you sure you want to delete this status?"
    );


                if (!confirmDelete) {
                    return;
                }


                try {

                    deleteBtn.disabled =
                        true;


                    deleteBtn.innerHTML =
                        `<i class="fas fa-spinner fa-spin"></i>`;


                    const response =
                        await fetch(
                            API_URL +
                            "/status/" +
                            status._id,
                            {

                                method:
                                    "DELETE",

                                headers: {

                                    Authorization:
                                        "Bearer " +
                                        token

                                }

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Failed to delete status."
                        );

                        deleteBtn.disabled =
                            false;

                        deleteBtn.innerHTML =
                            `<i class="fas fa-trash"></i>`;

                        return;

                    }


                    // =================================
                    // REMOVE FROM UI
                    // =================================

                    item.remove();


                    // =================================
                    // RELOAD STATUS LIST
                    // =================================

                    loadStatuses();

                }
                catch (error) {

                    console.log(
                        "Delete Status Error:",
                        error
                    );


                    alert(
                        "Unable to delete status."
                    );


                    deleteBtn.disabled =
                        false;

                    deleteBtn.innerHTML =
                        `<i class="fas fa-trash"></i>`;

                }

            }
        );

    }

}

            // =====================================
            // OPEN STATUS VIEWER
            // =====================================

            item.addEventListener(
                "click",
               async () => {

                    if (
                        !statusViewer ||
                        !statusViewerContent
                    ) {
                        return;
                    }

                // =========================================
// MARK STATUS AS VIEWED
// =========================================

if (!isMine) {

    try {

        const token =
            localStorage.getItem("token");

        await fetch(
            API_URL +
            "/status/view/" +
            status._id,
            {

                method: "PUT",

                headers: {

                    Authorization:
                        "Bearer " + token

                }

            }
        );

    }
    catch (error) {

        console.log(
            "Mark Status Viewed Error:",
            error
        );

    }

}    


                    statusViewerContent.innerHTML =
                        "";


                    // =================================
                    // VIDEO
                    // =================================

                    if (
    status.mediaType === "video"
) {

    const video =
        document.createElement("video");

    video.src =
        status.mediaUrl;

    video.controls = true;

    video.playsInline = true;

    video.preload = "auto";

    video.style.width = "100%";
    video.style.maxHeight = "85vh";

    statusViewerContent.appendChild(
        video
    );


    video.addEventListener(
        "loadedmetadata",
        () => {

            console.log(
                "Video metadata loaded:",
                video.duration
            );

        }
    );


    video.addEventListener(
        "error",
        () => {

            console.log(
                "VIDEO ERROR:",
                video.error
            );

            console.log(
                "VIDEO URL:",
                video.src
            );

        }
    );


    // Try normal playback after viewer opens
    setTimeout(
        () => {

            video.play()
                .then(
                    () => {

                        console.log(
                            "Video playing successfully"
                        );

                    }
                )
                .catch(
                    error => {

                        console.log(
                            "Video play failed:",
                            error
                        );

                    }
                );

        },
        300
    );

}


                    // =================================
                    // IMAGE
                    // =================================

                    else {

                        const image =
                            document.createElement(
                                "img"
                            );

                        image.src =
                            status.mediaUrl;

                        image.alt =
                            "Status";

                        statusViewerContent.appendChild(
                            image
                        );

                    }


                    // =================================
                    // CAPTION
                    // =================================

                    if (
                        statusViewerCaption
                    ) {

                        statusViewerCaption.innerText =
                            status.caption || "";

                    }


                    // =================================
                    // SHOW VIEWER
                    // =================================

                    statusViewer.style.display =
                        "flex";

                }
            );


            statusList.appendChild(
                item
            );

        }
    );

}

// =========================================
// CLOSE STATUS VIEWER
// =========================================

if (closeStatusViewer) {

    closeStatusViewer.addEventListener(
        "click",
        () => {

            if (statusViewer) {

                statusViewer.style.display =
                    "none";

            }


            if (statusViewerContent) {

                statusViewerContent.innerHTML =
                    "";

            }


            if (statusViewerCaption) {

                statusViewerCaption.innerText =
                    "";

            }

        }
    );

}
// =========================================
// ALL BUTTON
// =========================================

if (allChatsBtn) {

    allChatsBtn.addEventListener(
        "click",
        () => {

            showChats();

            document
                .querySelectorAll(".filters button")
                .forEach(
                    button =>
                        button.classList.remove(
                            "active"
                        )
                );

            allChatsBtn.classList.add(
                "active"
            );

        }
    );

}


// =========================================
// STATUS BUTTON
// =========================================

if (statusBtn) {

    statusBtn.addEventListener(
        "click",
        () => {

            showStatus();

            document
                .querySelectorAll(".filters button")
                .forEach(
                    button =>
                        button.classList.remove(
                            "active"
                        )
                );

            statusBtn.classList.add(
                "active"
            );

        }
    );

}

// =========================================
// POSTS BUTTON
// =========================================

if (postsBtn) {

    postsBtn.addEventListener(
        "click",
        () => {

            showPosts();


            document
                .querySelectorAll(
                    ".filters button"
                )
                .forEach(
                    button => {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


            postsBtn.classList.add(
                "active"
            );

        }
    );

}


// =========================================
// ADD STATUS
// =========================================

if (
    addStatusBtn &&
    statusFileInput
) {

    addStatusBtn.addEventListener(
        "click",
        () => {

            statusFileInput.click();

        }
    );


    statusFileInput.addEventListener(
        "change",
        async () => {

            const file =
                statusFileInput.files[0];

            if (!file) {
                return;
            }


            // ===============================
            // CHECK FILE TYPE
            // ===============================

            if (
                !file.type.startsWith("image/") &&
                !file.type.startsWith("video/")
            ) {

                alert(
                    "Please select an image or video."
                );

                statusFileInput.value = "";

                return;

            }


            // ===============================
            // CREATE FORM DATA
            // ===============================

            const formData =
                new FormData();

            formData.append(
                "status",
                file
            );


            // ===============================
            // UPLOAD STATUS
            // ===============================

            try {

                addStatusBtn.innerText =
                    "Uploading...";

                addStatusBtn.disabled =
                    true;


                const response =
                    await fetch(
    API_URL + "/status",
                        {

                            method: "POST",

                            headers: {

                                Authorization:
                                    "Bearer " + token

                            },

                            body: formData

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    console.log(
                        "Status Upload Error:",
                        data
                    );

                    alert(
                        data.message ||
                        "Status upload failed."
                    );

                    return;

                }


                console.log(
                    "Status uploaded:",
                    data
                );


                alert(
                    "Status uploaded successfully!"
                );


                // Clear selected file
                statusFileInput.value = "";


            }
            catch (error) {

                console.log(
                    "Status Upload Error:",
                    error
                );

                alert(
                    "Unable to upload status."
                );

            }
            finally {

                addStatusBtn.innerText =
                    "+ Add Status";

                addStatusBtn.disabled =
                    false;

            }

        }
    );

}

// =========================================
// CREATE POST
// =========================================

if (
    createPostBtn &&
    postFileInput
) {

    createPostBtn.addEventListener(
        "click",
        () => {

            postFileInput.click();

        }
    );


    postFileInput.addEventListener(
        "change",
        async () => {

            const file =
                postFileInput.files[0];


            if (!file) {
                return;
            }


            // =====================================
            // CHECK FILE TYPE
            // =====================================

            if (
                !file.type.startsWith("image/") &&
                !file.type.startsWith("video/")
            ) {

                alert(
                    "Please select an image or video."
                );

                postFileInput.value = "";

                return;

            }


            // =====================================
            // CREATE FORM DATA
            // =====================================

            const formData =
                new FormData();

            formData.append(
                "post",
                file
            );


            // =====================================
// OPTIONAL CAPTION
// =====================================

const caption =
    await openCaptionModal();


// =====================================
// ADD CAPTION
// =====================================

if (caption !== null) {

    formData.append(
        "caption",
        caption.trim()
    );

}


            try {

                createPostBtn.disabled =
                    true;

                createPostBtn.innerText =
                    "Uploading...";


                const response =
                    await fetch(
                        API_URL + "/posts",
                        {

                            method: "POST",

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
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    alert(
                        data.message ||
                        "Unable to create post."
                    );

                    return;

                }


                // =====================================
                // SHOW POSTS SECTION
                // =====================================

                showPosts();


                // =====================================
                // RELOAD POSTS
                // =====================================

                loadPosts();


            }
            catch (error) {

                console.log(
                    "Create Post Error:",
                    error
                );


                alert(
                    "Unable to upload post."
                );

            }
            finally {

                createPostBtn.disabled =
                    false;

                createPostBtn.innerText =
                    "+ Create Post";

                postFileInput.value =
                    "";

            }

        }
    );

}
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


                ${unreadCount > 0
                    ?
                    `
                        <div
                            class="unread-indicator"
                            title="${unreadCount} unread message${unreadCount > 1 ? "s" : ""}"
                        >

                            ${unreadCount > 99
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
                    .catch(() => { });

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
// =========================================
// CAPTION MODAL
// =========================================

function openCaptionModal() {

    return new Promise(
        resolve => {

            // =====================================
            // OVERLAY
            // =====================================

            const overlay =
                document.createElement(
                    "div"
                );

            overlay.className =
                "caption-modal-overlay";


            // =====================================
            // MODAL
            // =====================================

            overlay.innerHTML = `

                <div
                    class="caption-modal"
                    role="dialog"
                    aria-modal="true"
                >

                    <div class="caption-modal-header">

                        <div>

                            <h3>
                                Add Caption
                            </h3>

                            <p>
                                Add something about your post
                            </p>

                        </div>


                        <button
                            type="button"
                            class="caption-close-btn"
                            aria-label="Close"
                        >

                            <i class="fas fa-xmark"></i>

                        </button>

                    </div>


                    <div class="caption-modal-body">

                        <textarea
                            class="caption-input"
                            placeholder="Write a caption..."
                            maxlength="2000"
                            autofocus
                        ></textarea>


                        <div class="caption-counter">

                            <span>
                                Optional
                            </span>

                            <span class="caption-count">
                                0 / 2000
                            </span>

                        </div>

                    </div>


                    <div class="caption-modal-footer">

                        <button
                            type="button"
                            class="caption-cancel-btn"
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            class="caption-post-btn"
                        >

                            <i class="fas fa-paper-plane"></i>

                            Post

                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(
                overlay
            );


            // =====================================
            // ELEMENTS
            // =====================================

            const textarea =
                overlay.querySelector(
                    ".caption-input"
                );


            const closeBtn =
                overlay.querySelector(
                    ".caption-close-btn"
                );


            const cancelBtn =
                overlay.querySelector(
                    ".caption-cancel-btn"
                );


            const postBtn =
                overlay.querySelector(
                    ".caption-post-btn"
                );


            const counter =
                overlay.querySelector(
                    ".caption-count"
                );


            // =====================================
            // FOCUS
            // =====================================

            setTimeout(
                () => {

                    textarea.focus();

                },
                50
            );


            // =====================================
            // CHARACTER COUNT
            // =====================================

            textarea.addEventListener(
                "input",
                () => {

                    counter.innerText =
                        `${textarea.value.length} / 2000`;

                }
            );


            // =====================================
            // CLOSE MODAL
            // =====================================

            const closeModal =
                value => {

                    overlay.remove();

                    resolve(
                        value
                    );

                };


            // =====================================
            // CANCEL
            // =====================================

            closeBtn.addEventListener(
                "click",
                () => {

                    closeModal(
                        null
                    );

                }
            );


            cancelBtn.addEventListener(
                "click",
                () => {

                    closeModal(
                        null
                    );

                }
            );


            // =====================================
            // POST
            // =====================================

            postBtn.addEventListener(
                "click",
                () => {

                    closeModal(
                        textarea.value
                    );

                }
            );


            // =====================================
            // BACKGROUND CLICK
            // =====================================

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        overlay
                    ) {

                        closeModal(
                            null
                        );

                    }

                }
            );


            // =====================================
            // ESC
            // =====================================

            const escapeHandler =
                event => {

                    if (
                        event.key ===
                        "Escape"
                    ) {

                        document.removeEventListener(
                            "keydown",
                            escapeHandler
                        );

                        closeModal(
                            null
                        );

                    }

                };


            document.addEventListener(
                "keydown",
                escapeHandler
            );

        }
    );

}       
