# Universal Bilet App

Готовый шаблон «сайт + сервер» для экзаменационных билетов:
- Node.js + Express
- Sequelize ORM + PostgreSQL
- EJS + Bootstrap 5
- express-session
- bcrypt

## Быстрый старт

1. Скопируйте окружение:

```bash
cp .env.example .env
```

2. Установите зависимости:

```bash
npm install
```

3. Подготовьте БД PostgreSQL и заполните `.env`.

4. Выполните сидирование:

```bash
npm run db:seed
```

5. Запустите сервер:

```bash
npm run dev
```

Откройте `http://localhost:3000`.

## Демо-авторизация
- login: `admin`
- password: `admin123`

## Что реализовано
- форма входа и выход;
- роли (`admin`, `manager`, `user`);
- список сущностей;
- фильтрация по статусу, типу, исполнителю, дате;
- CRUD (для `admin/manager`);
- обработка ошибок 404/500;
- минимальный UI на Bootstrap 5.
