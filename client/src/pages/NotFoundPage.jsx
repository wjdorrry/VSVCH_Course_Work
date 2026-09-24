import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return <section className="not-found container"><span>404</span><h1>Страница не найдена</h1><p>Проверьте адрес или вернитесь на главную страницу.</p><Link className="btn btn-primary" to="/">На главную</Link></section>;
}
