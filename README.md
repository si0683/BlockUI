# LightWebsiteUi

**A website starter in one command:** Astro 7 · React 19 · Tailwind CSS 4 · shadcn/ui · Lucide · Motion · TypeScript.

[Русская версия](README.ru.md) · [Website](https://si0683.github.io/LightWebsiteUi/)

```bash
npm create lightwebsiteui@latest my-site
cd my-site
npm run dev
```

The command copies the template, installs every dependency and creates a git repository. Until the package is on npm, run it straight from GitHub:

```bash
npx github:si0683/LightWebsiteUi my-site
```

Options: `--no-install` (skip `npm install`), `--no-git` (skip `git init`). pnpm, yarn and bun work too (`pnpm create lightwebsiteui`).

## What you get

| | |
|---|---|
| [Astro](https://astro.build) | pages are plain HTML, JavaScript only where needed (islands) |
| [React](https://react.dev) | interactive components |
| [Tailwind CSS 4](https://tailwindcss.com) | styling, via `@tailwindcss/vite` |
| [shadcn/ui](https://ui.shadcn.com) | 19 components ready, add more with `npx shadcn@latest add` |
| [Lucide](https://lucide.dev) | 1,600+ icons, `lucide-react` |
| [Motion](https://motion.dev) | animations for React (`motion/react`), ready `Reveal` for scroll-in blocks |
| TypeScript, ESLint, Prettier | strict types, lint, Tailwind class sorting |

Plus: a ready landing page (header, mobile menu, hero, features, pricing, reviews, FAQ, order dialog, footer) with all texts in one file `src/data/site.ts`, light/dark theme without flicker, a violet-pink-amber theme, `AGENTS.md` for AI assistants and a GitHub Pages workflow.

## Optional CMS: Payload

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload               # SQLite (default)
npm create lightwebsiteui@latest my-site -- --cms=payload --db=postgres # PostgreSQL (Docker locally)
```

Adds [Payload CMS 3](https://payloadcms.com) (Next.js) in `cms/`: Russian admin panel, collections for every block of the demo page (site settings, features, pricing, reviews, FAQ), leads from the order form, demo content seeded on first start. The site reads content over the REST API (`src/data/content.ts`, falls back to `src/data/site.ts` when the CMS is down) and posts leads to it (`src/lib/leads.ts`). Run `npm run cms` + `npm run dev`; details in the project's `PAYLOAD.md`. Without `--cms` (or `--cms=none`) the site stays static with texts in `src/data/site.ts`.

## Optional online payment

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload --pay=yookassa   # YooKassa (Russia)
npm create lightwebsiteui@latest my-site -- --cms=payload --pay=stripe     # Stripe Checkout
```

Works on top of Payload: plans with an amount get a "Pay" button, the CMS creates the order (price from the CMS only) and the payment, the buyer returns to `/thanks`, webhooks and the thanks page re-check the status with the provider API, orders are listed in the admin panel. Test keys first; details in the project's `PAYMENTS.md`.

## Optional two-factor sign-in

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload --2fa            # each user turns it on
npm create lightwebsiteui@latest my-site -- --cms=payload --2fa=required   # mandatory for everyone
```

The admin panel asks for a 6-digit code from an authenticator app after the password ([payload-totp](https://github.com/GeorgeHulpoi/payload-totp)); wrong codes lock the account like wrong passwords; `npm run reset-2fa -- email` in `cms/` for a lost phone. The site's public reads and leads keep working.

## Optional shop

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload --shop                  # orders go to a manager
npm create lightwebsiteui@latest my-site -- --cms=payload --shop --pay=yookassa   # with online payment
```

Categories and products (price, old price, stock, photos, attributes) in the admin panel; `/catalog/`, category and product pages, a cart in the browser and `/order/` with the status. Checkout recalculates prices and checks stock in the CMS, reserves the goods and, with `--pay`, sends the buyer to the payment page. Details in the project's `SHOP.md`.

## Optional exchange with 1C

```bash
npm create lightwebsiteui@latest my-site -- --cms=payload --shop --1c
```

The standard CommerceML exchange ("Обмен с сайтом" in 1C:УТ, КА, ERP, УНФ, Розница) at `/api/1c/exchange`: groups, products, properties, pictures, prices and stock come from 1C, new orders go to 1C, paid / shipped / canceled statuses come back. Large catalogs are loaded in batches, UTF-8 and windows-1251 both work, the exchange log is in the admin panel. Details in the project's `1C.md`.

## Template structure

```
src/
  pages/index.astro       landing page
  layouts/main.astro      <head>, theme script
  data/site.ts            all page texts
  components/site/        site blocks (menu, order dialog, FAQ, reviews, theme toggle, Reveal)
  components/ui/          shadcn/ui components
  styles/global.css       Tailwind + theme tokens
.github/workflows/deploy.yml
AGENTS.md / CLAUDE.md     rules for AI assistants
```

## Build it with AI

[PROMT.md](https://raw.githubusercontent.com/si0683/LightWebsiteUi/main/PROMT.md) is a fill-in brief for AI assistants (Claude Code, Cursor, Codex…): describe your site, web app, service or SaaS — type, pages, features, design — then tell the assistant in the project folder: *"Read PROMT.md and build the project from it."* The whole file is the prompt, so it can also be copied (Ctrl+A) into any AI chat; unfilled fields are fine, the AI asks about them. The file is also copied into every new project. (The brief is in Russian.)

## Developing this repository

```bash
cd template && npm install && npm run dev   # work on the template
npm pack                                    # test the installer: npx ./create-lightwebsiteui-<v>.tgz test
```

Versions up to 3.2.1 were a CDN library (`lightwebsiteui.js`). Their tags stay on jsDelivr, so existing pages keep working.

MIT © si0683
