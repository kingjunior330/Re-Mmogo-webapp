const { pool } = require('../config/database')

// tried using an ORM first but this was easier to understand
const User = {
    async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
        return rows[0] || null
    },

    async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, full_name, email, phone FROM users WHERE id = ?',
            [id]
        )
        return rows[0] || null
    },

    async create(fullName, email, phone, passwordHash) {
        const [res] = await pool.query(
            'INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
            [fullName, email, phone || '', passwordHash]
        )
        return res.insertId
    },

    async update(id, fields) {
        // only update what's passed in
        const { fullName, phone } = fields
        await pool.query(
            'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
            [fullName, phone, id]
        )
    },

    async updatePassword(id, hash) {
        await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, id])
    }
}

module.exports = User
