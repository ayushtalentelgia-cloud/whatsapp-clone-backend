let io;

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

module.exports = {
    setIO,
    getIO,
};