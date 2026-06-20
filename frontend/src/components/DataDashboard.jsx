import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, ZAxis, Legend
} from "recharts";

function DataDashboard({ analysisData }) {
  if (!analysisData) return null;

  const { stats, correlation, columns, sample } = analysisData;

  return (
    <div style={{
      background: "#111",
      border: "1px solid #2a2a2a",
      borderRadius: "16px",
      padding: "24px",
      marginTop: "16px",
    }}>
      <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "24px", color: "#ececec" }}>
        📊 Data Dashboard
      </h2>

      {/* Stats Table */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "13px", color: "#666", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Basic Statistics
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr>
                {["Feature", "Mean", "Std Dev", "Min", "Max"].map(h => (
                  <th key={h} style={{
                    padding: "8px 12px",
                    background: "#1e1e1e",
                    color: "#666",
                    textAlign: "left",
                    borderBottom: "1px solid #2a2a2a"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <td style={{ padding: "8px 12px", color: "#2563eb", fontWeight: 500 }}>{row.feature}</td>
                  <td style={{ padding: "8px 12px", color: "#ececec" }}>{row.mean}</td>
                  <td style={{ padding: "8px 12px", color: "#ececec" }}>{row.std}</td>
                  <td style={{ padding: "8px 12px", color: "#ececec" }}>{row.min}</td>
                  <td style={{ padding: "8px 12px", color: "#ececec" }}>{row.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar Chart — Mean Values */}
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "13px", color: "#666", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Mean Values per Feature
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
            <XAxis dataKey="feature" tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis tick={{ fill: "#666", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: "8px" }}
              labelStyle={{ color: "#ececec" }}
            />
            <Bar dataKey="mean" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Correlation Heatmap */}
      {correlation && (
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "13px", color: "#666", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
            Correlation Matrix
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr>
                  <th style={{ padding: "8px 12px", color: "#666" }}></th>
                  {correlation.columns.map(col => (
                    <th key={col} style={{ padding: "8px 12px", color: "#666", textAlign: "center" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlation.matrix.map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px 12px", color: "#666", fontWeight: 500 }}>
                      {correlation.columns[i]}
                    </td>
                    {row.map((val, j) => {
                      const intensity = Math.abs(val);
                      const bg = val > 0
                        ? `rgba(37, 99, 235, ${intensity})`
                        : `rgba(239, 68, 68, ${intensity})`;
                      return (
                        <td key={j} style={{
                          padding: "8px 12px",
                          background: bg,
                          color: intensity > 0.5 ? "#fff" : "#ececec",
                          textAlign: "center",
                          borderRadius: "4px",
                        }}>
                          {val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Line Chart — Std Dev */}
      <div>
        <h3 style={{ fontSize: "13px", color: "#666", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Standard Deviation per Feature
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" />
            <XAxis dataKey="feature" tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis tick={{ fill: "#666", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: "8px" }}
              labelStyle={{ color: "#ececec" }}
            />
            <Line type="monotone" dataKey="std" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DataDashboard;