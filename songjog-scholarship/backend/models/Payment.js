const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Sponsor = require('./Sponsor');

const Payment = sequelize.define('Payment', {
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  type: { type: DataTypes.ENUM('one-time', 'monthly'), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'completed'), defaultValue: 'pending' },
});

Payment.belongsTo(Student);
Payment.belongsTo(Sponsor);

module.exports = Payment;