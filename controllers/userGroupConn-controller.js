const { Travel, User, UserTravelConn, Item, ItemDetail } = require("../models");

const userGroupConnController = {
  addMemberToGroup: async (req, res) => {
    try {
      const { memberId, groupId } = req.body;
      await UserTravelConn.create({
        userId: memberId,
        travelId: groupId,
        net: 0,
      })
      res.json({
        status:'success',
      })
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};

module.exports = userGroupConnController