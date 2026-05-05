<<<<<<< HEAD
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import '../styles/design.css'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, loans, contributions, activity, fetchLoans, fetchContributions } = useApp()

  useEffect(() => {
    fetchLoans()
    fetchContributions()
  }, [])

  const totalContributions = contributions
    .filter(c => c.status === 'approved')
    .reduce((sum, c) => sum + Number(c.amount), 0)

  const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'approved').length
  const pendingApprovals =
    loans.filter(l => l.status === 'pending').length +
    contributions.filter(c => c.status === 'pending').length

  const target = 100000
  const pct = Math.min(Math.round((totalContributions / target) * 100), 100)

  const today = new Date()
  const dateStr = today.getDate() + ' ' +
    ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][today.getMonth()] +
    ' ' + today.getFullYear()

  function icon(type) {
    if (type === 'contribution') return '💵'
    if (type === 'loan') return '💰'
    if (type === 'member') return '👤'
    return '📌'
  }

  return (
    <div className="dash">

      {/* welcome row */}
      <div className="dash-welcome">
        <div>
          <h2 className="dash-greeting">Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!</h2>
          <p className="dash-date">📅 {dateStr}</p>
        </div>
      </div>

      {/* stat cards */}
      <div className="dash-stats">
        <div className="stat-card">
          <p className="stat-label">Total Contributions</p>
          <p className="stat-value">P{totalContributions.toLocaleString()}.00</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active Loans</p>
          <p className="stat-value">{activeLoans}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending Approvals</p>
          <p className="stat-value">{pendingApprovals}</p>
        </div>
      </div>

      {/* savings progress */}
      <div className="card dash-section">
        <h3 className="section-title">Savings Target</h3>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: pct + '%' }} />
        </div>
        <div className="progress-labels">
          <span className="p-saved">P{totalContributions.toLocaleString()} saved</span>
          <span className="p-pct">{pct}%</span>
        </div>
        <p className="progress-note">
          P{(target - totalContributions).toLocaleString()} more to reach the P{target.toLocaleString()} year-end target
        </p>
      </div>

      {/* quick actions */}
      <div className="card dash-section">
        <h3 className="section-title">Quick Actions</h3>
        <div className="quick-grid">
          <button className="quick-btn" onClick={() => navigate('/contributions')}>💵<br/>Add Payment</button>
          <button className="quick-btn" onClick={() => navigate('/loans/apply')}>💰<br/>Apply Loan</button>
          <button className="quick-btn" onClick={() => navigate('/groups')}>👥<br/>Manage Group</button>
          <button className="quick-btn" onClick={() => navigate('/reports')}>📈<br/>View Reports</button>
        </div>
      </div>

      {/* recent activity */}
      <div className="card dash-section">
        <h3 className="section-title">Recent Activity</h3>
        {activity.length === 0 ? (
          <p className="empty-note">No activity yet. Start by applying for a loan or adding a contribution.</p>
        ) : (
          <div className="activity-list">
            {activity.slice(0, 8).map(a => (
              <div className="activity-row" key={a.id}>
                <span className="activity-ico">{icon(a.type)}</span>
                <span className="activity-txt">{a.text}</span>
                <span className="activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
=======
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
>>>>>>> 0f4c486d5ef9116b6607bc75475090d7e1249489
