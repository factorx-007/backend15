const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const Medicamento = require('./medicamento.model');

const DetalleOrdenVenta = sequelize.define('DetalleOrdenVenta', {
  nroordenvta: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    field: 'nroordenvta',
    references: {
      model: 'ordenventa',
      key: 'nroordenvta'
    }
  },
  codmedicamento: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    field: 'codmedicamento',
    references: {
      model: Medicamento,
      key: 'codmedicamento'
    }
  },
  descripcionmed: {
    type: DataTypes.TEXT,
    field: 'descripcionmed'
  },
  cantidadrequerida: {
    type: DataTypes.INTEGER,
    field: 'cantidadrequerida',
    allowNull: false,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'detalleordenvta',
  timestamps: false
});

// Relación con Medicamento
DetalleOrdenVenta.belongsTo(Medicamento, { foreignKey: 'codmedicamento' });

module.exports = DetalleOrdenVenta;
