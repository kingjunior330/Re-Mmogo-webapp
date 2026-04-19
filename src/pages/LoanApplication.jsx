import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "../context/AppContext";
import "../styles/LoanApplication.css";

function LoanApplication() {

  const navigate = useNavigate();
  const { addLoan } = useApp();

  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState('');
  const [reason, setReason] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  //calculator
  const [calcAmt, setCalcAmt] = useState("");
  const [calcTerm, setCalcTerm] = useState("");
  const [result, setResult] = useState({ interest: "", monthly: "", total: "" });


  const handleSubmit = (e) => {
    e.preventDefault();

    if (amount === "" || term === "" || reason === "") {
      setMsg("Please fill in all the fields");
      return;
    }

    if (Number(amount) <= 0) {
      setMsg("Enter a valid amount");
      return;
    }

    setLoading(true);

    //work out due date based on term (assume term is in months)
    let months = parseInt(term);
    if (isNaN(months)) months = 6; //default if they wrote weird stuff

    const due = new Date();
    due.setMonth(due.getMonth() + months);
    const dueStr = due.getDate() + "/" + (due.getMonth() + 1) + "/" + due.getFullYear();

    //push to context
    addLoan({
      amount: Number(amount),
      term: term,
      reason: reason,
      member: "Me",
      dueDate: dueStr
    });

    setMsg("Submitted! Waiting for signatory approval.");

    setTimeout(() => {
      navigate("/loans");
    }, 1200);

    setLoading(false);
  }


  function doCalc() {
    let p = Number(calcAmt);
    let m = Number(calcTerm);

    if (!p || !m) return;

    let intr = p * 0.2 * m;
    let tot = p + intr;
    let perMonth = tot / m;

    setResult({
      interest: intr.toFixed(2),
      monthly: perMonth.toFixed(2),
      total: tot.toFixed(2)
    });
  }


  return (
    <div className="loan-app-page">

      <div className="topbar">
        <button className="menu-btn">&#9776;</button>
        <h2>📝 Loans Application</h2>
      </div>

      <div className="content">

        <p className="intro">Apply for loans and track your repayments.</p>

        <form onSubmit={handleSubmit} className="apply-form">

          <label>Amount (BWP)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>Term</label>
          <input
            type="text"
            placeholder="e.g 6 months"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
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

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>

          {msg && <p className="form-msg">{msg}</p>}
        </form>


        <div className="calculator">
          <h4>Loan Interest Calculator</h4>

          <label>Loan Amount</label>
          <input
            type="number"
            value={calcAmt}
            onChange={(e) => setCalcAmt(e.target.value)}
            placeholder="100"
          />

          <label>Term</label>
          <input
            type="text"
            value={calcTerm}
            onChange={(e) => setCalcTerm(e.target.value)}
            placeholder="e.g 6 months"
          />

          <button type="button" className="btn-calc" onClick={doCalc}>
            Calculate
          </button>

          <div className="calc-results">
            <div className="calc-row">
              <span>Interest(20%)</span>
              <span>{result.interest && "P" + result.interest}</span>
            </div>
            <div className="calc-row">
              <span>Monthly repayment</span>
              <span>{result.monthly && "P" + result.monthly}</span>
            </div>
            <div className="calc-row total-row">
              <span>Total Repayment</span>
              <span>{result.total && "P" + result.total}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoanApplication;
