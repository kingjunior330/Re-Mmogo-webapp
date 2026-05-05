import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import "../styles/design.css";
import "../styles/Contributions.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatMonth(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return value;
  }

  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export default function Contributions() {
  const { contributions, fetchContributions, apiFetch } = useApp();

  const currentYear = new Date().getFullYear();

  const [amount, setAmount] = useState("1000");
  const [month, setMonth] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContributions(true);
  }, []);

  const approvedContributions = contributions.filter(
    (contribution) => contribution.status === "approved"
  );

  const pendingContributions = contributions.filter(
    (contribution) => contribution.status === "pending"
  );

  const totalPaid = approvedContributions.reduce(
    (sum, contribution) => sum + Number(contribution.amount || 0),
    0
  );

  const pendingTotal = pendingContributions.reduce(
    (sum, contribution) => sum + Number(contribution.amount || 0),
    0
  );

  const currentMonth = new Date().toISOString().slice(0, 7);

  const thisMonthTotal = contributions
    .filter((contribution) => {
      const contributionMonth =
        contribution.monthYear ||
        contribution.month_year ||
        contribution.contribution_month;

      return contributionMonth?.slice(0, 7) === currentMonth;
    })
    .reduce((sum, contribution) => sum + Number(contribution.amount || 0), 0);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!month) {
      setMsg("Please select a month.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMsg("Enter a valid amount.");
      return;
    }

    setLoading(true);
    setMsg("");

    const { ok, data } = await apiFetch("/contributions", {
      method: "POST",
      body: JSON.stringify({
        amount: Number(amount),
        monthYear: month,
        paymentReference,
      }),
    });

    if (ok) {
      setMsg("success:Contribution submitted! Awaiting approval.");
      setAmount("1000");
      setMonth("");
      setPaymentReference("");
      fetchContributions(true);
    } else {
      setMsg(data.message || "Could not submit contribution.");
    }

    setLoading(false);
  }

  const isSuccess = msg.startsWith("success:");
  const displayMsg = isSuccess ? msg.replace("success:", "") : msg;

  return (
    <div className="contrib-page">
      <div className="card contrib-summary">
        <p className="contrib-sum-label">Total Contributed This Year</p>
        <p className="contrib-sum-amount">P{totalPaid.toLocaleString()}.00</p>
        <p className="contrib-sum-sub">
          {approvedContributions.length} approved payments
        </p>
      </div>

      <div className="summary-grid">
        <div className="card summary-mini-card">
          <h4>Total Paid</h4>
          <p>P{totalPaid.toLocaleString()}</p>
        </div>

        <div className="card summary-mini-card">
          <h4>This Month</h4>
          <p>P{thisMonthTotal.toLocaleString()}</p>
        </div>

        <div className="card summary-mini-card">
          <h4>Pending Approval</h4>
          <p>P{pendingTotal.toLocaleString()}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Record New Contribution</h3>

        <form onSubmit={handleSubmit} className="contrib-form">
          <div className="contrib-form-grid">
            <div className="field-group">
              <label className="field-label">Amount (BWP)</label>
              <input
                className="input-field"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Month</label>
              <select
                className="input-field"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Select month</option>
                {MONTHS.map((monthName, index) => {
                  const value = `${currentYear}-${String(index + 1).padStart(
                    2,
                    "0"
                  )}-01`;

                  return (
                    <option key={monthName} value={value}>
                      {monthName} {currentYear}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Payment Reference</label>
            <input
              className="input-field"
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="Example: EFT12345 / Cash / Bank ref"
            />
          </div>

          {displayMsg && (
            <p className={`form-msg ${isSuccess ? "success" : "error"}`}>
              {displayMsg}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "+ Submit Contribution"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="section-title">Payment History</h3>

        {contributions.length === 0 ? (
          <p className="empty-note">No contributions recorded yet.</p>
        ) : (
          <div className="history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reference</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {contributions.map((contribution) => {
                  const contributionMonth =
                    contribution.monthYear ||
                    contribution.month_year ||
                    contribution.contribution_month;

                  const reference =
                    contribution.paymentReference ||
                    contribution.payment_reference ||
                    "—";

                  const createdAt =
                    contribution.createdAt ||
                    contribution.created_at ||
                    contribution.date;

                  return (
                    <tr key={contribution.id}>
                      <td>{formatMonth(contributionMonth)}</td>
                      <td>P{Number(contribution.amount || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${contribution.status}`}>
                          {contribution.status}
                        </span>
                      </td>
                      <td>{reference}</td>
                      <td>{createdAt ? createdAt.split("T")[0] : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}