
## Online payment

This project was created with `--pay` (YooKassa or Stripe). Details: `PAYMENTS.md`.

- CMS: `cms/src/collections/Orders.ts` — orders (create only through the endpoints, read for signed-in users) and endpoints `POST /api/orders/pay`, `POST /api/orders/webhook`, `GET /api/orders/status?order=<token>`. Provider: `cms/src/payments/provider.ts` behind the `PaymentProvider` interface in `types.ts`; registered through `cms/src/extensions.ts`.
- Rules: the price always comes from the plan in the CMS (`amount`), never from the browser; the return URL must be on an origin listed in `SITE_URL`; the real status is always re-read from the provider API (webhooks and the thanks page only trigger a check); keys live in `cms/.env` only.
- Site: `src/components/site/plan-action.tsx` shows `PayDialog` for plans with an amount, otherwise the order form; `src/lib/payments.ts`; `src/pages/thanks.astro` + `payment-status.tsx`.
- Test with test keys (YooKassa `test_…`, Stripe `sk_test_…`); `YOOKASSA_API_URL` / `STRIPE_API_URL` can point to a mock server.
