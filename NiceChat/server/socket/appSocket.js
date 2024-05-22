const ioSocket = require("socket.io");
const connectedUsers = {};

exports.createSocket = (server) => {
  const io = new ioSocket.Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on('join-room', (userId) => {
      socket.join(userId);
      connectedUsers[userId] = socket.id;
      io.emit('online-users', Object.keys(connectedUsers));
    });

    socket.on("clientEvent", ({ senderId, receiverId, message }) => {
      const senderSocket = connectedUsers[senderId];
      const receiverSocket = connectedUsers[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("nodeEvent", message);
      }
      if (senderSocket) {
        io.to(senderSocket).emit("nodeEvent", message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      const disconnectedUser = Object.entries(connectedUsers).find(([_, socketId]) => socketId === socket.id);
      if (disconnectedUser) {
        delete connectedUsers[disconnectedUser[0]];
        io.emit('online-users', Object.keys(connectedUsers));
      }
    });
  });
};
