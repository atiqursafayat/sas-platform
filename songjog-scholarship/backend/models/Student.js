const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.JSON },
  dob: { type: DataTypes.DATE },
  academic_records: { type: DataTypes.JSON },
  financial_status: { type: DataTypes.JSON },
  bio: { type: DataTypes.TEXT },
  goals: { type: DataTypes.TEXT },
  profile_picture: { type: DataTypes.STRING },
  certificates: { type: DataTypes.JSON },
});

module.exports = Student;