const { pool } = require('../config/database')

exports.getYearEndReport = async (req, res) => {
    try {
        const gId = req.user.groupId
        if (!gId) return res.status(400).json({ success: false, message: 'Not in a group' })

        const year = req.query.year || new Date().getFullYear()

        const [members] = await pool.query(
            `SELECT u.id, u.full_name FROM group_members gm
             JOIN users u ON u.id = gm.user_id
             WHERE gm.group_id = ? AND gm.is_active = 1`,
            [gId]
        )

        const [contribs] = await pool.query(
            `SELECT member_id, SUM(amount) as total FROM contributions
             WHERE group_id = ? AND status = 'approved' AND YEAR(month_year) = ?
             GROUP BY member_id`,
            [gId, year]
        )

        const [loans] = await pool.query(
            `SELECT member_id, SUM(principal_amount) as total FROM loans
             WHERE group_id = ? AND status IN ('active', 'paid') AND YEAR(loan_date) = ?
             GROUP BY member_id`,
            [gId, year]
        )

        const [repayments] = await pool.query(
            `SELECT lr.member_id, SUM(lr.amount) as total_repaid
             FROM loan_repayments lr
             JOIN loans l ON l.id = lr.loan_id
             WHERE l.group_id = ? AND lr.status = 'approved' AND YEAR(lr.payment_date) = ?
             GROUP BY lr.member_id`,
            [gId, year]
        )

        // build lookup tables
        const cMap = {}
        for (let i = 0; i < contribs.length; i++) {
            cMap[contribs[i].member_id] = parseFloat(contribs[i].total)
        }

        const lMap = {}
        for (let i = 0; i < loans.length; i++) {
            lMap[loans[i].member_id] = parseFloat(loans[i].total)
        }

        const rMap = {}
        for (let i = 0; i < repayments.length; i++) {
            const r = repayments[i]
            rMap[r.member_id] = parseFloat(r.total_repaid) * 0.1667
        }

        const reportData = []
        for (let i = 0; i < members.length; i++) {
            const m = members[i]
            const contributions = cMap[m.id] || 0
            const totalLoans = lMap[m.id] || 0
            const interest = parseFloat((rMap[m.id] || 0).toFixed(2))
            reportData.push({
                id: m.id,
                memberName: m.full_name,
                totalContributions: contributions,
                totalBorrowed: totalLoans,
                interestEarned: interest,
                metTarget: interest >= 5000
            })
        }

        res.json({ success: true, members: reportData, year })
    } catch (err) {
        console.log('yearEndReport err', err)
        res.status(500).json({ success: false, message: 'Failed to generate report' })
    }
}
