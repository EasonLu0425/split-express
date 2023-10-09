const { Notification, User, Travel } = require("../models");

const notificationController = {
  getNotifications: async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const notis = await Notification.findAll({
        where: { receiverId: currentUserId },
        include: [{ model: Travel }, { model: User, as: "sender" }],
        order: [["createdAt", "DESC"]],
        limit: 10,
      });
      const formData = notis.map((noti) => {
        if (noti.type === 101) {
          return {
            id: noti.id,
            text: noti.text,
            read: noti.read,
            time: noti.createdAt,
            type: noti.type,
          };
        } else if (noti.type === 201) {
          return {
            id: noti.id,
            text: `${noti.sender.name}邀請您至${noti.Travel.name}`,
            read: noti.read,
            time: noti.createdAt,
            type: noti.type,
            groupId: noti.Travel.id,
          };
        }
        // else if (noti.type === 301) {
        //   return {
        //     text: `${noti.sender.name}修改了${noti.Travel.name}的`
        //   }
        // }
      });
      res.json({
        status: "success",
        message: "",
        result: formData,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  readNotification: async (req, res) => {
    try {
      const { notiId } = req.body;
      const theNoti = await Notification.findByPk(notiId);
      theNoti.update({
        ...theNoti,
        read: true,
      });
      res.json({
        status: "success",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  addNotification: async (req, res) => {
    try {
      const addNotiData = req.body;
      const receivers = addNotiData.receivers;
      if (addNotiData.type === 201) {
        await receivers.forEach((receiver) => {
          Notification.create({
            receiverId: receiver.id,
            senderId: req.user.id,
            type: addNotiData.type,
            text: "邀請您至",
            read: false,
            travelId: addNotiData.group.id,
          });
        });
      }

      res.json({
        status: "success",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};

module.exports = notificationController;
