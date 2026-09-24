# REST API

Базовый адрес: `http://localhost:4000/api`.

## Авторизация
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

## Справочники и меню
- `GET /categories`
- `GET /event-types`
- `GET /statuses`
- `GET /dishes`
- `POST /dishes` — MANAGER
- `PUT /dishes/:id` — MANAGER
- `DELETE /dishes/:id` — MANAGER

## Заявки
- `POST /requests` — CLIENT
- `GET /requests/my` — авторизованный клиент
- `GET /requests` — MANAGER
- `PATCH /requests/:id/status` — MANAGER

## Аналитика и отчеты
- `GET /dashboard/stats` — MANAGER
- `GET /reports/requests.pdf?from=YYYY-MM-DD&to=YYYY-MM-DD` — MANAGER
- `GET /reports/dishes.pdf?from=YYYY-MM-DD&to=YYYY-MM-DD` — MANAGER
