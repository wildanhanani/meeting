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
      create_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      update_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      delete_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rooms');
  },
};
