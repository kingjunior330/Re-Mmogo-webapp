import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../styles/Loans.css";

function Loans() {
  const navigate = useNavigate();
  const { loans, updateLoan } = useApp();
  
  // SIMPLE STATE FOR REPAYMENT
  const [repayingLoanId, setRepayingLoanId] = useState(null);  // Which loan is being repaid?
  const [repayAmount, setRepayAmount] = useState("");          // How much to repay?

  const active = loans.filter((l) => l.status === "Active" || l.status === "Pending");
  const history = loans.filter((l) => l.status === "Approved" || l.status === "Repaid");

  function handleApply() {
    navigate("/loans/apply");
  }

  // SIMPLE REPAYMENT FUNCTION
  function handleRepayment(loan) {
    const amount = Number(repayAmount);
    const newBalance = loan.amountLeft - amount;
    
    // Check if amount is valid
    if (amount <= 0) {
      alert("Enter an amount greater than 0");
      return;
    }
    if (amount > loan.amountLeft) {
      alert("You can't repay more than you owe");
      return;
    }
    
    // Update the loan balance
    const updatedLoan = {
      ...loan,
      amountLeft: newBalance,
      status: newBalance === 0 ? "Repaid" : "Active"
    };
    
    updateLoan(updatedLoan);
    
    // Reset form
    setRepayingLoanId(null);
    setRepayAmount("");
    
    alert(`Paid P${amount}. Remaining: P${newBalance}`);
  }

  return (
    <div className="loans-page">
      <header className="topbar">
        <button className="menu-btn">☰</button>
        <h2 className="topbar-title">💰 Loans</h2>
      </header>

      <main className="content">
        <p className="intro">Apply for loans and track your repayments.</p>
        <button className="btn-apply" onClick={handleApply}>+ Apply for loan</button>

        <div className="loans-layout">
          {/* ACTIVE LOANS SECTION */}
          <div>
            <h3 className="section-heading">Active loans</h3>
            <div className="active-loans-grid">
              {active.length === 0 ? (
                <p>No active loans yet. Click above to apply.</p>
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
                        <span>P{loan.amountLeft}</span>
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

                    {/* REPAYMENT SECTION - SIMPLE */}
                    {repayingLoanId === loan.id ? (
                      <div className="repay-form">
                        <input 
                          type="number"
                          placeholder="Enter amount"
                          value={repayAmount}
                          onChange={(e) => setRepayAmount(e.target.value)}
                        />
                        <button onClick={() => handleRepayment(loan)}>Submit</button>
                        <button onClick={() => setRepayingLoanId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <button 
                        className="repay-btn"
                        onClick={() => setRepayingLoanId(loan.id)}
                      >
                        Make Repayment
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* LOAN HISTORY SECTION */}
          <div className="history-box">
            <h4 className="history-title">Loan History</h4>
            {history.length === 0 ? (
              <p>No past loans yet.</p>
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