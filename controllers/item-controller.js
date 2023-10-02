const { Travel, User, UserTravelConn, Item, ItemDetail } = require("../models");

const itemController = {
  getItem: async (req, res, next) => {
    try {
      console.log("getItem!");
      const currentUser = req.User;
      const { groupId, itemId } = req.params;
      const travelData = await Travel.findByPk(groupId, {
        include: [
          {
            model: Item,
            where: { id: itemId },
            include: [
              {
                model: ItemDetail,
                include: [
                  {
                    model: User,
                  },
                ],
              },
            ],
          },
        ],
        nest: true,
      });
      const itemData = travelData.Items[0];
      const users = itemData.ItemDetails.map((item) => {
        return {
          id: item.userId,
          name: item.User.name,
          amount: item.amount,
          payer: item.payer,
        };
      });
      const jsonData = {
        groupName: travelData.name,
        itemName: itemData.name,
        amount: itemData.amount,
        itemTime: itemData.itemTime,
        users,
      };
      res.json(jsonData);
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  editItem: (req, res, next) => {
    console.log("editItem!");
    const formData = req.body;
    console.log(formData);
  },
  addItem: (req, res, next) => {
    console.log("addItem!");
    const formData = req.body;
    console.log(formData);
  },
};

module.exports = itemController;
