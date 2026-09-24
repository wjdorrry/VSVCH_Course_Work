export default function EmptyState({ title = 'Пока ничего нет', text = 'Данные появятся здесь позже.' }) {
  return <div className="empty-state"><span>✦</span><h3>{title}</h3><p>{text}</p></div>;
}
