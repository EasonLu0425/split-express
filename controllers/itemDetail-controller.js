const { Travel, User, UserTravelConn, Item, ItemDetail } = require("../models");

const itemDetailController = {
  addItemDetails: async (req, res) => {
    try {
      const formData = req.body;
      const itemId = req.params.itemId
      await formData.payer.forEach((payer) => {
        ItemDetail.create({
          userId: payer.id,
          itemId: itemId,
          amount: Number(payer.amount),
          payer: true,
        });
      });
      await formData.ower.forEach((ower) => {
        ItemDetail.create({
          userId: ower.id,
          itemId: itemId,
          amount: Number(ower.amount),
          payer: false,
        });
      });
      return res.json({
        status:'success',
        message:'創建項目細節成功!',
      })
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
      const formData = req.body;
      const itemDetails = await ItemDetail.findAll({
        where: { itemId },
      });
      for (const itemDetail of itemDetails) {
        await itemDetail.destroy();
      }
      await formData.payer.forEach((payer) => {
        ItemDetail.create({
          userId: payer.id,
          itemId,
          amount: Number(payer.amount),
          payer: true,
        });
      });
      await formData.ower.forEach((ower) => {
        ItemDetail.create({
          userId: ower.id,
          itemId,
          amount: Number(ower.amount),
          payer: false,
        });
      });
      return res.json({
        status:'success',
        message:'編輯details成功'
      })
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
};

module.exports = itemDetailController;
