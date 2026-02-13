const db = require('../config/db');

class Provider {
  static async findAll() {
    const [rows] = await db.execute(`
      SELECT p.*, u.email 
      FROM proveedores p 
      JOIN usuarios u ON p.usuario_id = u.id
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM proveedores WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM proveedores WHERE usuario_id = ?', [userId]);
    return rows[0];
  }

  static async create(providerData) {
    const { usuario_id, nombre_negocio, telefono_contacto } = providerData;
    const [result] = await db.execute(
      'INSERT INTO proveedores (usuario_id, nombre_negocio, telefono_contacto) VALUES (?, ?, ?)',
      [usuario_id, nombre_negocio, telefono_contacto]
    );
    return result.insertId;
  }

  static async update(id, providerData) {
    const { nombre_negocio, telefono_contacto } = providerData;
    await db.execute(
      'UPDATE proveedores SET nombre_negocio = ?, telefono_contacto = ? WHERE id = ?',
      [nombre_negocio, telefono_contacto, id]
    );
  }
}

module.exports = Provider;
