const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Log = sequelize.define('Log', {
  action: { type: DataTypes.STRING, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Log.belongsTo(User);

module.exports = Log;