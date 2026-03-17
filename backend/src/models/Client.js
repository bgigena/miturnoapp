const prisma = require('../config/prisma');

class Client {
  static async findAll() {
    const clientes = await prisma.cliente.findMany({
      include: { Usuario: true }
    });
    return clientes.map(c => ({
      ...c,
      email: c.Usuario.email
    }));
  }

  static async findById(id) {
    return await prisma.cliente.findUnique({
      where: { id: parseInt(id, 10) }
    });
  }

  static async findByUserId(userId) {
    return await prisma.cliente.findFirst({
      where: { usuario_id: parseInt(userId, 10) }
    });
  }

  static async create(clientData) {
    const { usuario_id, nombre, apellido, telefono } = clientData;
    const result = await prisma.cliente.create({
      data: {
        usuario_id: parseInt(usuario_id, 10),
        nombre,
        apellido,
        telefono
      }
    });
    return result.id;
  }

  static async update(id, clientData) {
    const { nombre, apellido, telefono } = clientData;
    await prisma.cliente.update({
      where: { id: parseInt(id, 10) },
      data: {
        nombre,
        apellido,
        telefono
      }
    });
  }
}

module.exports = Client;
