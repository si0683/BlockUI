
## Shop

This project was created with `--shop`. Details: `SHOP.md`.

- CMS: `cms/src/collections/Categories.ts`, `Products.ts`, `ShopOrders.ts` (registered in `cms/src/addons/shop.ts`, which also seeds the demo catalog). Public read for categories and products (`publicReadCustom`), shop orders only through `POST /api/shop-orders/checkout` and `GET /api/shop-orders/status?order=<token>`; signed-in users manage them.
- Checkout rules: prices, names and stock always come from the CMS; stock is checked and decremented on order creation; the return URL must be on a `SITE_URL` origin; online payment goes through `cms/src/payments/provider.ts` (a no-op without `--pay`) and `payments/sync.ts`.
- Site: `src/data/shop.ts` (REST), `src/lib/cart.ts` (localStorage cart, `cart-change` event), `src/components/shop/*`, `src/layouts/shop.astro`, pages `catalog/index.astro`, `catalog/[slug].astro`, `product/[slug].astro` (static paths from the CMS), `cart.astro`, `order.astro`.
- `externalId` fields and `exportedAt` on orders are filled by the 1C exchange (`--1c`); keep them read-only in the admin panel.
