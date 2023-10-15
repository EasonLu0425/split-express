const {
  Travel,
  User,
  UserTravelConn,
  Item,
  ItemDetail,
  Result,
} = require("../models");

const resultController = {
  createResult: async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const connData = await UserTravelConn.findAll({
        where: { travelId: groupId },
        include: [
          { model: User, as: "user", attributes: { exclude: ["password"] } },
          { model: Travel, as: "travel" },
        ],
        order: [["net", "DESC"]],
      });
      console.log("connData", connData);
      const userData = connData.map((data) => {
        return {
          userId: data.userId,
          userName: data.user.name,
          userNet: data.net,
        };
      });
      console.log("userData", userData);
      const settlements = [];

      const positiveUsers = userData.filter((user) => user.userNet > 0);
      const negativeUsers = userData.filter((user) => user.userNet < 0);

      for (const negativeUser of negativeUsers) {
        let remainingAmount = Math.abs(negativeUser.userNet);

        for (const positiveUser of positiveUsers) {
          if (remainingAmount <= 0) {
            break;
          }

          const amountToReceive = Math.min(
            positiveUser.userNet,
            remainingAmount
          );

          // 更新用户的net值
          remainingAmount -= amountToReceive;
          positiveUser.userNet -= amountToReceive;

          // 记录结算
          settlements.push({
            payerId: positiveUser.userId, //該收錢的人
            owerId: negativeUser.userId, // 該付錢的人
            amount: amountToReceive,
          });
        }
      }

      for (const settlement of settlements) {
        await Result.create({
          travelId: groupId,
          payerId: settlement.payerId, // 該收錢的人
          owerId: settlement.owerId, // 該付錢的人
          amount: settlement.amount,
          status: false,
        });
      }
      const theGroup = await Travel.findByPk(groupId);
      theGroup.update({ redirect: true });

      res.json({
        status: "success",
        message: "成功建立新結帳紀錄",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  getResult: async (req, res) => {
    try {
      const groupId = req.params.groupId;
      const resultData = await Result.findAll({
        where: { travelId: groupId },
        include: [
          { model: User, as: "ower", attributes: { exclude: ["password"] } },
          { model: User, as: "payer", attributes: { exclude: ["password"] } },
        ],
      });
      res.json({
        status: "success",
        result: resultData,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  switchResultStatus: async (req, res) => {
    try {
      const resultId = req.body.id;
      const groupId = req.params.groupId;
      const resultData = await Result.findByPk(resultId);

      // 若是還未支付變成已支付，該收錢的減少net收錢數，該付錢的減少該付錢數
      // 若是已支付取消支付，該收錢的增加回net，該付錢的增加付錢數
      if (!resultData.stauts) {
        //該收錢的人要減少net
        const updatePayerConnNet = await UserTravelConn.findOne({
          where: { userId: resultData.payerId, travelId: groupId },
        });
        updatePayerConnNet.update({
          net: Number(updatePayerConnNet.net) - Number(resultData.amount),
        });
        console.log("payerNet", updatePayerConnNet);

        //該付錢的人要增加net，減少負數
        const updateOwerConnNet = await UserTravelConn.findOne({
          where: { userId: resultData.owerId, travelId: groupId },
        });
        console.log("owerNet", updateOwerConnNet);
        updateOwerConnNet.update({
          net: Number(updateOwerConnNet.net) + Number(resultData.amount),
        });
      } else {
        //該收錢的人要加回net
        const updatePayerConnNet = await UserTravelConn.findOne({
          where: { userId: resultData.payerId, travelId: groupId },
        });
        updatePayerConnNet.update({
          net: Number(updatePayerConnNet.net) + Number(resultData.amount),
        });
        console.log("payerNet", updatePayerConnNet);

        //該付錢的人要減回net，增加負數
        const updateOwerConnNet = await UserTravelConn.findOne({
          where: { userId: resultData.owerId, travelId: groupId },
        });
        console.log("owerNet", updateOwerConnNet);
        updateOwerConnNet.update({
          net: Number(updateOwerConnNet.net) - Number(resultData.amount),
        });
      }

      resultData.update({
        status: !resultData.status,
      });
      res.json({
        status: "success",
        message: "成功修改支付狀況",
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

module.exports = resultController;
