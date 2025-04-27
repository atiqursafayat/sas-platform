const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Sponsor = require('./Sponsor');

const Application = sequelize.define('Application', {
  type: { type: DataTypes.ENUM('one-time', 'monthly'), allowNull: false },
  essay: { type: DataTypes.TEXT },
  references: { type: DataTypes.JSON },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
  comments: { type: DataTypes.TEXT },
});

Application.belongsTo(Student);
Application.belongsTo(Sponsor, { as: 'assignedSponsor', allowNull: true });

module.exports = Application;