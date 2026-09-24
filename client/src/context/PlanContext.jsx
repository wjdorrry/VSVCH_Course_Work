import { createContext, useContext, useMemo, useState } from 'react';

const PlanContext = createContext(null);
const KEY = 'catering_plan_items';

export function PlanProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const addDish = (dish) => {
    const existing = items.find((item) => item.dish.id === dish.id);
    const next = existing
      ? items.map((item) => item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { dish, quantity: 1 }];
    persist(next);
  };

  const setQuantity = (dishId, quantity) => {
    const safe = Math.max(0, Number(quantity));
    const next = safe === 0
      ? items.filter((item) => item.dish.id !== dishId)
      : items.map((item) => item.dish.id === dishId ? { ...item, quantity: safe } : item);
    persist(next);
  };

  const clear = () => persist([]);
  const totalPerPerson = items.reduce((sum, item) => sum + Number(item.dish.pricePerPerson) * item.quantity, 0);

  const value = useMemo(() => ({ items, addDish, setQuantity, clear, totalPerPerson }), [items, totalPerPerson]);
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  return useContext(PlanContext);
}
