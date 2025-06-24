const { Medicamento, TipoMedicamento, Especialidad } = require('../models');

// Obtener todos los medicamentos con información relacionada
exports.getMedicamentos = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll({
      include: [
        { model: TipoMedicamento, as: 'TipoMedicamento' },
        { model: Especialidad, as: 'Especialidad' }
      ],
      order: [['descripcionmed', 'ASC']]
    });
    res.json(medicamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los medicamentos' });
  }
};

// Obtener un medicamento por ID con información relacionada
exports.getMedicamentoById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicamento = await Medicamento.findByPk(id, {
      include: [
        { model: TipoMedicamento, as: 'TipoMedicamento' },
        { model: Especialidad, as: 'Especialidad' }
      ]
    });
    
    if (!medicamento) {
      return res.status(404).json({ message: 'Medicamento no encontrado' });
    }
    
    res.json(medicamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el medicamento' });
  }
};

// Crear un nuevo medicamento
exports.createMedicamento = async (req, res) => {
  try {
    const {
      descripcionmed,
      fechafabricacion,
      fechavencimiento,
      presentacion,
      stock,
      precioventauni,
      precioventapres,
      codtipomed,
      marca,
      codespec
    } = req.body;
    
    if (!descripcionmed) {
      return res.status(400).json({ message: 'La descripción es requerida' });
    }
    
    const medicamento = await Medicamento.create({
      descripcionmed,
      fechafabricacion,
      fechavencimiento,
      presentacion,
      stock: stock || 0,
      precioventauni,
      precioventapres,
      codtipomed,
      marca,
      codespec
    });
    
    res.status(201).json(medicamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el medicamento', error: error.message });
  }
};

// Actualizar un medicamento
exports.updateMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const medicamento = await Medicamento.findByPk(id);
    
    if (!medicamento) {
      return res.status(404).json({ message: 'Medicamento no encontrado' });
    }
    
    // Actualizar solo los campos proporcionados
    const camposPermitidos = [
      'descripcionmed', 'fechafabricacion', 'fechavencimiento',
      'presentacion', 'stock', 'precioventauni', 'precioventapres',
      'codtipomed', 'marca', 'codespec'
    ];
    
    for (const campo of camposPermitidos) {
      if (updates[campo] !== undefined) {
        medicamento[campo] = updates[campo];
      }
    }
    
    await medicamento.save();
    
    // Obtener el medicamento actualizado con las relaciones
    const medicamentoActualizado = await Medicamento.findByPk(id, {
      include: [
        { model: TipoMedicamento, as: 'TipoMedicamento' },
        { model: Especialidad, as: 'Especialidad' }
      ]
    });
    
    res.json(medicamentoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el medicamento' });
  }
};

// Eliminar un medicamento
exports.deleteMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const medicamento = await Medicamento.findByPk(id);
    
    if (!medicamento) {
      return res.status(404).json({ message: 'Medicamento no encontrado' });
    }
    
    await medicamento.destroy();
    
    res.json({ message: 'Medicamento eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el medicamento' });
  }
};

// Buscar medicamentos por término de búsqueda
exports.searchMedicamentos = async (req, res) => {
  try {
    const { termino } = req.query;
    
    if (!termino || termino.trim() === '') {
      return res.status(400).json({ message: 'Término de búsqueda requerido' });
    }
    
    const medicamentos = await Medicamento.findAll({
      where: {
        [Op.or]: [
          { descripcionmed: { [Op.iLike]: `%${termino}%` } },
          { marca: { [Op.iLike]: `%${termino}%` } },
          { presentacion: { [Op.iLike]: `%${termino}%` } }
        ]
      },
      include: [
        { model: TipoMedicamento, as: 'TipoMedicamento' },
        { model: Especialidad, as: 'Especialidad' }
      ],
      limit: 50
    });
    
    res.json(medicamentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar medicamentos' });
  }
};
