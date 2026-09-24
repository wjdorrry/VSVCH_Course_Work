import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/api.js';
import PageHeader from '../components/PageHeader.jsx';
import StatsCard from '../components/StatsCard.jsx';
import BarChart from '../components/BarChart.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import FormField from '../components/FormField.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import TextArea from '../components/TextArea.jsx';
import Button from '../components/Button.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import Toast from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const emptyDish = { name: '', description: '', pricePerPerson: '', categoryId: '', isVegetarian: false, isFeatured: false, imageKey: 'appetizer' };

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [dishForm, setDishForm] = useState(emptyDish);
  const [toast, setToast] = useState('');

  const load = async () => {
    const [s, r, d, c] = await Promise.all([api('/dashboard/stats'), api('/requests'), api('/dishes'), api('/categories')]);
    setStats(s); setRequests(r.slice(0, 6)); setDishes(d); setCategories(c);
  };
  useEffect(() => { load(); }, []);

  const chart = useMemo(() => (stats?.byStatus || []).map((row) => ({ label: row.Status?.label || 'Статус', count: Number(row.count) })), [stats]);
  const openNew = () => { setEditing(null); setDishForm({ ...emptyDish, categoryId: String(categories[0]?.id || '') }); setModal(true); };
  const openEdit = (dish) => { setEditing(dish); setDishForm({ ...dish, categoryId: String(dish.categoryId) }); setModal(true); };
  const saveDish = async (e) => {
    e.preventDefault();
    const body = { ...dishForm, categoryId: Number(dishForm.categoryId), pricePerPerson: Number(dishForm.pricePerPerson) };
    try {
      if (editing) await api(`/dishes/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) });
      else await api('/dishes', { method: 'POST', body: JSON.stringify(body) });
      setModal(false); setToast(editing ? 'Блюдо обновлено' : 'Блюдо добавлено'); await load();
    } catch (err) { setToast(err.message); }
  };
  const removeDish = async (dish) => {
    if (!window.confirm(`Удалить «${dish.name}»?`)) return;
    try { await api(`/dishes/${dish.id}`, { method: 'DELETE' }); setToast('Блюдо удалено'); await load(); } catch (err) { setToast(err.message); }
  };
  const setField = (key, value) => setDishForm((prev) => ({ ...prev, [key]: value }));

  if (!stats) return <LoadingSpinner label="Загружаем панель менеджера..." />;
  return (
    <>
      <PageHeader current="Панель менеджера" eyebrow="Управление" title="Панель менеджера" text="Краткая статистика по заявкам и управление меню." actions={<Button onClick={openNew}>+ Добавить блюдо</Button>} />
      <section className="container section compact-top">
        <div className="stats-grid">
          <StatsCard label="Всего заявок" value={stats.requestCount} />
          <StatsCard label="Предстоящие" value={stats.upcomingCount} />
          <StatsCard label="Оценочная сумма" value={`${Number(stats.revenue).toFixed(0)} BYN`} />
        </div>
        <div className="dashboard-grid">
          <div className="panel"><h2>Заявки по статусам</h2><BarChart rows={chart} /></div>
          <div className="panel"><h2>Популярные блюда</h2><ol className="rank-list">{stats.popular.map((item) => <li key={item.dishId}><span>{item.Dish?.name}</span><b>{item.totalQuantity}</b></li>)}</ol></div>
        </div>
        <div className="panel"><div className="panel-head"><h2>Последние заявки</h2></div><DataTable rows={requests} columns={[
          { key: 'id', label: '№' },
          { key: 'client', label: 'Клиент', render: (row) => row.User?.name },
          { key: 'date', label: 'Дата', render: (row) => row.eventDate },
          { key: 'guests', label: 'Гостей', render: (row) => row.guestsCount },
          { key: 'status', label: 'Статус', render: (row) => <StatusBadge status={row.Status} /> },
        ]} /></div>
        <div className="panel"><div className="panel-head"><h2>Управление меню</h2><span>{dishes.length} позиций</span></div><DataTable rows={dishes} columns={[
          { key: 'name', label: 'Блюдо' },
          { key: 'category', label: 'Категория', render: (row) => row.Category?.name },
          { key: 'price', label: 'Цена / гость', render: (row) => `${Number(row.pricePerPerson).toFixed(2)} BYN` },
          { key: 'actions', label: 'Действия', render: (row) => <div className="table-actions"><button onClick={() => openEdit(row)}>Изменить</button><button className="danger-link" onClick={() => removeDish(row)}>Удалить</button></div> },
        ]} /></div>
      </section>
      <Modal open={modal} title={editing ? 'Редактировать блюдо' : 'Новое блюдо'} onClose={() => setModal(false)}>
        <form className="modal-form" onSubmit={saveDish}>
          <FormField label="Название"><Input value={dishForm.name} onChange={(e) => setField('name', e.target.value)} required /></FormField>
          <FormField label="Описание"><TextArea rows="3" value={dishForm.description} onChange={(e) => setField('description', e.target.value)} required /></FormField>
          <div className="form-grid">
            <FormField label="Цена на гостя"><Input type="number" step="0.01" min="0" value={dishForm.pricePerPerson} onChange={(e) => setField('pricePerPerson', e.target.value)} required /></FormField>
            <FormField label="Категория"><Select value={dishForm.categoryId} onChange={(e) => setField('categoryId', e.target.value)} required>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></FormField>
            <FormField label="Тип изображения"><Select value={dishForm.imageKey} onChange={(e) => setField('imageKey', e.target.value)}><option value="canape">Канапе</option><option value="appetizer">Закуска</option><option value="hot">Горячее</option><option value="salad">Салат</option><option value="dessert">Десерт</option><option value="drink">Напиток</option></Select></FormField>
          </div>
          <div className="check-row"><label className="check"><input type="checkbox" checked={dishForm.isVegetarian} onChange={(e) => setField('isVegetarian', e.target.checked)} /> Вегетарианское</label><label className="check"><input type="checkbox" checked={dishForm.isFeatured} onChange={(e) => setField('isFeatured', e.target.checked)} /> Показывать на главной</label></div>
          <div className="modal-actions"><Button variant="ghost" type="button" onClick={() => setModal(false)}>Отмена</Button><Button type="submit">Сохранить</Button></div>
        </form>
      </Modal>
      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
