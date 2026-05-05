import { useState } from "react";

export default function SettingRow({
  label,
  value,
  onSave,
  type = "text",
  options = [],
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  function handleSave() {
    onSave(tempValue);
    setIsEditing(false);
  }

  function handleCancel() {
    setTempValue(value);
    setIsEditing(false);
  }

  return (
    <div
      style={{
        marginBottom: "15px",
        padding: "12px",
        borderBottom: "1px solid #eee",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <strong>{label}:</strong>

      {isEditing ? (
        <div style={{ marginTop: "8px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {type === "select" ? (
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : type === "checkbox" ? (
            <input
              type="checkbox"
              checked={Boolean(tempValue)}
              onChange={(e) => setTempValue(e.target.checked)}
            />
          ) : (
            <input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
            />
          )}

          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div style={{ marginTop: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
          <span>{type === "checkbox" ? (value ? "Yes" : "No") : value}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}