export default function StatusBadge({ status }) {
  const key = status?.name?.toLowerCase() || 'new';
  return <span className={`status status-${key}`}>{status?.label || '—'}</span>;
}
