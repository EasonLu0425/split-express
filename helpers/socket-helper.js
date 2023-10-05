const {User} = require('../models')
let onlineUsers = [];

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("login", async () => {
      const sessionUserId = socket.request.session.passport.user;
      const userFilter = onlineUsers.find((item) => item.id === sessionUserId);
       if (!userFilter) {
         let user = await User.findByPk(sessionUserId);
         user = user.toJSON();
         onlineUsers.push({
           id: user.id,
           name: user.name,
           account: user.account,
           avatar: user.avatar,
         });
       }
    });

    socket.on("notificationToServer", async ({data}) => {
      console.log('get Client data', data)
    });
  });
};
