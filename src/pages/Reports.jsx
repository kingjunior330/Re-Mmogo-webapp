import {useState} from "react";
import ReportCard from "../Components/ReportCard";
import { calculareTotals,getHightlights } from "../utils/reportUtils";

export default function Reports() {
    const [members, setMembers] = useState([]);
    const [form,setForm] = useState({name:"",contributions:"",loans:"",interest:""});

function handleChange(e){
    setForm({...form,[e.target.name]:e.target.value});
}
function addmember(){
if(!form.name) return alert("Name is required");
const newMember = {
    name: form.name,
    contributions: parseFloat(form.contributions) || 0,
    loans: Number(form.loans) || 0,
    interest: parseFloat(form.interest) || 0
};
setMembers([...members, newMember]);
setForm({name:"",contributions:"",loans:"",interest:""});
}
const {totalContributions,totalLoans,totalInterest} = calculateTotals(members);
const {highest,lowest} = getHightlights(members);

    return (    
        <div>
            <h2>Reports</h2>
            <div>
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
                <input name="contributions" placeholder="Contributions" value={form.contributions} onChange={handleChange} />   
                <input name="loans" placeholder="Loans" value={form.loans} onChange={handleChange} />
                <input name="interest" placeholder="Interest" value={form.interest} onChange={handleChange} />
                <button onClick={addmember}>Add Member</button> 

                <ReportCard title="Total Contributions" value={totalContributions} />
                <ReportCard title="Total Loans" value={totalLoans} />
                <ReportCard title="Total Interest" value={totalInterest} /> 
                <ReportCard title="Highest Member" value={highest.name} />
                <ReportCard title="Lowest Member" value={lowest.name} />

                <h3>Members List</h3>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contributions</th>
                            <th>Loans</th>
                            <th>Interest</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, index) => (
                            <tr key={index}>
                                <td>{member.name}</td>
                                <td>{member.contributions}</td>
                                <td>{member.loans}</td>
                                <td>{member.interest}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
    <h3>Higlights</h3>
        {
            <div>
            highest && (
                <p>Highest Member: {highest.name}</p>
                <p>Lowest Member: {lowest.name}</p> 
            )
        
            </div>
        }
            </div>
        </div>
    );
}   