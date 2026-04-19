import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../styles/Loans.css";

function Loans() {

  const navigate = useNavigate();
  const { loans } = useApp();

  //split loans into active vs history based on status
  const active = loans.filter((l) => l.status === "Active" || l.status === "Pending");
  const history = loans.filter((l) => l.status === "Approved" || l.status === "Repaid");


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

        <div className="loans-layout">

          <div>
            <h3 className="section-heading">Active loans</h3>

            <div className="active-loans-grid">
              {active.length === 0 ? (
                <p className="empty-msg">You have no active loans yet. Click above to apply.</p>
              ) : (
                active.map((loan) => (
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
            </div>
          </div>

          <div className="history-box">
            <h4 className="history-title">Loan History</h4>

            {history.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "13px", color: "#666" }}>
                No past loans yet.
              </p>
            ) : (
              history.map((h) => (
                <div className="history-item" key={h.id}>
                  <span>{h.dueDate} - P{h.amount}</span>
                  <span className="approved">✅ {h.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default Loans;
