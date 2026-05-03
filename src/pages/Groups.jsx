import { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Topbar  from "../Components/Topbar";
import Members from "../Components/Members";

export default function Groups() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ background:"#FFFFFF", minHeight:"100vh", fontFamily:"Arial, sans-serif" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Groups" />
      <div style={{ padding:"20px 16px 80px" }}>
        <Members />
      </div>

      <div style={{
        position:"fixed", bottom:0, left:0, right:0,
        background:"#FFFFFF", borderTop:"1px solid #E0E0E0",
        display:"flex", justifyContent:"space-around",
        padding:"10px 0 12px", zIndex:50,
      }}>
      </div>
    </div>
  );
}