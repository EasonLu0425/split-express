const { User } = require("../models");
let onlineUsers = [];

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("socket connected");

    socket.on("login", async (data) => {
      const userFilter = onlineUsers.find(
        (ou) => ou.currentUserId === data.currentUserId
      );
      if (!userFilter) {
        onlineUsers.push(data);
      }
      console.log("online USer", onlineUsers);
    });

    socket.on("notificationToServer", async (data) => {
      data.receiverIds.forEach(id => {
        const receiver = onlineUsers.filter(user=> Number(user.currentUserId) === id)
        if (receiver.length > 0) {
          io.to(receiver[0].socketId).emit("notificationToClient");
        }
      });
    });

    socket.on("logout", (data) => {
      onlineUsers = onlineUsers.filter(
        (ou) => ou.currentUserId !== data.currentUserId
      );
      console.log("logoutOnlineUser", onlineUsers);
    });

    socket.on("disconnect", () => {
      console.log("disconnection");
    });
  });
};
