import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize } from './config/database.js';
import {
  Role,
  User,
  EventType,
  Status,
  Category,
  Dish,
  CateringRequest,
  RequestItem,
} from './models/index.js';

const names = [
  'Анна', 'Мария', 'Дарья', 'Алексей', 'Илья', 'Елена', 'София', 'Никита', 'Ольга',
  'Роман', 'Ксения', 'Ирина', 'Максим', 'Алина', 'Павел', 'Виктория', 'Артем', 'Полина',
];

const dishes = [
  ['Канапе с лососем', 'Мини-закуска с лососем, сливочным сыром и огурцом', 6.5, false, 'canape'],
  ['Канапе капрезе', 'Томаты черри, моцарелла и базилик', 4.2, true, 'canape'],
  ['Брускетта с томатами', 'Хрустящий багет, томаты, зелень и оливковое масло', 3.8, true, 'appetizer'],
  ['Мини-круассан с индейкой', 'Круассан, индейка, салат и мягкий сыр', 5.2, false, 'appetizer'],
  ['Рулетики из цукини', 'Цукини с мягким сыром и зеленью', 4.5, true, 'appetizer'],
  ['Сырная тарелка', 'Ассорти сыров, виноград и орехи', 8.9, true, 'appetizer'],
  ['Куриные шпажки', 'Куриное филе с овощами на шпажке', 7.2, false, 'hot'],
  ['Мини-кебабы', 'Говядина, зелень и пряности', 8.4, false, 'hot'],
  ['Лосось с овощами', 'Филе лосося и сезонные овощи', 12.5, false, 'hot'],
  ['Овощи гриль', 'Цукини, перец, баклажан и шампиньоны', 6.3, true, 'hot'],
  ['Картофель по-деревенски', 'Запеченный картофель с травами', 4.1, true, 'hot'],
  ['Паста с грибами', 'Паста в сливочном соусе с грибами', 7.8, true, 'hot'],
  ['Салат с киноа', 'Киноа, овощи, зелень и лимонная заправка', 6.6, true, 'salad'],
  ['Цезарь с курицей', 'Салат ромэн, курица, пармезан и соус', 7.4, false, 'salad'],
  ['Салат с лососем', 'Салатный микс, лосось и свежие овощи', 9.4, false, 'salad'],
  ['Греческий салат', 'Овощи, оливки и фета', 5.9, true, 'salad'],
  ['Мини-чизкейк', 'Порционный сливочный чизкейк', 4.7, true, 'dessert'],
  ['Шоколадный тарт', 'Шоколадный тарт с ягодами', 5.1, true, 'dessert'],
  ['Фруктовый стаканчик', 'Ассорти свежих фруктов и ягод', 4.4, true, 'dessert'],
  ['Макарон ассорти', 'Набор миндальных пирожных', 4.9, true, 'dessert'],
  ['Лимонад цитрусовый', 'Домашний лимонад с цитрусами и мятой', 2.8, true, 'drink'],
  ['Морс ягодный', 'Домашний ягодный морс', 2.5, true, 'drink'],
  ['Вода с лимоном', 'Охлажденная вода с лимоном и мятой', 1.6, true, 'drink'],
  ['Кофейная станция', 'Кофе, чай, молоко и сахар', 4.0, true, 'drink'],
  ['Мини-сэндвич с ростбифом', 'Ростбиф, салат и горчичный соус', 6.8, false, 'canape'],
  ['Тарталетка с грибами', 'Тарталетка с грибами и сливочным сыром', 4.6, true, 'canape'],
  ['Мини-бургер', 'Говяжья котлета, сыр и овощи', 7.1, false, 'hot'],
  ['Профитроль ванильный', 'Заварное пирожное с ванильным кремом', 3.9, true, 'dessert'],
  ['Салат с печеной свеклой', 'Свекла, рукола, сыр и орехи', 6.1, true, 'salad'],
  ['Травяной чай', 'Сбор трав, лимон и мед', 2.2, true, 'drink'],
];

