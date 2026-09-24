const map = {
  canape: '/assets/canape.svg',
  appetizer: '/assets/appetizer.svg',
  hot: '/assets/hot.svg',
  salad: '/assets/salad.svg',
  dessert: '/assets/dessert.svg',
  drink: '/assets/drink.svg',
};

export default function DishImage({ imageKey, alt = '' }) {
  return <img className="dish-image" src={map[imageKey] || map.appetizer} alt={alt} />;
}
