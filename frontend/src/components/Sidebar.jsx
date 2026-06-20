import { useState } from "react";
import axios from "axios";
import DataDashboard from "./DataDashboard";

function Sidebar({ setChatHistory }) {
  const [docStatus, setDocStatus] = useState("");
  const [csvStatus, setCsvStatus] = useState("");
  const [csvName, setCsvName] = useState("");
  const [dashboardData, setDashboardData] = useState(null);

  const uploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setDocStatus("Uploading...");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload/document`, formData);
      setDocStatus(res.data.message);
    } catch {
      setDocStatus("Upload failed.");
    }
  };

  const uploadCsv = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setCsvStatus("Uploading...");
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload/csv`, formData);
      setCsvStatus(res.data.message);
      setCsvName(res.data.filename);

      // Fetch dashboard data automatically
      const form = new FormData();
      form.append("filename", res.data.filename);
      const dashRes = await axios.post(`${import.meta.env.VITE_API_URL}/analyse`, form);
      setDashboardData(dashRes.data);
    } catch {
      setCsvStatus("Upload failed.");
    }
  };

  return (
    <div style={{
      width: dashboardData ? "480px" : "260px",
      background: "#111",
      borderRight: "1px solid #1e1e1e",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      overflowY: "auto",
      transition: "width 0.3s ease",
    }}>
      <h2 style={{ fontSize: "14px", color: "#666", textTransform: "uppercase", letterSpacing: "1px" }}>
        Upload Files
      </h2>

      {/* Document Upload */}
      <div>
        <p style={{ fontSize: "13px", marginBottom: "8px" }}>📄 Document (PDF/TXT)</p>
        <label style={{
          display: "block",
          padding: "8px 12px",
          background: "#1e1e1e",
          border: "1px dashed #333",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "12px",
          color: "#666",
          textAlign: "center",
        }}>
          Click to upload
          <input type="file" accept=".pdf,.txt" onChange={uploadDocument} style={{ display: "none" }} />
        </label>
        {docStatus && <p style={{ fontSize: "11px", color: "#22c55e", marginTop: "6px" }}>{docStatus}</p>}
      </div>

      {/* CSV Upload */}
      <div>
        <p style={{ fontSize: "13px", marginBottom: "8px" }}>📊 CSV for Analysis</p>
        <label style={{
          display: "block",
          padding: "8px 12px",
          background: "#1e1e1e",
          border: "1px dashed #333",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "12px",
          color: "#666",
          textAlign: "center",
        }}>
          Click to upload
          <input type="file" accept=".csv" onChange={uploadCsv} style={{ display: "none" }} />
        </label>
        {csvStatus && <p style={{ fontSize: "11px", color: "#22c55e", marginTop: "6px" }}>{csvStatus}</p>}
        {csvName && (
          <p style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>
            Ask: "Analyse {csvName}"
          </p>
        )}
      </div>

      {/* Dashboard */}
      {dashboardData && <DataDashboard analysisData={dashboardData} />}

      {/* Clear Chat */}
      <button
        onClick={() => setChatHistory([])}
        style={{
          marginTop: "auto",
          padding: "10px",
          background: "#1e1e1e",
          border: "1px solid #2a2a2a",
          borderRadius: "8px",
          color: "#666",
          cursor: "pointer",
          fontSize: "13px",
        }}
      >
        🗑️ Clear Chat
      </button>
    </div>
  );
}

export default Sidebar;