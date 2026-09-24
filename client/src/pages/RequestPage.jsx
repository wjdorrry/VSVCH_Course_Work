import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api.js';
import { usePlan } from '../context/PlanContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import FormField from '../components/FormField.jsx';
import Input from '../components/Input.jsx';
import Select from '../components/Select.jsx';
import TextArea from '../components/TextArea.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import DishImage from '../components/DishImage.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';

export default function RequestPage() {
  const { items, setQuantity, clear, totalPerPerson } = usePlan();
  const [eventTypes, setEventTypes] = useState([]);
  const [form, setForm] = useState({ eventDate: '', guestsCount: 20, eventTypeId: '', address: '', comment: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { api('/event-types').then((data) => { setEventTypes(data); if (data[0]) setForm((prev) => ({ ...prev, eventTypeId: String(data[0].id) })); }); }, []);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const total = totalPerPerson * Number(form.guestsCount || 0);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api('/requests', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          guestsCount: Number(form.guestsCount),
          eventTypeId: Number(form.eventTypeId),
          items: items.map((item) => ({ dishId: item.dish.id, quantity: item.quantity })),
        }),
      });
      clear();
      navigate('/my-requests', { state: { created: true } });
    } catch (err) {
      setError(err.message);
    } finally { setSaving(false); }
  };

  return (
    <>
      <PageHeader current="Оформление заявки" eyebrow="Новое мероприятие" title="Заявка на кейтеринг" text="Стоимость является ориентировочной и рассчитывается по выбранному меню и количеству гостей." />
      <section className="container section compact-top">
        {!items.length ? <EmptyState title="Меню пока не выбрано" text="Перейдите в каталог и добавьте хотя бы одно блюдо." /> : (
          <form className="request-layout" onSubmit={submit}>
            <div className="panel">
              <h2>Данные мероприятия</h2>
              <div className="form-grid">
                <FormField label="Тип мероприятия"><Select value={form.eventTypeId} onChange={(e) => set('eventTypeId', e.target.value)} required>{eventTypes.map((type) => <option value={type.id} key={type.id}>{type.name}</option>)}</Select></FormField>
                <FormField label="Дата"><Input type="date" value={form.eventDate} onChange={(e) => set('eventDate', e.target.value)} required /></FormField>
                <FormField label="Количество гостей"><Input type="number" min="1" max="500" value={form.guestsCount} onChange={(e) => set('guestsCount', e.target.value)} required /></FormField>
                <FormField label="Адрес"><Input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Город, улица, дом" required /></FormField>
              </div>
              <FormField label="Комментарий"><TextArea rows="4" value={form.comment} onChange={(e) => set('comment', e.target.value)} placeholder="Пожелания по сервировке или мероприятию" /></FormField>
            </div>
            <div className="panel order-summary">
              <h2>Выбранное меню</h2>
              <div className="selected-list">
                {items.map((item) => <div className="selected-item" key={item.dish.id}><DishImage imageKey={item.dish.imageKey} alt=""/><div><b>{item.dish.name}</b><small>{Number(item.dish.pricePerPerson).toFixed(2)} BYN / гость</small></div><QuantityStepper value={item.quantity} onChange={(value) => setQuantity(item.dish.id, value)} /></div>)}
              </div>
              <div className="summary-lines"><span>На одного гостя <b>{totalPerPerson.toFixed(2)} BYN</b></span><span>Гостей <b>{form.guestsCount || 0}</b></span><strong>Ориентировочно <em>{total.toFixed(2)} BYN</em></strong></div>
              <Button type="submit" disabled={saving}>{saving ? 'Отправляем...' : 'Отправить заявку'}</Button>
            </div>
          </form>
        )}
      </section>
      <Toast message={error} type="error" onClose={() => setError('')} />
    </>
  );
}
