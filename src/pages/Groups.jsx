import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Groups() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [groups, setGroups] = useState([
    { id: 1, name: "Dirang ke Pele", members: 8, pool: 48000 },
    { id: 2, name: "Boitshoko Savers", members: 12, pool: 72000 },
  ]);

  const [selected, setSelected] = useState(null);

  return (
    <div className="app">

      <Sidebar open={sidebarOpen} />
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <h1>My Groups</h1>
      <p>Manage your group members.</p>

      {/* GROUP LIST */}
      {groups.map(g => (
        <div key={g.id} className="card" onClick={() => setSelected(g)}>
          <h3>{g.name}</h3>
          <p>P{g.pool}</p>
          <p>{g.members} members</p>
        </div>
      ))}

      {/* GROUP DETAILS */}
      {selected && (
        <div className="modal">
          <div className="modal-content">

            <button onClick={() => setSelected(null)}>X</button>

            <h2>{selected.name}</h2>
            <p>Members: {selected.members}</p>
            <p>Pool: P{selected.pool}</p>

            {/* ❌ NO REPORT BUTTON */}
          </div>
        </div>
      )}

    </div>
  );
}