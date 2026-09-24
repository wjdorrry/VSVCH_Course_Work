import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await register(form); navigate('/'); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  return (
    <section className="auth-section container"><div className="auth-card"><span className="eyebrow">Новый клиент</span><h1>Регистрация</h1><p>Созданный аккаунт получает роль клиента.</p><form onSubmit={submit}><FormField label="Имя"><Input value={form.name} onChange={(e) => set('name', e.target.value)} required /></FormField><FormField label="Email"><Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required /></FormField><FormField label="Телефон"><Input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></FormField><FormField label="Пароль" hint="Не менее 6 символов"><Input type="password" minLength="6" value={form.password} onChange={(e) => set('password', e.target.value)} required /></FormField><Button type="submit" disabled={loading}>{loading ? 'Создаем...' : 'Создать аккаунт'}</Button></form><p className="auth-foot">Уже есть аккаунт? <Link to="/login">Войти</Link></p></div><div className="auth-visual"><img src="/assets/dessert.svg" alt="Десерт" /></div><Toast message={error} type="error" onClose={() => setError('')} /></section>
  );
}
