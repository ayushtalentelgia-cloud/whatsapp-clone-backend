// =========================================
// API CONFIG
// =========================================

// const API_URL =
//     "https://vibechat-backend-i6xa.onrender.com/api";

// const SOCKET_URL =
//     "https://vibechat-backend-i6xa.onrender.com";

// =========================================
// API CONFIG
// =========================================

const API_URL =
    "http://localhost:5000/api";

const SOCKET_URL =
    "http://localhost:5000";

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
// TIC TAC TOE - GLOBAL GAME STATE
// =========================================

let ticGameId = null;

let ticPlayerSymbol = null;

let ticCurrentTurn = null;

let ticGameActive = false;

let ticCountdownActive = false;

let ticGameState = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

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

const gamesBtn =
    document.getElementById("gamesBtn");

const gamesSection =
    document.getElementById("gamesSection");

const postsSection =
    document.getElementById("postsSection");

const postsTypeBtn =
    document.getElementById("postsTypeBtn");

const postsTypeLabel =
    document.getElementById("postsTypeLabel");

const postsTypeDropdown =
    document.getElementById("postsTypeDropdown");

const postsTitleWrapper =
    document.querySelector(".posts-title-wrapper");

const postsTypeOptions =
    document.querySelectorAll(".posts-type-option");

const createPostBtn =
    document.getElementById("createPostBtn");

const postFileInput =
    document.getElementById("postFileInput");

const myPostList =
    document.getElementById("myPostList");

const publicPostList =
    document.getElementById("publicPostList");

// =========================================
// POSTS TYPE DROPDOWN
// =========================================

if (
    postsTypeBtn &&
    postsTitleWrapper
) {

    postsTypeBtn.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            postsTitleWrapper.classList.toggle(
                "open"
            );

        }
    );


    postsTypeOptions.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    const type =
                        option.dataset.postType;

                        localStorage.setItem(
    "vibechatPostType",
    type
);


                    // =====================================
                    // UPDATE LABEL
                    // =====================================

                    if (type === "my") {

                        postsTypeLabel.innerText =
                            "My Posts";

                    }
                    else {

                        postsTypeLabel.innerText =
                            "Public Posts";

                    }


                    // =====================================
                    // ACTIVE OPTION
                    // =====================================

                    postsTypeOptions.forEach(
                        item => {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    option.classList.add(
                        "active"
                    );


                    // =====================================
                    // SHOW / HIDE POSTS
                    // =====================================

                   const myPostsGroup =
    myPostList.closest(".posts-group");

const publicPostsGroup =
    publicPostList.closest(".posts-group");


if (type === "my") {

    myPostsGroup.style.display =
        "block";

    publicPostsGroup.style.display =
        "none";

}
else {

    myPostsGroup.style.display =
        "none";

    publicPostsGroup.style.display =
        "block";

}


                    // =====================================
                    // CLOSE DROPDOWN
                    // =====================================

                    postsTitleWrapper.classList.remove(
                        "open"
                    );

                }
            );

        }
    );


    // =========================================
    // CLICK OUTSIDE
    // =========================================

    document.addEventListener(
        "click",
        () => {

            postsTitleWrapper.classList.remove(
                "open"
            );

        }
    );

}
if (
    myPostList &&
    publicPostList
) {

    myPostList.closest(".posts-group").style.display =
        "block";

    publicPostList.closest(".posts-group").style.display =
        "none";

}

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
    localStorage.setItem(
    "vibechatActiveSection",
    "chats"
);

    if (chatList) {
        chatList.style.display = "block";
    }

    if (statusSection) {
        statusSection.style.display = "none";
    }

    if (postsSection) {
    postsSection.style.display = "none";
}
if (gamesSection) {
    gamesSection.style.display = "none";
}
}


// =========================================
// SHOW STATUS
// =========================================

function showStatus() {
    localStorage.setItem(
    "vibechatActiveSection",
    "status"
);

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

if (gamesSection) {

    gamesSection.style.display =
        "none";

}
    // Load latest statuses
    loadStatuses();

}

// =========================================
// SHOW POSTS
// =========================================

function showPosts() {
    localStorage.setItem(
    "vibechatActiveSection",
    "posts"
);

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
if (gamesSection) {

    gamesSection.style.display =
        "none";

}

    // Load posts
    loadPosts();

}
// =========================================
// SHOW GAMES
// =========================================

function showGames() {

    localStorage.setItem(
        "vibechatActiveSection",
        "games"
    );

    if (chatList) {
        chatList.style.display = "none";
    }

    if (statusSection) {
        statusSection.style.display = "none";
    }

    if (postsSection) {
        postsSection.style.display = "none";
    }

    if (gamesSection) {

        gamesSection.style.display = "block";

        gamesSection.innerHTML = `
            <div class="games-header">

                <div class="games-title">
                    <i class="fas fa-gamepad"></i>

                    <div>
                        <h2>Games</h2>
                        <p>Play and have fun with your friends</p>
                    </div>
                </div>

            </div>

            <div class="games-list">

                <div class="game-card" data-game="tic-tac-toe">

                    <div class="game-card-icon">
                        <i class="fas fa-hashtag"></i>
                    </div>

                    <div class="game-card-info">
                        <h3>Tic Tac Toe</h3>
                        <p>Play Tic Tac Toe with a friend</p>
                    </div>

                    <button
                        type="button"
                        class="game-play-btn"
                        data-game="tic-tac-toe"
                    >
                        Play
                    </button>

                </div>

                <div class="game-card" data-game="ludo">

                    <div class="game-card-icon">
                        <i class="fas fa-dice"></i>
                    </div>

                    <div class="game-card-info">
                        <h3>Ludo</h3>
                        <p>Play Ludo with your friends</p>
                    </div>

                    <button
                        type="button"
                        class="game-play-btn"
                        data-game="ludo"
                    >
                        Play
                    </button>

                </div>

                <div class="game-card coming-soon">

                    <div class="game-card-icon">
                        <i class="fas fa-puzzle-piece"></i>
                    </div>

                    <div class="game-card-info">
                        <h3>More Games</h3>
                        <p>More games are coming soon</p>
                    </div>

                    <span class="game-coming-label">
                        Soon
                    </span>

                </div>

            </div>
        `;

        bindGamePlayButtons();
    }
}

function restoreActiveSection() {

    const section =
        localStorage.getItem(
            "vibechatActiveSection"
        );


    // =====================================
    // RESTORE GAMES
    // =====================================

    if (section === "games") {

        showGames();

        if (gamesBtn) {

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

            gamesBtn.classList.add(
                "active"
            );

        }

        return;

    }


    // =====================================
    // RESTORE POSTS
    // =====================================

    if (section === "posts") {

        showPosts();

        if (postsBtn) {

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

        return;

    }
    // =====================================
    // RESTORE POSTS
    // =====================================

    if (section === "posts") {

        showPosts();

        if (postsBtn) {

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

        return;

    }


    // =====================================
    // RESTORE STATUS
    // =====================================

    if (section === "status") {

        showStatus();

        if (statusBtn) {

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

            statusBtn.classList.add(
                "active"
            );

        }

        return;

    }


    // =====================================
    // DEFAULT → CHATS
    // =====================================

    showChats();

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
// =========================================
// CLOSE SHARE MENU WHEN CLICKING OUTSIDE
// =========================================

const closeShareMenu =
    (event) => {

        if (
            !shareMenu.contains(
                event.target
            ) &&
            !shareBtn.contains(
                event.target
            )
        ) {

            shareMenu.remove();

            document.removeEventListener(
                "click",
                closeShareMenu
            );

        }

    };


setTimeout(() => {

    document.addEventListener(
        "click",
        closeShareMenu
    );

}, 0);
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

    <button
        type="button"
        class="post-comment-emoji"
        title="Add emoji"
    >
        😊
    </button>

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

    <div
        class="post-comment-emoji-picker"
    >
        <emoji-picker></emoji-picker>
    </div>

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
// COMMENT EMOJI PICKER
// =====================================

const commentEmojiBtn =
    commentBox.querySelector(
        ".post-comment-emoji"
    );

const commentEmojiPicker =
    commentBox.querySelector(
        ".post-comment-emoji-picker"
    );


if (
    commentEmojiBtn &&
    commentEmojiPicker
) {

    commentEmojiBtn.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            commentEmojiPicker.classList.toggle(
                "show"
            );

        }
    );


    const picker =
        commentEmojiPicker.querySelector(
            "emoji-picker"
        );


    if (picker) {

        picker.addEventListener(
            "emoji-click",
            (event) => {

                const emoji =
                    event.detail.unicode;

                const start =
                    input.selectionStart ??
                    input.value.length;

                const end =
                    input.selectionEnd ??
                    input.value.length;


                input.value =
                    input.value.slice(
                        0,
                        start
                    ) +
                    emoji +
                    input.value.slice(
                        end
                    );


                input.focus();


                input.selectionStart =
                    start + emoji.length;

                input.selectionEnd =
                    start + emoji.length;

            }
        );

    }

}


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
// GAMES BUTTON
// =========================================

if (gamesBtn) {

    gamesBtn.addEventListener(
        "click",
        () => {

            showGames();

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

            gamesBtn.classList.add(
                "active"
            );

        }
    );

}
// =========================================
// TIC TAC TOE
// =========================================

const gamePlayButtons =
    document.querySelectorAll(
        ".game-play-btn[data-game]"
    );


gamePlayButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const game =
                    button.dataset.game;


                if (
                    game ===
                    "tic-tac-toe"
                ) {

                    openTicTacToe();

                }

            }
        );

    }
);


