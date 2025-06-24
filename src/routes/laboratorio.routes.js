const express = require('express');
const router = express.Router();
const {
  getLaboratorios,
  getLaboratorioById,
  createLaboratorio,
  updateLaboratorio,
  deleteLaboratorio
} = require('../controllers/laboratorio.controller');

// Obtener todos los laboratorios
router.get('/', getLaboratorios);

// Obtener un laboratorio por ID
router.get('/:id', getLaboratorioById);

// Crear un nuevo laboratorio
router.post('/', createLaboratorio);

// Actualizar un laboratorio
router.put('/:id', updateLaboratorio);

// Eliminar un laboratorio
router.delete('/:id', deleteLaboratorio);

module.exports = router;
