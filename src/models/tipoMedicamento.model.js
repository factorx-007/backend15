const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');

const TipoMedicamento = sequelize.define('TipoMedicamento', {
  codtipomed: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'codtipomed'
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'descripcion'
  }
}, {
  tableName: 'tipomedic',
  timestamps: false
});

module.exports = TipoMedicamento;
