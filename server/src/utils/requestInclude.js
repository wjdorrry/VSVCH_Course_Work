import { User, EventType, Status, RequestItem, Dish, Category } from '../models/index.js';

export const requestInclude = [
  { model: User, attributes: ['id', 'name', 'email', 'phone'] },
  EventType,
  Status,
  {
    model: RequestItem,
    as: 'items',
    include: [{ model: Dish, include: [Category] }],
  },
];
