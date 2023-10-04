'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Notifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      read: {
        type: Sequelize.BOOLEAN,
      },
      travel_id: {
        type: Sequelize.INTEGER,
      },
      sender_id: {
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Notifications');
  }
};