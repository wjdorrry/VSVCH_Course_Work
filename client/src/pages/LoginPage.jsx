import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import FormField from '../components/FormField.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Toast from '../components/Toast.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('client1@catering.local');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const user = await login(email, password);
      navigate(location.state?.from || (user.role === 'MANAGER' ? '/manager' : '/'), { replace: true });
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <section className="auth-section container"><div className="auth-card"><span className="eyebrow">С возвращением</span><h1>Вход</h1><p>Для демонстрации уже подставлен тестовый клиент.</p><form onSubmit={submit}><FormField label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></FormField><FormField label="Пароль"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></FormField><Button type="submit" disabled={loading}>{loading ? 'Входим...' : 'Войти'}</Button></form><div className="demo-accounts"><b>Менеджер:</b><code>manager@catering.local / demo1234</code></div><p className="auth-foot">Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p></div><div className="auth-visual"><img src="/assets/hero.svg" alt="Кейтеринг" /></div><Toast message={error} type="error" onClose={() => setError('')} /></section>
  );
}
