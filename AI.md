# LightWebsiteUi 2.0 — API reference (for developers and LLMs)

LightWebsiteUi builds one-page websites from ready-made blocks. A site is **3 files — HTML, CSS, JS** (plain JavaScript, no build step). LightWebsiteUi already provides: 5 styles × 11 colours, photos by keyword, mobile menu, dark theme, cart, order dialog, form validation, toasts, confetti, counters, countdown, gallery lightbox, scroll reveal, icons, sliders, maps and avatars. **Do not re-implement these** — compose the page from classes and attributes.

Two modes:
- **LightWebsiteUi blocks** (default) — `bui-…` classes; style and colour in one line.
- **Tailwind + daisyUI** — any design with Tailwind classes and daisyUI components; behaviour (dialogs, forms, photos, counters…) still comes from LightWebsiteUi.

## 1. Install

**CDN (CodePen, plain HTML)** — first lines of the page / HTML panel:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@3.1.0/lightwebsiteui.css">
<script src="https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@3.1.0/lightwebsiteui.js"></script>
```
Tailwind + daisyUI mode — add these three lines before them:
```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.3.3"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/daisyui@5.7.47">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/daisyui@5.7.47/themes.css">
```

**npm:** `npm install lightwebsiteui`, then `import LightWebsiteUi from 'lightwebsiteui'; import 'lightwebsiteui/lightwebsiteui.css';` (TypeScript types included; SSR import is safe). Imported this way nothing runs until you call `LightWebsiteUi.start(CONFIG)`.

**Next.js / React:** blocks are written as JSX (`className`, `data-name=""`). One client component in the root layout calls `LightWebsiteUi.start(CONFIG)` in `useEffect` (cleanup: `LightWebsiteUi.destroy()`) and `LightWebsiteUi.refresh()` in a second `useEffect` that depends on `usePathname()`. `refresh()` enhances only new blocks; keep `.bui-slider` contents static. Example: https://github.com/si0683/LightWebsiteUi/tree/main/examples/nextjs

## 2. JS: site settings

```js
const CONFIG = {
  name: 'Margherita',      // written into every element with data-name
  style: 'cozy',           // clean, bright, dark, modern, cozy (Russian names work too)
  color: 'red',            // red, orange, yellow, green, teal, sky, blue, purple, pink, black, brown or '#ff6600'
  lang: 'en',              // 'en' | 'ru' — interface texts (default: <html lang> or the browser)
  rain: '',                // emoji rain in the hero, e.g. '🍕'
  dark: false,             // start in dark theme
  thanks: 'Thank you! We will call you back 😊' // message after a form is sent
};
LightWebsiteUi.start(CONFIG);
```
More options: `orderTitle`, `orderText` (order dialog), `emptyCart`, `currency`, `themeButton: false` (no theme toggle), `avatarStyle: 'lorelei'` (notionists, thumbs, adventurer, fun-emoji, bottts…), `texts: { send: 'Order now', popular: '★ Best value' }` (override any interface text).
Tailwind mode: `tailwind: true`, `theme: 'cupcake'` (daisyUI themes: light, dark, cupcake, retro, emerald, valentine, synthwave, cyberpunk, corporate, forest, aqua, pastel, fantasy, luxury, dracula, autumn, coffee, winter, nord, sunset…), `darkTheme: 'night'`.

## 3. CSS

Usually almost empty — LightWebsiteUi does the styling. Your rules always win (LightWebsiteUi lives in `@layer bui`). Corner radius: `body { --bui-radius: 30px !important; }`.

## 4. Photos by keyword — `data-photo`

```html
<img data-photo="pizza">            <!-- first photo of the topic -->
<img data-photo="pizza">            <!-- next photo of the same topic (no repeats) -->
<img data-photo="coffee 3">         <!-- third photo of the topic -->
<section class="bui-hero bui-hero-photo" data-photo="mountains">  <!-- background photo -->
```
Keywords work in English or Russian, in any form ("pizzeria", "dance school", "toy store", «кофейня»). Topics (4 photos each):

<!-- TOPICS:START -->
pizza · coffee, cafe · cakes, desserts · bakery, bread · burgers · sushi · ice cream · fruit, vegetables · food, restaurant · candy · flowers · dogs · cats · horses · pets, pet shop · zoo, animals · fish, aquarium · birds · books, library · school, courses · kids · toys · building bricks · art, painting · music, concert · guitar · piano · dance · football · basketball · swimming, pool · fitness, sport · yoga · chess · bikes · skateboard, scooter · hockey, skates · video games · programming, computers · robots · space · science, lab · phones, gadgets · travel, beach · mountains · camping, hiking · sea · forest, nature · winter, snow · city · cars · trains · planes · clothes, fashion · shoes, sneakers · beauty salon · barbershop · hotel · party, birthday · New Year, Christmas · doctor, clinic · vet · farm · garden · cooking · cinema · photography · dinosaurs
<!-- TOPICS:END -->

Unknown topic → a nice random photo. Your own picture: a normal `src`.

## 5. Blocks (LightWebsiteUi mode)

Page skeleton:
```html
<header class="bui-header">
  <div class="bui-container">
    <a class="bui-logo" href="#top"><span>🍕</span><span data-name>Margherita</span></a>
    <nav class="bui-nav"><a href="#about">About</a><a href="#menu">Menu</a><a href="#contacts">Contacts</a></nav>
  </div>
