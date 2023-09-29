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
    }
  };
  UserTravelConn.init({
    userId: DataTypes.INTEGER,
    travelId: DataTypes.INTEGER,
    net: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserTravelConn',
    tableName:'UserTravelConns',
    underscored:true,
  });
  return UserTravelConn;
};