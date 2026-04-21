import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../styles/Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();
  const { loans, contributions, activity } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);


  const totalContributions = contributions
    .filter((c) => c.status === "Approved")
    .reduce((sum, c) => sum + c.amount, 0);

  const activeLoans = loans.filter((l) => l.status === "Active" || l.status === "Pending").length;

  const pendingApprovals =
    loans.filter((l) => l.status === "Pending").length +
    contributions.filter((c) => c.status === "Pending").length;

  const savingsTarget = 100000;
  const savedSoFar = totalContributions;


  const today = new Date();
  const day = today.getDate();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateStr = day + " " + months[today.getMonth()] + " " + today.getFullYear();


  function getPercent() {
    if (savingsTarget === 0) return 0;
    let p = (savedSoFar / savingsTarget) * 100;
    return Math.round(p);
  }

  const remaining = savingsTarget - savedSoFar;


  function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
  }

  function goTo(path) {
    navigate(path);
    setSidebarOpen(false);
  }


  function getIcon(type) {
    if (type === "contribution") return "✅";
    if (type === "loan") return "💰";
    if (type === "member") return "👤";
    return "📌";
  }


  //on desktop sidebar is always visible via CSS, on mobile only when toggled
  const showSidebar = sidebarOpen;


  return (
    <div className="dashboard-page">

      {/* sidebar - always rendered on desktop via CSS, toggled on mobile */}
      <div className="sidebar" style={{ display: showSidebar ? "flex" : "" }}>
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <span className="logo-icon">👥</span>
            <p>Re- Mmogo</p>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li className="active" onClick={() => goTo("/dashboard")}>📊 Dashboard</li>
          <li onClick={() => goTo("/groups")}>👥 Groups</li>
          <li onClick={() => goTo("/contributions")}>💵 Contributions</li>
          <li onClick={() => goTo("/loans")}>💰 Loans</li>
          <li onClick={() => goTo("/approvals")}>✅ Approvals</li>
          <li onClick={() => goTo("/reports")}>📈 Reports</li>
        </ul>

        <div className="sidebar-bottom">
          <button onClick={() => goTo("/login")} className="logout-btn">
            👤 Log Out
          </button>
        </div>
      </div>


      <div className="main-area">

        <div className="topbar">
          <button className="menu-btn" onClick={toggleSidebar}>&#9776;</button>
          <span className="topbar-logo">👥 Re- Mmogo</span>
          <div className="topbar-right">
            <span>🔔</span>
            <span>👤</span>
          </div>
        </div>


        <div className="content">

          <div className="welcome-row">
            <h3>Welcome back!</h3>
            <span className="date">📅 {dateStr}</span>
          </div>


          <div className="stats-grid">
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


          <div className="savings-box">
            <h4>Savings Target</h4>

            <div className="progress-row">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: getPercent() + "%" }}
                ></div>
              </div>
              <span className="percent">{getPercent()}%</span>
            </div>

            <p className="savings-note">
              P{savedSoFar.toLocaleString()} saved out of P{savingsTarget.toLocaleString()} target!
            </p>
            <p className="savings-note">
              Need P{remaining.toLocaleString()} more to reach year-end goal.
            </p>
          </div>


          <div className="quick-box">
            <h4>Quick Actions</h4>
            <div className="quick-grid">
              <button className="quick-btn" onClick={() => goTo("/contributions")}>Add Payment</button>
              <button className="quick-btn" onClick={() => goTo("/loans/apply")}>Apply Loan</button>
              <button className="quick-btn" onClick={() => goTo("/groups")}>Manage Group</button>
              <button className="quick-btn" onClick={() => goTo("/reports")}>View Reports</button>
            </div>
          </div>


          <div className="activity-box">
            <h4>Recent Activity</h4>

            {activity.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "13px", color: "#666", padding: "10px" }}>
                No activity yet. Start by applying for a loan or adding a contribution.
              </p>
            ) : (
              activity.map((a) => (
                <div className="activity-item" key={a.id}>
                  <p>
                    <span className="activity-icon">{getIcon(a.type)}</span>
                    {a.text}
                  </p>
                  <span className="activity-time">{a.time}</span>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
