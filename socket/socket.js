const Message = require("../models/Message");

const {
    setUserOnline,
    setUserOffline,
} = require("./socketManager");


// =========================================
// TIC TAC TOE GAME ROOMS
// =========================================

const gameRooms = {};


// =========================================
// SOCKET HANDLER
// =========================================

const socketHandler = (io) => {

    io.on(
        "connection",
        (socket) => {

            console.log(
                "🟢 Socket Connected :",
                socket.id
            );


            // =========================================
            // SETUP
            // =========================================

            socket.on(
                "setup",
                (userData) => {

                    if (
                        !userData ||
                        !userData._id
                    ) {

                        return;

                    }

                    socket.userId =
                        userData._id.toString();


                    socket.join(
                        socket.userId
                    );


                    setUserOnline(
                        socket.userId,
                        socket.id
                    );


                    socket.emit(
                        "connected"
                    );


                    io.emit(
                        "user online",
                        {
                            _id:
                                userData._id,

                            name:
                                userData.name,
                        }
                    );


                    console.log(
                        "✅ User Setup :",
                        userData.name
                    );

                }
            );


            // =========================================
            // JOIN CHAT
            // =========================================

            socket.on(
                "join chat",
                (chatId) => {

                    if (!chatId) {

                        return;

                    }


                    socket.join(
                        chatId
                    );


                    console.log(
                        "📥 Joined Chat :",
                        chatId
                    );

                }
            );


            // =========================================
            // TIC TAC TOE - GAME INVITE
            // =========================================

            socket.on(
                "game:invite",
                ({
                    to,
                    from,
                    fromName,
                    game
                }) => {

                    if (
                        !to ||
                        !from
                    ) {

                        return;

                    }


                    console.log(
                        `🎮 Game Invite: ${from} → ${to}`
                    );


                    io.to(
                        to.toString()
                    ).emit(
                        "game:incoming-invite",
                        {

                            from:
                                from.toString(),

                            fromName:
                                fromName ||
                                "A friend",

                            game:
                                game ||
                                "tic-tac-toe"

                        }
                    );

                }
            );


            /// =========================================
// TIC TAC TOE - ACCEPT INVITE
// =========================================

socket.on(
    "game:accept",
    ({
        to,
        from,
        game
    }) => {
console.log(
            "🎮 GAME ACCEPT RECEIVED:",
            {
                to,
                from,
                game
            }
        );
        if (
            !to ||
            !from ||
            game !== "tic-tac-toe"
        ) {

            return;

        }


        const inviterId =
            to.toString();

        const accepterId =
            from.toString();


        // =====================================
        // CREATE GAME ID
        // =====================================

        const gameId =
            "tic_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .slice(2, 8);


        // =====================================
        // CREATE GAME ROOM
        // =====================================

        gameRooms[gameId] = {

            gameId,

            playerX:
                inviterId,

            playerO:
                accepterId,

            board: [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                ""
            ],

            currentTurn:
                "X",

            status:
                "countdown"

        };


        console.log(
            `🎮 Tic Tac Toe Room Created: ${gameId}`
        );


        // =====================================
        // NOTIFY INVITER
        // =====================================

        io.to(
            inviterId
        ).emit(
            "game:invite-accepted",
            {

                gameId,

                from:
                    accepterId,

                game:
                    "tic-tac-toe"

            }
        );


        // =====================================
        // JOIN INVITER TO GAME ROOM
        // =====================================

        io.to(
            inviterId
        ).socketsJoin(
            gameId
        );


        // =====================================
        // JOIN ACCEPTOR TO GAME ROOM
        // =====================================

        io.to(
            accepterId
        ).socketsJoin(
            gameId
        );


        // =====================================
        // SEND COUNTDOWN
        // =====================================
console.log(
    "🎮 SENDING COUNTDOWN:",
    {
        gameId,
        inviterId,
        accepterId
    }
);
        io.to(
            gameId
        ).emit(
            "game:start-countdown",
            {

                gameId,

                playerX:
                    inviterId,

                playerO:
                    accepterId,

                currentTurn:
                    "X",

                countdown:
                    3

            }
        );


        // =====================================
        // START GAME AFTER 3 SECONDS
        // =====================================

        setTimeout(
            () => {

                const room =
                    gameRooms[
                        gameId
                    ];


                if (!room) {

                    return;

                }


                if (
                    room.status !==
                    "countdown"
                ) {

                    return;

                }


                room.status =
                    "playing";


                io.to(
                    gameId
                ).emit(
                    "game:started",
                    {

                        gameId,

                        playerX:
                            room.playerX,

                        playerO:
                            room.playerO,

                        board:
                            [
                                ...room.board
                            ],

                        currentTurn:
                            room.currentTurn,

                        status:
                            "playing"

                    }
                );


                console.log(
                    `🎮 Tic Tac Toe Started: ${gameId}`
                );


            },
            3000
        );

    }
);


            // =========================================
            // TIC TAC TOE - MOVE
            // =========================================

            socket.on(
                "game:move",
                ({
                    gameId,
                    index
                }) => {

                    const room =
                        gameRooms[
                            gameId
                        ];


                    if (
                        !room ||
                        room.status !==
                            "playing"
                    ) {

                        return;

                    }


                    const playerId =
                        socket.userId;


                    let player;


                    if (
                        playerId ===
                        room.playerX
                    ) {

                        player = "X";

                    }
                    else if (
                        playerId ===
                        room.playerO
                    ) {

                        player = "O";

                    }
                    else {

                        return;

                    }


                    // =====================================
                    // CHECK TURN
                    // =====================================

                    if (
                        room.currentTurn !==
                        player
                    ) {

                        return;

                    }


                    // =====================================
                    // CHECK CELL
                    // =====================================

                    if (
                        typeof index !==
                            "number" ||
                        index < 0 ||
                        index > 8
                    ) {

                        return;

                    }


                    if (
                        room.board[index] !==
                        ""
                    ) {

                        return;

                    }


                    // =====================================
                    // APPLY MOVE
                    // =====================================

                    room.board[index] =
                        player;


                    // =====================================
                    // WINNING PATTERNS
                    // =====================================

                    const winningPatterns = [

                        [0, 1, 2],
                        [3, 4, 5],
                        [6, 7, 8],

                        [0, 3, 6],
                        [1, 4, 7],
                        [2, 5, 8],

                        [0, 4, 8],
                        [2, 4, 6]

                    ];


                    let winner =
                        null;


                    let winningPattern =
                        null;


                    for (
                        const pattern
                        of winningPatterns
                    ) {

                        const [
                            a,
                            b,
                            c
                        ] =
                            pattern;


                        if (
                            room.board[a] &&
                            room.board[a] ===
                                room.board[b] &&
                            room.board[a] ===
                                room.board[c]
                        ) {

                            winner =
                                room.board[a];

                            winningPattern =
                                pattern;

                            break;

                        }

                    }


                    // =====================================
                    // DRAW
                    // =====================================

                    const draw =
                        !winner &&
                        room.board.every(
                            cell =>
                                cell !== ""
                        );


                    // =====================================
                    // GAME FINISHED
                    // =====================================

                    if (
                        winner ||
                        draw
                    ) {

                        room.status =
                            "finished";


                        io.to(
                            gameId
                        ).emit(
                            "game:state",
                            {

                                gameId,

                                board:
                                    room.board,

                                currentTurn:
                                    null,

                                winner:
                                    winner,

                                draw:
                                    draw,

                                winningPattern:
                                    winningPattern,

                                status:
                                    "finished"

                            }
                        );


                        console.log(
                            `🏆 Tic Tac Toe Finished: ${gameId}`
                        );


                        return;

                    }


                    // =====================================
                    // NEXT TURN
                    // =====================================

                    room.currentTurn =
                        player === "X"
                            ? "O"
                            : "X";


                    io.to(
                        gameId
                    ).emit(
                        "game:state",
                        {

                            gameId,

                            board:
                                room.board,

                            currentTurn:
                                room.currentTurn,

                            winner:
                                null,

                            draw:
                                false,

                            winningPattern:
                                null,

                            status:
                                "playing"

                        }
                    );

                }
            );


            // =========================================
            // TIC TAC TOE - NEW GAME
            // =========================================

            socket.on(
                "game:restart",
                ({
                    gameId
                }) => {

                    const room =
                        gameRooms[
                            gameId
                        ];


                    if (!room) {

                        return;

                    }


                    if (
                        socket.userId !==
                            room.playerX &&
                        socket.userId !==
                            room.playerO
                    ) {

                        return;

                    }


                    room.board = [

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


                    room.currentTurn =
                        "X";


                    room.status =
                        "playing";


                    io.to(
                        gameId
                    ).emit(
                        "game:restarted",
                        {

                            gameId,

                            playerX:
                                room.playerX,

                            playerO:
                                room.playerO,

                            board:
                                room.board,

                            currentTurn:
                                room.currentTurn,

                            status:
                                "playing"

                        }
                    );

                }
            );


            // =========================================
            // TIC TAC TOE - LEAVE
            // =========================================

            socket.on(
                "game:leave",
                ({
                    gameId
                }) => {

                    const room =
                        gameRooms[
                            gameId
                        ];


                    if (!room) {

                        return;

                    }


                    io.to(
                        gameId
                    ).emit(
                        "game:opponent-left"
                    );


                    delete gameRooms[
                        gameId
                    ];

                }
            );


            // =========================================
            // TIC TAC TOE - DECLINE INVITE
            // =========================================

            socket.on(
                "game:decline",
                ({
                    to,
                    from,
                    game
                }) => {

                    if (
                        !to ||
                        !from
                    ) {

                        return;

                    }


                    console.log(
                        `🎮 Game Declined: ${from} → ${to}`
                    );


                    io.to(
                        to.toString()
                    ).emit(
                        "game:invite-declined",
                        {

                            from:
                                from.toString(),

                            game:
                                game ||
                                "tic-tac-toe"

                        }
                    );

                }
            );


            // =========================================
            // VOICE CALL - START
            // =========================================

            socket.on(
                "call:user",
                ({
                    to,
                    from,
                    callerName
                }) => {

                    if (
                        !to ||
                        !from
                    ) {

                        return;

                    }


                    console.log(
                        `📞 Voice Call: ${from} → ${to}`
                    );


                    io.to(
                        to.toString()
                    ).emit(
                        "call:incoming",
                        {

                            from:
                                from.toString(),

                            callerName:
                                callerName ||
                                "User"

                        }
                    );

                }
            );


            // =========================================
            // VOICE CALL - ACCEPT
            // =========================================

            socket.on(
                "call:accepted",
                ({
                    to,
                    from
                }) => {

                    if (
                        !to ||
                        !from
                    ) {

                        return;

                    }


                    console.log(
                        `✅ Call Accepted: ${from} → ${to}`
                    );


                    io.to(
                        to.toString()
                    ).emit(
                        "call:accepted",
                        {

                            from:
                                from.toString()

                        }
                    );

                }
            );


            // =========================================
            // VOICE CALL - REJECT
            // =========================================

            socket.on(
                "call:rejected",
                ({
                    to,
                    from
                }) => {

                    if (
                        !to ||
                        !from
                    ) {

                        return;

                    }


                    console.log(
                        `❌ Call Rejected: ${from} → ${to}`
                    );


                    io.to(
                        to.toString()
                    ).emit(
                        "call:rejected",
                        {

                            from:
                                from.toString()

                        }
                    );

                }
            );


            // =========================================
            // WEBRTC OFFER
            // =========================================

            socket.on(
                "call:offer",
                ({
                    to,
                    offer
                }) => {

                    if (
                        !to ||
                        !offer
                    ) {

                        return;

                    }


                    console.log(
                        `📤 WebRTC Offer → ${to}`
                    );


                    io.to(
                        to.toString()
                    ).emit(
                        "call:offer",
                        {

                            from:
                                socket.userId,

                            offer

                        }
                    );

                }
            );


            // =========================================
            // WEBRTC ANSWER
            // =========================================

            socket.on(
                "call:answer",
                ({
                    to,
                    answer
                }) => {

                    if (
                        !to ||
                        !answer
                    ) {

                        return;

                    }


                    console.log(
                        `📥 WebRTC Answer → ${to}`
                    );


                    io.to(
                        to.toString()
                    ).emit(
                        "call:answer",
                        {

                            from:
                                socket.userId,

                            answer

                        }
                    );

                }
            );


            // =========================================
            // WEBRTC ICE CANDIDATE
            // =========================================

            socket.on(
                "call:ice-candidate",
                ({
                    to,
                    candidate
                }) => {

                    if (
                        !to ||
                        !candidate
                    ) {

                        return;

                    }


                    console.log(
                        `🧊 ICE Candidate → ${to}`
                    );


                    io.to(
                        to.toString()
                    ).emit(
                        "call:ice-candidate",
                        {

                            from:
                                socket.userId,

                            candidate

                        }
                    );

                }
            );


            // =========================================
            // TYPING
            // =========================================

            socket.on(
                "typing",
                (chatId) => {

                    if (!chatId) {

                        return;

                    }


                    socket
                        .to(chatId)
                        .emit(
                            "typing"
                        );

                }
            );


            socket.on(
                "stop typing",
                (chatId) => {

                    if (!chatId) {

                        return;

                    }


                    socket
                        .to(chatId)
                        .emit(
                            "stop typing"
                        );

                }
            );


            // =========================================
            // MESSAGE DELIVERED
            // =========================================

            socket.on(
                "message delivered",
                async ({
                    messageId
                }) => {

                    try {

                        let message =
                            await Message
                                .findById(
                                    messageId
                                )
                                .populate(
                                    "sender",
                                    "-password"
                                )
                                .populate({
                                    path:
                                        "chat",

                                    populate: {
                                        path:
                                            "users",

                                        select:
                                            "-password"
                                    }
                                });


                        if (!message) {

                            return;

                        }


                        if (
                            !message.delivered
                        ) {

                            message.delivered =
                                true;

                            message.deliveredAt =
                                new Date();

                            await message.save();

                        }


                        io.to(
                            message.sender
                                ._id
                                .toString()
                        ).emit(
                            "message delivered",
                            message
                        );

                    }

                    catch (err) {

                        console.log(
                            "Message Delivered Error:",
                            err.message
                        );

                    }

                }
            );


            // =========================================
            // MESSAGE SEEN
            // =========================================

            socket.on(
                "message seen",
                async ({
                    messageId,
                    userId
                }) => {

                    try {

                        let message =
                            await Message
                                .findById(
                                    messageId
                                )
                                .populate(
                                    "sender",
                                    "-password"
                                )
                                .populate({
                                    path:
                                        "chat",

                                    populate: {
                                        path:
                                            "users",

                                        select:
                                            "-password"
                                    }
                                });


                        if (!message) {

                            return;

                        }


                        if (
                            !message.seen
                        ) {

                            message.seen =
                                true;

                            message.seenBy =
                                userId;

                            message.seenAt =
                                new Date();

                            await message.save();

                        }


                        io.to(
                            message.sender
                                ._id
                                .toString()
                        ).emit(
                            "message seen",
                            message
                        );

                    }

                    catch (err) {

                        console.log(
                            "Message Seen Error:",
                            err.message
                        );

                    }

                }
            );


            // =========================================
            // VOICE CALL - END
            // =========================================

            socket.on(
                "call:ended",
                ({
                    to,
                    from
                }) => {

                    if (!to) {

                        return;

                    }


                    console.log(
                        `📴 Call Ended: ${from} → ${to}`
                    );


                    io.to(
                        to.toString()
                    ).emit(
                        "call:ended",
                        {

                            from:
                                from ||
                                socket.userId

                        }
                    );

                }
            );


            // =========================================
            // DISCONNECT
            // =========================================

            socket.on(
                "disconnect",
                () => {

                    console.log(
                        "🔴 Socket Disconnected :",
                        socket.id
                    );


                    if (!socket.userId) {

                        return;

                    }


                    setUserOffline(
                        socket.userId
                    );


                    io.emit(
                        "user offline",
                        {

                            _id:
                                socket.userId

                        }
                    );


                }
            );

        }
    );

};


// =========================================
// EXPORT
// =========================================

module.exports =
    socketHandler;