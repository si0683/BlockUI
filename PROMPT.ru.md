# Шаблон промта: любой сайт на BlockUI

Заполните блок **МОЙ САЙТ** и вставьте весь промт в любую нейросеть (ChatGPT, Claude, Gemini, Qwen, GigaChat, DeepSeek…). Получите аккуратный одностраничный сайт из 3 файлов, который работает локально, на любом хостинге или в CodePen. Внутри промта — краткая шпаргалка, поэтому он работает, даже если нейросеть не открывает ссылки.

English version — [PROMPT.md](PROMPT.md). Полный справочник — [AI.md](AI.md).

````text
Ты — опытный веб-дизайнер. Сделай готовый одностраничный сайт на библиотеке BlockUI.

МОЙ САЙТ:
Бизнес: пиццерия
Название: Маргарита
Стиль: уютный (простой / яркий / тёмный / современный / уютный)
Главный цвет: красный (красный, оранжевый, жёлтый, зелёный, бирюзовый, голубой, синий, фиолетовый, розовый, чёрный, коричневый или #hex)
Главная кнопка: Заказать
Аудитория и тон: семьи, тепло и дружелюбно
Обязательно: меню из 3 пицц с ценами, условия доставки, отзывы, карта с адресом
Язык интерфейса: русский (lang: 'ru')

РЕЗУЛЬТАТ — ровно 3 файла, каждый в своём блоке кода с именем файла над ним:
1) index.html — полный HTML-документ; в начале <body>:
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/si0683/BlockUI@2.0.0/blockui.css">
   <script src="https://cdn.jsdelivr.net/gh/si0683/BlockUI@2.0.0/blockui.js"></script>
   дальше разметка страницы, в конце <body> — script.js;
2) style.css — обычно почти пустой;
3) script.js — объект CONFIG (name, style, color, lang, rain, dark, thanks) и BlockUI.start(CONFIG).
Только HTML, CSS и чистый JavaScript: без TypeScript, React, Next.js, npm, import/export и сборки.

Справочник BlockUI (прочитай сначала): https://cdn.jsdelivr.net/gh/si0683/BlockUI@2.0.0/AI.md
Запасная ссылка: https://raw.githubusercontent.com/si0683/BlockUI/main/AI.md · Примеры: https://github.com/si0683/BlockUI/tree/main/examples

Если ссылки не открываются, вот главное:
- Каркас: <header class="bui-header"><div class="bui-container"><a class="bui-logo" href="#top"><span>🍕</span><span data-name>Название</span></a><nav class="bui-nav"><a href="#about">О нас</a>…</nav></div></header>; разделы: <section class="bui-section" id="…"> (bui-section-alt — с цветным фоном) с <div class="bui-container"><div class="bui-head"><span class="bui-label">…</span><h2>…</h2><p>…</p></div><div class="bui-grid">карточки</div></div>; <footer class="bui-footer">© <span data-year></span> <span data-name>Название</span></footer>. Кнопку темы, корзину и бургер BlockUI добавит сам.
- Главный экран: <section class="bui-hero" id="top"><div class="bui-container"><div><span class="bui-badge">…</span><h1 data-name>Название</h1><p>Слоган</p><div class="bui-row"><button class="bui-btn" data-open="order">Заказать</button><a class="bui-btn bui-btn-ghost" href="#menu">Меню</a></div><ul class="bui-facts"><li><b>4.9 ⭐</b><span>рейтинг</span></li></ul></div><div class="bui-hero-picture"><img data-photo="пицца"><span class="bui-sticker">−20%</span></div></div></section>. Варианты: bui-hero-center; bui-hero bui-hero-photo с data-photo на секции.
- Карточки: преимущество <div class="bui-feature"><div class="bui-icon" data-icon="mdi:truck-fast"></div><h3>…</h3><p>…</p></div>; товар <div class="bui-product"><div class="bui-product-image"><img data-photo="пицца"><span class="bui-tag">Хит</span></div><div class="bui-product-body"><h3>…</h3><p>…</p><div class="bui-product-footer"><span class="bui-price">490 ₽</span><button class="bui-btn bui-btn-small" data-add="Маргарита" data-price="490">В корзину</button></div></div></div>; тариф bui-plan (bui-popular) с bui-price и bui-checks; отзыв <div class="bui-review"><div class="bui-stars">★★★★★</div><blockquote>…</blockquote><div class="bui-author"><img data-avatar="Анна"><span>Анна<small>гость</small></span></div></div>; человек <div class="bui-person"><img data-avatar="Иван"><h3>…</h3><p>…</p></div>; шаги bui-steps + bui-step; цифра <div class="bui-stat"><b data-count="500" data-suffix="+">0</b><span>…</span></div>; вопрос <details class="bui-faq"><summary>…</summary><p>…</p></details>; галерея bui-gallery; блок действия <div class="bui-cta"><h2>…</h2><p>…</p><button class="bui-btn bui-btn-light bui-btn-big" data-open="order">…</button></div>; текст + фото bui-split.
- Контакты: <div class="bui-contacts"><a class="bui-contact" href="tel:+79001234567"><span>📞</span><span><small>Телефон</small><b>…</b></span></a>…</div>; соцсети <div class="bui-socials"><a class="bui-social bui-vk" href="…" data-tip="ВКонтакте">VK</a><a class="bui-social bui-max" href="…" data-tip="MAX">MAX</a></div>; карта <div data-map="Москва, Тверская улица, 1" data-label="Мы здесь"></div>.
- Слайдер: оберни несколько отзывов или карточек в <div class="bui-slider" data-per-view="3">.
- Атрибуты: data-photo="тема" (фото по слову на русском или английском: пицца, кофе, торт, игрушки, танцы, футбол, роботы, космос, собаки, цветы, одежда, море…; «пицца 2» — второе фото), data-icon="mdi:…" (иконки Iconify), data-avatar="имя", data-open="order" (окно заказа создаётся само), data-pick="товар", data-add="товар" data-price="490" (корзина), data-count, data-timer="2026-12-31T23:59", data-name, data-year.
- Формы: <form class="bui-form" data-thanks="Спасибо!"><div class="bui-field"><input name="phone" type="tel" required><label>Телефон</label></div>…<button class="bui-btn bui-btn-wide">Отправить</button></form> — проверка и благодарность сами.
- Кнопки: bui-btn + bui-btn-ghost / bui-btn-light / bui-btn-small / bui-btn-big / bui-btn-wide.

ТРЕБОВАНИЯ К КАЧЕСТВУ:
- Выглядит как профессиональный лендинг: понятный главный экран, короткие ёмкие тексты, единые иконки и фото, сильный призыв к действию.
- Разделы: главный экран, о нас, преимущества, товары/услуги, отзывы, блок действия, контакты с картой. Тарифы, вопросы, команду, цифры или галерею — если подходят бизнесу.
- Работает на телефоне; без ошибок в консоли; только классы и атрибуты выше — без своего JS для меню, окон, корзины и анимаций.

ФОРМАТ ОТВЕТА: две-три строки о сайте, затем 3 файла, затем короткий список настроек CONFIG, которые стоит покрутить.
````

## Советы

- **CodePen:** в окно HTML — всё между `<body>` и `<script src="script.js">`, в CSS — style.css, в JS — script.js.
- **Свой дизайн:** попросите «режим Tailwind + daisyUI» — раздел 7 в AI.md.
- **Доработки:** «поменяй CONFIG.style на тёмный», «добавь раздел с тремя тарифами».
- **Фиксируйте версию** (`@2.0.0`) в рабочих проектах: новые версии не ломают старые ссылки.
