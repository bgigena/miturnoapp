const db = require('../config/db');

class ProviderService {
  static async addServiceToProvider(providerId, serviceId, price) {
    await db.execute(
      'INSERT INTO proveedor_servicios (proveedor_id, servicio_id, precio_especifico) VALUES (?, ?, ?)',
      [providerId, serviceId, price]
    );
  }

  static async removeServiceFromProvider(providerId, serviceId) {
    await db.execute(
      'DELETE FROM proveedor_servicios WHERE proveedor_id = ? AND servicio_id = ?',
      [providerId, serviceId]
    );
  }

  static async findByProviderId(providerId) {
    const [rows] = await db.execute(`
      SELECT ps.*, s.nombre, s.duracion_minutos, s.precio_base 
      FROM proveedor_servicios ps
      JOIN servicios s ON ps.servicio_id = s.id
      WHERE ps.proveedor_id = ?
    `, [providerId]);
    return rows;
  }
}

module.exports = ProviderService;