</header>
<!-- LightWebsiteUi adds the theme toggle, the cart and the mobile burger to the header -->

<section class="bui-hero" id="top">
  <div class="bui-container">
    <div>
      <span class="bui-badge">🔥 Special offer</span>
      <h1 data-name>Margherita</h1>
      <p>Short slogan.</p>
      <div class="bui-row"><button class="bui-btn" data-open="order">Order</button><a class="bui-btn bui-btn-ghost" href="#menu">Menu</a></div>
      <ul class="bui-facts"><li><b>4.9 ⭐</b><span>rating</span></li></ul>
    </div>
    <div class="bui-hero-picture"><img data-photo="pizza"><span class="bui-sticker">−20%</span></div>
  </div>
</section>

<section class="bui-section" id="about">            <!-- bui-section-alt: tinted background -->
  <div class="bui-container">
    <div class="bui-head"><span class="bui-label">About</span><h2>Title</h2><p>Subtitle</p></div>
    <div class="bui-grid"> … cards … </div>        <!-- bui-grid-2 / bui-grid-4: wider / narrower cards -->
  </div>
</section>
<footer class="bui-footer">© <span data-year></span> <span data-name>Margherita</span></footer>
```

| Block | Markup |
|---|---|
| Hero | `bui-hero` (text + photo), `bui-hero bui-hero-center` (centered), `bui-hero bui-hero-photo` + `data-photo` (background photo) |
| Text + photo | `<div class="bui-container bui-split"><img data-photo="…"><div>…</div></div>` |
| Feature | `<div class="bui-feature"><div class="bui-icon" data-icon="mdi:truck-fast"></div><h3>…</h3><p>…</p></div>` |
| Card | `<div class="bui-card"><h3>…</h3><p>…</p></div>` |
| Product | `<div class="bui-product"><div class="bui-product-image"><img data-photo="…"><span class="bui-tag">Hit</span></div><div class="bui-product-body"><h3>…</h3><p>…</p><div class="bui-product-footer"><span class="bui-price">$9</span><button class="bui-btn bui-btn-small" data-add="Margherita" data-price="9">Add to cart</button></div></div></div>` |
| Pricing plan | `<div class="bui-plan bui-popular"><h3>…</h3><div class="bui-price">$29</div><ul class="bui-checks"><li>…</li></ul><button class="bui-btn" data-open="order" data-pick="Pro">Choose</button></div>` |
| Review | `<div class="bui-review"><div class="bui-stars">★★★★★</div><blockquote>…</blockquote><div class="bui-author"><img data-avatar="Anna"><span>Anna<small>guest</small></span></div></div>` (several reviews: wrap in `bui-slider`) |
| Person | `<div class="bui-person"><img data-avatar="Noah"><h3>Name</h3><p>Role</p></div>` |
| Steps | `<div class="bui-grid bui-steps"><div class="bui-step"><h3>…</h3><p>…</p></div>…</div>` (numbers added automatically) |
| Number | `<div class="bui-stat"><b data-count="1200" data-suffix="+">0</b><span>customers</span></div>` (counts up on scroll) |
| Checklist | `<ul class="bui-checks"><li>…</li></ul>` |
| FAQ | `<details class="bui-faq"><summary>Question?</summary><p>Answer.</p></details>` |
| Gallery | `<div class="bui-gallery"><img data-photo="…">…</div>` (click opens a lightbox) |
| Slider | `<div class="bui-slider" data-per-view="3"> any cards </div>` |
| Call to action | `<div class="bui-cta"><h2>…</h2><div data-timer="2026-12-31T23:59"></div><p>…</p><button class="bui-btn bui-btn-light bui-btn-big" data-open="order">…</button></div>` |
| Contacts | `<div class="bui-contacts"><a class="bui-contact" href="tel:+15550123456"><span>📞</span><span><small>Phone</small><b>+1 (555) 012-3456</b></span></a>…</div>` |
| Map | `<div data-map="Covent Garden, London" data-label="We are here"></div>` |
| Social links | `<div class="bui-socials"><a class="bui-social bui-tg" href="…" data-tip="Telegram">TG</a><a class="bui-social bui-yt" href="…" data-tip="YouTube">YT</a></div>` (also `bui-vk`, `bui-max`, or plain `bui-social` with an icon) |
| Form | `<form class="bui-form" data-thanks="Thanks!"><div class="bui-field"><input name="name" required><label>Name</label></div><div class="bui-field"><input name="phone" type="tel" required><label>Phone</label></div><button class="bui-btn bui-btn-wide">Send</button></form>` |

Buttons: `bui-btn` + `bui-btn-ghost` / `bui-btn-light` / `bui-btn-small` / `bui-btn-big` / `bui-btn-wide`. Badges: `bui-badge`, `bui-tag`, `bui-sticker`, `bui-label`. Text: `bui-muted`, `bui-center`.

## 6. Behaviour — attributes (both modes)

| Attribute | Effect |
|---|---|
| `data-open="order"` | opens the dialog with that id. The `order` dialog (name, phone, item list) is **created automatically** if the page has none |
| `data-pick="Margherita"` | with `data-open` — preselects that item in the dialog |
| `data-add="Margherita" data-price="9"` | adds to the cart; a cart button with a counter appears in the header |
| `data-cart-count`, `data-cart-total` | show the item count and the total |
| `data-close` | closes the dialog (also: click on the backdrop, Esc) |
| `data-name` | receives the `name` option |
| `data-photo="topic"` | photo by keyword |
| `data-icon="mdi:pizza"` | [Iconify](https://icon-sets.iconify.design) icon — 200,000+ icons (mdi, lucide, ph, tabler, fa6-solid…); inside `bui-icon` it takes the main colour |
| `data-avatar="Anna"` | DiceBear avatar from a name (same name → same face); `data-avatar-style="bottts"` — another style |
| `data-map="address"` or `"51.5034, -0.1276"` | OpenStreetMap map with a marker; `data-label` — popup text, `data-zoom` — zoom |
| `class="bui-slider" data-per-view="3"` | Swiper slider from any cards; `data-autoplay="0"` — no autoplay |
| `data-count="500" data-suffix="+"` | counts up from 0 on scroll |
| `data-timer="2026-12-31T23:59"` | countdown to the date |
| `data-year` | current year |
| `data-theme-toggle` | dark theme toggle button |
| `data-reveal` | fades in on scroll (`bui-section` does it automatically) |
| `form.bui-form` or `form[data-form]` | validation: `required`, `type="tel"` (7+ digits), `type="email"`; then the `thanks` toast, confetti, reset. No backend — wire your own `fetch` if needed |

From JS: `LightWebsiteUi.toast('Text')`, `LightWebsiteUi.confetti()`, `LightWebsiteUi.open('order', 'Margherita')`, `LightWebsiteUi.close()`, `LightWebsiteUi.addToCart('Pizza', 9)`, `LightWebsiteUi.photo('pizza', 0)`, `LightWebsiteUi.avatar('Anna')`.

Icons, sliders and maps load their libraries automatically, only when the page uses them.

## 7. Tailwind + daisyUI mode

Write markup with Tailwind utilities and daisyUI components (`navbar`, `hero`, `hero-overlay`, `hero-content`, `btn btn-primary`, `card`, `card-body`, `badge`, `stats`, `stat`, `collapse`, `modal`, `input`, `select`…). All attributes from section 6 work. Dialog: `<dialog id="order" class="modal">` with `<form data-form>`; `data-open="order"` opens it.

```html
<section class="hero min-h-[70vh]" data-photo="yoga">
  <div class="hero-overlay bg-black/50"></div>
  <div class="hero-content text-center text-white">
    <div class="max-w-xl">
      <h1 class="text-5xl font-bold mb-5" data-name>Lotus</h1>
      <button class="btn btn-primary btn-lg" data-open="order">Book</button>
    </div>
  </div>
