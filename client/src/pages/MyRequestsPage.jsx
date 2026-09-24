import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api/api.js';
import PageHeader from '../components/PageHeader.jsx';
import Select from '../components/Select.jsx';
import RequestCard from '../components/RequestCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Toast from '../components/Toast.jsx';

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [toast, setToast] = useState(location.state?.created ? 'Заявка успешно отправлена' : '');

  useEffect(() => { api('/statuses').then(setStatuses); }, []);
  useEffect(() => {
    setLoading(true);
    api(`/requests/my${status ? `?status=${status}` : ''}`).then(setRequests).finally(() => setLoading(false));
  }, [status]);

  return (
    <>
      <PageHeader current="Мои заявки" eyebrow="Личный кабинет" title="Мои заявки" text="Здесь отображаются созданные мероприятия и их текущий статус." actions={<Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Все статусы</option>{statuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</Select>} />
      <section className="container section compact-top">{loading ? <LoadingSpinner /> : requests.length ? <div className="request-grid">{requests.map((request) => <RequestCard key={request.id} request={request} />)}</div> : <EmptyState title="Заявок пока нет" text="Соберите меню и создайте первую заявку на мероприятие." />}</section>
      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
