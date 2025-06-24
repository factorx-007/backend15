const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const Laboratorio = require('./laboratorio.model');
const DetalleOrdenCompra = require('./detalleOrdenCompra.model');

const OrdenCompra = sequelize.define('OrdenCompra', {
  nroordenc: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'nroordenc'
  },
  fechaemision: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'fechaemision',
    defaultValue: DataTypes.NOW
  },
  situacion: {
    type: DataTypes.STRING,
    field: 'situacion'
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'total',
    defaultValue: 0
  },
  codlab: {
    type: DataTypes.BIGINT,
    field: 'codlab',
    references: {
      model: Laboratorio,
      key: 'codlab'
    }
  },
  nrofcturaprov: {
    type: DataTypes.TEXT,
    field: 'nrofcturaprov'
  },
  observaciones: {
    type: DataTypes.TEXT,
    field: 'observaciones'
  }
}, {
  tableName: 'ordencompra',
  timestamps: true
});

// Relación con Laboratorio
OrdenCompra.belongsTo(Laboratorio, { 
  foreignKey: 'codlab',
  as: 'laboratorio'
});

// Relación con DetalleOrdenCompra
OrdenCompra.hasMany(DetalleOrdenCompra, { 
  foreignKey: 'nroordenc',
  as: 'detalles'
});

// Relación con DetalleOrdenCompra (para la relación inversa)
DetalleOrdenCompra.belongsTo(OrdenCompra, { 
  foreignKey: 'nroordenc',
  as: 'ordenCompra'
});

module.exports = OrdenCompra;
