const { Travel, User, UserTravelConn } = require("../models");
const { Sequelize } = require("sequelize");

const TravelController = {
  getTravels: async (req, res, next) => {
    try {
      const currentUser = req.user;
      console.log("currentUser", currentUser);
      const travels = await Travel.findAll({
        include: [
          {
            model: User,
            as: "groupMembers",
          },
        ],
        nest:true,
      });
      console.log(travels);
      const travelsWithCurrentUser = travels.filter((travel) =>
        travel.groupMembers.some((member) => member.id === 1)
      );
      res.json(travelsWithCurrentUser);
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  addTravel: async (req, res, next) => {
    try {
      const { name, members } = req.body;
      console.log("formData", name, members);
      if (!name) throw new Error("請定義行程名稱!");
      if (members.length === 0) throw new Error("至少邀請一位加入!");
      const newTravel = await Travel.create({
        name,
        status: false,
        redirect: false,
        archive: false,
      });
      await members.forEach((user) => {
        UserTravelConn.create({
          userId: user.value,
          travelId: newTravel.id,
          net: 0,
        });
      });
      res.json({
        status: "success",
        message: "創建行程成功!",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};

module.exports = TravelController;
