import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../styles/design.css";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loans, contributions, activity, fetchLoans, fetchContributions } =
    useApp();

  useEffect(() => {
    fetchLoans();
    fetchContributions();
  }, []);

  const totalContributions = contributions
    .filter((item) => item.status === "approved")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const activeLoans = loans.filter((loan) =>
    ["active", "approved"].includes(loan.status)
  ).length;

  const pendingApprovals =
    loans.filter((loan) => loan.status === "pending").length +
    contributions.filter((item) => item.status === "pending").length;

  const target = 100000;
  const percentage = Math.min(
    Math.round((totalContributions / target) * 100),
    100
  );

  const today = new Date();
  const dateText = today.toLocaleDateString("en-BW", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  function getIcon(type) {
    if (type === "contribution") return "💵";
    if (type === "loan") return "💰";
    if (type === "member") return "👤";
    return "📌";
  }

  return (
    <div className="dashboard-page">
      <div className="dash-welcome">
        <div>
          <h2>
            Welcome back
            {user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}!
          </h2>
          <p>📅 {dateText}</p>
        </div>
      </div>

      <div className="dash-stats">
        <div className="stat-card">
          <p>Total Contributions</p>
          <h3>P{totalContributions.toLocaleString()}</h3>
        </div>

        <div className="stat-card">
          <p>Active Loans</p>
          <h3>{activeLoans}</h3>
        </div>

        <div className="stat-card">
          <p>Pending Approvals</p>
          <h3>{pendingApprovals}</h3>
        </div>
      </div>

      <div className="card dash-section">
        <h3 className="section-title">Savings Target</h3>

        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${percentage}%` }} />
        </div>

        <div className="progress-labels">
          <span>P{totalContributions.toLocaleString()} saved</span>
          <span>{percentage}%</span>
        </div>

        <p className="progress-note">
          P{Math.max(target - totalContributions, 0).toLocaleString()} more to
          reach the P{target.toLocaleString()} year-end target.
        </p>
      </div>

      <div className="card dash-section">
        <h3 className="section-title">Quick Actions</h3>

        <div className="quick-grid">
          <button onClick={() => navigate("/contributions")}>
            💵
            <br />
            Add Payment
          </button>

          <button onClick={() => navigate("/loans/apply")}>
            💰
            <br />
            Apply Loan
          </button>

          <button onClick={() => navigate("/groups")}>
            👥
            <br />
            Manage Group
          </button>

          <button onClick={() => navigate("/reports")}>
            📈
            <br />
            View Reports
          </button>
        </div>
      </div>

      <div className="card dash-section">
        <h3 className="section-title">Recent Activity</h3>

        {activity.length === 0 ? (
          <p className="empty-note">
            No activity yet. Start by adding a contribution or applying for a
            loan.
          </p>
        ) : (
          <div className="activity-list">
            {activity.slice(0, 8).map((item) => (
              <div className="activity-row" key={item.id}>
                <span>{getIcon(item.type)}</span>
                <p>{item.text}</p>
                <small>{item.time}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}