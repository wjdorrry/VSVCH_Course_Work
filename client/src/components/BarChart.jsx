export default function BarChart({ rows = [] }) {
  const max = Math.max(1, ...rows.map((row) => Number(row.count || row.value || 0)));
  return (
    <div className="bar-chart">
      {rows.map((row) => {
        const value = Number(row.count || row.value || 0);
        return (
          <div className="bar-row" key={row.label}>
            <span>{row.label}</span>
            <div className="bar-track"><div className="bar-fill" style={{ width: `${(value / max) * 100}%` }} /></div>
            <b>{value}</b>
          </div>
        );
      })}
    </div>
  );
}
