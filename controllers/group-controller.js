const { Travel, User, UserTravelConn, Item, ItemDetail } = require("../models");

const travelController = {
  getTravels: async (req, res, next) => {
    try {
      const currentUser = req.user
      console.log(currentUser)
      const travels = await Travel.findAll({
        include: [
          {
            model: User,
            as: "groupMembers",
          },
        ],
        nest: true,
      });
      const travelsWithCurrentUser = travels.filter((travel) =>
        travel.groupMembers.some((member) => member.id === currentUser.id)
      );
      res.json(travelsWithCurrentUser);
    } catch (err) {
      console.log(err)
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  addTravel: async (req, res, next) => {
    try {
      const { name, members } = req.body;
      if (!name) throw new Error("請定義行程名稱!");
      // if (members.length === 0) throw new Error("至少邀請一位加入!");
      const newTravel = await Travel.create({
        name,
        status: false,
        redirect: false,
        archive: false,
      });
      // await members.forEach((user) => {
      //   UserTravelConn.create({
      //     userId: user.value,
      //     travelId: newTravel.id,
      //     net: 0,
      //   });
      // });
      return res.json({
        status: "success",
        message: "創建行程成功!",
        result:{id:newTravel.id}
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  getTravel: async (req, res, nest) => {
    try {
      const travelId = req.params.groupId;
      const travelData = await Travel.findByPk(travelId, {
        include: [
          {
            model: Item,
            include: [
              {
                model: ItemDetail,
                where: { payer: true },
                include: [
                  {
                    model: User,
                  },
                ],
              },
            ],
          },
        ],
      });
      return res.json(travelData);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  getTravelMembers: async (req, res, next) => {
    try {
      const travelId = req.params.groupId
      const travel = await Travel.findByPk(travelId, {
        include: [
          {
            model: User,
            as: "groupMembers",
          },
        ],
      });
      const updatedGroupMembers = travel.groupMembers.map((user) => {
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
      });
      // console.log(updatedGroupMembers)
      return res.json(updatedGroupMembers);
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = travelController;
