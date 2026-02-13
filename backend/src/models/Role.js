const db = require('../config/db');

class Role {
  static async findByName(name) {
    const [rows] = await db.execute('SELECT * FROM roles WHERE nombre = ?', [name]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM roles WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = Role;
