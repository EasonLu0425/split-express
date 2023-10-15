'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ItemDetail.belongsTo(models.Item, {foreignKey:'itemId'})
      ItemDetail.belongsTo(models.User, {foreignKey:'userId'})
    }
  };
  ItemDetail.init(
    {
      userId: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL(10,2),
      payer: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ItemDetail",
      tableName: "ItemDetails",
      underscored: true,
    }
  );
  return ItemDetail;
};