const { Travel, User, UserTravelConn, Item, ItemDetail } = require("../models");

const userGroupConnController = {
  addMemberToGroup: async (req, res) => {
    try {
      const { memberId, groupId } = req.body;
      await UserTravelConn.create({
        userId: memberId,
        travelId: groupId,
        net: 0,
      });
      res.json({
        status: "success",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  getOverview: async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const connData = await UserTravelConn.findAll({
        where: { travelId: groupId },
        include: [
          { model: User, as: "user", attributes: { exclude: ["password"] } },
          { model: Travel, as: "travel" },
        ],
      });
      const netData = {
        groupName: connData[0].travel.name,
        groupArchive: connData[0].travel.archive,
        overView: connData.map((data) => {
          return {
            userId: data.userId,
            userName: data.user.name,
            userNet: data.net,
          };
        }),
      };

      res.json({
        status: "success",
        result: netData,
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

module.exports = userGroupConnController;
