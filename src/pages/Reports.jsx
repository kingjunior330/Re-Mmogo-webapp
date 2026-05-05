import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import "../styles/design.css";
import "../styles/Reports.css";

export default function Reports() {
  const { apiFetch } = useApp();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadReport() {
      const res = await apiFetch("/reports/year-end");

      if (res.ok) {
        setReport(res.data);
      } else {
        setErr(res.data.message || "Could not load report.");
      }

      setLoading(false);
    }

    loadReport();
  }, []);

  if (loading) {
    return <div className="card loading-card">Loading report...</div>;
  }

  if (err) {
    return <div className="card form-msg error">{err}</div>;
  }

  const rows = report?.members || [];

  const totalContributions = rows.reduce(
    (sum, row) => sum + Number(row.totalContributions || 0),
    0
  );

  const totalInterest = rows.reduce(
    (sum, row) => sum + Number(row.interestEarned || 0),
    0
  );

  const totalLoans = rows.reduce(
    (sum, row) => sum + Number(row.totalBorrowed || 0),
    0
  );

  const topMember = rows.reduce((best, row) => {
    if (!best) return row;
    return Number(row.totalContributions || 0) >
      Number(best.totalContributions || 0)
      ? row
      : best;
  }, null);

  const metTarget = rows.filter(
    (row) => Number(row.interestEarned || 0) >= 5000
  ).length;

  return (
    <div className="reports-page">
      <div className="reports-cards">
        <div className="rep-card rep-blue">
          <p>Total Contributions</p>
          <h2>P{totalContributions.toLocaleString()}</h2>
        </div>

        <div className="rep-card rep-green">
          <p>Total Interest</p>
          <h2>P{totalInterest.toLocaleString()}</h2>
        </div>

        <div className="rep-card rep-orange">
          <p>Total Loans</p>
          <h2>P{totalLoans.toLocaleString()}</h2>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Member Year-End Breakdown</h3>

        {rows.length === 0 ? (
          <p className="empty-note">
            No data yet. Contributions and loans will appear here.
          </p>
        ) : (
          <div className="rep-table-wrap">
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Contributions</th>
                  <th>Loans</th>
                  <th>Interest</th>
                  <th>Target Met</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => {
                  const contributions = Number(row.totalContributions || 0);
                  const loans = Number(row.totalBorrowed || 0);
                  const interest = Number(row.interestEarned || 0);

                  return (
                    <tr key={index}>
                      <td>{row.memberName || "—"}</td>
                      <td>P{contributions.toLocaleString()}</td>
                      <td>P{loans.toLocaleString()}</td>
                      <td>P{interest.toLocaleString()}</td>
                      <td>
                        {interest >= 5000 ? (
                          <span className="badge badge-approved">Yes</span>
                        ) : (
                          <span className="badge badge-pending">Not yet</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div className="card">
          <h3 className="section-title">🏆 Year-End Highlights</h3>

          <div className="highlights-grid">
            <div className="highlight-item">
              <span>🏆</span>
              <div>
                <p>Highest Contributor</p>
                <h4>{topMember?.memberName || "—"}</h4>
              </div>
            </div>

            <div className="highlight-item">
              <span>🎯</span>
              <div>
                <p>P5 000 Interest Target</p>
                <h4>
                  {metTarget} / {rows.length} members met it
                </h4>
              </div>
            </div>

            <div className="highlight-item">
              <span>👥</span>
              <div>
                <p>Total Members</p>
                <h4>{rows.length}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}