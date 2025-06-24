// Importar modelos
const Especialidad = require('./especialidad.model');
const TipoMedicamento = require('./tipoMedicamento.model');
const Laboratorio = require('./laboratorio.model');
const Medicamento = require('./medicamento.model');
const OrdenVenta = require('./ordenVenta.model');
const DetalleOrdenVenta = require('./detalleOrdenVenta.model');
const OrdenCompra = require('./ordenCompra.model');
const DetalleOrdenCompra = require('./detalleOrdenCompra.model');

// Configurar relaciones
function setupRelations() {
  // Relaciones de Medicamento
  Medicamento.belongsTo(TipoMedicamento, { foreignKey: 'codtipomed' });
  Medicamento.belongsTo(Especialidad, { foreignKey: 'codespec' });
  
  // Relaciones de OrdenVenta
  OrdenVenta.hasMany(DetalleOrdenVenta, { foreignKey: 'nroordenvta' });
  DetalleOrdenVenta.belongsTo(OrdenVenta, { foreignKey: 'nroordenvta' });
  DetalleOrdenVenta.belongsTo(Medicamento, { foreignKey: 'codmedicamento' });
  
  // Relaciones de OrdenCompra
  OrdenCompra.belongsTo(Laboratorio, { foreignKey: 'codlab' });
  OrdenCompra.hasMany(DetalleOrdenCompra, { foreignKey: 'nroordenc' });
  DetalleOrdenCompra.belongsTo(OrdenCompra, { foreignKey: 'nroordenc' });
  DetalleOrdenCompra.belongsTo(Medicamento, { foreignKey: 'codmedicamento' });
}

// Exportar modelos y función de configuración
module.exports = {
  Especialidad,
  TipoMedicamento,
  Laboratorio,
  Medicamento,
  OrdenVenta,
  DetalleOrdenVenta,
  OrdenCompra,
  DetalleOrdenCompra,
  setupRelations
};
