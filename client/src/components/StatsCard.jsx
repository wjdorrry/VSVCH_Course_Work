export default function StatsCard({ label, value, note }) {
  return <article className="stats-card"><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</article>;
}