// =========================================
// GAME PLAY BUTTONS
// =========================================

function bindGamePlayButtons() {

    const gamePlayButtons =
        document.querySelectorAll(
            ".game-play-btn[data-game]"
        );


    gamePlayButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const game =
                        button.dataset.game;


                    // =====================================
                    // TIC TAC TOE
                    // =====================================

                    if (
                        game ===
                        "tic-tac-toe"
                    ) {

                        openTicTacToe();

                        return;

                    }


                    // =====================================
                    // LUDO
                    // =====================================

                    if (
                        game ===
                        "ludo"
                    ) {

                        openLudo();

                        return;

                    }

                }
            );

        }
    );

}


// =========================================
// BIND GAME BUTTONS
// =========================================

bindGamePlayButtons();


// =========================================
// OPEN TIC TAC TOE
// =========================================

function openTicTacToe() {

    const gamesSection =
        document.getElementById(
            "gamesSection"
        );

    if (!gamesSection) {
        return;
    }


    gamesSection.innerHTML = `

        <div class="tic-tac-toe">

            <div class="tic-header">

                <button
                    type="button"
                    class="tic-back-btn"
                    id="ticBackBtn"
                >
                    <i class="fas fa-arrow-left"></i>
                    Games
                </button>

                <h2>
                    Tic Tac Toe
                </h2>

                <p id="ticStatus">
                    Your turn — X
                </p>

            </div>


            <div
                class="tic-board"
                id="ticBoard"
            >

                <button data-cell="0"></button>
                <button data-cell="1"></button>
                <button data-cell="2"></button>

                <button data-cell="3"></button>
                <button data-cell="4"></button>
                <button data-cell="5"></button>

                <button data-cell="6"></button>
                <button data-cell="7"></button>
                <button data-cell="8"></button>

            </div>


            <button
                type="button"
                id="ticResetBtn"
                class="tic-reset-btn"
            >
                New Game
            </button>

            <button
    type="button"
    id="ticInviteBtn"
    class="tic-invite-btn"
>
    <i class="fas fa-user-plus"></i>
    Invite Friend
</button>

        </div>

    `;


    startTicTacToe();

}
// =========================================
// LOAD GAME CONTACTS
// =========================================

