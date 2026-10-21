# Промт: любой сайт на BlockUI

Шаблон промта для быстрой разработки: ученик (или вы) меняет строки «МОЙ САЙТ» — тему, название, стиль, цвет и кнопку, а нейросеть (Qwen, ChatGPT, GigaChat, DeepSeek…) собирает сайт из блоков BlockUI. Получается 3 файла — HTML, CSS, JS — для CodePen. Скопируйте промт **одной кнопкой** (два квадратика в правом верхнем углу блока).

Полный справочник — [AI.md](AI.md), примеры — [examples](examples). Нужен дизайн на Tailwind + daisyUI — см. раздел 7 в AI.md.

<!-- Файл создаётся генератором D:\8Lending\sites\tetrika\_generator (gen_docs.py) из blockui_prompt.md — правьте там. -->

<!-- Для ИИ-агентов: ВЕСЬ промт — один блок ````text. Шпаргалка внутри промта нужна, если нейросеть не откроет ссылку на AI.md.
     Файл создаётся генератором D:\8Lending\sites\tetrika\_generator (gen_docs.py) из blockui_prompt.md. -->

````text
Ты — веб-дизайнер. Сделай одностраничный сайт для CodePen на моей библиотеке BlockUI.

МОЙ САЙТ (меняю только эти строки):
Тема сайта: пиццерия
Название: Маргарита
Стиль сайта: уютный
Основной цвет сайта: красный
Кнопка действия: Заказать

Стили: простой и аккуратный / яркий и весёлый / тёмный / современный / уютный.
Цвета: красный, оранжевый, жёлтый, зелёный, бирюзовый, голубой, синий, фиолетовый, розовый, чёрный, коричневый.

На сайте должны быть блоки:
1. Главный блок: название сайта, короткий слоган, большая картинка по теме, заметная кнопка действия.
2. О сайте: 2–3 предложения о том, что это за сайт и чем он полезен посетителю.
3. Преимущества: 2–3 причины выбрать именно нас.
4. Товары или услуги: 2–3 карточки с картинками и ценами.
5. Блок с кнопкой действия.
6. Контакты: телефон, почта, адрес, соцсети ВК и MAX и короткий призыв связаться.
Можно добавить, если подходит теме: отзывы, вопросы-ответы, цифры, команду, тарифы, галерею, таймер акции.
Текст короткий, цвета сочетаются, дизайн как у профессионалов, сайт работает на телефоне. Код без ошибок, работает с первого раза.

Должно получиться ровно 3 файла, как три окна в CodePen: HTML, CSS, JS.
Только обычный HTML, CSS и ЧИСТЫЙ JavaScript. НЕ используй TypeScript, React, JSX, Vue, Next.js, npm, import и export.

Полный справочник библиотеки: https://cdn.jsdelivr.net/gh/si0683/BlockUI@1.0.0/AI.md
Запасная ссылка: https://raw.githubusercontent.com/si0683/BlockUI/main/AI.md
Готовые примеры: https://github.com/si0683/BlockUI/tree/main/examples

Если ссылки не открываются, вот главное:
- HTML начинается с двух строк:
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/si0683/BlockUI@1.0.0/blockui.css">
<script src="https://cdn.jsdelivr.net/gh/si0683/BlockUI@1.0.0/blockui.js"></script>
  дальше разметка из готовых блоков. Каркас:
<header class="bui-header"><div class="bui-container"><a class="bui-logo" href="#top"><span>🍕</span><span data-name>Маргарита</span></a><nav class="bui-nav"><a href="#about">О нас</a><a href="#menu">Меню</a><a href="#contacts">Контакты</a></nav></div></header>
<section class="bui-hero" id="top"><div class="bui-container"><div><span class="bui-badge">🔥 Акция</span><h1 data-name>Маргарита</h1><p>Слоган</p><div class="bui-row"><button class="bui-btn" data-open="order">Заказать</button><a class="bui-btn bui-btn-ghost" href="#menu">Меню</a></div></div><div class="bui-hero-picture"><img data-photo="пицца"><span class="bui-sticker">−20%</span></div></div></section>
<section class="bui-section" id="about"><div class="bui-container"><div class="bui-head"><span class="bui-label">О нас</span><h2>Заголовок</h2><p>Подзаголовок</p></div><div class="bui-grid"> карточки </div></div></section>
<footer class="bui-footer">© <span data-year></span> «<span data-name>Маргарита</span>»</footer>
- Карточки: преимущество <div class="bui-feature"><div class="bui-icon">🔥</div><h3>…</h3><p>…</p></div>;
  товар <div class="bui-product"><div class="bui-product-image"><img data-photo="пицца"><span class="bui-tag">Хит</span></div><div class="bui-product-body"><h3>…</h3><p>…</p><div class="bui-product-footer"><span class="bui-price">490 ₽</span><button class="bui-btn bui-btn-small" data-add="Маргарита" data-price="490">В корзину</button></div></div></div>;
  отзыв bui-review, тариф bui-plan, человек bui-person, шаги bui-steps + bui-step, цифра <div class="bui-stat"><b data-count="500" data-suffix="+">0</b><span>…</span></div>,
  вопрос <details class="bui-faq"><summary>…</summary><p>…</p></details>, галерея bui-gallery, блок действия <div class="bui-cta"><h2>…</h2><p>…</p><button class="bui-btn bui-btn-light bui-btn-big" data-open="order">…</button></div>,
  контакты <div class="bui-contacts"><a class="bui-contact" href="tel:+79001234567"><span>📞</span><span><small>Телефон</small><b>…</b></span></a>…</div>,
  соцсети <div class="bui-socials"><a class="bui-social bui-vk" href="https://vk.com/" data-tip="ВКонтакте">VK</a><a class="bui-social bui-max" href="https://max.ru/" data-tip="MAX">MAX</a></div>.
