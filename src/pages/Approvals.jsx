import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import "../styles/design.css";
import "../styles/Approvals.css";

export default function Approvals() {
  const { apiFetch, user } = useApp();

  const [contributions, setContributions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadPending();
  }, []);

  async function loadPending() {
    setLoading(true);

    try {
      const [contributionRes, loanRes] = await Promise.all([
        apiFetch("/contributions"),
        apiFetch("/loans"),
      ]);

      if (contributionRes.ok) {
        setContributions(
          (contributionRes.data.contributions || []).filter(
            (item) => item.status === "pending"
          )
        );
      }

      if (loanRes.ok) {
        setLoans(
          (loanRes.data.loans || []).filter(
            (item) => item.status === "pending"
          )
        );
      }
    } catch (error) {
      console.error(error);
      setMsg("Could not load pending approvals.");
    }

    setLoading(false);
  }

  async function handleAction(url) {
    const res = await apiFetch(url, {
      method: "PUT",
    });

    if (res.ok) {
      setMsg(res.data.message || "Action completed successfully.");
      loadPending();
    } else {
      setMsg(res.data.message || "Action failed.");
    }

    setTimeout(() => setMsg(""), 3000);
  }

  if (user?.role === "member") {
    return (
      <div className="approvals-page">
        <div className="card locked-card">
          <p className="locked-icon">🔒</p>
          <p>Only admins and signatories can approve items.</p>
        </div>
      </div>
    );
  }

  const totalPending = contributions.length + loans.length;

  return (
    <div className="approvals-page">
      {msg && <p className="form-msg success">{msg}</p>}

      <div className="card approvals-summary">
        <div>
          <h3>{totalPending}</h3>
          <p>Total Pending</p>
        </div>

        <div>
          <h3>{contributions.length}</h3>
          <p>Contributions</p>
        </div>

        <div>
          <h3>{loans.length}</h3>
          <p>Loan Requests</p>
        </div>
      </div>

      {loading ? (
        <div className="card loading-card">Loading approvals...</div>
      ) : (
        <>
          <div className="card">
            <h3 className="section-title">Pending Contributions</h3>

            {contributions.length === 0 ? (
              <p className="empty-note">No pending contributions.</p>
            ) : (
              <div className="approval-list">
                {contributions.map((item) => (
                  <div className="approval-item" key={item.id}>
                    <div>
                      <h4>{item.memberName || item.member_name || "Member"}</h4>
                      <p>
                        P{Number(item.amount || 0).toLocaleString()} ·{" "}
                        {item.monthYear ||
                          item.month_year ||
                          item.contribution_month ||
                          "—"}
                      </p>
                    </div>

                    <div className="approval-actions">
                      <button
                        className="btn-approve"
                        onClick={() =>
                          handleAction(`/contributions/${item.id}/approve`)
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="btn-reject"
                        onClick={() =>
                          handleAction(`/contributions/${item.id}/reject`)
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="section-title">Pending Loan Requests</h3>

            {loans.length === 0 ? (
              <p className="empty-note">No pending loan requests.</p>
            ) : (
              <div className="approval-list">
                {loans.map((loan) => (
                  <div className="approval-item" key={loan.id}>
                    <div>
                      <h4>{loan.memberName || loan.member_name || "Member"}</h4>
                      <p>
                        P
                        {Number(
                          loan.principalAmount ||
                            loan.principal_amount ||
                            loan.amount ||
                            0
                        ).toLocaleString()}{" "}
                        · {loan.purpose || loan.reason || "General loan"}
                      </p>
                    </div>

                    <div className="approval-actions">
                      <button
                        className="btn-approve"
                        onClick={() => handleAction(`/loans/${loan.id}/approve`)}
                      >
                        Approve
                      </button>

                      <button
                        className="btn-reject"
                        onClick={() => handleAction(`/loans/${loan.id}/reject`)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}