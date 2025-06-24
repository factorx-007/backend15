const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const {
  getMedicamentos,
  getMedicamentoById,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento,
  searchMedicamentos
} = require('../controllers/medicamento.controller');

// Obtener todos los medicamentos
router.get('/', getMedicamentos);

// Buscar medicamentos por término
router.get('/buscar', searchMedicamentos);

// Obtener un medicamento por ID
router.get('/:id', getMedicamentoById);

// Crear un nuevo medicamento
router.post('/', createMedicamento);

// Actualizar un medicamento
router.put('/:id', updateMedicamento);

// Eliminar un medicamento
router.delete('/:id', deleteMedicamento);

module.exports = router;
