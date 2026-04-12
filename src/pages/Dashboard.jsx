import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app">
      <Sidebar open={sidebarOpen} />
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <h1>Dashboard</h1>
      <p>Overview of your savings and activity.</p>
    </div>
  );
}