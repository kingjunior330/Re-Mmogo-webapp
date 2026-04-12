const db = require('../config/db');

const User = {
  // Create new user
  create: async (userData) => {
    const { name, email, password, is_signatory } = userData;
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, is_signatory) VALUES (?, ?, ?, ?)',
      [name, email, password, is_signatory || false]
    );
    return result.insertId;
  },

  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT id, name, email, is_signatory, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = User;