async function loadGameContacts() {

    const list =
        document.getElementById(
            "gameContactsList"
        );


    if (!list) {

        return;

    }


    try {

        // =====================================
        // LOAD SAVED CONTACTS
        // =====================================

        const contactResponse =
            await fetch(
                API_URL +
                "/users/contacts",
                {

                    headers: {

                        Authorization:
                            "Bearer " +
                            token

                    }

                }
            );


        const contactData =
            await contactResponse.json();


        // =====================================
        // LOAD EXISTING CHATS
        // =====================================

        const chatResponse =
            await fetch(
                API_URL +
                "/chat",
                {

                    headers: {

                        Authorization:
                            "Bearer " +
                            token

                    }

                }
            );


        const chatData =
            await chatResponse.json();


        // =====================================
        // COMBINE USERS WITHOUT DUPLICATES
        // =====================================

        const usersMap =
            new Map();


        // =====================================
        // ADD SAVED CONTACTS
        // =====================================

        if (
            contactData.success &&
            Array.isArray(
                contactData.contacts
            )
        ) {

            contactData.contacts.forEach(
                contact => {

                    const user =
                        contact.user;


                    if (!user) {

                        return;

                    }


                    const userId =
                        user._id?.toString();


                    if (!userId) {

                        return;

                    }


                    // Don't show current user
                    if (
                        currentUser &&
                        userId ===
                        currentUser._id.toString()
                    ) {

                        return;

                    }


                    usersMap.set(
                        userId,
                        {

                            user:
                                user,

                            name:
                                contact.name ||
                                user.name ||
                                "Unknown User",

                            phone:
                                contact.phone ||
                                user.phone ||
                                ""

                        }
                    );

                }
            );

        }


        // =====================================
        // ADD USERS FROM EXISTING CHATS
        // =====================================

        if (
            chatData.success &&
            Array.isArray(
                chatData.chats
            )
        ) {

            chatData.chats.forEach(
                chat => {

                    if (
                        !Array.isArray(
                            chat.users
                        )
                    ) {

                        return;

                    }


                    const otherUser =
                        chat.users.find(
                            user => {

                                if (!user) {

                                    return false;

                                }


                                return (
                                    user._id?.toString() !==
                                    currentUser._id.toString()
                                );

                            }
                        );


                    if (!otherUser) {

                        return;

                    }


                    const userId =
                        otherUser._id?.toString();


                    if (!userId) {

                        return;

                    }


                    if (
                        userId ===
                        currentUser._id.toString()
                    ) {

                        return;

                    }


                    // Don't duplicate saved contact
                    if (
                        usersMap.has(
                            userId
                        )
                    ) {

                        return;

                    }


                    usersMap.set(
                        userId,
                        {

                            user:
                                otherUser,

                            name:
                                otherUser.name ||
                                "Unknown User",

                            phone:
                                otherUser.phone ||
                                ""

                        }
                    );

                }
            );

        }


        // =====================================
        // FINAL USERS
        // =====================================

        const users =
            Array.from(
                usersMap.values()
            );


        // =====================================
        // NO USERS
        // =====================================

        if (
            users.length === 0
        ) {

            list.innerHTML = `

                <div class="game-no-contacts">

                    No contacts found.

                </div>

            `;

            return;

        }


        // =====================================
        // CLEAR LIST
        // =====================================

        list.innerHTML = "";


        // =====================================
        // RENDER ALL USERS
        // =====================================

        users.forEach(
            contact => {

                const user =
                    contact.user;


                const name =
                    contact.name ||
                    user.name ||
                    "Unknown User";


                const avatar =
                    user.profilePic ||
                    user.profileImage ||
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "game-contact-item";


                item.innerHTML = `

                    <div class="game-contact-user">

                        <img
                            src="${avatar}"
                            alt="${name}"
                        >

                        <div>

                            <strong>
                                ${name}
                            </strong>

                            <span>
                                ${contact.phone || ""}
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="game-invite-contact-btn"
                    >

                        Invite

                    </button>

                `;


                // =====================================
                // INVITE BUTTON
                // =====================================

                const inviteButton =
                    item.querySelector(
                        ".game-invite-contact-btn"
                    );


                if (inviteButton) {

                    inviteButton.addEventListener(
                        "click",
                        () => {

                            sendGameInvite(
                                user._id,
                                name
                            );

                        }
                    );

                }


                list.appendChild(
                    item
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Load game contacts error:",
            error
        );


        list.innerHTML = `

            <div class="game-no-contacts">

                Unable to load contacts.

            </div>

        `;

    }

}
// =========================================
// TIC TAC TOE - MULTIPLAYER GAME LOGIC
// =========================================

function startTicTacToe() {

    const board =
        document.getElementById(
            "ticBoard"
        );

    const status =
        document.getElementById(
            "ticStatus"
        );

    const resetBtn =
        document.getElementById(
            "ticResetBtn"
        );

    const backBtn =
        document.getElementById(
            "ticBackBtn"
        );

    const inviteBtn =
        document.getElementById(
            "ticInviteBtn"
        );


    if (
        !board ||
        !status ||
        !resetBtn ||
        !backBtn ||
        !inviteBtn
    ) {

        return;

    }


    const cells =
        board.querySelectorAll(
            "[data-cell]"
        );


    // =====================================
    // GAME VARIABLES
    // =====================================

// =====================================
// USE GLOBAL TIC TAC TOE STATE
// =====================================

let gameId = ticGameId;

let playerSymbol = ticPlayerSymbol;

let currentTurn = ticCurrentTurn;

let gameActive = ticGameActive;

let countdownActive = ticCountdownActive;

let gameState = ticGameState;


    // =====================================
    // UPDATE BOARD
    // =====================================

    function renderBoard() {

        cells.forEach(
            (cell, index) => {

                const value =
                    gameState[index] ||
                    "";

                cell.innerText =
                    value;


                cell.classList.remove(
                    "x",
                    "o"
                );


                if (value) {

                    cell.classList.add(
                        value.toLowerCase()
                    );

                }

            }
        );

    }


    // =====================================
    // UPDATE STATUS
    // =====================================

    function updateTurnStatus() {

        if (
            !gameActive
        ) {

            return;

        }


        if (
            currentTurn ===
            playerSymbol
        ) {

            status.innerText =
                `Your turn — ${playerSymbol}`;

        }
        else {

            status.innerText =
                `Opponent's turn — ${currentTurn}`;

        }

    }


    // =====================================
// COUNTDOWN
// =====================================

function startCountdown(
    seconds
) {

    countdownActive =
        true;

    gameActive =
        false;


    let count =
        Number(seconds) || 3;


    // =====================================
    // REMOVE OLD COUNTDOWN
    // =====================================

    const oldOverlay =
        document.getElementById(
            "ticCountdownOverlay"
        );

    if (oldOverlay) {

        oldOverlay.remove();

    }


    // =====================================
    // CREATE FULL SCREEN COUNTDOWN
    // =====================================

    const overlay =
        document.createElement(
            "div"
        );

    overlay.id =
        "ticCountdownOverlay";

    overlay.className =
        "tic-countdown-overlay";


    overlay.innerHTML = `

        <div class="tic-countdown-box">

            <div class="tic-countdown-label">
                GET READY
            </div>

            <div
                id="ticCountdownNumber"
                class="tic-countdown-number"
            >
                ${count}
            </div>

            <div class="tic-countdown-game">
                TIC TAC TOE
            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const number =
        document.getElementById(
            "ticCountdownNumber"
        );


    // =====================================
    // NUMBER ANIMATION
    // =====================================

    function animateNumber() {

        if (!number) {

            return;

        }


        number.classList.remove(
            "tic-countdown-pop"
        );


        void number.offsetWidth;


        number.classList.add(
            "tic-countdown-pop"
        );

    }


    animateNumber();


    // =====================================
    // COUNTDOWN TIMER
    // =====================================

    const timer =
        setInterval(
            () => {

                count--;


                if (
                    count > 0
                ) {

                    if (number) {

                        number.innerText =
                            count;

                        animateNumber();

                    }

                    return;

                }


                clearInterval(
                    timer
                );


                // =================================
                // GO
                // =================================

                if (number) {

                    number.innerText =
                        "GO!";

                    number.classList.add(
                        "tic-countdown-go"
                    );

                }


                setTimeout(
                    () => {

                        if (overlay) {

                            overlay.remove();

                        }


                        countdownActive =
                            false;

                        gameActive =
                            true;


                        updateTurnStatus();

                    },
                    700
                );


            },
            1000
        );

}


    // =====================================
    // GAME STARTED
    // =====================================

    function handleGameStarted(
        data
    ) {

        if (!data) {

            return;

        }


        gameId =
            data.gameId ||
            gameId;


        const myId =
            currentUser &&
            currentUser._id
                ? currentUser._id
                    .toString()
                : null;


        if (
            !myId
        ) {

            return;

        }


        if (
            data.playerX &&
            data.playerX.toString() ===
                myId
        ) {

            playerSymbol =
                "X";

        }
        else if (
            data.playerO &&
            data.playerO.toString() ===
                myId
        ) {

            playerSymbol =
                "O";

        }
        else {

            return;

        }


        gameState =
            Array.isArray(
                data.board
            )
                ? [
                    ...data.board
                ]
                : [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                ];


        currentTurn =
            data.currentTurn ||
            "X";


        gameActive =
            true;

        countdownActive =
            false;


        renderBoard();


        updateTurnStatus();

    }


    // =====================================
    // CELL CLICK
    // =====================================

    cells.forEach(
        cell => {

            cell.addEventListener(
                "click",
                () => {
console.log(
    "🎮 TIC CLICK:",
    {
        gameId,
        playerSymbol,
        currentTurn,
        gameActive,
        countdownActive,
        gameState
    }
);
                    if (
                        !gameActive
                    ) {

                        return;

                    }


                    if (
                        countdownActive
                    ) {

                        return;

                    }


                    if (
                        !gameId
                    ) {

                        return;

                    }


                    if (
                        !playerSymbol
                    ) {

                        return;

                    }


                    if (
                        currentTurn !==
                        playerSymbol
                    ) {

                        showVibeToast(
                            "Wait for your turn.",
                            "error"
                        );

                        return;

                    }


                    const index =
                        Number(
                            cell.dataset.cell
                        );


                    if (
                        Number.isNaN(
                            index
                        )
                    ) {

                        return;

                    }


                    if (
                        gameState[index]
                    ) {

                        return;

                    }

console.log(
    "🎮 SENDING MOVE:",
    {
        gameId,
        index,
        playerSymbol
    }
);
                    socket.emit(
                        "game:move",
                        {

                            gameId,

                            index

                        }
                    );

                }
            );

        }
    );


    // =====================================
    // SERVER GAME STATE
    // =====================================

    socket.off(
        "game:state"
    );


    socket.on(
        "game:state",
        data => {

            if (
                !data ||
                (
                    gameId &&
                    data.gameId !==
                        gameId
                )
            ) {

                return;

            }


            gameId =
                data.gameId ||
                gameId;


            gameState =
                Array.isArray(
                    data.board
                )
                    ? [
                        ...data.board
                    ]
                    : gameState;


            currentTurn =
                data.currentTurn;


            renderBoard();


            // =================================
            // WIN
            // =================================

            if (
    data.winner
) {

    gameActive =
        false;

    countdownActive =
        false;


    // =================================
    // REMOVE OLD RESULT OVERLAY
    // =================================

    const oldResult =
        document.getElementById(
            "ticGameResultOverlay"
        );

    if (oldResult) {

        oldResult.remove();

    }


    // =================================
    // CREATE RESULT OVERLAY
    // =================================

    const resultOverlay =
        document.createElement(
            "div"
        );

    resultOverlay.id =
        "ticGameResultOverlay";

    resultOverlay.className =
        "tic-countdown-overlay";


    const won =
        data.winner ===
        playerSymbol;


    resultOverlay.innerHTML = `

        <div class="tic-countdown-box">

            <div class="tic-countdown-label">

                ${won
                    ? "GAME OVER"
                    : "GAME OVER"
                }

            </div>


            <div
                class="tic-countdown-number tic-game-result-number"
            >

                ${
                    won
                        ? "YOU WON 🎉"
                        : "YOU LOST 😔"
                }

            </div>


            <div class="tic-countdown-game">

                TIC TAC TOE

            </div>

        </div>

    `;


    document.body.appendChild(
        resultOverlay
    );


    // =================================
    // HIGHLIGHT WINNING CELLS
    // =================================

    if (
        Array.isArray(
            data.winningPattern
        )
    ) {

        data.winningPattern.forEach(
            index => {

                if (
                    cells[index]
                ) {

                    cells[index]
                        .classList
                        .add(
                            "winner"
                        );

                }

            }
        );

    }


    // =================================
    // REMOVE RESULT AFTER 3 SECONDS
    // =================================

    setTimeout(
        () => {

            if (
                resultOverlay &&
                resultOverlay.parentNode
            ) {

                resultOverlay.remove();

            }

        },
        3000
    );


    return;

}


            // =================================
            // DRAW
            // =================================

            if (
    data.draw
) {

    gameActive =
        false;

    countdownActive =
        false;


    const oldResult =
        document.getElementById(
            "ticGameResultOverlay"
        );

    if (oldResult) {

        oldResult.remove();

    }


    const resultOverlay =
        document.createElement(
            "div"
        );

    resultOverlay.id =
        "ticGameResultOverlay";

    resultOverlay.className =
        "tic-countdown-overlay";


    resultOverlay.innerHTML = `

        <div class="tic-countdown-box">

            <div class="tic-countdown-label">
                GAME OVER
            </div>


            <div
                class="tic-countdown-number tic-game-result-number"
            >
                DRAW 🤝
            </div>


            <div class="tic-countdown-game">
                TIC TAC TOE
            </div>

        </div>

    `;


    document.body.appendChild(
        resultOverlay
    );


    setTimeout(
        () => {

            if (
                resultOverlay &&
                resultOverlay.parentNode
            ) {

                resultOverlay.remove();

            }

        },
        3000
    );


    return;

}


            // =================================
            // CONTINUE GAME
            // =================================

            gameActive =
                data.status ===
                "playing";


            updateTurnStatus();

        }
    );


//     // =====================================
//     // GAME START COUNTDOWN
//     // =====================================

//     socket.off(
//         "game:start-countdown"
//     );


//    socket.on(
//     "game:start-countdown",
//     data => {

//         console.log(
//             "🎮 COUNTDOWN RECEIVED:",
//             data
//         );


//         if (
//             !data
//         ) {
//             return;
//         }
// socket.on(
//     "game:start-countdown",
//     data => {

//         console.log(
//             "🎮 COUNTDOWN RECEIVED:",
//             data
//         );

//         if (!data) {

//             return;

//         }
// =====================================
// GAME START COUNTDOWN
// =====================================

socket.off(
    "game:start-countdown"
);

socket.on(
    "game:start-countdown",
    data => {

        console.log(
            "🎮 COUNTDOWN RECEIVED:",
            data
        );

        if (!data) {

            return;

        }


        // =====================================
        // OPEN TIC TAC TOE AUTOMATICALLY
        // =====================================

        openTicTacToe();


        gameId =
            data.gameId;


        const myId =
            currentUser &&
            currentUser._id
                ? currentUser._id
                    .toString()
                : null;


        if (!myId) {

            return;

        }


        // =====================================
        // IDENTIFY PLAYER
        // =====================================

        if (
            data.playerX &&
            data.playerX.toString() ===
                myId
        ) {

            playerSymbol =
                "X";

        }
        else if (
            data.playerO &&
            data.playerO.toString() ===
                myId
        ) {

            playerSymbol =
                "O";

        }
        else {

            return;

        }


        // =====================================
        // RESET BOARD
        // =====================================

        gameState = [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ];


        currentTurn =
            data.currentTurn ||
            "X";


        gameActive =
            false;


        countdownActive =
            true;


        renderBoard();


        // =====================================
        // START COUNTDOWN
        // =====================================

        startCountdown(
            data.countdown || 3
        );

    }
);


// =====================================
// GAME STARTED EVENT
// =====================================

socket.off(
    "game:started"
);

socket.on(
    "game:started",
    data => {

        handleGameStarted(
            data
        );

        gameActive =
            true;

        countdownActive =
            false;

        updateTurnStatus();

    }
);


    // =====================================
    // GAME RESTARTED
    // =====================================

    socket.off(
        "game:restarted"
    );


    socket.on(
        "game:restarted",
        data => {

            if (
                !data
            ) {

                return;

            }


            gameId =
                data.gameId ||
                gameId;


            gameState =
                Array.isArray(
                    data.board
                )
                    ? [
                        ...data.board
                    ]
                    : [
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                        ""
                    ];


            currentTurn =
                data.currentTurn ||
                "X";


            gameActive =
                true;


            countdownActive =
                false;


            cells.forEach(
                cell => {

                    cell.classList.remove(
                        "winner"
                    );

                }
            );


            renderBoard();


            updateTurnStatus();

        }
    );


    // =====================================
    // NEW GAME / RESTART
    // =====================================

    resetBtn.addEventListener(
        "click",
        () => {

            if (
                !gameId
            ) {

                gameState = [
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                ];


                currentTurn =
                    "X";


                playerSymbol =
                    "X";


                gameActive =
                    true;


                countdownActive =
                    false;


                cells.forEach(
                    cell => {

                        cell.classList.remove(
                            "winner"
                        );

                    }
                );


                renderBoard();


                updateTurnStatus();


                return;

            }


            socket.emit(
                "game:restart",
                {

                    gameId

                }
            );

        }
    );


    // =====================================
    // OPPONENT LEFT
    // =====================================

    socket.off(
        "game:opponent-left"
    );


    socket.on(
        "game:opponent-left",
        () => {

            gameActive =
                false;


            countdownActive =
                false;


            status.innerText =
                "Opponent left the game.";


            showVibeToast(
                "Your opponent left the game.",
                "error"
            );

        }
    );


    // =====================================
// INVITE FRIEND
// =====================================

if (
    inviteBtn
) {

    inviteBtn.addEventListener(
        "click",
        () => {

            console.log(
                "🎮 INVITE BUTTON CLICKED"
            );

            openGameInviteModal();

        }
    );

}


    // =====================================
    // BACK TO GAMES
    // =====================================

    backBtn.addEventListener(
        "click",
        () => {

            if (
                gameId &&
                gameActive
            ) {

                socket.emit(
                    "game:leave",
                    {

                        gameId

                    }
                );

            }


            gameActive =
                false;


            countdownActive =
                false;


            gameId =
                null;


            playerSymbol =
                null;


            showGames();


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


            if (
                gamesBtn
            ) {

                gamesBtn.classList.add(
                    "active"
                );

            }

        }
    );

}
// =========================================
// GAME INVITE MODAL
// =========================================

async function openGameInviteModal() {

    let modal =
        document.getElementById(
            "gameInviteModal"
        );


    if (modal) {

        modal.remove();

    }


    modal =
        document.createElement(
            "div"
        );


    modal.id =
        "gameInviteModal";

    modal.className =
        "game-invite-overlay";


    modal.innerHTML = `

        <div class="game-invite-modal">

            <div class="game-invite-header">

                <div>

                    <h3>
                        Invite a Friend
                    </h3>

                    <p>
                        Choose a contact to play Tic Tac Toe
                    </p>

                </div>

                <button
                    type="button"
                    id="closeGameInvite"
                    class="game-invite-close"
                >
                    <i class="fas fa-times"></i>
                </button>

            </div>


            <div
                id="gameContactsList"
                class="game-contacts-list"
            >

                <div class="game-contacts-loading">
                    Loading contacts...
                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    document
        .getElementById(
            "closeGameInvite"
        )
        .addEventListener(
            "click",
            () => {

                modal.remove();

            }
        );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                modal
            ) {

                modal.remove();

            }

        }
    );


    await loadGameContacts();

}
// =========================================
// SEND GAME INVITE
// =========================================

