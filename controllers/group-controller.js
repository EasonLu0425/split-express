const {
  Travel,
  User,
  UserTravelConn,
  Item,
  ItemDetail,
  Result,
} = require("../models");

const travelController = {
  getTravels: async (req, res, next) => {
    try {
      const currentUser = req.user;
      const travels = await Travel.findAll({
        include: [
          {
            model: User,
            as: "groupMembers",
            attributes: { exclude: ["password"] },
          },
        ],
        nest: true,
      });
      const travelsWithCurrentUser = travels.filter((travel) =>
        travel.groupMembers.some((member) => member.id === currentUser.id)
      );
      res.json({
        status: "success",
        result: travelsWithCurrentUser,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  addTravel: async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) throw new Error("請定義行程名稱!");
      const newTravel = await Travel.create({
        name,
        status: false,
        redirect: false,
        archive: false,
      });
      return res.json({
        status: "success",
        message: "創建行程成功!",
        result: { id: newTravel.id },
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
                    attributes: { exclude: ["password"] },
                  },
                ],
              },
            ],
          },
        ],
        order: [[{ model: Item }, "item_time", "DESC"]],
      });
      

      return res.json({
        status: "success",
        result: travelData,
      });
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
      const travelId = req.params.groupId;
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
      return res.json({
        status: "success",
        result: updatedGroupMembers,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  resetGroupRedirect: async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const groupData = await Travel.findByPk(groupId);
      groupData.update({
        redirect: false,
      });
      const resultData = await Result.findAll({
        where: { travelId: groupId },
      });
      if (resultData.length > 0) {
        for (const result of resultData) {
          await result.destroy();
        }
      }
      res.json({
        status: "success",
        message: "重設redirect與刪除result成功",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  putArchive: async (req, res) => {
    try {
      const groupId = req.params.groupId
      const groupData = await Travel.findByPk(groupId)
      groupData.update({archive: true})
      return res.json ({
        status:'success',
        message:'成功封存此行程'
      })
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};

module.exports = travelController;
