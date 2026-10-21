# BlockUI 1.1.0 — справочник для нейросетей

Ты делаешь одностраничный сайт на BlockUI. Результат — ровно 3 файла: HTML, CSS, JS (чистый JavaScript, без TypeScript, React, Next.js, npm, import/export). BlockUI сам делает: стиль и цвет сайта, фото по теме, меню для телефона, тёмную тему, корзину, окно заказа, проверку форм, сообщения, салют, счётчики, таймер акции, галерею, плавное появление блоков. **Не пиши это сам** — собирай сайт из готовых классов и атрибутов.

Два режима:
- **Блоки BlockUI** (по умолчанию) — классы `bui-…`, 5 стилей и 11 цветов одной строкой.
- **Tailwind + daisyUI** — любой дизайн классами Tailwind и компонентами daisyUI; поведение (окна, формы, фото, счётчики) — всё равно BlockUI.

## 1. HTML: подключение (для CodePen — первые строки окна HTML)

Режим блоков:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/si0683/BlockUI@1.1.0/blockui.css">
<script src="https://cdn.jsdelivr.net/gh/si0683/BlockUI@1.1.0/blockui.js"></script>
```
Режим Tailwind + daisyUI (добавь ещё три строки перед ними):
```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.3.3"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/daisyui@5.7.47">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/daisyui@5.7.47/themes.css">
```

## 2. JS: настройки сайта

```js
// ===== 0. ЛАБОРАТОРИЯ САЙТА 🧪 =====
const LAB = {
  name: 'Маргарита',       // название: подставится во все элементы с data-name
  style: 'уютный',         // простой / яркий / тёмный / современный / уютный
  color: 'красный',        // красный, оранжевый, жёлтый, зелёный, бирюзовый, голубой, синий, фиолетовый, розовый, чёрный, коричневый или '#ff6600'
  rain: '',                // эмодзи-дождь на главном экране, например '🍕'
  dark: false,             // true — сразу тёмная тема
  thanks: 'Спасибо! Мы скоро свяжемся с вами 😊' // сообщение после отправки формы
};
BlockUI.start(LAB);
```
Ещё настройки: `orderTitle`, `orderText` (окно заказа), `emptyCart`, `currency: '₽'`, `themeButton: false` (без кнопки темы), `avatarStyle: 'lorelei'` (стиль аватаров: lorelei, notionists, thumbs, adventurer, fun-emoji, bottts…).
Режим Tailwind: `tailwind: true`, `theme: 'cupcake'` (темы daisyUI: light, dark, cupcake, retro, emerald, valentine, synthwave, cyberpunk, corporate, forest, aqua, pastel, fantasy, luxury, dracula, autumn, coffee, winter, nord, sunset…), `darkTheme: 'night'`.

## 3. CSS

Обычно почти пустой: всё оформление в BlockUI. Свои правила всегда сильнее BlockUI (его стили лежат в слое `@layer bui`). Скругление: `body { --bui-radius: 30px !important; }`.

## 4. Фото по теме — `data-photo`

```html
<img data-photo="пицца">            <!-- первое фото темы -->
<img data-photo="пицца">            <!-- следующее фото той же темы (не повторяется) -->
<img data-photo="кофе 3">           <!-- третье фото темы -->
<section class="bui-hero bui-hero-photo" data-photo="горы">  <!-- фото на фоне -->
```
Слово пишется по-русски или по-английски в любой форме («пиццерия», «школа танцев», «магазин игрушек»). Темы (по 4 фото):

<!-- TOPICS:START -->
пицца · кофе, кафе · торты, десерты · пекарня, хлеб · бургеры · суши · мороженое · фрукты, овощи · еда, ресторан · конфеты · цветы · собаки · кошки · лошади · питомцы, зоомагазин · зоопарк, животные · рыбы, аквариум · птицы · книги, библиотека · школа, курсы · дети · игрушки · конструктор · рисование, искусство · музыка, концерт · гитара · пианино · танцы · футбол · баскетбол · плавание, бассейн · фитнес, спорт · йога · шахматы · велосипеды · скейт, самокат · хоккей, коньки · видеоигры · программирование · роботы · космос · наука · телефоны, гаджеты · путешествия, пляж · горы · поход, кемпинг · море · лес, природа · зима, снег · город · машины · поезда · самолёты · одежда, мода · обувь, кроссовки · салон красоты · барбершоп · отель · праздник, день рождения · Новый год · врач, клиника · ветеринар · ферма · сад, огород · кулинария · кино · фотография · динозавры
<!-- TOPICS:END -->

Темы нет в списке — подставится красивое случайное фото. Свою картинку можно дать обычным `src`.

## 5. Блоки (режим BlockUI)

Каркас страницы:
```html
<header class="bui-header">
  <div class="bui-container">
    <a class="bui-logo" href="#top"><span>🍕</span><span data-name>Маргарита</span></a>
    <nav class="bui-nav"><a href="#about">О нас</a><a href="#menu">Меню</a><a href="#contacts">Контакты</a></nav>
  </div>
