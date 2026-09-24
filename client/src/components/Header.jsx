import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlan } from '../context/PlanContext.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const { items } = usePlan();
  const isManager = user?.role === 'MANAGER';

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="Gather — главная">
          <span className="brand-mark">G</span>
          <span><b>Gather</b><small>catering platform</small></span>
        </Link>
        <nav className="nav" aria-label="Основная навигация">
          <NavLink to="/" end>Главная</NavLink>
          <NavLink to="/menu">Меню</NavLink>
          {user?.role === 'CLIENT' && <NavLink to="/my-requests">Мои заявки</NavLink>}
          {isManager && <NavLink to="/manager">Панель</NavLink>}
          {isManager && <NavLink to="/manager/requests">Заявки</NavLink>}
          {isManager && <NavLink to="/reports">Отчеты</NavLink>}
        </nav>
        <div className="header-actions">
          {user?.role === 'CLIENT' && <Link className="plan-link" to="/request">Подбор меню <span>{items.length}</span></Link>}
          {!user ? (
            <Link className="btn btn-outline btn-sm" to="/login">Войти</Link>
          ) : (
            <button className="btn btn-ghost btn-sm" onClick={logout}>Выйти</button>
          )}
        </div>
      </div>
    </header>
  );
}
