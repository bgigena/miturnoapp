const prisma = require('../config/prisma');

class Appointment {
  static async findAllByProvider(providerId, date) {
    const where = { proveedor_id: providerId };
    
    if (date) {
      // Create date bounds for the whole day
      const startDate = new Date(date);
      // We assume "date" is a YYYY-MM-DD string, so appending "T00:00:00" ensures local timezone parsing consistency if needed,
      // but let's just use it as is and add 1 day.
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      where.fecha_hora_inicio = {
        gte: startDate,
        lt: endDate
      };
    }

    const turnos = await prisma.turno.findMany({
      where,
      orderBy: { fecha_hora_inicio: 'asc' },
      include: {
        Cliente: true,
        Servicio: true
      }
    });

    // Mapeamos a la estructura plana original que devolvía el SQL crudo
    return turnos.map(t => ({
      ...t,
      cliente_nombre: t.Cliente.nombre,
      cliente_apellido: t.Cliente.apellido,
      servicio_nombre: t.Servicio.nombre
    }));
  }

  static async findAllByClient(clientId) {
    const turnos = await prisma.turno.findMany({
      where: { cliente_id: clientId },
      orderBy: { fecha_hora_inicio: 'desc' },
      include: {
        Proveedor: true,
        Servicio: true
      }
    });

    return turnos.map(t => ({
      ...t,
      proveedor_nombre: t.Proveedor.nombre_negocio,
      servicio_nombre: t.Servicio.nombre
    }));
  }

  static async findById(id) {
    return await prisma.turno.findUnique({
      where: { id: parseInt(id, 10) }
    });
  }

  static async checkOverlap(proveedorId, start, end) {
    const overlaps = await prisma.turno.findMany({
      where: {
        proveedor_id: proveedorId,
        estado: { not: 'CANCELADO' },
        AND: [
          { fecha_hora_inicio: { lt: new Date(end) } },
          { fecha_hora_fin: { gt: new Date(start) } }
        ]
      }
    });
    return overlaps.length > 0;
  }

  static async create(appointmentData) {
    const { cliente_id, proveedor_id, servicio_id, fecha_hora_inicio, fecha_hora_fin, notas, create_by } = appointmentData;
    
    const result = await prisma.turno.create({
      data: {
        cliente_id,
        proveedor_id,
        servicio_id,
        fecha_hora_inicio: new Date(fecha_hora_inicio),
        fecha_hora_fin: new Date(fecha_hora_fin),
        notas,
        create_by
      }
    });
    return result.id;
  }

  static async updateStatus(id, status, modify_by) {
    await prisma.turno.update({
      where: { id: parseInt(id, 10) },
      data: {
        estado: status,
        modify_by
      }
    });
  }
}

module.exports = Appointment;
