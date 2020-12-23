const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

module.exports = sequelize.define('user', {
  id: { type: DataTypes.STRING, primaryKey: true, autoIncrement: true, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  photo: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'guest'), defaultValue: 'guest' },
});
