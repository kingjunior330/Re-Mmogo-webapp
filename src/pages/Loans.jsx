import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../styles/design.css";
import "../styles/Loans.css";

export default function Loans() {
  const navigate = useNavigate();
  const { loans, fetchLoans, apiFetch } = useApp();

  const [repaying, setRepaying] = useState(null);
  const [repayAmount, setRepayAmount] = useState("");
  const [repayRef, setRepayRef] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoans(true);
  }, []);

  const activeLoans = loans.filter((loan) =>
    ["active", "pending", "approved"].includes(loan.status)
  );

  const historyLoans = loans.filter((loan) =>
    ["paid", "rejected"].includes(loan.status)
  );

  async function submitRepayment(loanId) {
    if (!repayAmount || Number(repayAmount) <= 0) {
      setMsg("Enter a valid repayment amount.");
      return;
    }

    setLoading(true);
    setMsg("");

    const res = await apiFetch(`/loans/${loanId}/repayments`, {
      method: "POST",
      body: JSON.stringify({
        amount: Number(repayAmount),
        paymentReference: repayRef,
      }),
    });

    if (res.ok) {
      setMsg("success:Repayment submitted. Awaiting approval.");
      setRepaying(null);
      setRepayAmount("");
      setRepayRef("");
      fetchLoans(true);
    } else {
      setMsg(res.data.message || "Could not submit repayment.");
    }

    setLoading(false);
  }

  const isSuccess = msg.startsWith("success:");

  return (
    <div className="loans-page">
      <div className="loans-top">
        <p>Apply for loans and track your repayments.</p>

        <button
          className="btn-apply-loan"
          onClick={() => navigate("/loans/apply")}
        >
          + Apply for Loan
        </button>
      </div>

      {msg && (
        <p className={`form-msg ${isSuccess ? "success" : "error"}`}>
          {msg.replace("success:", "")}
        </p>
      )}

      <div className="card">
        <h3 className="section-title">Active Loans</h3>

        {activeLoans.length === 0 ? (
          <p className="empty-note">
            No active loans. Click “Apply for Loan” to get started.
          </p>
        ) : (
          <div className="loan-cards">
            {activeLoans.map((loan) => {
              const principal =
                loan.principalAmount || loan.principal_amount || loan.amount || 0;

              const balance =
                loan.outstandingBalance ||
                loan.outstanding_balance ||
                loan.amountLeft ||
                0;

              const interest =
                loan.interestAccrued || loan.interest_accrued || 0;

              return (
                <div className="loan-card" key={loan.id}>
                  <div className="loan-card-top">
                    <div>
                      <p className="loan-purpose">
                        {loan.purpose || loan.reason || "General loan"}
                      </p>
                      <p className="loan-amount">
                        P{Number(principal).toLocaleString()}
                      </p>
                    </div>

                    <span className={`badge badge-${loan.status}`}>
                      {loan.status}
                    </span>
                  </div>

                  <div className="loan-meta">
                    <div className="loan-meta-row">
                      <span>Balance remaining</span>
                      <strong>P{Number(balance).toLocaleString()}</strong>
                    </div>

                    <div className="loan-meta-row">
                      <span>Interest</span>
                      <strong>P{Number(interest).toLocaleString()}</strong>
                    </div>

                    <div className="loan-meta-row">
                      <span>Due date</span>
                      <strong>{loan.dueDate || loan.due_date || "—"}</strong>
                    </div>
                  </div>

                  {loan.status === "active" && (
                    <>
                      {repaying === loan.id ? (
                        <div className="repay-form">
                          <input
                            className="input-field"
                            type="number"
                            value={repayAmount}
                            onChange={(e) => setRepayAmount(e.target.value)}
                            placeholder="Amount (BWP)"
                          />

                          <input
                            className="input-field"
                            type="text"
                            value={repayRef}
                            onChange={(e) => setRepayRef(e.target.value)}
                            placeholder="Payment reference"
                          />

                          <div className="repay-actions">
                            <button
                              className="btn-primary"
                              onClick={() => submitRepayment(loan.id)}
                              disabled={loading}
                            >
                              {loading ? "Submitting..." : "Submit Repayment"}
                            </button>

                            <button
                              className="btn-cancel"
                              onClick={() => setRepaying(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn-repay"
                          onClick={() => setRepaying(loan.id)}
                        >
                          Make Repayment
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="section-title">Loan History</h3>

        {historyLoans.length === 0 ? (
          <p className="empty-note">No loan history yet.</p>
        ) : (
          <div className="loan-history">
            {historyLoans.map((loan) => (
              <div className="history-item" key={loan.id}>
                <div>
                  <strong>{loan.purpose || loan.reason || "Loan"}</strong>
                  <p>P{Number(loan.amount || loan.principalAmount || 0).toLocaleString()}</p>
                </div>

                <span className={`badge badge-${loan.status}`}>
                  {loan.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}