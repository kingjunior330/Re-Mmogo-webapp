<<<<<<< HEAD
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/design.css'
import '../styles/Loans.css'

export default function Loans() {
  const navigate = useNavigate()
  const { loans, fetchLoans, apiFetch } = useApp()

  const [repaying, setRepaying] = useState(null) // loan id
  const [repayAmount, setRepayAmount] = useState('')
  const [repayRef, setRepayRef] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchLoans(true) }, [])

  const active = loans.filter(l => ['active', 'pending', 'approved'].includes(l.status))
  const history = loans.filter(l => ['paid', 'rejected'].includes(l.status))

  async function submitRepayment(loanId) {
    if (!repayAmount || Number(repayAmount) <= 0) { setMsg('Enter a valid amount'); return }
    setLoading(true); setMsg('')
    const { ok, data } = await apiFetch(`/loans/${loanId}/repayments`, {
      method: 'POST',
      body: JSON.stringify({ amount: Number(repayAmount), paymentReference: repayRef })
    })
    if (ok) {
      setMsg('success:Repayment submitted! Awaiting approval.')
      setRepaying(null); setRepayAmount(''); setRepayRef('')
      fetchLoans(true)
    } else {
      setMsg(data.message || 'Could not submit repayment')
    }
    setLoading(false)
  }

  const isSuccess = msg.startsWith('success:')
=======
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../loans.css";

function Loans() {
  const navigate = useNavigate();

  // active loans - will come from backend later
  const [activeLoans, setActiveLoans] = useState([
    {
      id: 1,
      amount: 4000,
      amountLeft: 3500,
      interestRate: 20,
      dueDate: "30/07/2026",
      member: "Kelvin thale",
      status: "Active"
    }
  ]);

  const [history, setHistory] = useState([
    { id: 1, date: "March 15", amount: 1000, status: "Approved" },
    { id: 2, date: "February 15", amount: 1000, status: "Approved" },
    { id: 3, date: "January 15", amount: 500, status: "Approved" }
  ]);

  // TODO: replace with real fetch once backend is up
  useEffect(() => {
    // fetch('/api/loans').then(...)
  }, []);

  function handleApply() {
    navigate("/loans/apply");
  }
>>>>>>> 0f4c486d5ef9116b6607bc75475090d7e1249489

  return (
    <div className="loans-page">

<<<<<<< HEAD
      {/* header action */}
      <div className="loans-top">
        <p className="loans-sub">Apply for loans and track your repayments.</p>
        <button className="btn-apply-loan" onClick={() => navigate('/loans/apply')}>+ Apply for Loan</button>
      </div>

      {msg && (
        <p className={`form-msg ${isSuccess ? 'success' : 'error'}`} style={{ marginBottom: 8 }}>
          {msg.replace('success:', '')}
        </p>
      )}

      {/* active loans */}
      <div className="card">
        <h3 className="section-title">Active Loans</h3>
        {active.length === 0 ? (
          <p className="empty-note">No active loans. Click "Apply for Loan" to get started.</p>
        ) : (
          <div className="loan-cards">
            {active.map(loan => (
              <div className="loan-card" key={loan.id}>
                <div className="loan-card-top">
                  <div>
                    <p className="loan-purpose">{loan.purpose || 'General loan'}</p>
                    <p className="loan-amount">P{Number(loan.principalAmount || loan.principal_amount).toLocaleString()}</p>
                  </div>
                  <span className={`badge badge-${loan.status}`}>{loan.status}</span>
                </div>

                <div className="loan-meta">
                  <div className="loan-meta-row">
                    <span>Balance remaining</span>
                    <span className="loan-balance">P{Number(loan.outstandingBalance || loan.outstanding_balance).toLocaleString()}</span>
                  </div>
                  <div className="loan-meta-row">
                    <span>Interest (20%/mo)</span>
                    <span>P{Number(loan.interestAccrued || loan.interest_accrued || 0).toLocaleString()}</span>
                  </div>
                  <div className="loan-meta-row">
                    <span>Due date</span>
                    <span>{loan.dueDate || loan.due_date || '—'}</span>
                  </div>
                </div>

                {loan.status === 'active' && (
                  repaying === loan.id ? (
                    <div className="repay-form">
                      <input className="input-field" type="number" value={repayAmount}
                        onChange={e => setRepayAmount(e.target.value)} placeholder="Amount (BWP)" />
                      <input className="input-field" type="text" value={repayRef}
                        onChange={e => setRepayRef(e.target.value)} placeholder="Payment reference" />
                      <div className="repay-actions">
                        <button className="btn-primary" style={{ flex: 1 }}
                          onClick={() => submitRepayment(loan.id)} disabled={loading}>
                          {loading ? 'Submitting…' : 'Submit Repayment'}
                        </button>
                        <button className="btn-ghost" style={{ flex: 1 }}
                          onClick={() => { setRepaying(null); setMsg('') }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button className="btn-repay" onClick={() => { setRepaying(loan.id); setMsg('') }}>
                      Make Repayment
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* loan history */}
      {history.length > 0 && (
        <div className="card">
          <h3 className="section-title">Loan History</h3>
          <div className="contrib-table-wrap">
            <table className="contrib-table">
              <thead>
                <tr><th>Purpose</th><th>Amount</th><th>Due</th><th>Status</th></tr>
              </thead>
              <tbody>
                {history.map(l => (
                  <tr key={l.id}>
                    <td>{l.purpose || '—'}</td>
                    <td>P{Number(l.principalAmount || l.principal_amount).toLocaleString()}</td>
                    <td>{l.dueDate || l.due_date || '—'}</td>
                    <td><span className={`badge badge-${l.status}`}>{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
=======
      <header className="topbar">
        <button className="menu-btn">&#9776;</button>
        <h2 className="topbar-title">💰 Loans</h2>
      </header>

      <main className="content">

        <p className="intro">Apply for loans and track your repayments.</p>

        <button className="btn-apply" onClick={handleApply}>
          + Apply for loan
        </button>

        <h3 className="section-heading">Active loans</h3>

        {activeLoans.length === 0 ? (
          <p className="empty-msg">You have no active loans.</p>
        ) : (
          activeLoans.map((loan) => (
            <div className="loan-card" key={loan.id}>
              <div className="loan-card-header">
                <span className="loan-label">Loan Amount</span>
                <span className="status-badge">{loan.status}</span>
              </div>
              <p className="loan-amount">P{loan.amount}</p>

              <div className="loan-details">
                <div className="detail-row">
                  <span>Amount left:</span>
                  <span className="amount-left">P{loan.amountLeft}</span>
                </div>
                <div className="detail-row">
                  <span>Interest rate:</span>
                  <span>{loan.interestRate}%</span>
                </div>
                <div className="detail-row">
                  <span>Due date:</span>
                  <span>{loan.dueDate}</span>
                </div>
                <div className="detail-row">
                  <span>Member:</span>
                  <span>{loan.member}</span>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="history-box">
          <h4 className="history-title">Loan History</h4>

          {history.map((h) => (
            <div className="history-item" key={h.id}>
              <span>{h.date} - P{h.amount}</span>
              <span className="approved">✅ {h.status}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

export default Loans;
>>>>>>> 0f4c486d5ef9116b6607bc75475090d7e1249489
