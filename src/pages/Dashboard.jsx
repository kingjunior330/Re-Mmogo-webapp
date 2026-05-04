import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Correct component imports (based on your structure)
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import ReportCard from "../Components/ReportCard";

// ❗ REMOVE this if you don’t actually have a context
// import { useApp } from "../context/AppContext";

function Dashboard() {
  const navigate = useNavigate();

  // ❗ TEMP DATA (replace later with backend or context)
  const loans = [];
  const contributions = [];
  const activity = [];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ===== Stats =====
  const totalContributions = contributions
    .filter((c) => c.status === "Approved")
    .reduce((sum, c) => sum + c.amount, 0);

  const activeLoans = loans.filter(
    (l) => l.status === "Active" || l.status === "Pending"
  ).length;

  const pendingApprovals =
    loans.filter((l) => l.status === "Pending").length +
    contributions.filter((c) => c.status === "Pending").length;

  // ===== Savings =====
  const savingsTarget = 100000;
  const savedSoFar = totalContributions;
  const remaining = Math.max(0, savingsTarget - savedSoFar);

  const percent =
    savingsTarget === 0
      ? 0
      : Math.min(100, Math.round((savedSoFar / savingsTarget) * 100));

  // ===== Date =====
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ===== Navigation =====
  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Topbar */}
      <Topbar
        toggleSidebar={() => setSidebarOpen((prev) => !prev)}
        title="Dashboard"
      />

      {/* Content */}
      <div className="content">
        <div className="welcome-row">
          <h3>Welcome back!</h3>
          <span>📅 {dateStr}</span>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <ReportCard
            title="Total Contributions"
            value={`P${totalContributions.toLocaleString()}`}
          />
          <ReportCard title="Active Loans" value={activeLoans} />
          <ReportCard title="Pending Approvals" value={pendingApprovals} />
        </div>

        {/* Savings */}
        <div className="savings-box">
          <h4>Savings Target</h4>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>

          <p>
            P{savedSoFar.toLocaleString()} / P{savingsTarget.toLocaleString()}
          </p>
          <p>Remaining: P{remaining.toLocaleString()}</p>
        </div>

        {/* Quick Actions */}
        <div className="quick-box">
          <h4>Quick Actions</h4>
          <button onClick={() => goTo("/contributions")}>
            Add Payment
          </button>
          <button onClick={() => goTo("/loans")}>
            Apply Loan
          </button>
          <button onClick={() => goTo("/groups")}>
            Manage Group
          </button>
          <button onClick={() => goTo("/reports")}>
            View Reports
          </button>
        </div>

        {/* Activity */}
        <div className="activity-box">
          <h4>Recent Activity</h4>

          {activity.length === 0 ? (
            <p>No activity yet</p>
          ) : (
            activity.map((a) => (
              <div key={a.id}>
                <p>{a.text}</p>
                <span>{a.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;