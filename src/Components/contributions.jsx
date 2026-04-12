import React, { useState} from "react";
import "../Contributions.css";

const Contributions = () => {

   const [payments, setPayments] = useState([
    {
        month: "Jan",
        amount: 1000,
        status: "Approved",
        date: "2026-01-05",
    },
    {
        month: "Feb",
        amount: 1000,
        status: "Pending",
        date: "2026-02-05",
    },
   ]);

   const handlePay = () => {
    const newPayment = {
        month: "Mar",
        amount: 1000,
        status: "Pending",
        date: new Date().toISOString().split("T")[0],
    };

    setPayments([newPayment, ...payments]);
   };

   const totalPaid  = payments
     .filter((p) => p.status==="Approved")
     .reduce((sum, p) => sum + p.amount, 0);

    const pending  = payments
     .filter((p) => p.status==="Pending")
     .reduce((sum, p) => sum + p.amount, 0);  

     const thisMonth = payments.length > 0 ? payments[0].amount : 0;

     return (
        <div>
        <div className="contributions-container">
            <h2>Contributions</h2>
            <p>Track and manage your monthly contributions </p>
            <button className="pay-btn" onClick={handlePay} >
                + Pay
            </button>

            <div className="summary">
                <div>
                    <h4>Total Paid</h4>
                    <p>P{totalPaid}</p>
                </div>

                <div>
                    <h4>This Month</h4>
                    <p>P{thisMonth}</p>
                </div>
                <div>
                    <h4>Pending approval</h4>
                    <p>P{pending}</p>
                </div>    
            </div>
            
        </div> 

        <h4 className="history-title">Payment History</h4>

        <table className="history-table">
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((p, index) => (
                    <tr key={index}>
                        <td>{p.month}</td>
                        <td>P{p.amount}</td>
                        <td className={p.status.toLowerCase()}>
                            {p.status}
                        </td>
                        <td>{p.date}</td>
                    </tr>
                ))}
            </tbody>
        </table>
       </div>

     );
    };
    
    export default Contributions;