# 🧱 BlockUI

**Building blocks for beautiful websites.** Two lines of HTML and your page has a style and colour scheme, photos by keyword, a mobile menu, dark theme, cart, order dialog, form validation, toasts, confetti, counters, countdown, sliders, maps, icons and avatars — all driven by plain HTML classes and attributes. No build step, no framework lock-in.

Prefer utility CSS? The **Tailwind + daisyUI mode** keeps all BlockUI behaviour while you design with Tailwind classes.

[Website & live demos](https://si0683.github.io/LightWebsiteUi/) · [API reference](AI.md) · [AI prompt template](PROMPT.md) · [Русский](README.ru.md)

| | | | |
|---|---|---|---|
| [Bean & Brew](https://si0683.github.io/LightWebsiteUi/examples/coffee/) — coffee shop | [RoboCode](https://si0683.github.io/LightWebsiteUi/examples/robots/) — school | [Paws](https://si0683.github.io/LightWebsiteUi/examples/pets/) — shelter | [Lotus](https://si0683.github.io/LightWebsiteUi/examples/yoga/) — Tailwind + daisyUI |

## Install

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/si0683/BlockUI@2.0.0/blockui.css">
<script src="https://cdn.jsdelivr.net/gh/si0683/BlockUI@2.0.0/blockui.js"></script>
```

or

```bash
npm install blockuijs
```
```js
import BlockUI from 'blockuijs';
import 'blockuijs/blockui.css';
```

## A section in a few lines

```html
<section class="bui-hero">
  <div class="bui-container">
    <div>
      <h1 data-name>Margherita</h1>
      <p>Wood-fired pizza delivered in 30 minutes.</p>
      <button class="bui-btn" data-open="order">Order</button>
    </div>
    <div class="bui-hero-picture"><img data-photo="pizza"></div>
  </div>
</section>
<script>BlockUI.start({ name: 'Margherita', style: 'cozy', color: 'red', rain: '🍕' });</script>
```

The order dialog, its form validation and the thank-you toast appear automatically.

## Features

- **5 styles × 11 colours** — clean, bright, dark, modern, cozy; each with its own fonts, shadows and shapes; any hex colour.
- **Blocks:** 3 hero variants, text + photo, features, cards, products, pricing plans, reviews, team, steps, numbers, FAQ, gallery, call to action with countdown, contacts, social links, forms.
- **Photos by keyword:** `<img data-photo="pizza">` — 68 topics, 270 free Unsplash photos, English and Russian keywords.
- **Behaviour by attributes:** `data-open`, `data-add`, `data-count`, `data-timer`, `data-theme-toggle`… — the order dialog and the cart create themselves.
- **Icons, sliders, maps, avatars:** `data-icon="mdi:pizza"` (200,000+ Iconify icons), `.bui-slider` (Swiper), `data-map="address"` (Leaflet + OpenStreetMap, no API key), `data-avatar="Anna"` (DiceBear). Libraries load only when used.
- **Tailwind + daisyUI mode** for full design freedom.
- **i18n:** English and Russian interface texts (`lang`), any text overridable (`texts`).
- **TypeScript types**, ES module, safe SSR import. All styles live in a CSS cascade layer, so your CSS always wins.

## Build sites with AI

BlockUI is designed so that an LLM (ChatGPT, Claude, Qwen, GigaChat, DeepSeek…) can assemble a polished site from a short brief: [PROMPT.md](PROMPT.md) is a ready-to-use prompt template, [AI.md](AI.md) is a compact reference the model can read.

## Repository

```
blockui.js / blockui.css   the library (VERSION constant in blockui.js)
blockui.mjs / blockui.d.ts ES module entry and TypeScript types
examples/<site>/           examples: index.html, style.css, script.js, codepen.html
AI.md                      API reference
PROMPT.md, PROMPT.ru.md    prompt templates for LLMs
tools/photos.json          Unsplash photo IDs by topic
tools/build.py             writes the photo catalogue, AI.md topic list, codepen.html files and blockui.mjs
```

Release: bump `VERSION` in `blockui.js` and `package.json`, update `@x.y.z` links, run `python tools/build.py`, commit, tag `vX.Y.Z`, `npm publish`. Published versions are never changed.

## License

MIT — see [LICENSE](LICENSE). Photos, icons, maps and add-on libraries have their own terms: [THIRD_PARTY.md](THIRD_PARTY.md).
