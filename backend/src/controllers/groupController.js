const { pool } = require('../config/database')
const jwt = require('jsonwebtoken')

// re-sign the user's JWT after a group create/join/switch so groupId+role are fresh
function freshToken(user, groupId, role) {
    return jwt.sign(
        { id: user.id, fullName: user.fullName, email: user.email, role, groupId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )
}

function genCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)]
    }
    return code
}

exports.createGroup = async (req, res) => {
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()

        const { groupName, description, monthlyContribution, interestRate } = req.body

        if (!groupName) {
            conn.release()
            return res.status(400).json({ success: false, message: 'Group name is required' })
        }

        // make sure code is unique
        let code = genCode()
        let [check] = await conn.query('SELECT id FROM motshelo_groups WHERE group_code = ?', [code])
        while (check.length > 0) {
            code = genCode()
            ;[check] = await conn.query('SELECT id FROM motshelo_groups WHERE group_code = ?', [code])
        }

        const monthly = monthlyContribution || 1000.00
        const rate = interestRate || 20.00

        const [gResult] = await conn.query(
            'INSERT INTO motshelo_groups (group_name, group_code, description, monthly_contribution, interest_rate, created_by) VALUES (?, ?, ?, ?, ?, ?)',
            [groupName, code, description || '', monthly, rate, req.user.id]
        )

        const gId = gResult.insertId

        // creator becomes admin of THIS group (they can also be admin/member of others)
        await conn.query(
            'INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)',
            [gId, req.user.id, 'admin']
        )

        await conn.commit()
        conn.release()

        // switch the user's active group to the new one
        const token = freshToken(req.user, gId, 'admin')

        res.status(201).json({
            success: true,
            message: 'Group created!',
            token,
            group: { id: gId, groupName, groupCode: code, monthlyContribution: monthly, interestRate: rate }
        })
    } catch (err) {
        await conn.rollback()
        conn.release()
        console.log('createGroup error', err)
        res.status(500).json({ success: false, message: 'Failed to create group' })
    }
}

exports.joinGroup = async (req, res) => {
    try {
        const { groupCode } = req.body
        if (!groupCode) {
            return res.status(400).json({ success: false, message: 'Group code required' })
        }

        const [groups] = await pool.query(
            'SELECT * FROM motshelo_groups WHERE group_code = ? AND is_active = 1',
            [groupCode.toUpperCase()]
        )
        if (groups.length === 0) {
            return res.status(404).json({ success: false, message: 'Invalid group code' })
        }

        const grp = groups[0]

        // dont let them join the same group twice
        const [already] = await pool.query(
            'SELECT id FROM group_members WHERE group_id = ? AND user_id = ?',
            [grp.id, req.user.id]
        )
        if (already.length > 0) {
            return res.status(409).json({ success: false, message: 'You are already in this group' })
        }

        await pool.query(
            'INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)',
            [grp.id, req.user.id, 'member']
        )

        // joining a group makes it the active one
        const token = freshToken(req.user, grp.id, 'member')

        res.json({
            success: true,
            message: 'Joined group!',
            token,
            group: { id: grp.id, groupName: grp.group_name, groupCode: grp.group_code }
        })
    } catch (err) {
        console.log('joinGroup error', err)
        res.status(500).json({ success: false, message: 'Failed to join group' })
    }
}

// list every group the user is in - used by the switcher dropdown
exports.getMyGroups = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT mg.id, mg.group_name, mg.group_code, gm.role, gm.joined_at
             FROM group_members gm
             JOIN motshelo_groups mg ON mg.id = gm.group_id
             WHERE gm.user_id = ? AND gm.is_active = 1
             ORDER BY gm.joined_at DESC`,
            [req.user.id]
        )
        const groups = rows.map(r => ({
            id: r.id,
            groupName: r.group_name,
            groupCode: r.group_code,
            role: r.role,
            joinedAt: r.joined_at
        }))
        res.json({ success: true, groups })
    } catch (err) {
        console.log('getMyGroups err', err)
        res.status(500).json({ success: false, message: 'Failed to list groups' })
    }
}

// switch active group - returns a new JWT with the chosen groupId + role baked in
exports.switchGroup = async (req, res) => {
    try {
        const { groupId } = req.body
        if (!groupId) return res.status(400).json({ success: false, message: 'groupId required' })

        // make sure the user is actually a member of that group
        const [rows] = await pool.query(
            `SELECT gm.role, mg.group_name, mg.group_code
             FROM group_members gm
             JOIN motshelo_groups mg ON mg.id = gm.group_id
             WHERE gm.user_id = ? AND gm.group_id = ? AND gm.is_active = 1`,
            [req.user.id, groupId]
        )
        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: 'You are not in that group' })
        }
        const m = rows[0]
        const token = freshToken(req.user, parseInt(groupId), m.role)

        res.json({
            success: true,
            token,
            group: { id: parseInt(groupId), groupName: m.group_name, groupCode: m.group_code, role: m.role }
        })
    } catch (err) {
        console.log('switchGroup err', err)
        res.status(500).json({ success: false, message: 'Failed to switch group' })
    }
}

exports.getMyGroup = async (req, res) => {
    try {
        const gId = req.user.groupId
        if (!gId) {
            return res.status(404).json({ success: false, message: 'You are not in a group yet' })
        }

        const [rows] = await pool.query('SELECT * FROM motshelo_groups WHERE id = ?', [gId])
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Group not found' })
        }

        const g = rows[0]

        const [cnt] = await pool.query(
            'SELECT COUNT(*) as total FROM group_members WHERE group_id = ? AND is_active = 1',
            [gId]
        )

        res.json({
            success: true,
            group: {
                id: g.id,
                groupName: g.group_name,
                groupCode: g.group_code,
                description: g.description,
                monthlyContribution: g.monthly_contribution,
                interestRate: g.interest_rate,
                targetInterest: g.target_interest,
                memberCount: cnt[0].total,
                createdAt: g.created_at
            }
        })
    } catch (err) {
        console.log('getMyGroup error', err)
        res.status(500).json({ success: false, message: 'Failed to get group' })
    }
}
