import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/api.js';
import { usePlan } from '../context/PlanContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import SearchInput from '../components/SearchInput.jsx';
import CategoryPill from '../components/CategoryPill.jsx';
import DishCard from '../components/DishCard.jsx';
import Select from '../components/Select.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Toast from '../components/Toast.jsx';

const FILTER_KEY = 'catering_menu_filters';
const initialFilters = { q: '', category: '', vegetarian: false, sort: 'name_asc' };

export default function MenuPage() {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(FILTER_KEY)) || initialFilters; } catch { return initialFilters; } })();
  const [filters, setFilters] = useState(saved);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const { addDish } = usePlan();
  const { user } = useAuth();

  useEffect(() => { api('/categories').then(setCategories); }, []);
  useEffect(() => {
    localStorage.setItem(FILTER_KEY, JSON.stringify(filters));
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category) params.set('category', filters.category);
    if (filters.vegetarian) params.set('vegetarian', 'true');
    params.set('sort', filters.sort);
    const timer = setTimeout(() => api(`/dishes?${params}`).then(setDishes).finally(() => setLoading(false)), 180);
    return () => clearTimeout(timer);
  }, [filters]);

  const activeCategory = useMemo(() => Number(filters.category) || '', [filters.category]);
  const update = (patch) => setFilters((prev) => ({ ...prev, ...patch }));
  const reset = () => {
    localStorage.removeItem(FILTER_KEY);
    setFilters(initialFilters);
  };
  const add = (dish) => {
    addDish(dish);
    setToast(`${dish.name} добавлено в подбор меню`);
  };

  return (
    <>
      <PageHeader current="Меню" eyebrow="Каталог" title="Меню кейтеринга" text="Выберите блюда для будущего мероприятия. Фильтры сохраняются после перезагрузки страницы." />
      <section className="container section compact-top">
        <div className="filter-panel">
          <SearchInput value={filters.q} onChange={(q) => update({ q })} />
          <Select value={filters.sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Сортировка">
            <option value="name_asc">По названию</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="price_desc">Сначала дороже</option>
          </Select>
          <label className="check"><input type="checkbox" checked={filters.vegetarian} onChange={(e) => update({ vegetarian: e.target.checked })} /> Только вегетарианские</label>
          <Button variant="ghost" onClick={reset}>Сбросить настройки</Button>
        </div>
        <div className="category-row">
          <CategoryPill active={activeCategory === ''} onClick={() => update({ category: '' })}>Все</CategoryPill>
          {categories.map((category) => <CategoryPill key={category.id} active={activeCategory === category.id} onClick={() => update({ category: String(category.id) })}>{category.name}</CategoryPill>)}
        </div>
        {loading ? <LoadingSpinner /> : dishes.length ? (
          <div className="dish-grid">{dishes.map((dish) => <DishCard key={dish.id} dish={dish} onAdd={user?.role === 'CLIENT' ? add : undefined} />)}</div>
        ) : <EmptyState title="Блюда не найдены" text="Измените параметры поиска или сбросьте фильтры." />}
      </section>
      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
