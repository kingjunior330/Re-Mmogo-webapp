import { useState }  from "react";
import Sidebar        from "../Components/Sidebar";
import Topbar         from "../Components/Topbar";
import ReportCard     from "../Components/ReportCard";

function calculateTotals(members) {
  return {
    totalContributions: members.reduce((s, m) => s + m.contributions, 0),
    totalLoans:         members.reduce((s, m) => s + m.loans, 0),
    totalInterest:      members.reduce((s, m) => s + m.interest, 0),
  };
}

function getHighlights(members) {
  if (members.length === 0) return { highest: null, lowest: null };
  const sorted = [...members].sort((a, b) => b.interest - a.interest);
  return { highest: sorted[0], lowest: sorted[sorted.length - 1] };
}

const inputStyle = {
  display:"block", width:"100%", padding:"10px 12px",
  margin:"4px 0 12px", border:"2px solid #1976D2",
  borderRadius:"10px", fontSize:"14px",
  fontFamily:"Arial, sans-serif",
  boxSizing:"border-box", outline:"none",
  background:"#FFFFFF", color:"#000",
};

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [members, setMembers]         = useState([]);
  const [form, setForm]               = useState({ name:"", contributions:"", loans:"", interest:"" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addMember() {
    if (!form.name) return alert("Name is required");
    setMembers([...members, {
      name:          form.name,
      contributions: parseFloat(form.contributions) || 0,
      loans:         Number(form.loans)              || 0,
      interest:      parseFloat(form.interest)       || 0,
    }]);
    setForm({ name:"", contributions:"", loans:"", interest:"" });
  }

  const { totalContributions, totalLoans, totalInterest } = calculateTotals(members);
  const { highest, lowest } = getHighlights(members);

  return (
    <div style={{ background:"#FFFFFF", minHeight:"100vh", fontFamily:"Arial, sans-serif" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Reports" />
      <div style={{ padding:"20px 16px" }}>
        <h2 style={{ fontSize:"20px", margin:"0 0 20px", color:"#000" }}>Reports</h2>

        <div style={{ background:"#A2B1EE", borderRadius:"10px", padding:"16px", marginBottom:"20px" }}>
          <h3 style={{ margin:"0 0 12px", fontSize:"15px", color:"#000" }}>Add Member Data</h3>
          <label style={{ fontSize:"13px", fontWeight:600 }}>Name</label>
          <input name="name"          value={form.name}          onChange={handleChange} placeholder="Name"          style={inputStyle} />
          <label style={{ fontSize:"13px", fontWeight:600 }}>Contributions</label>
          <input name="contributions" value={form.contributions} onChange={handleChange} placeholder="Contributions" style={inputStyle} type="number" />
          <label style={{ fontSize:"13px", fontWeight:600 }}>Loans</label>
          <input name="loans"         value={form.loans}         onChange={handleChange} placeholder="Loans"         style={inputStyle} type="number" />
          <label style={{ fontSize:"13px", fontWeight:600 }}>Interest</label>
          <input name="interest"      value={form.interest}      onChange={handleChange} placeholder="Interest"      style={inputStyle} type="number" />
          <button onClick={addMember} style={{ width:"100%", padding:"12px", background:"#54D22E", color:"#fff", border:"none", borderRadius:"10px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>
            Add Member
          </button>
        </div>

        <ReportCard title="Total Contributions" value={`P${totalContributions.toLocaleString()}`} />
        <ReportCard title="Total Loans"         value={`P${totalLoans.toLocaleString()}`}         />
        <ReportCard title="Total Interest"      value={`P${totalInterest.toLocaleString()}`}      />

        {highest && (
          <div style={{ margin:"16px 0" }}>
            <ReportCard title="Highest Earner" value={highest.name} />
            <ReportCard title="Lowest Earner"  value={lowest.name}  />
          </div>
        )}

        {members.length > 0 && (
          <>
            <h3 style={{ margin:"20px 0 10px", fontSize:"16px", color:"#000" }}>Members List</h3>
            <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #E0E0E0" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", background:"#1976D2", padding:"10px", gap:"4px" }}>
                {["Name","Contributions","Loans","Interest"].map(h => (
                  <span key={h} style={{ fontSize:"12px", fontWeight:700, color:"#fff" }}>{h}</span>
                ))}
              </div>
              {members.map((m, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", padding:"10px", gap:"4px", background:i%2===0?"#fff":"#F5F8FF", borderTop:"1px solid #E8E8E8" }}>
                  <span style={{ fontSize:"12px", fontWeight:600 }}>{m.name}</span>
                  <span style={{ fontSize:"12px" }}>P{m.contributions}</span>
                  <span style={{ fontSize:"12px" }}>P{m.loans}</span>
                  <span style={{ fontSize:"12px" }}>P{m.interest}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}