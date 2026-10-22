# LightWebsiteUi

**Стартер сайта одной командой:** Astro 7 · React 19 · Tailwind CSS 4 · shadcn/ui · Lucide · Motion · TypeScript.

[English](README.md) · [Сайт](https://si0683.github.io/LightWebsiteUi/)

```bash
npm create lightwebsiteui@latest my-site
cd my-site
npm run dev
```

Команда копирует шаблон, сама ставит все зависимости и создаёт git-репозиторий. Пока пакета нет в npm, запускайте прямо с GitHub:

```bash
npx github:si0683/LightWebsiteUi my-site
```

Работает и с pnpm, yarn, bun (`pnpm create lightwebsiteui`). Без ключей установщик задаёт вопросы в терминале, с ключами — ставит сразу. Ключи пишутся после `--`:

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload --db=sqlite --pay=yookassa --2fa --shop --1c
```

| Ключ | Что делает | Нужно |
|---|---|---|
| `--cms=none\|payload` | админка [Payload CMS](https://payloadcms.com) в `cms/`: контент сайта и заявки | — |
| `--db=sqlite\|postgres` | база CMS: SQLite (по умолчанию) или PostgreSQL | `--cms=payload` |
| `--pay=none\|yookassa\|stripe` | онлайн-оплата: ЮKassa (Россия) или Stripe | `--cms=payload` |
| `--2fa`, `--2fa=required` | вход в админку с кодом из приложения: по желанию или для всех | `--cms=payload` |
| `--shop` | магазин: каталог, карточки, корзина, заказы | `--cms=payload` |
| `--1c` | обмен с 1С: каталог, цены, остатки, заказы | `--shop` |
| `--no-install`, `--no-git` | без `npm install`, без `git init` | — |

Подробно о каждой опции — в разделах ниже.

## Что внутри

| | |
|---|---|
| [Astro](https://astro.build) | страницы — обычный HTML, JavaScript только где нужен (острова) |
| [React](https://react.dev) | интерактивные компоненты |
| [Tailwind CSS 4](https://tailwindcss.com) | стили, через `@tailwindcss/vite` |
| [shadcn/ui](https://ui.shadcn.com) | 19 компонентов уже в проекте, остальные — `npx shadcn@latest add` |
| [Lucide](https://lucide.dev) | 1600+ иконок, `lucide-react` |
| [Motion](https://motion.dev) | анимации React (`motion/react`), готовый `Reveal` — появление блоков при прокрутке |
| TypeScript, ESLint, Prettier | строгие типы, линтер, сортировка классов Tailwind |

А ещё: готовый лендинг (шапка, мобильное меню, первый экран, преимущества, тарифы, отзывы, FAQ, окно заявки, подвал), все тексты в одном файле `src/data/site.ts`, светлая/тёмная тема без мигания, фиолетово-розово-янтарная палитра, `AGENTS.md` для нейросетей и выкладка на GitHub Pages.

## CMS по желанию: Payload

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload               # база SQLite (по умолчанию)
npm create lightwebsiteui@latest my-site -- --cms=payload --db=postgres # база PostgreSQL (локально в Docker)
```

Добавляет [Payload CMS 3](https://payloadcms.com) (Next.js) в папку `cms/`:

- админка на русском;
- коллекции под все блоки демо-страницы: настройки сайта, преимущества, тарифы, отзывы, вопросы;
- заявки с формы;
- демо-контент, который записывается в базу при первом запуске.

Сайт берёт контент через REST API (`src/data/content.ts`). Если CMS недоступна, он берёт тексты из `src/data/site.ts`. Заявки уходят в CMS (`src/lib/leads.ts`).

Запуск: `npm run cms` и `npm run dev` в двух терминалах, подробности — в `PAYLOAD.md` проекта. Без `--cms` (или с `--cms=none`) сайт остаётся статическим, тексты — в `src/data/site.ts`.

## Онлайн-оплата по желанию

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload --pay=yookassa   # ЮKassa (Россия)
npm create lightwebsiteui@latest my-site -- --cms=payload --pay=stripe     # Stripe Checkout
```

Работает поверх Payload:

1. У тарифов с суммой появляется кнопка «Оплатить».
2. CMS создаёт заказ и платёж. Цена берётся только из CMS.
3. Покупатель возвращается на страницу `/thanks`.
4. Вебхук и сама страница перепроверяют статус через API провайдера.
5. Заказы видны в админке.

Сначала — тестовые ключи. Подробности — в `PAYMENTS.md` проекта.

## Вход в админку с кодом (2FA)

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload --2fa            # каждый включает сам
npm create lightwebsiteui@latest my-site -- --cms=payload --2fa=required   # обязательно для всех
```

После пароля админка спрашивает шестизначный код из приложения: Яндекс Ключ, Google Authenticator, Aegis. Сделано плагином [payload-totp](https://github.com/GeorgeHulpoi/payload-totp).

- Неверные коды блокируют вход, как неверный пароль.
- При потере телефона: `npm run reset-2fa -- почта` в папке `cms/`.
- Сайт не затронут: чтение контента и заявки работают как раньше.

## Магазин по желанию

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload --shop                  # заказ уходит менеджеру
npm create lightwebsiteui@latest my-site -- --cms=payload --shop --pay=yookassa   # с онлайн-оплатой
```

- **Админка:** категории и товары — цена, старая цена, остаток, фото, характеристики.
- **Сайт:** страницы `/catalog/`, категорий и товаров, корзина в браузере, `/order/` со статусом заказа.
- **Оформление:** CMS пересчитывает цены и проверяет наличие, резервирует товар, а с `--pay` отправляет покупателя на оплату.

Подробности — в `SHOP.md` проекта.

## Обмен с 1С по желанию

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload --shop --1c
```

- **Протокол:** стандартный CommerceML, «Обмен с сайтом» в 1С:УТ, КА, ERP, УНФ, Рознице. Адрес — `/api/1c/exchange`.
- **Из 1С:** группы, товары, свойства, фото, цены выбранного типа, остатки по складам, статусы заказов (оплачен, отгружен, отменён).
- **В 1С:** новые заказы с составом и контактами покупателя.
- **Надёжность:** большие каталоги грузятся частями, понимает UTF-8 и windows-1251, журнал обмена — в админке.

Подробности — в `1C.md` проекта.

## Структура шаблона

```
src/
  pages/index.astro       главная
  layouts/main.astro      <head>, скрипт темы
  data/site.ts            все тексты страницы
  components/site/        блоки сайта (меню, заявка, FAQ, отзывы, тема, Reveal)
  components/ui/          компоненты shadcn/ui
  styles/global.css       Tailwind + цвета темы
.github/workflows/deploy.yml
AGENTS.md / CLAUDE.md     правила для нейросетей
```

## Проект через ИИ

[PROMT.md](https://raw.githubusercontent.com/si0683/LightWebsiteUi/main/PROMT.md) — готовый промт-ТЗ для ИИ-ассистента (Claude Code, Cursor, Codex, ChatGPT…). Весь файл — это промт:

1. Откройте ссылку, выделите всё (Ctrl+A) и скопируйте (Ctrl+C). Тот же файл лежит в папке каждого нового проекта.
2. Замените `«…»` своими данными, отметьте нужное `[x]`, лишнее удалите. Можно и не заполнять — ИИ задаст вопросы.
3. Вставьте в ИИ. Или положите файл в папку проекта и напишите ассистенту: «Прочитай PROMT.md и сделай по нему проект».

Пример заполнения (коротко):

> **1.** SaaS «ЗаписьПро» — онлайн-запись для салонов красоты. Аудитория — владельцы небольших салонов, 25–45 лет, ведут запись в тетради. Цель — регистрация на 14-дневный пробный период.
> **2.** Публичные: `/`, `/pricing`, `/login`, `/register`. Кабинет: `/app` — календарь записей, `/app/masters` — мастера, `/app/settings` — салон и ссылка для клиентов. Публичная страница записи `/s/[slug]`.
> **3.** Вход по коду на почту; оплата ЮKassa (тарифы 990 ₽ и 2490 ₽ в месяц); уведомления о записи в Telegram; Яндекс Метрика с целью «регистрация».
> **4.** Payload CMS с PostgreSQL (`--cms=payload --db=postgres`), оплата ЮKassa (`--pay=yookassa`), вход в админку с кодом для всех (`--2fa=required`); хостинг на VPS через Docker.
> **5.** Минимализм, как у Linear, основной цвет #7c3aed, обе темы, сдержанные анимации.
> **6.** Тексты напиши сам; юридическое — ИП Иванов И. И., ИНН 000000000000, политика нужна.

Подсказки:

- **Большой проект делайте частями.** Сначала лендинг и вход, потом кабинет, потом оплата. Каждую часть — отдельным запросом к ИИ со ссылкой на этот файл.
- **Меняются требования — правьте PROMT.md** и пишите ИИ: «Я обновил раздел 3 в PROMT.md, учти изменения».
- **ИИ сделал не то** — опишите конкретно: какая страница, что ожидали, что получили, приложите скриншот.
- **Пароли, ключи API и токены оплаты** не вставляйте в промт и в код — только в `.env` на своём компьютере или сервере.

## Разработка репозитория

```bash
cd template && npm install && npm run dev   # правка шаблона
npm pack                                    # проверка установщика: npx ./create-lightwebsiteui-<v>.tgz test
```

Версии до 3.2.1 были CDN-библиотекой (`lightwebsiteui.js`). Их теги остаются на jsDelivr — старые страницы продолжают работать.

MIT © si0683
