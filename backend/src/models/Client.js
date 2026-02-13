const db = require('../config/db');

class Client {
  static async findAll() {
    const [rows] = await db.execute(`
      SELECT c.*, u.email 
      FROM clientes c 
      JOIN usuarios u ON c.usuario_id = u.id
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM clientes WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute('SELECT * FROM clientes WHERE usuario_id = ?', [userId]);
    return rows[0];
  }

  static async create(clientData) {
    const { usuario_id, nombre, apellido, telefono } = clientData;
    const [result] = await db.execute(
      'INSERT INTO clientes (usuario_id, nombre, apellido, telefono) VALUES (?, ?, ?, ?)',
      [usuario_id, nombre, apellido, telefono]
    );
    return result.insertId;
  }

  static async update(id, clientData) {
    const { nombre, apellido, telefono } = clientData;
    await db.execute(
      'UPDATE clientes SET nombre = ?, apellido = ?, telefono = ? WHERE id = ?',
      [nombre, apellido, telefono, id]
    );
  }
}

module.exports = Client;
