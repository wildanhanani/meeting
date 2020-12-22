'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rooms', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: false,
      },
      room_name: {
        type: Sequelize.STRING,
        notNull: false,
      },
      room_capacity: {
        type: Sequelize.STRING,
        notNull: false,
      },
      photo: {
        type: Sequelize.STRING,
        notNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rooms');
  },
};
