import express from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import { CateringRequest, RequestItem, Dish, Status } from '../models/index.js';
import { requireAuth, requireManager } from '../middleware/auth.js';
import { requestInclude } from '../utils/requestInclude.js';

const router = express.Router();

router.post('/requests', requireAuth, async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { eventDate, guestsCount, address, comment, eventTypeId, items } = req.body;
    if (!eventDate || !guestsCount || !address || !eventTypeId || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Заполните данные мероприятия и выберите блюда' });
    }

    const dishIds = items.map((item) => Number(item.dishId));
    const dishes = await Dish.findAll({ where: { id: dishIds }, transaction });
    const dishMap = new Map(dishes.map((dish) => [dish.id, dish]));
    if (dishes.length !== dishIds.length) throw new Error('Некоторые блюда не найдены');

    const totalPerPerson = items.reduce((sum, item) => {
      const dish = dishMap.get(Number(item.dishId));
      return sum + Number(dish.pricePerPerson) * Number(item.quantity || 1);
    }, 0);
    const estimatedTotal = totalPerPerson * Number(guestsCount);
    const newStatus = await Status.findOne({ where: { name: 'NEW' }, transaction });

    const request = await CateringRequest.create({
      eventDate,
      guestsCount: Number(guestsCount),
      address,
      comment: comment || null,
      estimatedTotal,
      userId: req.user.id,
      eventTypeId: Number(eventTypeId),
      statusId: newStatus.id,
    }, { transaction });

    for (const item of items) {
      const dish = dishMap.get(Number(item.dishId));
      await RequestItem.create({
        requestId: request.id,
        dishId: dish.id,
        quantity: Number(item.quantity || 1),
        unitPrice: dish.pricePerPerson,
      }, { transaction });
    }

    await transaction.commit();
    const result = await CateringRequest.findByPk(request.id, { include: requestInclude });
    res.status(201).json(result);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: error.message || 'Не удалось создать заявку' });
  }
});

router.get('/requests/my', requireAuth, async (req, res) => {
  const where = { userId: req.user.id };
  if (req.query.status) where.statusId = Number(req.query.status);
  const requests = await CateringRequest.findAll({ where, include: requestInclude, order: [['createdAt', 'DESC']] });
  res.json(requests);
});

router.get('/requests', requireAuth, requireManager, async (req, res) => {
  const where = {};
  if (req.query.status) where.statusId = Number(req.query.status);
  if (req.query.from || req.query.to) {
    where.eventDate = {};
    if (req.query.from) where.eventDate[Op.gte] = req.query.from;
    if (req.query.to) where.eventDate[Op.lte] = req.query.to;
  }
  const requests = await CateringRequest.findAll({ where, include: requestInclude, order: [['eventDate', 'ASC']] });
  res.json(requests);
});

router.patch('/requests/:id/status', requireAuth, requireManager, async (req, res) => {
  const request = await CateringRequest.findByPk(req.params.id);
  if (!request) return res.status(404).json({ message: 'Заявка не найдена' });
  const status = await Status.findByPk(Number(req.body.statusId));
  if (!status) return res.status(400).json({ message: 'Некорректный статус' });
  await request.update({ statusId: status.id });
  const result = await CateringRequest.findByPk(request.id, { include: requestInclude });
  res.json(result);
});

export default router;
