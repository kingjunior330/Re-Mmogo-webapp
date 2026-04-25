import { useState } from "react";
import { calculateTotal, getHighlights } from "../utils/reportUtils";
import "./Reports.css";

export default function Reports() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ 
    name: "", 
    contributions: "", 
    loans: "", 
    interest: "" 
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addMember() {
    if (!form.name) {
      alert("Please enter a name");
      return;
    }
    
    const newMember = {
      name: form.name,
      contributions: Number(form.contributions) || 0,
      loans: Number(form.loans) || 0,
      interest: Number(form.interest) || 0
    };
    
    setMembers([...members, newMember]);
    setForm({ name: "", contributions: "", loans: "", interest: "" });
  }

  const totals = calculateTotal(members);
  const highlights = getHighlights(members);

  return (
    <div className="reports-container">
      <h1>Reports</h1>
      <p>View loan and contribution reports</p>

      {/* Form Section - Add Member Data */}
      <div className="form-section">
        <h3>Add Member Data</h3>
        <div className="form-group">
          <input 
            name="name" 
            placeholder="Member Name" 
            value={form.name} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <input 
            name="contributions" 
            placeholder="Contributions (P)" 
            value={form.contributions} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <input 
            name="loans" 
            placeholder="Loans (P)" 
            value={form.loans} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <input 
            name="interest" 
            placeholder="Interest (P)" 
            value={form.interest} 
            onChange={handleChange} 
          />
        </div>
        <button className="add-btn" onClick={addMember}>
          Add Member
        </button>
      </div>

      {/* Cards Section - Summary */}
      <div className="cards-section">
        <div className="card card-blue">
          <p>Total Contributions</p>
          <h2>P{totals.totalContributions.toLocaleString()}</h2>
        </div>
        <div className="card card-green">
          <p>Total Loans</p>
          <h2>P{totals.totalLoans.toLocaleString()}</h2>
        </div>
        <div className="card card-orange">
          <p>Total Interest</p>
          <h2>P{totals.totalInterest.toLocaleString()}</h2>
        </div>
      </div>

      {/* Table Section - Members List */}
      <div className="table-section">
        <h3>Members List</h3>
        {members.length === 0 ? (
          <p className="empty-message">No members added yet. Add members above.</p>
        ) : (
          <table className="member-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contributions (P)</th>
                <th>Loans (P)</th>
                <th>Interest (P)</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index}>
                  <td>{member.name}</td>
                  <td>{member.contributions.toLocaleString()}</td>
                  <td>{member.loans.toLocaleString()}</td>
                  <td>{member.interest.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Highlights Section */}
      <div className="highlights-section">
        <h3>🏆 Year End Highlights</h3>
        {highlights.highest && (
          <p>🏆 Highest Interest Earner: {highlights.highest.name} (P{highlights.highest.interest.toLocaleString()})</p>
        )}
        {highlights.lowest && (
          <p>📉 Lowest Interest Earner: {highlights.lowest.name} (P{highlights.lowest.interest.toLocaleString()})</p>
        )}
        {members.length > 0 && (
          <p>💰 Average Payout: P{((totals.totalContributions + totals.totalInterest - totals.totalLoans) / members.length).toLocaleString()} per member</p>
        )}
        <p>🎯 Total Members: {members.length}</p>
      </div>
    </div>
  );
}