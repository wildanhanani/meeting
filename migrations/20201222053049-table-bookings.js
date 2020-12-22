'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_person: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      booking_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      noted: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      check_in_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      check_out_time: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable('bookings');
  },
};
