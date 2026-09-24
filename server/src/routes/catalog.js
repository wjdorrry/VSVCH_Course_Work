import express from 'express';
import { Op } from 'sequelize';
import { Category, Dish, EventType, Status } from '../models/index.js';
import { requireAuth, requireManager } from '../middleware/auth.js';

const router = express.Router();

router.get('/categories', async (_req, res) => res.json(await Category.findAll({ order: [['name', 'ASC']] })));
router.get('/event-types', async (_req, res) => res.json(await EventType.findAll({ order: [['id', 'ASC']] })));
router.get('/statuses', requireAuth, async (_req, res) => res.json(await Status.findAll({ order: [['id', 'ASC']] })));

router.get('/dishes', async (req, res) => {
  const { q = '', category = '', vegetarian = '', sort = 'name_asc', featured = '' } = req.query;
  const where = {};
  if (q) where.name = { [Op.iLike]: `%${q}%` };
  if (category) where.categoryId = Number(category);
  if (vegetarian === 'true') where.isVegetarian = true;
  if (featured === 'true') where.isFeatured = true;

  const orderMap = {
    name_asc: [['name', 'ASC']],
    price_asc: [['pricePerPerson', 'ASC']],
    price_desc: [['pricePerPerson', 'DESC']],
  };
  const dishes = await Dish.findAll({ where, include: Category, order: orderMap[sort] || orderMap.name_asc });
  res.json(dishes);
});

router.post('/dishes', requireAuth, requireManager, async (req, res) => {
  try {
    const dish = await Dish.create(req.body);
    await dish.reload({ include: Category });
    res.status(201).json(dish);
  } catch (error) {
    res.status(400).json({ message: 'Не удалось добавить блюдо' });
  }
});

router.put('/dishes/:id', requireAuth, requireManager, async (req, res) => {
  const dish = await Dish.findByPk(req.params.id);
  if (!dish) return res.status(404).json({ message: 'Блюдо не найдено' });
  await dish.update(req.body);
  await dish.reload({ include: Category });
  res.json(dish);
});

router.delete('/dishes/:id', requireAuth, requireManager, async (req, res) => {
  const dish = await Dish.findByPk(req.params.id);
  if (!dish) return res.status(404).json({ message: 'Блюдо не найдено' });
  await dish.destroy();
  res.status(204).end();
});

export default router;
