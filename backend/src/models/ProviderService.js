const prisma = require('../config/prisma');

class ProviderService {
  static async addServiceToProvider(providerId, serviceId, price) {
    await prisma.proveedorServicio.create({
      data: {
        proveedor_id: parseInt(providerId, 10),
        servicio_id: parseInt(serviceId, 10),
        precio_especifico: price
      }
    });
  }

  static async removeServiceFromProvider(providerId, serviceId) {
    await prisma.proveedorServicio.delete({
      where: {
        proveedor_id_servicio_id: {
          proveedor_id: parseInt(providerId, 10),
          servicio_id: parseInt(serviceId, 10)
        }
      }
    });
  }

  static async findByProviderId(providerId) {
    const servicios = await prisma.proveedorServicio.findMany({
      where: { proveedor_id: parseInt(providerId, 10) },
      include: {
        Servicio: true
      }
    });

    return servicios.map(ps => ({
      ...ps,
      nombre: ps.Servicio.nombre,
      duracion_minutos: ps.Servicio.duracion_minutos,
      precio_base: ps.Servicio.precio_base
    }));
  }
}

module.exports = ProviderService;
