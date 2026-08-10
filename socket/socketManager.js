let io;

// =========================================
// ONLINE USERS
// =========================================

const onlineUsers = {};

// =========================================
// SET SOCKET.IO INSTANCE
// =========================================

const setIO = (socketIO) => {

    io = socketIO;

};

// =========================================
// GET SOCKET.IO INSTANCE
// =========================================

const getIO = () => {

    if (!io) {

        throw new Error("Socket.IO is not initialized.");

    }

    return io;

};

// =========================================
// SET USER ONLINE
// =========================================

const setUserOnline = (userId, socketId) => {

    if (!userId || !socketId) return;

    onlineUsers[userId] = socketId;

};

// =========================================
// SET USER OFFLINE
// =========================================

const setUserOffline = (userId) => {

    if (!userId) return;

    delete onlineUsers[userId];

};

// =========================================
// CHECK USER ONLINE
// =========================================

const isUserOnline = (userId) => {

    return Object.prototype.hasOwnProperty.call(
        onlineUsers,
        userId
    );

};

// =========================================
// GET USER SOCKET ID
// =========================================

const getSocketId = (userId) => {

    return onlineUsers[userId] || null;

};

// =========================================
// GET ALL ONLINE USERS
// =========================================

const getOnlineUsers = () => {

    return onlineUsers;

};

// =========================================
// EXPORTS
// =========================================

module.exports = {

    setIO,

    getIO,

    setUserOnline,

    setUserOffline,

    isUserOnline,

    getSocketId,

    getOnlineUsers,

};