const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');
const room = require('../models/Room');
const user = require('../models/Users');

module.exports = sequelize.define('Booking', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: 'id',
    },
    allowNull: false,
  },
  roomId: {
    type: DataTypes.INTEGER,
    references: {
      model: room,
      key: 'id',
    },
    allowNull: false,
  },
  total_person: { type: DataTypes.INTEGER, defaultValue: 0 },
  booking_time: { type: DataTypes.DATE, allowNull: false },
  noted: { type: DataTypes.TEXT, allowNull: false },
  check_in_time: { type: DataTypes.DATE },
  check_out_time: { type: DataTypes.DATE },
});