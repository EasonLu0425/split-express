"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.hasMany(models.ItemDetail, { foreignKey: "itemId" });
      Item.belongsTo(models.Travel, { foreignKey: "travelId" });
    }
  }
  Item.init(
    {
      name: DataTypes.STRING,
      amount: DataTypes.DECIMAL(10,2),
      itemTime: DataTypes.DATE,
      travelId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Item",
      tableName:'Items',
      underscored: true,
    }
  );
  return Item;
};
