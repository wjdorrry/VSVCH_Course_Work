import DishImage from './DishImage.jsx';
import Button from './Button.jsx';

export default function DishCard({ dish, onAdd }) {
  return (
    <article className="dish-card">
      <DishImage imageKey={dish.imageKey} alt={dish.name} />
      <div className="dish-card-body">
        <div className="dish-meta"><span>{dish.Category?.name}</span>{dish.isVegetarian && <span className="veg">Вег.</span>}</div>
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
        <div className="dish-card-footer">
          <strong>{Number(dish.pricePerPerson).toFixed(2)} BYN <small>/ гость</small></strong>
          {onAdd && <Button onClick={() => onAdd(dish)}>Добавить</Button>}
        </div>
      </div>
    </article>
  );
}
