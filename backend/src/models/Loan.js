const { pool } = require('../config/database')

const Loan = {
    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM loans WHERE id = ?', [id])
        return rows[0] || null
    },

    async getByGroup(groupId, memberId = null) {
        let q = `SELECT l.*, u.full_name as member_name
                 FROM loans l JOIN users u ON u.id = l.member_id
                 WHERE l.group_id = ?`
        const params = [groupId]
        if (memberId) {
            q += ' AND l.member_id = ?'
            params.push(memberId)
        }
        q += ' ORDER BY l.created_at DESC'
        const [rows] = await pool.query(q, params)
        return rows
    },

    async hasActiveLoan(memberId, groupId) {
        const [rows] = await pool.query(
            "SELECT id FROM loans WHERE member_id = ? AND group_id = ? AND status IN ('pending', 'active', 'approved')",
            [memberId, groupId]
        )
        return rows.length > 0
    },

    async create(groupId, memberId, amount, loanDate, dueDate, purpose) {
        const [res] = await pool.query(
            `INSERT INTO loans (group_id, member_id, principal_amount, outstanding_balance, loan_date, due_date, purpose)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [groupId, memberId, amount, amount, loanDate, dueDate, purpose]
        )
        return res.insertId
    }
}

module.exports = Loan
