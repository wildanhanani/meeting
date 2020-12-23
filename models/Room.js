const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

module.exports = sequelize.define('room', {
  id: { type: DataTypes.STRING, primaryKey: true, autoIncrement: true, allowNull: false },
  room_name: { type: DataTypes.STRING, allowNull: false },
  room_capacity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  photo: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('available', 'not available'), defaultValue: 'available' },
});
