const express = require('express');
const router = express.Router();
const {
  getEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad
} = require('../controllers/especialidad.controller');

// Obtener todas las especialidades
router.get('/', getEspecialidades);

// Obtener una especialidad por ID
router.get('/:id', getEspecialidadById);

// Crear una nueva especialidad
router.post('/', createEspecialidad);

// Actualizar una especialidad
router.put('/:id', updateEspecialidad);

// Eliminar una especialidad
router.delete('/:id', deleteEspecialidad);

module.exports = router;