function sendGameInvite(
    userId,
    userName
) {

    if (
        !userId ||
        !socket ||
        !socket.connected
    ) {

        showVibeToast(
            "Unable to send game invite.",
            "error"
        );

        return;

    }


    socket.emit(
        "game:invite",
        {

            to:
                userId.toString(),

            from:
                currentUser._id.toString(),

            fromName:
                currentUser.name ||
                "A friend",

            game:
                "tic-tac-toe"

        }
    );


    const modal =
        document.getElementById(
            "gameInviteModal"
        );


    if (modal) {

        modal.remove();

    }


    showVibeToast(
        `Game invite sent to ${userName}.`,
        "success"
    );

}
// =========================================
// RECEIVE GAME INVITE
// =========================================

socket.on(
    "game:incoming-invite",
    ({
        from,
        fromName,
        game
    }) => {

        if (
            game !==
            "tic-tac-toe"
        ) {

            return;

        }


        showGameInviteReceived(
            from,
            fromName
        );

    }
);


// =========================================
// SHOW INCOMING GAME INVITE
// =========================================

function showGameInviteReceived(
    from,
    fromName
) {

    const existing =
        document.getElementById(
            "incomingGameInvite"
        );


    if (existing) {

        existing.remove();

    }


    const invite =
        document.createElement(
            "div"
        );


    invite.id =
        "incomingGameInvite";


    invite.className =
        "incoming-game-invite";


    invite.innerHTML = `

        <div class="incoming-game-content">

            <div class="incoming-game-icon">

                <i class="fas fa-gamepad"></i>

            </div>


            <div class="incoming-game-text">

                <strong>
                    Tic Tac Toe
                </strong>

                <span>
                    ${fromName} invited you to play
                </span>

            </div>

        </div>


        <div class="incoming-game-actions">

            <button
                type="button"
                id="declineGameInvite"
            >
                Decline
            </button>


            <button
                type="button"
                id="acceptGameInvite"
            >
                Accept
            </button>

        </div>

    `;


    document.body.appendChild(
        invite
    );


    // =====================================
    // ACCEPT GAME INVITE
    // =====================================

    document
        .getElementById(
            "acceptGameInvite"
        )
        .addEventListener(
            "click",
            () => {

                // Open game FIRST.
                // This registers all game socket listeners
                // before the server sends countdown.

                openTicTacToe();


                // Then accept the invite.

                socket.emit(
                    "game:accept",
                    {

                        to:
                            from,

                        from:
                            currentUser._id.toString(),

                        game:
                            "tic-tac-toe"

                    }
                );


                // Remove invite popup.

                invite.remove();

            }
        );


    // =====================================
    // DECLINE GAME INVITE
    // =====================================

    document
        .getElementById(
            "declineGameInvite"
        )
        .addEventListener(
            "click",
            () => {

                socket.emit(
                    "game:decline",
                    {

                        to:
                            from,

                        from:
                            currentUser._id.toString(),

                        game:
                            "tic-tac-toe"

                    }
                );


                invite.remove();

            }
        );

}
// =========================================
// GAME INVITE RESPONSE
// =========================================

// =========================================
// GAME INVITE ACCEPTED
// =========================================

socket.on(
    "game:invite-accepted",
    () => {

        showVibeToast(
            "Your friend accepted the game invite! 🎮",
            "success"
        );

        openTicTacToe();

    }
);


socket.on(
    "game:invite-declined",
    () => {

        showVibeToast(
            "Your friend declined the game invite.",
            "error"
        );

    }
);
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

const welcomeShareScreen =
    document.getElementById(
        "welcomeShareScreen"
    );

const chatHeader =
    document.getElementById("chatHeader");

const messageInputArea =
    document.getElementById("messageInputArea");

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
// =========================================
// SHARE FILE MODAL
// =========================================

const shareFileModal =
    document.getElementById(
        "shareFileModal"
    );

