# База данных

Проект использует PostgreSQL и восемь связанных таблиц в третьей нормальной форме:
`roles`, `users`, `event_types`, `statuses`, `categories`, `dishes`, `catering_requests`, `request_items`.

Основной способ подготовки БД для разработки — `npm run db:seed`. Скрипт Sequelize пересоздаёт таблицы и создаёт 246+ демонстрационных записей.

Файл `catering_backup.sql` — готовая SQL-выгрузка схемы и демонстрационных данных для PostgreSQL. Она также создаёт больше 200 записей.
