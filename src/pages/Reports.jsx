import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import '../styles/design.css'
import '../styles/Reports.css'

export default function Reports() {
  const { apiFetch } = useApp()

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    apiFetch('/reports/year-end').then(res => {
      if (res.ok) {
        setReport(res.data)
      } else {
        setErr(res.data.message || 'Could not load report')
      }
      setLoading(false)
    })
  }, [apiFetch])

  if (loading) return (
    <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--text-sub)' }}>
      Loading report…
    </div>
  )

  if (err) return <div className="card form-msg error">{err}</div>

  const rows = report?.members || []

  // totals
  let totalContrib = 0
  let totalInterest = 0
  let totalLoans = 0
  for (let i = 0; i < rows.length; i++) {
    totalContrib  += Number(rows[i].totalContributions || 0)
    totalInterest += Number(rows[i].interestEarned || 0)
    totalLoans    += Number(rows[i].totalBorrowed || 0)
  }

  // top contributor
  let topMember = null
  for (let i = 0; i < rows.length; i++) {
    if (!topMember || Number(rows[i].totalContributions) > Number(topMember.totalContributions)) {
      topMember = rows[i]
    }
  }

  let metTarget = 0
  for (let i = 0; i < rows.length; i++) {
    if (Number(rows[i].interestEarned) >= 5000) metTarget++
  }

  return (
    <div className="reports-page">

      <div className="reports-cards">
        <div className="rep-card rep-blue">
          <p className="rep-card-label">Total Contributions</p>
          <p className="rep-card-val">P{totalContrib.toLocaleString()}</p>
        </div>
        <div className="rep-card rep-green">
          <p className="rep-card-label">Total Interest</p>
          <p className="rep-card-val">P{totalInterest.toLocaleString()}</p>
        </div>
        <div className="rep-card rep-orange">
          <p className="rep-card-label">Total Loans</p>
          <p className="rep-card-val">P{totalLoans.toLocaleString()}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Member Year-End Breakdown</h3>
        {rows.length === 0 ? (
          <p className="empty-note">No data yet — contributions and loans will appear here.</p>
        ) : (
          <div className="rep-table-wrap">
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Contributions</th>
                  <th>Loans</th>
                  <th>Interest</th>
                  <th>Target Met</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const c = Number(r.totalContributions || 0)
                  const l = Number(r.totalBorrowed || 0)
                  const ie = Number(r.interestEarned || 0)
                  return (
                    <tr key={i}>
                      <td>{r.memberName || '—'}</td>
                      <td>P{c.toLocaleString()}</td>
                      <td>P{l.toLocaleString()}</td>
                      <td>P{ie.toLocaleString()}</td>
                      <td>
                        {ie >= 5000
                          ? <span className="badge badge-approved">✓ Yes</span>
                          : <span className="badge badge-pending">Not yet</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="card">
          <h3 className="section-title">🏆 Year-End Highlights</h3>
          <div className="highlights-grid">
            <div className="highlight-item">
              <span className="h-icon">🏆</span>
              <div>
                <p className="h-label">Highest Contributor</p>
                <p className="h-val">{topMember?.memberName || '—'}</p>
              </div>
            </div>
            <div className="highlight-item">
              <span className="h-icon">🎯</span>
              <div>
                <p className="h-label">Target (P5 000 interest)</p>
                <p className="h-val">{metTarget} / {rows.length} members met it</p>
              </div>
            </div>
            <div className="highlight-item">
              <span className="h-icon">👥</span>
              <div>
                <p className="h-label">Total Members</p>
                <p className="h-val">{rows.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
