import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/groups": "My Group",
  "/contributions": "Contributions",
  "/loans": "Loans",
  "/loans/apply": "Loan Application",
  "/approvals": "Approvals",
  "/reports": "Reports",
  "/members": "Members",
  "/settings": "Settings",
};

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useApp();

  const title = PAGE_TITLES[location.pathname] || "Re-Mmogo";

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F6FF",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Topbar
        title={title}
        toggleSidebar={() => setSidebarOpen(true)}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main
        style={{
          padding: "18px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}