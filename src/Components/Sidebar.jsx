import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { icon:"📊", label:"Dashboard",     path:"/"              },
  { icon:"👥", label:"Groups",        path:"/groups"        },
  { icon:"💰", label:"Contributions", path:"/contributions" },
  { icon:"🏦", label:"Loans",         path:"/loans"         },
  { icon:"✅", label:"Approvals",     path:"/approvals"     },
  { icon:"📋", label:"Reports",       path:"/reports"       },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:99 }}
        />
      )}

      <div style={{
        position:"fixed", top:0,
        left: open ? 0 : "-260px",
        width:"240px", height:"100%",
        background:"#FFFFFF",
        boxShadow:"4px 0 16px rgba(0,0,0,0.15)",
        transition:"left 0.3s ease",
        zIndex:100,
        display:"flex", flexDirection:"column",
        fontFamily:"Arial, sans-serif",
      }}>
        {/* Header */}
        <div style={{ background:"#90BDF9", padding:"20px 16px 16px", display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ fontSize:"26px" }}>👥</span>
          <span style={{ fontSize:"17px", fontWeight:700, color:"#000" }}>Re- Mmogo</span>
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:"8px 0" }}>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onClose}
                style={{
                  display:"flex", alignItems:"center", gap:"12px",
                  padding:"13px 20px", textDecoration:"none",
                  background: active ? "#E3F2FD" : "transparent",
                  borderLeft: active ? "4px solid #1976D2" : "4px solid transparent",
                  fontSize:"15px", color:"#000",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span style={{ fontSize:"18px" }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Log Out */}
        <div style={{
          padding:"16px 20px", borderTop:"1px solid #E0E0E0",
          display:"flex", alignItems:"center", gap:"12px",
          cursor:"pointer", fontSize:"15px", color:"#000",
        }}>
          <span style={{ fontSize:"20px" }}>👤</span>
          <span>Log Out</span>
        </div>
      </div>
    </>
  );
}