# Payload CMS

Проект создан с CMS (`--cms=payload`). Тексты сайта, тарифы, отзывы и вопросы правятся в админке, заявки с формы сохраняются туда же.

```
my-site/
  src/            сайт (Astro): берёт контент из CMS — src/data/content.ts
  cms/            Payload 3 (Next.js): админка, API, база данных
    src/collections/   Преимущества, Тарифы, Отзывы, Вопросы, Заявки, Файлы, Пользователи
    src/globals/Site.ts   Настройки сайта: название, заголовок, контакты, меню
    src/db.ts          база: SQLite или PostgreSQL
    .env               DATABASE_URL, PAYLOAD_SECRET, SITE_URL (не коммитить)
```

## Запуск

Нужны два терминала:

```bash
npm run cms   # 1) CMS: http://localhost:3000/admin
npm run dev   # 2) сайт: http://localhost:4321
```

С PostgreSQL сначала поднимите базу. Нужен [Docker](https://www.docker.com/):

```bash
cd cms && docker compose up -d
```

При первом входе в админку Payload попросит создать первого пользователя — это ваш администратор. Демо-контент шаблона появится в базе сам при первом запуске CMS.

## Как сайт получает данные

- `src/data/content.ts` читает REST API: `/api/globals/site`, `/api/features`, `/api/plans`, `/api/reviews`, `/api/faq`. Адрес CMS задаётся в `PUBLIC_CMS_URL` в файле `.env` сайта.
- **В `npm run dev`** данные читаются при каждом обновлении страницы: поменяли текст в админке — обновите страницу.
- **В `npm run build`** сайт собирается в статический HTML с контентом на момент сборки. После правок в админке сайт нужно пересобрать. Варианты:
  - пересобрать вручную (`npm run build`) или запустить workflow в GitHub Actions;
  - автоматически: хук `afterChange` в коллекции вызывает [repository_dispatch](https://docs.github.com/rest/repos/repos#create-a-repository-dispatch-event) GitHub или вебхук вашего хостинга;
  - перевести сайт в серверный режим Astro (адаптер `@astrojs/node`) — тогда контент всегда свежий.
- Если CMS недоступна, сайт собирается с демо-контентом из `src/data/site.ts` и пишет предупреждение `[cms]` в консоль.

## Заявки

- Форма отправляет `POST {PUBLIC_CMS_URL}/api/leads` (`src/lib/leads.ts`).
- Создать заявку может кто угодно, а видят и меняют их только пользователи админки.
- Защита от спама: скрытое поле-ловушка (`website`) и ограничение длины полей.
- Сайт должен быть указан в `SITE_URL` в `cms/.env` (несколько адресов — через запятую), иначе браузер заблокирует запрос (CORS).

Уведомления о заявках в Telegram или на почту добавляются хуком `afterChange` в `cms/src/collections/Leads.ts`.

## База данных

|       | SQLite                       | PostgreSQL                         |
| ----- | ---------------------------- | ---------------------------------- |
| Где   | файл `cms/cms.db`            | сервер БД (локально — Docker)      |
| Бэкап | скопировать файл             | `pg_dump`                          |
| Когда | сайт компании, 1–2 редактора | SaaS, магазин, много пользователей |

- В разработке Payload сам обновляет схему базы.
- Для продакшена используйте миграции:
  ```bash
  cd cms
  npm run payload migrate:create   # после изменения коллекций
  npm run payload migrate          # на сервере перед запуском
  ```
- Переехать с SQLite на PostgreSQL можно так: создайте проект с `--db=postgres` и перенесите `cms/src/db.ts`, зависимость `@payloadcms/db-postgres` и `docker-compose.yml`.

## Выкладка

**CMS** — на сервер с Node.js 22+ (VPS):

```bash
cd cms && npm ci && npm run build && npm run start   # порт 3000
```

- Поставьте перед CMS nginx с HTTPS.
- Процесс держите под pm2 или systemd.
- В `cms/.env` на сервере укажите:
  - свой `PAYLOAD_SECRET` — длинную случайную строку;
  - `DATABASE_URL`;
  - `SITE_URL=https://ваш-сайт`;
  - `CMS_URL=https://cms.ваш-сайт` — адрес самой админки. Без него Payload не примет cookie от админки, и правки не сохранятся.

**Сайт** — куда угодно как статический (GitHub Pages: workflow уже есть). В GitHub: Settings → Secrets and variables → Actions → Variables добавьте `PUBLIC_CMS_URL=https://cms.ваш-сайт`.

## Изменить структуру

1. Поля и коллекции правятся в `cms/src/collections/*.ts` и `cms/src/globals/*.ts`.
2. После изменений обновите типы: `cd cms && npm run generate:types`.
3. Затем поправьте `src/data/content.ts`, если меняется форма данных для страницы.

Документация: https://payloadcms.com/docs
