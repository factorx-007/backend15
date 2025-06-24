const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const Medicamento = require('./medicamento.model');

const DetalleOrdenCompra = sequelize.define('DetalleOrdenCompra', {
  nroordenc: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    field: 'nroordenc',
    references: {
      model: 'ordencompra',
      key: 'nroordenc'
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
  descripcion: {
    type: DataTypes.TEXT,
    field: 'descripcion'
  },
  cantidad: {
    type: DataTypes.INTEGER,
    field: 'cantidad',
    allowNull: false,
    validate: {
      min: 1
    }
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'precio',
    allowNull: false,
    validate: {
      min: 0
    }
  },
  montouni: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'montouni',
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'detalleordencompra',
  timestamps: false,
  hooks: {
    beforeValidate: (detalle, options) => {
      // Calcular monto unitario antes de guardar
      if (detalle.cantidad && detalle.precio) {
        detalle.montouni = detalle.cantidad * detalle.precio;
      }
    }
  }
});

// Relación con Medicamento
DetalleOrdenCompra.belongsTo(Medicamento, { foreignKey: 'codmedicamento' });

module.exports = DetalleOrdenCompra;
