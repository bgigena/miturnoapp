const prisma = require('../config/prisma');

class Service {
  static async findAll() {
    return await prisma.servicio.findMany({
      where: { activo: true }
    });
  }

  static async findById(id) {
    return await prisma.servicio.findUnique({
      where: { id: parseInt(id, 10) }
    });
  }

  static async create(serviceData) {
    const { nombre, duracion_minutos, precio_base } = serviceData;
    const result = await prisma.servicio.create({
      data: {
        nombre,
        duracion_minutos: parseInt(duracion_minutos, 10),
        precio_base
      }
    });
    return result.id;
  }

  static async update(id, serviceData) {
    const { nombre, duracion_minutos, precio_base, activo } = serviceData;
    await prisma.servicio.update({
      where: { id: parseInt(id, 10) },
      data: {
        nombre,
        duracion_minutos: parseInt(duracion_minutos, 10),
        precio_base,
        activo
      }
    });
  }

  static async delete(id) {
    await prisma.servicio.update({
      where: { id: parseInt(id, 10) },
      data: { activo: false }
    });
  }
}

module.exports = Service;
