# Changelog

All versions stay available on the CDN: `https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@<version>/lightwebsiteui.js` (3.x) and `https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@<version>/blockui.js` (1.x–2.x, published as BlockUI).

## 3.2.1

- New examples: Russian landing pages of real businesses from Samara — `remont` (renovation company), `shashlik` (grill house with a cart), `obuv` (shoe repair, before/after gallery), `cvety` (flower shop), `kraski` (paint factory, Tailwind + daisyUI). The English demo sites `coffee`, `robots`, `pets` and `yoga` are removed (they stay in the 3.2.0 tag).
- Headings hyphenate long words (`hyphens: auto`, by the page `lang`) and wrap in balanced lines.
- `tools/build.py` writes absolute GitHub Pages URLs for example photos (`img/…`) into `codepen.html`, so the CodePen copy shows them.

## 3.2.0

Astro support and page swaps.

- Works with Astro's `<ClientRouter />`, which replaces `<body>` and `<html>` attributes on every navigation: `refresh()` restores the `bui-js` class and the `@layer bui` declaration, re-applies style and colour to the new `<body>`, and creates the toast container again.
- The visitor's dark/light choice (theme toggle) is kept across `refresh()` and page swaps (also in Next.js). `start({ dark })` resets it.
- The cart button stays in the header while the cart is not empty, also on pages without products; the order dialog lists products already in the cart.
- New example `examples/astro`: Astro 7 site (home, menu with cart, contacts with map and form) with `<ClientRouter />`.
- `examples/nextjs` now installs 3.2.0.

## 3.1.0

Next.js and React support.

- `LightWebsiteUi.refresh()` — enhance content that appeared without a page load (client-side navigation, fetched HTML). Only new nodes are touched; sliders, maps and timers whose blocks left the page are switched off.
- `LightWebsiteUi.destroy()` — undo everything: listeners, timers, sliders, maps and the elements LightWebsiteUi added. `start()` brings it back (also after destroy in plain pages).
- The ES module entry (`lightwebsiteui.mjs`, used by npm and bundlers) no longer starts by itself: call `start()`. React hydrates the page untouched. The CDN script starts automatically as before.
- The cart button appears as soon as a page with `data-add` is shown; the automatic order dialog picks up products of newly shown pages.
- Gallery lightbox and mobile-menu closing work through one delegated click handler, so they cover content added later.
- New example `examples/nextjs`: Next.js 16 App Router site (home, menu with cart, contacts with map and form).

## 3.0.0

The library is renamed from **BlockUI** to **LightWebsiteUi**. The API is the same; only names change.

- Breaking: the global is `window.LightWebsiteUi` (was `window.BlockUI`): `LightWebsiteUi.start({...})`, `LightWebsiteUi.photo()`, `LightWebsiteUi.avatar()`, `LightWebsiteUi.languages`.
- Breaking: files are `lightwebsiteui.js`, `lightwebsiteui.css`, `lightwebsiteui.mjs`, `lightwebsiteui.d.ts` (were `blockui.*`).
- Breaking: the npm package is `lightwebsiteui` (`blockuijs` was never published).
- HTML stays the same: `bui-*` classes, `--bui-*` variables, the `bui` cascade layer and all `data-*` attributes are unchanged.
- Repository: https://github.com/si0683/LightWebsiteUi, new landing page.
- Migrating from 2.x: replace `BlockUI@2.0.0/blockui.` with `LightWebsiteUi@3.0.0/lightwebsiteui.` in the two CDN links and `BlockUI.` with `LightWebsiteUi.` in your script.

## 2.0.0

General-purpose release for any developer (1.x was built for classroom use).

- **i18n:** `lang: 'en' | 'ru'` (defaults to `<html lang>` or the browser language) and `texts: { ... }` to override any interface string (order dialog, toasts, form labels, countdown units, "Popular" badge).
- **English defaults:** `style: 'clean'`, `color: 'blue'`, currency `$` for English. English and Russian names for styles and colours both work (`cozy` / `уютный`, `red` / `красный`); new synonyms `simple`, `minimal`, `playful`, `fun`, `neon`, `warm`.
- **npm package** `blockuijs` with ES module entry (`blockui.mjs`), TypeScript types (`blockui.d.ts`) and `exports` map. Importing on the server (SSR) is safe and does nothing.
- Phone validation accepts international numbers (7+ digits). Map fallback point is neutral.
- English code comments, English examples, MIT `LICENSE`, `THIRD_PARTY.md`.
- Breaking: default style/colour, default texts in English for non-Russian pages; `thanks`, `orderTitle`, `orderText`, `emptyCart`, `currency` default to the language texts.

## 1.1.0

Iconify icons (`data-icon`), Swiper sliders (`.bui-slider`), Leaflet + OpenStreetMap maps (`data-map`), DiceBear avatars (`data-avatar`).

## 1.0.0

Blocks, 5 styles × 11 colours, photos by keyword, cart, order dialog, forms, counters, countdown, gallery, reveal; Tailwind + daisyUI mode.
