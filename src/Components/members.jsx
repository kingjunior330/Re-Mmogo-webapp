import { useState } from "react";

const INITIAL_MEMBERS = [
  { id: 1, name: "T. Woza", email: "twoza@mail.com", role: "Chair", active: true },
  { id: 2, name: "K. Sithole", email: "ksite@mail.com", role: "Signatory", active: true },
  { id: 3, name: "M. Dlamini", email: "mdlam@mail.com", role: "Member", active: false },
];

export default function Members() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
  });
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setFormError("Full name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setFormError("Email is required.");
      return;
    }

    if (!formData.role) {
      setFormError("Please select a role.");
      return;
    }

    const newMember = {
      id: Date.now(),
      name: formData.fullName,
      email: formData.email,
      role: formData.role,
      active: false,
    };

    setMembers([...members, newMember]);
    setFormData({ fullName: "", email: "", role: "" });
    setFormError("");
    setShowModal(false);
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#000" }}>
      <p style={{ fontSize: "14px", color: "#444", marginBottom: "20px" }}>
        Manage your group members and their roles.
      </p>

      <button
        onClick={() => setShowModal(true)}
        style={{
          width: "100%",
          padding: "14px",
          background: "#54D22E",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: 700,
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        + Add Member
      </button>

      <div
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid #E0E0E0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.8fr 1fr 0.8fr",
            background: "#1976D2",
            padding: "10px",
            gap: "4px",
          }}
        >
          {["Member", "Email", "Role", "Status"].map((heading) => (
            <span
              key={heading}
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              {heading}
            </span>
          ))}
        </div>

        {members.map((member, index) => (
          <div
            key={member.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.8fr 1fr 0.8fr",
              padding: "10px",
              gap: "4px",
              alignItems: "center",
              background: index % 2 === 0 ? "#FFFFFF" : "#F5F8FF",
              borderTop: "1px solid #E8E8E8",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 600 }}>
              {member.name}
            </span>

            <span
              style={{
                fontSize: "11px",
                color: "#555",
                wordBreak: "break-all",
              }}
            >
              {member.email}
            </span>

            <span style={{ fontSize: "11px" }}>{member.role}</span>

            <span style={{ fontSize: "16px" }}>
              {member.active ? "✅" : "⏳"}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              background: "#FFFFFF",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: "14px" }}>Add New Member</h3>

            <form onSubmit={handleSubmit}>
              <label>Full Name</label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                style={inputStyle}
              />

              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                style={inputStyle}
              />

              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select role</option>
                <option value="Chair">Chair</option>
                <option value="Signatory">Signatory</option>
                <option value="Member">Member</option>
              </select>

              {formError && (
                <p style={{ color: "#B91C1C", fontSize: "13px" }}>
                  {formError}
                </p>
              )}

              <button type="submit" style={submitStyle}>
                Save Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #CBD5E1",
  borderRadius: "8px",
  fontSize: "14px",
  margin: "6px 0 12px",
  boxSizing: "border-box",
};

const submitStyle = {
  width: "100%",
  padding: "12px",
  background: "#1976D2",
  color: "#FFFFFF",
  border: "none",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: 700,
  cursor: "pointer",
};