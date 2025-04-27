const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sponsor = sequelize.define('Sponsor', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  sponsored_student_ids: { type: DataTypes.JSON },
  preferences: { type: DataTypes.JSON },
});

module.exports = Sponsor;