# LightWebsiteUi + Astro

The pizzeria from the LightWebsiteUi examples as an **Astro** site: three static pages (home, menu, contacts), a shared layout, a cart, a review slider, a map and a contact form. Blocks are plain HTML — the same classes and attributes as in a 3-file site.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:4321. `npm run build` writes static files to `dist/` — upload them to any hosting (GitHub Pages, Netlify, your server).

The library is installed from the GitHub tag (`github:si0683/LightWebsiteUi#v3.2.0`). Once it is on npm, use `"lightwebsiteui": "^3.2.0"`.

## How it works

| File | Role |
|---|---|
| `src/layouts/Layout.astro` | Imports `lightwebsiteui/lightwebsiteui.css`, renders the header and footer, starts LightWebsiteUi in a `<script>` |
| `src/pages/*.astro` | Plain LightWebsiteUi blocks; lists come from small arrays in the frontmatter |

The whole integration is this script in the layout:

```astro
<script>
  import LightWebsiteUi from 'lightwebsiteui';
  LightWebsiteUi.start({ name: 'Margherita', style: 'cozy', color: 'red', rain: '🍕' });
  document.addEventListener('astro:after-swap', () => LightWebsiteUi.refresh());
</script>
```

- **Classic page loads** (no `<ClientRouter />`): every page starts LightWebsiteUi from scratch, like a plain site.
- **Smooth transitions** (`<ClientRouter />`, enabled in this example): Astro replaces `<body>` without a reload; `refresh()` enhances the new page. The cart, the chosen dark/light theme and the order dialog carry over.
- Astro's `<Image />` is not needed for `data-photo`: LightWebsiteUi sets the Unsplash URL itself.
- Interactive islands (React, Vue, Svelte) work next to the blocks; call `LightWebsiteUi.refresh()` after an island renders new blocks.
