const { OrdenVenta, DetalleOrdenVenta, Medicamento } = require('../models');
const { Op } = require('sequelize');

// Obtener todas las órdenes de venta con sus detalles
exports.getOrdenesVenta = async (req, res) => {
  try {
    const ordenes = await OrdenVenta.findAll({
      include: [
        {
          model: DetalleOrdenVenta,
          as: 'DetalleOrdenVenta',
          include: [
            { model: Medicamento, as: 'Medicamento' }
          ]
        }
      ],
      order: [['fechaemision', 'DESC']]
    });
    
    res.json(ordenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las órdenes de venta' });
  }
};

// Obtener una orden de venta por ID con sus detalles
exports.getOrdenVentaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const orden = await OrdenVenta.findByPk(id, {
      include: [
        {
          model: DetalleOrdenVenta,
          as: 'DetalleOrdenVenta',
          include: [
            { model: Medicamento, as: 'Medicamento' }
          ]
        }
      ]
    });
    
    if (!orden) {
      return res.status(404).json({ message: 'Orden de venta no encontrada' });
    }
    
    res.json(orden);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la orden de venta' });
  }
};

// Crear una nueva orden de venta con sus detalles
exports.createOrdenVenta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { fechaemision, motivo, situacion, detalles } = req.body;
    
    // Validar que haya al menos un detalle
    if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Debe incluir al menos un medicamento en la orden' });
    }
    
    // Crear la orden de venta
    const orden = await OrdenVenta.create({
      fechaemision: fechaemision || new Date(),
      motivo,
      situacion: situacion || 'PENDIENTE'
    }, { transaction });
    
    // Procesar los detalles de la orden
    for (const detalle of detalles) {
      const { codmedicamento, cantidadrequerida } = detalle;
      
      // Validar que el medicamento existe y tiene suficiente stock
      const medicamento = await Medicamento.findByPk(codmedicamento, { transaction });
      
      if (!medicamento) {
        await transaction.rollback();
        return res.status(404).json({ message: `Medicamento con ID ${codmedicamento} no encontrado` });
      }
      
      if (medicamento.stock < cantidadrequerida) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Stock insuficiente para el medicamento ${medicamento.descripcionmed}. Stock disponible: ${medicamento.stock}` 
        });
      }
      
      // Crear el detalle de la orden
      await DetalleOrdenVenta.create({
        nroordenvta: orden.nroordenvta,
        codmedicamento,
        descripcionmed: medicamento.descripcionmed,
        cantidadrequerida
      }, { transaction });
      
      // Actualizar el stock del medicamento
      medicamento.stock -= cantidadrequerida;
      await medicamento.save({ transaction });
    }
    
    // Confirmar la transacción
    await transaction.commit();
    
    // Obtener la orden con sus detalles para la respuesta
    const ordenCreada = await OrdenVenta.findByPk(orden.nroordenvta, {
      include: [
        {
          model: DetalleOrdenVenta,
          as: 'DetalleOrdenVenta',
          include: [
            { model: Medicamento, as: 'Medicamento' }
          ]
        }
      ]
    });
    
    res.status(201).json(ordenCreada);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al crear la orden de venta', error: error.message });
  }
};

// Actualizar el estado de una orden de venta
exports.updateEstadoOrdenVenta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { situacion } = req.body;
    
    const orden = await OrdenVenta.findByPk(id, { transaction });
    
    if (!orden) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Orden de venta no encontrada' });
    }
    
    // Validar que el estado sea válido
    const estadosValidos = ['PENDIENTE', 'PROCESADA', 'CANCELADA'];
    if (!estadosValidos.includes(situacion)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Estado de orden no válido' });
    }
    
    // Si se cancela una orden procesada, devolver el stock
    if (situacion === 'CANCELADA' && orden.situacion === 'PROCESADA') {
      const detalles = await DetalleOrdenVenta.findAll({
        where: { nroordenvta: id },
        transaction
      });
      
      for (const detalle of detalles) {
        const medicamento = await Medicamento.findByPk(detalle.codmedicamento, { transaction });
        if (medicamento) {
          medicamento.stock += detalle.cantidadrequerida;
          await medicamento.save({ transaction });
        }
      }
    }
    
    // Actualizar el estado de la orden
    orden.situacion = situacion;
    await orden.save({ transaction });
    
    await transaction.commit();
    
    res.json(orden);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estado de la orden de venta' });
  }
};

// Eliminar una orden de venta (solo si está pendiente)
exports.deleteOrdenVenta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const orden = await OrdenVenta.findByPk(id, {
      include: [
        {
          model: DetalleOrdenVenta,
          as: 'DetalleOrdenVenta'
        }
      ],
      transaction
    });
    
    if (!orden) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Orden de venta no encontrada' });
    }
    
    // Solo se pueden eliminar órdenes pendientes
    if (orden.situacion !== 'PENDIENTE') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Solo se pueden eliminar órdenes en estado PENDIENTE' });
    }
    
    // Si la orden está pendiente, simplemente la eliminamos
    // No es necesario devolver stock porque aún no se había descontado
    await DetalleOrdenVenta.destroy({
      where: { nroordenvta: id },
      transaction
    });
    
    await orden.destroy({ transaction });
    
    await transaction.commit();
    
    res.json({ message: 'Orden de venta eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la orden de venta' });
  }
};
