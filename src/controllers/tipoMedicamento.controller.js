const { TipoMedicamento } = require('../models');

// Obtener todos los tipos de medicamento
exports.getTiposMedicamento = async (req, res) => {
  try {
    const tipos = await TipoMedicamento.findAll();
    res.json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los tipos de medicamento' });
  }
};

// Obtener un tipo de medicamento por ID
exports.getTipoMedicamentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await TipoMedicamento.findByPk(id);
    
    if (!tipo) {
      return res.status(404).json({ message: 'Tipo de medicamento no encontrado' });
    }
    
    res.json(tipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el tipo de medicamento' });
  }
};

// Crear un nuevo tipo de medicamento
exports.createTipoMedicamento = async (req, res) => {
  try {
    const { descripcion } = req.body;
    
    if (!descripcion) {
      return res.status(400).json({ message: 'La descripción es requerida' });
    }
    
    const tipo = await TipoMedicamento.create({ descripcion });
    res.status(201).json(tipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el tipo de medicamento' });
  }
};

// Actualizar un tipo de medicamento
exports.updateTipoMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;
    
    const tipo = await TipoMedicamento.findByPk(id);
    
    if (!tipo) {
      return res.status(404).json({ message: 'Tipo de medicamento no encontrado' });
    }
    
    tipo.descripcion = descripcion || tipo.descripcion;
    await tipo.save();
    
    res.json(tipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el tipo de medicamento' });
  }
};

// Eliminar un tipo de medicamento
exports.deleteTipoMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const tipo = await TipoMedicamento.findByPk(id);
    
    if (!tipo) {
      return res.status(404).json({ message: 'Tipo de medicamento no encontrado' });
    }
    
    await tipo.destroy();
    
    res.json({ message: 'Tipo de medicamento eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el tipo de medicamento' });
  }
};
