const { Notification, User, Travel } = require("../models");

const notificationController = {
  getNotifications: async (req, res) => {
    try {
      const currentUserId = req.user.id;
      const notis = await Notification.findAll({
        where: { receiverId: currentUserId },
        include: [{ model: Travel }, { model: User, as: "sender" }],
        order: [["createdAt", "DESC"]],
        limit: 8,
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
            type: "INVITATION",
            groupId: noti.Travel.id,
          };
        } else if (noti.type === 301) {
          return {
            id: noti.id,
            text: `${noti.sender.name}新增了一筆在${noti.Travel.name}的項目`,
            read: noti.read,
            time: noti.createdAt,
            type: "ITEM_ADD",
            groupId: noti.Travel.id,
          };
        } else if (noti.type === 302) {
          return {
            id: noti.id,
            text: `${noti.sender.name}修改了一筆在${noti.Travel.name}的項目`,
            read: noti.read,
            time: noti.createdAt,
            type: "ITEM_UPDATE",
            groupId: noti.Travel.id,
          };
        }
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
      const currentUserId = req.user.id
      const receivers = addNotiData.receiverIds.filter(
        (id) => id !== currentUserId
      );

      
      if (addNotiData.type === "INVITATION") {
        await receivers.forEach((receiver) => {
          Notification.create({
            receiverId: receiver,
            senderId: req.user.id,
            type: 201,
            text: "邀請您至",
            read: false,
            travelId: addNotiData.groupId,
          });
        });
      } else if (addNotiData.type === "ITEM_ADD") {
        await receivers.forEach((receiver) => {
          Notification.create({
            receiverId: receiver,
            senderId: req.user.id,
            type: 301,
            text: "已新增了一筆行程中的項目",
            read: false,
            travelId: addNotiData.groupId,
          });
        });
      } else if (addNotiData.type === "ITEM_UPDATE") {
         await receivers.forEach((receiver) => {
           Notification.create({
             receiverId: receiver,
             senderId: req.user.id,
             type: 302,
             text: "已修改了一筆行程中的項目",
             read: false,
             travelId: addNotiData.groupId,
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
