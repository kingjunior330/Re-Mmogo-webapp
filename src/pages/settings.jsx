import { useState } from 'react';
import SettingRow from './SettingRow';

export default function Settings() {
  // MY PROFILE
  const [name, setName] = useState('Thabo Mokena');
  const [email, setEmail] = useState('thabo@gmail.com');
  const [role, setRole] = useState('Signatory');

  // GROUP SETTINGS
  const [groupName, setGroupName] = useState('Motshelo Savings');
  const [totalMembers, setTotalMembers] = useState(12);

  // CONTRIBUTION SETTINGS
  const [monthlyAmount, setMonthlyAmount] = useState(1000);
  const [dueDate, setDueDate] = useState('1st of every month');
  const [paymentReminder, setPaymentReminder] = useState('3 days before due date');

  // LOAN SETTINGS
  const [interestRate, setInterestRate] = useState(20);
  const [maxLoanAmount, setMaxLoanAmount] = useState(100000);
  const [minLoanAmount, setMinLoanAmount] = useState(500);

  // APPROVAL SETTINGS
  const [requireBothSignatories, setRequireBothSignatories] = useState(true);
  const [autoApproveUnder500, setAutoApproveUnder500] = useState(false);

  // REPORT SETTINGS
  const [yearEndTarget, setYearEndTarget] = useState(5000);
  const [autoGenerateReport, setAutoGenerateReport] = useState(true);
  const [shareWithAllMembers, setShareWithAllMembers] = useState(true);

  // SECURITY & ACCOUNT (no edit needed)
  const [password, setPassword] = useState('********');

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', background: '#f5f5f5' }}>
      <h1>Settings</h1>

      {/* ===== MY PROFILE ===== */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>MY PROFILE</h3>
        <SettingRow label="Name" value={name} onSave={setName} />
        <SettingRow label="Email" value={email} onSave={setEmail} type="email" />
        <SettingRow label="Role" value={role} onSave={setRole} type="select" options={['Member', 'Signatory']} />
      </div>

      {/* ===== GROUP SETTINGS ===== */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>GROUP SETTINGS</h3>
        <SettingRow label="Group Name" value={groupName} onSave={setGroupName} />
        <SettingRow label="Total Members" value={totalMembers} onSave={setTotalMembers} type="number" />
      </div>

      {/* ===== CONTRIBUTION SETTINGS ===== */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>CONTRIBUTION SETTINGS</h3>
        <SettingRow label="Monthly Amount (P)" value={monthlyAmount} onSave={setMonthlyAmount} type="number" />
        <SettingRow label="Due Date" value={dueDate} onSave={setDueDate} />
        <SettingRow label="Payment Reminder" value={paymentReminder} onSave={setPaymentReminder} />
      </div>

      {/* ===== LOAN SETTINGS ===== */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>LOAN SETTINGS</h3>
        <SettingRow label="Interest Rate (% per month)" value={interestRate} onSave={setInterestRate} type="number" />
        <SettingRow label="Maximum Loan Amount (P)" value={maxLoanAmount} onSave={setMaxLoanAmount} type="number" />
        <SettingRow label="Minimum Loan Amount (P)" value={minLoanAmount} onSave={setMinLoanAmount} type="number" />
      </div>

      {/* ===== APPROVAL SETTINGS ===== */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>APPROVAL SETTINGS</h3>
        <SettingRow label="Require Both Signatories" value={requireBothSignatories} onSave={setRequireBothSignatories} type="checkbox" />
        <SettingRow label="Auto Approve Under P500" value={autoApproveUnder500} onSave={setAutoApproveUnder500} type="checkbox" />
      </div>

      {/* ===== REPORT SETTINGS ===== */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>REPORT SETTINGS</h3>
        <SettingRow label="Year End Target (P)" value={yearEndTarget} onSave={setYearEndTarget} type="number" />
        <SettingRow label="Auto Generate Report" value={autoGenerateReport} onSave={setAutoGenerateReport} type="checkbox" />
        <SettingRow label="Share with All Members" value={shareWithAllMembers} onSave={setShareWithAllMembers} type="checkbox" />
      </div>

      {/* ===== SECURITY ===== */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3>SECURITY</h3>
        <SettingRow label="Password" value={password} onSave={setPassword} type="password" />
      </div>

      {/* ===== ACCOUNT ===== */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '10px' }}>
        <h3>ACCOUNT</h3>
        <button style={{ background: '#dc2626', color: 'white', padding: '10px', marginRight: '10px', border: 'none', borderRadius: '5px' }}>LOG OUT</button>
        <button style={{ background: 'white', color: '#dc2626', padding: '10px', border: '1px solid #dc2626', borderRadius: '5px' }}>DELETE ACCOUNT</button>
      </div>
    </div>
  );
}