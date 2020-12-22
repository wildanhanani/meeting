const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

module.exports = sequelize.define('Room', {
  id: { type: DataTypes.STRING, primaryKey: true, autoIncrement: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  capacity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  photo: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('available', 'not available'), defaultValue: 'available' },
});
