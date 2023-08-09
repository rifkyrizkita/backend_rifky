'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Employee.hasMany(models.Attendance)
    }
  }
  Employee.init({
    fullName: DataTypes.STRING,
    email: {type:DataTypes.STRING, unique:true, allowNull:false},
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    address: DataTypes.STRING,
    imgProfile: DataTypes.STRING,
    birthDate: DataTypes.DATEONLY,
    isDeleted: {type: DataTypes.BOOLEAN, defaultValue:false},
    isSuspended: {type: DataTypes.BOOLEAN, defaultValue:false},
    isAdmin: {type: DataTypes.BOOLEAN, defaultValue:false},
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};