"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsToMany(models.Travel, {
        through: models.UserTravelConn,
        foreignKey: "userId",
        as: "usertravels",
      });
      User.hasMany(models.ItemDetail, { foreignKey: "userId" });
      User.hasMany(models.Notification, {
        foreignKey: "receiverId",
        as: "receivedNotifications",
      });
      User.hasMany(models.Notification, {
        foreignKey: "senderId",
        as: "sentNotifications",
      });
      User.hasMany(models.Result, {
        foreignKey: "owerId",
        as: "owedResult",
      });
      User.hasMany(models.Result, {
        foreignKey: "payerId",
        as: "paidResult",
      });
    }
  }
  User.init(
    {
      account: DataTypes.STRING,
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      underscored: true,
    }
  );
  return User;
};
