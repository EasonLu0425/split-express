const { Travel, User, UserTravelConn, Item, ItemDetail } = require("../models");

const itemController = {
  getItem: async (req, res, next) => {
    try {
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
          {
            model: User,
            as: "groupMembers",
            attributes: { exclude: ["password"] },
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
        groupRedirect:travelData.redirect,
        groupArchive: travelData.archive,
        groupMembers: travelData.groupMembers,
        itemName: itemData.name,
        amount: itemData.amount,
        itemTime: itemData.itemTime,
        users,
      };
      res.json({
        status: "success",
        result: jsonData,
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  editItem: async (req, res, next) => {
    try {
      console.log("editItem!");
      const itemId = req.params.itemId;
      const formData = req.body;
      const item = await Item.findByPk(itemId);
      item.update({
        name: formData.itemName,
        amount: formData.itemAmount,
        itemTime: formData.itemTime,
      });

      return res.json({
        status: "success",
        message: "修改成功!",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  addItem: async (req, res, next) => {
    try {
      console.log("addItem!");
      const formData = req.body;
      const travelId = req.params.groupId;
      const newItem = await Item.create({
        name: formData.itemName,
        amount: formData.itemAmount,
        itemTime: formData.itemTime,
        travelId,
      });

      return res.json({
        status: "success",
        message: "成功建立項目!",
        result: { id: newItem.id },
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  deleteItem: async (req, res) => {
    try {
      const travelId = req.params.groupId;
      const itemId = req.params.itemId;
      const deletedItem = await Item.findByPk(itemId);
      // const deletedItemDetails = await ItemDetail.findAll({
      //   where: { itemId },
      // });
      await deletedItem.destroy();
      // for (const itemDetail of deletedItemDetails) {
      //   await itemDetail.destroy();
      // }
      return res.json({
        status: "success",
        message: "再見了，我的帳單",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};

module.exports = itemController;