</section>
<dialog id="order" class="modal">
  <div class="modal-box">
    <h3 class="text-2xl font-bold mb-4">Book a class</h3>
    <form data-form class="flex flex-col gap-3">
      <input name="name" required class="input w-full" placeholder="Name">
      <input name="phone" type="tel" required class="input w-full" placeholder="Phone">
      <button class="btn btn-primary">Send</button>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop"><button>Close</button></form>
</dialog>
```
```js
LightWebsiteUi.start({ name: 'Lotus', tailwind: true, theme: 'emerald', darkTheme: 'night', thanks: "You're booked!" });
```
The theme sets the `btn-primary` colour; `color: 'blue'` overrides it.

## Examples (3 files each)

https://github.com/si0683/LightWebsiteUi/tree/main/examples — `coffee` (products, cart, review slider with avatars, icons, map), `robots` (background-photo hero, counters, steps, pricing, team, countdown, inline form), `pets` (gallery, pet cards, emoji rain, map), `yoga` (Tailwind + daisyUI), `nextjs` (the same blocks in a Next.js App Router project).

## Rules for generated code

- A typical landing page: hero, about, features, products/services, call to action, contacts (phone, email, address, social links, map).
- Keep text short; colours via `color`, pictures via `data-photo`, icons via `data-icon`. Don't write your own menus, dialogs, carts or animations — they already exist.
- Start the JS with a `CONFIG` object, then `LightWebsiteUi.start(CONFIG)`.
