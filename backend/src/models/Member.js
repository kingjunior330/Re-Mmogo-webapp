const { pool } = require('../config/database')

const Member = {
    async getByGroup(groupId) {
        const [rows] = await pool.query(
            `SELECT gm.id, gm.role, gm.joined_at, gm.is_active,
                    u.id as user_id, u.full_name, u.email, u.phone
             FROM group_members gm
             JOIN users u ON u.id = gm.user_id
             WHERE gm.group_id = ? AND gm.is_active = 1
             ORDER BY gm.joined_at ASC`,
            [groupId]
        )
        return rows
    },

    async getMembership(userId) {
        const [rows] = await pool.query(
            `SELECT gm.group_id, gm.role, mg.group_name, mg.group_code
             FROM group_members gm
             JOIN motshelo_groups mg ON mg.id = gm.group_id
             WHERE gm.user_id = ? AND gm.is_active = 1
             LIMIT 1`,
            [userId]
        )
        return rows[0] || null
    },

    async add(groupId, userId, role) {
        const [res] = await pool.query(
            'INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)',
            [groupId, userId, role]
        )
        return res.insertId
    },

    async countSignatories(groupId) {
        const [rows] = await pool.query(
            "SELECT COUNT(*) as total FROM group_members WHERE group_id = ? AND role = 'signatory' AND is_active = 1",
            [groupId]
        )
        return rows[0].total
    },

    async updateRole(memberId, role) {
        await pool.query(
            'UPDATE group_members SET role = ? WHERE id = ?',
            [role, memberId]
        )
    }
}

module.exports = Member