</header>
<!-- кнопки темы, корзины и бургер для телефона BlockUI добавит в шапку сам -->

<section class="bui-hero" id="top">
  <div class="bui-container">
    <div>
      <span class="bui-badge">🔥 Акция</span>
      <h1 data-name>Маргарита</h1>
      <p>Короткий слоган.</p>
      <div class="bui-row"><button class="bui-btn" data-open="order">Заказать</button><a class="bui-btn bui-btn-ghost" href="#menu">Меню</a></div>
      <ul class="bui-facts"><li><b>4.9 ⭐</b><span>рейтинг</span></li></ul>
    </div>
    <div class="bui-hero-picture"><img data-photo="пицца"><span class="bui-sticker">−20%</span></div>
  </div>
</section>

<section class="bui-section" id="about">            <!-- bui-section-alt — с цветным фоном -->
  <div class="bui-container">
    <div class="bui-head"><span class="bui-label">О нас</span><h2>Заголовок</h2><p>Подзаголовок</p></div>
    <div class="bui-grid"> … карточки … </div>        <!-- bui-grid-2 / bui-grid-4 — шире/уже -->
  </div>
</section>
<footer class="bui-footer">© <span data-year></span> «<span data-name>Маргарита</span>»</footer>
```

| Блок | Разметка |
|---|---|
| Главный экран | `bui-hero` (текст + фото), `bui-hero bui-hero-center` (по центру), `bui-hero bui-hero-photo` + `data-photo` (фото на фоне) |
| Текст + фото | `<div class="bui-container bui-split"><img data-photo="…"><div>…</div></div>` |
| Преимущество | `<div class="bui-feature"><div class="bui-icon">🔥</div><h3>…</h3><p>…</p></div>` |
| Карточка | `<div class="bui-card"><h3>…</h3><p>…</p></div>` |
| Товар | `<div class="bui-product"><div class="bui-product-image"><img data-photo="…"><span class="bui-tag">Хит</span></div><div class="bui-product-body"><h3>…</h3><p>…</p><div class="bui-product-footer"><span class="bui-price">490 ₽</span><button class="bui-btn bui-btn-small" data-add="Маргарита" data-price="490">В корзину</button></div></div></div>` |
| Тариф | `<div class="bui-plan bui-popular"><h3>…</h3><div class="bui-price">990 ₽</div><ul class="bui-checks"><li>…</li></ul><button class="bui-btn" data-open="order" data-pick="Тариф">Выбрать</button></div>` |
| Отзыв | `<div class="bui-review"><div class="bui-stars">★★★★★</div><blockquote>…</blockquote><div class="bui-author"><img data-avatar="Анна"><span>Анна<small>гость</small></span></div></div>` (несколько отзывов — в `bui-slider`) |
| Человек | `<div class="bui-person"><img data-photo="…"><h3>Имя</h3><p>Роль</p></div>` |
| Шаги | `<div class="bui-grid bui-steps"><div class="bui-step"><h3>…</h3><p>…</p></div>…</div>` (номера ставятся сами) |
| Цифра | `<div class="bui-stat"><b data-count="1200" data-suffix="+">0</b><span>учеников</span></div>` (досчитывает при прокрутке) |
| Список с галочками | `<ul class="bui-checks"><li>…</li></ul>` |
| Вопрос-ответ | `<details class="bui-faq"><summary>Вопрос?</summary><p>Ответ.</p></details>` |
| Галерея | `<div class="bui-gallery"><img data-photo="…">…</div>` (клик — фото крупно) |
| Блок действия | `<div class="bui-cta"><h2>…</h2><div data-timer="2026-12-31T23:59"></div><p>…</p><button class="bui-btn bui-btn-light bui-btn-big" data-open="order">…</button></div>` |
| Карта | `<div data-map="Москва, Тверская улица, 1" data-label="Мы здесь"></div>` |
| Контакты | `<div class="bui-contacts"><a class="bui-contact" href="tel:+79001234567"><span>📞</span><span><small>Телефон</small><b>+7 (900) 123-45-67</b></span></a>…</div>` |
| Соцсети | `<div class="bui-socials"><a class="bui-social bui-vk" href="https://vk.com/" data-tip="ВКонтакте">VK</a><a class="bui-social bui-max" href="https://max.ru/" data-tip="MAX">MAX</a></div>` (ещё `bui-tg`, `bui-yt`) |
| Форма | `<form class="bui-form" data-thanks="Спасибо!"><div class="bui-field"><input name="name" required><label>Имя</label></div><div class="bui-field"><input name="phone" type="tel" required><label>Телефон</label></div><button class="bui-btn bui-btn-wide">Отправить</button></form>` |

Кнопки: `bui-btn` + `bui-btn-ghost` / `bui-btn-light` / `bui-btn-small` / `bui-btn-big` / `bui-btn-wide`. Значки: `bui-badge`, `bui-tag`, `bui-sticker`, `bui-label`. Текст: `bui-muted`, `bui-center`.

## 6. Поведение — атрибуты (работают в обоих режимах)

| Атрибут | Что делает |
|---|---|
| `data-open="order"` | открывает окно с этим id. Окно `order` (имя, телефон, выбор товара) **BlockUI создаёт сам**, если его нет |
| `data-pick="Маргарита"` | вместе с `data-open` — сразу выбирает пункт в списке окна |
| `data-add="Маргарита" data-price="490"` | кладёт товар в корзину; в шапке сама появится корзина 🛒 со счётчиком |
| `data-cart-count`, `data-cart-total` | показывают число товаров и сумму |
| `data-close` | закрывает окно (ещё: клик по фону, Esc) |
| `data-name` | сюда подставится `name` из настроек |
| `data-photo="тема"` | фото по теме |
| `data-count="500" data-suffix="+"` | число досчитывает от 0 при прокрутке |
| `data-timer="2026-12-31T23:59"` | таймер до даты |
| `data-year` | текущий год |
| `data-theme-toggle` | кнопка «тёмная тема» |
| `data-reveal` | блок плавно появляется при прокрутке (у `bui-section` — само) |
| `data-icon="mdi:pizza"` | иконка [Iconify](https://icon-sets.iconify.design): 200 000+ иконок (наборы mdi, ph, tabler, lucide, fa6-solid…). Внутри `bui-icon` красится главным цветом |
| `<div class="bui-slider" data-per-view="3">` | слайдер Swiper из любых карточек: листается сам, точки и стрелки; `data-autoplay="0"` — без автопрокрутки |
| `data-map="Москва, Тверская 1"` | карта OpenStreetMap с меткой; можно координатами `"55.7558, 37.6173"`; `data-label` — подпись, `data-zoom` — приближение |
| `data-avatar="Анна"` | аватар DiceBear по имени (одно имя — всегда одно лицо); `data-avatar-style="notionists"` — другой стиль |
| `form.bui-form` или `form[data-form]` | проверка: `required`, `type="tel"` (10+ цифр), `type="email"`; потом сообщение `thanks`, салют, форма очищается. Никуда не отправляется — сайт учебный |

Из JS: `BlockUI.toast('Текст')`, `BlockUI.confetti()`, `BlockUI.open('order', 'Маргарита')`, `BlockUI.close()`, `BlockUI.addToCart('Пицца', 490)`, `BlockUI.photo('пицца', 0)` — адрес фото, `BlockUI.avatar('Анна')` — адрес аватара.

Примеры:
```html
<div class="bui-feature"><div class="bui-icon" data-icon="mdi:truck-fast"></div><h3>Быстрая доставка</h3><p>…</p></div>
<div class="bui-slider" data-per-view="3">
  <div class="bui-review"><div class="bui-stars">★★★★★</div><blockquote>…</blockquote><div class="bui-author"><img data-avatar="Анна"><span>Анна<small>гость</small></span></div></div>
  … ещё отзывы …
