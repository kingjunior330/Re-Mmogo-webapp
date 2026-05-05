import { useState } from "react";

const INITIAL_MEMBERS = [
  { id:1, name:"T.Woza",    email:"twoza@mail.com", role:"Chair",     active:true  },
  { id:2, name:"K.Sithole", email:"ksite@mail.com", role:"Signatory", active:true  },
  { id:3, name:"M.Dlamini", email:"mdlam@mail.com", role:"Member",    active:false },
];

const inputStyle = {
  width:"100%", padding:"10px 12px",
  border:"2px solid #1976D2",
  borderRadius:"10px", fontSize:"14px",
  outline:"none", fontFamily:"Arial, sans-serif",
  boxSizing:"border-box", background:"#FFFFFF", color:"#000",
};

export default function Members() {
  const [members, setMembers]     = useState(INITIAL_MEMBERS);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData]   = useState({ fullName:"", email:"", role:"" });
  const [formError, setFormError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) { setFormError("Full name is required."); return; }
    if (!formData.email.trim())    { setFormError("Email is required.");     return; }
    if (!formData.role)            { setFormError("Please select a role.");  return; }
    setFormError("");
    setMembers([...members, { id:Date.now(), name:formData.fullName, email:formData.email, role:formData.role, active:false }]);
    setFormData({ fullName:"", email:"", role:"" });
    setShowModal(false);
  };

  return (
    <div style={{ fontFamily:"Arial, sans-serif", color:"#000" }}>
      <p style={{ fontSize:"14px", color:"#444", margin:"0 0 20px" }}>
        Manage your group members and their roles.
      </p>

      {/* + Add member button */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          width:"100%", padding:"14px",
          background:"#54D22E", color:"#FFFFFF",
          border:"none", borderRadius:"10px",
          fontSize:"16px", fontWeight:700,
          cursor:"pointer", marginBottom:"20px",
          fontFamily:"Arial, sans-serif",
        }}
      >
        + Add member
      </button>

      {/* Members table */}
      <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #E0E0E0" }}>
        <div style={{
          display:"grid", gridTemplateColumns:"1.2fr 1.8fr 1fr 0.8fr 0.7fr",
          background:"#1976D2", padding:"10px", gap:"4px",
        }}>
          {["Member","Email","Role","Status","Actions"].map(h => (
            <span key={h} style={{ fontSize:"12px", fontWeight:700, color:"#FFFFFF" }}>{h}</span>
          ))}
        </div>

        {members.map((m, i) => (
          <div key={m.id} style={{
            display:"grid", gridTemplateColumns:"1.2fr 1.8fr 1fr 0.8fr 0.7fr",
            padding:"10px", gap:"4px", alignItems:"center",
            background: i % 2 === 0 ? "#FFFFFF" : "#F5F8FF",
            borderTop:"1px solid #E8E8E8",
          }}>
            <span style={{ fontSize:"12px", fontWeight:600 }}>{m.name}</span>
            <span style={{ fontSize:"11px", color:"#555", wordBreak:"break-all" }}>{m.email}</span>
            <span style={{ fontSize:"11px" }}>{m.role}</span>
            <span style={{ fontSize:"16px" }}>{m.active ? "✅" : "⏳"}</span>
            <button style={{ background:"none", border:"none", fontSize:"18px", cursor:"pointer", color:"#555" }}>⋯</button>
          </div>
        ))}

        {/* Empty rows to match wireframe */}
        {Array.from({ length: Math.max(0, 7 - members.length) }).map((_, i) => (
          <div key={`empty-${i}`} style={{
            display:"grid", gridTemplateColumns:"1.2fr 1.8fr 1fr 0.8fr 0.7fr",
            padding:"10px", borderTop:"1px solid #E8E8E8",
            background:(members.length + i) % 2 === 0 ? "#FFFFFF" : "#F5F8FF",
            height:"38px",
          }} />
        ))}
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div
          onClick={() => { setShowModal(false); setFormError(""); }}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:1000 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background:"#A2B1EE", borderRadius:"10px 10px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:"430px", boxSizing:"border-box" }}
          >
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
              <span style={{ fontWeight:700, fontSize:"16px" }}>✏️ Add New Member</span>
              <button onClick={() => { setShowModal(false); setFormError(""); }} style={{ background:"none", border:"none", fontSize:"20px", cursor:"pointer", fontWeight:700 }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <label style={{ display:"block", fontSize:"13px", fontWeight:600, marginBottom:"5px" }}>Full Name</label>
              <input type="text"  name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full name"     style={{ ...inputStyle, marginBottom:"14px" }} />

              <label style={{ display:"block", fontSize:"13px", fontWeight:600, marginBottom:"5px" }}>Email Address</label>
              <input type="email" name="email"    value={formData.email}    onChange={handleChange} placeholder="Email address" style={{ ...inputStyle, marginBottom:"14px" }} />

              <label style={{ display:"block", fontSize:"13px", fontWeight:600, marginBottom:"5px" }}>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} style={{ ...inputStyle, marginBottom:"16px", appearance:"none" }}>
                <option value="">Select role</option>
                <option value="Chair">Chair</option>
                <option value="Signatory">Signatory</option>
                <option value="Member">Member</option>
              </select>

              {formError && (
                <div style={{ background:"#FFEBEE", color:"#C62828", padding:"8px 12px", borderRadius:"10px", fontSize:"13px", marginBottom:"12px" }}>
                  {formError}
                </div>
              )}

              <button type="submit" style={{ width:"100%", padding:"13px", background:"#54D22E", color:"#FFFFFF", border:"none", borderRadius:"10px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>
                +Add Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}