let activeUsers = [];

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    // Add a new user
    socket.on('addUser', (userId) => {
      if (!activeUsers.some((user) => user.userId === userId)) {
        activeUsers.push({ userId, socketId: socket.id });
      }
      io.emit('getUsers', activeUsers);
    });

    // Send a message
    socket.on('sendMessage', (data) => {
      const { recipientId } = data;
      const user = activeUsers.find((user) => user.userId === recipientId);
      if (user) {
        io.to(user.socketId).emit('getMessage', data);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      io.emit('getUsers', activeUsers);
    });
  });
};

module.exports = socketHandler;