</div>
<div data-map="Москва, Тверская улица, 1" data-label="Мы здесь!"></div>
```
Иконки, слайдер и карта подключают свои библиотеки сами, только если они есть на странице.

## 7. Режим Tailwind + daisyUI

Пиши разметку классами Tailwind и компонентами daisyUI (`navbar`, `hero`, `hero-overlay`, `hero-content`, `btn btn-primary`, `card`, `card-body`, `badge`, `stats`, `stat`, `collapse`, `modal`, `input`, `select`…). Атрибуты из раздела 6 работают так же. Окно — `<dialog id="order" class="modal">` с формой `<form data-form>`; кнопка `data-open="order"` откроет его.

```html
<section class="hero min-h-[70vh]" data-photo="йога">
  <div class="hero-overlay bg-black/50"></div>
  <div class="hero-content text-center text-white">
    <div class="max-w-xl">
      <h1 class="text-5xl font-bold mb-5" data-name>Лотос</h1>
      <button class="btn btn-primary btn-lg" data-open="order">Записаться</button>
    </div>
  </div>
</section>
<div class="card bg-base-100 shadow-xl">
  <figure><img data-photo="йога" class="h-56 w-full object-cover"></figure>
  <div class="card-body"><h3 class="card-title">Хатха-йога</h3><p>…</p>
    <div class="card-actions justify-end"><button class="btn btn-primary" data-open="order" data-pick="Хатха-йога">Записаться</button></div></div>