const closeShareFileBtn =
    document.getElementById(
        "closeShareFileBtn"
    );

const cancelShareFileBtn =
    document.getElementById(
        "cancelShareFileBtn"
    );

const sharePhotoVideoBtn =
    document.getElementById(
        "sharePhotoVideoBtn"
    );

const shareDocumentBtn =
    document.getElementById(
        "shareDocumentBtn"
    );

const shareAudioBtn =
    document.getElementById(
        "shareAudioBtn"
    );

const shareOtherFileBtn =
    document.getElementById(
        "shareOtherFileBtn"
    );

const sharePhotoVideoInput =
    document.getElementById(
        "sharePhotoVideoInput"
    );

const shareDocumentInput =
    document.getElementById(
        "shareDocumentInput"
    );

const shareAudioInput =
    document.getElementById(
        "shareAudioInput"
    );

const shareOtherFileInput =
    document.getElementById(
        "shareOtherFileInput"
    );

const shareFilePreview =
    document.getElementById(
        "shareFilePreview"
    );

const shareFileName =
    document.getElementById(
        "shareFileName"
    );

const shareFileSize =
    document.getElementById(
        "shareFileSize"
    );

const shareFilePreviewIcon =
    document.getElementById(
        "shareFilePreviewIcon"
    );

const removeShareFileBtn =
    document.getElementById(
        "removeShareFileBtn"
    );

const continueShareFileBtn =
    document.getElementById(
        "continueShareFileBtn"
    );


// =========================================
// SELECTED FILE
// =========================================

let selectedShareFile = null;


// =========================================
// OPEN SHARE FILE MODAL
// =========================================

function openShareFileModal() {

    if (!shareFileModal) {
        return;
    }

    shareFileModal.classList.add(
        "active"
    );

}


// =========================================
// CLOSE SHARE FILE MODAL
// =========================================

function closeShareFileModal() {

    if (!shareFileModal) {
        return;
    }

    shareFileModal.classList.remove(
        "active"
    );

    selectedShareFile =
        null;

    if (shareFilePreview) {

        shareFilePreview.style.display =
            "none";

    }

    if (continueShareFileBtn) {

        continueShareFileBtn.disabled =
            true;

    }

}


// =========================================
// FILE SIZE
// =========================================

function formatShareFileSize(
    bytes
) {

    if (!bytes) {
        return "0 KB";
    }

    if (bytes < 1024) {

        return bytes + " B";

    }

    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024)
                .toFixed(1) +
            " KB"
        );

    }

    return (
        (bytes / (1024 * 1024))
            .toFixed(1) +
        " MB"
    );

}


// =========================================
// SHOW SELECTED FILE
// =========================================

function handleShareFileSelect(
    file
) {

    if (!file) {
        return;
    }

    selectedShareFile =
        file;


    if (shareFileName) {

        shareFileName.innerText =
            file.name;

    }


    if (shareFileSize) {

        shareFileSize.innerText =
            formatShareFileSize(
                file.size
            );

    }


    if (shareFilePreviewIcon) {

        let icon =
            "fa-file";

        if (
            file.type.startsWith(
                "image/"
            )
        ) {

            icon =
                "fa-file-image";

        }
        else if (
            file.type.startsWith(
                "video/"
            )
        ) {

            icon =
                "fa-file-video";

        }
        else if (
            file.type.startsWith(
                "audio/"
            )
        ) {

            icon =
                "fa-file-audio";

        }
        else if (
            file.type.includes(
                "pdf"
            )
        ) {

            icon =
                "fa-file-pdf";

        }


        shareFilePreviewIcon.innerHTML = `

            <i class="fas ${icon}"></i>

        `;

    }


    if (shareFilePreview) {

        shareFilePreview.style.display =
            "flex";

    }


    if (continueShareFileBtn) {

        continueShareFileBtn.disabled =
            false;

    }

}


// =========================================
// PHOTO / VIDEO
// =========================================

if (sharePhotoVideoBtn) {

    sharePhotoVideoBtn.addEventListener(
        "click",
        () => {

            sharePhotoVideoInput.click();

        }
    );

}


if (sharePhotoVideoInput) {

    sharePhotoVideoInput.addEventListener(
        "change",
        () => {

            handleShareFileSelect(
                sharePhotoVideoInput.files[0]
            );

        }
    );

}


// =========================================
// DOCUMENT
// =========================================

if (shareDocumentBtn) {

    shareDocumentBtn.addEventListener(
        "click",
        () => {

            shareDocumentInput.click();

        }
    );

}


if (shareDocumentInput) {

    shareDocumentInput.addEventListener(
        "change",
        () => {

            handleShareFileSelect(
                shareDocumentInput.files[0]
            );

        }
    );

}


// =========================================
// AUDIO
// =========================================

if (shareAudioBtn) {

    shareAudioBtn.addEventListener(
        "click",
        () => {

            shareAudioInput.click();

        }
    );

}


if (shareAudioInput) {

    shareAudioInput.addEventListener(
        "change",
        () => {

            handleShareFileSelect(
                shareAudioInput.files[0]
            );

        }
    );

}


// =========================================
// OTHER FILE
// =========================================

if (shareOtherFileBtn) {

    shareOtherFileBtn.addEventListener(
        "click",
        () => {

            shareOtherFileInput.click();

        }
    );

}


if (shareOtherFileInput) {

    shareOtherFileInput.addEventListener(
        "change",
        () => {

            handleShareFileSelect(
                shareOtherFileInput.files[0]
            );

        }
    );

}


// =========================================
// REMOVE SELECTED FILE
// =========================================

if (removeShareFileBtn) {

    removeShareFileBtn.addEventListener(
        "click",
        () => {

            selectedShareFile =
                null;

            if (shareFilePreview) {

                shareFilePreview.style.display =
                    "none";

            }

            if (continueShareFileBtn) {

                continueShareFileBtn.disabled =
                    true;

            }

        }
    );

}


// =========================================
// CLOSE BUTTONS
// =========================================

if (closeShareFileBtn) {

    closeShareFileBtn.addEventListener(
        "click",
        closeShareFileModal
    );

}


if (cancelShareFileBtn) {

    cancelShareFileBtn.addEventListener(
        "click",
        closeShareFileModal
    );

}


// =========================================
// CLICK OUTSIDE
// =========================================

if (shareFileModal) {

    shareFileModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                shareFileModal
            ) {

                closeShareFileModal();

            }

        }
    );

}
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
// OPEN CHAT IMAGE
// =========================================

