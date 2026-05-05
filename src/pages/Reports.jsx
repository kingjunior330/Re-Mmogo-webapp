<<<<<<< HEAD
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
  }, [])

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
=======
import { useState }  from "react";
import Sidebar        from "../Components/Sidebar";
import Topbar         from "../Components/Topbar";
import ReportCard     from "../Components/ReportCard";

function calculateTotals(members) {
  return {
    totalContributions: members.reduce((s, m) => s + m.contributions, 0),
    totalLoans:         members.reduce((s, m) => s + m.loans, 0),
    totalInterest:      members.reduce((s, m) => s + m.interest, 0),
  };
}

function getHighlights(members) {
  if (members.length === 0) return { highest: null, lowest: null };
  const sorted = [...members].sort((a, b) => b.interest - a.interest);
  return { highest: sorted[0], lowest: sorted[sorted.length - 1] };
}

const inputStyle = {
  display:"block", width:"100%", padding:"10px 12px",
  margin:"4px 0 12px", border:"2px solid #1976D2",
  borderRadius:"10px", fontSize:"14px",
  fontFamily:"Arial, sans-serif",
  boxSizing:"border-box", outline:"none",
  background:"#FFFFFF", color:"#000",
};

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [members, setMembers]         = useState([]);
  const [form, setForm]               = useState({ name:"", contributions:"", loans:"", interest:"" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addMember() {
    if (!form.name) return alert("Name is required");
    setMembers([...members, {
      name:          form.name,
      contributions: parseFloat(form.contributions) || 0,
      loans:         Number(form.loans)              || 0,
      interest:      parseFloat(form.interest)       || 0,
    }]);
    setForm({ name:"", contributions:"", loans:"", interest:"" });
  }

  const { totalContributions, totalLoans, totalInterest } = calculateTotals(members);
  const { highest, lowest } = getHighlights(members);

  return (
    <div style={{ background:"#FFFFFF", minHeight:"100vh", fontFamily:"Arial, sans-serif" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Reports" />
      <div style={{ padding:"20px 16px" }}>
        <h2 style={{ fontSize:"20px", margin:"0 0 20px", color:"#000" }}>Reports</h2>

        <div style={{ background:"#A2B1EE", borderRadius:"10px", padding:"16px", marginBottom:"20px" }}>
          <h3 style={{ margin:"0 0 12px", fontSize:"15px", color:"#000" }}>Add Member Data</h3>
          <label style={{ fontSize:"13px", fontWeight:600 }}>Name</label>
          <input name="name"          value={form.name}          onChange={handleChange} placeholder="Name"          style={inputStyle} />
          <label style={{ fontSize:"13px", fontWeight:600 }}>Contributions</label>
          <input name="contributions" value={form.contributions} onChange={handleChange} placeholder="Contributions" style={inputStyle} type="number" />
          <label style={{ fontSize:"13px", fontWeight:600 }}>Loans</label>
          <input name="loans"         value={form.loans}         onChange={handleChange} placeholder="Loans"         style={inputStyle} type="number" />
          <label style={{ fontSize:"13px", fontWeight:600 }}>Interest</label>
          <input name="interest"      value={form.interest}      onChange={handleChange} placeholder="Interest"      style={inputStyle} type="number" />
          <button onClick={addMember} style={{ width:"100%", padding:"12px", background:"#54D22E", color:"#fff", border:"none", borderRadius:"10px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>
            Add Member
          </button>
        </div>

        <ReportCard title="Total Contributions" value={`P${totalContributions.toLocaleString()}`} />
        <ReportCard title="Total Loans"         value={`P${totalLoans.toLocaleString()}`}         />
        <ReportCard title="Total Interest"      value={`P${totalInterest.toLocaleString()}`}      />

        {highest && (
          <div style={{ margin:"16px 0" }}>
            <ReportCard title="Highest Earner" value={highest.name} />
            <ReportCard title="Lowest Earner"  value={lowest.name}  />
          </div>
        )}

        {members.length > 0 && (
          <>
            <h3 style={{ margin:"20px 0 10px", fontSize:"16px", color:"#000" }}>Members List</h3>
            <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #E0E0E0" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", background:"#1976D2", padding:"10px", gap:"4px" }}>
                {["Name","Contributions","Loans","Interest"].map(h => (
                  <span key={h} style={{ fontSize:"12px", fontWeight:700, color:"#fff" }}>{h}</span>
                ))}
              </div>
              {members.map((m, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", padding:"10px", gap:"4px", background:i%2===0?"#fff":"#F5F8FF", borderTop:"1px solid #E8E8E8" }}>
                  <span style={{ fontSize:"12px", fontWeight:600 }}>{m.name}</span>
                  <span style={{ fontSize:"12px" }}>P{m.contributions}</span>
                  <span style={{ fontSize:"12px" }}>P{m.loans}</span>
                  <span style={{ fontSize:"12px" }}>P{m.interest}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
>>>>>>> 0f4c486d5ef9116b6607bc75475090d7e1249489
