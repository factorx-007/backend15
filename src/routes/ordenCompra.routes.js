const express = require('express');
const router = express.Router();
const {
  getOrdenesCompra,
  getOrdenCompraById,
  createOrdenCompra,
  updateEstadoOrdenCompra,
  deleteOrdenCompra
} = require('../controllers/ordenCompra.controller');

// Obtener todas las órdenes de compra
router.get('/', getOrdenesCompra);

// Obtener una orden de compra por ID
router.get('/:id', getOrdenCompraById);

// Crear una nueva orden de compra
router.post('/', createOrdenCompra);

// Actualizar el estado de una orden de compra
router.put('/:id/estado', updateEstadoOrdenCompra);

// Eliminar una orden de compra (solo si está pendiente)
router.delete('/:id', deleteOrdenCompra);

module.exports = router;
