const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/config');
const { setupRelations } = require('./models');

// Configurar relaciones entre modelos
setupRelations();

// Importar rutas
const especialidadRoutes = require('./routes/especialidad.routes');
const tipoMedicamentoRoutes = require('./routes/tipoMedicamento.routes');
const laboratorioRoutes = require('./routes/laboratorio.routes');
const medicamentoRoutes = require('./routes/medicamento.routes');
const ordenVentaRoutes = require('./routes/ordenVenta.routes');
const ordenCompraRoutes = require('./routes/ordenCompra.routes');

// Nota: Las rutas de detalles están incluidas en sus respectivos controladores principales
// No es necesario importar rutas separadas para los detalles

// Inicializar aplicación
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/especialidades', especialidadRoutes);
app.use('/api/tipos-medicamento', tipoMedicamentoRoutes);
app.use('/api/laboratorios', laboratorioRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/ordenes-venta', ordenVentaRoutes);
app.use('/api/ordenes-compra', ordenCompraRoutes);
// Las rutas de detalles están incluidas en sus respectivos controladores principales

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de Farmacia' });
});

// Sincronizar base de datos y arrancar servidor
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos (en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      console.log('Modelos sincronizados.');
    }

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
