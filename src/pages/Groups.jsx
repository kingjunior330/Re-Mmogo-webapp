import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import "../styles/Groups.css";

function Groups() {

  const { memberRequests, addMemberRequest } = useApp();

  //show form or the table
  const [showForm, setShowForm] = useState(false);

  //form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [msg, setMsg] = useState("");


  //starter member - the group creator, so table isnt empty
  const defaultMembers = [
    { id: 0, name: "T.Woza", email: "twoza@mail.com", role: "Chair", status: "Active" }
  ];

  //combine default + added members
  const allMembers = [...defaultMembers, ...memberRequests];


  function handleAdd(e) {
    e.preventDefault();

    if (fullName === "" || email === "" || role === "") {
      setMsg("Please fill in all the fields");
      return;
    }

    //simple email check
    if (!email.includes("@")) {
      setMsg("Enter a valid email address");
      return;
    }

    addMemberRequest({
      name: fullName,
      email: email,
      role: role
    });

    //clear and go back to table
    setFullName("");
    setEmail("");
    setRole("");
    setMsg("");
    setShowForm(false);
  }


  function openForm() {
    setShowForm(true);
    setMsg("");
  }

  function cancelForm() {
    setShowForm(false);
    setMsg("");
    setFullName("");
    setEmail("");
    setRole("");
  }


  //email cell needs to wrap nicely - some emails are long
  function shortEmail(e) {
    if (e.length > 10) {
      return e.substring(0, 10) + "...";
    }
    return e;
  }


  return (
    <div className="groups-page">

      <div className="topbar">
        <button className="menu-btn">&#9776;</button>
        <h2>👥 Groups</h2>
      </div>


      {!showForm ? (
        //---- MAIN VIEW: member table ----
        <div className="content">

          <p className="intro">Manage your group members and their roles.</p>

          <button className="btn-add" onClick={openForm}>
            + Add member
          </button>

          <div className="members-table-wrap">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allMembers.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td className="email-cell">{shortEmail(m.email)}</td>
                    <td>{m.role}</td>
                    <td>
                      {m.status === "Active" || m.status === "Approved" ? (
                        <span className="check">✅</span>
                      ) : (
                        <span className="pending-dot">⏳</span>
                      )}
                    </td>
                    <td className="actions-cell">⋮</td>
                  </tr>
                ))}

                {/*empty rows to fill the table like the figma*/}
                {allMembers.length < 5 && (
                  <>
                    {Array.from({ length: 5 - allMembers.length }).map((_, i) => (
                      <tr key={"empty-" + i}>
                        <td>&nbsp;</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        //---- ADD MEMBER FORM VIEW ----
        <div className="content form-bg">

          <p className="intro">Manage your group members and their roles.</p>

          <form onSubmit={handleAdd} className="add-form">

            <h4 className="form-title">👥 Add New Member</h4>

            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g Treasurer, Secretary, Member"
            />

            {msg && <p className="form-msg">{msg}</p>}

            <button type="submit" className="btn-add-member">
              +Add Member
            </button>

            <button type="button" className="btn-cancel" onClick={cancelForm}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="footer-icon">👥</div>
    </div>
  );
}

export default Groups;
