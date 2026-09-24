-- GATHER catering platform
-- PostgreSQL backup-style script: schema + demo data (>200 rows total)
-- Import example: psql -U catering -d catering_platform -f database/catering_backup.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS request_items CASCADE;
DROP TABLE IF EXISTS catering_requests CASCADE;
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS event_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  role_id INTEGER NOT NULL REFERENCES roles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE event_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE statuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL UNIQUE,
  label VARCHAR(80) NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE dishes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  price_per_person NUMERIC(10,2) NOT NULL CHECK (price_per_person >= 0),
  is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  image_key VARCHAR(40) NOT NULL DEFAULT 'appetizer',
  category_id INTEGER NOT NULL REFERENCES categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE catering_requests (
  id SERIAL PRIMARY KEY,
  event_date DATE NOT NULL,
  guests_count INTEGER NOT NULL CHECK (guests_count > 0),
  address VARCHAR(255) NOT NULL,
  comment TEXT,
  estimated_total NUMERIC(12,2) NOT NULL CHECK (estimated_total >= 0),
  user_id INTEGER NOT NULL REFERENCES users(id),
  event_type_id INTEGER NOT NULL REFERENCES event_types(id),
  status_id INTEGER NOT NULL REFERENCES statuses(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE request_items (
  id SERIAL PRIMARY KEY,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  request_id INTEGER NOT NULL REFERENCES catering_requests(id) ON DELETE CASCADE,
  dish_id INTEGER NOT NULL REFERENCES dishes(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO roles (id, name) VALUES (1, 'CLIENT'), (2, 'MANAGER');
INSERT INTO event_types (id, name) VALUES
  (1, 'Деловая встреча'), (2, 'День рождения'), (3, 'Свадьба'),
  (4, 'Корпоратив'), (5, 'Фуршет');
INSERT INTO statuses (id, name, label) VALUES
  (1, 'NEW', 'Новая'), (2, 'CONFIRMED', 'Подтверждена'),
  (3, 'COMPLETED', 'Завершена'), (4, 'CANCELLED', 'Отменена');
INSERT INTO categories (id, name) VALUES
  (1, 'Канапе и мини-закуски'), (2, 'Горячие блюда'), (3, 'Салаты'),
  (4, 'Десерты'), (5, 'Напитки'), (6, 'Фуршетные наборы');

INSERT INTO users (id, name, email, password_hash, phone, role_id)
VALUES (1, 'Менеджер кейтеринга', 'manager@catering.local', crypt('demo1234', gen_salt('bf', 10)), '+375 29 000-00-01', 2);

INSERT INTO users (id, name, email, password_hash, phone, role_id)
SELECT gs + 1,
       'Клиент ' || gs,
       'client' || gs || '@catering.local',
       crypt('demo1234', gen_salt('bf', 10)),
       '+375 29 100-' || LPAD(gs::text, 2, '0') || '-00',
       1
FROM generate_series(1,18) AS gs;

INSERT INTO dishes (id, name, description, price_per_person, is_vegetarian, is_featured, image_key, category_id)
SELECT gs,
       CASE ((gs - 1) % 6)
         WHEN 0 THEN 'Канапе ' || gs
         WHEN 1 THEN 'Горячее блюдо ' || gs
         WHEN 2 THEN 'Салат ' || gs
         WHEN 3 THEN 'Десерт ' || gs
         WHEN 4 THEN 'Напиток ' || gs
         ELSE 'Фуршетная закуска ' || gs
       END,
       'Демонстрационная позиция кейтерингового меню №' || gs,
       ROUND((2.50 + gs * 0.37)::numeric, 2),
       (gs % 3 = 0),
       (gs <= 8),
       CASE ((gs - 1) % 6)
         WHEN 0 THEN 'canape'
         WHEN 1 THEN 'hot'
         WHEN 2 THEN 'salad'
         WHEN 3 THEN 'dessert'
         WHEN 4 THEN 'drink'
         ELSE 'appetizer'
       END,
       ((gs - 1) % 6) + 1
FROM generate_series(1,30) AS gs;

INSERT INTO catering_requests (id, event_date, guests_count, address, comment, estimated_total, user_id, event_type_id, status_id)
SELECT gs,
       CURRENT_DATE - 30 + gs,
       10 + ((gs * 7) % 75),
       'г. Могилев, площадка ' || gs,
       CASE WHEN gs % 4 = 0 THEN 'Нужна сервировка стола' ELSE NULL END,
       ROUND((350 + gs * 17.50)::numeric, 2),
       2 + ((gs - 1) % 18),
       1 + ((gs - 1) % 5),
       1 + ((gs - 1) % 4)
FROM generate_series(1,60) AS gs;

INSERT INTO request_items (id, quantity, unit_price, request_id, dish_id)
SELECT gs,
       1 + (gs % 3),
       ROUND((2.50 + (((gs * 3 - 1) % 30) + 1) * 0.37)::numeric, 2),
       1 + ((gs - 1) % 60),
       1 + ((gs * 3 - 1) % 30)
FROM generate_series(1,120) AS gs;

SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('event_types_id_seq', (SELECT MAX(id) FROM event_types));
SELECT setval('statuses_id_seq', (SELECT MAX(id) FROM statuses));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('dishes_id_seq', (SELECT MAX(id) FROM dishes));
SELECT setval('catering_requests_id_seq', (SELECT MAX(id) FROM catering_requests));
SELECT setval('request_items_id_seq', (SELECT MAX(id) FROM request_items));

-- Expected total: 2 + 19 + 5 + 4 + 6 + 30 + 60 + 120 = 246 records.
