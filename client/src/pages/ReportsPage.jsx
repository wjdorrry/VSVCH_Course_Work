import { useEffect, useMemo, useState } from 'react';
import { api, downloadReport } from '../api/api.js';
import PageHeader from '../components/PageHeader.jsx';
import FormField from '../components/FormField.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import BarChart from '../components/BarChart.jsx';
import Toast from '../components/Toast.jsx';

export default function ReportsPage() {
  const [range, setRange] = useState({ from: '', to: '' });
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState('');
  useEffect(() => { api('/dashboard/stats').then(setStats); }, []);
  const popular = useMemo(() => (stats?.popular || []).map((row) => ({ label: row.Dish?.name, value: Number(row.totalQuantity) })), [stats]);
  const query = () => {
    const p = new URLSearchParams();
    if (range.from) p.set('from', range.from);
    if (range.to) p.set('to', range.to);
    const s = p.toString();
    return s ? `?${s}` : '';
  };
  const download = async (type) => {
    try {
      if (type === 'requests') await downloadReport(`/reports/requests.pdf${query()}`, 'catering-requests-report.pdf');
      else await downloadReport(`/reports/dishes.pdf${query()}`, 'popular-dishes-report.pdf');
      setToast('Отчет сформирован и скачан');
    } catch (err) { setToast(err.message); }
  };

  return (
    <>
      <PageHeader current="Отчеты" eyebrow="Аналитика" title="Отчеты" text="Два обязательных отчета проекта формируются на сервере в формате PDF." />
      <section className="container section compact-top">
        <div className="panel report-filter"><div><h2>Период</h2><p className="muted">Если даты не указаны, отчет будет сформирован по всем данным.</p></div><div className="form-grid"><FormField label="С"><Input type="date" value={range.from} onChange={(e) => setRange((p) => ({ ...p, from: e.target.value }))} /></FormField><FormField label="По"><Input type="date" value={range.to} onChange={(e) => setRange((p) => ({ ...p, to: e.target.value }))} /></FormField></div></div>
        <div className="report-grid">
          <article className="report-card"><span>01</span><h2>Заявки за период</h2><p>Номер заявки, дата, клиент, количество гостей, статус и ориентировочная сумма.</p><Button onClick={() => download('requests')}>Скачать PDF</Button></article>
          <article className="report-card"><span>02</span><h2>Популярность блюд</h2><p>Список блюд, отсортированный по количеству выбранных позиций в заявках.</p><Button onClick={() => download('dishes')}>Скачать PDF</Button></article>
        </div>
        <div className="panel"><h2>Популярные блюда — краткий график</h2><BarChart rows={popular} /></div>
      </section>
      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
