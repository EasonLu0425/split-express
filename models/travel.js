"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Travel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Travel.belongsToMany(models.User, {
        through:models.UserTravelConn,
        foreignKey:'travelId',
        // otherKey:'userId',
        as:'groupMembers'
      })
      Travel.hasMany(models.Item, {foreignKey: 'travelId'})
    }
  }
  Travel.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.BOOLEAN,
      redirect: DataTypes.BOOLEAN,
      archive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Travel",
      tableName: "Travels",
      underscored: true,
    }
  );
  return Travel;
};
