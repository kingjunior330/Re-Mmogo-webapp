import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import "../styles/design.css";
import "../styles/Groups.css";

export default function Groups() {
  const { user, members, fetchMembers, apiFetch } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();

    if (!email.trim()) {
      setMsg("Enter an email address.");
      return;
    }

    setLoading(true);
    setMsg("");

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
      fetchMembers();

      setTimeout(() => {
        setShowForm(false);
        setMsg("");
      }, 1200);
    } else {
      setMsg(res.data.message || "Could not add member.");
    }

    setLoading(false);
  }

  const groupCode = user?.groupCode || "—";
  const groupName = user?.groupName || "My Group";
  const canAddMember = user?.role === "admin" || user?.role === "signatory";
  const isSuccess = msg.startsWith("success:");

  return (
    <div className="groups-page">
      <div className="card group-info-card">
        <div className="group-info-row">
          <div>
            <p className="group-info-label">Group Name</p>
            <p className="group-info-value">{groupName}</p>
          </div>

          <div>
            <p className="group-info-label">Invite Code</p>
            <p className="group-code">{groupCode}</p>
          </div>

          <div>
            <p className="group-info-label">Members</p>
            <p className="group-info-value">{members.length}</p>
          </div>
        </div>

        <p className="group-hint">
          Share the invite code with new members so they can join your Motshelo.
        </p>
      </div>

      <div className="card">
        <div className="members-header">
          <h3 className="section-title">Members</h3>

          {canAddMember && (
            <button
              className="btn-add-member"
              onClick={() => {
                setShowForm(!showForm);
                setMsg("");
              }}
            >
              {showForm ? "Cancel" : "+ Add Member"}
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="add-member-form">
            <div className="field-group">
              <label className="field-label">Member Email</label>
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@email.com"
              />
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

            {msg && (
              <p className={`form-msg ${isSuccess ? "success" : "error"}`}>
                {msg.replace("success:", "")}
              </p>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Member"}
            </button>
          </form>
        )}

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
                      <span className={`badge badge-${member.status || "approved"}`}>
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