</div>
<dialog id="order" class="modal">
  <div class="modal-box">
    <h3 class="text-2xl font-bold mb-4">Запись</h3>
    <form data-form class="flex flex-col gap-3">
      <input name="name" required class="input w-full" placeholder="Имя">
      <input name="phone" type="tel" required class="input w-full" placeholder="Телефон">
      <select name="item" class="select w-full"><option>Хатха-йога</option></select>
      <button class="btn btn-primary">Отправить</button>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop"><button>Закрыть</button></form>
</dialog>
```
```js
BlockUI.start({ name: 'Лотос', tailwind: true, theme: 'emerald', darkTheme: 'night', thanks: 'Вы записаны!' });
```
Цвет кнопок `btn-primary` задаёт тема; `color: 'синий'` в настройках перекрасит его.

## Примеры (каждый — 3 файла)

https://github.com/si0683/BlockUI/tree/main/examples — `coffee` (кофейня: товары, корзина, слайдер отзывов с аватарами, иконки, карта), `robots` (школа: фото на фоне, цифры, шаги, тарифы, команда, таймер, форма), `pets` (приют: галерея, карточки питомцев, дождь из эмодзи), `yoga` (режим Tailwind + daisyUI).

## Правила

- Обязательные блоки сайта: главный экран, о нас, преимущества, товары/услуги, блок с кнопкой действия, контакты (телефон, почта, адрес, ВК и MAX).
- Текста мало, цвета задаёт `color`, картинки — `data-photo`. Не пиши свои меню, окна, корзины, анимации — они уже есть.
- Комментарии в коде — на русском. В начале JS — объект `LAB` с настройками для детей, потом `BlockUI.start(LAB)`.
