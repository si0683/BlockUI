# Prompt template: any website with LightWebsiteUi

Fill in the **MY SITE** block and paste the whole prompt into any LLM (ChatGPT, Claude, Gemini, Qwen, GigaChat, DeepSeek…). You get a polished one-page site in 3 files that runs locally, on any static hosting or in CodePen. The prompt contains a compact cheat sheet, so it works even when the model cannot open links.

Русская версия — [PROMPT.ru.md](PROMPT.ru.md). Full reference — [AI.md](AI.md).

````text
You are a senior web designer. Build a complete one-page website with the LightWebsiteUi library.

MY SITE:
Business: pizzeria
Name: Margherita
Style: cozy (clean / bright / dark / modern / cozy)
Main colour: red (red, orange, yellow, green, teal, sky, blue, purple, pink, black, brown or #hex)
Main action button: Order
Audience and tone: families, warm and friendly
Must have: menu with 3 pizzas and prices, delivery info, reviews, map with the address
Interface language: English

OUTPUT — exactly 3 files, each in its own code block with the file name above it:
1) index.html — a full HTML document; at the start of <body>:
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@3.1.0/lightwebsiteui.css">
   <script src="https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@3.1.0/lightwebsiteui.js"></script>
   then the page markup, and script.js at the end of <body>;
2) style.css — usually almost empty;
3) script.js — a CONFIG object (name, style, color, lang, rain, dark, thanks) and LightWebsiteUi.start(CONFIG).
Plain HTML/CSS/JavaScript only: no TypeScript, React, Next.js, npm, import/export, no build step.

LightWebsiteUi reference (read it first): https://cdn.jsdelivr.net/gh/si0683/LightWebsiteUi@3.1.0/AI.md
Backup: https://raw.githubusercontent.com/si0683/LightWebsiteUi/main/AI.md · Examples: https://github.com/si0683/LightWebsiteUi/tree/main/examples

If you cannot open the links, use this summary:
- Skeleton: <header class="bui-header"><div class="bui-container"><a class="bui-logo" href="#top"><span>🍕</span><span data-name>Name</span></a><nav class="bui-nav"><a href="#about">About</a>…</nav></div></header>; sections: <section class="bui-section" id="…"> (bui-section-alt = tinted) with <div class="bui-container"><div class="bui-head"><span class="bui-label">…</span><h2>…</h2><p>…</p></div><div class="bui-grid">cards</div></div>; <footer class="bui-footer">© <span data-year></span> <span data-name>Name</span></footer>. LightWebsiteUi adds the theme toggle, cart and mobile burger itself.
- Hero: <section class="bui-hero" id="top"><div class="bui-container"><div><span class="bui-badge">…</span><h1 data-name>Name</h1><p>Slogan</p><div class="bui-row"><button class="bui-btn" data-open="order">Order</button><a class="bui-btn bui-btn-ghost" href="#menu">Menu</a></div><ul class="bui-facts"><li><b>4.9 ⭐</b><span>rating</span></li></ul></div><div class="bui-hero-picture"><img data-photo="pizza"><span class="bui-sticker">−20%</span></div></div></section>. Variants: bui-hero-center; bui-hero bui-hero-photo with data-photo on the section.
- Cards: feature <div class="bui-feature"><div class="bui-icon" data-icon="mdi:truck-fast"></div><h3>…</h3><p>…</p></div>; product <div class="bui-product"><div class="bui-product-image"><img data-photo="pizza"><span class="bui-tag">Hit</span></div><div class="bui-product-body"><h3>…</h3><p>…</p><div class="bui-product-footer"><span class="bui-price">$9</span><button class="bui-btn bui-btn-small" data-add="Margherita" data-price="9">Add to cart</button></div></div></div>; plan bui-plan (bui-popular) with bui-price and bui-checks; review <div class="bui-review"><div class="bui-stars">★★★★★</div><blockquote>…</blockquote><div class="bui-author"><img data-avatar="Anna"><span>Anna<small>guest</small></span></div></div>; person <div class="bui-person"><img data-avatar="Noah"><h3>…</h3><p>…</p></div>; steps bui-steps + bui-step; number <div class="bui-stat"><b data-count="500" data-suffix="+">0</b><span>…</span></div>; FAQ <details class="bui-faq"><summary>…</summary><p>…</p></details>; gallery bui-gallery; call to action <div class="bui-cta"><h2>…</h2><p>…</p><button class="bui-btn bui-btn-light bui-btn-big" data-open="order">…</button></div>; split text+photo bui-split.
- Contacts: <div class="bui-contacts"><a class="bui-contact" href="tel:+15550123456"><span>📞</span><span><small>Phone</small><b>…</b></span></a>…</div>; socials <div class="bui-socials"><a class="bui-social bui-tg" href="…" data-tip="Telegram">TG</a></div>; map <div data-map="street, city" data-label="We are here"></div>.
- Slider: wrap several reviews or cards in <div class="bui-slider" data-per-view="3">.
- Attributes: data-photo="topic" (photo by English or Russian keyword: pizza, coffee, cake, toys, dance, football, robot, space, dog, flowers, clothes, sea…; "pizza 2" = second photo), data-icon="mdi:…" (Iconify icons), data-avatar="name", data-open="order" (order dialog, created automatically), data-pick="item", data-add="item" data-price="9" (cart), data-count, data-timer="2026-12-31T23:59", data-name, data-year.
- Forms: <form class="bui-form" data-thanks="Thanks!"><div class="bui-field"><input name="phone" type="tel" required><label>Phone</label></div>…<button class="bui-btn bui-btn-wide">Send</button></form> — validation and the thank-you toast are automatic.
- Buttons: bui-btn + bui-btn-ghost / bui-btn-light / bui-btn-small / bui-btn-big / bui-btn-wide.

QUALITY BAR:
- Looks like a professional landing page: clear hero, short punchy copy, consistent icons and photos, strong call to action.
- Sections: hero, about, features, products/services, reviews, call to action, contacts with map. Add pricing, FAQ, team, numbers or gallery when they fit the business.
- Works on phones; no console errors; use only the classes and attributes above — no custom JS for menus, dialogs, carts or animations.

ANSWER FORMAT: two or three lines about the site, then the 3 files, then a short list of CONFIG values worth tweaking.
````

## Tips

- **CodePen:** put everything between `<body>` and `<script src="script.js">` into the HTML panel, `style.css` into CSS, `script.js` into JS.
- **Custom design:** ask for "Tailwind + daisyUI mode" — see section 7 of AI.md.
- **Iterating:** "change CONFIG.style to dark", "add a pricing section with 3 plans".
- **Pin the version** (`@3.1.0`) in production; new versions never break old links.
