# Онлайн-оплата: Stripe

Проект создан с `--pay=stripe` (Stripe Checkout). Покупатель оплачивает тариф на странице Stripe и возвращается на «Спасибо». Заказ появляется в админке, раздел «Заказы».

Stripe принимает оплату от клиентов за рубежом. Компании и ИП из России аккаунт Stripe открыть не могут — для оплат в России создайте проект с `--pay=yookassa`.

## Как это работает

1. На тарифе с заполненным полем **«Сумма для онлайн-оплаты»** (админка → Тарифы) появляется кнопка «Оплатить». Тарифы без суммы открывают обычную форму заявки.
2. Сайт отправляет `POST /api/orders/pay` (`src/lib/payments.ts`). CMS берёт цену из тарифа, создаёт заказ и Checkout Session в Stripe и возвращает ссылку на страницу оплаты.
3. После оплаты Stripe возвращает покупателя на `/thanks/?order=…`. Страница спрашивает статус у CMS, а CMS сверяет его со Stripe.
4. Stripe присылает событие на `/api/orders/webhook`. CMS проверяет подпись `Stripe-Signature` и перечитывает статус сессии через API. Заказ становится «Оплачен».

Код: `cms/src/collections/Orders.ts`, `cms/src/payments/provider.ts` (Stripe), `src/components/site/pay-dialog.tsx`, `src/pages/thanks.astro`.

## Тестовый режим

1. В [Dashboard Stripe](https://dashboard.stripe.com) включите Test mode.
2. Developers → API keys: секретный ключ `sk_test_…` пропишите в `cms/.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_…
   STRIPE_CURRENCY=rub   # валюта цен из админки: rub, usd, eur…
   ```
3. Перезапустите `npm run cms` и оплатите тариф картой `4242 4242 4242 4242`: любой будущий срок, любой CVC. Деньги не списываются.

## Вебхук

- Developers → Webhooks → Add endpoint.
- Адрес: `https://<адрес CMS>/api/orders/webhook`.
- События: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`.
- Signing secret (`whsec_…`) пропишите в `STRIPE_WEBHOOK_SECRET`. Без него подпись не проверяется, но статус всё равно сверяется через API.
- Локально удобно через Stripe CLI: `stripe listen --forward-to localhost:3000/api/orders/webhook`. CLI покажет секрет `whsec_…` для `.env`. Страница «Спасибо» и без вебхука сама спросит статус у Stripe.

## Боевой режим

1. Активируйте аккаунт Stripe, замените `sk_test_…` на `sk_live_…`, создайте боевой вебхук и пропишите его секрет.
2. В `cms/.env` укажите `SITE_URL=https://ваш-сайт` — возвращаться после оплаты можно только на эти адреса.

Ключи храните только в `cms/.env` на сервере, в репозиторий их не коммитить.