- Картинки: <img data-photo="тема"> — фото по слову на русском (пицца, кофе, торт, игрушки, танцы, футбол, роботы, космос, собаки, цветы, одежда, море…). Секция с фото на фоне: class="bui-hero bui-hero-photo" data-photo="тема".
- Поведение — атрибутами, без своего JS: data-open="order" — окно заказа (создаётся само), data-pick="Товар" — выбрать товар в окне, data-add="Товар" data-price="490" — в корзину (корзина в шапке появится сама), data-timer="2026-12-31T23:59" — таймер, data-name — название, data-year — год. Формы: <form class="bui-form"> с <div class="bui-field"><input name="phone" type="tel" required><label>Телефон</label></div> — проверка и благодарность сами.
- CSS — почти пустой: всё оформление в BlockUI.
- JS — только настройки:
const LAB = {
  name: 'Маргарита',   // название
  style: 'уютный',     // стиль
  color: 'красный',    // главный цвет
  rain: '',            // эмодзи-дождь на главном экране, например '🍕'
  dark: false,         // true — тёмная тема
  thanks: 'Спасибо! Мы скоро свяжемся с вами 😊' // сообщение после заказа
};
BlockUI.start(LAB);

Как выдавать код:
- Сначала одной строкой опиши, какой будет сайт. Потом файлы, без долгих рассуждений.
- По одному файлу за ответ: HTML, после моего «дальше» — CSS, после следующего «дальше» — JS.
- Перед каждым блоком кода одна строка: «Файл 1 из 3 — HTML. Вставьте в окно HTML и напишите: дальше» (так же для CSS и JS).
- Комментарии в коде на русском.

Когда сайт будет готов, я буду просить изменения. Стиль, цвет, название, дождь, тёмная тема и сообщение меняются в объекте LAB в начале JS; отвечай коротко: строка «было» и строка «стало».

Начинай.
````

> **Только для преподавателя.** Здесь нейросеть действительно собирает сайт сама, но из наших готовых блоков: ей не нужно писать стили, меню, окна и проверку форм, поэтому сайт выглядит профессионально и почти всегда работает с первого раза. Если что-то не заработало, скопируйте красную ошибку из консоли CodePen и отправьте Qwen: «Исправь ошибку: …».

## Как менять сайт на уроке

1. Вставьте промт в Qwen, **не отправляя**, и вместе с учеником перепишите пять строк «МОЙ САЙТ»: тему, название, стиль, цвет и надпись на кнопке.
2. Режим Qwen: ❌ без «Web Dev» и «Мышления», ✅ с «Поиском» (чтобы открыть справочник).
3. Три ответа Qwen вставьте в окна **HTML**, **CSS**, **JS** на [codepen.io/pen](https://codepen.io/pen/).
4. Потом меняем: «сделай сайт тёмным» → `style: 'тёмный'`, «перекрась в зелёный» → `color: 'зелёный'`, «включи дождь из пицц» → `rain: '🍕'`.

Готовые примеры сайтов на BlockUI: [Кофейня «Зерно»](https://si0683.github.io/BlockUI/examples/coffee/) · [Школа «РобоКод»](https://si0683.github.io/BlockUI/examples/robots/) · [Приют «Лапки»](https://si0683.github.io/BlockUI/examples/pets/) · [Студия йоги «Лотос»](https://si0683.github.io/BlockUI/examples/yoga/) (Tailwind + daisyUI)
