import StatusBadge from './StatusBadge.jsx';
export default function RequestCard({ request }) {
  return (
    <article className="request-card">
      <div className="request-card-top"><div><span>Заявка #{request.id}</span><h3>{request.EventType?.name}</h3></div><StatusBadge status={request.Status} /></div>
      <dl>
        <div><dt>Дата</dt><dd>{request.eventDate}</dd></div>
        <div><dt>Гостей</dt><dd>{request.guestsCount}</dd></div>
        <div><dt>Стоимость</dt><dd>{Number(request.estimatedTotal).toFixed(2)} BYN</dd></div>
      </dl>
      <p className="muted">{request.address}</p>
    </article>
  );
}
