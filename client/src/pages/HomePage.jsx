import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/api.js';
import DishCard from '../components/DishCard.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { usePlan } from '../context/PlanContext.jsx';

export default function HomePage() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addDish } = usePlan();

  useEffect(() => {
    api('/dishes?featured=true')
      .then(setDishes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">Кейтеринг для вашего события</span>
          <h1>Организуйте мероприятие <em>без лишней суеты</em></h1>
          <p>Выберите формат, соберите меню и отправьте заявку. Менеджер увидит все детали и подтвердит мероприятие.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/menu">Собрать меню</Link>
            {user?.role === 'CLIENT' && <Link className="btn btn-outline" to="/my-requests">Мои заявки</Link>}
          </div>
          <div className="hero-facts"><span><b>30+</b> блюд</span><span><b>5</b> форматов событий</span><span><b>1</b> заявка — все детали</span></div>
        </div>
        <div className="hero-visual">
          <img src="/assets/hero.svg" alt="Сервировка кейтеринга" />
          <div className="hero-note"><b>Фуршет от 10 гостей</b><span>подбор меню за несколько минут</span></div>
        </div>
      </section>

            {/* Демонстрационный рекламный блок для модели распространения Adware */}
      <section className="section container">
        <div
          style={{
            padding: '24px',
            border: '1px solid #ddd',
            borderRadius: '18px',
            background: '#fff',
          }}
        >
          <span className="eyebrow">Реклама</span>

          <h2 style={{ marginTop: '8px', marginBottom: '10px' }}>
            Всё для вашего мероприятия в одном месте
          </h2>

          <p style={{ marginBottom: '16px' }}>
            Аренда мебели, декор, доставка напитков и другие услуги для организации вашего события.
          </p>

          <button className="btn btn-outline" type="button">
            Подробнее
          </button>
        </div>
      </section>

      <section className="section container">
        <SectionTitle centered eyebrow="Популярное" title="Блюда для фуршета" text="Небольшая подборка из каталога. Полное меню доступно на отдельной странице." />
        {loading ? <LoadingSpinner /> : <div className="dish-grid">{dishes.slice(0, 4).map((dish) => <DishCard key={dish.id} dish={dish} onAdd={user?.role === 'CLIENT' ? addDish : undefined} />)}</div>}
        <div className="center-action"><Link className="btn btn-outline" to="/menu">Все блюда</Link></div>
      </section>

      <section className="section process-section">
        <div className="container">
          <SectionTitle eyebrow="Как это работает" title="Три шага до готовой заявки" />
          <div className="process-grid">
            <article><span>01</span><h3>Выберите блюда</h3><p>Используйте категории, поиск и фильтры, чтобы собрать подходящее меню.</p></article>
            <article><span>02</span><h3>Укажите событие</h3><p>Дата, формат, количество гостей, адрес и комментарий для менеджера.</p></article>
            <article><span>03</span><h3>Получите подтверждение</h3><p>Менеджер обработает заявку и изменит ее статус в системе.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}
