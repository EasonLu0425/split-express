const { Travel, User, UserTravelConn, Item, ItemDetail, Result } = require("../models");
const { Op } = require("sequelize");

const itemDetailController = {
  addItemDetails: async (req, res) => {
    try {
      const formData = req.body;
      const itemId = req.params.itemId;
      const groupId = req.params.groupId;
      for (const payer of formData.payer) {
        await ItemDetail.create({
          userId: payer.id,
          itemId: itemId,
          amount: Number(payer.amount),
          payer: true,
        });

        const usersNet = await UserTravelConn.findOne({
          where: {
            userId: payer.id,
            travelId: groupId,
          },
        });
        const updatedNet = Number(usersNet.net) + Number(payer.amount);
        await usersNet.update({
          net: updatedNet,
        });
      }
      for (const ower of formData.ower) {
        await ItemDetail.create({
          userId: ower.id,
          itemId: itemId,
          amount: Number(ower.amount),
          payer: false,
        });

        const usersNet = await UserTravelConn.findOne({
          where: {
            userId: ower.id,
            travelId: groupId,
          },
        });

        const updatedNet = Number(usersNet.net) - Number(ower.amount);
        await usersNet.update({
          net: updatedNet,
        });
      }

      return res.json({
        status: "success",
        message: "創建項目細節成功!",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  editItemDetails: async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const groupId = req.params.groupId;
      const formData = req.body;
      const itemDetails = await ItemDetail.findAll({
        where: { itemId },
      });
      for (const itemDetail of itemDetails) {
        const { userId, amount, payer } = itemDetail;

        const usersNet = await UserTravelConn.findOne({
          where: {
            userId: userId,
            travelId: groupId,
          },
        });

        if (!usersNet) {
          console.log(
            "UserTravelConn not found for userId:",
            userId,
            "travelId:",
            groupId
          );
          continue;
        }

        const updatedNet = payer
          ? Number(usersNet.net) - Number(amount)
          : Number(usersNet.net) + Number(amount);

        await usersNet.update({
          net: updatedNet,
        });

        await itemDetail.destroy();
      }

      for (const payer of formData.payer) {
        await ItemDetail.create({
          userId: payer.id,
          itemId: itemId,
          amount: Number(payer.amount),
          payer: true,
        });

        const usersNet = await UserTravelConn.findOne({
          where: {
            userId: payer.id,
            travelId: groupId,
          },
        });
        const updatedNet = Number(usersNet.net) + Number(payer.amount);
        await usersNet.update({
          net: updatedNet,
        });
      }
      for (const ower of formData.ower) {
        await ItemDetail.create({
          userId: ower.id,
          itemId: itemId,
          amount: Number(ower.amount),
          payer: false,
        });

        const usersNet = await UserTravelConn.findOne({
          where: {
            userId: ower.id,
            travelId: groupId,
          },
        });

        const updatedNet = Number(usersNet.net) - Number(ower.amount);
        await usersNet.update({
          net: updatedNet,
        });
      }
      return res.json({
        status: "success",
        message: "編輯details成功",
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  deleteItemDetails: async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const groupId = req.params.groupId;
      const itemDetails = await ItemDetail.findAll({
        where: { itemId },
      });
      for (const itemDetail of itemDetails) {
        const { userId, amount, payer } = itemDetail;
        const usersNet = await UserTravelConn.findOne({
          where: {
            userId: userId,
            travelId: groupId,
          },
        });
        if (!usersNet) {
          console.log(
            "UserTravelConn not found for userId:",
            userId,
            "travelId:",
            groupId
          );
          continue;
        }
        const updatedNet = payer
          ? Number(usersNet.net) - Number(amount)
          : Number(usersNet.net) + Number(amount);

        await usersNet.update({
          net: updatedNet,
        });
        await itemDetail.destroy();
      }
      res.json({
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
  getUserInGroupDetail: async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const userId = req.params.userId;
      const groupItems = await Travel.findByPk(groupId, {
        include:[{model:Item}]
      })
      const itemIds = []
      groupItems.Items.forEach( item => {
        itemIds.push(item.id)
      });
      const userDetails = await ItemDetail.findAll({
        where: { userId, itemId: { [Op.in]: itemIds } },
        include:[Item]
      });
      //依照ItemTime排ASC
      userDetails.sort((a, b) => {
        const timeA = a.Item.itemTime;
        const timeB = b.Item.itemTime;
        return new Date(timeA) - new Date(timeB);
      });

      const userHavePaid = await Result.findAll({
        where: {
          [Op.or]: [{ owerId: userId }, { payerId: userId }],
          status: true,
        },
      });
      res.json({
        stauts:'success',
        result:{
          details: userDetails,
          paidResult:userHavePaid
        }
      });
    } catch (err) {
       res.status(500).json({
         status: "error",
         message: err.message,
       });
    }
  },
};

module.exports = itemDetailController;
