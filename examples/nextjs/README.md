# LightWebsiteUi + Next.js

The pizzeria from the LightWebsiteUi examples, built with the **Next.js App Router**: three pages (home, menu, contacts), a header that stays while pages change, a cart that survives navigation, a review slider, a map and a contact form.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. `npm run build && npm start` runs the production build.

The library is installed from the GitHub tag (`github:si0683/LightWebsiteUi#v3.2.0`). Once it is on npm, use `"lightwebsiteui": "^3.2.0"`.

## How it works

| File | Role |
|---|---|
| `app/layout.jsx` | Imports `lightwebsiteui/lightwebsiteui.css`, renders the header and footer, puts `<LightWebsite options={CONFIG} />` once |
| `app/LightWebsite.jsx` | Client component: `start()` after the first render, `destroy()` on unmount, `refresh()` on every route change |
| `app/page.jsx`, `app/menu/page.jsx`, `app/contacts/page.jsx` | Plain LightWebsiteUi blocks written as JSX |

Rules:

- Write blocks as JSX: `class` → `className`, attributes without a value get an empty string: `data-name=""`, `data-year=""`.
- Imported from npm, LightWebsiteUi does nothing until `start()` — the server-rendered HTML hydrates without warnings.
- `refresh()` enhances only new blocks; you can also call it after you render new content yourself (a fetched list, a tab).
- Keep the contents of `.bui-slider` static: Swiper moves those nodes, so don't re-render them with React state.
- The order dialog, cart button, theme toggle and mobile menu are added by LightWebsiteUi — don't render them yourself.
