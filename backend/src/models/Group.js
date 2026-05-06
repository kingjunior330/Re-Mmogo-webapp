const { pool } = require('../config/database')

const Group = {
    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM motshelo_groups WHERE id = ?', [id])
        return rows[0] || null
    },

    async findByCode(code) {
        const [rows] = await pool.query(
            'SELECT * FROM motshelo_groups WHERE group_code = ? AND is_active = 1',
            [code.toUpperCase()]
        )
        return rows[0] || null
    },

    async create(conn, groupName, code, description, monthly, rate, createdBy) {
        const [res] = await conn.query(
            'INSERT INTO motshelo_groups (group_name, group_code, description, monthly_contribution, interest_rate, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [groupName, code, description || '', monthly, rate, createdBy]
        )
        return res.insertId
    },

    async getMemberCount(groupId) {
        const [rows] = await pool.query(
            'SELECT COUNT(*) as total FROM group_members WHERE group_id = ? AND is_active = 1',
            [groupId]
        )
        return rows[0].total
    }
}

module.exports = Group
