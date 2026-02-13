const db = require('../config/db');

class Service {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM servicios WHERE activo = TRUE');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM servicios WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(serviceData) {
    const { nombre, duracion_minutos, precio_base } = serviceData;
    const [result] = await db.execute(
      'INSERT INTO servicios (nombre, duracion_minutos, precio_base) VALUES (?, ?, ?)',
      [nombre, duracion_minutos, precio_base]
    );
    return result.insertId;
  }

  static async update(id, serviceData) {
    const { nombre, duracion_minutos, precio_base, activo } = serviceData;
    await db.execute(
      'UPDATE servicios SET nombre = ?, duracion_minutos = ?, precio_base = ?, activo = ? WHERE id = ?',
      [nombre, duracion_minutos, precio_base, activo, id]
    );
  }

  static async delete(id) {
    await db.execute('UPDATE servicios SET activo = FALSE WHERE id = ?', [id]);
  }
}

module.exports = Service;
