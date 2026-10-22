# Changelog

## 4.7.0 — 2026-10-22

- Optional exchange with 1C: `--1c` together with `--cms=payload --shop` (or an interactive question). CommerceML 2.x endpoint `/api/1c/exchange` for "Обмен с сайтом": Basic auth + session cookie, files in parts with path checks, catalog import in batches (`progress`), groups → nested categories, properties → attributes, pictures → media (uploaded once), prices by `ONEC_PRICE_TYPE` (+ optional old price), stock over warehouses, characteristics merged, deletion marks and full catalogs hide products; orders to 1C (`sale/query`, `success` → "Выгружен в 1С") and statuses from 1C; UTF-8 and windows-1251; exchange log in the admin panel; `1C.md`.
- New base seam `src/addons/integrations.ts` (collections and root endpoints for integrations).

## 4.6.0 — 2026-10-22

- Optional shop: `--shop` together with `--cms=payload` (or an interactive question). CMS: categories, products (price, old price, stock, photos, attributes, 1C id), shop orders with `/api/shop-orders/checkout` (prices and stock from the CMS, reservation, honeypot, return URL check) and `/status`; demo catalog and a "Каталог" menu link on first start. Site: catalog with categories, product pages, a localStorage cart, checkout and the order page; with `--pay` the order is paid online.
- The base CMS now owns the payment interface, a no-op provider and `syncPayment`, shared by plan orders and shop orders; new seam `src/addons/shop.ts`.

## 4.5.0 — 2026-10-22

- Optional two-factor sign-in to the admin panel: `--2fa` (each user turns it on) or `--2fa=required` (mandatory), with `--cms=payload`, or an interactive question. Plugin payload-totp 3.0.6: 6-digit codes from an authenticator app, lockout after wrong codes, Russian UI; `TOTP_REQUIRED` / `TOTP_ISSUER` in `cms/.env`; `npm run reset-2fa -- email` for a lost phone; the PAYLOAD.md section.
- Public parts stay public under the plugin: content reads and new leads carry `custom.totp.disableAccessWrapper`.
- CMS seams are now `src/addons/payments.ts` and `src/addons/security.ts`, so payment and 2FA combine; the installer regenerates types and the admin import map after installing.
- Fix: the CMS's own origin (`CMS_URL`, default `http://localhost:3000`) is trusted in `csrf`; before, cookies sent from the admin panel with that Origin were ignored, so saving in the browser could fail.

## 4.4.0 — 2026-10-22

- Optional online payment: `--pay=none|yookassa|stripe` together with `--cms=payload` (or an interactive question). Adds the "Заказы" collection and `/api/orders/pay`, `/api/orders/webhook`, `/api/orders/status` in the CMS; a "Pay" button with a buyer form on plans that have an amount; the `/thanks` page that polls the order status. The price comes only from the CMS, the return URL only to `SITE_URL`, the status only from the provider API; Stripe webhooks are signature-checked. Providers use plain `fetch` (no SDK). Test keys first, `PAYMENTS.md` per provider (test mode, webhooks, receipts under 54-FZ for YooKassa, going live).
- Plans get an optional "Сумма для онлайн-оплаты" field; seams `plan-action.tsx` (site) and `extensions.ts` (CMS).

## 4.3.0 — 2026-10-22

- Optional Payload CMS: `--cms=none|payload` and `--db=sqlite|postgres` (or interactive questions). Adds `cms/` — Payload 3.91 on Next.js 16 with a Russian admin panel, collections for the demo page (site settings, features, plans, reviews, FAQ), leads with public create only and a honeypot, media and users; demo content seeded on first start; CORS/CSRF from `SITE_URL`; SQLite file or PostgreSQL with `docker-compose.yml`. The installer writes `cms/.env` with a random secret and the site `.env` with `PUBLIC_CMS_URL`, installs both packages; `npm run cms`, `PAYLOAD.md`.
- Site seams: `src/data/content.ts` (`getContent()`) and `src/lib/leads.ts` (`sendLead()`); the order dialog now sends leads, shows sending/error states and has a honeypot field. With the CMS the site reads the REST API and falls back to `src/data/site.ts` when it is down.
- The site tooling ignores `cms/`; the Pages workflow passes `PUBLIC_CMS_URL` from repository variables.

## 4.2.1 — 2026-10-22

- `PROMT.md` is now copy-paste ready: the whole file is the prompt (works in an AI chat without files and with unfilled fields); usage, the filled-in example and tips moved to README.ru.md.

## 4.2.0 — 2026-10-22

- `PROMT.md`: a fill-in brief (in Russian) for building a site, web app, service or SaaS with an AI assistant — type, structure, features, design, quality rules, work stages and acceptance checklist. In the repository root for download and in every new project.

## 4.1.0 — 2026-10-22

- Motion 14 (`motion/react`) added to the template: `Reveal` component fades blocks in on scroll (with a cascade and hover lift), used on the demo page; respects reduced motion.
- Docs: Motion section in the template README, rules in `template/AGENTS.md`.

## 4.0.0 — 2026-10-22

LightWebsiteUi is now a project starter instead of a CDN library.

- `npm create lightwebsiteui` (package `create-lightwebsiteui`): copies the template, installs dependencies, runs `git init`.
- Template: Astro 7, React 19, Tailwind CSS 4, shadcn/ui (radix-nova, 19 components), lucide-react, TypeScript, ESLint, Prettier.
- Ready landing page with texts in `src/data/site.ts`, light/dark theme, GitHub Pages workflow, `AGENTS.md` for AI assistants.
- Removed: `lightwebsiteui.js/.css/.mjs/.d.ts`, examples (Samara businesses, Next.js, Astro), photo tools, AI.md, PROMPT*.md. Tags v1.0.0–v3.2.1 still serve the old library on jsDelivr.
