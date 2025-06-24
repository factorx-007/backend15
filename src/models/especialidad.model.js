const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Especialidad = sequelize.define('Especialidad', {
  codespec: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'codespec'
  },
  descripcionesp: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'descripcionesp'
  }
}, {
  tableName: 'especialidad',
  timestamps: false
});

module.exports = Especialidad;
