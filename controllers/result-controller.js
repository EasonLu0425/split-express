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
        order: [["net", "ASC"]],
      });
      const userData = connData.map((data) => {
        return {
          userId: data.userId,
          userName: data.user.name,
          userNet: data.net,
        };
      });
      const settlements = []; //分帳紀錄
      const sortedUsers = userData.sort(
        (a, b) => Number(b.userNet) - Number(a.userNet)
      );

      for (const positiveUser of sortedUsers) {
        if (positiveUser.userNet <= 0) {
          break;
        }

        for (const negativeUser of sortedUsers) {
          if (negativeUser.userNet >= 0) {
            continue;
          }

          // 算正數的net應收金額
          const amountToReceive = Math.min(
            Math.abs(positiveUser.userNet),
            Math.abs(negativeUser.userNet)
          );

          // 更新用戶的net值
          positiveUser.userNet -= amountToReceive;
          negativeUser.userNet += amountToReceive;

          // 寫到settlement裡面紀錄
          settlements.push({
            payerId: negativeUser.userId,
            owerId: positiveUser.userId,
            amount: amountToReceive,
          });
        }
      }

      for (const settlement of settlements) {
        await Result.create({
          travelId: groupId,
          owerId: settlement.owerId,
          payerId: settlement.payerId,
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
        status:'success',
        result:resultData
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  },
  switchResultStatus : async(req, res) => {
    try {
      const groupId = req.params.groupId
      const resultId = req.body.id
      const resultData = await Result.findByPk(resultId)
      resultData.update({
        status: !resultData.status
      })
      res.json({
        status:'success',
        message:'成功修改支付狀況'
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
  
};

module.exports = resultController;
