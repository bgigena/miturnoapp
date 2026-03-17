const prisma = require('../config/prisma');

class Provider {
  static async findAll() {
    const proveedores = await prisma.proveedor.findMany({
      include: { Usuario: true }
    });
    return proveedores.map(p => ({
      ...p,
      email: p.Usuario.email
    }));
  }

  static async findById(id) {
    return await prisma.proveedor.findUnique({
      where: { id: parseInt(id, 10) }
    });
  }

  static async findByUserId(userId) {
    return await prisma.proveedor.findFirst({
      where: { usuario_id: parseInt(userId, 10) }
    });
  }

  static async create(providerData) {
    const { usuario_id, nombre_negocio, telefono_contacto } = providerData;
    const result = await prisma.proveedor.create({
      data: {
        usuario_id: parseInt(usuario_id, 10),
        nombre_negocio,
        telefono_contacto
      }
    });
    return result.id;
  }

  static async update(id, providerData) {
    const { nombre_negocio, telefono_contacto } = providerData;
    await prisma.proveedor.update({
      where: { id: parseInt(id, 10) },
      data: {
        nombre_negocio,
        telefono_contacto
      }
    });
  }
}

module.exports = Provider;
