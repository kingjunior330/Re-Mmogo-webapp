export default function ReportCard({ title, value }) {
  return (
    <div style={{
      padding:"16px", background:"#E3F2FD",
      margin:"10px 0", borderRadius:"10px",
      fontFamily:"Arial, sans-serif",
      boxShadow:"0 1px 4px rgba(0,0,0,0.08)",
    }}>
      <p style={{ margin:0, fontSize:"13px", color:"#555" }}>{title}</p>
      <h3 style={{ margin:"6px 0 0", fontSize:"20px", color:"#000" }}>{value}</h3>
    </div>
  );
}