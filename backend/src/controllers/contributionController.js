const { pool } = require('../config/database')

function normalizeMonthYearInput(value) {
    if (!value) return null

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    if (/^\d{4}-\d{2}$/.test(value)) return `${value}-01`

    const trimmed = String(value).trim()
    const monthNames = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ]

    const [monthPart, yearPart] = trimmed.split(/\s+/)
    const monthIndex = monthNames.indexOf((monthPart || '').toLowerCase())
    const parsedYear = yearPart ? Number(yearPart) : new Date().getFullYear()

    if (monthIndex === -1 || Number.isNaN(parsedYear)) return null

    return `${parsedYear}-${String(monthIndex + 1).padStart(2, '0')}-01`
}

function formatMonthYear(dateValue) {
    if (!dateValue) return null

    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return null

    return date.toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    })
}

exports.getContributions = async (req, res) => {
    try {
        const gId = req.user.groupId
        if (!gId) return res.status(400).json({ success: false, message: 'Not in a group' })

        // optional filter - get my contributions only
        const mine = req.query.mine === 'true'

        let query = `SELECT c.*, u.full_name as member_name,
                     a.full_name as approver_name
                     FROM contributions c
                     JOIN users u ON u.id = c.member_id
                     LEFT JOIN users a ON a.id = c.approved_by
                     WHERE c.group_id = ?`
        const params = [gId]

        if (mine) {
            query += ' AND c.member_id = ?'
            params.push(req.user.id)
        }

        query += ' ORDER BY c.created_at DESC'

        const [rows] = await pool.query(query, params)

        const contribs = rows.map(r => ({
            id: r.id,
            amount: r.amount,
            monthYear: formatMonthYear(r.month_year),
            monthYearRaw: r.month_year,
            paymentReference: r.payment_reference,
            status: r.status,
            memberName: r.member_name,
            memberId: r.member_id,
            approverName: r.approver_name,
            approvedAt: r.approved_at,
            createdAt: r.created_at
        }))

        res.json({ success: true, contributions: contribs })
    } catch (err) {
        console.log('getContributions err', err)
        res.status(500).json({ success: false, message: 'Failed to get contributions' })
    }
}

exports.submitContribution = async (req, res) => {
    try {
        const gId = req.user.groupId
        if (!gId) return res.status(400).json({ success: false, message: 'Not in a group' })

        const { amount, monthYear, paymentReference, proofUrl } = req.body
        const normalizedMonthYear = normalizeMonthYearInput(monthYear)

        if (!amount || !normalizedMonthYear) {
            return res.status(400).json({ success: false, message: 'Amount and month are required' })
        }

        // check if already submitted for this month
        const [dup] = await pool.query(
            'SELECT id FROM contributions WHERE member_id = ? AND month_year = ?',
            [req.user.id, normalizedMonthYear]
        )
        if (dup.length > 0) {
            return res.status(409).json({ success: false, message: 'Already submitted a contribution for this month' })
        }

        const [result] = await pool.query(
            `INSERT INTO contributions (group_id, member_id, amount, month_year, payment_reference, proof_of_payment_url, initiated_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [gId, req.user.id, amount, normalizedMonthYear, paymentReference || '', proofUrl || '', req.user.id]
        )

        res.status(201).json({
            success: true,
            message: 'Contribution submitted, waiting for approval',
            id: result.insertId
        })
    } catch (err) {
        console.log('submitContribution err', err)
        res.status(500).json({ success: false, message: 'Failed to submit contribution' })
    }
}

exports.approveContribution = async (req, res) => {
    try {
        const contribId = req.params.id
        const gId = req.user.groupId

        const [rows] = await pool.query('SELECT * FROM contributions WHERE id = ?', [contribId])
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Contribution not found' })
        }

        const c = rows[0]

        if (c.group_id !== gId) {
            return res.status(403).json({ success: false, message: 'Not your group' })
        }

        if (c.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Contribution is not pending' })
        }

        await pool.query(
            "UPDATE contributions SET status = 'approved', approved_by = ?, approved_at = NOW() WHERE id = ?",
            [req.user.id, contribId]
        )

        res.json({ success: true, message: 'Contribution approved' })
    } catch (err) {
        console.log('approveContrib err', err)
        res.status(500).json({ success: false, message: 'Failed to approve' })
    }
}

exports.rejectContribution = async (req, res) => {
    try {
        const contribId = req.params.id
        const gId = req.user.groupId

        const [rows] = await pool.query('SELECT * FROM contributions WHERE id = ?', [contribId])
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Not found' })
        }

        const c = rows[0]
        if (c.group_id !== gId) {
            return res.status(403).json({ success: false, message: 'Not your group' })
        }
        if (c.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Not pending' })
        }

        await pool.query(
            "UPDATE contributions SET status = 'rejected', approved_by = ?, approved_at = NOW() WHERE id = ?",
            [req.user.id, contribId]
        )

        res.json({ success: true, message: 'Contribution rejected' })
    } catch (err) {
        console.log('rejectContrib err', err)
        res.status(500).json({ success: false, message: 'Failed to reject' })
    }
}
