# Changelog

All versions stay available on the CDN: `https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@<version>/lightwebsiteui.js` (3.x) and `https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@<version>/blockui.js` (1.x–2.x, published as BlockUI).

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
