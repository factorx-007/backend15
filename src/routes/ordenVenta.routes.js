const express = require('express');
const router = express.Router();
const {
  getOrdenesVenta,
  getOrdenVentaById,
  createOrdenVenta,
  updateEstadoOrdenVenta,
  deleteOrdenVenta
} = require('../controllers/ordenVenta.controller');

// Obtener todas las órdenes de venta
router.get('/', getOrdenesVenta);

// Obtener una orden de venta por ID
router.get('/:id', getOrdenVentaById);

// Crear una nueva orden de venta
router.post('/', createOrdenVenta);

// Actualizar el estado de una orden de venta
router.put('/:id/estado', updateEstadoOrdenVenta);

// Eliminar una orden de venta (solo si está pendiente)
router.delete('/:id', deleteOrdenVenta);

module.exports = router;
