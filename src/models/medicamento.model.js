const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/config');
const TipoMedicamento = require('./tipoMedicamento.model');
const Especialidad = require('./especialidad.model');

const Medicamento = sequelize.define('Medicamento', {
  codmedicamento: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    field: 'codmedicamento'
  },
  descripcionmed: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'descripcionmed'
  },
  fechafabricacion: {
    type: DataTypes.DATE,
    field: 'fechafabricacion'
  },
  fechavencimiento: {
    type: DataTypes.DATE,
    field: 'fechavencimiento'
  },
  presentacion: {
    type: DataTypes.TEXT,
    field: 'presentacion'
  },
  stock: {
    type: DataTypes.INTEGER,
    field: 'stock',
    defaultValue: 0
  },
  precioventauni: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'precioventauni'
  },
  precioventapres: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'precioventapres'
  },
  marca: {
    type: DataTypes.TEXT,
    field: 'marca'
  },
  codtipomed: {
    type: DataTypes.BIGINT,
    field: 'codtipomed',
    references: {
      model: TipoMedicamento,
      key: 'codtipomed'
    }
  },
  codespec: {
    type: DataTypes.BIGINT,
    field: 'codespec',
    references: {
      model: Especialidad,
      key: 'codespec'
    }
  }
}, {
  tableName: 'medicamento',
  timestamps: false
});

// Relaciones
Medicamento.belongsTo(TipoMedicamento, { foreignKey: 'codtipomed' });
Medicamento.belongsTo(Especialidad, { foreignKey: 'codespec' });

module.exports = Medicamento;
