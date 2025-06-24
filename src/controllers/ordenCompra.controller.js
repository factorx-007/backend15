const { OrdenCompra, DetalleOrdenCompra, Medicamento, Laboratorio } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../database/config');

// Obtener todas las órdenes de compra con sus detalles
exports.getOrdenesCompra = async (req, res) => {
  try {
    const ordenes = await OrdenCompra.findAll({
      include: [
        { model: Laboratorio, as: 'Laboratorio' },
        {
          model: DetalleOrdenCompra,
          as: 'DetalleOrdenCompra',
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
    res.status(500).json({ message: 'Error al obtener las órdenes de compra' });
  }
};

// Obtener una orden de compra por ID con sus detalles
exports.getOrdenCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const orden = await OrdenCompra.findByPk(id, {
      include: [
        { model: Laboratorio, as: 'Laboratorio' },
        {
          model: DetalleOrdenCompra,
          as: 'DetalleOrdenCompra',
          include: [
            { model: Medicamento, as: 'Medicamento' }
          ]
        }
      ]
    });
    
    if (!orden) {
      return res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
    
    res.json(orden);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la orden de compra' });
  }
};

// Crear una nueva orden de compra con sus detalles
exports.createOrdenCompra = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      fechaemision, 
      situacion, 
      codlab, 
      nrofcturaprov, 
      detalles 
    } = req.body;
    
    // Validar que haya al menos un detalle
    if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Debe incluir al menos un medicamento en la orden' });
    }
    
    // Validar que el laboratorio existe
    const laboratorio = await Laboratorio.findByPk(codlab, { transaction });
    if (!laboratorio) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }
    
    // Calcular el total de la orden
    let total = 0;
    const detallesConMontos = [];
    
    // Procesar los detalles para calcular montos y validar existencias
    for (const detalle of detalles) {
      const { codmedicamento, cantidad, precio } = detalle;
      
      // Validar que el medicamento existe
      const medicamento = await Medicamento.findByPk(codmedicamento, { transaction });
      if (!medicamento) {
        await transaction.rollback();
        return res.status(404).json({ message: `Medicamento con ID ${codmedicamento} no encontrado` });
      }
      
      // Calcular monto del detalle
      const monto = cantidad * precio;
      total += monto;
      
      // Agregar al array de detalles con montos
      detallesConMontos.push({
        ...detalle,
        descripcion: medicamento.descripcionmed,
        montouni: monto
      });
    }
    
    // Crear la orden de compra
    const orden = await OrdenCompra.create({
      fechaemision: fechaemision || new Date(),
      situacion: situacion || 'PENDIENTE',
      total,
      codlab,
      nrofcturaprov
    }, { transaction });
    
    // Crear los detalles de la orden
    for (const detalle of detallesConMontos) {
      const { codmedicamento, cantidad, precio, descripcion, montouni } = detalle;
      
      await DetalleOrdenCompra.create({
        nroordenc: orden.nroordenc,
        codmedicamento,
        descripcion,
        cantidad,
        precio,
        montouni
      }, { transaction });
      
      // Si la orden está PROCESADA, actualizar el stock del medicamento
      if (situacion === 'PROCESADA') {
        const medicamento = await Medicamento.findByPk(codmedicamento, { transaction });
        if (medicamento) {
          medicamento.stock += cantidad;
          // Actualizar precios si es necesario
          if (precio > 0) {
            medicamento.preciocompra = precio;
            // Aquí podrías aplicar un margen para actualizar el precio de venta
            // medicamento.precioventa = precio * 1.3; // 30% de margen, por ejemplo
          }
          await medicamento.save({ transaction });
        }
      }
    }
    
    // Confirmar la transacción
    await transaction.commit();
    
    // Obtener la orden con sus detalles para la respuesta
    const ordenCreada = await OrdenCompra.findByPk(orden.nroordenc, {
      include: [
        { model: Laboratorio, as: 'Laboratorio' },
        {
          model: DetalleOrdenCompra,
          as: 'DetalleOrdenCompra',
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
    res.status(500).json({ message: 'Error al crear la orden de compra', error: error.message });
  }
};

// Actualizar el estado de una orden de compra
exports.updateEstadoOrdenCompra = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { situacion } = req.body;
    
    const orden = await OrdenCompra.findByPk(id, { 
      include: [
        {
          model: DetalleOrdenCompra,
          as: 'DetalleOrdenCompra'
        }
      ],
      transaction 
    });
    
    if (!orden) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
    
    // Validar que el estado sea válido
    const estadosValidos = ['PENDIENTE', 'PROCESADA', 'CANCELADA'];
    if (!estadosValidos.includes(situacion)) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Estado de orden no válido' });
    }
    
    // Si se está procesando la orden, actualizar el stock de los medicamentos
    if (situacion === 'PROCESADA' && orden.situacion === 'PENDIENTE') {
      for (const detalle of orden.DetalleOrdenCompra) {
        const medicamento = await Medicamento.findByPk(detalle.codmedicamento, { transaction });
        if (medicamento) {
          medicamento.stock += detalle.cantidad;
          // Actualizar precios si es necesario
          if (detalle.precio > 0) {
            medicamento.preciocompra = detalle.precio;
            // Aquí podrías aplicar un margen para actualizar el precio de venta
            // medicamento.precioventa = detalle.precio * 1.3; // 30% de margen, por ejemplo
          }
          await medicamento.save({ transaction });
        }
      }
    }
    // Si se cancela una orden procesada, revertir el stock
    else if (situacion === 'CANCELADA' && orden.situacion === 'PROCESADA') {
      for (const detalle of orden.DetalleOrdenCompra) {
        const medicamento = await Medicamento.findByPk(detalle.codmedicamento, { transaction });
        if (medicamento) {
          medicamento.stock = Math.max(0, medicamento.stock - detalle.cantidad);
          await medicamento.save({ transaction });
        }
      }
    }
    
    // Actualizar el estado de la orden
    orden.situacion = situacion;
    await orden.save({ transaction });
    
    await transaction.commit();
    
    // Obtener la orden actualizada para la respuesta
    const ordenActualizada = await OrdenCompra.findByPk(id, {
      include: [
        { model: Laboratorio, as: 'Laboratorio' },
        {
          model: DetalleOrdenCompra,
          as: 'DetalleOrdenCompra',
          include: [
            { model: Medicamento, as: 'Medicamento' }
          ]
        }
      ]
    });
    
    res.json(ordenActualizada);
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estado de la orden de compra', error: error.message });
  }
};

// Eliminar una orden de compra (solo si está pendiente)
exports.deleteOrdenCompra = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const orden = await OrdenCompra.findByPk(id, {
      include: [
        {
          model: DetalleOrdenCompra,
          as: 'DetalleOrdenCompra'
        }
      ],
      transaction
    });
    
    if (!orden) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Orden de compra no encontrada' });
    }
    
    // Solo se pueden eliminar órdenes pendientes
    if (orden.situacion !== 'PENDIENTE') {
      await transaction.rollback();
      return res.status(400).json({ message: 'Solo se pueden eliminar órdenes en estado PENDIENTE' });
    }
    
    // Eliminar los detalles de la orden
    await DetalleOrdenCompra.destroy({
      where: { nroordenc: id },
      transaction
    });
    
    // Eliminar la orden
    await orden.destroy({ transaction });
    
    await transaction.commit();
    
    res.json({ message: 'Orden de compra eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la orden de compra', error: error.message });
  }
};
