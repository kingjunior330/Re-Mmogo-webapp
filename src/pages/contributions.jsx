import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../styles/Contributions.css";

function Contributions() {

  const navigate = useNavigate();
  const { contributions, addContribution } = useApp();

  //form state
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [proof, setProof] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);


  //my contributions only - filter out others
  const myContributions = contributions.filter((c) => c.member === "Me");


  //work out how much they've paid in total (approved only)
  const totalPaid = myContributions
    .filter((c) => c.status === "Approved")
    .reduce((sum, c) => sum + c.amount, 0);


  function handleSubmit(e) {
    e.preventDefault();

    if (amount === "" || month === "") {
      setMsg("Please fill in amount and month");
      return;
    }

    if (Number(amount) <= 0) {
      setMsg("Amount must be more than 0");
      return;
    }

    //rule says P1000 per month, warn if they're paying something weird
    if (Number(amount) !== 1000) {
      let ok = window.confirm("The monthly contribution is P1000. Are you sure you want to pay P" + amount + "?");
      if (!ok) return;
    }

    setLoading(true);

    //today's date for the record
    const today = new Date();
    const dateStr = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

    addContribution({
      amount: Number(amount),
      member: "Me",
      date: dateStr,
      month: month,
      proof: proof
    });

    setMsg("Contribution recorded. Waiting for approval.");

    //clear form
    setAmount("");
    setMonth("");
    setProof("");

    setLoading(false);
  }


  return (
    <div className="contrib-page">

      <div className="topbar">
        <button className="menu-btn">&#9776;</button>
        <h2>💵 Contributions</h2>
      </div>

      <div className="content">

        <p className="intro">Record your monthly contribution to the motshelo.</p>


        {/* summary card */}
        <div className="summary-card">
          <p className="summary-label">Total contributed this year</p>
          <p className="summary-amount">P{totalPaid.toLocaleString()}.00</p>
        </div>


        <form onSubmit={handleSubmit} className="contrib-form">

          <h4>Record New Contribution</h4>

          <label>Amount (BWP)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
          />

          <label>Month</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">-- select month --</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>

          <label>Proof of payment (reference number)</label>
          <input
            type="text"
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            placeholder="e.g FNB reference 123456"
          />

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Recording..." : "Record Contribution"}
          </button>

          {msg && <p className="form-msg">{msg}</p>}
        </form>


        {/* my history */}
        <div className="history-box">
          <h4>My Contributions</h4>

          {myContributions.length === 0 ? (
            <p className="empty-msg">No contributions recorded yet.</p>
          ) : (
            myContributions.map((c) => (
              <div className="history-item" key={c.id}>
                <div>
                  <p className="hist-main">{c.month || c.date} - P{c.amount}</p>
                  {c.proof && <p className="hist-ref">Ref: {c.proof}</p>}
                </div>
                <span className={"status-tag " + c.status.toLowerCase()}>
                  {c.status}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

export default Contributions;
