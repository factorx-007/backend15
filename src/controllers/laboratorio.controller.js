const { Laboratorio } = require('../models');

// Obtener todos los laboratorios
exports.getLaboratorios = async (req, res) => {
  try {
    const laboratorios = await Laboratorio.findAll({
      order: [['razonsocial', 'ASC']]
    });
    res.json(laboratorios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los laboratorios' });
  }
};

// Obtener un laboratorio por ID
exports.getLaboratorioById = async (req, res) => {
  try {
    const { id } = req.params;
    const laboratorio = await Laboratorio.findByPk(id);
    
    if (!laboratorio) {
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }
    
    res.json(laboratorio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el laboratorio' });
  }
};

// Crear un nuevo laboratorio
exports.createLaboratorio = async (req, res) => {
  try {
    const { razonsocial, direccion, telefono, email, contacto } = req.body;
    
    if (!razonsocial) {
      return res.status(400).json({ message: 'La razón social es requerida' });
    }
    
    const laboratorio = await Laboratorio.create({
      razonsocial,
      direccion,
      telefono,
      email,
      contacto
    });
    
    res.status(201).json(laboratorio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el laboratorio' });
  }
};

// Actualizar un laboratorio
exports.updateLaboratorio = async (req, res) => {
  try {
    const { id } = req.params;
    const { razonsocial, direccion, telefono, email, contacto } = req.body;
    
    const laboratorio = await Laboratorio.findByPk(id);
    
    if (!laboratorio) {
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }
    
    // Actualizar solo los campos proporcionados
    if (razonsocial !== undefined) laboratorio.razonsocial = razonsocial;
    if (direccion !== undefined) laboratorio.direccion = direccion;
    if (telefono !== undefined) laboratorio.telefono = telefono;
    if (email !== undefined) laboratorio.email = email;
    if (contacto !== undefined) laboratorio.contacto = contacto;
    
    await laboratorio.save();
    
    res.json(laboratorio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el laboratorio' });
  }
};

// Eliminar un laboratorio
exports.deleteLaboratorio = async (req, res) => {
  try {
    const { id } = req.params;
    const laboratorio = await Laboratorio.findByPk(id);
    
    if (!laboratorio) {
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }
    
    await laboratorio.destroy();
    
    res.json({ message: 'Laboratorio eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el laboratorio' });
  }
};
