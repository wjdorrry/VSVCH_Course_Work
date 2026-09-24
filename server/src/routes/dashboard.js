import express from 'express';
import { fn, col, Op } from 'sequelize';
import { CateringRequest, Status, RequestItem, Dish } from '../models/index.js';
import { requireAuth, requireManager } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard/stats', requireAuth, requireManager, async (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const requestCount = await CateringRequest.count();
  const upcomingCount = await CateringRequest.count({ where: { eventDate: { [Op.gte]: today } } });
  const revenue = await CateringRequest.sum('estimatedTotal');
  const statusRows = await CateringRequest.findAll({
    attributes: ['statusId', [fn('COUNT', col('CateringRequest.id')), 'count']],
    include: [{ model: Status, attributes: ['name', 'label'] }],
    group: ['statusId', 'Status.id'],
    order: [['statusId', 'ASC']],
  });
  const popular = await RequestItem.findAll({
    attributes: ['dishId', [fn('SUM', col('quantity')), 'totalQuantity']],
    include: [{ model: Dish, attributes: ['name'] }],
    group: ['dishId', 'Dish.id'],
    order: [[fn('SUM', col('quantity')), 'DESC']],
    limit: 5,
  });
  res.json({ requestCount, upcomingCount, revenue: Number(revenue || 0), byStatus: statusRows, popular });
});

export default router;
