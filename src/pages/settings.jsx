import { useState } from "react";
import { useApp } from "../context/AppContext";
import "../styles/design.css";
import "../styles/Settings.css";

export default function Settings() {
  const { user, apiFetch, logout } = useApp();

  const [name, setName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [saving, setSaving] = useState(false);

  function flash(text, type = "success") {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(""), 3000);
  }

  async function saveProfile(e) {
    e.preventDefault();

    if (!name.trim()) {
      flash("Name is required.", "error");
      return;
    }

    setSaving(true);

    const res = await apiFetch("/auth/profile", {
      method: "PUT",
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim(),
      }),
    });

    if (res.ok) {
      flash("Profile updated successfully.");
    } else {
      flash(res.data.message || "Could not save profile.", "error");
    }

    setSaving(false);
  }

  async function changePassword(e) {
    e.preventDefault();

    if (!oldPass || !newPass) {
      flash("Fill in both password fields.", "error");
      return;
    }

    if (newPass.length < 6) {
      flash("New password must be at least 6 characters.", "error");
      return;
    }

    setSaving(true);

    const res = await apiFetch("/auth/password", {
      method: "PUT",
      body: JSON.stringify({
        oldPassword: oldPass,
        newPassword: newPass,
      }),
    });

    if (res.ok) {
      flash("Password changed successfully.");
      setOldPass("");
      setNewPass("");
    } else {
      flash(res.data.message || "Could not change password.", "error");
    }

    setSaving(false);
  }

  const initials = (user?.fullName || "User")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="settings-page">
      {msg && <p className={`form-msg ${msgType}`}>{msg}</p>}

      <div className="card">
        <h3 className="section-title">My Profile</h3>

        <div className="settings-avatar">
          <div className="s-avatar">{initials}</div>

          <div>
            <p className="s-name">{user?.fullName || "User"}</p>
            <span className={`badge badge-${user?.role || "member"}`}>
              {user?.role || "member"}
            </span>
          </div>
        </div>

        <form onSubmit={saveProfile} className="settings-form">
          <div className="form-row-2">
            <div className="field-group">
              <label className="field-label">Full Name</label>
              <input
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Phone</label>
              <input
                className="input-field"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+267 7x xxx xxx"
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              className="input-field"
              value={user?.email || ""}
              disabled
            />
            <p className="field-hint">Email cannot be changed.</p>
          </div>

          <button type="submit" className="btn-primary small-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="section-title">Change Password</h3>

        <form onSubmit={changePassword} className="settings-form">
          <div className="field-group">
            <label className="field-label">Old Password</label>
            <input
              className="input-field"
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              placeholder="Old password"
            />
          </div>

          <div className="field-group">
            <label className="field-label">New Password</label>
            <input
              className="input-field"
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="New password"
            />
          </div>

          <button type="submit" className="btn-primary small-btn" disabled={saving}>
            {saving ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>

      <div className="card danger-zone">
        <h3 className="section-title">Account</h3>

        <button className="btn-logout" onClick={logout}>
          Log Out
        </button>
      </div>
    </div>
  );
}