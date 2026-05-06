import React, { useEffect, useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/design.css'
import '../styles/Members.css'

export default function MembersPage() {
    const { apiFetch, user } = useApp()
    const [members, setMembers] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('member')
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const loadMembers = useCallback(async () => {
        const res = await apiFetch('/members')
        if (res.ok) setMembers(res.data.members)
    }, [apiFetch])

    useEffect(() => {
        const timer = setTimeout(() => {
            loadMembers()
        }, 0)

        return () => clearTimeout(timer)
    }, [loadMembers])

    async function handleEnroll(e) {
        e.preventDefault()
        setMsg('')
        if (!email) { setMsg('Email is required'); return }
        setLoading(true)
        const res = await apiFetch('/members', {
            method: 'POST',
            body: JSON.stringify({ email, role })
        })
        if (res.ok) {
            setMsg('success:' + (res.data.message || 'Member added'))
            setEmail('')
            setRole('member')
            setShowForm(false)
            loadMembers()
        } else {
            setMsg(res.data.message || 'Failed to add member')
        }
        setLoading(false)
    }

    const canAdd = user && (user.role === 'signatory' || user.role === 'admin')
    const isSuccess = msg.startsWith('success:')

    return (
        <div className="members-page">

            <div className="members-toprow">
                <h2 className="section-title" style={{ margin: 0 }}>Group Members</h2>
                {canAdd && (
                    <button className="btn-primary"
                        style={{ width: 'auto', padding: '9px 18px', fontSize: 13 }}
                        onClick={() => { setShowForm(!showForm); setMsg('') }}>
                        {showForm ? 'Cancel' : '+ Add Member'}
                    </button>
                )}
            </div>

            {/* enroll form */}
            {showForm && (
                <div className="card">
                    <h3 className="section-title">Enroll New Member</h3>
                    <form onSubmit={handleEnroll} className="enroll-form">
                        <div className="field-group">
                            <label className="field-label">Member Email</label>
                            <input className="input-field" type="email" value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="member@email.com" />
                            <p className="field-hint">They must have registered an account first</p>
                        </div>
                        <div className="field-group">
                            <label className="field-label">Role</label>
                            <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                                <option value="member">Member</option>
                                <option value="signatory">Signatory</option>
                            </select>
                        </div>
                        {msg && (
                            <p className={`form-msg ${isSuccess ? 'success' : 'error'}`}>
                                {msg.replace('success:', '')}
                            </p>
                        )}
                        <button type="submit" className="btn-primary"
                            style={{ alignSelf: 'flex-start', width: 'auto', padding: '10px 24px' }}
                            disabled={loading}>
                            {loading ? 'Adding…' : 'Add Member'}
                        </button>
                    </form>
                </div>
            )}

            {/* success msg outside form */}
            {msg && !showForm && (
                <p className={`form-msg ${isSuccess ? 'success' : 'error'}`}>
                    {msg.replace('success:', '')}
                </p>
            )}

            {/* members table */}
            <div className="card">
                <h3 className="section-title">
                    All Members ({members.length})
                </h3>
                <div className="members-table-wrap">
                    <table className="members-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="empty-note" style={{ padding: '24px', textAlign: 'center' }}>
                                        No members yet.
                                    </td>
                                </tr>
                            ) : (
                                members.map(m => (
                                    <tr key={m.id}>
                                        <td className="m-name">{m.fullName || m.full_name}</td>
                                        <td className="m-email">{m.email}</td>
                                        <td>
                                            <span className={`badge badge-${m.role}`}>{m.role}</span>
                                        </td>
                                        <td>
                                            {m.isActive || m.is_active
                                                ? <span className="badge badge-approved">Active</span>
                                                : <span className="badge badge-rejected">Inactive</span>
                                            }
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}
