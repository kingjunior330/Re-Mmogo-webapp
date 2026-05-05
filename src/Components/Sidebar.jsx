import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { icon: "📊", label: "Dashboard", path: "/dashboard" },
  { icon: "👥", label: "Groups", path: "/groups" },
  { icon: "💵", label: "Contributions", path: "/contributions" },
  { icon: "💰", label: "Loans", path: "/loans" },
  { icon: "✅", label: "Approvals", path: "/approvals" },
  { icon: "📈", label: "Reports", path: "/reports" },
  { icon: "👤", label: "Members", path: "/members" },
  { icon: "⚙️", label: "Settings", path: "/settings" },
];

export default function Sidebar({ open, onClose, onLogout }) {
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 99,
          }}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : "-270px",
          width: "250px",
          height: "100vh",
          background: "#ffffff",
          boxShadow: "4px 0 16px rgba(0,0,0,0.15)",
          transition: "left 0.3s ease",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "#90BDF9",
            padding: "20px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "26px" }}>👥</span>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#000" }}>
            Re-Mmogo
          </span>
        </div>

        <nav style={{ flex: 1, padding: "10px 0" }}>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "13px 20px",
                  textDecoration: "none",
                  background: active ? "#E3F2FD" : "transparent",
                  borderLeft: active
                    ? "4px solid #1976D2"
                    : "4px solid transparent",
                  fontSize: "15px",
                  color: "#000",
                  fontWeight: active ? 700 : 400,
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={onLogout}
          style={{
            padding: "16px 20px",
            border: "none",
            borderTop: "1px solid #E0E0E0",
            background: "white",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            fontSize: "15px",
            color: "#000",
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: "20px" }}>🚪</span>
          <span>Log Out</span>
        </button>
      </aside>
    </>
  );
}