const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');
const room = require('./Room');
const user = require('./Users');

module.exports = sequelize.define('Booking', {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: 'id',
    },
    allowNull: false,
  },
  room_id: {
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
