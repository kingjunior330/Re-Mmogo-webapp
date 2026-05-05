export default function Topbar({ toggleSidebar, title = "Re-Mmogo" }) {
  return (
    <header
      style={{
        background: "#90BDF9",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <button
        onClick={toggleSidebar}
        style={{
          background: "none",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          color: "#000",
        }}
      >
        ☰
      </button>

      <div style={{ flex: 1, textAlign: "center" }}>
        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#000",
          }}
        >
          {title}
        </span>
      </div>

      <div style={{ width: "34px" }} />
    </header>
  );
}