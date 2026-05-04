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

  return (
    <div className="loans-page">

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
