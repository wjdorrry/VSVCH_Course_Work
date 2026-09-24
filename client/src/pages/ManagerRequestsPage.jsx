import { useEffect, useState } from 'react';
import { api } from '../api/api.js';
import PageHeader from '../components/PageHeader.jsx';
import Select from '../components/Select.jsx';
import Input from '../components/Input.jsx';
import DataTable from '../components/DataTable.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Pagination from '../components/Pagination.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';

const PAGE_SIZE = 10;

export default function ManagerRequestsPage() {
  const [rows, setRows] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [filters, setFilters] = useState({ status: '', from: '', to: '' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    try { setRows(await api(`/requests?${params}`)); } finally { setLoading(false); }
  };
  useEffect(() => { api('/statuses').then(setStatuses); }, []);
  useEffect(() => { setPage(1); load(); }, [filters.status, filters.from, filters.to]);

  const changeStatus = async (requestId, statusId) => {
    try { await api(`/requests/${requestId}/status`, { method: 'PATCH', body: JSON.stringify({ statusId: Number(statusId) }) }); setToast('Статус заявки обновлен'); await load(); } catch (err) { setToast(err.message); }
  };
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));

  return (
    <>
      <PageHeader current="Управление заявками" eyebrow="Менеджер" title="Заявки на мероприятия" text="Фильтрация по статусу и датам, просмотр клиента и изменение статуса." />
      <section className="container section compact-top">
        <div className="filter-panel manager-filters">
          <Select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}><option value="">Все статусы</option>{statuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</Select>
          <Input type="date" value={filters.from} onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))} aria-label="Дата от" />
          <Input type="date" value={filters.to} onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))} aria-label="Дата до" />
          <button className="btn btn-ghost" onClick={() => setFilters({ status: '', from: '', to: '' })}>Сбросить</button>
        </div>
        {loading ? <LoadingSpinner /> : rows.length ? <>
          <DataTable rows={visible} columns={[
            { key: 'id', label: '№' },
            { key: 'client', label: 'Клиент', render: (row) => <div><b>{row.User?.name}</b><small className="block-muted">{row.User?.email}</small></div> },
            { key: 'event', label: 'Событие', render: (row) => <div><b>{row.EventType?.name}</b><small className="block-muted">{row.eventDate}</small></div> },
            { key: 'guests', label: 'Гостей', render: (row) => row.guestsCount },
            { key: 'sum', label: 'Сумма', render: (row) => `${Number(row.estimatedTotal).toFixed(2)} BYN` },
            { key: 'status', label: 'Текущий статус', render: (row) => <StatusBadge status={row.Status} /> },
            { key: 'change', label: 'Изменить', render: (row) => <Select value={row.statusId} onChange={(e) => changeStatus(row.id, e.target.value)}>{statuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</Select> },
          ]} />
          <Pagination page={page} pages={pages} onChange={setPage} />
        </> : <EmptyState title="Заявки не найдены" text="Измените параметры фильтрации." />}
      </section>
      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
