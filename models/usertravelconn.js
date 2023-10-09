'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTravelConn extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserTravelConn.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user', // 设置别名为'user'
      });

      UserTravelConn.belongsTo(models.Travel, {
        foreignKey: 'travelId',
        as: 'travel', // 设置别名为'travel'
      });
    }
  };
  UserTravelConn.init(
    {
      userId: DataTypes.INTEGER,
      travelId: DataTypes.INTEGER,
      net: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "UserTravelConn",
      tableName: "UserTravelConns",
      underscored: true,
    }
  );
  return UserTravelConn;
};