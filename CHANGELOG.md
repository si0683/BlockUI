# Changelog

All versions stay available on the CDN: `https://cdn.jsdelivr.net/gh/si0683/BlockUI@<version>/blockui.js`.

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
