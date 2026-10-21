# 🧱 BlockUI

Блоки для красивых сайтов: подключил двумя строками — и у сайта уже есть стиль и цвет, фото по теме, меню для телефона, тёмная тема, корзина, окно заказа, проверка форм, сообщения, салют, счётчики, таймер акции, галерея и плавное появление блоков.

Сделан для уроков программирования с детьми: сайт по описанию собирает нейросеть (Qwen, ChatGPT, GigaChat…), и получается ровно **3 файла — HTML, CSS, JS**, которые вставляются в CodePen.

**Примеры:** [Кофейня «Зерно»](https://si0683.github.io/BlockUI/examples/coffee/) · [Школа «РобоКод»](https://si0683.github.io/BlockUI/examples/robots/) · [Приют «Лапки»](https://si0683.github.io/BlockUI/examples/pets/) · [Студия йоги «Лотос»](https://si0683.github.io/BlockUI/examples/yoga/) (Tailwind + daisyUI)

## 🚀 Быстрый старт с нейросетью

Готовый шаблон промта — **[PROMPT.md](PROMPT.md)**: поменяйте строки «МОЙ САЙТ» (тема, название, стиль, цвет, кнопка) и отправьте в Qwen, ChatGPT или GigaChat — получите сайт в 3 файлах для CodePen.

## Подключение

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/si0683/BlockUI@1.0.0/blockui.css">
<script src="https://cdn.jsdelivr.net/gh/si0683/BlockUI@1.0.0/blockui.js"></script>
```

```js
BlockUI.start({ name: 'Маргарита', style: 'уютный', color: 'красный', rain: '🍕' });
```

## Что внутри

- **5 стилей** (простой, яркий, тёмный, современный, уютный) и **11 цветов** — одной строкой; свои шрифты, тени и формы у каждого стиля.
- **Блоки:** главный экран (3 вида), текст с фото, преимущества, карточки, товары, тарифы, отзывы, команда, шаги, цифры, вопросы, галерея, блок действия с таймером, контакты, соцсети ВК/MAX/Telegram/YouTube, формы.
- **Фото по слову:** `<img data-photo="пицца">` — 68 тем, 270 бесплатных фото Unsplash, поиск по русским словам в любой форме.
- **Поведение атрибутами:** `data-open`, `data-add`, `data-count`, `data-timer`, `data-theme-toggle`… — окно заказа и корзина создаются сами.
- **Режим Tailwind + daisyUI:** любой дизайн классами Tailwind и компонентами daisyUI, поведение — всё равно BlockUI.

Полный справочник — [AI.md](AI.md) (написан так, чтобы его понимали нейросети).

## Для разработчиков

```
blockui.js / blockui.css — библиотека (версия в blockui.js: VERSION)
examples/<сайт>/         — примеры: index.html, style.css, script.js, codepen.html
AI.md                    — справочник для нейросетей
tools/photos.json        — фото Unsplash по темам (собраны с unsplash.com, бесплатная лицензия)
tools/build.py           — вписывает фото в blockui.js и темы в AI.md, собирает codepen.html примеров
```

Новая версия: поменять `VERSION`, ссылки `@1.0.0` в AI.md/README/примерах, `python tools/build.py`, коммит и тег `vX.Y.Z`. Вышедшие версии не менять: на них опираются уроки.
