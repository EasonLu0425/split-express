"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.Travel, { foreignKey: "travelId" });
      Notification.belongsTo(models.User, {
        foreignKey: "receiverId",
        as: "receiver",
      });
      Notification.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
      });
    }
  }
  Notification.init(
    {
      receiverId: DataTypes.INTEGER,
      text: DataTypes.STRING,
      type: DataTypes.INTEGER,
      read: DataTypes.BOOLEAN,
      travelId: DataTypes.INTEGER,
      senderId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "Notifications",
      underscored: true,
    }
  );
  return Notification;
};
