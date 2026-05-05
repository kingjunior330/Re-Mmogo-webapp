import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../styles/design.css";
import "../styles/LoanApplication.css";

export default function LoanApplication() {
  const navigate = useNavigate();
  const { apiFetch } = useApp();

  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [purpose, setPurpose] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const interestRate = 20;

  const interestAmount =
    amount && term ? Number(amount) * (interestRate / 100) * Number(term) : 0;

  const totalRepayment = amount ? Number(amount) + interestAmount : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (!amount || Number(amount) <= 0) {
      setMsg("Enter a valid loan amount.");
      return;
    }

    if (!term || Number(term) <= 0) {
      setMsg("Enter a valid loan term.");
      return;
    }

    if (!purpose.trim()) {
      setMsg("Enter the loan purpose.");
      return;
    }

    setLoading(true);

    const res = await apiFetch("/loans", {
      method: "POST",
      body: JSON.stringify({
        amount: Number(amount),
        term: Number(term),
        purpose: purpose.trim(),
        dueDate,
      }),
    });

    if (res.ok) {
      setMsg("success:Loan application submitted. Awaiting approval.");
      setTimeout(() => navigate("/loans"), 1000);
    } else {
      setMsg(res.data.message || "Could not submit loan application.");
    }

    setLoading(false);
  }

  const isSuccess = msg.startsWith("success:");

  return (
    <div className="loan-app-page">
      <div className="card">
        <h3 className="section-title">Apply for a Loan</h3>

        <p className="loan-note">
          Loans are charged at <strong>20% interest per month</strong> and must
          be approved before release.
        </p>

        <form onSubmit={handleSubmit} className="loan-application-form">
          <div className="field-group">
            <label className="field-label">Loan Amount (BWP)</label>
            <input
              className="input-field"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Example: 4000"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Loan Term (Months)</label>
            <input
              className="input-field"
              type="number"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Example: 2"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Purpose</label>
            <input
              className="input-field"
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Why do you need this loan?"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Due Date</label>
            <input
              className="input-field"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {msg && (
            <p className={`form-msg ${isSuccess ? "success" : "error"}`}>
              {msg.replace("success:", "")}
            </p>
          )}

          <div className="loan-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/loans")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="card calculator-card">
        <h3 className="section-title">Loan Calculator</h3>

        <div className="calc-row">
          <span>Amount Requested</span>
          <strong>P{Number(amount || 0).toLocaleString()}</strong>
        </div>

        <div className="calc-row">
          <span>Interest Rate</span>
          <strong>{interestRate}% per month</strong>
        </div>

        <div className="calc-row">
          <span>Interest Amount</span>
          <strong>P{interestAmount.toLocaleString()}</strong>
        </div>

        <div className="calc-row total-row">
          <span>Total Repayment</span>
          <strong>P{totalRepayment.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
}