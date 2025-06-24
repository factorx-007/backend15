const express = require('express');
const router = express.Router();
const {
  getTiposMedicamento,
  getTipoMedicamentoById,
  createTipoMedicamento,
  updateTipoMedicamento,
  deleteTipoMedicamento
} = require('../controllers/tipoMedicamento.controller');

// Obtener todos los tipos de medicamento
router.get('/', getTiposMedicamento);

// Obtener un tipo de medicamento por ID
router.get('/:id', getTipoMedicamentoById);

// Crear un nuevo tipo de medicamento
router.post('/', createTipoMedicamento);

// Actualizar un tipo de medicamento
router.put('/:id', updateTipoMedicamento);

// Eliminar un tipo de medicamento
router.delete('/:id', deleteTipoMedicamento);

module.exports = router;
