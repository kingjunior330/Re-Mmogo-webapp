import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoanApplication.css";

function LoanApplication() {
  const navigate = useNavigate();

  // form state
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // calculator state
  const [calcAmount, setCalcAmount] = useState("");
  const [calcTerm, setCalcTerm] = useState("");
  const [interest, setInterest] = useState(null);
  const [monthly, setMonthly] = useState(null);
  const [total, setTotal] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!amount || !term || !reason) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (Number(amount) <= 0) {
      setMessage("Amount must be greater than 0.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/loans/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          term: Number(term),
          reason: reason
        })
      });

      if (!res.ok) {
        throw new Error("Application failed");
      }

      setMessage("Application submitted. Waiting for signatory approval.");
      setTimeout(() => navigate("/loans"), 1500);

    } catch (err) {
      setMessage("Something went wrong. Try again.");
    }

    setSubmitting(false);
  }

  // 20% per month on balance - matches motshelo rule
  function calculate() {
    let p = Number(calcAmount);
    let months = Number(calcTerm);

    if (!p || !months) {
      setInterest(0);
      setMonthly(0);
      setTotal(0);
      return;
    }

    let totalInterest = p * 0.20 * months;
    let totalRepay = p + totalInterest;
    let perMonth = totalRepay / months;

    setInterest(totalInterest.toFixed(2));
    setMonthly(perMonth.toFixed(2));
    setTotal(totalRepay.toFixed(2));
  }

  return (
    <div className="loan-app-page">

      <header className="topbar">
        <button className="menu-btn">&#9776;</button>
        <h2 className="topbar-title">📝 Loans Application</h2>
      </header>

      <main className="content">
        <p className="intro">Apply for loans and track your repayments.</p>

        <form className="apply-form" onSubmit={handleSubmit}>

          <label>Amount (BWP)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder=""
          />

          <label>Term</label>
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="e.g 6 months"
          />

          <label>Reason for Loan</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <p className="note">
            Note: your loan will be reviewed by group signatories shortly.
            You'll be notified if approved.
          </p>

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Application"}
          </button>

          {message && <p className="form-msg">{message}</p>}
        </form>

        {/* calculator */}
        <div className="calculator">
          <h4 className="calc-title">Loan Interest Calculator</h4>

          <label>Loan Amount</label>
          <input
            type="number"
            value={calcAmount}
            onChange={(e) => setCalcAmount(e.target.value)}
            placeholder="100"
          />

          <label>Term</label>
          <input
            type="text"
            value={calcTerm}
            onChange={(e) => setCalcTerm(e.target.value)}
            placeholder="e.g 6 months"
          />

          <button type="button" className="btn-calc" onClick={calculate}>
            Calculate
          </button>

          <div className="calc-results">
            <div className="calc-row">
              <span>Interest (20%):</span>
              <span>{interest !== null ? `P${interest}` : ""}</span>
            </div>
            <div className="calc-row">
              <span>Monthly repayment:</span>
              <span>{monthly !== null ? `P${monthly}` : ""}</span>
            </div>
            <div className="calc-row total-row">
              <span>Total Repayment:</span>
              <span>{total !== null ? `P${total}` : ""}</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default LoanApplication;
