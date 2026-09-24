GATHER — онлайн-платформа для управления системой кейтеринга
Курсовой проект. Минимальная реализация требований методички.

БЫСТРЫЙ ЗАПУСК WINDOWS
1. Установить Node.js 20+ и Docker Desktop (или PostgreSQL 15/16 отдельно).
2. Распаковать проект.
3. Дважды нажать start-project.bat.
4. После запуска открыть http://localhost:5173

Если Docker не используется:
- создать PostgreSQL БД catering_platform;
- указать логин/пароль в server/.env;
- выполнить npm install;
- выполнить npm run db:seed;
- выполнить npm run dev.

ТЕСТОВЫЕ АККАУНТЫ
Менеджер: manager@catering.local / demo1234
Клиент: client1@catering.local / demo1234

ВАЖНО ПРО БИБЛИОТЕКИ
В проекте есть package.json для корня, client и server со всеми необходимыми зависимостями.
Папка node_modules намеренно не хранится в архиве: npm автоматически скачивает точные библиотеки командой npm install.
Это стандартный способ передачи Node/React-проектов и позволяет не раздувать ZIP на сотни мегабайт.

СТРУКТУРА
client/     React + Vite
server/     Node.js + Express + Sequelize
server/.env готов для локальной PostgreSQL из docker-compose.yml
database/   SQL-схема/резервная учебная выгрузка
docs/       соответствие методичке и перечень функций
