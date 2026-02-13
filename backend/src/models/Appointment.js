const db = require('../config/db');

class Appointment {
  static async findAllByProvider(providerId, date) {
    let query = `
      SELECT t.*, c.nombre as cliente_nombre, c.apellido as cliente_apellido, s.nombre as servicio_nombre
      FROM turnos t
      JOIN clientes c ON t.cliente_id = c.id
      JOIN servicios s ON t.servicio_id = s.id
      WHERE t.proveedor_id = ?
    `;
    const params = [providerId];

    if (date) {
      query += ' AND DATE(t.fecha_hora_inicio) = ?';
      params.push(date);
    }

    query += ' ORDER BY t.fecha_hora_inicio ASC';

    const [rows] = await db.execute(query, params);
    return rows;
  }

  static async findAllByClient(clientId) {
    const [rows] = await db.execute(`
      SELECT t.*, p.nombre_negocio as proveedor_nombre, s.nombre as servicio_nombre
      FROM turnos t
      JOIN proveedores p ON t.proveedor_id = p.id
      JOIN servicios s ON t.servicio_id = s.id
      WHERE t.cliente_id = ?
      ORDER BY t.fecha_hora_inicio DESC
    `, [clientId]);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM turnos WHERE id = ?', [id]);
    return rows[0];
  }

  static async checkOverlap(proveedorId, start, end) {
    const [rows] = await db.execute(`
      SELECT * FROM turnos 
      WHERE proveedor_id = ? 
      AND estado != 'CANCELADO'
      AND (
        (fecha_hora_inicio < ? AND fecha_hora_fin > ?)
      )
    `, [proveedorId, end, start]);
    return rows.length > 0;
  }

  static async create(appointmentData) {
    const { cliente_id, proveedor_id, servicio_id, fecha_hora_inicio, fecha_hora_fin, notas, create_by } = appointmentData;
    const [result] = await db.execute(
      'INSERT INTO turnos (cliente_id, proveedor_id, servicio_id, fecha_hora_inicio, fecha_hora_fin, notas, create_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [cliente_id, proveedor_id, servicio_id, fecha_hora_inicio, fecha_hora_fin, notas, create_by]
    );
    return result.insertId;
  }

  static async updateStatus(id, status, modify_by) {
    await db.execute(
      'UPDATE turnos SET estado = ?, modify_by = ? WHERE id = ?',
      [status, modify_by, id]
    );
  }
}

module.exports = Appointment;