async function seed() {
  await sequelize.sync({ force: true });

  const [clientRole, managerRole] = await Role.bulkCreate(
    [{ name: 'CLIENT' }, { name: 'MANAGER' }],
    { returning: true },
  );

  const eventTypes = await EventType.bulkCreate([
    { name: 'Деловая встреча' },
    { name: 'День рождения' },
    { name: 'Свадьба' },
    { name: 'Корпоратив' },
    { name: 'Фуршет' },
  ], { returning: true });

  const statuses = await Status.bulkCreate([
    { name: 'NEW', label: 'Новая' },
    { name: 'CONFIRMED', label: 'Подтверждена' },
    { name: 'COMPLETED', label: 'Завершена' },
    { name: 'CANCELLED', label: 'Отменена' },
  ], { returning: true });

  const categories = await Category.bulkCreate([
    { name: 'Канапе и мини-закуски' },
    { name: 'Горячие блюда' },
    { name: 'Салаты' },
    { name: 'Десерты' },
    { name: 'Напитки' },
    { name: 'Фуршетные наборы' },
  ], { returning: true });

  const categoryByKey = {
    canape: categories[0].id,
    appetizer: categories[5].id,
    hot: categories[1].id,
    salad: categories[2].id,
    dessert: categories[3].id,
    drink: categories[4].id,
  };

  const dishRows = await Dish.bulkCreate(dishes.map((d, index) => ({
    name: d[0],
    description: d[1],
    pricePerPerson: d[2],
    isVegetarian: d[3],
    imageKey: d[4],
    categoryId: categoryByKey[d[4]] || categoryByKey.appetizer,
    isFeatured: index < 8,
  })), { returning: true });

  const passwordHash = await bcrypt.hash('demo1234', 10);
  const manager = await User.create({
    name: 'Менеджер кейтеринга',
    email: 'manager@catering.local',
    phone: '+375 29 000-00-01',
    passwordHash,
    roleId: managerRole.id,
  });

  const clients = [];
  for (let i = 0; i < names.length; i += 1) {
    clients.push(await User.create({
      name: `${names[i]} Клиент`,
      email: `client${i + 1}@catering.local`,
      phone: `+375 29 100-${String(i + 1).padStart(2, '0')}-00`,
      passwordHash,
      roleId: clientRole.id,
    }));
  }

  const requests = [];
  for (let i = 0; i < 60; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() - 30 + i);
    const isoDate = date.toISOString().slice(0, 10);
    requests.push(await CateringRequest.create({
      eventDate: isoDate,
      guestsCount: 10 + ((i * 7) % 75),
      address: `г. Могилев, площадка ${i + 1}`,
      comment: i % 4 === 0 ? 'Нужна сервировка стола' : null,
      estimatedTotal: 350 + i * 17.5,
      userId: clients[i % clients.length].id,
      eventTypeId: eventTypes[i % eventTypes.length].id,
      statusId: statuses[i % statuses.length].id,
    }));
  }

  const requestItems = [];
  for (let i = 0; i < 120; i += 1) {
    const request = requests[i % requests.length];
    const dish = dishRows[(i * 3) % dishRows.length];
    requestItems.push({
      requestId: request.id,
      dishId: dish.id,
      quantity: 1 + (i % 3),
      unitPrice: dish.pricePerPerson,
    });
  }
  await RequestItem.bulkCreate(requestItems);

  const count = (await Role.count()) + (await User.count()) + (await EventType.count()) +
    (await Status.count()) + (await Category.count()) + (await Dish.count()) +
    (await CateringRequest.count()) + (await RequestItem.count());

  console.log(`Database seeded. Total records in 8 tables: ${count}`);
  console.log('Manager: manager@catering.local / demo1234');
  console.log('Client: client1@catering.local / demo1234');
  await sequelize.close();
}

seed().catch(async (error) => {
  console.error(error);
  await sequelize.close();
  process.exit(1);
});
