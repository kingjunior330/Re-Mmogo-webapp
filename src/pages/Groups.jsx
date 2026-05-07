import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/design.css'
import '../styles/Groups.css'

export default function Groups() {
  const { user, members, fetchMembers, apiFetch } = useApp()

  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchMembers() }, [fetchMembers])

  async function handleAdd(e) {
    e.preventDefault()
    if (!email) { setMsg('Enter an email address'); return }
    setLoading(true)
    const { ok, data } = await apiFetch('/members', {
      method: 'POST',
      body: JSON.stringify({ email, role })
    })
    if (ok) {
      setMsg('success:Member added!')
      setEmail(''); setRole('member')
      fetchMembers()
      setTimeout(() => { setShowForm(false); setMsg('') }, 1200)
    } else {
      setMsg(data.message || 'Could not add member')
    }
    setLoading(false)
  }

  // admin can promote a member to signatory or demote a signatory back to member
  // backend enforces the 2-approver cap (admin counts as one)
  async function updateRole(memberId, newRole) {
    setLoading(true); setMsg('')
    const { ok, data } = await apiFetch(`/members/${memberId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole })
    })
    if (ok) {
      setMsg('success:Role updated')
      fetchMembers()
      setTimeout(() => setMsg(''), 2000)
    } else {
      setMsg(data.message || 'Could not update role')
    }
    setLoading(false)
  }

  const groupCode = user?.groupCode || '—'
  const groupName = user?.groupName || 'My Group'
  const isAdmin = user?.role === 'admin'

  return (
    <div className="groups-page">

      {/* group info card */}
      <div className="card group-info-card">
        <div className="group-info-row">
          <div>
            <p className="group-info-label">Group Name</p>
            <p className="group-info-value">{groupName}</p>
          </div>
          <div>
            <p className="group-info-label">Invite Code</p>
            <p className="group-code">{groupCode}</p>
          </div>
          <div>
            <p className="group-info-label">Members</p>
            <p className="group-info-value">{members.length}</p>
          </div>
        </div>
        <p className="group-hint">Share the invite code with new members so they can join.</p>
      </div>

      {/* member table */}
      <div className="card">
        <div className="members-header">
          <h3 className="section-title" style={{ margin: 0 }}>Members</h3>
          {(user?.role === 'admin' || user?.role === 'signatory') && (
            <button className="btn-add-member" onClick={() => { setShowForm(!showForm); setMsg('') }}>
              {showForm ? '✕ Cancel' : '+ Add Member'}
            </button>
          )}
        </div>

        {/* add member form */}
        {showForm && (
          <form onSubmit={handleAdd} className="add-member-form">
            <div className="field-group">
              <label className="field-label">Member Email</label>
              <input className="input-field" type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="member@email.com" />
            </div>
            <div className="field-group">
              <label className="field-label">Role</label>
              <select className="input-field" value={role} onChange={e => setRole(e.target.value)}>
                <option value="member">Member</option>
                <option value="signatory">Signatory</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: 8 }} disabled={loading}>
              {loading ? 'Adding…' : 'Add Member'}
            </button>
          </form>
        )}

        {msg && (
          <p className={`form-msg ${msg.startsWith('success') ? 'success' : 'error'}`}
             style={{ margin: '10px 0' }}>
            {msg.replace('success:', '')}
          </p>
        )}

        {/* table */}
        <div className="members-table-wrap">
          <table className="members-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {members.length === 0 && (
                <tr><td colSpan={isAdmin ? 6 : 5} className="empty-cell">No members yet</td></tr>
              )}
              {members.map((m, i) => (
                <tr key={m.id || i}>
                  <td>{i + 1}</td>
                  <td>{m.fullName || m.name || '—'}</td>
                  <td className="email-td">{m.email}</td>
                  <td><span className={`badge badge-${m.role}`}>{m.role}</span></td>
                  <td><span className="badge badge-approved">Active</span></td>
                  {isAdmin && (
                    <td>
                      {/* cant change your own role */}
                      {m.id === user.id ? (
                        <span style={{ color: 'var(--text-sub)', fontSize: 12 }}>—</span>
                      ) : m.role === 'member' ? (
                        <button
                          onClick={() => updateRole(m.id, 'signatory')}
                          disabled={loading}
                          style={{
                            padding: '6px 10px', fontSize: 12, borderRadius: 6,
                            background: '#22c55e', color: 'white', border: 'none', cursor: 'pointer'
                          }}>
                          Make Signatory
                        </button>
                      ) : m.role === 'signatory' ? (
                        <button
                          onClick={() => updateRole(m.id, 'member')}
                          disabled={loading}
                          style={{
                            padding: '6px 10px', fontSize: 12, borderRadius: 6,
                            background: '#f59e0b', color: 'white', border: 'none', cursor: 'pointer'
                          }}>
                          Demote
                        </button>
                      ) : null}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
