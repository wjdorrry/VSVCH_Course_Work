export default function LoadingSpinner({ label = 'Загрузка...' }) {
  return <div className="loading"><span className="spinner"/><p>{label}</p></div>;
}
