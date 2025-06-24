const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const Laboratorio = sequelize.define('Laboratorio', {
  codlab: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'codlab'
  },
  razonsocial: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'razonsocial'
  },
  direccion: {
    type: DataTypes.TEXT,
    field: 'direccion'
  },
  telefono: {
    type: DataTypes.TEXT,
    field: 'telefono'
  },
  email: {
    type: DataTypes.TEXT,
    field: 'email',
    validate: {
      isEmail: true
    }
  },
  contacto: {
    type: DataTypes.TEXT,
    field: 'contacto'
  }
}, {
  tableName: 'laboratorio',
  timestamps: false
});

module.exports = Laboratorio;
