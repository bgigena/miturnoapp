const prisma = require('../config/prisma');

class Role {
  static async findByName(name) {
    return await prisma.role.findUnique({
      where: { nombre: name }
    });
  }

  static async findById(id) {
    return await prisma.role.findUnique({
      where: { id: parseInt(id, 10) }
    });
  }
}

module.exports = Role;
