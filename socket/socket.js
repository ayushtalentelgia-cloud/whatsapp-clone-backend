const Message = require("../models/Message");

const {
    setUserOnline,
    setUserOffline,
} = require("./socketManager");


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


// =========================================
// TIC TAC TOE - ACCEPT INVITE
// =========================================

socket.on(
    "game:accept",
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
            `🎮 Game Accepted: ${from} → ${to}`
        );


        io.to(
            to.toString()
        ).emit(
            "game:invite-accepted",
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