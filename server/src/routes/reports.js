import express from 'express';
import PDFDocument from 'pdfkit';
import { Op, fn, col } from 'sequelize';
import { CateringRequest, RequestItem, Dish } from '../models/index.js';
import { requireAuth, requireManager } from '../middleware/auth.js';
import { requestInclude } from '../utils/requestInclude.js';

const router = express.Router();

function rangeWhere(from, to) {
  if (!from && !to) return {};
  const eventDate = {};
  if (from) eventDate[Op.gte] = from;
  if (to) eventDate[Op.lte] = to;
  return { eventDate };
}

const translitMap = {
  А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ё: 'E', Ж: 'Zh', З: 'Z', И: 'I', Й: 'Y', К: 'K', Л: 'L', М: 'M', Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F', Х: 'Kh', Ц: 'Ts', Ч: 'Ch', Ш: 'Sh', Щ: 'Sch', Ъ: '', Ы: 'Y', Ь: '', Э: 'E', Ю: 'Yu', Я: 'Ya',
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
function latin(value) {
  return String(value ?? '').split('').map((char) => translitMap[char] ?? char).join('');
}

function pipePdf(res, filename, title, draw) {
  const doc = new PDFDocument({ margin: 46 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  doc.pipe(res);
  doc.fontSize(18).text(title);
  doc.moveDown();
  draw(doc);
  doc.end();
}

router.get('/reports/requests.pdf', requireAuth, requireManager, async (req, res) => {
  const rows = await CateringRequest.findAll({
    where: rangeWhere(req.query.from, req.query.to),
    include: requestInclude,
    order: [['eventDate', 'ASC']],
  });
  pipePdf(res, 'catering-requests-report.pdf', 'Catering requests report', (doc) => {
    doc.fontSize(10).text(`Period: ${req.query.from || 'all'} - ${req.query.to || 'all'}`);
    doc.moveDown();
    rows.forEach((row) => {
      doc.text(`#${row.id} | ${row.eventDate} | ${latin(row.User.name)} | ${row.guestsCount} guests | ${row.Status.name} | ${Number(row.estimatedTotal).toFixed(2)} BYN`);
      doc.moveDown(0.35);
    });
    doc.moveDown().fontSize(11).text(`Total requests: ${rows.length}`);
    doc.text(`Estimated amount: ${rows.reduce((sum, row) => sum + Number(row.estimatedTotal), 0).toFixed(2)} BYN`);
  });
});

router.get('/reports/dishes.pdf', requireAuth, requireManager, async (req, res) => {
  const requestWhere = rangeWhere(req.query.from, req.query.to);
  const rows = await RequestItem.findAll({
    attributes: ['dishId', [fn('SUM', col('quantity')), 'totalQuantity']],
    include: [
      { model: Dish, attributes: ['name'] },
      { model: CateringRequest, attributes: [], where: requestWhere },
    ],
    group: ['dishId', 'Dish.id'],
    order: [[fn('SUM', col('quantity')), 'DESC']],
  });
  pipePdf(res, 'popular-dishes-report.pdf', 'Popular dishes report', (doc) => {
    doc.fontSize(10).text(`Period: ${req.query.from || 'all'} - ${req.query.to || 'all'}`);
    doc.moveDown();
    rows.forEach((row, index) => {
      doc.text(`${index + 1}. ${latin(row.Dish.name)}: ${row.get('totalQuantity')} selections`);
      doc.moveDown(0.35);
    });
  });
});

export default router;
