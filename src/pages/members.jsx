import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import "../styles/design.css";
import "../styles/Members.css";

export default function MembersPage() {
  const { apiFetch, user } = useApp();

  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  async function loadMembers() {
    const res = await apiFetch("/members");

    if (res.ok) {
      setMembers(res.data.members || []);
    }
  }

  async function handleAddMember(e) {
    e.preventDefault();
    setMsg("");

    if (!email.trim()) {
      setMsg("Email is required.");
      return;
    }

    setLoading(true);

    const res = await apiFetch("/members", {
      method: "POST",
      body: JSON.stringify({
        email: email.trim(),
        role,
      }),
    });

    if (res.ok) {
      setMsg("success:Member added successfully.");
      setEmail("");
      setRole("member");
      setShowForm(false);
      loadMembers();
    } else {
      setMsg(res.data.message || "Failed to add member.");
    }

    setLoading(false);
  }

  const canAdd = user?.role === "admin" || user?.role === "signatory";
  const isSuccess = msg.startsWith("success:");

  return (
    <div className="members-page">
      <div className="members-toprow">
        <h2 className="section-title">Group Members</h2>

        {canAdd && (
          <button
            className="btn-primary small-btn"
            onClick={() => {
              setShowForm(!showForm);
              setMsg("");
            }}
          >
            {showForm ? "Cancel" : "+ Add Member"}
          </button>
        )}
      </div>

      {msg && (
        <p className={`form-msg ${isSuccess ? "success" : "error"}`}>
          {msg.replace("success:", "")}
        </p>
      )}

      {showForm && (
        <div className="card">
          <h3 className="section-title">Enroll New Member</h3>

          <form onSubmit={handleAddMember} className="enroll-form">
            <div className="field-group">
              <label className="field-label">Member Email</label>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@email.com"
              />
              <p className="field-hint">
                The member must have registered an account first.
              </p>
            </div>

            <div className="field-group">
              <label className="field-label">Role</label>
              <select
                className="input-field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="member">Member</option>
                <option value="signatory">Signatory</option>
              </select>
            </div>

            <button type="submit" className="btn-primary small-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Member"}
            </button>
          </form>
        </div>
      )}

      <div className="card">
        {members.length === 0 ? (
          <p className="empty-note">No members found yet.</p>
        ) : (
          <div className="members-table-wrap">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.fullName || member.name || "—"}</td>
                    <td>{member.email}</td>
                    <td>{member.role}</td>
                    <td>
                      <span className={`badge badge-${member.status || "active"}`}>
                        {member.status || "active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}