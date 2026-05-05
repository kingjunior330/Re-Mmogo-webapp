import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "../styles/design.css";
import "../styles/Setup.css";

export default function Setup() {
  const navigate = useNavigate();
  const { createGroup, joinGroup } = useApp();

  const [tab, setTab] = useState("create");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [groupCode, setGroupCode] = useState("");

  async function handleCreate(e) {
    e.preventDefault();
    setMsg("");

    if (!groupName.trim()) {
      setMsg("Group name is required.");
      return;
    }

    setLoading(true);

    const res = await createGroup(groupName.trim(), description.trim());

    if (res.ok) {
      navigate("/dashboard");
    } else {
      setMsg(res.data.message || "Failed to create group.");
    }

    setLoading(false);
  }

  async function handleJoin(e) {
    e.preventDefault();
    setMsg("");

    if (!groupCode.trim()) {
      setMsg("Enter the group code.");
      return;
    }

    setLoading(true);

    const res = await joinGroup(groupCode.trim());

    if (res.ok) {
      navigate("/dashboard");
    } else {
      setMsg(res.data.message || "Invalid group code.");
    }

    setLoading(false);
  }

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="login-brand setup-brand">
          <span className="login-brand-icon">👥</span>
          <span className="login-brand-text">Re-Mmogo</span>
        </div>

        <p className="login-subtitle">
          Create a new Motshelo group or join an existing one.
        </p>

        <div className="setup-tabs">
          <button
            type="button"
            className={`setup-tab ${tab === "create" ? "active" : ""}`}
            onClick={() => {
              setTab("create");
              setMsg("");
            }}
          >
            Create Group
          </button>

          <button
            type="button"
            className={`setup-tab ${tab === "join" ? "active" : ""}`}
            onClick={() => {
              setTab("join");
              setMsg("");
            }}
          >
            Join Group
          </button>
        </div>

        {msg && <p className="form-msg error">{msg}</p>}

        {tab === "create" ? (
          <form onSubmit={handleCreate} className="setup-form">
            <div className="field-group">
              <label className="field-label">Group Name</label>
              <input
                className="input-field"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Example: Re-Mmogo Savings Group"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Description</label>
              <input
                className="input-field"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="setup-form">
            <div className="field-group">
              <label className="field-label">Group Code</label>
              <input
                className="input-field group-code-input"
                type="text"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                placeholder="Enter group code"
                maxLength={8}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Joining..." : "Join Group"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}