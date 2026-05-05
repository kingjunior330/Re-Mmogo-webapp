export default function ReportCard({ title, value }) {
  return (
    <div
      style={{
        padding: "16px",
        background: "#E3F2FD",
        borderRadius: "12px",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        border: "1px solid #D6E9FF",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "13px",
          color: "#555",
          marginBottom: "8px",
        }}
      >
        {title}
      </p>

      <h3
        style={{
          margin: 0,
          fontSize: "24px",
          color: "#0F172A",
          fontWeight: "700",
        }}
      >
        {value}
      </h3>
    </div>
  );
}