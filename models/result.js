'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Result.belongsTo(models.Travel, { foreignKey: "travelId" });
      Result.belongsTo(models.User, {
        foreignKey: "owerId",
        as: "ower",
      });
      Result.belongsTo(models.User, {
        foreignKey: "payerId",
        as: "payer",
      });

    }
  };
  Result.init(
    {
      travelId: DataTypes.INTEGER,
      owerId: DataTypes.INTEGER, //takerId
      payerId: DataTypes.INTEGER, //giverId
      amount: DataTypes.DECIMAL(10,2),
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Result",
      tableName: "Results",
      underscored: true,
    }
  );
  return Result;
};