import { Link } from 'react-router-dom';
export default function Breadcrumbs({ current }) {
  return <div className="breadcrumbs"><Link to="/">Главная</Link><span>/</span><span>{current}</span></div>;
}
