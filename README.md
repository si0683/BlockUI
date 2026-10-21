# 💡 LightWebsiteUi

**Building blocks for beautiful websites.** Two lines of HTML and your page has a style and colour scheme, photos by keyword, a mobile menu, dark theme, cart, order dialog, form validation, toasts, confetti, counters, countdown, sliders, maps, icons and avatars — all driven by plain HTML classes and attributes. No build step, no framework lock-in.

Prefer utility CSS? The **Tailwind + daisyUI mode** keeps all LightWebsiteUi behaviour while you design with Tailwind classes.

[Website & live demos](https://si0683.github.io/LightWebsiteUi/) · [API reference](AI.md) · [AI prompt template](PROMPT.md) · [Русский](README.ru.md)

> **Formerly BlockUI.** Version 3.0.0 renamed the global `BlockUI` → `LightWebsiteUi` and the files `blockui.*` → `lightwebsiteui.*`; HTML classes (`bui-*`) and attributes are unchanged. Old versions stay on the CDN — see [CHANGELOG](CHANGELOG.md).

| | | | |
|---|---|---|---|
| [Bean & Brew](https://si0683.github.io/LightWebsiteUi/examples/coffee/) — coffee shop | [RoboCode](https://si0683.github.io/LightWebsiteUi/examples/robots/) — school | [Paws](https://si0683.github.io/LightWebsiteUi/examples/pets/) — shelter | [Lotus](https://si0683.github.io/LightWebsiteUi/examples/yoga/) — Tailwind + daisyUI |

## Install

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@3.2.0/lightwebsiteui.css">
<script src="https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@3.2.0/lightwebsiteui.js"></script>
```

or

```bash
npm install lightwebsiteui
```
```js
import LightWebsiteUi from 'lightwebsiteui';
import 'lightwebsiteui/lightwebsiteui.css';
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
<script>LightWebsiteUi.start({ name: 'Margherita', style: 'cozy', color: 'red', rain: '🍕' });</script>
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

## Next.js and React

Imported from npm, LightWebsiteUi waits for `start()`, so React hydrates the page untouched. Write the blocks as JSX (`class` → `className`, `data-name` → `data-name=""`) and add one client component to the root layout:

```jsx
'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import LightWebsiteUi from 'lightwebsiteui';

export default function LightWebsite({ options }) {
  const pathname = usePathname();
  useEffect(() => {
    LightWebsiteUi.start(options);           // once React has rendered the page
    return () => LightWebsiteUi.destroy();    // undo everything on unmount
  }, []);
  useEffect(() => { LightWebsiteUi.refresh(); }, [pathname]); // new page → enhance its blocks
  return null;
}
```

- `refresh()` enhances only blocks it has not seen yet; sliders, maps and timers of pages you left are switched off.
- `destroy()` removes everything LightWebsiteUi added (listeners, buttons, dialogs, sliders, maps); `start()` brings it back.
- Keep the contents of a `.bui-slider` static: Swiper moves those nodes.
- Full App Router example: [examples/nextjs](examples/nextjs) (home, menu with cart, contacts with map and form).

## Astro

Astro renders plain HTML, so the blocks are written exactly as in a 3-file site. Import the CSS in your layout's frontmatter and start the library in a `<script>`:

```astro
---
import 'lightwebsiteui/lightwebsiteui.css';
---
<script>
  import LightWebsiteUi from 'lightwebsiteui';
  LightWebsiteUi.start({ name: 'Margherita', style: 'cozy', color: 'red' });
  // Only needed with <ClientRouter />: the next page replaces <body> without a reload
  document.addEventListener('astro:after-swap', () => LightWebsiteUi.refresh());
</script>
```

With `<ClientRouter />` the cart, the chosen theme and the order dialog carry over between pages. Full example: [examples/astro](examples/astro).

## Build sites with AI

LightWebsiteUi is designed so that an LLM (ChatGPT, Claude, Qwen, GigaChat, DeepSeek…) can assemble a polished site from a short brief: [PROMPT.md](PROMPT.md) is a ready-to-use prompt template, [AI.md](AI.md) is a compact reference the model can read.

## Repository

```
lightwebsiteui.js / lightwebsiteui.css   the library (VERSION constant in lightwebsiteui.js)
lightwebsiteui.mjs / lightwebsiteui.d.ts ES module entry (manual start) and TypeScript types
examples/<site>/           examples: index.html, style.css, script.js, codepen.html
examples/nextjs/           the same blocks inside a Next.js App Router project
examples/astro/            the same blocks in an Astro site (static pages, optional ClientRouter)
AI.md                      API reference
PROMPT.md, PROMPT.ru.md    prompt templates for LLMs
tools/photos.json          Unsplash photo IDs by topic
tools/build.py             writes the photo catalogue, AI.md topic list, codepen.html files and lightwebsiteui.mjs
```

Release: bump `VERSION` in `lightwebsiteui.js` and `package.json`, update `@x.y.z` links, run `python tools/build.py`, commit, tag `vX.Y.Z`, `npm publish`. Published versions are never changed.

## License

MIT — see [LICENSE](LICENSE). Photos, icons, maps and add-on libraries have their own terms: [THIRD_PARTY.md](THIRD_PARTY.md).
