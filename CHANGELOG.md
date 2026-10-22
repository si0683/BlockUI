# Changelog

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
