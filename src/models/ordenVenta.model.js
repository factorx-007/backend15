const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const DetalleOrdenVenta = require('./detalleOrdenVenta.model');

const OrdenVenta = sequelize.define('OrdenVenta', {
  nroordenvta: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'nroordenvta'
  },
  fechaemision: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'fechaemision',
    defaultValue: DataTypes.NOW
  },
  motivo: {
    type: DataTypes.TEXT,
    field: 'motivo'
  },
  situacion: {
    type: DataTypes.TEXT,
    field: 'situacion'
  }
}, {
  tableName: 'ordenventa',
  timestamps: false
});

// Relación con DetalleOrdenVenta
OrdenVenta.hasMany(DetalleOrdenVenta, { foreignKey: 'nroordenvta' });
DetalleOrdenVenta.belongsTo(OrdenVenta, { foreignKey: 'nroordenvta' });

module.exports = OrdenVenta;
