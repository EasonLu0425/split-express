module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("login", async () => {});

    socket.on("notification", async ({data}) => {
      
    });
  });
};
