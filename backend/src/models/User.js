const db = require('../config/db');

class User {
  static async create(userData) {
    const { email, password_hash, role_id } = userData;
    const [result] = await db.execute(
      'INSERT INTO usuarios (email, password_hash, role_id) VALUES (?, ?, ?)',
      [email, password_hash, role_id]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = User;
