const prisma = require('../config/prisma');

class User {
  static async create(userData) {
    const { email, password_hash, role_id } = userData;
    const result = await prisma.usuario.create({
      data: {
        email,
        password_hash,
        role_id: parseInt(role_id, 10)
      }
    });
    return result.id;
  }

  static async findByEmail(email) {
    return await prisma.usuario.findUnique({
      where: { email }
    });
  }

  static async findById(id) {
    return await prisma.usuario.findUnique({
      where: { id: parseInt(id, 10) }
    });
  }
}

module.exports = User;