function openChatImage(
    imageSrc
) {

    if (!imageSrc) {
        return;
    }


    if (!imageViewer) {

        createImageViewer();

    }


    imageViewerImg.src =
        imageSrc;


    imageViewer.classList.add(
        "chat-image-viewer"
    );


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


    imageViewer.classList.remove(
        "chat-image-viewer"
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
// VIBECHAT TOAST MESSAGE
// =========================================

function showVibeToast(message, type = "success") {

    const oldToast =
        document.querySelector(".vibe-toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast =
        document.createElement("div");

    toast.className =
        `vibe-toast vibe-toast-${type}`;

    const icon =
        type === "success"
            ? "fa-check-circle"
            : "fa-circle-exclamation";

    toast.innerHTML = `

        <div class="vibe-toast-icon">
            <i class="fas ${icon}"></i>
        </div>

        <div class="vibe-toast-content">

            <strong>
                ${type === "success" ? "Success" : "Error"}
            </strong>

            <span>
                ${message}
            </span>

        </div>

        <button
            type="button"
            class="vibe-toast-close"
        >
            <i class="fas fa-times"></i>
        </button>

    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    const closeToast = () => {

        toast.classList.remove("show");

        setTimeout(() => {

            if (toast) {
                toast.remove();
            }

        }, 300);

    };

    toast
        .querySelector(".vibe-toast-close")
        .addEventListener(
            "click",
            closeToast
        );

    setTimeout(
        closeToast,
        3000
    );

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
// LOAD CHATS + SAVED CONTACTS
// =========================================

async function loadChats() {

    try {

        // =====================================
        // LOAD EXISTING CHATS
        // =====================================

        const chatResponse =
            await fetch(
                API_URL + "/chat",
                {

                    headers: {

                        Authorization:
                            "Bearer " + token

                    }

                }
            );


        const chatData =
            await chatResponse.json();


        if (!chatData.success) {

            console.log(
                chatData.message
            );

            return;

        }


        let chats =
            chatData.chats || [];


        // =====================================
        // LOAD SAVED CONTACTS
        // =====================================

        const contactResponse =
            await fetch(
                API_URL + "/users/contacts",
                {

                    headers: {

                        Authorization:
                            "Bearer " + token

                    }

                }
            );


        const contactData =
            await contactResponse.json();


        const contacts =
            contactData.success
                ?
                contactData.contacts || []
                :
                [];


        // =====================================
        // GET USERS ALREADY IN CHAT LIST
        // =====================================

        const chatUserIds =
            new Set();


        chats.forEach(
            chat => {

                const otherUser =
                    chat.users.find(
                        user =>
                            user._id !==
                            currentUser._id
                    );


                if (otherUser) {

                    chatUserIds.add(
                        otherUser._id.toString()
                    );

                }

            }
        );


        // =====================================
        // ADD SAVED CONTACTS
        // =====================================

        contacts.forEach(
            contact => {

                const contactUser =
                    contact.user;


                if (!contactUser) {

                    return;

                }


                const contactId =
                    contactUser._id.toString();


                // Don't duplicate existing chats
                if (
                    chatUserIds.has(
                        contactId
                    )
                ) {

                    return;

                }


                // Temporary chat object
                chats.push({

                    _id:
                        "contact_" +
                        contactId,

                    users: [

                        currentUser,

                        contactUser

                    ],

                    latestMessage:
                        null,

                    isSavedContact:
                        true,

                    contactId:
                        contactId

                });

            }
        );


        // =====================================
        // RENDER CHAT LIST
        // =====================================

        renderChats(
            chats
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
    async () => {

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


        // =====================================
        // SAVED CONTACT
        // =====================================

        if (
            chat.isSavedContact
        ) {

            try {

                const response =
                    await fetch(
                        API_URL + "/chat",
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

                                    userId:
                                        chat.contactId

                                })

                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to open chat."
                    );

                }


                // =================================
                // OPEN REAL CHAT
                // =================================

                openChat(
                    data.chat
                );


                // =================================
                // REFRESH LIST
                // =================================

                loadChats();

            }

            catch (error) {

                console.error(
                    "Open saved contact error:",
                    error
                );


                showVibeToast(
                    error.message ||
                    "Unable to open chat.",
                    "error"
                );

            }

            return;

        }


        // =====================================
        // EXISTING CHAT
        // =====================================

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

if (!selectedUser) {

    if (chatHeader) {
        chatHeader.style.display = "none";
    }

    if (messageInputArea) {
        messageInputArea.style.display = "none";
    }

    if (welcomeShareScreen) {
        welcomeShareScreen.style.display = "flex";
    }

}

loadChats();

restoreActiveSection();

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

        // =====================================
// SHOW CHAT UI
// =====================================

if (chatHeader) {
    chatHeader.style.display = "";
}

if (messageInputArea) {
    messageInputArea.style.display = "";
}

if (welcomeShareScreen) {
    welcomeShareScreen.style.display = "none";
}
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
// =====================================
// UPDATE UNREAD COUNT IMMEDIATELY
// =====================================

await loadChats();
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
                hour: "2-digit",
                minute: "2-digit"
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
    // MESSAGE CONTENT
    // =====================================

    let messageContent = "";


    // =====================================
    // IMAGE
    // =====================================

    if (
        message.type === "image" &&
        message.fileUrl
    ) {

        messageContent = `

    <div class="message-file">

        <img
            src="${message.fileUrl}"
            class="message-image"
            alt="${message.fileName || "Image"}"
            loading="lazy"
        >

    </div>

`;

    }


    // =====================================
    // VIDEO
    // =====================================

    else if (
        message.type === "video" &&
        message.fileUrl
    ) {

        messageContent = `

            <div class="message-file">

                <video
                    src="${message.fileUrl}"
                    class="message-video"
                    controls
                    playsinline
                ></video>

            </div>

        `;

    }


    // =====================================
    // AUDIO
    // =====================================

    else if (
        message.type === "audio" &&
        message.fileUrl
    ) {

        messageContent = `

            <div class="message-file">

                <audio
                    src="${message.fileUrl}"
                    class="message-audio"
                    controls
                ></audio>

            </div>

        `;

    }


    // =====================================
    // OTHER FILE
    // =====================================

    else if (
        message.type === "file" &&
        message.fileUrl
    ) {

        messageContent = `

            <a
                href="${message.fileUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="message-file-card"
            >

                <div class="message-file-icon">

                    <i class="fas fa-file"></i>

                </div>


                <div class="message-file-info">

                    <strong>
                        ${message.fileName || "File"}
                    </strong>

                    <span>
                        Open file
                    </span>

                </div>


                <i class="fas fa-download message-file-download"></i>

            </a>

        `;

    }


    // =====================================
    // NORMAL TEXT
    // =====================================

    else if (
        message.content
    ) {

        messageContent = `

            <div class="message-text">

                ${message.content}

            </div>

        `;

    }


    // =====================================
    // MESSAGE HTML
    // =====================================

    div.innerHTML = `

        ${messageContent}


        <div class="message-meta">

            <span class="message-time">

                ${time}

            </span>

            ${status}

        </div>

    `;
    // =====================================
    // OPEN IMAGE ON CLICK
    // =====================================

    if (
        message.type === "image" &&
        message.fileUrl
    ) {

        const messageImage =
            div.querySelector(
                ".message-image"
            );


        if (messageImage) {

            messageImage.style.cursor =
                "pointer";


            messageImage.addEventListener(
                "click",
                () => {

                    openChatImage(
    message.fileUrl
);

                }
            );

        }

    }


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

        console.log(
            "📩 RECEIVED MESSAGE:",
            {
                id: message?._id,
                type: message?.type,
                fileUrl: message?.fileUrl,
                fileName: message?.fileName,
                content: message?.content
            }
        );

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

        const response =
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


        if (!response.ok) {

            console.log(
                "Unable to mark message as seen."
            );

            return;

        }


        // =====================================
        // REFRESH CHAT LIST
        // REMOVE UNREAD COUNT IMMEDIATELY
        // =====================================

        await loadChats();

    }

    catch (err) {

        console.log(
            "Mark message seen error:",
            err
        );

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

/// =========================================
// ATTACHMENT
// =========================================

if (
    attachmentBtn &&
    fileInput
) {

    // =====================================
    // OPEN FILE PICKER
    // =====================================

    attachmentBtn.addEventListener(
        "click",
        () => {

            if (!selectedChat) {

                showVibeToast(
                    "Please open a chat first.",
                    "error"
                );

                return;

            }

            fileInput.click();

        }
    );


    // =====================================
    // FILE SELECTED
    // =====================================

    fileInput.addEventListener(
        "change",
        async () => {

            const file =
                fileInput.files[0];


            if (!file) {

                return;

            }


            // =================================
            // CHECK CHAT
            // =================================

            if (!selectedChat) {

                showVibeToast(
                    "Please open a chat first.",
                    "error"
                );

                fileInput.value = "";

                return;

            }


            // =================================
            // FILE SIZE
            // =================================

            const maxSize =
                25 * 1024 * 1024;


            if (
                file.size >
                maxSize
            ) {

                showVibeToast(
                    "File size must be less than 25 MB.",
                    "error"
                );

                fileInput.value = "";

                return;

            }


            // =================================
            // SEND FILE
            // =================================

            try {

                attachmentBtn.disabled =
                    true;


                attachmentBtn.innerHTML = `

                    <i class="fas fa-spinner fa-spin"></i>

                `;


                const formData =
                    new FormData();


                formData.append(
                    "file",
                    file
                );


                formData.append(
                    "chatId",
                    selectedChat._id
                );


                formData.append(
                    "content",
                    ""
                );


                const response =
                    await fetch(
                        API_URL + "/message",
                        {

                            method:
                                "POST",

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

                    throw new Error(
                        data.message ||
                        "Unable to send file."
                    );

                }


                // =================================
                // RENDER MESSAGE
                // =================================

                renderMessage(
                    data.message
                );


                scrollBottom();


                refreshChats();


                showVibeToast(
                    "File sent successfully!",
                    "success"
                );

            }

            catch (error) {

                console.error(
                    "File upload error:",
                    error
                );


                showVibeToast(
                    error.message ||
                    "Unable to send file.",
                    "error"
                );

            }

            finally {

                attachmentBtn.disabled =
                    false;


                attachmentBtn.innerHTML = `

                    <i class="fas fa-paperclip"></i>

                `;


                // IMPORTANT:
                // Same file can be selected again

                fileInput.value =
                    "";

            }

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
// =========================================
// WELCOME SHARE CONTACT MODAL
// =========================================

const shareContactModal =
    document.getElementById(
        "shareContactModal"
    );

const shareContactList =
    document.getElementById(
        "shareContactList"
    );

const shareContactSearch =
    document.getElementById(
        "shareContactSearch"
    );

const shareContactType =
    document.getElementById(
        "shareContactType"
    );

const closeShareContactBtn =
    document.getElementById(
        "closeShareContactBtn"
    );

const cancelShareContactBtn =
    document.getElementById(
        "cancelShareContactBtn"
    );

const confirmShareContactBtn =
    document.getElementById(
        "confirmShareContactBtn"
    );

const welcomeFileBtn =
    document.getElementById(
        "welcomeFileBtn"
    );

const welcomeLinkBtn =
    document.getElementById(
        "welcomeLinkBtn"
    );

const welcomeMessageBtn =
    document.getElementById(
        "welcomeMessageBtn"
    );


let shareMode =
    null;

let selectedShareContact =
    null;

let shareContacts =
    [];


// =========================================
// OPEN SHARE CONTACT MODAL
// =========================================

function openShareContactModal(
    mode
) {

    shareMode =
        mode;

    selectedShareContact =
        null;

    if (!shareContactModal) {
        return;
    }


    // UPDATE TITLE

    if (shareContactType) {

        if (mode === "file") {

            shareContactType.innerText =
                "Choose a contact to share a file";

        }
        else if (mode === "link") {

            shareContactType.innerText =
                "Choose a contact to share a link";

        }
        else {

            shareContactType.innerText =
                "Choose a contact to send a message";

        }

    }


    if (shareContactSearch) {

        shareContactSearch.value =
            "";

    }


    if (confirmShareContactBtn) {

        confirmShareContactBtn.disabled =
            true;

    }


    shareContactModal.classList.add(
        "active"
    );


    loadShareContacts();

}


// =========================================
// CLOSE MODAL
// =========================================

function closeShareContactModal() {

    if (!shareContactModal) {
        return;
    }

    shareContactModal.classList.remove(
        "active"
    );

    selectedShareContact =
        null;

    shareMode =
        null;

}


// =========================================
// LOAD CONTACTS
// =========================================

async function loadShareContacts() {

    if (!shareContactList) {
        return;
    }


    shareContactList.innerHTML = `

        <div class="share-contact-empty">

            <i class="fas fa-spinner fa-spin"></i>

            Loading contacts...

        </div>

    `;


    try {

        const response =
            await fetch(
                API_URL + "/chat",
                {

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

            throw new Error(
                data.message ||
                "Unable to load contacts."
            );

        }


        shareContacts =
            [];


        data.chats.forEach(
            chat => {

                const otherUser =
                    chat.users.find(
                        user =>
                            user._id.toString() !==
                            currentUser._id.toString()
                    );


                if (otherUser) {

                    shareContacts.push({

                        user:
                            otherUser,

                        chat:
                            chat

                    });

                }

            }
        );


        renderShareContacts(
            shareContacts
        );

    }

    catch (error) {

        console.error(
            "Share contacts error:",
            error
        );


        shareContactList.innerHTML = `

            <div class="share-contact-empty">

                <i class="fas fa-user-slash"></i>

                Unable to load contacts.

            </div>

        `;

    }

}


// =========================================
// RENDER CONTACTS
// =========================================

function renderShareContacts(
    contacts
) {

    if (!shareContactList) {
        return;
    }


    shareContactList.innerHTML =
        "";


    if (
        !contacts ||
        contacts.length === 0
    ) {

        shareContactList.innerHTML = `

            <div class="share-contact-empty">

                <i class="fas fa-user-group"></i>

                No contacts found.

            </div>

        `;

        return;

    }


    contacts.forEach(
        item => {

            const user =
                item.user;


            const contact =
                document.createElement(
                    "button"
                );


            contact.type =
                "button";

            contact.className =
                "share-contact-item";


            const firstLetter =
                user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "?";


            const avatar =
                user.profilePic

                    ? `
                        <img
                            src="${user.profilePic}"
                            alt="${user.name}"
                        >
                      `

                    : firstLetter;


            contact.innerHTML = `

                <div class="share-contact-avatar">

                    ${avatar}

                </div>


                <div class="share-contact-info">

                    <strong>
                        ${user.name || "Unknown User"}
                    </strong>

                    <span>
                        ${user.phone || "VibeChat Contact"}
                    </span>

                </div>


                <div class="share-contact-check">

                    <i class="fas fa-check"></i>

                </div>

            `;


            contact.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".share-contact-item"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    contact.classList.add(
                        "selected"
                    );


                    selectedShareContact =
                        item;


                    if (
                        confirmShareContactBtn
                    ) {

                        confirmShareContactBtn.disabled =
                            false;

                    }

                }
            );


            shareContactList.appendChild(
                contact
            );

        }
    );

}


// =========================================
// SEARCH CONTACTS
// =========================================

if (shareContactSearch) {

    shareContactSearch.addEventListener(
        "input",
        () => {

            const value =
                shareContactSearch.value
                    .trim()
                    .toLowerCase();


            const filtered =
                shareContacts.filter(
                    item => {

                        const name =
                            item.user?.name ||
                            "";

                        const phone =
                            item.user?.phone ||
                            "";


                        return (
                            name
                                .toLowerCase()
                                .includes(value) ||

                            phone
                                .toLowerCase()
                                .includes(value)
                        );

                    }
                );


            renderShareContacts(
                filtered
            );

        }
    );

}


// =========================================
// BUTTONS
// =========================================

if (welcomeFileBtn) {

    welcomeFileBtn.addEventListener(
        "click",
        () => {

            openShareFileModal();

        }
    );

}


// =========================================
// VIBECHAT SHARE LINK
// =========================================

const shareLinkModal =
    document.getElementById(
        "shareLinkModal"
    );

const closeShareLinkBtn =
    document.getElementById(
        "closeShareLinkBtn"
    );

const cancelShareLinkBtn =
    document.getElementById(
        "cancelShareLinkBtn"
    );

const nativeShareLinkBtn =
    document.getElementById(
        "nativeShareLinkBtn"
    );

const copyShareLinkBtn =
    document.getElementById(
        "copyShareLinkBtn"
    );

const shareLinkUrl =
    document.getElementById(
        "shareLinkUrl"
    );


// =========================================
// OPEN SHARE LINK MODAL
// =========================================

function openShareLinkModal() {

    if (!shareLinkModal) {
        return;
    }

    const url =
        window.location.origin;

    if (shareLinkUrl) {

        shareLinkUrl.innerText =
            url;

    }

    shareLinkModal.classList.add(
        "active"
    );

}


// =========================================
// CLOSE SHARE LINK MODAL
// =========================================

function closeShareLinkModal() {

    if (!shareLinkModal) {
        return;
    }

    shareLinkModal.classList.remove(
        "active"
    );

}


// =========================================
// SHARE VIA PHONE
// =========================================

async function shareVibeChatLink() {

    const shareData = {

        title:
            "VibeChat",

        text:
            "Join me on VibeChat!",

        url:
            window.location.origin

    };


    if (
        !navigator.share
    ) {

        showVibeToast(
            "Phone sharing is not supported on this device.",
            "error"
        );

        return;

    }


    try {

        await navigator.share(
            shareData
        );

    }

    catch (error) {

        if (
            error.name ===
            "AbortError"
        ) {

            return;

        }

        console.error(
            "VibeChat share error:",
            error
        );

        showVibeToast(
            "Unable to open phone sharing.",
            "error"
        );

    }

}


// =========================================
// COPY LINK
// =========================================

async function copyVibeChatLink() {

    const url =
        window.location.origin;

    try {

        await navigator.clipboard.writeText(
            url
        );

        showVibeToast(
            "VibeChat link copied successfully!",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Copy link error:",
            error
        );

        showVibeToast(
            "Unable to copy the link.",
            "error"
        );

    }

}


// =========================================
// WELCOME SHARE BUTTON
// =========================================

if (welcomeLinkBtn) {

    welcomeLinkBtn.addEventListener(
        "click",
        openShareLinkModal
    );

}


// =========================================
// SHARE BUTTON
// =========================================

if (nativeShareLinkBtn) {

    nativeShareLinkBtn.addEventListener(
        "click",
        shareVibeChatLink
    );

}


// =========================================
// COPY BUTTON
// =========================================

if (copyShareLinkBtn) {

    copyShareLinkBtn.addEventListener(
        "click",
        copyVibeChatLink
    );

}


// =========================================
// CLOSE BUTTONS
// =========================================

if (closeShareLinkBtn) {

    closeShareLinkBtn.addEventListener(
        "click",
        closeShareLinkModal
    );

}


if (cancelShareLinkBtn) {

    cancelShareLinkBtn.addEventListener(
        "click",
        closeShareLinkModal
    );

}


// =========================================
// CLICK OUTSIDE
// =========================================

if (shareLinkModal) {

    shareLinkModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                shareLinkModal
            ) {

                closeShareLinkModal();

            }

        }
    );

}


if (welcomeMessageBtn) {

    welcomeMessageBtn.addEventListener(
        "click",
        () => {

            openShareContactModal(
                "message"
            );

        }
    );

}


// =========================================
// CLOSE BUTTONS
// =========================================

if (closeShareContactBtn) {

    closeShareContactBtn.addEventListener(
        "click",
        closeShareContactModal
    );

}


if (cancelShareContactBtn) {

    cancelShareContactBtn.addEventListener(
        "click",
        closeShareContactModal
    );

}


// =========================================
// CLICK OUTSIDE MODAL
// =========================================

if (shareContactModal) {

    shareContactModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                shareContactModal
            ) {

                closeShareContactModal();

            }

        }
    );

}

/// =========================================
// CONTINUE WITH SELECTED FILE
// =========================================

if (continueShareFileBtn) {

    continueShareFileBtn.addEventListener(
        "click",
        () => {

            if (!selectedShareFile) {

                showVibeToast(
                    "Please select a file first.",
                    "error"
                );

                return;

            }


            // =====================================
            // HIDE FILE MODAL
            // DO NOT RESET SELECTED FILE
            // =====================================

            if (shareFileModal) {

                shareFileModal.classList.remove(
                    "active"
                );

            }


            // =====================================
            // OPEN CONTACT MODAL
            // =====================================

            openShareContactModal(
                "file"
            );

        }
    );

}
// =========================================
// SEND MESSAGE FROM WELCOME SHARE
// =========================================

if (confirmShareContactBtn) {

    confirmShareContactBtn.addEventListener(
        "click",
        async () => {

            // =====================================
            // CHECK CONTACT
            // =====================================

            if (!selectedShareContact) {

                return;

            }

// =====================================
// FILE SHARE MODE
// =====================================

if (shareMode === "file") {

    const selectedChatForShare =
        selectedShareContact.chat;


    if (!selectedChatForShare) {

        showVibeToast(
            "Unable to open this contact.",
            "error"
        );

        return;

    }


    if (!selectedShareFile) {

        showVibeToast(
            "Please select a file first.",
            "error"
        );

        return;

    }


    try {

        confirmShareContactBtn.disabled =
            true;


        confirmShareContactBtn.innerHTML = `

            <i class="fas fa-spinner fa-spin"></i>

            Sending...

        `;


        // =====================================
        // CREATE FORM DATA
        // =====================================

        const formData =
            new FormData();


        formData.append(
            "file",
            selectedShareFile
        );


        formData.append(
            "chatId",
            selectedChatForShare._id
        );


        formData.append(
            "content",
            ""
        );


        // =====================================
        // SEND FILE
        // =====================================

        const response =
            await fetch(
                API_URL + "/message",
                {

                    method:
                        "POST",

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

            throw new Error(
                data.message ||
                "Unable to send file."
            );

        }


        // =====================================
        // SUCCESS
        // =====================================

        closeShareContactModal();

        refreshChats();


        showVibeToast(
            "File shared successfully!",
            "success"
        );


    }

    catch (error) {

        console.error(
            "Welcome share file error:",
            error
        );


        showVibeToast(
            error.message ||
            "Unable to send file.",
            "error"
        );

    }

    finally {

        confirmShareContactBtn.disabled =
            false;

        confirmShareContactBtn.innerHTML = `

            <i class="fas fa-share"></i>

            Share

        `;

    }


    return;

}
            // =====================================
            // ONLY MESSAGE MODE
            // =====================================

            if (shareMode !== "message") {

                return;

            }


            const selectedChatForShare =
                selectedShareContact.chat;


            if (!selectedChatForShare) {

                alert(
                    "Unable to open this contact."
                );

                return;

            }


            // =====================================
// CUSTOM MESSAGE MODAL
// =====================================

const messageModal =
    document.createElement("div");

messageModal.className =
    "welcome-message-modal";


messageModal.innerHTML = `

    <div class="welcome-message-overlay"></div>

    <div class="welcome-message-dialog">

        <button
            type="button"
            class="welcome-message-close"
            aria-label="Close"
        >
            <i class="fas fa-xmark"></i>
        </button>


        <div class="welcome-message-icon">

            <i class="fas fa-comment-dots"></i>

        </div>


        <h2>
            Send a Message
        </h2>


        <p class="welcome-message-subtitle">

            Send a message to
            <strong>
                ${
                    selectedShareContact.user?.name ||
                    "this contact"
                }
            </strong>

        </p>


        <textarea
            class="welcome-message-input"
            placeholder="Type your message..."
            maxlength="1000"
            rows="4"
        ></textarea>


        <div class="welcome-message-footer">

            <span class="welcome-message-counter">
                0 / 1000
            </span>


            <div class="welcome-message-actions">

                <button
                    type="button"
                    class="welcome-message-cancel"
                >
                    Cancel
                </button>


                <button
                    type="button"
                    class="welcome-message-send"
                >

                    <i class="fas fa-paper-plane"></i>

                    Send

                </button>

            </div>

        </div>

    </div>

`;


document.body.appendChild(
    messageModal
);


// =====================================
// MESSAGE ELEMENTS
// =====================================

const messageInputModal =
    messageModal.querySelector(
        ".welcome-message-input"
    );


const messageCounter =
    messageModal.querySelector(
        ".welcome-message-counter"
    );


const messageSendBtn =
    messageModal.querySelector(
        ".welcome-message-send"
    );


const messageCancelBtn =
    messageModal.querySelector(
        ".welcome-message-cancel"
    );


const messageCloseBtn =
    messageModal.querySelector(
        ".welcome-message-close"
    );


// =====================================
// FOCUS INPUT
// =====================================

setTimeout(
    () => {

        messageInputModal.focus();

    },
    100
);


// =====================================
// CHARACTER COUNTER
// =====================================

messageInputModal.addEventListener(
    "input",
    () => {

        messageCounter.innerText =
            `${messageInputModal.value.length} / 1000`;

    }
);


// =====================================
// CLOSE MESSAGE MODAL
// =====================================

const closeMessageModal =
    () => {

        messageModal.remove();

    };


// =====================================
// CANCEL
// =====================================

messageCancelBtn.addEventListener(
    "click",
    closeMessageModal
);


// =====================================
// CLOSE BUTTON
// =====================================

messageCloseBtn.addEventListener(
    "click",
    closeMessageModal
);


// =====================================
// OVERLAY CLICK
// =====================================

const messageOverlay =
    messageModal.querySelector(
        ".welcome-message-overlay"
    );


messageOverlay.addEventListener(
    "click",
    closeMessageModal
);


// =====================================
// SEND MESSAGE
// =====================================

messageSendBtn.addEventListener(
    "click",
    async () => {

        const content =
            messageInputModal.value.trim();


        if (!content) {

            messageInputModal.focus();

            return;

        }


        const selectedChatForShare =
            selectedShareContact.chat;


        if (!selectedChatForShare) {

            alert(
                "Unable to open this contact."
            );

            return;

        }


        try {

            messageSendBtn.disabled =
                true;


            messageSendBtn.innerHTML = `

                <i class="fas fa-spinner fa-spin"></i>

                Sending...

            `;


            const response =
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
                            JSON.stringify({

                                content:
                                    content,

                                chatId:
                                    selectedChatForShare._id

                            })

                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to send message."
                );

            }


            // =================================
            // SUCCESS
            // =================================

            closeMessageModal();

            closeShareContactModal();

            refreshChats();


            showVibeToast(
    "Message sent successfully!",
    "success"
);
        }

        catch (error) {

            console.error(
                "Welcome share message error:",
                error
            );


            showVibeToast(
    error.message ||
    "Unable to send message.",
    "error"
);


            messageSendBtn.disabled =
                false;


            messageSendBtn.innerHTML = `

                <i class="fas fa-paper-plane"></i>

                Send

            `;

        }

    }
);


// =====================================
// ENTER TO SEND
// =====================================

messageInputModal.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            messageSendBtn.click();

        }

    }
);

        }
    );

}
// =========================================

// =========================================
// BROWSER BACK BUTTON - CUSTOM LOGOUT
// =========================================

(function () {

    history.pushState(
        {
            vibechat: true
        },
        "",
        window.location.href
    );


    function showBrowserLogoutModal() {

        const existing =
            document.getElementById(
                "browserLogoutModal"
            );

        if (existing) {
            return;
        }


        const modal =
            document.createElement("div");

        modal.id =
            "browserLogoutModal";

        modal.className =
            "browser-logout-overlay";


        modal.innerHTML = `

            <div class="browser-logout-modal">

                <div class="browser-logout-icon">
                    <i class="fas fa-sign-out-alt"></i>
                </div>


                <h3>
                    Logout from VibeChat?
                </h3>


                <p>
                    Are you sure you want to logout
                    from your account?
                </p>


                <div class="browser-logout-actions">

                    <button
                        type="button"
                        id="browserLogoutCancel"
                        class="browser-logout-cancel"
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        id="browserLogoutConfirm"
                        class="browser-logout-confirm"
                    >
                        Logout
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        document
            .getElementById(
                "browserLogoutCancel"
            )
            .addEventListener(
                "click",
                () => {

                    modal.remove();

                    history.pushState(
                        {
                            vibechat: true
                        },
                        "",
                        window.location.href
                    );

                }
            );


        document
            .getElementById(
                "browserLogoutConfirm"
            )
            .addEventListener(
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


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    modal.remove();

                    history.pushState(
                        {
                            vibechat: true
                        },
                        "",
                        window.location.href
                    );

                }

            }
        );

    }


    window.addEventListener(
        "popstate",
        function () {

            showBrowserLogoutModal();

        }
    );

})();

