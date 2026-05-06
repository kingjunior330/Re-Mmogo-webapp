const { pool } = require('../config/database')

const Contribution = {
    async getByGroup(groupId, memberId = null) {
        let q = `SELECT c.*, u.full_name as member_name, a.full_name as approver_name
                 FROM contributions c
                 JOIN users u ON u.id = c.member_id
                 LEFT JOIN users a ON a.id = c.approved_by
                 WHERE c.group_id = ?`
        const params = [groupId]
        if (memberId) {
            q += ' AND c.member_id = ?'
            params.push(memberId)
        }
        q += ' ORDER BY c.created_at DESC'
        const [rows] = await pool.query(q, params)
        return rows
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM contributions WHERE id = ?', [id])
        return rows[0] || null
    },

    // check if member already submitted for this month
    async existsForMonth(memberId, monthYear) {
        const [rows] = await pool.query(
            'SELECT id FROM contributions WHERE member_id = ? AND month_year = ?',
            [memberId, monthYear]
        )
        return rows.length > 0
    },

    async create(groupId, memberId, amount, monthYear, ref, proofUrl) {
        const [res] = await pool.query(
            `INSERT INTO contributions (group_id, member_id, amount, month_year, payment_reference, proof_of_payment_url, initiated_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [groupId, memberId, amount, monthYear, ref || '', proofUrl || '', memberId]
        )
        return res.insertId
    },

    async approve(id, approvedBy) {
        await pool.query(
            "UPDATE contributions SET status = 'approved', approved_by = ?, approved_at = NOW() WHERE id = ?",
            [approvedBy, id]
        )
    },

    async reject(id, approvedBy) {
        await pool.query(
            "UPDATE contributions SET status = 'rejected', approved_by = ?, approved_at = NOW() WHERE id = ?",
            [approvedBy, id]
        )
    }
}

module.exports = Contribution
