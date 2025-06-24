const { Especialidad } = require('../models');

// Obtener todas las especialidades
exports.getEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll();
    res.json(especialidades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las especialidades' });
  }
};

// Obtener una especialidad por ID
exports.getEspecialidadById = async (req, res) => {
  try {
    const { id } = req.params;
    const especialidad = await Especialidad.findByPk(id);
    
    if (!especialidad) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    
    res.json(especialidad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la especialidad' });
  }
};

// Crear una nueva especialidad
exports.createEspecialidad = async (req, res) => {
  try {
    const { descripcionesp } = req.body;
    
    if (!descripcionesp) {
      return res.status(400).json({ message: 'La descripción es requerida' });
    }
    
    const especialidad = await Especialidad.create({ descripcionesp });
    res.status(201).json(especialidad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la especialidad' });
  }
};

// Actualizar una especialidad
exports.updateEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcionesp } = req.body;
    
    const especialidad = await Especialidad.findByPk(id);
    
    if (!especialidad) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    
    especialidad.descripcionesp = descripcionesp || especialidad.descripcionesp;
    await especialidad.save();
    
    res.json(especialidad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la especialidad' });
  }
};

// Eliminar una especialidad
exports.deleteEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const especialidad = await Especialidad.findByPk(id);
    
    if (!especialidad) {
      return res.status(404).json({ message: 'Especialidad no encontrada' });
    }
    
    await especialidad.destroy();
    
    res.json({ message: 'Especialidad eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la especialidad' });
  }
};
