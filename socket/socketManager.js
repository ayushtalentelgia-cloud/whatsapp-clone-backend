let io;

// ================= ONLINE USERS =================

const onlineUsers = {};

// Save Socket.IO instance
const setIO = (socketIO) => {

    io = socketIO;

};

// Get Socket.IO instance
const getIO = () => {

    if (!io) {

        throw new Error("Socket.IO is not initialized.");

    }

    return io;

};

// ================= ONLINE USERS =================

const setUserOnline = (userId, socketId) => {

    onlineUsers[userId] = socketId;

};

const setUserOffline = (userId) => {

    delete onlineUsers[userId];

};

const isUserOnline = (userId) => {

    return !!onlineUsers[userId];

};

const getOnlineUsers = () => {

    return onlineUsers;

};

module.exports = {

    setIO,

    getIO,

    setUserOnline,

    setUserOffline,

    isUserOnline,

    getOnlineUsers,

};